"use client";

import React from 'react';
import CodeArchive from './CodeArchive';

export default function CodeArchivePage() {
  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">
            코드 아카이브
          </h1>
          <p className="text-gray-500 font-medium">나만의 코드 조각과 기술 용어를 안전하게 보관하세요</p>
        </header>

        <CodeArchive />

        <footer className="mt-20 text-center text-gray-400 text-sm">
          모든 데이터는 브라우저의 로컬 저장소에 저장되어 안전하게 보호됩니다.
        </footer>
      </div>
    </div>
  );
}
