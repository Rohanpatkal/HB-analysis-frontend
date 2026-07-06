// app/not-found.js
// Shown for any route that doesn't match a page.
import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f2f8",
        padding: "2rem",
        textAlign: "center",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <span
        aria-hidden="true"
        style={{ fontSize: "4rem", lineHeight: 1, marginBottom: "1rem" }}
      >
        🌿
      </span>
      <h1
        style={{
          fontSize: "6rem",
          fontWeight: 800,
          color: "#0f172a",
          lineHeight: 1,
          margin: 0,
        }}
      >
        404
      </h1>
      <p
        style={{
          fontSize: "1.25rem",
          color: "#64748b",
          marginTop: "1rem",
          marginBottom: "2rem",
          maxWidth: "360px",
        }}
      >
        This page doesn&apos;t exist. Head back to the dashboard.
      </p>
      <Link
        href="/"
        style={{
          display: "inline-block",
          padding: "12px 28px",
          background: "#10b981",
          color: "#fff",
          borderRadius: "12px",
          fontWeight: 600,
          fontSize: "0.95rem",
          textDecoration: "none",
          transition: "background 0.2s",
        }}
      >
        Go to Dashboard
      </Link>
    </main>
  );
}
