import React from 'react';
import styles from './LogHabit.module.css';

export default function NotesInput({ value, onChange }) {
  return (
    <textarea
      className={styles.textarea}
      placeholder="Add text notes regarding environmental triggers or feelings..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}