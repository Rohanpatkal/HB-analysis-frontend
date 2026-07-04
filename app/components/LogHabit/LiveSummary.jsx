import React from 'react';
import styles from './LogHabit.module.css';

export default function LiveSummary({ dateType, count, breakCount, mood }) {
  return (
    <div className={styles.summaryWidget}>
      <div className={styles.summaryItem}>
        <span>🚬 Cigarettes</span>
        <span className={styles.summaryVal}>{count}</span>
      </div>
      <div className={styles.summaryDivider}></div>
      <div className={styles.summaryItem}>
        <span>📅 {dateType}</span>
      </div>
      <div className={styles.summaryDivider}></div>
      <div className={styles.summaryItem}>
        <span>❤️ Break</span>
        <span className={styles.summaryVal}>{breakCount}</span>
      </div>
      {mood && (
        <>
          <div className={styles.summaryDivider}></div>
          <div className={styles.summaryItem}>
            <span>{mood === 'Anxious' ? '😞' : mood === 'Neutral' ? '😐' : mood === 'Good' ? '🙂' : mood === 'Happy' ? '😄' : '🤩'}</span>
          </div>
        </>
      )}
    </div>
  );
}