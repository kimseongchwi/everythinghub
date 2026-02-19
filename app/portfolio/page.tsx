
import React from 'react';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import PortfolioClient from './PortfolioClient';
import { portfolioData } from './data';

export const metadata: Metadata = {
  title: '포트폴리오 | Everything Hub',
  description: '김정휘의 개발 포트폴리오 및 자격증 현황을 확인해보세요.',
  keywords: ['개발자 포트폴리오', '자격증', '데이터 엔지니어', 'Full Stack'],
};

export default async function PortfolioPage() {
  // DB에서 데이터 미리 가져오기 (Server-side Fetching)
  let certifications: any[] = [];
  try {
    certifications = await prisma.certification.findMany({
      orderBy: {
        acquireDate: 'desc',
      },
    });
  } catch (error) {
    console.error('Failed to load certifications:', error);
    // Fallback to empty array if DB is not ready
  }

  return (
    <PortfolioClient
      initialCerts={JSON.parse(JSON.stringify(certifications))}
      portfolioData={portfolioData}
    />
  );
}
