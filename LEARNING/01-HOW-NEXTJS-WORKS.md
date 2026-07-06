# How Next.js Works in This Project

## App Router vs Pages Router

This project uses the **App Router** (the modern Next.js approach).
Everything lives inside `app/`.

Each folder = a URL route.

```
app/page.js          → https://yoursite.com/
app/login/page.js    → https://yoursite.com/login
app/dashboard/page.js → https://yoursite.com/dashboard
```

---

## Server Components vs Client Components

This is the most important concept in Next.js App Router.

### Server Components (default)
- Run on the server — never sent to the browser as JS
- Can export `metadata` for SEO
- Cannot use `useState`, `useEffect`, browser APIs
- Example in this project: `app/page.js`, `app/login/page.js`

```js
// Server Component — no "use client" directive
export const metadata = { title: "My Page" }; // ✅ allowed

export default function Page() {
  return <h1>Hello</h1>;
}
```

### Client Components
- Run in the browser
- Can use `useState`, `useEffect`, event handlers
- Must have `"use client"` at the top of the file
- Example in this project: `app/login/LoginForm.jsx`, all dashboard components

```js
"use client"; // Required for client features

import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  // ...
}
```

### The Pattern Used in This Project

The login page splits into two files:
- `page.js` — Server Component that exports metadata (SEO)
- `LoginForm.jsx` — Client Component with the actual form logic

```
app/login/page.js     → exports metadata (SEO), renders <LoginForm />
app/login/LoginForm.jsx → "use client", has useState, handles submit
```

---

## Special Next.js Files

These files are recognised by Next.js automatically:

| File | Purpose |
|---|---|
| `page.js` | The page content for a route |
| `layout.js` | Wrapper that persists across pages |
| `loading.js` | Shown while navigating to a page |
| `error.js` | Shown when an error occurs |
| `not-found.js` | Custom 404 page |
| `sitemap.js` | Generates `/sitemap.xml` |
| `robots.js` | Generates `/robots.txt` |

---

## Metadata API

SEO metadata is exported from Server Components:

```js
// layout.js — applies to all pages
export const metadata = {
  title: { default: "HabitBack", template: "%s | HabitBack" },
  description: "Track your recovery...",
  openGraph: { ... },
  twitter: { ... },
};

// login/page.js — overrides just for login page
export const metadata = {
  title: "Sign In",  // becomes "Sign In | HabitBack" via template
};
```

### Viewport is separate (Next.js 15+ breaking change)

```js
// Must be exported separately, NOT inside metadata
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#10b981",
};
```

---

## Dynamic Imports (Lazy Loading)

Used in `dashboard/page.js` to reduce initial bundle size:

```js
import dynamic from "next/dynamic";

// This component is only loaded when needed, not on first page load
const ContributionCalendar = dynamic(
  () => import("../components/ContributionCalendar"),
  { ssr: false }  // Don't render on server (needs browser APIs)
);
```

`ssr: false` means: skip server rendering for this component.
Used for components that use `window`, `localStorage`, etc.

---

## How Tailwind CSS v4 Works Here

Tailwind v4 is imported differently from v3:

```css
/* globals.css */
@import "tailwindcss";  /* ← v4 syntax, replaces @tailwind directives */
```

You use utility classes directly in JSX:
```jsx
<div className="flex items-center gap-4 rounded-xl bg-emerald-500 text-white">
```

Custom utilities are added with `@layer utilities`:
```css
@layer utilities {
  .sr-only { ... }
}
```

---

## Environment Variables

| Variable | Where used |
|---|---|
| `NEXT_PUBLIC_APP_URL` | Sitemap, robots, OG metadata base URL |
| `NEXT_PUBLIC_API_URL` | Backend API base URL in `lib/api.js` |

`NEXT_PUBLIC_` prefix = accessible in browser JS.
Variables without that prefix = server-only (more secure).

Set them in `.env.local` for local dev.
Set them in Vercel Dashboard for production.
