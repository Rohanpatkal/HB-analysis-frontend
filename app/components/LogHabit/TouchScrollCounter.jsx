import React, { useState, useRef } from 'react';
import DateSelector from './DateSelector';
import QuickCountChips from './QuickCountChips';
import MoodSelector from './MoodSelector';
import NotesInput from './NotesInput';
import LiveSummary from './LiveSummary';
import styles from './LogHabit.module.css';

export default function TouchScrollCounter({ onLogComplete }) {
  const [count, setCount] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Inline Detail States
  const [dateType, setDateType] = useState('Today');
  const [customDate, setCustomDate] = useState('');
  const [mood, setMood] = useState('');
  const [breakCount, setBreakCount] = useState(0);
  const [notes, setNotes] = useState('');

  // Interaction Tracking References
  const touchStartY = useRef(0);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);

  // --- Core Math Actions ---
  const handleIncrement = () => setCount(prev => prev + 1);
  const handleDecrement = () => setCount(prev => (prev > 0 ? prev - 1 : 0));

  // --- 1. Mouse Scroll Wheel (Desktop) ---
  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleIncrement();
    } else {
      handleDecrement();
    }
  };

  // --- 2. Mobile Touch Gestures (Tablet/Mobile) ---
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    const currentY = e.touches[0].clientY;
    const diff = touchStartY.current - currentY;

    if (Math.abs(diff) > 35) { // Sensitivity Threshold
      if (diff > 0) {
        handleIncrement();
      } else {
        handleDecrement();
      }
      touchStartY.current = currentY;
    }
  };

  // --- 3. Desktop Click-and-Drag Gestures ---
  const handleMouseDown = (e) => {
    isDragging.current = true;
    dragStartY.current = e.clientY;
    e.currentTarget.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    const currentY = e.clientY;
    const diff = dragStartY.current - currentY;

    if (Math.abs(diff) > 35) {
      if (diff > 0) {
        handleIncrement();
      } else {
        handleDecrement();
      }
      dragStartY.current = currentY;
    }
  };

  const handleMouseUpOrLeave = (e) => {
    isDragging.current = false;
    if (e.currentTarget) {
      e.currentTarget.style.cursor = 'ns-resize';
    }
  };

  // --- Save / Submit Logic ---
  const handleSave = async () => {
    setIsSaving(true);
    const selectedDate = dateType === 'Custom' ? customDate : dateType;
    const payload = { date: selectedDate, count, mood, breakCount, notes };

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log('Logged successfully:', payload);

      onLogComplete();

      // Reset Form State
      setCount(1);
      setMood('');
      setBreakCount(0);
      setNotes('');
      setDateType('Today');
      setIsExpanded(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-full bg-white p-6 rounded-2xl border border-slate-100 shadow-sm select-none transition-all duration-300">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">🚬 Log Habit</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Use buttons, scroll wheel, phone swipe, or drag numbers directly.
        </p>
      </div>

      {/* Tactile Row Container holding Buttons + Central Counter Wheel */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-5 w-full">

        {/* Decrement Button */}
        <button
          type="button"
          onClick={handleDecrement}
          className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-rose-50 border border-slate-100 hover:border-rose-200 text-slate-600 hover:text-rose-600 rounded-xl font-bold text-xl transition-all active:scale-95 shadow-sm"
        >
          -
        </button>

        {/* Central Dynamic Wheel Element */}
        <div
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="flex-1 w-full min-w-0 bg-slate-50 rounded-2xl py-4 flex flex-col items-center justify-center border border-slate-100 hover:border-emerald-200 transition-colors group"
          style={{ cursor: 'ns-resize' }}
        >
          <span className="text-slate-300 text-[10px] tracking-wide opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            ▲ Drag / Scroll Up
          </span>
          <div className="text-4xl font-black text-slate-800 my-1 font-mono tracking-tight pointer-events-none">
            {count}
          </div>
          <span className="text-slate-300 text-[10px] tracking-wide opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            ▼ Drag / Scroll Down
          </span>
        </div>

        {/* Increment Button */}
        <button
          type="button"
          onClick={handleIncrement}
          className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 text-slate-600 hover:text-emerald-600 rounded-xl font-bold text-xl transition-all active:scale-95 shadow-sm"
        >
          +
        </button>

      </div>

      {/* Collapsible Details Panel Trigger */}
      <button
        type="button"
        className={styles.detailsToggle}
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}
      >
        {isExpanded ? '▼ Hide Detailed Parameters' : '▶ Add Date, Mood or Notes'}
      </button>

      {/* Embedded Extra Fields Section */}
      <div className={`${styles.detailsContent} ${isExpanded ? styles.detailsContentExpanded : ''}`}>
        <div className="border-t border-slate-100 pt-4 flex flex-col gap-5">
          <div>
            <span className={styles.sectionLabel}>Date</span>
            <DateSelector
              dateType={dateType}
              setDateType={setDateType}
              customDate={customDate}
              setCustomDate={setCustomDate}
            />
          </div>

          <div>
            <span className={styles.sectionLabel}>Quick Count Modifiers</span>
            <QuickCountChips currentCount={count} onChange={setCount} />
          </div>

          <div>
            <span className={styles.sectionLabel}>Mood Selector</span>
            <MoodSelector selected={mood} onChange={setMood} />
          </div>

          <div>
            <span className={styles.sectionLabel}>Habit Break Count</span>
            <div className="w-full max-w-xs mx-auto scale-90">
              <div className="flex items-center justify-between border border-slate-200 rounded-xl p-1 bg-slate-50">
                <button type="button" className="px-3 font-bold" onClick={() => setBreakCount(b => b > 0 ? b - 1 : 0)}>-</button>
                <span className="font-bold font-mono">{breakCount}</span>
                <button type="button" className="px-3 font-bold" onClick={() => setBreakCount(b => b + 1)}>+</button>
              </div>
            </div>
          </div>

          <div>
            <span className={styles.sectionLabel}>Notes</span>
            <NotesInput value={notes} onChange={setNotes} />
          </div>

          <LiveSummary dateType={dateType} count={count} breakCount={breakCount} mood={mood} />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-200 text-white font-medium py-3 rounded-xl transition-all text-sm text-center shadow-sm"
      >
        {isSaving ? "Syncing Metrics..." : `Instant Log: ${count} Cigarettes`}
      </button>
    </div>
  );
}