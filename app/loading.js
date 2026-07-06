// app/loading.js
// Shown by Next.js during route-level Suspense (navigation between pages).

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#f0f2f8",
        gap: "1rem",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 48,
          height: 48,
          border: "4px solid #e2e8f0",
          borderTopColor: "#10b981",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <p style={{ color: "#64748b", fontWeight: 500, fontSize: "0.95rem" }}>
        Loading…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
