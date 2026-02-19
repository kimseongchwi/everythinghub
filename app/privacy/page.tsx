
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 | Everything Hub',
  description: 'Everything Hub의 개인정보처리방침입니다.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto prose prose-slate">
        <h1 className="text-3xl font-black text-gray-950 mb-10 tracking-tight">개인정보처리방침</h1>

        <div className="space-y-8 text-gray-700 leading-relaxed text-[15px]">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. 개인정보의 수집 및 이용 목적</h2>
            <p>
              Everything Hub는 별도의 회원가입 없이 서비스를 이용할 수 있으며, 사용자의 개인정보를 서버에 저장하거나 수집하지 않습니다.
              다만, 사용자가 브라우저를 통해 저장하는 도구 데이터는 사용자의 로컬 저장소(LocalStorage) 등에 보존될 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. 수집하는 개인정보 항목</h2>
            <p>
              본 서비스는 이름, 이메일, 연락처 등 고유식별정보를 직접적으로 수집하지 않습니다.
              서비스 이용 과정에서 브라우저 정보, 접속 로그 등이 생성될 수 있으나 이는 원활한 서비스 제공을 위한 용도로만 활용됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. 제3자 제공 및 외부 라이브러리</h2>
            <p>
              Everything Hub는 사용자의 데이터를 제3자에게 제공하지 않습니다.
              단, 구글 애드센스(Google AdSense) 등 광고 서비스 이용 시 브라우저 쿠키를 통해 익명의 방문 정보가 활용될 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. 개인정보의 파기</h2>
            <p>
              본 서비스는 개인정보를 저장하지 않으므로 파기 절차가 존재하지 않습니다.
              사용자의 로컬 저장소 데이터는 브라우저 캐시 삭제를 통해 직접 파기할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. 관리자 연락처</h2>
            <p>
              서비스 이용 관련 문의 및 개인정보 관련 문의는 아래 이메일로 연락주시기 바랍니다.
              <br />
              문의: <a href="mailto:kimsung01265@gmail.com" className="font-bold text-blue-600 hover:underline">kimsung01265@gmail.com</a> / <a href="mailto:ghfkddl665@naver.com" className="font-bold text-blue-600 hover:underline">ghfkddl665@naver.com</a>
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100 text-gray-400 text-xs">
          최종 수정일: 2026년 2월 19일
        </div>
      </div>
    </div>
  );
}
