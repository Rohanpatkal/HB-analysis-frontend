// app/data/getPeriodData.js
// ---------------------------------------------------------------------------
// Analytics data layer — transforms the backend API response into the exact
// shape each dashboard component consumes.
//
// Data flow:  Backend API  →  raw response  →  getPeriodData()  →  components
//
// Day statuses:
//   "green"  = smoke-free day
//   "yellow" = reduced / affected day (within AFFECTED_DAYS of a smoked day)
//   "red"    = smoked day
//   "future" = day is after today, excluded from all stats
//
// Expected raw shape from the backend:
//   raw.data[year]["MM-YYYY"] = [ { day, count, hbCount }, ... ]
//
// A pre-normalized shape is also accepted:
//   raw.calendar  = { "YYYY-MM-DD": "green" | "yellow" | "red" }
//   raw.dayCounts = { "YYYY-MM-DD": { count, hbCount } }
// ---------------------------------------------------------------------------

import {
  MONTHS,
  MONTHS_SHORT,
  AFFECTED_DAYS,
  formatINR,
  isoFor,
  daysIn,
  previousPeriod,
  analyze,
} from "../utils/analytics.common";

// ---------------------------------------------------------------------------
// Reading the raw API response
// ---------------------------------------------------------------------------

// Null-safe accessor — returns the rows array for a specific month.
function monthRows(raw, month, year) {
  const key = `${String(month + 1).padStart(2, "0")}-${year}`;
  const rows = raw?.data?.[String(year)]?.[key];
  return Array.isArray(rows) ? rows : [];
}

