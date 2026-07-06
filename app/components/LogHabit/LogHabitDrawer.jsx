"use client";

import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useDashboard } from "../../context/DashboardProvider";
import { addHabitLog } from "../../../lib/api";
import DateSelector from "./DateSelector";
import QuickCountChips from "./QuickCountChips";
import NumberPicker from "./NumberPicker";
import MoreDetails from "./MoreDetails";
import LiveSummary from "./LiveSummary";
import styles from "./LogHabit.module.css";

function todayStr() {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}

export default function LogHabitDrawer({ onClose }) {
  const { userId } = useUser();
  const { refresh } = useDashboard();

  // Form fields
  const [date,       setDate]       = useState(todayStr());
  const [count,      setCount]      = useState(0);
  const [breakCount, setBreakCount] = useState(0);
  const [mood,       setMood]       = useState("");
  const [notes,      setNotes]      = useState("");

  // Submit state — successAction holds "created" | "updated" | ""
  const [saving,        setSaving]        = useState(false);
  const [successAction, setSuccessAction] = useState("");
  const [error,         setError]         = useState("");

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function resetForm() {
    setDate(todayStr());
    setCount(0);
    setBreakCount(0);
    setMood("");
    setNotes("");
  }

  async function handleSave() {
    if (!userId) { setError("You are not logged in."); return; }
    // count can be 0 when the user is only logging a habit break (hbCount)
    if (count < 0) { setError("Count cannot be negative."); return; }

    setSaving(true);
    setError("");
    setSuccessAction("");

    try {
      // POST /api/log/:userId
      const res = await addHabitLog(userId, { date, count, breakCount, mood, notes });

      // Backend returns action: "created" or "updated"
      setSuccessAction(res.action || "created");

      // Refresh dashboard so calendar and stats reflect the new log instantly
      refresh();

      // Reset form, then close after 1.4 s so user can read the success message
      resetForm();
      setTimeout(() => {
        setSuccessAction("");
        onClose();
      }, 1400);

    } catch (err) {
      setError(err.message || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const isSuccess = Boolean(successAction);

  const successLabel = successAction === "updated"
    ? "✓ Entry updated!"
    : "✓ Entry created!";

  return (
    <>
      {/* Backdrop — click outside to close */}
      <div className={styles.overlay} onClick={onClose} />

      {/* Drawer (desktop right-side) / bottom sheet (mobile) */}
      <div className={styles.drawer} role="dialog" aria-modal="true" aria-label="Log Habit">

        {/* Mobile drag handle */}
        <div className={styles.handle}><span /></div>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h2>🚬 Log Habit</h2>
            <p>Record your activity in just a few seconds.</p>
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className={styles.body}>

          {/* 1. Date picker */}
          <DateSelector value={date} onChange={setDate} />

          {/* 2. Count — quick chips + scroll picker */}
          <div className={styles.section}>
            <div className={styles.sectionLabel}>🚬 Cigarettes Smoked</div>
            <QuickCountChips value={count} onChange={setCount} />
            <NumberPicker value={count} onChange={setCount} min={0} />
          </div>

          {/* 3. Optional details — mood, break count, notes */}
          <MoreDetails
            mood={mood}            onMoodChange={setMood}
            breakCount={breakCount} onBreakCountChange={setBreakCount}
            notes={notes}          onNotesChange={setNotes}
          />

          {/* 4. Live summary */}
          <LiveSummary date={date} count={count} breakCount={breakCount} mood={mood} />

          {/* Inline error */}
          {error && (
            <p role="alert" style={{ color: "#ef4444", fontSize: "0.85rem", margin: "4px 0" }}>
              ⚠️ {error}
            </p>
          )}

        </div>

        {/* Sticky footer */}
        <div className={styles.footer}>
          <button
            className={isSuccess
              ? `${styles.saveBtn} ${styles.saveBtnSuccess}`
              : styles.saveBtn
            }
            onClick={handleSave}
            disabled={saving || isSuccess}
            type="button"
          >
            {saving    && <span className={styles.spinner} />}
            {isSuccess && <span className={styles.successPop}>{successLabel}</span>}
            {!saving && !isSuccess && "Save Habit"}
          </button>
        </div>

      </div>
    </>
  );
}
