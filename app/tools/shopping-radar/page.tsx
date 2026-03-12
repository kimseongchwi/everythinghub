
import React from 'react';
import { Metadata } from 'next';
import PriceTracker from './PriceTracker';
import ToolNavigation from '@/components/ToolNavigation';
import FAQSection from '@/components/FAQSection';

export const metadata: Metadata = {
  title: '쇼핑 레이더: 실시간 최저가 및 구매 인사이트 | Everything Hub',
  description: '전 쇼핑몰 데이터를 스캔하여 최적의 구매 타이밍과 가성비 상품을 찾아드립니다.',
  keywords: ['쇼핑 레이더', '가격 분석', '최저가 검색', '스마트 쇼핑', '가성비 추천'],
};

export default function PriceTrackerPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <ToolNavigation currentSlug="shopping-radar" />

        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-950 tracking-tighter mb-4">
            쇼핑 레이더
          </h1>
          <p className="text-gray-500 font-bold max-w-xl mx-auto text-[15px] leading-relaxed">
            단순한 가격 비교를 넘어 전체 시장가를 스캔합니다. <br className="hidden md:block" />
            지금이 정말 살 타이밍인지 데이터로 확인해보세요.
          </p>
        </header>

        {/* 인터랙티브 쇼핑 검색 컴포넌트 */}
        <PriceTracker />

        <div className="max-w-4xl mx-auto mt-24">
          <FAQSection items={shoppingFAQ} />
        </div>

        <footer className="mt-20 text-center text-gray-400 text-sm font-medium">
          Powered by Naver Search API
        </footer>
      </div>
    </div>
  );
}

const shoppingFAQ = [
  {
    question: "표시되는 가격이 실제 쇼핑몰 가격과 다를 때가 있는데 왜 그런가요?",
    answer: "Everything Hub는 네이버 쇼핑 검색 오픈 API를 통해 실시간 데이터를 가져오지만, 각 쇼핑몰의 할인 쿠폰 적용 여부, 카드사 할인, 또는 기간 한정 타임세일 가격이 API에 반영되기까지 짧은 시간차가 발생할 수 있습니다. 정확한 최종 결제 금액은 '구매 하러가기' 버튼을 클릭하여 해당 쇼핑몰에서 직접 확인하시는 것이 가장 정확합니다."
  },
  {
    question: "가성비 점수(Price Score)는 어떤 기준으로 산출되나요?",
    answer: "가성비 점수는 현재 검색 결과에 나타난 20~40개의 상품 가격들을 통계적으로 분석하여 산출합니다. 검색 결과 내의 '최고가'와 '최저가' 사이에서 해당 상품의 가격이 어느 위치에 있는지를 측정하며, 점수가 90점 이상인 'BEST DEAL' 상품은 현재 리스트에서 압도적으로 낮은 가격대를 유지하고 있음을 의미합니다."
  },
  {
    question: "알림 설정(벨 아이콘)은 언제부터 사용 가능한가요?",
    answer: "현재 벨 아이콘은 UI 디자인 단계이며, 실제 가격 추적 및 알림 기능은 현재 개발 중에 있습니다. 추후 업데이트를 통해 관심 상품의 가격이 설정한 목표가 이하로 떨어졌을 때 이메일이나 Discord 등으로 실시간 알림을 보낼 수 있도록 지원할 예정입니다."
  },
  {
    question: "특정 쇼핑몰(예: 쿠팡, 11번가)의 가격만 따로 볼 수는 없나요?",
    answer: "네이버 쇼핑 API 특성상 모든 개별 쇼핑몰 필터링을 완벽하게 지원하기는 어렵지만, 상단에 노출되는 '브랜드 필터'를 통해 특정 브랜드 제품들만 모아서 비교할 수 있습니다. 또한 검색 결과 카드 좌측 상단에 판매처 이름이 표시되므로, 선호하시는 쇼핑몰의 제품을 빠르게 찾으실 수 있습니다."
  },
  {
    question: "배송비가 포함된 가격인가요?",
    answer: "검색 결과에 표시되는 가격은 기본 '상품가'입니다. 네이버 쇼핑 API에서 제공하는 배송비 정보는 각 판매처별 조건(무료, 유료, 수량별 차등)이 다양하여 현재 리스트에는 상품 가격을 우선적으로 노출하고 있습니다. 상세 페이지로 이동하시면 정확한 배송 조건을 확인하실 수 있습니다."
  }
];
