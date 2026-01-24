import React from 'react';
import prisma from '@/lib/prisma';
import PortfolioClient from './PortfolioClient';
import { portfolioData } from './data';

export default async function PortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // DB에서 데이터 미리 가져오기 (Server-side Fetching)
  const certifications = await prisma.certification.findMany({
    orderBy: {
      acquireDate: 'desc',
    },
  });

  return (
    <PortfolioClient
      initialCerts={JSON.parse(JSON.stringify(certifications))}
      portfolioData={portfolioData}
    />
  );
}
