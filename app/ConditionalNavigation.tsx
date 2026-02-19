"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import React from 'react';

export default function ConditionalNavigation({
  children,
  notoSansKrClassName
}: {
  children: React.ReactNode;
  notoSansKrClassName: string;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return (
      <body className={`${notoSansKrClassName} antialiased bg-white text-gray-900 min-h-screen flex flex-col`}>
        <main className="flex-grow">
          {children}
        </main>
      </body>
    );
  }

  return (
    <body className={`${notoSansKrClassName} antialiased bg-white text-gray-900 min-h-screen flex flex-col`}>
      {/* 공통 헤더 */}
      <header className="sticky top-0 z-[100] bg-[#f5f5f5] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex justify-between items-center">
          <Link href="/" className="text-[11px] font-black tracking-[0.2em] md:tracking-[0.4em] text-gray-950 uppercase whitespace-nowrap transition-all">
            Everything Hub
          </Link>
          <nav className="flex gap-8 text-[12px] font-bold text-gray-400 items-center">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            {process.env.NODE_ENV === 'development' && (
              <Link href="/admin" className="hover:text-blue-600 transition-colors">
                Admin
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* 페이지별 실제 콘텐츠 */}
      <main className="flex-grow">
        {children}
      </main>

      {/* 공통 푸터 */}
      <footer className="py-12 bg-[#f5f5f5] border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mb-6 text-[11px] font-bold text-gray-500 tracking-wider">
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">개인정보처리방침</Link>
            <span className="hidden md:inline text-gray-300">|</span>
            <div className="flex flex-col md:flex-row gap-1 md:gap-2 items-center">
              <span className="">문의:</span>
              <a href="mailto:kimsung01265@gmail.com" className="hover:text-blue-600 transition-colors">kimsung01265@gmail.com</a>
              <span className="hidden md:inline text-gray-300">/</span>
              <a href="mailto:ghfkddl665@naver.com" className="hover:text-blue-600 transition-colors">ghfkddl665@naver.com</a>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
            Copyright © {new Date().getFullYear()} Everything Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </body>
  );
}
