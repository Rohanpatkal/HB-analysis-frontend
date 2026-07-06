# State Management — Context & Hooks

## Two Contexts in This App

### 1. UserContext (`app/context/UserContext.jsx`)

**What it stores:** userId + JWT token (from localStorage)

**Why it exists:** Every component needs to know who is logged in.
Instead of passing `userId` as a prop to every component, it's stored
in context and any component can read it with `useUser()`.

```js
// Any component can do this:
import { useUser } from "../context/UserContext";

function MyComponent() {
  const { userId, token, login, logout, ready } = useUser();
}
```

**The `ready` flag:** Because `localStorage` only exists in the browser
(not during server rendering), the app needs to wait until the first
client render to read it. `ready` is `false` until that read is done.

```
Browser loads page
  → UserProvider mounts
  → useEffect runs (reads localStorage)
  → setReady(true)
  → Now components can check if user is logged in
```

**Login flow:**
```js
login(userId, token)
  → saves to localStorage
  → sets state
  → components re-render with new userId
```

---

### 2. DashboardProvider (`app/context/DashboardProvider.jsx`)

**What it stores:** All analytics data + selected period

**Why it exists:** Multiple components (Calendar, MonthSummary, Details)
all need the same data. Fetching it once in a parent and sharing via
context avoids duplicate API calls.

```js
// Any dashboard component can do this:
import { useDashboard } from "../context/DashboardProvider";

function Details() {
  const { data, yearData, period, selectPeriod, loading, error } = useDashboard();
}
```

**What it exposes:**

| Value | Type | Description |
|---|---|---|
| `period` | `{ month, year }` | Currently selected period |
| `selectPeriod` | function | Change the selected month/year |
| `data` | object | Shaped data for selected month |
| `yearData` | object | Aggregated stats for selected year |
| `globalSummary` | object | All-time stats from backend |
| `loading` | boolean | True while fetching |
| `error` | string\|null | Error message if fetch failed |
| `refresh` | function | Re-fetch (call after saving a log) |

---

## How `useMemo` and `useCallback` are Used

In `DashboardProvider`, these hooks prevent unnecessary recalculations:

```js
// Only recalculates when month, year, or raw data changes
const data = useMemo(
  () => getPeriodData(period.month, period.year, raw),
  [period.month, period.year, raw]
);

// Only recreates this function when fetcher or userId changes
const load = useCallback(() => {
  fetcher(userId).then(setRaw)...
}, [fetcher, userId]);
```

Without `useMemo`, `getPeriodData()` would run on every render —
even if nothing changed. That's wasted computation.

---

## Data Flow: From API to Component

```
1. DashboardProvider mounts
   ↓
2. load() called → fetchAnalyticsData(userId) [lib/api-client.js]
   ↓
3. Makes 2+ API calls in parallel:
   GET /stats/:userId/summary
   GET /stats/:userId/monthly/2026
   GET /stats/:userId/monthly/2025   (if user has prior years)
   ↓
4. Returns raw object:
   {
     data: { "2026": { "07-2026": [...days] } },
     summary: { totalCount, yearMax, yearMin, ... },
     yearTotals: { "2026": 145 },
     monthTotals: { "2026": { "07-2026": { count: 12 } } }
   }
   ↓
5. raw stored in DashboardProvider state
   ↓
6. getPeriodData(month, year, raw) called [app/data/getPeriodData.js]
   ↓
7. Returns shaped data:
   {
     period: { month: 6, year: 2026, monthName: "July 2026" },
     calendar: { "2026-07-01": "green", "2026-07-02": "red", ... },
     dayCounts: { "2026-07-01": { count: 0, mood: "😊", ... } },
     summary: [ { title: "Current Streak", value: "5 Days", ... } ],
     highlights: { level: 3, stats: [...] },
     details: { smokeFreeDays: 18, smokingDays: 7, ... }
   }
   ↓
8. Components read what they need via useDashboard()
```

---

## The `analyze()` Function

The core stats logic lives in `app/utils/analytics.common.js`:

```js
// Input: array of day statuses + number of days
analyze(["green","green","red","yellow","green"], 31)

// Output:
{
  smokeFreeDays: 3,
  reducedDays: 1,
  smokingDays: 1,
  maxGap: 2,        // longest smoke-free run
  minGap: 1,        // shortest smoke-free run
  currentStreak: 1, // consecutive green days at end
  moneySaved: 540,  // ₹180 × smokeFreeDays
  recoveryScore: 60 // % of days smoke-free
}
```

**Day status logic:**
- `red` = smoked (count > 0)
- `yellow` = within 4 days of a red day (affected days)
- `green` = smoke-free and not in yellow zone
- `future` = date is after today (excluded from all stats)
