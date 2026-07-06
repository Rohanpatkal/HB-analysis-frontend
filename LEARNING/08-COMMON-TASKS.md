# Common Tasks — How to Do Things

## Add a New Page

1. Create a folder in `app/`
2. Add `page.js` inside it

```
app/about/page.js  →  accessible at /about
```

```js
// app/about/page.js
export const metadata = {
  title: "About",
  description: "About HabitBack...",
};

export default function AboutPage() {
  return <main><h1>About</h1></main>;
}
```

3. Add it to the sitemap (`app/sitemap.js`):
```js
{ url: `${APP_URL}/about`, priority: 0.7 }
```

---

## Add a New API Endpoint Call

In `lib/api.js`, add a new exported function:

```js
export async function myNewEndpoint(userId, data) {
  return apiFetch(`/my-endpoint/${userId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
```

Then import and use it in a component:
```js
import { myNewEndpoint } from "../../lib/api";

async function handleAction() {
  const result = await myNewEndpoint(userId, { key: "value" });
}
```

---

## Add a New Stat to the Dashboard

1. Add calculation in `app/utils/analytics.common.js` (pure function, no React)
2. Return it from `analyze()` or a new function
3. Include it in `getPeriodData()` in `app/data/getPeriodData.js`
4. Read it via `useDashboard().data` in the component

---

## Change the Color Scheme

The brand colour is emerald green `#10b981`.
It's referenced in:
- `globals.css` — `:focus-visible` outline
- `layout.module.css` — `.logBtn` background
- `LogHabit.module.css` — `--lh-green` CSS variable
- `landing.module.css` — throughout
- `Login.module.css` — submit button, input focus
- Tailwind classes like `bg-emerald-500`, `text-emerald-600`

To change it, update all these places consistently.

---

## Modify the Contribution Calendar Colors

In `ContributionCalendar.jsx`, the `statusStyles` object controls colors:

```js
const statusStyles = {
  green:  { cell: "bg-emerald-200 border-emerald-400", ... },
  yellow: { cell: "bg-amber-200 border-amber-400", ... },
  red:    { cell: "bg-rose-200 border-rose-400", ... },
  future: { cell: "bg-slate-50 border-slate-100", ... },
  empty:  { cell: "bg-slate-200 border-slate-300", ... },
};
```

These are Tailwind CSS classes. Change them here to change the calendar.

---

## Change the "Affected Days" Rule

When someone smokes on Monday, the next 4 days are marked yellow.
This number is defined as a constant:

```js
// app/utils/analytics.common.js
export const AFFECTED_DAYS = 4;
```

Change `4` to any number you want.

---

## Change the Money Saved Calculation

```js
// app/utils/analytics.common.js
export const COST_PER_SMOKING_DAY = 180; // ₹ per smoke-free day
```

`moneySaved = smokeFreeDays × COST_PER_SMOKING_DAY`

---

## Add a New Field to the Log Habit Form

1. Add state in `LogHabitDrawer.jsx`:
```js
const [newField, setNewField] = useState("");
```

2. Add the UI (new section in the form body)

3. Include it in the API call:
```js
await addHabitLog(userId, {
  date, count, breakCount, mood, notes,
  newField,  // ← add here
});
```

4. Update `lib/api.js` `addHabitLog` to include the new field in the body

5. Make sure the backend API accepts and stores the new field

---

## Run Locally

```bash
# Install dependencies (only needed once)
npm install

# Start dev server
npm run dev

# Open http://localhost:3000
```

The app will try to connect to `NEXT_PUBLIC_API_URL`.
If that's set to the Render backend, it works even locally.

---

## Build and Check for Errors

```bash
npm run build
```

Look for:
- `✓ Compiled successfully` = good
- Any `⚠` warnings = investigate
- Any `✗` errors = must fix before deploying

---

## Common Errors and Fixes

**"useUser must be used inside UserProvider"**
You're using `useUser()` in a component that isn't wrapped in `UserProvider`.
Check that the component is rendered inside `app/layout.js` where `UserProvider` wraps everything.

**"useDashboard must be used inside DashboardProvider"**
You're using `useDashboard()` outside the `DashboardProvider`.
Only components rendered inside `app/dashboard/page.js` have access.

**"hydration error"**
A server-rendered component and client-rendered component disagree on content.
Common cause: using `new Date()` or `Math.random()` in a Server Component.
Fix: move time-dependent code into a Client Component with `"use client"`.

**API returns 404**
Check `NEXT_PUBLIC_API_URL` is set correctly in `.env.local`.
Check the endpoint path in `lib/api.js`.

**Dashboard shows loading forever**
The Render backend is cold-starting (free tier). Wait 30-60 seconds.
Or check the browser Network tab for failing requests.
