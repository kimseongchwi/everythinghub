"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import styles from './datepicker.module.css';

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const CustomDatePicker: React.FC<Props> = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Use current date as fallback for initial view
  const initialDate = value ? new Date(value) : new Date();
  const [tempYear, setTempYear] = useState(initialDate.getFullYear());
  const [tempMonth, setTempMonth] = useState(initialDate.getMonth());
  const [tempDay, setTempDay] = useState(initialDate.getDate());

  const containerRef = useRef<HTMLDivElement>(null);
  const yearScrollRef = useRef<HTMLDivElement>(null);
  const monthScrollRef = useRef<HTMLDivElement>(null);
  const dayScrollRef = useRef<HTMLDivElement>(null);

  // Sync temp values when value prop changes or opening
  useEffect(() => {
    if (isOpen) {
      const d = value ? new Date(value) : new Date();
      setTempYear(d.getFullYear());
      setTempMonth(d.getMonth());
      setTempDay(d.getDate());

      // Small delay to allow list to render before scrolling
      setTimeout(() => scrollToSelected(), 50);
    }
  }, [value, isOpen]);

  const scrollToSelected = () => {
    const refs = [yearScrollRef, monthScrollRef, dayScrollRef];
    refs.forEach(ref => {
      if (ref.current) {
        const selectedItem = ref.current.querySelector(`.${styles.pickerItemSelected}`);
        if (selectedItem) {
          selectedItem.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
      }
    });
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleConfirm = () => {
    // Ensure day is valid for the selected month/year
    const maxDays = getDaysInMonth(tempYear, tempMonth);
    const validDay = Math.min(tempDay, maxDays);

    const newDate = new Date(tempYear, tempMonth, validDay);
    // Format as YYYY-MM-DD local time
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const day = String(newDate.getDate()).padStart(2, '0');

    onChange(`${year}-${month}-${day}`);
    setIsOpen(false);
  };

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 70 + i).reverse();
  const months = Array.from({ length: 12 }, (_, i) => i);
  const days = Array.from({ length: getDaysInMonth(tempYear, tempMonth) }, (_, i) => i + 1);

  return (
    <div className={styles.datePickerWrapper} ref={containerRef}>
      {label && <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">{label}</label>}
      <div
        className={`${styles.inputWrapper} ${isOpen ? styles.inputWrapperActive : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.label}>
          {value ? value : '연도-월-일'}
        </span>
        <CalendarIcon size={18} className={styles.icon} />
      </div>

      {isOpen && (
        <div className={styles.calendarContainer}>
          <div className={styles.pickerColumns}>
            {/* Year Column */}
            <div className={styles.column} ref={yearScrollRef}>
              <div className={styles.columnHeader}>Year</div>
              {years.map(y => (
                <div
                  key={y}
                  className={`${styles.pickerItem} ${tempYear === y ? styles.pickerItemSelected : ''}`}
                  onClick={() => setTempYear(y)}
                >
                  {y}
                </div>
              ))}
            </div>

            {/* Month Column */}
            <div className={styles.column} ref={monthScrollRef}>
              <div className={styles.columnHeader}>Month</div>
              {months.map(m => (
                <div
                  key={m}
                  className={`${styles.pickerItem} ${tempMonth === m ? styles.pickerItemSelected : ''}`}
                  onClick={() => setTempMonth(m)}
                >
                  {m + 1}월
                </div>
              ))}
            </div>

            {/* Day Column */}
            <div className={styles.column} ref={dayScrollRef}>
              <div className={styles.columnHeader}>Day</div>
              {days.map(d => (
                <div
                  key={d}
                  className={`${styles.pickerItem} ${tempDay === d ? styles.pickerItemSelected : ''}`}
                  onClick={() => setTempDay(d)}
                >
                  {d}일
                </div>
              ))}
            </div>
          </div>

          <div className={styles.pickerActions}>
            <button className={`${styles.actionBtn} ${styles.cancelBtn}`} onClick={() => setIsOpen(false)}>
              취소
            </button>
            <button className={`${styles.actionBtn} ${styles.confirmBtn}`} onClick={handleConfirm}>
              선택 완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
