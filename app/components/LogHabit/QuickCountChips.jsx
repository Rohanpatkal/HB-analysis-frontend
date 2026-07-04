import React from 'react';
import styles from './LogHabit.module.css';

export default function QuickCountChips({ currentCount, onChange }) {
  const options = [0, 1, 2, 3, 5, 10, 15];

  return (
    <div className={styles.chipsContainer}>
      {options.map((val) => (
        <button
          key={val}
          type="button"
          className={`${styles.chip} ${currentCount === val ? styles.chipActive : ''}`}
          onClick={() => onChange(val)}
        >
          {val}
        </button>
      ))}
    </div>
  );
}