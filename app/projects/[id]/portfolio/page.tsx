"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './portfolio.module.css';
import { motion, AnimatePresence, Variants } from 'framer-motion';

import { ProjectModal, StatusBadge } from './ProjectModal';

const portfolioData = {
  name: "김세웅", // User might want to change this later
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
          <path d="M128 57c-39.21 0-71 31.79-71 71s31.79 71 71 71 71-31.79 71-71-31.79-71-71-71zm0 115c-24.26 0-44-19.74-44-44s19.74-44 44-44 44 19.74 44 44-19.74 44-44 44z" fill="#F29111" />
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

const SkillItem = ({ skill, variants }: { skill: any, variants: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div className={styles.skillItem} variants={variants}>
      <div
        className={styles.skillMain}
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer' }}
      >
        <div className={styles.skillHeader}>
          <div className={styles.skillNameGroup}>
            {skill.icon}
            <span className={styles.skillName}>{skill.name}</span>
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              className={styles.chevronIcon}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.span>
          </div>
          <span className={styles.skillGrade}>{skill.level}</span>
        </div>
        <div className={styles.gaugeContainer}>
          <motion.div
            className={styles.gaugeFill}
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.percent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
          />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={styles.skillDescWrap}
          >
            <p className={styles.skillDescText}>{skill.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function PortfolioPage() {
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const openModal = (project: any) => setSelectedProject(project);
  const closeModal = () => setSelectedProject(null);

  const [certs, setCerts] = useState<any[]>([]);
  const [isAddingCert, setIsAddingCert] = useState(false);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [isUnknownDate, setIsUnknownDate] = useState(false);

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    const res = await fetch('/api/certifications');
    if (res.ok) {
      const data = await res.json();
      setCerts(data);
    }
  };

  const handleAddCert = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const body = {
      name: formData.get('name'),
      issuer: formData.get('issuer'),
      status: formData.get('status'),
      acquireDate: isUnknownDate ? null : formData.get('acquireDate'),
    };

    const url = editingCertId
      ? `/api/certifications/${editingCertId}`
      : '/api/certifications';

    const method = editingCertId ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setIsAddingCert(false);
      setEditingCertId(null);
      setIsUnknownDate(false);
      fetchCerts();
    }
  };

  const handleDeleteCert = async (id: string) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;
    const res = await fetch(`/api/certifications/${id}`, { method: 'DELETE' });
    if (res.ok) fetchCerts();
  };

  const startEditCert = (cert: any) => {
    setIsAddingCert(true);
    setEditingCertId(cert.id);
    setIsUnknownDate(!cert.acquireDate);
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.portfolioContainer}>

      {/* 1. Header with Motion */}
      <motion.header
        className={styles.header}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className={styles.profileTag}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          Available for New Tech
        </motion.div>
        <h1 className={styles.title}>{portfolioData.name}</h1>
        <p className={styles.subtitle}>{portfolioData.role}</p>

        <motion.p
          className={styles.description}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {portfolioData.description}
        </motion.p>

        <div className={styles.contactInfo}>
          <span>{portfolioData.email}</span>
          <span className={styles.divider}>|</span>
          <span>{portfolioData.phone}</span>
        </div>
      </motion.header>

      {/* 1.5 Professional Summary */}
      <motion.section
        className={styles.sectionWrapperSmall}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <div className={styles.summaryCard}>
          <h2 className={styles.summaryTitle}>About Me</h2>
          <p className={styles.summaryText}>
            {portfolioData.description}
          </p>
        </div>
      </motion.section>

      {/* 2. Skills & Info Section */}
      <motion.section
        className={styles.sectionWrapper}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className={styles.infoGrid}>
          {/* Skill Gauges */}
          <motion.div className={styles.infoCard} variants={itemVariants}>
            <h2 className={styles.sectionTitle}>Technical Skills</h2>
            <div className={styles.skillList}>
              {portfolioData.skills.map((skill, i) => (
                <SkillItem key={i} skill={skill} variants={itemVariants} />
              ))}
            </div>

            <div className={styles.toolGroups}>
              <div className={styles.toolSubGroup}>
                <h3 className={styles.subTitle}>Design & Collab</h3>
                <div className={styles.tagList}>
                  {portfolioData.tools.map((t, i) => (
                    <span key={i} className={styles.pillTag}>
                      {t.icon}
                      <span style={{ marginLeft: '6px' }}>{t.name}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.toolSubGroup}>
                <h3 className={styles.subTitle}>AI Assistance</h3>
                <div className={styles.tagList}>
                  {portfolioData.aiTools.map((t, i) => (
                    <span key={i} className={styles.aiTag}>
                      {t.icon}
                      <span style={{ marginLeft: '6px' }}>{t.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Education & Certs */}
          <motion.div className={styles.infoCard} variants={itemVariants}>
            <h2 className={styles.sectionTitle}>Edu & Credentials</h2>
            <div className={styles.eduSection}>
              {portfolioData.education.map((edu, i) => (
                <div key={i} className={styles.eduItem}>
                  <div className={styles.infoLabel}>{edu.school}</div>
                  <div className={styles.infoValue}>{edu.degree} ({edu.period})</div>
                </div>
              ))}
            </div>
            <div className={styles.certGrid}>
              {certs.length > 0 ? certs.map((cert, i) => (
                <div key={i} className={styles.certItem}>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span className={styles.certName}>{cert.name}</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{cert.issuer} ({cert.status})</span>
                    <div className={styles.certItemActions}>
                      <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => startEditCert(cert)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDeleteCert(cert.id)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <span className={styles.certDate}>
                    {cert.acquireDate ? (() => {
                      const d = new Date(cert.acquireDate);
                      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
                    })() : '미지정'}
                  </span>
                </div>
              )) : (
                <div className={styles.emptyCerts}>
                  등록된 자격증이 없습니다.
                </div>
              )}
            </div>

            <AnimatePresence>
              {isAddingCert ? (
                <motion.form
                  className={styles.certForm}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onSubmit={handleAddCert}
                >
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>자격증 명칭</label>
                    <input
                      className={styles.certInput}
                      name="name"
                      placeholder="예: 정보처리산업기사"
                      defaultValue={editingCertId ? certs.find(c => c.id === editingCertId)?.name : ''}
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>발급 기관</label>
                    <input
                      className={styles.certInput}
                      name="issuer"
                      placeholder="예: 한국산업인력공단"
                      defaultValue={editingCertId ? certs.find(c => c.id === editingCertId)?.issuer : ''}
                      required
                    />
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.inputGroup} style={{ flex: 1 }}>
                      <div className={styles.labelRow}>
                        <label className={styles.inputLabel}>상태</label>
                      </div>
                      <select
                        className={styles.certInput}
                        name="status"
                        defaultValue={editingCertId ? certs.find(c => c.id === editingCertId)?.status : '취득완료'}
                      >
                        <option value="취득완료">취득완료</option>
                        <option value="준비중">준비중</option>
                        <option value="응시예정">응시예정</option>
                      </select>
                    </div>
                    <div className={styles.inputGroup} style={{ flex: 1 }}>
                      <div className={styles.labelRowWithCheckbox}>
                        <label className={styles.inputLabel}>취득 일자</label>
                        <label className={styles.checkboxGroup}>
                          <input
                            type="checkbox"
                            className={styles.checkboxInput}
                            checked={isUnknownDate}
                            onChange={(e) => setIsUnknownDate(e.target.checked)}
                          />
                          <div className={styles.customCheckbox}>
                            <svg className={styles.checkIcon} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                          <span className={styles.checkboxLabel}>모름/준비중</span>
                        </label>
                      </div>
                      <div className={styles.datePickerContainer}>
                        <input
                          type="date"
                          className={styles.certInput}
                          name="acquireDate"
                          disabled={isUnknownDate}
                          defaultValue={editingCertId && certs.find(c => c.id === editingCertId)?.acquireDate ? new Date(certs.find(c => c.id === editingCertId).acquireDate).toISOString().split('T')[0] : ''}
                          required={!isUnknownDate}
                          onClick={(e) => {
                            if (!isUnknownDate) {
                              try {
                                (e.currentTarget as any).showPicker();
                              } catch (err) {
                                // Fallback for browsers that don't support showPicker()
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.certFormActions}>
                    <button type="submit" className={styles.certSubmitBtn}>
                      {editingCertId ? '수정 완료' : '저장'}
                    </button>
                    <button
                      type="button"
                      className={styles.certCancelBtn}
                      onClick={() => {
                        setIsAddingCert(false);
                        setEditingCertId(null);
                        setIsUnknownDate(false);
                      }}
                    >
                      취소
                    </button>
                  </div>
                </motion.form>
              ) : (
                <button className={styles.certAddBtn} onClick={() => setIsAddingCert(true)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  자격증 추가하기
                </button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.section>

      {/* 3. Personal Projects - Horizontal Scroll */}
      <motion.section
        className={styles.sectionWrapper}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className={styles.sectionHeaderProjects}>
          <div className={styles.headerInfo}>
            <h2 className={styles.sectionTitle}>개인 프로젝트</h2>
            <p className={styles.sectionDesc}>함께 성장하며 만들어가는 프로젝트입니다.</p>
          </div>
          <div className={styles.scrollControls}>
            <button className={styles.scrollNavBtn} onClick={() => scroll('left')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button className={styles.scrollNavBtn} onClick={() => scroll('right')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
        <div className={styles.horizontalScroll} ref={scrollRef}>
          {portfolioData.personalProjects.map((project) => (
            <motion.div
              key={project.id}
              className={styles.scrollCard}
              variants={itemVariants}
            >
              <StatusBadge statusKey={project.status} />
              <h3 className={styles.cardTitle}>{project.title}</h3>
              <p className={styles.cardDuration}>{project.duration}</p>
              <p className={styles.cardDescShort}>{project.description}</p>
              <div className={styles.tagList}>
                {project.techStack.map((t, i) => (
                  <span key={i} className={styles.pillTagSmall}>{t}</span>
                ))}
              </div>
              <button className={styles.btnDetail} onClick={() => openModal(project)}>
                상세 정보 보기
              </button>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 4. Company Experience */}
      <motion.section
        className={styles.sectionWrapper}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>실무 경력</h2>
        </div>

        {
          portfolioData.workExperience.map((work, idx) => (
            <div key={idx} className={styles.experienceItem}>
              {/* Left Side: Company Info */}
              <motion.div className={styles.companySide} variants={itemVariants}>
                <div className={styles.companyName}>{work.company}</div>
                <div className={styles.companyGroup}>
                  <div className={styles.workRole}>{work.role}</div>
                  <div className={styles.workPeriod}>{work.period}</div>
                </div>
              </motion.div>

              {/* Right Side: Projects Grid */}
              <div className={styles.workProjectGrid}>
                {work.projects.map((p) => (
                  <motion.div
                    key={p.id}
                    className={styles.workProjectCard}
                    variants={itemVariants}
                  >
                    <StatusBadge statusKey={p.status} />
                    <h4 className={styles.projTitle}>{p.title}</h4>
                    <p className={styles.projDuration}>{p.duration}</p>
                    <p className={styles.projDesc}>{p.description}</p>
                    <div className={styles.tagList}>
                      {p.techStack.map((t, i) => (
                        <span key={i} className={styles.pillTagSmall}>{t}</span>
                      ))}
                    </div>
                    <button className={styles.btnDetailSimple} onClick={() => openModal(p)}>
                      상세보기
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        }
      </motion.section>

      {/* Footer */}
      <footer className={styles.footer}>
        &copy; 2026 {portfolioData.name}. All rights reserved.
      </footer>

      {/* Modal - Unchanged but ensure mapping works */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
