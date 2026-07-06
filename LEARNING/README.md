# 📚 HabitBack Learning Folder

Open these files any time you need to understand or work on this project.
They explain how everything works in plain language.

---

## Files in This Folder

| File | What it covers |
|---|---|
| `00-PROJECT-OVERVIEW.md` | Full folder structure + data flow diagram |
| `01-HOW-NEXTJS-WORKS.md` | Server vs Client components, metadata, Tailwind |
| `02-STATE-AND-CONTEXT.md` | UserContext, DashboardProvider, useMemo |
| `03-API-LAYER.md` | API functions, response shapes, date formats |
| `04-SEO-AND-METADATA.md` | Sitemap, robots, JSON-LD, Search Console |
| `05-COMPONENTS-EXPLAINED.md` | What every component does |
| `06-AUTH-AND-ROUTING.md` | Login flow, route protection, localStorage |
| `07-DEPLOYMENT-AND-ENV.md` | Vercel, env vars, Render cold starts |
| `08-COMMON-TASKS.md` | How to add pages, APIs, modify features |

---

## Quick Reference

**Start the app locally:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Key URLs:**
- Frontend: https://hb-analysis-frontend.vercel.app
- Backend: https://hbbackend-fpvz.onrender.com/api
- Search Console: https://search.google.com/search-console
- Vercel Dashboard: https://vercel.com/dashboard

**Key files to edit:**
- Add a page → `app/[folder]/page.js`
- Change styles → corresponding `.module.css` or `globals.css`
- Change API calls → `lib/api.js`
- Change stats logic → `app/utils/analytics.common.js`
- Change data shaping → `app/data/getPeriodData.js`
- Change SEO → `app/layout.js`
