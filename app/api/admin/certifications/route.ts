import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/admin/certifications
export async function POST(request: Request) {
  try {
    const password = request.headers.get('x-admin-password');
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
