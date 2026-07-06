"use client";

import styles from "./LogHabit.module.css";

const MOODS = [
  { emoji: "😞", label: "Awful" },
  { emoji: "😐", label: "Meh" },
  { emoji: "🙂", label: "Okay" },
  { emoji: "😄", label: "Good" },
  { emoji: "🤩", label: "Great" },
];

export default function MoodSelector({ value, onChange }) {
  return (
    <div>
      <div className={styles.sectionLabel}>😊 Mood</div>
      <div className={styles.moodRow}>
        {MOODS.map((m) => (
          <button
            key={m.emoji}
            type="button"
            className={value === m.emoji
              ? `${styles.moodBtn} ${styles.moodBtnActive}`
              : styles.moodBtn
            }
            onClick={() => onChange(m.emoji === value ? "" : m.emoji)}
            aria-label={m.label}
            title={m.label}
          >
            {m.emoji}
            <span>{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
