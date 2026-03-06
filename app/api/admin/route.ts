import { put, del } from '@vercel/blob';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 메인 사용자 정보 조회 헬퍼
async function getMainUser() {
  return await prisma.user.findFirst();
}

// 조회 API (GET)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get('target');

  try {
    const user = await getMainUser();

    // 유저가 없는 경우 GET 요청에 대해 빈 데이터 반환 (첨부파일 제외)
    if (!user && target !== 'attachments') {
      if (target === 'profile') return NextResponse.json(null);
      return NextResponse.json([]);
    }

    switch (target) {
      case 'profile':
        const profile = await prisma.user.findUnique({
          where: { id: user?.id },
          include: {
            avatar: true,
            educations: true
          }
        });
        return NextResponse.json(profile);

      case 'tech':
        const tech = await prisma.techStack.findMany({
          where: { userId: user?.id },
          orderBy: { category: 'asc' }
        });
        return NextResponse.json(tech);

      case 'work':
        const work = await prisma.workExperience.findMany({
          where: { userId: user?.id },
          include: { projects: true },
          orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(work);

      case 'projects':
        const projects = await prisma.project.findMany({
          where: { userId: user?.id },
          include: { thumbnail: true },
          orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(projects);

      case 'certs':
        const data = await prisma.certification.findMany({
          where: { userId: user?.id },
          orderBy: { sortOrder: 'asc' },
          include: { attachment: true }
        });
        return NextResponse.json(data);

      case 'attachments':
        const attachments = await prisma.attachment.findMany({
          orderBy: { createdAt: 'desc' },
          include: {
            userAvatar: { select: { name: true } },
            projectThumb: { select: { title: true } },
            certFile: { select: { title: true } }
          }
        });
        return NextResponse.json(attachments);

      default:
        return NextResponse.json({ error: '잘못된 요청 대상입니다.' }, { status: 400 });
    }
  } catch (error) {
    console.error('조회 오류:', error);
    return NextResponse.json({ error: '데이터를 가져오는 데 실패했습니다.' }, { status: 500 });
  }
}

// 생성 및 업데이트 API (POST)
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get('target');

  try {
    const user = await getMainUser();
    if (target === 'profile') {
      const body = await request.json();
      const {
        name,
        email,
        phone,
        position,
        github,
        blog,
        intro,
        privateMemo,
        avatarId,
        school,
        major,
        degreeStatus,
        startDate,
        endDate,
        isCurrent
      } = body;

      if (!user) {
        // 새 사용자 생성
        const newUser = await prisma.user.create({
          data: {
            name,
            email,
            phone,
            position,
            github,
            privateMemo,
            blog,
            intro,
            avatarId: avatarId || null,
            educations: {
              create: {
                school: school || '',
                major: major || '',
                degreeStatus: degreeStatus || '',
                startDate: startDate || '',
                endDate: endDate || null,
                isCurrent: isCurrent || false
              }
            }
          }
        });
        return NextResponse.json(newUser);
      } else {
        // 기존 사용자 정보 업데이트
        const updated = await prisma.user.update({
          where: { id: user.id },
          data: {
            name,
            email,
            phone,
            position,
            github,
            blog,
            intro,
            privateMemo,
            avatarId: avatarId || null
          }
        });

        // 유저의 첫 번째 학력 정보를 찾아 업데이트 혹은 생성
        const firstEdu = await prisma.education.findFirst({
          where: { userId: user.id }
        });

        if (firstEdu) {
          await prisma.education.update({
            where: { id: firstEdu.id },
            data: {
              school: school || '',
              major: major || '',
              degreeStatus: degreeStatus || '',
              startDate: startDate || '',
              endDate: endDate || null,
              isCurrent: isCurrent || false
            }
          });
        } else {
          await prisma.education.create({
            data: {
              school: school || '',
              major: major || '',
              degreeStatus: degreeStatus || '',
              startDate: startDate || '',
              endDate: endDate || null,
              isCurrent: isCurrent || false,
              userId: user.id
            }
          });
        }

        return NextResponse.json(updated);
      }
    }

    if (!user && target !== 'attachments') {
      return NextResponse.json({ error: 'No user found' }, { status: 404 });
    }

    if (target === 'certs') {
      if (!user) return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
      const body = await request.json();
      const { title, issuer, status, acquiredAt, attachmentId, sortOrder } = body;
      const cert = await prisma.certification.create({
        data: {
          title,
          issuer,
          status,
          acquiredAt: acquiredAt || null,
          sortOrder: sortOrder ? Number(sortOrder) : 0,
          userId: user.id,
          attachmentId: attachmentId || null,
        },
      });
      return NextResponse.json(cert);
    }

    if (target === 'tech') {
      if (!user) return NextResponse.json({ error: 'No user found' }, { status: 404 });
      const body = await request.json();
      const { name, category, description, sortOrder } = body;
      const tech = await prisma.techStack.create({
        data: {
          name,
          category,
          description,
          sortOrder: parseInt(String(sortOrder || 0)),
          userId: user.id
        }
      });
      return NextResponse.json(tech);
    }

    if (target === 'work') {
      if (!user) return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
      const body = await request.json();
      const { companyName, role, startDate, endDate, isCurrent, summary, description, sortOrder } = body;
      const work = await prisma.workExperience.create({
        data: {
          companyName,
          role,
          startDate,
          endDate,
          isCurrent: isCurrent || false,
          summary,
          description,
          sortOrder: sortOrder ? Number(sortOrder) : 0,
          userId: user.id
        }
      });
      return NextResponse.json(work);
    }

    if (target === 'attachments') {
      const filename = searchParams.get('filename');
      if (!filename || !request.body) return NextResponse.json({ error: '파일 데이터가 누락되었습니다.' }, { status: 400 });

      // 파일 사이즈를 정확히 측정하기 위해 데이터를 읽음
      const arrayBuffer = await request.arrayBuffer();
      const fileSize = arrayBuffer.byteLength;

      const blob = await put(`attachments/${filename}`, arrayBuffer, {
        access: 'public',
        addRandomSuffix: true
      });

      const attachment = await prisma.attachment.create({
        data: {
          originalName: filename,
          fileName: blob.pathname,
          url: blob.url,
          size: fileSize,
          mimeType: blob.contentType || 'application/octet-stream'
        },
      });
      return NextResponse.json(attachment);
    }

    if (target === 'projects') {
      if (!user) return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
      const body = await request.json();
      const { title, description, techStack, githubUrl, demoUrl, thumbnailId, sortOrder, workExperienceId, content, startDate, endDate, isCurrent, isFeatured, keyFeatures } = body;
      const project = await prisma.project.create({
        data: {
          title,
          description,
          content,
          startDate,
          endDate,
          isCurrent: isCurrent || false,
          isFeatured: isFeatured || false,
          techStack: Array.isArray(techStack) ? techStack : (techStack ? techStack.split(',').map((s: string) => s.trim()) : []),
          keyFeatures: Array.isArray(keyFeatures) ? keyFeatures : [],
          githubLink: githubUrl,
          demoLink: demoUrl,
          thumbnailId: thumbnailId || null,
          sortOrder: sortOrder ? Number(sortOrder) : 0,
          userId: workExperienceId ? null : user.id,
          workExperienceId: workExperienceId || null,
        },
      });
      return NextResponse.json(project);
    }

    return NextResponse.json({ error: '잘못된 요청 대상입니다.' }, { status: 400 });
  } catch (error: any) {
    console.error('API 생성 오류:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 상세 수정 API (PATCH)
export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get('target');
  const id = searchParams.get('id');

  try {
    const body = await request.json();

    if (target === 'profile') {
      if (!id) return NextResponse.json({ error: '대상 ID가 필요합니다.' }, { status: 400 });
      const {
        name,
        email,
        phone,
        position,
        github,
        blog,
        intro,
        privateMemo,
        avatarId,
        school,
        major,
        degreeStatus,
        startDate,
        endDate,
        isCurrent
      } = body;

      const updated = await prisma.user.update({
        where: { id },
        data: {
          name,
          email,
          phone,
          position,
          github,
          blog,
          intro,
          privateMemo,
          avatarId: avatarId || null
        }
      });

      // 학력 정보 업데이트
      const firstEdu = await prisma.education.findFirst({
        where: { userId: id }
      });

      if (firstEdu) {
        await prisma.education.update({
          where: { id: firstEdu.id },
          data: {
            school: school || '',
            major: major || '',
            degreeStatus: degreeStatus || '',
            startDate: startDate || '',
            endDate: endDate || null,
            isCurrent: isCurrent || false
          }
        });
      } else {
        await prisma.education.create({
          data: {
            school: school || '',
            major: major || '',
            degreeStatus: degreeStatus || '',
            startDate: startDate || '',
            endDate: endDate || null,
            isCurrent: isCurrent || false,
            userId: id
          }
        });
      }

      return NextResponse.json(updated);
    }

    if (target === 'certs') {
      if (!id) return NextResponse.json({ error: 'ID가 필요합니다.' }, { status: 400 });
      const { title, issuer, status, acquiredAt, attachmentId, sortOrder } = body;
      const updated = await prisma.certification.update({
        where: { id },
        data: {
          title,
          issuer,
          status,
          acquiredAt: acquiredAt || null,
          sortOrder: sortOrder ? Number(sortOrder) : 0,
          attachmentId: attachmentId || null,
        },
      });
      return NextResponse.json(updated);
    }

    if (target === 'tech') {
      if (!id) return NextResponse.json({ error: 'ID가 필요합니다.' }, { status: 400 });
      const { name, category, description, sortOrder } = body;
      const updated = await prisma.techStack.update({
        where: { id },
        data: {
          name,
          category,
          description,
          sortOrder: sortOrder ? Number(sortOrder) : 0,
        },
      });
      return NextResponse.json(updated);
    }

    if (target === 'work') {
      if (!id) return NextResponse.json({ error: 'ID가 필요합니다.' }, { status: 400 });
      const { companyName, role, startDate, endDate, isCurrent, summary, description, sortOrder } = body;
      const updated = await prisma.workExperience.update({
        where: { id },
        data: {
          companyName,
          role,
          startDate,
          endDate,
          isCurrent: isCurrent || false,
          summary,
          description,
          sortOrder: sortOrder ? Number(sortOrder) : 0,
        },
      });
      return NextResponse.json(updated);
    }

    if (target === 'reorder') {
      const { type, items } = body; // type is 'certs', 'tech', 'work', 'projects', items is [{id, sortOrder}]
      
      const updates = items.map((item: any) => {
        const model = 
          type === 'certs' ? prisma.certification :
          type === 'tech' ? prisma.techStack :
          type === 'work' ? prisma.workExperience :
          type === 'projects' ? prisma.project : null;
        
        if (!model) return null;
        // @ts-ignore - dynamic model access
        return model.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder }
        });
      }).filter(Boolean);

      await Promise.all(updates);
      return NextResponse.json({ success: true });
    }

    if (target === 'projects') {
      if (!id) return NextResponse.json({ error: 'ID가 필요합니다.' }, { status: 400 });
      const { title, description, techStack, githubUrl, demoUrl, thumbnailId, sortOrder, content, startDate, endDate, isCurrent, isFeatured, keyFeatures } = body;
      const updated = await prisma.project.update({
        where: { id },
        data: {
          title,
          description,
          content,
          startDate,
          endDate,
          isCurrent: isCurrent || false,
          isFeatured: isFeatured || false,
          techStack: Array.isArray(techStack) ? techStack : (techStack ? techStack.split(',').map((s: string) => s.trim()) : []),
          keyFeatures: Array.isArray(keyFeatures) ? keyFeatures : [],
          githubLink: githubUrl,
          demoLink: demoUrl,
          thumbnailId: thumbnailId || null,
          sortOrder: sortOrder ? Number(sortOrder) : 0,
        },
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: '잘못된 요청 대상입니다.' }, { status: 400 });
  } catch (error: any) {
    console.error('API 수정 오류:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 삭제 API (DELETE)
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
      case 'work':
        await prisma.workExperience.delete({ where: { id } });
        break;
      case 'projects':
        await prisma.project.delete({ where: { id } });
        break;
      case 'attachments':
        const attachment = await prisma.attachment.findUnique({ where: { id } });
        if (attachment) {
          await del(attachment.url);
          await prisma.attachment.delete({ where: { id } });
        }
        break;
      default:
        return NextResponse.json({ error: '잘못된 요청 대상입니다.' }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API 삭제 오류:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
