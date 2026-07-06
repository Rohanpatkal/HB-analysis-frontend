"use client";

import { useState } from "react";
import styles from "./LogHabit.module.css";

// Returns today's date as "YYYY-MM-DD".
function todayStr() {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}

// Returns yesterday's date as "YYYY-MM-DD".
function yesterdayStr() {
  const t = new Date();
  t.setDate(t.getDate() - 1);
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}

// Formats "YYYY-MM-DD" to a readable label like "03 July 2026".
function formatDisplay(iso) {
  const [y, m, d] = iso.split("-");
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

export default function DateSelector({ value, onChange }) {
  // mode: "today" | "yesterday" | "custom"
  const [mode, setMode] = useState("today");

  function pickToday() {
    setMode("today");
    onChange(todayStr());
  }

  function pickYesterday() {
    setMode("yesterday");
    onChange(yesterdayStr());
  }

  function pickCustom() {
    setMode("custom");
    // Start the custom input from today's value.
    onChange(value || todayStr());
  }

  function handleCustomChange(e) {
    // Prevent future dates.
    if (e.target.value > todayStr()) return;
    onChange(e.target.value);
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionLabel}>📅 Date</div>

      {/* Selected date display */}
      <div className={styles.dateDisplay}>
        📅&nbsp;
        {mode === "today" && "Today • "}
        {mode === "yesterday" && "Yesterday • "}
        {formatDisplay(value || todayStr())}
      </div>

      {/* Quick options */}
      <div className={styles.dateRow}>
        <button
          type="button"
          className={mode === "today" ? `${styles.dateChip} ${styles.dateChipActive}` : styles.dateChip}
          onClick={pickToday}
        >
          Today
        </button>
        <button
          type="button"
          className={mode === "yesterday" ? `${styles.dateChip} ${styles.dateChipActive}` : styles.dateChip}
          onClick={pickYesterday}
        >
          Yesterday
        </button>
        <button
          type="button"
          className={mode === "custom" ? `${styles.dateChip} ${styles.dateChipActive}` : styles.dateChip}
          onClick={pickCustom}
        >
          Custom
        </button>
      </div>

      {/* Calendar input — only shown for custom */}
      {mode === "custom" && (
        <div className={styles.calendarWrap}>
          <input
            type="date"
            value={value}
            max={todayStr()}
            onChange={handleCustomChange}
          />
        </div>
      )}
    </div>
  );
}
