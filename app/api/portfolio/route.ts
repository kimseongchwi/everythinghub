import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/portfolio - 포트폴리오(자격증) 전체 데이터 조회 (공개용)
export async function GET() {
  try {
    const certs = await prisma.certification.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
      include: {
        attachment: true
      }
    });
    return NextResponse.json(certs);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
    console.error('DATABASE ERROR:', error);
    return NextResponse.json({
      error: 'Database connection failed',
      details: errorMessage
    }, { status: 500 });
  }
}
