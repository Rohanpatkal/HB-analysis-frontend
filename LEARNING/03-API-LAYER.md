# API Layer — How the Frontend Talks to the Backend

## Two API Files

### `lib/api.js` — Individual endpoint functions

This is the low-level API client. It contains one function per API endpoint.

**The core wrapper:**
```js
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",  // Always fetch fresh data
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `API error ${res.status}`);
  }

  return data;
}
```

**Named exports (what components import):**

| Function | Method | Endpoint | Used for |
|---|---|---|---|
| `createUser` | POST | `/user/createUser` | Register |
| `loginUser` | POST | `/user/login` | Sign in |
| `fetchSummary` | GET | `/stats/:id/summary` | All-time stats |
| `fetchMonthlyStats` | GET | `/stats/:id/monthly/:year` | Year data |
| `addHabitLog` | POST | `/log/:id` | Create/update log entry |
| `editHabitLog` | PUT | `/log/:id/:logId` | Edit existing entry |
| `deleteHabitLog` | DELETE | `/log/:id/:logId` | Delete entry |
| `pingVisitor` | POST | `/visitors/ping` | Record visit |
| `fetchVisitorCount` | GET | `/visitors/count` | Read visitor count |
| `uploadTextFile` | POST | `/data/textFormater` | Bulk import |

---

### `lib/api-client.js` — Dashboard data orchestrator

This file does one job: fetch ALL data the dashboard needs in one go.

```js
export async function fetchAnalyticsData(userId) {
  // Step 1: Get list of real years from backend
  const summaryRes = await apiFetch(`/stats/${userId}/summary`);
  const yearsToFetch = summaryRes.data.years; // e.g. ["2024", "2025", "2026"]

  // Step 2: Fetch all years IN PARALLEL (fast!)
  const yearResults = await Promise.allSettled(
    yearsToFetch.map(year => apiFetch(`/stats/${userId}/monthly/${year}`))
  );

  // Step 3: Merge into one object
  return { data, summary, yearTotals, monthTotals };
}
```

**Why `Promise.allSettled` instead of `Promise.all`?**
- `Promise.all` fails if ANY request fails
- `Promise.allSettled` returns results for ALL requests, even if some failed
- So if 2025 data fails to load, 2026 data still shows up

---

## API Response Shapes

### POST /user/login
```json
{
  "success": true,
  "userId": "64abc123...",
  "token": "eyJhbGci...",
  "user": { "name": "Rohan", "email": "r@example.com" }
}
```

### GET /stats/:userId/summary
```json
{
  "data": {
    "totalCount": 1247,
    "totalYears": 3,
    "totalMonths": 18,
    "yearMax": { "year": "2023", "count": 650 },
    "yearMin": { "year": "2026", "count": 87 },
    "monthMax": { "month": "03/2023", "count": 72 },
    "monthMin": { "month": "06/2026", "count": 0 },
    "years": ["2024", "2025", "2026"]
  }
}
```

### GET /stats/:userId/monthly/:year
```json
{
  "yearTotal": 145,
  "data": [
    {
      "monthKey": "07/2026",
      "count": 23,
      "totalDays": 6,
      "days": [
        {
          "_id": "64abc...",
          "date": "05/07/2026",
          "count": 3,
          "breakCount": 1,
          "mood": "😐",
          "notes": [{ "text": "Hard day", "createdAt": "..." }]
        }
      ]
    }
  ]
}
```

### POST /log/:userId (create/update)
```json
// Request body:
{
  "date": "2026-07-06",
  "count": 3,
  "breakCount": 1,
  "mood": "😐",
  "notes": "Stressful meeting"
}

// Response:
{
  "success": true,
  "action": "created",  // or "updated" if date already existed
  "message": "Log created successfully",
  "data": { ... }
}
```

---

## Date Format Gotchas

The backend and frontend use different date formats — the API client handles conversion:

| Layer | Format | Example |
|---|---|---|
| Backend API response | `DD/MM/YYYY` | `"05/07/2026"` |
| Frontend (ISO) | `YYYY-MM-DD` | `"2026-07-05"` |
| monthKey (API) | `MM/YYYY` | `"07/2026"` |
| monthKey (internal) | `MM-YYYY` | `"07-2026"` |

```js
// Conversion in api-client.js:
const dayNum = d.date.split("/")[0]; // "05/07/2026" → "05"

// monthKey conversion:
const key = monthBlock.monthKey.replace("/", "-"); // "07/2026" → "07-2026"
```

---

## How Visitor Tracking Works

The app pings the backend once on load to record a visit:

1. `RecoveryHighlights` calls `pingVisitor()` on mount
2. Backend records the visit and returns `{ total, today }`
3. `VisitorCounter` in TopNav calls `fetchVisitorCount()` separately
   (read-only, doesn't record another visit)

This ensures each dashboard load = 1 visit recorded, not 2.
