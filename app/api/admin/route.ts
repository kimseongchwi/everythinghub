import { put, del } from '@vercel/blob';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper to get or create the main user (since we're in a single-user portfolio context)
async function getMainUser() {
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: '김성취',
        email: 'seongchwi@gmail.com',
        role: 'Full-Stack Developer'
      }
    });
  }
  return user;
}

// GET /api/admin?target=...
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get('target');

  try {
    const user = await getMainUser();

    switch (target) {
      case 'profile':
        const profile = await prisma.user.findUnique({
          where: { id: user.id },
          include: { avatar: true }
        });
        return NextResponse.json(profile);

      case 'tech':
        const tech = await prisma.techStack.findMany({
          where: { userId: user.id },
          orderBy: { category: 'asc' }
        });
        return NextResponse.json(tech);

      case 'work':
        const work = await prisma.workExperience.findMany({
          where: { userId: user.id },
          include: { projects: true },
          orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(work);

      case 'projects':
        const projects = await prisma.project.findMany({
          where: { userId: user.id },
          include: { thumbnail: true },
          orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(projects);

      case 'certs':
        const data = await prisma.certification.findMany({
          where: { userId: user.id },
          orderBy: { sortOrder: 'asc' },
          include: { attachment: true }
        });
        return NextResponse.json(data);

      case 'attachments':
        const attachments = await prisma.attachment.findMany({
          orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(attachments);

      default:
        return NextResponse.json({ error: 'Invalid target' }, { status: 400 });
    }
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
    const user = await getMainUser();
    const body = await request.json();

    if (target === 'certs') {
      const { title, issuer, status, acquiredAt, attachmentId, sortOrder } = body;
      const cert = await prisma.certification.create({
        data: {
          title,
          issuer,
          status,
          acquiredAt: acquiredAt ? new Date(acquiredAt) : null,
          sortOrder: sortOrder ? parseInt(sortOrder) : 0,
          userId: user.id,
          ...(attachmentId ? { attachment: { connect: { id: attachmentId } } } : {}),
        },
      });
      return NextResponse.json(cert);
    }

    if (target === 'tech') {
      const { name, category, level, description } = body;
      const tech = await prisma.techStack.create({
        data: { name, category, level, description, userId: user.id }
      });
      return NextResponse.json(tech);
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

// PATCH /api/admin?target=...&id=...
export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get('target');
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  try {
    const body = await request.json();

    if (target === 'profile') {
      const { name, email, phone, role, github, notion, blog, intro, avatarId } = body;
      const updated = await prisma.user.update({
        where: { id },
        data: {
          name, email, phone, role, github, notion, blog, intro,
          avatar: avatarId ? { connect: { id: avatarId } } : undefined
        }
      });
      return NextResponse.json(updated);
    }

    if (target === 'certs') {
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
    }

    return NextResponse.json({ error: 'Invalid target' }, { status: 400 });
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
    switch (target) {
      case 'certs':
        await prisma.certification.delete({ where: { id } });
        break;
      case 'tech':
        await prisma.techStack.delete({ where: { id } });
        break;
      case 'attachments':
        const attachment = await prisma.attachment.findUnique({ where: { id } });
        if (attachment) {
          await del(attachment.url);
          await prisma.attachment.delete({ where: { id } });
        }
        break;
      default:
        return NextResponse.json({ error: 'Invalid target' }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API DELETE ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