// How many yellow days bleed from the previous month's last smoked day
// into the start of the current month.
function carryOverDays(raw, month, year) {
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

// Build { statuses, calendar, dayCounts } from the raw analytics payload.
// Days after today are marked "future" and excluded from stats.
function buildMonthFromApi(raw, month, year) {
  const daysInMonth = daysIn(month, year);
  const rows = monthRows(raw, month, year);

  const t = new Date();
  const today = isoFor(t.getFullYear(), t.getMonth(), t.getDate());

  // Default every day to zero counts; will be overwritten by API rows below.
  const dayCounts = {};
  const countByDay = {};
  for (let day = 1; day <= daysInMonth; day++) {
    dayCounts[isoFor(year, month, day)] = { count: 0, hbCount: 0 };
    countByDay[day] = 0;
  }

  for (const row of rows) {
    const day = Number(row.day);
    if (!Number.isInteger(day) || day < 1 || day > daysInMonth) continue;
    if (isoFor(year, month, day) > today) continue; // ignore future rows
    const count = Number(row.count) || 0;
    countByDay[day] = count;
    dayCounts[isoFor(year, month, day)] = {
      count,
      hbCount: Number(row.hbCount) || 0,
    };
  }

  // Derive day statuses: smoked day = red, next AFFECTED_DAYS = yellow, rest = green.
  const statuses = new Array(daysInMonth);
  const calendar = {};
  let yellowUntil = carryOverDays(raw, month, year);

  for (let day = 1; day <= daysInMonth; day++) {
    const iso = isoFor(year, month, day);
    let status;

    if (iso > today) {
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

// Read statuses from a pre-normalized calendar map: { "YYYY-MM-DD": "green" }.
function buildStatusesFromMap(map, month, year, daysInMonth) {
  const statuses = new Array(daysInMonth).fill("green");
  for (let day = 1; day <= daysInMonth; day++) {
    const s = map[isoFor(year, month, day)];
    if (s === "green" || s === "yellow" || s === "red") {
      statuses[day - 1] = s;
    }
  }
  return statuses;
}

// Read counts from a pre-normalized dayCounts map; missing days → zero.
function buildCountsFromMap(month, year, daysInMonth, source) {
  const dayCounts = {};
  for (let day = 1; day <= daysInMonth; day++) {
    const iso = isoFor(year, month, day);
    dayCounts[iso] = source?.[iso] ?? { count: 0, hbCount: 0 };
  }
  return dayCounts;
}

// Entry point: handles both raw API shape and pre-normalized shape.
function resolveMonth(raw, month, year) {
  if (raw?.calendar) {
    const daysInMonth = daysIn(month, year);
    const statuses = buildStatusesFromMap(raw.calendar, month, year, daysInMonth);
    const calendar = {};
    for (let day = 1; day <= daysInMonth; day++) {
      calendar[isoFor(year, month, day)] = statuses[day - 1];
    }
    const dayCounts = buildCountsFromMap(month, year, daysInMonth, raw.dayCounts);
    return { statuses, calendar, dayCounts };
  }

  return buildMonthFromApi(raw, month, year);
}

// ---------------------------------------------------------------------------
// Data shaping — one function per component
// ---------------------------------------------------------------------------

function buildSummary(stats, totalCount) {
  const { currentStreak, longestStreak, smokeFreeDays, reducedDays, smokingDays, moneySaved, recoveryScore } = stats;
  return [
    { title: "Current Streak",  value: `${currentStreak} Days`, icon: "🔥", color: "#22c55e" },
    { title: "Longest Streak",  value: `${longestStreak} Days`, icon: "🏆", color: "#f59e0b" },
    { title: "Smoke-Free Days", value: `${smokeFreeDays}`,      icon: "🚭", color: "#2563eb" },
    { title: "Reduced Days",    value: `${reducedDays}`,        icon: "🟡", color: "#fbbf24" },
    { title: "Smoking Days",    value: `${smokingDays}`,        icon: "🚬", color: "#ef4444" },
    { title: "Total Count",     value: `${totalCount}`,         icon: "📊", color: "#0ea5e9" },
    { title: "Money Saved",     value: formatINR(moneySaved),   icon: "💰", color: "#10b981" },
    { title: "Recovery Score",  value: `${recoveryScore}%`,     icon: "❤️", color: "#ec4899" },
  ];
}

function buildHighlights(stats) {
  const { longestStreak, moneySaved, smokeFreeDays, recoveryScore, currentStreak } = stats;
  return {
    level:            Math.max(1, Math.round(recoveryScore / 8)),
    nextBadgePercent: Math.min(99, recoveryScore + (smokeFreeDays % 12)),
    daysRemaining:    Math.max(0, 30 - currentStreak),
    stats: [
      { key: "streak",   value: `${longestStreak}`,       label: "Best Streak",  color: "#f97316" },
      { key: "money",    value: formatINR(moneySaved),    label: "Money Saved",  color: "#16a34a" },
      { key: "free",     value: `${smokeFreeDays}`,       label: "Smoke-Free",   color: "#2563eb" },
      { key: "recovery", value: `${recoveryScore}%`,      label: "Recovery",     color: "#ec4899" },
    ],
  };
}

// ---------------------------------------------------------------------------
// Public exports
// ---------------------------------------------------------------------------

// Returns the full shaped data object for one month. Called on every period
// or API response change in DashboardProvider.
export function getPeriodData(month, year, raw = null) {
  const daysInMonth = daysIn(month, year);
  const { statuses, calendar, dayCounts } = resolveMonth(raw, month, year);

  const totalCount = Object.values(dayCounts).reduce(
    (sum, d) => sum + (Number(d.count) || 0),
    0
  );

  const stats = analyze(statuses, daysInMonth);

  // Recovery improvement = this month's score vs last month's score.
  const prev = previousPeriod(month, year);
  const prevDays = daysIn(prev.month, prev.year);
  const prevRecovery = analyze(
    resolveMonth(raw, prev.month, prev.year).statuses,
    prevDays
  ).recoveryScore;
  const recoveryImprovement = stats.recoveryScore - prevRecovery;

  return {
    period: { month, year, monthName: `${MONTHS[month]} ${year}` },

    // ContributionCalendar
    calendar,
    dayCounts,

    // MonthSummary
    summary: buildSummary(stats, totalCount),

    // RecoveryHighlights
    highlights: buildHighlights(stats),

    // Details panel — monthly breakdown
    details: {
      totalDays:    daysInMonth,
      smokeFreeDays: stats.smokeFreeDays,
      reducedDays:   stats.reducedDays,
      smokingDays:   stats.smokingDays,
      maxGap:        stats.maxGap,
      minGap:        stats.minGap,
      currentStreak: stats.currentStreak,
      longestStreak: stats.longestStreak,
      moneySaved:    stats.moneySaved,
      recoveryScore: stats.recoveryScore,
      recoveryImprovement,
    },
  };
}

// Returns aggregated stats for all 12 months of the given year.
// Called in DashboardProvider whenever the selected year changes.
export function getYearData(year, raw = null) {
  const months = [];

  for (let m = 0; m < 12; m++) {
    const dim = daysIn(m, year);
    const { statuses } = buildMonthFromApi(raw, m, year);
    const stats = analyze(statuses, dim);
    months.push({ month: m, name: MONTHS_SHORT[m], daysInMonth: dim, ...stats });
  }

  const sum = (pick) => months.reduce((acc, m) => acc + pick(m), 0);
  const avg = (pick) => Math.round(sum(pick) / months.length);

  const totalMoneySaved  = sum((m) => m.moneySaved);
  const positiveMinGaps  = months.map((m) => m.minGap).filter((g) => g > 0);
  const bestMonth        = months.reduce((b, m) => (m.smokeFreeDays > b.smokeFreeDays ? m : b));
  const toughestMonth    = months.reduce((b, m) => (m.smokingDays   > b.smokingDays   ? m : b));

  // Trend: compare 2nd-half recovery average vs 1st-half.
  const firstHalf  = Math.round(months.slice(0, 6).reduce((s, m) => s + m.recoveryScore, 0) / 6);
  const secondHalf = Math.round(months.slice(6).reduce((s, m) => s + m.recoveryScore, 0) / 6);

  return {
    year,
    months,            // per-month array used by the mini bar chart
    totalDays:         sum((m) => m.daysInMonth),
    totalSmokeFree:    sum((m) => m.smokeFreeDays),
    totalReduced:      sum((m) => m.reducedDays),
    totalSmoking:      sum((m) => m.smokingDays),
    totalMoneySaved,
    totalMoneySavedLabel: formatINR(totalMoneySaved),
    longestStreak:     Math.max(...months.map((m) => m.maxGap)),
    shortestGap:       positiveMinGaps.length ? Math.min(...positiveMinGaps) : 0,
    avgRecovery:       avg((m) => m.recoveryScore),
    bestMonth:         { name: bestMonth.name,     smokeFreeDays: bestMonth.smokeFreeDays },
    toughestMonth:     { name: toughestMonth.name, smokingDays:   toughestMonth.smokingDays },
    improvement:       secondHalf - firstHalf,
  };
}
