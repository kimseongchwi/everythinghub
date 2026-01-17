import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/certifications
export async function GET() {
  try {
    const certs = await prisma.certification.findMany({
      orderBy: {
        acquireDate: 'desc',
      },
    });
    return NextResponse.json(certs);
  } catch (error: any) {
    console.error('Failed to fetch certifications:', error);
    return NextResponse.json({
      error: 'Failed to fetch certifications',
      details: error.message || 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/certifications
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, issuer, status, acquireDate } = body;

    // Validate date to prevent Prisma errors
    let finalDate = null;
    if (acquireDate && acquireDate.trim() !== "") {
      const parsedDate = new Date(acquireDate);
      if (!isNaN(parsedDate.getTime())) {
        finalDate = parsedDate;
      }
    }

    const cert = await prisma.certification.create({
      data: {
        name,
        issuer,
        status,
        acquireDate: finalDate,
      },
    });
    return NextResponse.json({ success: true, data: cert });
  } catch (error: any) {
    console.error('Failed to add certification:', error);
    return NextResponse.json({
      error: 'Failed to add certification',
      details: error.message || 'Unknown error'
    }, { status: 500 });
  }
}
