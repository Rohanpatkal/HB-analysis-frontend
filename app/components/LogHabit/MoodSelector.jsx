import React from 'react';
import styles from './LogHabit.module.css';

export default function MoodSelector({ selected, onChange }) {
  const moods = [
    { label: '😞', value: 'Anxious' },
    { label: '😐', value: 'Neutral' },
    { label: '🙂', value: 'Good' },
    { label: '😄', value: 'Happy' },
    { label: '🤩', value: 'Motivated' }
  ];

  return (
    <div className={styles.moodGrid}>
      {moods.map((m) => (
        <button
          key={m.value}
          type="button"
          className={`${styles.moodBtn} ${selected === m.value ? styles.moodBtnActive : ''}`}
          onClick={() => onChange(m.value)}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}