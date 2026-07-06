// app/sitemap.js
// Public pages only — /dashboard is auth-gated so excluded.

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hb-analysis-frontend.vercel.app";

export default function sitemap() {
  return [
    {
      url: APP_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${APP_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
  ];
}
