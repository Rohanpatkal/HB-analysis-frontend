import React, { useState } from 'react';
import styles from './LogHabit.module.css';

export default function DateSelector({ dateType, setDateType, customDate, setCustomDate }) {
  const [isOpen, setIsOpen] = useState(false);

  const getDisplayDate = () => {
    if (dateType === 'Today') return '📅 Today • ' + new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    if (dateType === 'Yesterday') return '📅 Yesterday';
    return customDate ? `📅 ${customDate}` : '📅 Select Custom Date';
  };

  const maxDate = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div className={styles.dateTrigger} onClick={() => setIsOpen(!isOpen)}>
        {getDisplayDate()}
      </div>
      
      {isOpen && (
        <div className={styles.dropdownOptions}>
          <div className={styles.dropdownOption} onClick={() => { setDateType('Today'); setIsOpen(false); }}>Today</div>
          <div className={styles.dropdownOption} onClick={() => { setDateType('Yesterday'); setIsOpen(false); }}>Yesterday</div>
          <div className={styles.dropdownOption} onClick={() => { setDateType('Custom'); setIsOpen(false); }}>Custom Date</div>
        </div>
      )}

      {dateType === 'Custom' && (
        <input 
          type="date" 
          max={maxDate} 
          value={customDate} 
          onChange={(e) => setCustomDate(e.target.value)} 
          className={styles.customDateInput}
        />
      )}
    </div>
  );
}