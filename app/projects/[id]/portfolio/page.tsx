
"use client";

import React from 'react';
import Link from 'next/link';
import styles from './portfolio.module.css';
import ProjectBadge from '@/components/ProjectBadge';
import InteractiveCard from './InteractiveCard';

export default function PortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  const handleInternalAlert = () => {
    alert(`현재 이 페이지는 [프로젝트 ${id}] 포트폴리오입니다.`);
  };

  return (
    <main className={styles.portfolioContainer}>
      <div className="max-w-4xl mx-auto pt-10">

        <header className="mb-16">
          <ProjectBadge text={`PROJECT ${id}`} color="blue" />

          <h1 className={`${styles.titleGlow} mt-4`}>
            개인 포트폴리오
          </h1>

          <div className="flex gap-4 mt-8">
            <button
              onClick={handleInternalAlert}
              className={styles.customButton}
            >
              상태 알림 실행
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className={`${styles.card} flex flex-col justify-center`}>
            <h2 className="text-2xl font-bold mb-4">프로젝트 소개</h2>
            <p className="text-gray-600 leading-relaxed">
              이 포트폴리오는 깔끔하고 직관적인 디자인을 목표로 제작되었습니다.
              Next.js와 Tailwind CSS를 활용하여 최적화된 성능을 제공합니다.
            </p>
            <div className="flex flex-wrap gap-2 mt-6">
              <ProjectBadge text="Next.js 15" color="purple" />
              <ProjectBadge text="React 19" color="blue" />
              <ProjectBadge text="Tailwind" color="green" />
            </div>
          </div>

          <div className={styles.card}>
            <h2 className="text-xl font-bold mb-6">프로젝트 상세</h2>
            <ul className="space-y-4 text-gray-600 text-sm">
              <li className="flex justify-between border-b border-gray-100 pb-2">
                <span className="font-medium text-gray-400">버전</span>
                <span className="text-gray-900 font-semibold">v1.2.0</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 pb-2">
                <span className="font-medium text-gray-400">카테고리</span>
                <span className="text-gray-900 font-semibold">Web Showcase</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 pb-2">
                <span className="font-medium text-gray-400">테마</span>
                <span className="text-gray-900 font-semibold">Light & Minimal</span>
              </li>
            </ul>
          </div>
        </section>

        <InteractiveCard />

      </div>
    </main>
  );
}
