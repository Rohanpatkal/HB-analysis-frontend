"use client";

// NumberPicker — reusable scroll/click/keyboard number input.
// Used for cigarette count, habit break count, or any integer field.

import { useRef } from "react";
import styles from "./LogHabit.module.css";

export default function NumberPicker({ value, onChange, min = 0, label }) {
  const dragRef = useRef(null); // tracks touch/mouse drag start Y

  function increment() {
    onChange(value + 1);
  }

  function decrement() {
    if (value > min) onChange(value - 1);
  }

  // Keyboard input — only allow positive whole numbers.
  function handleKeyInput(e) {
    const parsed = parseInt(e.target.value, 10);
    if (!isNaN(parsed) && parsed >= min) {
      onChange(parsed);
    } else if (e.target.value === "") {
      onChange(min);
    }
  }

  // Mouse wheel — scroll up = increase, scroll down = decrease.
  function handleWheel(e) {
    e.preventDefault();
    if (e.deltaY < 0) increment();
    else decrement();
  }

  // Touch swipe — swipe up = increase, swipe down = decrease.
  function handleTouchStart(e) {
    dragRef.current = e.touches[0].clientY;
  }

  function handleTouchMove(e) {
    if (dragRef.current === null) return;
    const delta = dragRef.current - e.touches[0].clientY;
    if (Math.abs(delta) > 12) {
      if (delta > 0) increment();
      else decrement();
      dragRef.current = e.touches[0].clientY;
    }
  }

  const above = value > min ? value - 1 : null;
  const below = value + 1;

  return (
    <div className={styles.section}>
      {label && <div className={styles.sectionLabel}>{label}</div>}

      <div className={styles.pickerWrap}>
        {/* Decrement */}
        <button
          className={styles.pickerBtn}
          onClick={decrement}
          disabled={value <= min}
          aria-label="Decrease"
          type="button"
        >
          −
        </button>

        {/* Scroll window */}
        <div
          className={styles.pickerWindow}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <div className={styles.pickerNumbers}>
            {/* Number above (ghost) */}
            <div className={styles.pickerNumAbove}>
              {above !== null ? above : ""}
            </div>

            {/* Current value — editable */}
            <div className={styles.pickerNum}>
              <input
                className={styles.pickerInput}
                type="number"
                value={value}
                onChange={handleKeyInput}
                min={min}
                aria-label={label || "count"}
              />
            </div>

            {/* Number below (ghost) */}
            <div className={styles.pickerNumBelow}>{below}</div>
          </div>
        </div>

        {/* Increment */}
        <button
          className={styles.pickerBtn}
          onClick={increment}
          aria-label="Increase"
          type="button"
        >
          +
        </button>
      </div>
    </div>
  );
}
