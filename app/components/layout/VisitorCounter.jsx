"use client";

"use client";

import { useEffect, useState } from "react";
import { fetchVisitorCount } from "../../../lib/api";

/**
 * VisitorCounter (TopNav version)
 * Just displays the current counts — the ping/recording is handled
 * by RecoveryHighlights on the dashboard so we don't double-count.
 */
export default function VisitorCounter() {
  const [total, setTotal] = useState(null);
  const [today, setToday] = useState(null);

  useEffect(() => {
    fetchVisitorCount()
      .then((res) => {
        if (res?.total !== undefined) setTotal(res.total);
        if (res?.today !== undefined) setToday(res.today);
      })
      .catch(() => {});
  }, []);

  // Still loading — show subtle skeleton
  if (total === null) {
    return (
      <div style={wrapStyle}>
        <span style={dotStyle("#94a3b8")} />
        <span style={labelStyle}>Visitors</span>
        <span style={skeletonStyle} />
      </div>
    );
  }

  return (
    <div style={wrapStyle} title={`${today} unique visitor${today !== 1 ? "s" : ""} today`}>
      <span style={dotStyle("#10b981")} />
      <span style={labelStyle}>Visitors</span>
      <span style={countStyle}>{total.toLocaleString()}</span>
      {today !== null && (
        <span style={todayBadge}>+{today} today</span>
      )}
    </div>
  );
}

// ── Inline styles (no extra CSS file needed) ──────────────────────────────────

const wrapStyle = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 12px",
  background: "#f0fdf4",
  border: "1px solid #bbf7d0",
  borderRadius: "999px",
  fontSize: "0.78rem",
  fontWeight: 600,
  color: "#15803d",
  whiteSpace: "nowrap",
  userSelect: "none",
};

const dotStyle = (color) => ({
  width: "7px",
  height: "7px",
  borderRadius: "50%",
  background: color,
  flexShrink: 0,
  boxShadow: color === "#10b981" ? `0 0 0 2px #d1fae5` : "none",
});

const labelStyle = {
  color: "#64748b",
  fontWeight: 500,
};

const countStyle = {
  color: "#0f172a",
  fontWeight: 800,
  fontSize: "0.85rem",
};

const todayBadge = {
  background: "#dcfce7",
  color: "#15803d",
  borderRadius: "999px",
  padding: "1px 7px",
  fontSize: "0.72rem",
  fontWeight: 700,
};

const skeletonStyle = {
  width: "36px",
  height: "12px",
  background: "#e2e8f0",
  borderRadius: "6px",
  animation: "pulse 1.4s ease-in-out infinite",
};
