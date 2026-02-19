
import React from 'react';
import { Metadata } from 'next';
import CodeArchive from './CodeArchive';

export const metadata: Metadata = {
  title: '코드 아카이브 | Everything Hub',
  description: '중요한 코드 조각(Snippet)과 잊어버리기 쉬운 기술 용어를 한곳에 보관하세요. 브라우저 로컬 저장소를 이용해 데이터가 안전하게 보호되며, 언제든 쉽고 빠르게 검색할 수 있습니다.',
  keywords: ['코드 아카이브', '코드 스니펫', '개발 노트', '기술 블로그', 'Snippet 보관함', '개발자 도구', '로컬 스토리지 메모', '프로그래밍 아카이브'],
};

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
