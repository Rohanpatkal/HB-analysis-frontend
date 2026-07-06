# HabitBack Frontend — Complete Project Overview

## What This App Does

HabitBack is a **smoking recovery analytics dashboard**.
Users log how many cigarettes they smoked each day, and the app shows:
- A colour-coded calendar (like GitHub contributions)
- Smoke-free streaks
- Monthly & yearly stats
- Money saved
- Mood tracking

---

## Technology Stack

| Tool | Version | Purpose |
|---|---|---|
| Next.js | 16.2.4 | Full-stack React framework |
| React | 19.2.4 | UI library |
| Tailwind CSS | v4 | Utility-first CSS |
| Lucide React | 1.22 | Icon library |
| Chart.js | 4.4 | Charts (used in Details) |

---

## Complete Folder Structure (what you need to know)

```
HB-analysis-frontend/
│
├── app/                        ← All pages and components (Next.js App Router)
│   ├── page.js                 ← PUBLIC landing page (/)
│   ├── layout.js               ← Root layout — wraps every page
│   ├── globals.css             ← Global styles + Tailwind import
│   ├── loading.js              ← Shown during page navigation
│   ├── error.js                ← Shown when unhandled errors occur
│   ├── not-found.js            ← Custom 404 page
│   ├── sitemap.js              ← Generates /sitemap.xml for Google
│   ├── robots.js               ← Generates /robots.txt for Google
│   ├── landing.module.css      ← Styles for the landing page
│   │
│   ├── login/                  ← Login/Register page
│   │   ├── page.js             ← Server Component — exports metadata
│   │   ├── LoginForm.jsx       ← Client Component — actual form logic
│   │   └── Login.module.css    ← Login page styles
│   │
│   ├── dashboard/              ← The main app (auth-gated)
│   │   └── page.js             ← Dashboard page
│   │
│   ├── components/             ← All reusable UI components
│   │   ├── AnalyticsFilters.jsx        ← Month/year selector bar
│   │   ├── ContributionCalendar.jsx    ← The big calendar grid
│   │   │
│   │   ├── Details/
│   │   │   ├── Details.jsx             ← Monthly, yearly, all-time stats panels
│   │   │   └── Details.module.css
│   │   │
│   │   ├── RecoveryHighlights/
│   │   │   ├── RecoveryHighlights.jsx  ← Hero banner with key stats
│   │   │   └── RecoveryHighlights.module.css
│   │   │
│   │   ├── summuryDetails/
│   │   │   ├── MonthSummury.jsx        ← Left sidebar card with 8 stats
│   │   │   └── MonthSummary.module.css
│   │   │
│   │   ├── LogHabit/                   ← The "Log Habit" drawer/form
│   │   │   ├── LogHabitDrawer.jsx      ← Main drawer component
│   │   │   ├── DateSelector.jsx        ← Date picker chips
│   │   │   ├── NumberPicker.jsx        ← Scroll wheel number input
│   │   │   ├── QuickCountChips.jsx     ← Quick-select buttons (0,1,2,3...)
│   │   │   ├── MoodSelector.jsx        ← Emoji mood buttons
│   │   │   ├── MoreDetails.jsx         ← Collapsible extras (mood, notes)
│   │   │   ├── LiveSummary.jsx         ← Preview of what will be saved
│   │   │   └── LogHabit.module.css
│   │   │
│   │   ├── layout/
│   │   │   ├── TopNav.jsx              ← Sticky navigation bar
│   │   │   ├── VisitorCounter.jsx      ← Live visitor count badge
│   │   │   └── layout.module.css
│   │   │
│   │   └── ui/
│   │       ├── LoadingScreen.jsx       ← Full-page loading spinner
│   │       ├── ErrorScreen.jsx         ← Full-page error message
│   │       └── ui.module.css
│   │
│   ├── context/                ← React Context (global state)
│   │   ├── UserContext.jsx     ← Stores userId + token from localStorage
│   │   └── DashboardProvider.jsx ← Fetches all data, shares with components
│   │
│   ├── data/
│   │   └── getPeriodData.js    ← Transforms raw API data into component shapes
│   │
│   └── utils/
│       └── analytics.common.js ← Pure helper functions (no React)
│
├── lib/                        ← API layer (no React, pure JS)
│   ├── api.js                  ← All fetch functions (login, log habit, etc.)
│   └── api-client.js           ← Orchestrates all API calls for the dashboard
│
├── public/                     ← Static files served at /
│   ├── manifest.json           ← PWA manifest
│   ├── google890085bba37a9fce.html ← Google Search Console verification
│   └── *.svg                   ← SVG icons
│
├── .env.local                  ← Environment variables (NOT committed to git)
├── next.config.mjs             ← Next.js configuration
├── package.json                ← Dependencies and scripts
├── postcss.config.mjs          ← PostCSS config (for Tailwind)
└── LEARNING/                   ← 📚 This folder — documentation for learning
```

---

## How Data Flows Through the App

```
User visits /dashboard
    ↓
DashboardProvider mounts
    ↓
fetchAnalyticsData(userId) called   [lib/api-client.js]
    ↓
API calls: /stats/:userId/summary
           /stats/:userId/monthly/:year
    ↓
Raw data stored in state
    ↓
getPeriodData(month, year, raw)     [app/data/getPeriodData.js]
    ↓
Shaped data passed to components via Context
    ↓
Components render
```

---

## Routes (URLs)

| URL | What it shows | Public? |
|---|---|---|
| `/` | Landing page | ✅ Yes (indexed by Google) |
| `/login` | Login & Register form | ✅ Yes (indexed by Google) |
| `/dashboard` | The full analytics app | 🔒 Auth-gated |
| `/sitemap.xml` | Sitemap for Google | ✅ Auto-generated |
| `/robots.txt` | Crawler rules | ✅ Auto-generated |
| `/404` | Not found page | ✅ Auto |
