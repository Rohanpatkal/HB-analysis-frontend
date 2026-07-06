# Component Reference — What Each File Does

## Layout Components

### `TopNav.jsx`
The sticky navigation bar at the top of the dashboard.

- **Props:** `onLogHabit` — function called when "Log Habit" button clicked
- **Uses:** `useUser()` for logout, `useRouter()` to redirect to /login
- **Contains:** Brand name, VisitorCounter, "Log Habit" button, "Sign Out" button
- **Hides:** VisitorCounter on mobile (via CSS `.visitorWrap` class)

### `VisitorCounter.jsx`
The green pill badge showing total + today's visitor count.

- Calls `fetchVisitorCount()` on mount (read-only, doesn't record a visit)
- Shows a skeleton placeholder while loading
- Hidden on mobile screens via parent CSS

---

## Dashboard Sections (top to bottom on page)

### `RecoveryHighlights.jsx`
The dark blue hero banner at the top of the dashboard.

- Shows: Level badge, visitor count, 4 stat cards, progress bar
- Calls `pingVisitor()` on mount to RECORD the current visit
- Data comes from `useDashboard().data.highlights`
- The "Personal Best" message at the bottom is currently static text

**Key stats shown:**
- Best Streak (days)
- Money Saved (₹)
- Smoke-Free days count
- Recovery % score

### `AnalyticsFilters.jsx`
The period selector bar (month dropdown + year dropdown + navigation buttons).

- Reads: `period`, `globalSummary` from `useDashboard()`
- Writes: calls `selectPeriod({ month, year })` to change the view
- Year list comes from the backend's `/summary` endpoint (only real years)

### `MonthSummury.jsx` (note: typo in filename — intentional legacy)
The left sidebar card showing 8 monthly stats.

- Data: `useDashboard().data.summary` — an array of 8 items
- Each item: `{ title, value, icon, color }`

**The 8 stats:**
1. Current Streak
2. Longest Streak
3. Smoke-Free Days
4. Reduced Days
5. Smoking Days
6. Total Count
7. Money Saved
8. Recovery Score

### `ContributionCalendar.jsx`
The main calendar grid showing colour-coded days.

- Green = smoke-free, Yellow = reduced, Red = smoked, Grey = future
- Click a day → shows `DayDetail` panel below the grid
- Click again (or the X button) → hides the panel
- Edit button in `DayDetail` → calls `onEditLog(dayItem)` prop → opens drawer

**Day data structure:**
```js
{
  day: 5,                    // day number
  fullDate: "2026-07-05",    // ISO string
  isToday: false,
  isFuture: false,
  status: "green",           // green|yellow|red|empty|future
  id: "64abc...",            // MongoDB _id (null if no log exists)
  count: 0,                  // cigarettes
  breakCount: 2,             // HB count
  mood: "😊",
  notes: "Good day",
  notesRaw: "Good day",      // For pre-filling the edit form
}
```

### `Details.jsx`
The bottom section with 3 stat panels:
1. All-Time Summary (from `/summary` endpoint)
2. Monthly Details (for selected month)
3. Yearly Details (for selected year + mini bar chart)

Each panel uses `Tile` sub-components with colour dots.

---

## LogHabit Drawer Components

### `LogHabitDrawer.jsx`
The main drawer/bottom-sheet for logging a habit.

- Opens as right-side drawer on desktop
- Opens as bottom sheet on mobile
- Handles both CREATE mode and EDIT mode
- `existingLog` prop → null = create, object = edit

**Save logic:**
- Create: `POST /log/:userId` via `addHabitLog()`
- Edit: `PUT /log/:userId/:logId` via `editHabitLog()`
- After save: calls `refresh()` to update the dashboard instantly

### `DateSelector.jsx`
Quick chip buttons (Yesterday, Today, Custom) + date input.

### `NumberPicker.jsx`
Scroll-wheel style number input for cigarette count.
- Drag up/down to change value
- +/- buttons on sides
- Direct text input in center

### `QuickCountChips.jsx`
Row of preset count buttons: 0, 1, 2, 3, 5, 10+

### `MoodSelector.jsx`
5 emoji mood buttons: 😊 🙂 😐 😔 😤

### `MoreDetails.jsx`
Collapsible section with mood selector + HB count + notes textarea.

### `LiveSummary.jsx`
Preview strip at the bottom of the drawer showing what will be saved.

---

## UI Components

### `LoadingScreen.jsx`
Full-page spinner with optional message.

```jsx
<LoadingScreen message="Loading your recovery data…" />
```

### `ErrorScreen.jsx`
Full-page error with retry button.

```jsx
<ErrorScreen message={error} onRetry={refresh} />
```

---

## CSS Modules

Each component has its own `.module.css` file.
Class names are scoped — `.panel` in `Details.module.css` won't
conflict with `.panel` anywhere else.

```jsx
import styles from "./Details.module.css";

// Usage:
<div className={styles.panel}>  // ← scoped, safe
```

This is different from global CSS or Tailwind classes.
