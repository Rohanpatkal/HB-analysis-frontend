"use client";

import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useDashboard } from "../../context/DashboardProvider";
import { addHabitLog, editHabitLog } from "../../../lib/api";
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

/**
 * LogHabitDrawer — handles both creating and editing a habit log.
 *
 * Props:
 *   onClose       — called when the drawer should close
 *   existingLog   — when present, opens in edit mode:
 *                   { id, date, count, breakCount, mood, notesRaw }
 */
export default function LogHabitDrawer({ onClose, existingLog }) {
  const { userId } = useUser();
  const { refresh } = useDashboard();

  const isEditMode = Boolean(existingLog?.id);

  // Form fields — seeded from existingLog when editing
  const [date,       setDate]       = useState(existingLog?.date       ?? todayStr());
  const [count,      setCount]      = useState(existingLog?.count      ?? 0);
  const [breakCount, setBreakCount] = useState(existingLog?.breakCount ?? 0);
  const [mood,       setMood]       = useState(existingLog?.mood       ?? "");
  const [notes,      setNotes]      = useState(existingLog?.notesRaw   ?? "");

  // Submit state — successAction holds "created" | "updated" | "edited" | ""
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
    if (count < 0) { setError("Count cannot be negative."); return; }

    setSaving(true);
    setError("");
    setSuccessAction("");

    try {
      if (isEditMode) {
        // PUT /api/log/:userId/:logId — replace fields with exact values
        await editHabitLog(userId, existingLog.id, { count, breakCount, mood, notes });
        setSuccessAction("edited");
      } else {
        // POST /api/log/:userId — create or upsert
        const res = await addHabitLog(userId, { date, count, breakCount, mood, notes });
        setSuccessAction(res.action || "created");
      }

      // Refresh dashboard so calendar and stats reflect the change instantly
      refresh();

      if (!isEditMode) resetForm();

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

  const successLabel =
    successAction === "edited"   ? "✓ Entry updated!"  :
    successAction === "updated"  ? "✓ Entry updated!"  :
                                   "✓ Entry created!";

  const headerTitle    = isEditMode ? "✏️ Edit Log" : "🚬 Log Habit";
  const headerSubtitle = isEditMode
    ? `Editing entry for ${existingLog.date}`
    : "Record your activity in just a few seconds.";

  return (
    <>
      {/* Backdrop — click outside to close */}
      <div className={styles.overlay} onClick={onClose} />

      {/* Drawer (desktop right-side) / bottom sheet (mobile) */}
      <div className={styles.drawer} role="dialog" aria-modal="true" aria-label={isEditMode ? "Edit Log" : "Log Habit"}>

        {/* Mobile drag handle */}
        <div className={styles.handle}><span /></div>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h2>{headerTitle}</h2>
            <p>{headerSubtitle}</p>
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

          {/* 1. Date picker — read-only when editing (date can't change, use POST for that) */}
          {isEditMode ? (
            <div className={styles.section}>
              <div className={styles.sectionLabel}>📅 Date</div>
              <div className={styles.dateDisplay}>
                <span>📅</span>
                <span>{existingLog.date}</span>
              </div>
              <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: 0 }}>
                To log a different date, use the "Log Habit" button instead.
              </p>
            </div>
          ) : (
            <DateSelector value={date} onChange={setDate} />
          )}

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
          <LiveSummary date={isEditMode ? existingLog.date : date} count={count} breakCount={breakCount} mood={mood} />

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
            {!saving && !isSuccess && (isEditMode ? "Update Entry" : "Save Habit")}
          </button>
        </div>

      </div>
    </>
  );
}
