
import React from 'react';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import PortfolioClient from './PortfolioClient';

export const metadata: Metadata = {
  title: '포트폴리오 | Everything Hub',
  description: '김성취의 개발 포트폴리오 및 자격증 현황을 확인해보세요.',
  keywords: ['개발자 포트폴리오', '자격증', '데이터 엔지니어', 'Full Stack'],
};

export default async function PortfolioPage() {
  // DB에서 데이터 가져오기 (Server-side Fetching)
  let userData: any = null;

  try {
    userData = await prisma.user.findFirst({
      include: {
        educations: {
          orderBy: { createdAt: 'asc' }
        },
        workExperiences: {
          include: {
            projects: true
          },
          orderBy: { createdAt: 'desc' }
        },
        projects: {
          where: {
            workExperienceId: null
          },
          orderBy: { createdAt: 'desc' }
        },
        techStacks: true,
        certifications: {
          include: {
            attachment: true
          },
          orderBy: {
            sortOrder: 'asc',
          }
        }
      }
    });
  } catch (error) {
    console.error('Failed to load portfolio data:', error);
  }

  // 유저 데이터가 없는 경우를 위한 기본값 설정
  const safeUser = userData || {
    name: '',
    role: '',
    email: '',
    phone: '',
    github: '',
    notion: '',
    blog: '',
    intro: '',
    educations: [],
    workExperiences: [],
    projects: [],
    techStacks: [],
    certifications: []
  };


  // PortfolioClient에서 기대하는 구조로 변환
  const formattedData = {
    name: safeUser.name,
    position: safeUser.position,
    email: safeUser.email,
    phone: safeUser.phone,
    github: safeUser.github,
    blog: safeUser.notion || safeUser.blog,
    description: safeUser.intro,
    education: (safeUser.educations || []).map((edu: any) => ({
      school: edu.school,
      major: edu.major,
      degreeStatus: edu.degreeStatus,
      period: [edu.startDate, edu.endDate || (edu.isCurrent ? '재학 중' : '')].filter(Boolean).join(' ~ ')
    })),
    skills: (safeUser.techStacks || []).reduce((acc: any[], stack: any) => {
      const existingGroup = acc.find(g => g.category === stack.category);
      const skillItem = {
        name: stack.name,
        description: stack.description
      };
      if (existingGroup) {
        existingGroup.items.push(skillItem);
      } else {
        acc.push({ category: stack.category, items: [skillItem] });
      }
      return acc;
    }, []),
    workExperience: (safeUser.workExperiences || []).map((work: any) => ({
      company: work.companyName,
      period: [work.startDate, work.endDate || (work.isCurrent ? '재직 중' : '')].filter(Boolean).join(' ~ '),
      role: work.role,
      summary: work.summary,
      description: work.description,
      projects: (work.projects || []).map((proj: any) => ({
        id: proj.id,
        title: proj.title,
        description: proj.description,
        techStack: proj.techStack,
        keyFeatures: proj.keyFeatures
      }))
    })),
    sideProjects: (safeUser.projects || []).map((proj: any) => ({
      id: proj.id,
      title: proj.title,
      period: [proj.startDate, proj.endDate || (proj.isCurrent ? '진행 중' : '')].filter(Boolean).join(' ~ '),
      description: proj.description,
      content: proj.content,
      techStack: proj.techStack,
      isFeatured: proj.isFeatured,
      links: {
        github: proj.githubLink || '#',
        demo: proj.demoLink || '#'
      }
    }))
  };

  return (
    <PortfolioClient
      initialCerts={JSON.parse(JSON.stringify(safeUser.certifications || []))}
      portfolioData={formattedData}
    />
  );
}
