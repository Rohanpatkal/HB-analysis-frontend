// app/data/getPeriodData.js
// ===========================================================================
// ANALYTICS DATA LAYER
// ===========================================================================
//
// Transforms the backend analytics response into the shape each dashboard
// component consumes. Nothing is generated here — every value is derived from
// the API response passed in as `raw`.
//
// Data flow:  Backend API  ->  raw response  ->  transformation  ->  components
//
// Day status:
//   "green"  = smoke-free day
//   "yellow" = reduced / affected day
//   "red"    = smoked day
//
// Rule: a smoked (red) day marks the next AFFECTED_DAYS days as "yellow"; a
// leftover window carries into the following month.
//
// Per-day numbers:  count = cigarettes,  hbCount = HB events.
// "gap" = a run of consecutive smoke-free days.
//
// Expected `raw` shape (analytics payload):
//   raw.data[year][`MM-YYYY`] = [ { day, count, hbCount }, ... ]
// A pre-normalized shape is also accepted:
//   raw.calendar  = { "YYYY-MM-DD": "green" | "yellow" | "red" }
//   raw.dayCounts = { "YYYY-MM-DD": { count, hbCount } }
// ===========================================================================

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const COST_PER_SMOKING_DAY = 180; // ₹ saved for each smoke-free day
const AFFECTED_DAYS = 4;          // a red day marks the next N days yellow

// ---------------------------------------------------------------------------
// Small utilities
// ---------------------------------------------------------------------------

const inr = (n) => `₹${n.toLocaleString("en-IN")}`;

