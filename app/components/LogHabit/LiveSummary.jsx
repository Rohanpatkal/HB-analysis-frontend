"use client";

import styles from "./LogHabit.module.css";

export default function LiveSummary({ date, count, breakCount, mood }) {
  // Format "YYYY-MM-DD" to a short label.
  function shortDate(iso) {
    if (!iso) return "—";
    const [y, m, d] = iso.split("-");
    const dt = new Date(Number(y), Number(m) - 1, Number(d));
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (dt.toDateString() === today.toDateString()) return "Today";
    if (dt.toDateString() === yesterday.toDateString()) return "Yesterday";
    return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  }

  return (
    <div className={styles.summary}>
      <div className={styles.summaryItem}>
        <span>🚬</span>
        <span>Cigarettes</span>
        <strong>{count}</strong>
      </div>

      <div className={styles.summaryItem}>
        <span>📅</span>
        <span>{shortDate(date)}</span>
      </div>

      {breakCount > 0 && (
        <div className={styles.summaryItem}>
          <span>❤️</span>
          <span>HB</span>
          <strong>{breakCount}</strong>
        </div>
      )}

      {mood && (
        <div className={styles.summaryItem}>
          <span>{mood}</span>
        </div>
      )}
    </div>
  );
}
