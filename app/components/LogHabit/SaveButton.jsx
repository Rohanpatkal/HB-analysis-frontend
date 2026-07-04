import React from 'react';
import styles from './LogHabit.module.css';

export default function SaveButton({ isSaving, isSuccess, onSave }) {
  return (
    <button 
      className={styles.saveBtn} 
      onClick={onSave} 
      disabled={isSaving || isSuccess}
    >
      {isSuccess ? (
        <span className={styles.successCheck}>✓ Saved</span>
      ) : isSaving ? (
        <span>Saving...</span>
      ) : (
        'Save Habit'
      )}
    </button>
  );
}