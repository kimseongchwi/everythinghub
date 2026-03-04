import React from 'react';

export const portfolioData = {
  name: "김성취",
  role: "Lead Full-Stack Developer",
  email: "seongchwi@gmail.com",
  phone: "010-XXXX-XXXX",
  github: "https://github.com/seongchwi",
  blog: "https://blog.naver.com",
  description: `효율적인 아키텍처와 직관적인 사용자 경험을 조화롭게 연결하는 개발자 김성취입니다.\n복잡한 비즈니스 로직을 단순화하고, 확장 가능한 시스템을 구축하는 데 전문성을 가지고 있습니다.\n현재는 훈훈소프트에서 다양한 웹 서비스의 설계부터 배포까지 전 과정을 리딩하고 있습니다.`,

  education: [
    { school: "명지전문대학", degree: "정보통신공학과 졸업", period: "2020.03 - 2025.02" },
  ],

  skills: [
    {
      category: "Frontend",
      items: ["Next.js", "React", "Vue.js", "TypeScript", "Tailwind CSS"]
    },
    {
      category: "Backend",
      items: ["Node.js (Express, NestJS)", "Python", "Prisma", "PostgreSQL"]
    },
    {
      category: "Cloud & DevOps",
      items: ["AWS (S3, EC2)", "GCP", "Docker", "CI/CD (GitHub Actions)"]
    },
    {
      category: "Management",
      items: ["Agile", "Figma", "Jira", "Technical Writing"]
    }
  ],

  personalProjects: [
    {
      id: "p1",
      title: "Everything Hub",
      duration: "2024.10 - Present",
      description: "통합 관리 생산성 툴킷. 미디어 라이브러리, 자격증 관리, 개인 대시보드 기능을 제공합니다.",
      techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Vercel Blob"],
      links: { github: "https://github.com/seongchwi/everythinghub", demo: "#" }
    }
  ],

  workExperience: [
    {
      company: "훈훈소프트",
      period: "2025.02 - Present",
      role: "Lead Full-Stack Developer",
      summary: "서비스 기획 및 시스템 아키텍처 설계, 핵심 기능 개발 총괄.",
      projects: [
        {
          id: "w1",
          title: "Tutma",
          description: "강사와 학생을 위한 학습 관리 및 매칭 플랫폼",
          techStack: ["Vue.js", "Node.js", "MySQL"],
          keyFeatures: [
            "학습 진행도 트래킹 및 통계 시각화",
            "실시간 커뮤니케이션 모듈 구현"
          ]
        },
        {
          id: "w2",
          title: "손선장",
          description: "온/오프라인 통합 수산물 유통 및 예약 시스템",
          techStack: ["Nuxt.js", "Node.js", "AWS"],
          keyFeatures: [
            "키오스크 연동 주문 처리 서버 구축",
            "실시간 재고 관리 및 발주 자동화"
          ]
        }
      ]
    }
  ]
};
