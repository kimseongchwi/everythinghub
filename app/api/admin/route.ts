import { put, del } from '@vercel/blob';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/admin?target=...
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get('target');

  try {
    if (target === 'certs') {
      const data = await prisma.certification.findMany({
        orderBy: { sortOrder: 'asc' }, // sortOrder 기준 정렬
        include: { attachment: true } // attachment 포함
      });
      return NextResponse.json(data);
    }
    if (target === 'attachments') {
      const data = await prisma.attachment.findMany({ orderBy: { createdAt: 'desc' } });
      return NextResponse.json(data);
    }
    return NextResponse.json({ error: 'Invalid target' }, { status: 400 });
  } catch (error) {
    console.error('FETCH ERROR:', error);
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}

// POST /api/admin?target=...
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get('target');

  try {
    if (target === 'certs') {
      const body = await request.json();
      const { title, issuer, status, acquiredAt, attachmentId, sortOrder } = body;

      const cert = await prisma.certification.create({
        data: {
          title,
          issuer,
          status,
          acquiredAt: acquiredAt ? new Date(acquiredAt) : null,
          sortOrder: sortOrder ? parseInt(sortOrder) : 0,
          ...(attachmentId ? { attachment: { connect: { id: attachmentId } } } : {}),
        },
      });
      return NextResponse.json(cert);
    }

    if (target === 'attachments') {
      const filename = searchParams.get('filename');
      if (!filename || !request.body) return NextResponse.json({ error: 'Missing file data' }, { status: 400 });

      const blob = await put(`attachments/${filename}`, request.body, {
        access: 'public',
        addRandomSuffix: true
      });

      const attachment = await prisma.attachment.create({
        data: {
          originalName: filename,
          fileName: blob.pathname,
          url: blob.url,
          size: 0,
          mimeType: blob.contentType || 'application/octet-stream'
        },
      });
      return NextResponse.json(attachment);
    }

    return NextResponse.json({ error: 'Invalid target' }, { status: 400 });
  } catch (error: any) {
    console.error('API POST ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/admin?id=...
export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  try {
    const body = await request.json();
    const { title, issuer, status, acquiredAt, attachmentId, sortOrder } = body;

    const updated = await prisma.certification.update({
      where: { id },
      data: {
        title,
        issuer,
        status,
        acquiredAt: acquiredAt ? new Date(acquiredAt) : null,
        sortOrder: sortOrder ? parseInt(sortOrder) : 0,
        attachment: attachmentId ? { connect: { id: attachmentId } } : { disconnect: true },
      },
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('API PATCH ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin?target=...&id=...
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get('target');
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  try {
    if (target === 'certs') {
      await prisma.certification.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    if (target === 'attachments') {
      const attachment = await prisma.attachment.findUnique({ where: { id } });
      if (!attachment) return NextResponse.json({ error: 'Not found' }, { status: 404 });

      await del(attachment.url);
      await prisma.attachment.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid target' }, { status: 400 });
  } catch (error: any) {
    console.error('API DELETE ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
