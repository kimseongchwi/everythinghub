"use client";

import React from 'react';
import TargetAmountSimulator from './TargetAmountSimulator';

export default function TargetAmountSimulatorPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">
            목표금액 시뮬레이터
          </h1>
        </header>

        {/* 인터랙티브 시뮬레이터 컴포넌트 */}
        <TargetAmountSimulator />

        <footer className="mt-20 text-center text-gray-400 text-sm">
          목표 달성을 위한 모든 계산은 입력된 저축액 상수를 기준으로 시뮬레이션됩니다.
        </footer>
      </div>
    </div>
  );
}
