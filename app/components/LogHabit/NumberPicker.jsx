import React, { useRef } from 'react';
import styles from './LogHabit.module.css';

export default function NumberPicker({ value, onChange }) {
  const pickerRef = useRef(null);

  const handleIncrement = () => onChange(value + 1);
  const handleDecrement = () => {
    if (value > 0) onChange(value - 1);
  };

  // Keyboard native filtering
  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val === '') {
      onChange(0);
      return;
    }
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      onChange(parsed);
    }
  };

  // Modern Wheel Interaction Logic
  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleIncrement();
    } else {
      handleDecrement();
    }
  };

  // Mobile Swipe Integration Framework
  let touchStart = 0;
  const handleTouchStart = (e) => {
    touchStart = e.touches[0].clientY;
  };
  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientY;
    if (touchStart - touchEnd > 30) handleDecrement(); // swiped up
    if (touchEnd - touchStart > 30) handleIncrement(); // swiped down
  };

  return (
    <div className={styles.pickerWrapper}>
      <button type="button" className={styles.wheelControl} onClick={handleIncrement}>▲</button>
      
      <div 
        className={styles.wheelContainer} 
        ref={pickerRef}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.wheelRow}>{value > 0 ? value - 1 : ''}</div>
        <div className={`${styles.wheelRow} ${styles.wheelRowActive}`}>
          <input 
            type="text" 
            className={styles.inputField} 
            value={value} 
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.wheelRow}>{value + 1}</div>
      </div>

      <div className={styles.mainControls}>
        <button type="button" className={styles.controlBtn} onClick={handleDecrement}>-</button>
        <button type="button" className={styles.controlBtn} onClick={handleIncrement}>+</button>
      </div>
    </div>
  );
}