// lib/api-client.js
// Fetches the full analytics payload from the backend.

const BACKEND_URL = "https://hbbackend-fpvz.onrender.com/getData";

export async function fetchAnalyticsData() {
  const response = await fetch(BACKEND_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
