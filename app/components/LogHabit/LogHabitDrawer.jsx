"use client";

import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useDashboard } from "../../context/DashboardProvider";
import { logHabit } from "../../../lib/api";
import DateSelector from "./DateSelector";
import QuickCountChips from "./QuickCountChips";
import NumberPicker from "./NumberPicker";
import MoreDetails from "./MoreDetails";
import LiveSummary from "./LiveSummary";
import styles from "./LogHabit.module.css";

// Returns today as "YYYY-MM-DD".
function todayStr() {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}

export default function LogHabitDrawer({ onClose }) {
  const { userId } = useUser();
  const { refresh } = useDashboard();

  // Form state
  const [date, setDate]             = useState(todayStr());
  const [count, setCount]           = useState(0);
  const [breakCount, setBreakCount] = useState(0);
  const [mood, setMood]             = useState("");
  const [notes, setNotes]           = useState("");

  // Save state
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");

  // Close on Escape key.
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  async function handleSave() {
    if (!userId) {
      setError("You are not logged in.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await logHabit(userId, {
        date,
        count,
        breakCount,
        mood,
        notes,
      });

      setSuccess(true);

      // Refresh the dashboard data so calendar and stats update immediately.
      refresh();

      // Close the drawer after a short success animation.
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/* Backdrop — click to close */}
      <div className={styles.overlay} onClick={onClose} />

      {/* Drawer / bottom sheet */}
      <div className={styles.drawer} role="dialog" aria-modal="true" aria-label="Log Habit">

        {/* Mobile drag handle */}
        <div className={styles.handle}><span /></div>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h2>🚬 Log Habit</h2>
            <p>Record your activity in just a few seconds.</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close" type="button">
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className={styles.body}>

          {/* Date */}
          <DateSelector value={date} onChange={setDate} />

          {/* Cigarette count section */}
          <div className={styles.section}>
            <div className={styles.sectionLabel}>🚬 Cigarettes Smoked</div>

            {/* Method 1 — quick chips */}
            <QuickCountChips value={count} onChange={setCount} />

            {/* Method 2 — number picker */}
            <NumberPicker
              value={count}
              onChange={setCount}
              min={0}
            />
          </div>

          {/* More details (mood, break count, notes) — collapsed by default */}
          <MoreDetails
            mood={mood}
            onMoodChange={setMood}
            breakCount={breakCount}
            onBreakCountChange={setBreakCount}
            notes={notes}
            onNotesChange={setNotes}
          />

          {/* Live summary */}
          <LiveSummary
            date={date}
            count={count}
            breakCount={breakCount}
            mood={mood}
          />

          {/* Error message */}
          {error && (
            <p style={{ color: "#ef4444", fontSize: "0.85rem", margin: "4px 0" }}>
              ⚠️ {error}
            </p>
          )}

        </div>

        {/* Sticky footer — save button */}
        <div className={styles.footer}>
          <button
            className={success
              ? `${styles.saveBtn} ${styles.saveBtnSuccess}`
              : styles.saveBtn
            }
            onClick={handleSave}
            disabled={saving || success}
            type="button"
          >
            {saving  && <span className={styles.spinner} />}
            {success && <span className={styles.successPop}>✓ Saved!</span>}
            {!saving && !success && "Save Habit"}
          </button>
        </div>

      </div>
    </>
  );
}
