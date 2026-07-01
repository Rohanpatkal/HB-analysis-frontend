// app/data/getPeriodData.js
//
// Single source of truth for the dashboard.
// Given a month (0-11) and year, it derives EVERY stat shown across the
// app (calendar day statuses, month summary, recovery highlights,
// achievements) so selecting a period updates all components at once.
//
// The data is deterministic per (month, year): the same period always
// produces the same numbers, while different periods differ. Swap the
// body of getPeriodData for a real API response when the backend is ready.

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Small seeded PRNG (mulberry32) so results are stable per period.
function makeRng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const COST_PER_SMOKING_DAY = 180; // ₹ saved per smoke-free day
const AFFECTED_DAYS = 4; // a red day makes the next N days yellow

// Decide the "red" (smoked) days for a given month. Deterministic per
// (month, year) so the same period always produces the same pattern.
function getRedFlags(month, year) {
  const rng = makeRng(year * 12 + month + 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const isRed = [];
  for (let i = 0; i < daysInMonth; i++) {
    isRed.push(rng() < 0.18); // ~18% smoking days
  }
  return { isRed, daysInMonth };
}

function isoFor(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
}

// Generate deterministic day statuses, including cross-month yellow
// carry-over from the previous month's red days.
function generateStatuses(month, year, daysInMonth) {
  const { isRed } = getRedFlags(month, year);

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const prev = getRedFlags(prevMonth, prevYear);

  const statuses = new Array(daysInMonth).fill("green");

  // Red days spread "yellow" to the following AFFECTED_DAYS days.
  for (let i = 0; i < daysInMonth; i++) {
    if (!isRed[i]) continue;
    statuses[i] = "red";
    for (let j = i + 1; j <= i + AFFECTED_DAYS && j < daysInMonth; j++) {
      if (!isRed[j]) statuses[j] = "yellow";
    }
  }

  // Carry over the leftover yellow window from last month's red days.
  for (let i = 0; i < prev.daysInMonth; i++) {
    if (!prev.isRed[i]) continue;
    for (let j = i + 1; j <= i + AFFECTED_DAYS; j++) {
      if (j < prev.daysInMonth) continue;
      const currIdx = j - prev.daysInMonth;
      if (currIdx >= daysInMonth) break;
      if (statuses[currIdx] !== "red") statuses[currIdx] = "yellow";
    }
  }

  return statuses;
}

// Read day statuses from a real calendar map: { "YYYY-MM-DD": "green" }.
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

// Return the lengths of every run of consecutive smoke-free (green) days.
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

// Derive the numeric stats for a month from its day statuses.
function analyze(statuses, daysInMonth) {
  const smokeFreeDays = statuses.filter((s) => s === "green").length;
  const reducedDays = statuses.filter((s) => s === "yellow").length;
  const smokingDays = statuses.filter((s) => s === "red").length;

  const runs = smokeFreeRuns(statuses);
  const maxGap = runs.length ? Math.max(...runs) : 0; // longest smoke-free run
  const minGap = runs.length ? Math.min(...runs) : 0; // shortest smoke-free run

  let currentStreak = 0;
  for (let i = statuses.length - 1; i >= 0; i--) {
    if (statuses[i] === "green") currentStreak++;
    else break;
  }

  const moneySaved = smokeFreeDays * COST_PER_SMOKING_DAY;
  const recoveryScore = daysInMonth
    ? Math.round((smokeFreeDays / daysInMonth) * 100)
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

// Master transform: pass raw API data in and get the unified shape every
// component consumes. `raw` may be a { calendar: {...} } object or a bare
// { "YYYY-MM-DD": status } map. When omitted, data is generated locally.
export function getPeriodData(month, year, raw = null) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarInput = raw?.calendar ?? raw ?? null;

  const statuses = calendarInput
    ? statusesFromCalendar(calendarInput, month, year, daysInMonth)
    : generateStatuses(month, year, daysInMonth);

  // Build the calendar map keyed by ISO date.
  const calendar = {};
  for (let day = 1; day <= daysInMonth; day++) {
    calendar[isoFor(year, month, day)] = statuses[day - 1];
  }

  // Per-day counts shown on each calendar cell. Deterministic per period.
  // `count`  = smoking events that day, `hbCount` = HB events that day.
  const countRng = makeRng((year * 12 + month + 1) * 7 + 3);
  const dayCounts = {};
  for (let day = 1; day <= daysInMonth; day++) {
    const status = statuses[day - 1];
    let count = 0;
    let hbCount = 0;

    if (status === "red") {
      count = 3 + Math.floor(countRng() * 12); // 3..14
      hbCount = 1 + Math.floor(countRng() * 4); // 1..4
    } else if (status === "yellow") {
      count = 1 + Math.floor(countRng() * 3); // 1..3
      hbCount = Math.floor(countRng() * 2); // 0..1
    }

    dayCounts[isoFor(year, month, day)] = { count, hbCount };
  }

  // Analyse the statuses.
  const {
    smokeFreeDays,
    reducedDays,
    smokingDays,
    maxGap,
    minGap,
    currentStreak,
    moneySaved,
    recoveryScore,
    longestStreak,
  } = analyze(statuses, daysInMonth);

  // Improvement vs the previous month (generated baseline).
  const prevM = month === 0 ? 11 : month - 1;
  const prevY = month === 0 ? year - 1 : year;
  const prevDays = new Date(prevY, prevM + 1, 0).getDate();
  const prevRecovery = analyze(
    generateStatuses(prevM, prevY, prevDays),
    prevDays
  ).recoveryScore;
  const recoveryImprovement = recoveryScore - prevRecovery;

  const level = Math.max(1, Math.round(recoveryScore / 8));
  const nextBadgePercent = Math.min(99, recoveryScore + (smokeFreeDays % 12));
  const daysRemaining = Math.max(0, 30 - currentStreak);

  const monthName = `${MONTHS[month]} ${year}`;

  const inr = (n) => `₹${n.toLocaleString("en-IN")}`;

  return {
    period: { month, year, monthName },

    // For ContributionCalendar
    calendar,
    dayCounts,

    // For MonthSummary
    summary: [
      { title: "Current Streak", value: `${currentStreak} Days`, icon: "🔥", color: "#22c55e" },
      { title: "Longest Streak", value: `${longestStreak} Days`, icon: "🏆", color: "#f59e0b" },
      { title: "Smoke-Free Days", value: `${smokeFreeDays}`, icon: "🚭", color: "#2563eb" },
      { title: "Smoking Days", value: `${smokingDays}`, icon: "🚬", color: "#ef4444" },
      { title: "Money Saved", value: inr(moneySaved), icon: "💰", color: "#10b981" },
      { title: "Recovery Score", value: `${recoveryScore}%`, icon: "❤️", color: "#ec4899" },
    ],

    // For RecoveryHighlights
    highlights: {
      level,
      nextBadgePercent,
      daysRemaining,
      stats: [
        { key: "streak", value: `${longestStreak}`, label: "Best Streak", color: "#f97316" },
        { key: "money", value: inr(moneySaved), label: "Money Saved", color: "#16a34a" },
        { key: "free", value: `${smokeFreeDays}`, label: "Smoke-Free", color: "#2563eb" },
        { key: "recovery", value: `${recoveryScore}%`, label: "Recovery", color: "#ec4899" },
      ],
    },

    // For Achievements
    achievements: [
      { title: "Longest Streak", value: `${longestStreak} Days`, icon: "🔥", variant: "orange", progress: Math.min(100, longestStreak * 4) },
      { title: "Money Saved", value: inr(moneySaved), icon: "💰", variant: "green", progress: Math.min(100, Math.round(moneySaved / 60)) },
      { title: "Smoke-Free Days", value: `${smokeFreeDays}`, icon: "📅", variant: "blue", progress: Math.round((smokeFreeDays / daysInMonth) * 100) },
      { title: "Recovery Score", value: `${recoveryScore}%`, icon: "🏆", variant: "gold", progress: recoveryScore },
    ],

    // For the Details panel (monthly breakdown).
    details: {
      totalDays: daysInMonth,
      smokeFreeDays,
      reducedDays,
      smokingDays,
      maxGap,
      minGap,
      currentStreak,
      longestStreak,
      moneySaved,
      recoveryScore,
      recoveryImprovement,
    },
  };
}

const MS_MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Yearly aggregation across all 12 months of the given year.
export function getYearData(year) {
  const inr = (n) => `₹${n.toLocaleString("en-IN")}`;

  const months = [];
  for (let m = 0; m < 12; m++) {
    const daysInMonth = new Date(year, m + 1, 0).getDate();
    const a = analyze(generateStatuses(m, year, daysInMonth), daysInMonth);
    months.push({ month: m, name: MS_MONTHS_SHORT[m], daysInMonth, ...a });
  }

  const sum = (fn) => months.reduce((acc, x) => acc + fn(x), 0);

  const totalDays = sum((x) => x.daysInMonth);
  const totalSmokeFree = sum((x) => x.smokeFreeDays);
  const totalReduced = sum((x) => x.reducedDays);
  const totalSmoking = sum((x) => x.smokingDays);
  const totalMoneySaved = sum((x) => x.moneySaved);

  const longestStreak = Math.max(...months.map((x) => x.maxGap));
  const positiveMinGaps = months.map((x) => x.minGap).filter((g) => g > 0);
  const shortestGap = positiveMinGaps.length ? Math.min(...positiveMinGaps) : 0;

  const avgRecovery = Math.round(sum((x) => x.recoveryScore) / 12);

  const bestMonth = months.reduce((b, x) =>
    x.smokeFreeDays > b.smokeFreeDays ? x : b
  );
  const toughestMonth = months.reduce((b, x) =>
    x.smokingDays > b.smokingDays ? x : b
  );

  // Trend: 2nd-half average recovery vs 1st-half average recovery.
  const firstHalf = Math.round(
    months.slice(0, 6).reduce((s, x) => s + x.recoveryScore, 0) / 6
  );
  const secondHalf = Math.round(
    months.slice(6).reduce((s, x) => s + x.recoveryScore, 0) / 6
  );
  const improvement = secondHalf - firstHalf;

  return {
    year,
    months, // per-month breakdown for a mini chart/table
    totalDays,
    totalSmokeFree,
    totalReduced,
    totalSmoking,
    totalMoneySaved,
    totalMoneySavedLabel: inr(totalMoneySaved),
    longestStreak,
    shortestGap,
    avgRecovery,
    bestMonth: { name: bestMonth.name, smokeFreeDays: bestMonth.smokeFreeDays },
    toughestMonth: {
      name: toughestMonth.name,
      smokingDays: toughestMonth.smokingDays,
    },
    improvement,
  };
}
