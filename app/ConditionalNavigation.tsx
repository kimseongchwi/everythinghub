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
  const isNoNav = pathname?.startsWith('/admin') || pathname?.startsWith('/portfolio');

  if (isNoNav) {
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
      <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex justify-between items-center">
          <Link href="/" className="text-[10px] font-black tracking-[0.3em] text-gray-900 uppercase whitespace-nowrap hover:opacity-70 transition-all">
            Everything Hub
          </Link>
          <nav className="flex gap-6 text-[11px] font-bold text-gray-400 items-center">
            <Link href="/" className="hover:text-black transition-colors uppercase tracking-widest">Home</Link>
            {process.env.NODE_ENV === 'development' && (
              <Link href="/admin" className="hover:text-black transition-colors uppercase tracking-widest">
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
      <footer className="py-8 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 mb-3 text-[11px] font-bold text-gray-400 tracking-tight">
            <Link href="/privacy" className="hover:text-black transition-colors">개인정보처리방침</Link>
            <span className="hidden md:inline text-gray-200">|</span>
            <Link href="/terms" className="hover:text-black transition-colors">이용약관</Link>
            <span className="hidden md:inline text-gray-200">|</span>
            <Link href="/contact" className="hover:text-black transition-colors">문의하기</Link>
            <span className="hidden md:inline text-gray-200">|</span>
            <div className="flex gap-4 text-[10px] tracking-normal">
              <a href="mailto:kimsung01265@gmail.com" className="hover:text-black transition-colors lowercase">kimsung01265@gmail.com</a>
              <a href="mailto:ghfkddl665@naver.com" className="hover:text-black transition-colors lowercase">ghfkddl665@naver.com</a>
            </div>
          </div>
          <p className="text-[10px] text-gray-300 font-bold tracking-[0.2em]">
            © {new Date().getFullYear()} Everything Hub.
          </p>
        </div>
      </footer>
    </body>
  );
}
