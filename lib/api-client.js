// lib/api-client.js
// ---------------------------------------------------------------------------
// Fetches all analytics data for a user and normalizes it into the shape
// that getPeriodData.js expects.
//
// Data flow:
//   1. GET /stats/:userId/summary  → real years list + global stats
//   2. GET /stats/:userId/monthly/:year (parallel, only real years)
//   3. Merge into raw object:
//        raw.data[year]["MM-YYYY"] = [ { id, day, count, breakCount, mood, notes, notesRaw } ]
//        raw.summary               = { totalCount, yearMax, yearMin, monthMax, monthMin, years[] }
//        raw.yearTotals[year]      = number   (from yearTotal in each /monthly/:year response)
//        raw.monthTotals[year]["MM-YYYY"] = { count, totalDays }  (from monthBlock.count/totalDays)
// ---------------------------------------------------------------------------

import { apiFetch } from "./api";

/**
 * Fetch all analytics data for a user.
 * Called once on dashboard mount — returns a single raw object that
 * DashboardProvider passes into getPeriodData() and getYearData().
 */
export async function fetchAnalyticsData(userId) {
  if (!userId) throw new Error("userId is required");

  // ── Step 1: get real years list from backend summary ─────────────────────
  let summaryData = null;
  let yearsToFetch = [];

  try {
    const summaryRes = await apiFetch(`/stats/${userId}/summary`);
    summaryData = summaryRes?.data ?? null;
    // Use backend's sorted years list — only years that actually have data
    if (Array.isArray(summaryData?.years) && summaryData.years.length > 0) {
      yearsToFetch = summaryData.years;
    }
  } catch {
    // Summary endpoint failed (e.g. new user with no data) — fall back to current year
  }

  // If no years from summary (new user), at least fetch current year
  if (yearsToFetch.length === 0) {
    yearsToFetch = [String(new Date().getFullYear())];
  }

  // ── Step 2: fetch monthly data for every real year in parallel ────────────
  const yearResults = await Promise.allSettled(
    yearsToFetch.map((year) => apiFetch(`/stats/${userId}/monthly/${year}`))
  );

  // ── Step 3: merge into one raw object ─────────────────────────────────────
  const data       = {};   // raw.data[year]["MM-YYYY"] = days[]
  const yearTotals = {};   // raw.yearTotals[year] = yearTotal number
  const monthTotals = {};  // raw.monthTotals[year]["MM-YYYY"] = { count, totalDays }

  yearResults.forEach((result, index) => {
    if (result.status !== "fulfilled") return;

    const year   = yearsToFetch[index];
    const months = result.value?.data;
    if (!Array.isArray(months)) return;

    // Top-level yearTotal from the response
    if (result.value?.yearTotal !== undefined) {
      yearTotals[year] = result.value.yearTotal;
    }

    data[year]       = {};
    monthTotals[year] = {};

    months.forEach((monthBlock) => {
      // monthKey from API is "MM/YYYY" — convert to "MM-YYYY" for our layer.
      const key = monthBlock.monthKey?.replace("/", "-");
      if (!key) return;

      // Store pre-computed month totals from the backend
      monthTotals[year][key] = {
        count:     monthBlock.count     ?? 0,
        totalDays: monthBlock.totalDays ?? 0,
      };

      // Normalize each day row to { id, day, count, breakCount, mood, notes, notesRaw }
      data[year][key] = (monthBlock.days || []).map((d) => {
        // API date is "DD/MM/YYYY" — extract just the day number
        const dayNum = d.date ? d.date.split("/")[0] : "0";
        return {
          id:         d._id        ?? d.id ?? null, // MongoDB _id — needed for PUT/DELETE
          day:        dayNum,
          count:      d.count      ?? 0,
          breakCount: d.breakCount ?? 0,
          mood:       d.mood       ?? "",
          // notes from the API is an array of { text, createdAt } objects
          notes: Array.isArray(d.notes)
            ? d.notes.map((n) => (typeof n === "object" ? n.text : n)).filter(Boolean).join(" • ")
            : (d.notes ?? ""),
          // notesRaw: newline-joined so the edit drawer can pre-fill a textarea
          notesRaw: Array.isArray(d.notes)
            ? d.notes.map((n) => (typeof n === "object" ? n.text : n)).filter(Boolean).join("\n")
            : (d.notes ?? ""),
        };
      });
    });
  });

  return { data, summary: summaryData, yearTotals, monthTotals };
}
