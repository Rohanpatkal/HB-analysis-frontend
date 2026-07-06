"use client";

import styles from "./LogHabit.module.css";

const QUICK_VALUES = [0, 1, 2, 3, 5, 10, 15];

export default function QuickCountChips({ value, onChange }) {
  return (
    <div className={styles.chipRow}>
      {QUICK_VALUES.map((n) => (
        <button
          key={n}
          type="button"
          className={value === n
            ? `${styles.countChip} ${styles.countChipActive}`
            : styles.countChip
          }
          onClick={() => onChange(n)}
          aria-label={`Set count to ${n}`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
