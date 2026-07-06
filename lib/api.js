// lib/api.js
// ---------------------------------------------------------------------------
// Central API client for the new backend.
// All components use apiFetch() — never call fetch() directly.
//
// Base URL comes from .env:  NEXT_PUBLIC_API_URL
// ---------------------------------------------------------------------------

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
// const BASE_URL = "http://localhost:5000/api";

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
 * Add a habit log entry for a user.
 * POST /api/log/:userId
 *
 * If a log already exists for that date, the backend adds count on top (action: "updated").
 * If it's a new entry, it creates one (action: "created").
 *
 * payload = {
 *   date:       "2026-07-06",  // required — YYYY-MM-DD string
 *   count:      3,             // required — number (not string)
 *   breakCount: 1,             // optional — number, default 0
 *   mood:       "good",        // optional — string
 *   notes:      "Felt great"   // optional — string
 * }
 *
 * Returns { success, action: "created"|"updated", message, data }
 */
export async function addHabitLog(userId, payload) {
  return apiFetch(`/log/${userId}`, {
    method: "POST",
    body: JSON.stringify({
      date:       String(payload.date),         // must be YYYY-MM-DD string
      count:      Number(payload.count),        // must be a number, not a string
      breakCount: Number(payload.breakCount) || 0,
      mood:       payload.mood  || "",
      notes:      payload.notes || "",
    }),
  });
}

/**
 * Edit an existing habit log entry by its MongoDB _id.
 * PUT /api/log/:userId/:logId
 *
 * Replaces (not increments) the fields you send.
 * payload = {
 *   count:      3,         // optional
 *   breakCount: 1,         // optional
 *   mood:       "good",    // optional
 *   notes:      "Some note" // optional — replaces all existing notes
 * }
 *
 * Returns { success, message, data }
 */
export async function editHabitLog(userId, logId, payload) {
  return apiFetch(`/log/${userId}/${logId}`, {
    method: "PUT",
    body: JSON.stringify({
      count:      payload.count      !== undefined ? Number(payload.count)      : undefined,
      breakCount: payload.breakCount !== undefined ? Number(payload.breakCount) : undefined,
      mood:       payload.mood       !== undefined ? payload.mood               : undefined,
      notes:      payload.notes      !== undefined ? payload.notes              : undefined,
    }),
  });
}

/**
 * Delete a habit log entry by its MongoDB _id.
 * DELETE /api/log/:userId/:logId
 *
 * Returns { success, message, data }
 */
export async function deleteHabitLog(userId, logId) {
  return apiFetch(`/log/${userId}/${logId}`, {
    method: "DELETE",
  });
}

// ---------------------------------------------------------------------------
// Visitor tracking
// ---------------------------------------------------------------------------

/**
 * Ping the server to record this visit.
 * Called once on app load. Returns { success, isNew, total, today }
 */
export async function pingVisitor() {
  return apiFetch("/visitors/ping", { method: "POST" });
}

/**
 * Fetch current visitor counts without recording a visit.
 * Returns { success, total, today }
 */
export async function fetchVisitorCount() {
  return apiFetch("/visitors/count");
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
