// app/sitemap.js
// Submitted to Google Search Console.
// Only public indexable pages — /dashboard is auth-gated so excluded.

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://habitpilot.vercel.app";

export default function sitemap() {
  return [
    {
      url: APP_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",  // Landing page content changes periodically
      priority: 1.0,
    },
    {
      url: `${APP_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
  ];
}
