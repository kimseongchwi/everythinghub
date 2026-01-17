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
  } catch (error) {
    console.error('Failed to fetch certifications:', error);
    return NextResponse.json({ error: 'Failed to fetch certifications' }, { status: 500 });
  }
}

// POST /api/certifications
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, issuer, status, acquireDate } = body;

    const cert = await prisma.certification.create({
      data: {
        name,
        issuer,
        status,
        acquireDate: acquireDate ? new Date(acquireDate) : null,
      },
    });
    return NextResponse.json({ success: true, data: cert });
  } catch (error) {
    console.error('Failed to add certification:', error);
    return NextResponse.json({ error: 'Failed to add certification' }, { status: 500 });
  }
}
