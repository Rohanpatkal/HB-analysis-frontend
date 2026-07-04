import React, { useState } from 'react';
import DateSelector from './DateSelector';
import QuickCountChips from './QuickCountChips';
import NumberPicker from './NumberPicker';
import MoreDetails from './MoreDetails';
import LiveSummary from './LiveSummary';
import SaveButton from './SaveButton';
import styles from './LogHabit.module.css';

export default function LogHabitDrawer({ isOpen, onClose, onSaveSuccess }) {
  const [dateType, setDateType] = useState('Today'); // Today, Yesterday, Custom
  const [customDate, setCustomDate] = useState('');
  const [count, setCount] = useState(0);
  
  // Expanded Section States
  const [mood, setMood] = useState('');
  const [breakCount, setBreakCount] = useState(0);
  const [notes, setNotes] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    
    // Construct payload
    const selectedDate = dateType === 'Custom' ? customDate : dateType;
    const payload = { date: selectedDate, count, mood, breakCount, notes };
    
    try {
      // Simulate API production request
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Saved habit successfully:', payload);
      
      setIsSuccess(true);
      
      // Auto close and refresh after showing success check
      setTimeout(() => {
        onSaveSuccess(); // Trigger metrics reload
        onClose();
        // Reset local states
        setCount(0);
        setMood('');
        setBreakCount(0);
        setNotes('');
        setDateType('Today');
        setIsSuccess(false);
        setIsSaving(false);
      }, 800);
    } catch (err) {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <div className={styles.drawerContainer} onClick={(e) => e.stopPropagation()}>
        
        {/* Scrollable Body Container */}
        <div className={styles.drawerBody}>
          <div className={styles.header}>
            <div className={styles.title}>
              <h2>🚬 Log Habit</h2>
              <p>Record your activity in just a few seconds.</p>
            </div>
            <button className={styles.closeButton} onClick={onClose}>&times;</button>
          </div>

          {/* Date Picker Row */}
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Date</span>
            <DateSelector 
              dateType={dateType} 
              setDateType={setDateType} 
              customDate={customDate} 
              setCustomDate={setCustomDate} 
            />
          </div>

          {/* Count Primary Section */}
          <div className={styles.section}>
            <span className={styles.sectionLabel}>🚬 Cigarettes Smoked</span>
            <QuickCountChips currentCount={count} onChange={setCount} />
            <NumberPicker value={count} onChange={setCount} />
          </div>

          {/* More Details Collapsible Container */}
          <MoreDetails 
            mood={mood} 
            setMood={setMood} 
            breakCount={breakCount} 
            setBreakCount={setBreakCount} 
            notes={notes} 
            setNotes={setNotes} 
          />

          {/* Real-time Dynamic Live Summary */}
          <LiveSummary dateType={dateType} count={count} breakCount={breakCount} mood={mood} />
        </div>

        {/* Sticky Action Footer */}
        <div className={styles.footer}>
          <SaveButton isSaving={isSaving} isSuccess={isSuccess} onSave={handleSave} />
        </div>

      </div>
    </div>
  );
}