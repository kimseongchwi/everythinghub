import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/portfolio - 포트폴리오 전체 데이터 조회 (공개용)
export async function GET() {
  try {
    // 1. 유저 정보 (첫 번째 유저 기준)
    const user = await prisma.user.findFirst({
      include: {
        avatar: true,
        educations: true,
        techStacks: { orderBy: { category: 'asc' } },
        workExperiences: {
          include: { projects: true },
          orderBy: { createdAt: 'desc' }
        },
        projects: {
          where: { workExperienceId: null }, // 사이드 프로젝트만
          include: { thumbnail: true },
          orderBy: { createdAt: 'desc' }
        },
        certifications: {
          orderBy: { sortOrder: 'asc' },
          include: { attachment: true }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Data not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
    console.error('DATABASE ERROR:', error);
    return NextResponse.json({
      error: 'Database connection failed',
      details: errorMessage
    }, { status: 500 });
  }
}
