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

  // Inline detail states
  const [dateType, setDateType] = useState('Today');
  const [customDate, setCustomDate] = useState('');
  const [mood, setMood] = useState('');
  const [breakCount, setBreakCount] = useState(0);
  const [notes, setNotes] = useState('');

  // Interaction refs
  const touchStartY = useRef(0);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);

  const handleIncrement = () => setCount((c) => c + 1);
  const handleDecrement = () => setCount((c) => (c > 0 ? c - 1 : 0));

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e) => {
    const currentY = e.touches[0].clientY;
    const diff = touchStartY.current - currentY;
    if (Math.abs(diff) > 30) {
      if (diff > 0) handleIncrement();
      else handleDecrement();
      touchStartY.current = currentY;
    }
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    dragStartY.current = e.clientY;
    e.currentTarget.style.cursor = 'grabbing';
  };
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const currentY = e.clientY;
    const diff = dragStartY.current - currentY;
    if (Math.abs(diff) > 30) {
      if (diff > 0) handleIncrement();
      else handleDecrement();
      dragStartY.current = currentY;
    }
  };
  const handleMouseUpOrLeave = (e) => {
    isDragging.current = false;
    if (e.currentTarget) e.currentTarget.style.cursor = 'ns-resize';
  };

  const handleSave = async () => {
    setIsSaving(true);
    const selectedDate = dateType === 'Custom' ? customDate : dateType;
    const payload = { date: selectedDate, count, mood, breakCount, notes };
    try {
      // simulate API
      await new Promise((r) => setTimeout(r, 700));
      console.log('Logged', payload);
      if (typeof onLogComplete === 'function') onLogComplete();
      // reset
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
        <p className="text-xs text-slate-500 mt-0.5">Use buttons, click-and-drag, or swipe numbers on mobile to change count.</p>
      </div>

      {/* Counter card */}
      <div className="mt-6 w-full">
        <div className="w-full bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-center gap-6 w-full">
            <button type="button" onClick={handleDecrement} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 rounded-lg font-bold text-xl shadow-sm">-</button>

            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              className="flex-1 min-w-0 bg-white rounded-xl py-8 flex items-center justify-center border border-slate-100"
            >
              <div className="text-6xl md:text-7xl font-extrabold text-slate-800 font-mono">{count}</div>
            </div>

            <button type="button" onClick={handleIncrement} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 rounded-lg font-bold text-xl shadow-sm">+</button>
          </div>
        </div>
      </div>

      {/* Details accordion */}
      <div className="mt-6 w-full">
        <button type="button" className={`${styles.detailsToggle} w-full text-left`} onClick={() => setIsExpanded((s) => !s)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isExpanded ? '▼ Hide Detailed Parameters' : '▶ Add Date, Mood or Notes'}
        </button>

        <div className={`${styles.detailsContent} ${isExpanded ? styles.detailsContentExpanded : ''}`}>
          <div className="border-t border-slate-100 pt-4 flex flex-col gap-6">
            <div>
              <span className={styles.sectionLabel}>Date</span>
              <DateSelector dateType={dateType} setDateType={setDateType} customDate={customDate} setCustomDate={setCustomDate} />
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
              <div className="w-full">
                <div className="flex items-center justify-between border border-slate-200 rounded-xl p-2 bg-slate-50">
                  <button type="button" className="px-3 font-bold" onClick={() => setBreakCount((b) => (b > 0 ? b - 1 : 0))}>-</button>
                  <span className="font-bold font-mono">{breakCount}</span>
                  <button type="button" className="px-3 font-bold" onClick={() => setBreakCount((b) => b + 1)}>+</button>
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
      </div>

      <div className="mt-6 w-full">
        <button onClick={handleSave} disabled={isSaving} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-200 text-white font-medium py-3 rounded-xl transition-all text-sm text-center shadow-sm">
          {isSaving ? 'Syncing Metrics...' : `Instant Log: ${count} Cigarettes`}
        </button>
      </div>
    </div>
  );
}
