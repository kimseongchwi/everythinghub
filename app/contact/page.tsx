
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '문의하기 | Everything Hub',
  description: 'Everything Hub 서비스 이용 관련 문의 페이지입니다.',
};

export default async function ContactPage() {
  // 시각적인 일관성을 위해 약간의 지연 추가
  await new Promise(resolve => setTimeout(resolve, 500));

  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto prose prose-slate">
        <h1 className="text-3xl font-black text-gray-950 mb-10 tracking-tight">문의하기</h1>

        <div className="space-y-12 text-gray-700 leading-relaxed text-[15px]">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6">서비스 이용 및 제휴 문의</h2>
            <p className="mb-8">
              Everything Hub를 이용해 주셔서 감사합니다. 서비스 이용 중 궁금한 점이 있으시거나, 
              오류 제보, 기능 제안, 혹은 기타 제휴 문의가 있으시면 아래의 채널을 통해 언제든지 연락 부탁드립니다.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 group hover:border-blue-200 transition-all duration-300">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Email Channel 01</h3>
                <a 
                  href="mailto:kimsung01265@gmail.com" 
                  className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors break-all"
                >
                  kimsung01265@gmail.com
                </a>
              </div>

              <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 group hover:border-blue-200 transition-all duration-300">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Email Channel 02</h3>
                <a 
                  href="mailto:ghfkddl665@naver.com" 
                  className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors break-all"
                >
                  ghfkddl665@naver.com
                </a>
              </div>
            </div>
          </section>

          <section className="bg-blue-50/50 p-8 rounded-2xl border border-blue-50">
            <h2 className="text-lg font-bold text-gray-900 mb-4">답변 안내</h2>
            <p className="text-gray-600 text-sm">
              보내주신 소중한 의견은 운영자가 매일 확인하고 있습니다. 
              내용에 따라 답변에 1~3일 정도 소요될 수 있는 점 양해 부탁드립니다. 
              최대한 빠르게 확인하여 답변드릴 수 있도록 노력하겠습니다.
            </p>
          </section>
        </div>

        <div className="mt-24 pt-8 border-t border-gray-100 text-gray-400 text-xs">
          최종 업데이트: 2026년 3월 12일
        </div>
      </div>
    </div>
  );
}
