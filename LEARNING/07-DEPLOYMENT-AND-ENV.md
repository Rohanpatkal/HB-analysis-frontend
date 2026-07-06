# Deployment & Environment Variables

## Live URLs

| Service | URL |
|---|---|
| Frontend (Vercel) | https://hb-analysis-frontend.vercel.app |
| Backend (Render) | https://hbbackend-fpvz.onrender.com/api |

---

## Environment Variables

### `.env.local` (local development only, NOT committed to git)

```env
NEXT_PUBLIC_APP_URL=https://hb-analysis-frontend.vercel.app
NEXT_PUBLIC_API_URL=https://hbbackend-fpvz.onrender.com/api
```

### Vercel Dashboard (production)

Go to: Vercel Project → Settings → Environment Variables

Add both:
- `NEXT_PUBLIC_APP_URL` = `https://hb-analysis-frontend.vercel.app`
- `NEXT_PUBLIC_API_URL` = `https://hbbackend-fpvz.onrender.com/api`

**Why both places?**
- `.env.local` = used when you run `npm run dev` on your laptop
- Vercel dashboard = used when deployed to production
- Vercel does NOT read `.env.local`

---

## What `NEXT_PUBLIC_` Means

Variables starting with `NEXT_PUBLIC_` are bundled into the
browser-side JavaScript. Anyone can see them in browser DevTools.

Variables WITHOUT the prefix (e.g. `DATABASE_URL`) are server-only
and never exposed to the browser.

**Rule:** Use `NEXT_PUBLIC_` only for values that are safe to be public
(like API URLs). Never use it for secrets (API keys, passwords).

---

## npm Scripts

```json
"scripts": {
  "dev":   "next dev",      ← Start local development server
  "build": "next build",    ← Build for production (Vercel runs this)
  "start": "next start",    ← Run the production build locally
  "lint":  "eslint"         ← Check code for errors
}
```

**Run locally:**
```bash
npm run dev
# Open http://localhost:3000
```

**Build and check for errors:**
```bash
npm run build
# Should show ✓ Compiled successfully with 0 warnings
```

---

## Vercel Deployment

Vercel automatically deploys when you push to `main` branch on GitHub.

**Manual deploy:**
1. Push your code: `git push origin main`
2. Vercel detects the push
3. Runs `npm run build`
4. Deploys if build succeeds

**Check deploy status:** Go to your Vercel dashboard → Deployments tab

---

## Google Search Console Setup

1. Go to https://search.google.com/search-console
2. Property: `hb-analysis-frontend.vercel.app`
3. Verification: HTML meta tag (already in `layout.js`)
4. Sitemap submitted: `sitemap.xml`

**Check indexing status:**
- Left sidebar → Pages
- See which URLs are indexed vs discovered vs not indexed

**Force re-indexing after changes:**
- URL Inspection → paste URL → Request Indexing

---

## Render (Backend) Notes

The backend is hosted on Render's free tier.
Free tier services **spin down after 15 minutes of inactivity**.

This means the first API call after inactivity takes 30-60 seconds
while Render warms up the server. This causes the dashboard to appear
to hang on first load after idle time.

**This is normal for free tier Render.** Upgrade to a paid plan to eliminate the cold start delay.

---

## Production Checklist

| Item | Status |
|---|---|
| `.env.local` created with correct URLs | ✅ |
| Vercel env vars set | Set manually in Vercel |
| `NEXT_PUBLIC_API_URL` points to Render backend | ✅ |
| `NEXT_PUBLIC_APP_URL` points to Vercel frontend | ✅ |
| Google Search Console verified | ✅ |
| Sitemap submitted | ✅ |
| OG image at `/public/og-image.png` | ⚠️ Missing |
| Apple touch icon at `/public/apple-touch-icon.png` | ⚠️ Missing |
