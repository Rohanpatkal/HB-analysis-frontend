# SEO — How Search Engine Optimisation Works Here

## What SEO Means for This App

SEO = making sure Google can find, read, and rank your pages.

For HabitBack:
- `/` (landing page) — should rank for "smoking recovery tracker", "habit tracker"
- `/login` — should be indexable but not the main ranking page
- `/dashboard` — should NOT be indexed (it's private, auth-gated)

---

## How Next.js Metadata Works

### Root Layout (`app/layout.js`)
Defines metadata that applies to ALL pages as defaults:

```js
export const metadata = {
  metadataBase: new URL("https://hb-analysis-frontend.vercel.app"),

  // Title template — child pages can use %s
  title: {
    default: "HabitBack — Habit Analytics Dashboard",
    template: "%s | HabitBack",  // Login page → "Sign In | HabitBack"
  },

  description: "Track your smoking recovery...",
  keywords: ["habit tracker", "quit smoking", ...],

  // Open Graph — how link looks when shared on WhatsApp/Twitter
  openGraph: {
    type: "website",
    siteName: "HabitBack",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },

  // Twitter/X card
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },

  // Google verification tag
  verification: {
    google: "google890085bba37a9fce",
  },

  // Links to manifest.json (PWA)
  manifest: "/manifest.json",
};

// Viewport is SEPARATE from metadata (Next.js 15+ requirement)
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#10b981",
};
```

### Page-level metadata override
```js
// app/login/page.js
export const metadata = {
  title: "Sign In",  // Becomes "Sign In | HabitBack" via template
  description: "Sign in to your HabitBack recovery dashboard.",
  robots: { index: true, follow: true },
};
```

---

## What `metadataBase` Does

Without `metadataBase`, relative URLs in metadata break:
```js
// Without metadataBase, this is broken:
images: [{ url: "/og-image.png" }]  // → "/og-image.png" (incomplete)

// With metadataBase set:
images: [{ url: "/og-image.png" }]  // → "https://yoursite.com/og-image.png" ✅
```

---

## Sitemap (`app/sitemap.js`)

Tells Google all the pages that exist:

```js
export default function sitemap() {
  return [
    {
      url: "https://hb-analysis-frontend.vercel.app",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,            // Most important page
    },
    {
      url: "https://hb-analysis-frontend.vercel.app/login",
      changeFrequency: "yearly",
      priority: 0.8,
    },
  ];
}
```

**Note:** `/dashboard` is NOT in the sitemap — it's auth-gated.
Google would just see a redirect to `/login` anyway.

Available at: `https://hb-analysis-frontend.vercel.app/sitemap.xml`

---

## Robots (`app/robots.js`)

Controls which pages crawlers can visit:

```js
export default function robots() {
  return {
    rules: [{
      userAgent: "*",
      allow: ["/", "/login"],
      disallow: ["/dashboard/", "/api/", "/_next/"],
    }],
    sitemap: "https://hb-analysis-frontend.vercel.app/sitemap.xml",
  };
}
```

Available at: `https://hb-analysis-frontend.vercel.app/robots.txt`

---

## JSON-LD Structured Data

Schema.org markup that helps Google understand the page content:

```js
// In app/page.js (landing page)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "HabitBack",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0" },
};

// Injected into the page:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

Google reads this and may show rich results (star ratings, price "Free", etc.)

---

## Google Search Console Checklist

| Task | Status |
|---|---|
| Site deployed on Vercel | ✅ |
| Ownership verified (HTML tag method) | ✅ |
| Sitemap submitted | ✅ |
| URL inspection / indexing requested | Do this manually |
| OG image created (`/public/og-image.png`) | ⚠️ Missing — add a 1200×630px image |

---

## Why the Dashboard Won't Appear in Google

The dashboard at `/dashboard` requires login.
When Google's crawler visits it:
1. `UserContext` reads `localStorage` → nothing there
2. App redirects to `/login`
3. Google sees `/login` instead of dashboard content

This is correct behaviour — you don't want your private data indexed.
