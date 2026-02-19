import React from 'react';

export const portfolioData = {
  name: "김세웅",
  role: "풀스택 개발자 (Full-Stack Developer)",
  email: "seongchwi@example.com",
  phone: "010-XXXX-XXXX",
  description: `효율적인 코드와 사용자 경험을 고민하는 개발자입니다. 
  다양한 프로젝트를 통해 기획부터 개발, 배포까지 전 과정을 경험하며 
  비즈니스 가치를 창출하는 프로덕트를 만들어가고 있습니다.`,
  education: [
    { school: "명지전문대학", degree: "전문학사", period: "2020 - 2025" },
  ],
  skills: [
    {
      name: "Vue.js",
      level: "중",
      percent: 70,
      desc: "Vue 2/3 기반 프론트엔드 개발이 가능하며, Nuxt.js를 활용한 SSR 구현 및 상태 관리(Vuex)에 능숙합니다.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 256 221" fill="none">
          <path d="M204.8 0H256L128 220.8L0 0H51.2L128 132.48L204.8 0Z" fill="#41B883" />
          <path d="M0 0L128 220.8L256 0H204.8L128 132.48L51.2 0H0Z" fill="#41B883" />
          <path d="M51.2 0L128 132.48L204.8 0H156.8L128 48.64L99.2 0H51.2Z" fill="#35495E" />
        </svg>
      )
    },
    {
      name: "Node.js",
      level: "중",
      percent: 65,
      desc: "Express 프레임워크를 활용한 RESTful API 설계 및 실시간 통신(Socket.io) 경험이 있습니다.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 256 284" fill="none">
          <path d="M127.9 0L27.6 57.9V173.7L127.9 231.6L228.2 173.7V57.9L127.9 0Z" fill="#339933" />
          <path d="M127.9 31.6L54.9 73.8V157.9L127.9 200L200.9 157.9V73.8L127.9 31.6Z" fill="#FFFFFF" />
          <path d="M151.7 101.9V129.8H132.1V101.9H120.2V129.8H100.6V101.9H88.7V157.7H100.6V129.8H120.2V157.7H132.1V129.8H151.7V157.7H163.6V101.9H151.7Z" fill="#339933" />
        </svg>
      )
    },
    {
      name: "MySQL",
      level: "중",
      percent: 60,
      desc: "복합 쿼리 작성 및 DB 인덱싱을 통한 성능 최적화가 가능하며, Prisma/Sequelize와 같은 ORM에 익숙합니다.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 256 256" fill="none">
          <path d="M128 0C57.31 0 0 57.31 0 128s57.31 128 128 128 128-57.31 128-128S198.69 0 128 0zm0 215c-48.05 0-87-38.95-87-87s38.95-87 87-87 87 38.95 87 87-38.95 87-87 87z" fill="#00758F" />
          <path d="M128 57c-39.21 0-71 31.79-71 71s31.79 71 71 71 71-31.79 71-71-31.79-71-71-31.79-71-71z" fill="#F29111" />
        </svg>
      )
    },
    {
      name: "GCP",
      level: "하",
      percent: 30,
      desc: "Compute Engine을 활용한 서버 배포 및 Cloud Storage 연동 등 기본적인 인프라 구성 경험이 있습니다.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 256 205" fill="none">
          <path d="M208.5 73.6L128 27L47.5 73.6V166.4L128 213L208.5 166.4V73.6Z" fill="#4285F4" />
          <path d="M128 213L47.5 166.4L128 120L208.5 166.4L128 213Z" fill="#34A853" />
          <path d="M128 27L208.5 73.6L128 120L47.5 73.6L128 27Z" fill="#EA4335" />
          <path d="M128 120V213L208.5 166.4V73.6L128 120Z" fill="#FBBC05" />
        </svg>
      )
    },
  ],
  tools: [
    {
      name: "Figma",
      icon: (
        <svg width="14" height="14" viewBox="0 0 38 57" fill="none">
          <path d="M19 28.5C19 25.9033 20.0272 23.4128 21.8556 21.575C23.6841 19.7371 26.1638 18.7037 28.7492 18.7037C31.3346 18.7037 33.8143 19.7371 35.6427 21.575C37.4712 23.4128 38.4984 25.9033 38.4984 28.5C38.4984 31.0967 37.4712 33.5872 35.6427 35.425C33.8143 37.2629 31.3346 38.2963 28.7492 38.2963C26.1638 38.2963 23.6841 37.2629 21.8556 35.425C20.0272 33.5872 19 31.0967 19 28.5Z" fill="#1ABCFE" />
          <path d="M0 47.7963C0 45.2 1.0272 42.7094 2.85558 40.8716C4.68396 39.0338 7.16369 38 9.7491 38H19.4982V47.7963C19.4982 50.3926 18.471 52.8831 16.6426 54.721C14.8142 56.5588 12.3345 57.5926 9.7491 57.5926C7.16369 57.5926 4.68396 56.5588 2.85558 54.721C1.0272 52.8831 0 50.3926 0 47.7963Z" fill="#0AC17E" />
          <path d="M0 28.5C0 25.9037 1.0272 23.4131 2.85558 21.5753C4.68396 19.7375 7.16369 18.7037 9.7491 18.7037H19.4982V38.2963H9.7491C7.16369 38.2963 4.68396 37.2625 2.85558 35.4247C1.0272 33.5869 0 31.0963 0 28.5Z" fill="#A259FF" />
          <path d="M0 9.2963C0 6.7 1.0272 4.20945 2.85558 2.37162C4.68396 0.533782 7.16369 -0.5 9.7491 -0.5H19.4982V19H9.7491C7.16369 19 4.68396 17.9662 2.85558 16.1284C1.0272 14.2905 0 11.7999 0 9.2963Z" fill="#F24E1E" />
          <path d="M19.4982 -0.5H29.2473C31.8327 -0.5 34.3125 0.533782 36.1408 2.37162C37.9692 4.20945 38.9964 6.7 38.9964 9.2963C38.9964 11.7999 37.9692 14.2905 36.1408 16.1284C34.3125 17.9662 31.8327 19 29.2473 19H19.4982V-0.5Z" fill="#FF7262" />
        </svg>
      )
    },
    {
      name: "GitHub",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
      )
    },
    {
      name: "Electron",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9FEAF9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="2" fill="#9FEAF9"></circle>
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(45 12 12)"></ellipse>
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-45 12 12)"></ellipse>
        </svg>
      )
    }
  ],
  aiTools: [
    {
      name: "Antigravity",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L22 12L12 22L2 12L12 2Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
          <path d="M12 6L18 12L12 18L6 12L12 6Z" fill="white" fillOpacity="0.5" />
          <circle cx="12" cy="12" r="2" fill="white" />
        </svg>
      )
    }
  ],
  personalProjects: [
    {
      id: "p1",
      title: "Everything Hub",
      status: "working",
      duration: "2024.10 ~ 현재",
      role: "1인 개발 (기획 & 풀스택)",
      description: "사용자가 필요로 하는 다양한 도구들을 한곳에서 제공하는 통합 플랫폼입니다.",
      techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
      keyFeatures: [
        "React 기반 대시보드 및 위젯 시스템",
        "실시간 연봉 계산기 및 세금 자동화 도구",
        "포트폴리오 생성 및 관리 모듈",
        "다크모드 지원 및 반응형 웹 디자인"
      ],
      challenges: "여러 도구의 복잡한 비즈니스 로직을 하나로 통합하면서 성능 저하 없는 사용자 경험을 제공하기 위해 컴포넌트 구조를 최적화했습니다.",
      links: { github: "#", demo: "#" }
    }
  ],
  workExperience: [
    {
      company: "훈훈소프트",
      period: "2025.02.17 - 현재",
      role: "풀스택 개발자",
      projects: [
        {
          id: "w1",
          title: "Tutma (튜트마)",
          status: "working",
          duration: "2025.12 ~ 현재",
          role: "총괄 기획 및 개발",
          description: "학생과 튜터를 잇는 학습 관리 플랫폼",
          techStack: ["Vue 2", "Node.js 18", "MySQL 8"],
          keyFeatures: [
            "학습 진행도 트래킹 시스템",
            "튜터-학생 실시간 채팅 모드",
            "GCP 기반 데이터 동기화"
          ],
          challenges: "실시간 데이터 통신을 위한 로직과 대규모 학생 관리 시스템의 효율적 DB 인덱싱을 설계했습니다."
        },
        {
          id: "w2",
          title: "Son Captain (손선장)",
          status: "operating",
          duration: "2025.06 ~ 현재",
          role: "프로덕트 총괄 기획 및 개발",
          description: "수산물 온/오프라인 통합 판매 및 예약 플랫폼",
          techStack: ["Vue 2", "Electron", "AWS"],
          keyFeatures: [
            "Electron 기반 주문 관리 데스크톱 앱",
            "현장 키오스크 연동 및 실시간 주문 트래킹",
          ],
          challenges: "현장 네트워크 장애에 대응하는 오프라인 저장 기능을 강조하여 서버 부하를 30% 감소시켰습니다."
        },
        {
          id: "w3",
          title: "Medi-in-Falls (메디인폴스)",
          status: "maintenance",
          duration: "2025.02 ~ 현재",
          role: "프론트엔드 개발",
          description: "의료 현장 낙상 사고 예방 시스템",
          techStack: ["Vue 2", "Electron", "OpenCV"],
          keyFeatures: [
            "CCTV 연동 실시간 모니터링",
            "낙상 감지 시 스테이션 즉각 알림 전송",
          ],
          challenges: "영상 처리 시 점유율을 낮추기 위한 프레임 최적화 작업을 수행했습니다."
        },
        {
          id: "w4",
          title: "Hey Marketing (헤이마케팅)",
          status: "completed",
          duration: "2025.04 ~ 2025.09",
          role: "기획 및 개발",
          description: "마케팅 리포트 자동 생성 솔루션",
          techStack: ["Vue 2", "Python", "Node.js"],
          keyFeatures: [
            "채널별 API 통합 데이터 시각화",
            "AI 보고서 자동 요약 기능",
          ],
          challenges: "비정형 데이터를 표준화하여 시각화 차트에 매칭하는 로직을 구현했습니다."
        },
        {
          id: "w5",
          title: "Health Signal (헬스시그널)",
          status: "onhold",
          duration: "2025.06 ~ 2025.11",
          role: "총괄 기획 및 개발",
          description: "건강 지표 실시간 체크 서비스",
          techStack: ["React Native", "Firebase"],
          keyFeatures: [
            "수면 및 스트레스 지표 분석",
            "사용자 긴급 호출 알림 기능",
          ],
          challenges: "배터리 소모를 최소화하며 백그라운드에서 데이터를 수집하는 모듈을 개발했습니다."
        }
      ]
    }
  ]
};
