// lib/api.js
// ---------------------------------------------------------------------------
// Central API client for the new backend.
// All components use apiFetch() — never call fetch() directly.
//
// Base URL comes from .env:  NEXT_PUBLIC_API_URL
// ---------------------------------------------------------------------------

// const BASE_URL =
//   process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";


const BASE_URL = "http://localhost:5000/api";

/**
 * Core fetch wrapper.
 * - Adds Content-Type header automatically.
 * - Throws a readable Error when the response is not ok.
 */
export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `API error ${res.status}`);
  }

  return data;
}

// ---------------------------------------------------------------------------
// User endpoints
// ---------------------------------------------------------------------------

/**
 * Create a new user account.
 * Returns { success, userId, token, user }
 */
export async function createUser({ name, email, password }) {
  return apiFetch("/user/createUser", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

/**
 * Sign in with email + password.
 * Returns { success, userId, token, user }
 */
export async function loginUser({ email, password }) {
  return apiFetch("/user/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// ---------------------------------------------------------------------------
// Stats endpoints (read)
// ---------------------------------------------------------------------------

/**
 * Global summary stats — total count, best year/month, available years list.
 * Used for the dashboard header and year-selector dropdown.
 */
export async function fetchSummary(userId) {
  const { data } = await apiFetch(`/stats/${userId}/summary`);
  return data;
}

/**
 * Year-wise totals for all years.
 * Used for the yearly bar chart in the Details panel.
 */
export async function fetchYearlyStats(userId) {
  const { data } = await apiFetch(`/stats/${userId}/yearly`);
  return data;
}

/**
 * All months in a given year.
 * Used when the user selects a year from the filter.
 * Returns { year, yearTotal, data: [ { monthKey, count, totalDays, days[] } ] }
 */
export async function fetchMonthlyStats(userId, year) {
  return apiFetch(`/stats/${userId}/monthly/${year}`);
}

/**
 * Single month detail — all days with count, breakCount, mood, notes.
 * Returns { month, count, totalDays, max, min, days[] }
 */
export async function fetchMonthDetail(userId, year, month) {
  // month must be zero-padded: "04" not "4"
  const mm = String(month).padStart(2, "0");
  return apiFetch(`/stats/${userId}/monthly/${year}/${mm}`);
}

// ---------------------------------------------------------------------------
// Habit log endpoint (write)
// ---------------------------------------------------------------------------

/**
 * Log a single habit entry for a user.
 *
 * payload = {
 *   date:       "2026-07-06",   // ISO date string
 *   count:      5,              // cigarettes smoked
 *   breakCount: 2,              // habit break count
 *   mood:       "😊",           // optional emoji
 *   notes:      "stressful day" // optional string
 * }
 */
export async function logHabit(userId, payload) {
  return apiFetch(`/data/log/${userId}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ---------------------------------------------------------------------------
// Text file upload
// ---------------------------------------------------------------------------

/**
 * Upload a .txt file to bulk-import habit history.
 * Uses multipart/form-data — do NOT pass Content-Type manually.
 */
export async function uploadTextFile(userId, file) {
  const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    // const BASE =  "http://localhost:5000/api";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("userId", userId);

  const res = await fetch(`${BASE}/data/textFormater`, {
    method: "POST",
    body: formData,
    cache: "no-store",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Upload failed");
  return data;
}
