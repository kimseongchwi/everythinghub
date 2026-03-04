"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const CustomDatePicker: React.FC<Props> = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  const initialDate = value ? new Date(value) : new Date();
  const [tempYear, setTempYear] = useState(initialDate.getFullYear());
  const [tempMonth, setTempMonth] = useState(initialDate.getMonth());
  const [tempDay, setTempDay] = useState(initialDate.getDate());

  const containerRef = useRef<HTMLDivElement>(null);
  const yearScrollRef = useRef<HTMLDivElement>(null);
  const monthScrollRef = useRef<HTMLDivElement>(null);
  const dayScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const d = value ? new Date(value) : new Date();
      setTempYear(d.getFullYear());
      setTempMonth(d.getMonth());
      setTempDay(d.getDate());

      setTimeout(() => scrollToSelected(), 50);
    }
  }, [value, isOpen]);

  // Click outside close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToSelected = () => {
    const refs = [
      { ref: yearScrollRef, selector: '[data-selected="year"]' },
      { ref: monthScrollRef, selector: '[data-selected="month"]' },
      { ref: dayScrollRef, selector: '[data-selected="day"]' }
    ];

    refs.forEach(({ ref, selector }) => {
      if (ref.current) {
        const selectedItem = ref.current.querySelector(selector) as HTMLElement;
        if (selectedItem) {
          ref.current.scrollTop = selectedItem.offsetTop - ref.current.clientHeight / 2 + selectedItem.clientHeight / 2;
        }
      }
    });
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleConfirm = () => {
    const maxDays = getDaysInMonth(tempYear, tempMonth);
    const validDay = Math.min(tempDay, maxDays);
    const newDate = new Date(tempYear, tempMonth, validDay);

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
    <div className="relative w-full" ref={containerRef}>
      {label && <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">{label}</label>}

      <div
        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${isOpen ? 'border-black ring-1 ring-black bg-white' : 'border-gray-200 bg-gray-50 hover:bg-white'
          }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`text-[0.95rem] ${value ? 'text-black font-medium' : 'text-gray-400'}`}>
          {value ? value : '연도-월-일 선택'}
        </span>
        <CalendarIcon size={18} className={isOpen ? 'text-black' : 'text-gray-400'} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-5 bg-white border border-gray-200 shadow-xl rounded-xl z-[1001] w-[320px]">
          <div className="flex bg-gray-50 border border-gray-100 rounded-lg overflow-hidden h-[220px]">
            {/* Year Column */}
            <div className="flex-1 flex flex-col border-r border-gray-100">
              <div className="bg-gray-100 text-[0.65rem] font-black text-gray-400 text-center py-1.5 uppercase tracking-tighter border-b border-gray-200/50">Year</div>
              <div className="flex-1 overflow-y-auto scrollbar-hide py-10" ref={yearScrollRef}>
                {years.map(y => (
                  <div
                    key={y}
                    data-selected={tempYear === y ? "year" : ""}
                    className={`text-center py-2 text-sm cursor-pointer transition-all ${tempYear === y ? 'bg-black text-white font-bold scale-110 rounded-sm' : 'text-gray-400 hover:text-black'
                      }`}
                    onClick={() => setTempYear(y)}
                  >
                    {y}
                  </div>
                ))}
                <div className="h-10" />
              </div>
            </div>

            {/* Month Column */}
            <div className="flex-1 flex flex-col border-r border-gray-100">
              <div className="bg-gray-100 text-[0.65rem] font-black text-gray-400 text-center py-1.5 uppercase tracking-tighter border-b border-gray-200/50">Month</div>
              <div className="flex-1 overflow-y-auto scrollbar-hide py-10" ref={monthScrollRef}>
                {months.map(m => (
                  <div
                    key={m}
                    data-selected={tempMonth === m ? "month" : ""}
                    className={`text-center py-2 text-sm cursor-pointer transition-all ${tempMonth === m ? 'bg-black text-white font-bold scale-110 rounded-sm' : 'text-gray-400 hover:text-black'
                      }`}
                    onClick={() => setTempMonth(m)}
                  >
                    {m + 1}월
                  </div>
                ))}
                <div className="h-10" />
              </div>
            </div>

            {/* Day Column */}
            <div className="flex-1 flex flex-col">
              <div className="bg-gray-100 text-[0.65rem] font-black text-gray-400 text-center py-1.5 uppercase tracking-tighter border-b border-gray-200/50">Day</div>
              <div className="flex-1 overflow-y-auto scrollbar-hide py-10" ref={dayScrollRef}>
                {days.map(d => (
                  <div
                    key={d}
                    data-selected={tempDay === d ? "day" : ""}
                    className={`text-center py-2 text-sm cursor-pointer transition-all ${tempDay === d ? 'bg-black text-white font-bold scale-110 rounded-sm' : 'text-gray-400 hover:text-black'
                      }`}
                    onClick={() => setTempDay(d)}
                  >
                    {d}일
                  </div>
                ))}
                <div className="h-10" />
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              type="button"
              className="flex-1 py-2 px-4 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              취소
            </button>
            <button
              type="button"
              className="flex-1 py-2 px-4 bg-black text-white text-sm font-bold rounded-lg hover:opacity-80 transition-opacity"
              onClick={handleConfirm}
            >
              선택 완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
