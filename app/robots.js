// app/robots.js
// Disallow the dashboard (auth-gated) and any API routes from indexing.

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://habitback.app";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login"],
        disallow: ["/dashboard/", "/api/", "/_next/"],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
