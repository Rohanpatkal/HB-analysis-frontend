// app/utils/analytics.common.js
// ---------------------------------------------------------------------------
// Shared pure utilities used across the analytics data layer.
// No React, no side effects — these are plain JS helpers.
// ---------------------------------------------------------------------------

// Month display names (0-indexed, January = 0)
export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Business rules
export const COST_PER_SMOKING_DAY = 180; // ₹ saved for each smoke-free day
export const AFFECTED_DAYS = 4;          // a smoked day marks the next N days yellow

// Format a number as Indian rupees: 1234 → "₹1,234"
export const formatINR = (n) => `₹${n.toLocaleString("en-IN")}`;

// Build "YYYY-MM-DD" for a given day. Month is 0-based (same as JS Date).
export function isoFor(year, month, day) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

// Total days in a given month/year.
export function daysIn(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

// Return the period (month, year) immediately before the given one.
export function previousPeriod(month, year) {
  return month === 0
    ? { month: 11, year: year - 1 }
    : { month: month - 1, year };
}

// Today's date as "YYYY-MM-DD" — used as the cutoff for future days.
export function todayISO() {
  const t = new Date();
  return isoFor(t.getFullYear(), t.getMonth(), t.getDate());
}

// ---------------------------------------------------------------------------
// Core stats calculation
// ---------------------------------------------------------------------------

// Calculates the lengths of every consecutive run of smoke-free (green) days.
// Example: ["green","green","red","green"] → [2, 1]
export function smokeFreeRuns(statuses) {
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

// Derive all numeric stats from an array of day statuses.
// "future" statuses are excluded from every calculation.
export function analyze(statuses, daysInMonth) {
  const pastStatuses = statuses.filter((s) => s !== "future");

  // Use actual elapsed days so recovery % is relative to days passed, not month total.
  const pastDays = pastStatuses.length || daysInMonth;

  const smokeFreeDays = pastStatuses.filter((s) => s === "green").length;
  const reducedDays   = pastStatuses.filter((s) => s === "yellow").length;
  const smokingDays   = pastStatuses.filter((s) => s === "red").length;

  const runs   = smokeFreeRuns(pastStatuses);
  const maxGap = runs.length ? Math.max(...runs) : 0; // longest smoke-free run
  const minGap = runs.length ? Math.min(...runs) : 0; // shortest smoke-free run

  // Current streak = how many consecutive green days lead up to today.
  let currentStreak = 0;
  for (let i = pastStatuses.length - 1; i >= 0; i--) {
    if (pastStatuses[i] === "green") currentStreak++;
    else break;
  }

  const moneySaved    = smokeFreeDays * COST_PER_SMOKING_DAY;
  const recoveryScore = pastDays ? Math.round((smokeFreeDays / pastDays) * 100) : 0;

  return {
    smokeFreeDays,
    reducedDays,
    smokingDays,
    maxGap,
    minGap,
    currentStreak,
    longestStreak: maxGap,
    moneySaved,
    recoveryScore,
  };
}
