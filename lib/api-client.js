// lib/api-client.js
// ---------------------------------------------------------------------------
// Fetches all analytics data for a user and normalizes it into the shape
// that getPeriodData.js expects:
//
//   raw.data[year]["MM-YYYY"] = [ { day, count, breakCount, mood, notes } ]
//
// The new API returns per-year monthly data from:
//   GET /stats/:userId/monthly/:year
//
// We fetch all available years in parallel, then merge them into one object.
// ---------------------------------------------------------------------------

import { apiFetch } from "./api";

// Years to fetch — always includes the current year, covers back to 2023.
const KNOWN_YEARS = (() => {
  const current = new Date().getFullYear();
  const years = [];
  for (let y = 2023; y <= current; y++) years.push(String(y));
  return years;
})();

/**
 * Fetch all analytics data for a user.
 * Called once on dashboard mount — returns a single raw object that
 * DashboardProvider passes into getPeriodData() and getYearData().
 */
export async function fetchAnalyticsData(userId) {
  if (!userId) throw new Error("userId is required");

  // Fetch every year in parallel for speed.
  const yearResults = await Promise.allSettled(
    KNOWN_YEARS.map((year) => apiFetch(`/stats/${userId}/monthly/${year}`))
  );

  // Merge all successful year responses into one data object.
  const data = {};

  yearResults.forEach((result, index) => {
    if (result.status !== "fulfilled") return; // skip failed years gracefully

    const year = KNOWN_YEARS[index];
    const months = result.value?.data;
    if (!Array.isArray(months)) return;

    data[year] = {};

    months.forEach((monthBlock) => {
      // monthKey from API is "MM/YYYY" — convert to "MM-YYYY" for our layer.
      const key = monthBlock.monthKey?.replace("/", "-");
      if (!key) return;

      // Normalize each day row to { id, day, count, breakCount, mood, notes }.
      data[year][key] = (monthBlock.days || []).map((d) => {
        // API date is "DD/MM/YYYY" — extract just the day number.
        const dayNum = d.date ? d.date.split("/")[0] : "0";
        return {
          id:         d._id         ?? d.id ?? null,  // MongoDB _id — needed for PUT/DELETE
          day:        dayNum,
          count:      d.count      ?? 0,
          breakCount: d.breakCount ?? 0,
          mood:       d.mood       ?? "",
          // notes from the API is an array of { text, createdAt } objects.
          // Extract just the text strings and join them.
          notes: Array.isArray(d.notes)
            ? d.notes.map((n) => (typeof n === "object" ? n.text : n)).filter(Boolean).join(" • ")
            : (d.notes ?? ""),
          // Keep the raw notes array so the edit drawer can pre-fill it
          notesRaw: Array.isArray(d.notes)
            ? d.notes.map((n) => (typeof n === "object" ? n.text : n)).filter(Boolean).join("\n")
            : (d.notes ?? ""),
        };
      });
    });
  });

  return { data };
}