// "YYYY-MM-DD" for a given day (month is 0-based).
function isoFor(year, month, day) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function daysIn(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

function previousPeriod(month, year) {
  return month === 0
    ? { month: 11, year: year - 1 }
    : { month: month - 1, year };
}

// ---------------------------------------------------------------------------
// Reading the API response
// ---------------------------------------------------------------------------

// Rows for a specific month from the analytics payload (null-safe -> []).
function monthRows(raw, month, year) {
  const key = `${String(month + 1).padStart(2, "0")}-${year}`;
  const rows = raw?.data?.[String(year)]?.[key];
  return Array.isArray(rows) ? rows : [];
}

// How many yellow days carry into `month` from the previous month's last
// smoked day.
function carryOverFromApi(raw, month, year) {
  const prev = previousPeriod(month, year);
  const rows = monthRows(raw, prev.month, prev.year);
  if (rows.length === 0) return 0;

  const prevDays = daysIn(prev.month, prev.year);
  let lastSmokedDay = 0;
  for (const row of rows) {
    const day = Number(row.day);
    const count = Number(row.count) || 0;
    if (Number.isInteger(day) && day >= 1 && day <= prevDays && count > 0) {
      lastSmokedDay = Math.max(lastSmokedDay, day);
    }
  }
  if (lastSmokedDay === 0) return 0;
  return Math.max(0, AFFECTED_DAYS - (prevDays - lastSmokedDay));
}

// Build { statuses, calendar, dayCounts } for a month from the API payload.
// Days after today are always marked "future" and excluded from calculations.
function getMonthFromApi(raw, month, year) {
  const daysInMonth = daysIn(month, year);
  const rows = monthRows(raw, month, year);

  // Compute today's ISO string once for cutoff comparisons.
  const t = new Date();
  const todayISO = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;

  // Map day -> { count, hbCount }, future days default to zero.
  const dayCounts = {};
  const countByDay = {};
  for (let day = 1; day <= daysInMonth; day++) {
    dayCounts[isoFor(year, month, day)] = { count: 0, hbCount: 0 };
    countByDay[day] = 0;
  }

  for (const row of rows) {
    const day = Number(row.day);
    if (!Number.isInteger(day) || day < 1 || day > daysInMonth) continue;
    if (isoFor(year, month, day) > todayISO) continue; // skip future rows
    const count = Number(row.count) || 0;
    countByDay[day] = count;
    dayCounts[isoFor(year, month, day)] = {
      count,
      hbCount: Number(row.hbCount) || 0,
    };
  }

  // Derive statuses: a smoked day is red and opens a yellow window.
  // Future days receive "future" — not included in analysis.
  const statuses = new Array(daysInMonth);
  const calendar = {};
  let yellowUntil = carryOverFromApi(raw, month, year);
  for (let day = 1; day <= daysInMonth; day++) {
    const iso = isoFor(year, month, day);
    let status;
    if (iso > todayISO) {
      status = "future";
    } else if (countByDay[day] > 0) {
      status = "red";
      yellowUntil = day + AFFECTED_DAYS;
    } else {
      status = day <= yellowUntil ? "yellow" : "green";
    }
    statuses[day - 1] = status;
    calendar[iso] = status;
  }

  return { statuses, calendar, dayCounts };
}

// Read statuses from a normalized calendar map: { "YYYY-MM-DD": "green" }.
function statusesFromCalendar(map, month, year, daysInMonth) {
  const statuses = new Array(daysInMonth).fill("green");
  for (let day = 1; day <= daysInMonth; day++) {
    const s = map[isoFor(year, month, day)];
    if (s === "green" || s === "yellow" || s === "red") {
      statuses[day - 1] = s;
    }
  }
  return statuses;
}

// Per-day counts from a normalized dayCounts map; missing days -> zero.
function dayCountsFromMap(month, year, daysInMonth, source) {
  const dayCounts = {};
  for (let day = 1; day <= daysInMonth; day++) {
    const iso = isoFor(year, month, day);
    dayCounts[iso] = source?.[iso] ?? { count: 0, hbCount: 0 };
  }
  return dayCounts;
}

// Resolve statuses + calendar + counts for a month from either input shape.
function resolveMonth(raw, month, year) {
  const daysInMonth = daysIn(month, year);

  if (raw?.calendar) {
    const statuses = statusesFromCalendar(raw.calendar, month, year, daysInMonth);
    const calendar = {};
    for (let day = 1; day <= daysInMonth; day++) {
      calendar[isoFor(year, month, day)] = statuses[day - 1];
    }
    const dayCounts = dayCountsFromMap(month, year, daysInMonth, raw.dayCounts);
    return { statuses, calendar, dayCounts };
  }

  return getMonthFromApi(raw, month, year);
}

// ---------------------------------------------------------------------------
// Numeric analysis
// ---------------------------------------------------------------------------

// Lengths of every run of consecutive smoke-free (green) days.
function smokeFreeRuns(statuses) {
  const runs = [];
  let run = 0;
  for (const s of statuses) {
    if (s === "green") {
      run++;
    } else if (run > 0) {
      runs.push(run);
      run = 0;
    }
  }
  if (run > 0) runs.push(run);
  return runs;
}

// All the stats derived from a month's statuses.
// "future" statuses are excluded — only past and today count.
function analyze(statuses, daysInMonth) {
  const pastStatuses = statuses.filter((s) => s !== "future");
  const pastDays = pastStatuses.length || daysInMonth; // fallback for months fully in the past

  const smokeFreeDays = pastStatuses.filter((s) => s === "green").length;
  const reducedDays   = pastStatuses.filter((s) => s === "yellow").length;
  const smokingDays   = pastStatuses.filter((s) => s === "red").length;

  const runs = smokeFreeRuns(pastStatuses);
  const maxGap = runs.length ? Math.max(...runs) : 0; // longest smoke-free run
  const minGap = runs.length ? Math.min(...runs) : 0; // shortest smoke-free run

  // Current streak = trailing run of green days (past days only).
  let currentStreak = 0;
  for (let i = pastStatuses.length - 1; i >= 0; i--) {
    if (pastStatuses[i] === "green") currentStreak++;
    else break;
  }

  const moneySaved = smokeFreeDays * COST_PER_SMOKING_DAY;
  const recoveryScore = pastDays
    ? Math.round((smokeFreeDays / pastDays) * 100)
    : 0;

  return {
    smokeFreeDays,
    reducedDays,
    smokingDays,
    maxGap,
    minGap,
    currentStreak,
    moneySaved,
    recoveryScore,
    longestStreak: maxGap,
  };
}

// ---------------------------------------------------------------------------
// Shape the data for each component
// ---------------------------------------------------------------------------

function buildSummary(stats, totalCount) {
  const { currentStreak, longestStreak, smokeFreeDays, reducedDays, smokingDays, moneySaved, recoveryScore } = stats;
  return [
    { title: "Current Streak", value: `${currentStreak} Days`, icon: "🔥", color: "#22c55e" },
    { title: "Longest Streak", value: `${longestStreak} Days`, icon: "🏆", color: "#f59e0b" },
    { title: "Smoke-Free Days", value: `${smokeFreeDays}`, icon: "🚭", color: "#2563eb" },
    { title: "Reduced Days", value: `${reducedDays}`, icon: "🟡", color: "#fbbf24" },
    { title: "Smoking Days", value: `${smokingDays}`, icon: "🚬", color: "#ef4444" },
    { title: "Total Count", value: `${totalCount}`, icon: "📊", color: "#0ea5e9" },
    { title: "Money Saved", value: inr(moneySaved), icon: "💰", color: "#10b981" },
    { title: "Recovery Score", value: `${recoveryScore}%`, icon: "❤️", color: "#ec4899" },
  ];
}

function buildHighlights(stats) {
  const { longestStreak, moneySaved, smokeFreeDays, recoveryScore, currentStreak } = stats;
  return {
    level: Math.max(1, Math.round(recoveryScore / 8)),
    nextBadgePercent: Math.min(99, recoveryScore + (smokeFreeDays % 12)),
    daysRemaining: Math.max(0, 30 - currentStreak),
    stats: [
      { key: "streak", value: `${longestStreak}`, label: "Best Streak", color: "#f97316" },
      { key: "money", value: inr(moneySaved), label: "Money Saved", color: "#16a34a" },
      { key: "free", value: `${smokeFreeDays}`, label: "Smoke-Free", color: "#2563eb" },
      { key: "recovery", value: `${recoveryScore}%`, label: "Recovery", color: "#ec4899" },
    ],
  };
}

function buildAchievements(stats, daysInMonth) {
  const { longestStreak, moneySaved, smokeFreeDays, recoveryScore } = stats;
  return [
    { title: "Longest Streak", value: `${longestStreak} Days`, icon: "🔥", variant: "orange", progress: Math.min(100, longestStreak * 4) },
    { title: "Money Saved", value: inr(moneySaved), icon: "💰", variant: "green", progress: Math.min(100, Math.round(moneySaved / 60)) },
    { title: "Smoke-Free Days", value: `${smokeFreeDays}`, icon: "📅", variant: "blue", progress: daysInMonth ? Math.round((smokeFreeDays / daysInMonth) * 100) : 0 },
    { title: "Recovery Score", value: `${recoveryScore}%`, icon: "🏆", variant: "gold", progress: recoveryScore },
  ];
}

// ---------------------------------------------------------------------------
// PUBLIC API
// ---------------------------------------------------------------------------

// Everything for a single month, transformed from the API response `raw`.
export function getPeriodData(month, year, raw = null) {
  const daysInMonth = daysIn(month, year);

  // 1. Resolve day statuses + calendar + counts from the API response.
  const { statuses, calendar, dayCounts } = resolveMonth(raw, month, year);

  // 2. Total cigarettes across the month.
  const totalCount = Object.values(dayCounts).reduce(
    (sum, d) => sum + (Number(d.count) || 0),
    0
  );

  // 3. Numeric analysis for this month.
  const stats = analyze(statuses, daysInMonth);

  // 4. Improvement vs the previous month's recovery score.
  const prev = previousPeriod(month, year);
  const prevDays = daysIn(prev.month, prev.year);
  const prevRecovery = analyze(
    resolveMonth(raw, prev.month, prev.year).statuses,
    prevDays
  ).recoveryScore;
  const recoveryImprovement = stats.recoveryScore - prevRecovery;

  // 5. Return one shaped object for all components.
  return {
    period: { month, year, monthName: `${MONTHS[month]} ${year}` },

    // ContributionCalendar
    calendar,
    dayCounts,

    // MonthSummary
    summary: buildSummary(stats, totalCount),

    // RecoveryHighlights
    highlights: buildHighlights(stats),

    // Achievements
    achievements: buildAchievements(stats, daysInMonth),

    // Details panel (monthly breakdown)
    details: {
      totalDays: daysInMonth,
      smokeFreeDays: stats.smokeFreeDays,
      reducedDays: stats.reducedDays,
      smokingDays: stats.smokingDays,
      maxGap: stats.maxGap,
      minGap: stats.minGap,
      currentStreak: stats.currentStreak,
      longestStreak: stats.longestStreak,
      moneySaved: stats.moneySaved,
      recoveryScore: stats.recoveryScore,
      recoveryImprovement,
    },
  };
}

// Aggregated stats across all 12 months of a year, transformed from `raw`.
export function getYearData(year, raw = null) {
  const months = [];
  for (let m = 0; m < 12; m++) {
    const dim = daysIn(m, year);
    const stats = analyze(getMonthFromApi(raw, m, year).statuses, dim);
    months.push({ month: m, name: MONTHS_SHORT[m], daysInMonth: dim, ...stats });
  }

  const sum = (pick) => months.reduce((acc, m) => acc + pick(m), 0);
  const avg = (pick) => Math.round(sum(pick) / months.length);

  const totalMoneySaved = sum((m) => m.moneySaved);
  const positiveMinGaps = months.map((m) => m.minGap).filter((g) => g > 0);

  const bestMonth = months.reduce((b, m) => (m.smokeFreeDays > b.smokeFreeDays ? m : b));
  const toughestMonth = months.reduce((b, m) => (m.smokingDays > b.smokingDays ? m : b));

  // Trend: 2nd-half average recovery vs 1st-half average recovery.
  const firstHalf = Math.round(months.slice(0, 6).reduce((s, m) => s + m.recoveryScore, 0) / 6);
  const secondHalf = Math.round(months.slice(6).reduce((s, m) => s + m.recoveryScore, 0) / 6);

  return {
    year,
    months, // per-month breakdown for the mini chart
    totalDays: sum((m) => m.daysInMonth),
    totalSmokeFree: sum((m) => m.smokeFreeDays),
    totalReduced: sum((m) => m.reducedDays),
    totalSmoking: sum((m) => m.smokingDays),
    totalMoneySaved,
    totalMoneySavedLabel: inr(totalMoneySaved),
    longestStreak: Math.max(...months.map((m) => m.maxGap)),
    shortestGap: positiveMinGaps.length ? Math.min(...positiveMinGaps) : 0,
    avgRecovery: avg((m) => m.recoveryScore),
    bestMonth: { name: bestMonth.name, smokeFreeDays: bestMonth.smokeFreeDays },
    toughestMonth: { name: toughestMonth.name, smokingDays: toughestMonth.smokingDays },
    improvement: secondHalf - firstHalf,
  };
}
