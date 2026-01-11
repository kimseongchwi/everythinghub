
"use client";

import React from 'react';
import styles from './salary.module.css';
import ProjectBadge from '@/components/ProjectBadge';
import SalaryCalculator from './SalaryCalculator';

export default function SalaryCalculatorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  return (
    <div className={styles.container}>
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <span className={styles.badge}>PROJECT {id}</span>
          <h1 className="text-4xl md:text-5xl font-black mt-4 text-gray-900 tracking-tight">
            실수령 계산기
          </h1>
          <p className="text-gray-500 mt-3 text-lg">
            급여 입력부터 감면 혜택까지 반영한 상세 리포트입니다.
          </p>
        </header>

        {/* 인터랙티브 계산기 컴포넌트 */}
        <SalaryCalculator />

        <footer className="mt-20 text-center text-gray-400 text-sm">
          사용된 모든 계산값은 2025년 기준 간이 세액표를 근거로 합니다.
        </footer>
      </div>
    </div>
  );
}
