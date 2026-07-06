"use client";
// app/error.js
// Shown when an unhandled error occurs in a route segment.

export default function Error({ error, reset }) {
  return (
    <main
      role="alert"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#f0f2f8",
        padding: "2rem",
        textAlign: "center",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <span
        aria-hidden="true"
        style={{ fontSize: "3rem", marginBottom: "1rem" }}
      >
        ⚠️
      </span>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a" }}>
        Something went wrong
      </h1>
      <p
        style={{
          color: "#64748b",
          marginTop: "0.5rem",
          marginBottom: "1.5rem",
          maxWidth: "360px",
          fontSize: "0.95rem",
        }}
      >
        {error?.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        onClick={reset}
        style={{
          padding: "12px 28px",
          background: "#10b981",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          fontWeight: 600,
          fontSize: "0.95rem",
          cursor: "pointer",
        }}
      >
        Try Again
      </button>
    </main>
  );
}
