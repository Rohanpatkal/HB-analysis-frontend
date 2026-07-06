// app/sitemap.js
// Public pages only — dashboard is auth-gated so excluded.

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://habitback.app";

export default function sitemap() {
  return [
    {
      url: `${APP_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.9,
    },
  ];
}
