import React, { useState } from 'react';
import MoodSelector from './MoodSelector';
import NumberPicker from './NumberPicker';
import NotesInput from './NotesInput';
import styles from './LogHabit.module.css';

export default function MoreDetails({ mood, setMood, breakCount, setBreakCount, notes, setNotes }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.section}>
      <button 
        type="button" 
        className={styles.detailsToggle} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '▼' : '▶'} More Details
      </button>

      <div className={`${styles.detailsContent} ${isOpen ? styles.detailsContentExpanded : ''}`}>
        <div style={{ paddingTop: '12px' }}>
          
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Mood Selector</span>
            <MoodSelector selected={mood} onChange={setMood} />
          </div>

          <div className={styles.section}>
            <span className={styles.sectionLabel}>Habit Break Count</span>
            <NumberPicker value={breakCount} onChange={setBreakCount} />
          </div>

          <div className={styles.section}>
            <span className={styles.sectionLabel}>Notes</span>
            <NotesInput value={notes} onChange={setNotes} />
          </div>

        </div>
      </div>
    </div>
  );
}