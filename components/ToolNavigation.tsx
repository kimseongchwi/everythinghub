"use client";

import Link from 'next/link';
import { Wallet, Target, Code } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

const allTools = [
  {
    slug: 'salary-calculator',
    name: '실수령 계산기',
    description: '2026년 기준 연봉별 세후 실수령액 계산',
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    hoverBorder: 'hover:border-purple-300',
    icon: Wallet,
  },
  {
    slug: 'target-amount-simulator',
    name: '목표금액 시뮬레이터',
    description: '목표 금액까지 얼마나 걸리는지 시뮬레이션',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    hoverBorder: 'hover:border-emerald-300',
    icon: Target,
  },
  // {
  //   slug: 'code-archive',
  //   name: '코드 아카이브',
  //   description: '자주 쓰는 코드 스니펫 모음',
  //   color: 'text-slate-600',
  //   bg: 'bg-slate-100',
  //   border: 'border-slate-200',
  //   hoverBorder: 'hover:border-slate-400',
  //   icon: Code,
  // },
];

interface ToolNavigationProps {
  currentSlug: string;
}

export default function ToolNavigation({ currentSlug }: ToolNavigationProps) {
  const activeTabRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [currentSlug]);

  return (
    <nav className="w-full border-b border-gray-100 mb-12 overflow-x-auto scrollbar-hide">
      <div className="flex justify-center min-w-max px-4">
        <div className="flex gap-8">
          {allTools.map((tool) => {
            const isActive = tool.slug === currentSlug;
            const Icon = tool.icon;

            return (
              <Link
                key={tool.slug}
                ref={isActive ? activeTabRef : null}
                href={`/tools/${tool.slug}`}
                className={`
                  relative flex items-center gap-2 py-4 text-[13px] font-bold transition-all whitespace-nowrap group
                  ${isActive
                    ? `text-gray-950`
                    : `text-gray-400 hover:text-gray-600`
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? tool.color : 'text-current opacity-60'}`} />
                <span>{tool.name}</span>

                {/* Active Indicator Line */}
                <div className={`
                  absolute bottom-0 left-0 w-full h-0.5 transition-all duration-300
                  ${isActive ? `bg-gray-950 opacity-100` : `bg-gray-200 opacity-0 group-hover:opacity-100`}
                `} />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
