import { put, del } from '@vercel/blob';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(media);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const password = request.headers.get('x-admin-password');
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename || !request.body) {
      return NextResponse.json({ error: 'Filename and body required' }, { status: 400 });
    }

    // 환경별 폴더 분기 (dev/prod)
    const isProd = process.env.NODE_ENV === 'production';
    const folder = isProd ? 'prod' : 'dev';
    const blobPath = `${folder}/${filename}`;

    // Vercel Blob에 업로드
    const blob = await put(blobPath, request.body, {
      access: 'public',
    });

    // DB에 기록
    const media = await prisma.media.create({
      data: {
        filename: blob.pathname,
        url: blob.url,
        size: 0, // Request body size calculation can be complex, skipping for brevity or use blob size if possible
        mimeType: blob.contentType || 'application/octet-stream',
      },
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
