
"use client";

import React from 'react';
import styles from './salary.module.css';
import SalaryCalculator from './SalaryCalculator';

export default function SalaryCalculatorPage() {
  return (
    <div className={styles.container}>
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-none">
            실수령 <span className="text-blue-600">계산기</span>
          </h1>
          <p className="text-gray-500 mt-6 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
            2026년 최신 요율을 반영한 정밀 급여 리포트. <br className="hidden md:block" />
            각종 세금 공제부터 감면 혜택까지 한눈에 확인하세요.
          </p>
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
