"use client";

import { useState } from "react";
import MoodSelector from "./MoodSelector";
import NumberPicker from "./NumberPicker";
import styles from "./LogHabit.module.css";

export default function MoreDetails({ mood, onMoodChange, breakCount, onBreakCountChange, notes, onNotesChange, defaultOpen }) {
  // Auto-open when any of the optional fields already have values (edit mode)
  const [open, setOpen] = useState(defaultOpen ?? Boolean(mood || breakCount || notes));

  return (
    <div>
      {/* Toggle button */}
      <button
        type="button"
        className={open ? `${styles.moreToggle} ${styles.moreToggleOpen}` : styles.moreToggle}
        onClick={() => setOpen(!open)}
      >
        <span className={styles.moreToggleIcon}>▼</span>
        {open ? "Hide Details" : "More Details"}
      </button>

      {/* Expandable section */}
      {open && (
        <div className={styles.moreBody}>
          <MoodSelector value={mood} onChange={onMoodChange} />

          <NumberPicker
            label="❤️ Habit Break Count"
            value={breakCount}
            onChange={onBreakCountChange}
            min={0}
          />

          <div>
            <div className={styles.sectionLabel}>📝 Notes (optional)</div>
            <textarea
              className={styles.notesTextarea}
              placeholder="How are you feeling? Any triggers today?"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      )}
    </div>
  );
}
