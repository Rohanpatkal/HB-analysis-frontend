// app/robots.js
// Controls which pages crawlers index.
// /dashboard is auth-gated — crawlers see a redirect to /login, not content.

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hb-analysis-frontend.vercel.app";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login"],
        disallow: ["/dashboard/", "/api/", "/_next/", "/dashboard"],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
    host: APP_URL,
  };
}
