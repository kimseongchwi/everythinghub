import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/certifications - Publicly available
export async function GET() {
  try {
    const certs = await prisma.certification.findMany({
      orderBy: {
        acquireDate: 'desc',
      },
    });
    return NextResponse.json(certs);
  } catch (error: any) {
    console.error('DATABASE ERROR:', error);
    return NextResponse.json({
      error: 'Database connection failed',
      details: error.message
    }, { status: 500 });
  }
}
