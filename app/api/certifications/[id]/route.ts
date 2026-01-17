import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PATCH /api/certifications/[id]
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, issuer, status, acquireDate } = body;

    const updated = await prisma.certification.update({
      where: { id },
      data: {
        name,
        issuer,
        status,
        acquireDate: acquireDate ? new Date(acquireDate) : null,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Failed to update certification:', error);
    return NextResponse.json({ error: 'Failed to update certification' }, { status: 500 });
  }
}

// DELETE /api/certifications/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    await prisma.certification.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete certification:', error);
    return NextResponse.json({ error: 'Failed to delete certification' }, { status: 500 });
  }
}
