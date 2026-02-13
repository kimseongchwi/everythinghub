
"use client";

import React from 'react';
import styles from './salary.module.css';
import SalaryCalculator from './SalaryCalculator';

export default function SalaryCalculatorPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">
            실수령 계산기
          </h1>
        </header>

        {/* 인터랙티브 계산기 컴포넌트 */}
        <SalaryCalculator />

        <footer className="mt-20 text-center text-gray-400 text-sm">
          사용된 모든 계산값은 2026년 기준 실측 데이터를 근거로 합니다.
        </footer>
      </div>
    </div>
  );
}
