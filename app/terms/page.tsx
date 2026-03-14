
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관 | Everything Hub',
  description: 'Everything Hub의 서비스 이용약관입니다.',
};

export default async function TermsPage() {
  // 시각적인 일관성을 위해 약간의 지연 추가
  await new Promise(resolve => setTimeout(resolve, 500));

  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto prose prose-slate">
        <h1 className="text-3xl font-black text-gray-950 mb-10 tracking-tight">이용약관</h1>

        <div className="space-y-8 text-gray-700 leading-relaxed text-[15px]">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 1 조 (목적)</h2>
            <p>
              본 약관은 Everything Hub(이하 "서비스")가 제공하는 모든 제반 서비스의 이용과 관련하여 운영자와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 2 조 (용어의 정의)</h2>
            <p>
              "서비스"란 Everything Hub 웹사이트를 통해 제공되는 도구, 포트폴리오 및 기타 정보 서비스를 의미합니다.
              "이용자"란 서비스를 이용하는 모든 방문객을 의미합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 3 조 (서비스의 제공 및 변경)</h2>
            <p>
              본 서비스는 별도의 유지보수 기간 외에는 24시간 제공을 원칙으로 하나, 운영 환경에 따라 예고 없이 변경되거나 중단될 수 있습니다.
              제공되는 모든 도구는 이용자의 편의를 위한 것이며, 결과물에 대한 최종 확인 책임은 이용자에게 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 4 조 (저작권의 귀속)</h2>
            <p>
              서비스에 게시된 모든 콘텐츠(텍스트, 디자인, 로직 등)의 저작권은 Everything Hub 운영자에게 있습니다.
              이용자는 운영자의 사전 승낙 없이 복제, 송신, 출판, 배포 등을 할 수 없습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 5 조 (면책 조항)</h2>
            <p>
              운영자는 천재지변, 서버 점검 등 불가항력적인 사유로 인해 서비스를 제공할 수 없는 경우 이에 대한 책임을 지지 않습니다.
              또한, 이용자가 서비스를 이용하여 얻은 정보로 인해 발생한 유무형의 손실에 대해 책임을 지지 않습니다.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100 text-gray-400 text-xs">
          최종 수정일: 2026년 3월 12일
        </div>
      </div>
    </div>
  );
}
