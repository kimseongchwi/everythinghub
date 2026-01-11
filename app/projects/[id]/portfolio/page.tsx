"use client";

import React, { useState } from 'react';
import styles from './portfolio.module.css';
import { motion, AnimatePresence } from 'framer-motion';

/** 
 * [관리 포인트 1] 상태 설정
 */
const STATUS_CONFIG: Record<string, { label: string }> = {
  working: { label: "작업중" },
  maintenance_active: { label: "유지보수 및 계속 작업중" },
  maintenance: { label: "유지보수" },
  onhold: { label: "잠정중단" },
  dropped: { label: "런칭 포기" }
};

/**
 * [관리 포인트 2] 배지 컴포넌트
 */
const StatusBadge = ({ statusKey }: { statusKey: string }) => {
  const config = STATUS_CONFIG[statusKey] || { label: statusKey };
  return (
    <div className={styles.statusBadge} data-status={statusKey}>
      {config.label}
    </div>
  );
};

const portfolioData = {
  name: "12",
  role: "풀스택 개발자",
  email: "kimseongchwi@example.com",
  phone: "010-1234-5678",
  education: [
    { school: "한국대학교", degree: "컴퓨터공학 전공", period: "2018 - 2022" },
  ],
  certifications: [
    { name: "정보처리기사", date: "2021.05" },
    { name: "정보처리산업기사", date: "2021.05" },
    { name: "SQLD", date: "2021.08" },
  ],
  personalProjects: [
    {
      id: "p1",
      title: "Everything Hub",
      status: "maintenance_active",
      duration: "2023.10 ~ 현재 (약 1년 3개월)",
      role: "1인 개발 (기획, 디자인, 풀스택 개발)",
      description: "다양한 실무 도구들을 모아놓은 통합 플랫폼 프로젝트입니다.",
      techStack: ["Next.js 15", "TypeScript", "Tailwind CSS", "Prisma", "MySQL"],
      keyFeatures: [
        "애플리케이션 내 미니 도구(계산기, 포맷터) 통합 관리",
        "Next.js App Router 기반의 빠른 페이지 전환",
        "Prisma ORM을 이용한 유연한 DB 관리",
        "다크모드 및 반응형 디자인 완벽 지원"
      ],
      challenges: "여러 도구의 상태를 효율적으로 관리하기 위해 복합적인 레이아웃 구조를 설계하는 과정에서 많은 고민이 있었습니다. 컴포넌트 단위로 기능을 분리하여 유지보수성을 높였습니다.",
      links: { github: "https://github.com", demo: "https://example.com" }
    },
    {
      id: "p2",
      title: "AI Chat Assistant",
      status: "onhold",
      duration: "2023.05 ~ 2023.09 (5개월)",
      role: "1인 개발",
      description: "LLM API를 연동하여 만든 지능형 대화 비서입니다.",
      techStack: ["React", "OpenAI API", "Node.js", "Express"],
      keyFeatures: [
        "OpenAI API 연동 실시간 스트리밍 대화",
        "세션별 대화 내역 저장 및 조회",
        "Markdown 렌더링 지원"
      ],
      challenges: "API의 응답이 늦어질 때 사용자 경험을 해치지 않도록 스트리밍 처리를 구현하는 것이 가장 큰 도전이었습니다.",
      links: { github: "https://github.com" }
    }
  ],
  workExperience: [
    {
      company: "(주)테크솔루션",
      period: "2022.03 - 현재",
      role: "프론트엔드 개발자",
      projects: [
        {
          id: "w1",
          title: "데이터 시각화 대시보드",
          status: "maintenance",
          duration: "2022.04 ~ 2022.12 (9개월)",
          role: "프론트엔드 메인 개발",
          description: "사내 주요 지표 모니터링 시스템",
          techStack: ["React", "D3.js", "Redux Toolkit", "Ant Design"],
          keyFeatures: [
            "D3.js를 이용한 대용량 데이터 실시간 차트 구현",
            "공통 컴포넌트 라이브러리 구축",
            "REST API 연동 최적화"
          ],
          challenges: "데이터가 수만 건이 넘어갈 때 브라우저 렌더링 성능이 저하되는 이슈를 Canvas 연동과 메모이제이션으로 해결했습니다."
        },
        {
          id: "w2",
          title: "자산 관리 모바일 웹",
          status: "working",
          duration: "2023.02 ~ 현재",
          role: "프론트엔드 리드 / 기획 참여",
          description: "실시간 비품 재고 관리 시스템",
          techStack: ["Next.js", "PWA", "MySQL", "React Query"],
          keyFeatures: [
            "QR 코드 스캐닝 기반 자산 등록 시스템",
            "PWA 도입으로 오프라인 환경 대응",
            "관리자 대시보드 및 통계 기능"
          ],
          challenges: "창고 내 불안정한 네트워크 환경을 대비해 오프라인 우선(Offline-first) 데이터 동기화 로직을 설계했습니다."
        }
      ]
    }
  ]
};

export default function PortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const openModal = (project: any) => setSelectedProject(project);
  const closeModal = () => setSelectedProject(null);

  return (
    <div className={styles.portfolioContainer}>

      {/* 1. Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>{portfolioData.name}</h1>
        <p className={styles.subtitle}>{portfolioData.role}</p>
        <div className={styles.contactInfo}>
          <span>{portfolioData.email}</span>
          <span>{portfolioData.phone}</span>
        </div>
      </header>

      {/* 2. Personal Info Grid */}
      <section className={`${styles.sectionWrapper}`}>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: '20px' }}>학력</h2>
            {portfolioData.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: '15px' }}>
                <span className={styles.infoLabel}>{edu.school}</span>
                <span className={styles.infoValue}>{edu.degree} ({edu.period})</span>
              </div>
            ))}
          </div>
          <div className={styles.infoCard}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: '20px' }}>자격사항</h2>
            {portfolioData.certifications.map((cert, i) => (
              <div key={i} style={{ marginBottom: '15px' }}>
                <span className={styles.infoLabel}>{cert.name}</span>
                <span className={styles.infoValue}>{cert.date}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Personal Projects */}
      <section className={styles.sectionWrapper}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>개인 프로젝트</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>좌우로 밀어서 확인하세요</p>
        </div>
        <div className={styles.horizontalScroll}>
          {portfolioData.personalProjects.map((project) => (
            <div key={project.id} className={styles.scrollCard}>
              <StatusBadge statusKey={project.status} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '8px', marginTop: '12px' }}>{project.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '8px' }}>{project.duration}</p>
              <p style={{ color: '#64748b', fontSize: '0.95rem', height: '3rem', overflow: 'hidden', marginBottom: '12px' }}>{project.description}</p>
              <div className={styles.tagList}>
                {project.techStack.slice(0, 3).map((t, i) => (
                  <span key={i} className={styles.pillTag}>{t}</span>
                ))}
                {project.techStack.length > 3 && <span className={styles.pillTag}>+</span>}
              </div>
              <button className={styles.btnDetail} onClick={() => openModal(project)}>
                상세보기
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Company Projects */}
      <section className={`${styles.sectionWrapper}`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>경력 프로젝트</h2>
        </div>
        {portfolioData.workExperience.map((work, idx) => (
          <div key={idx} className={styles.experienceItem}>
            <div className={styles.companyHeader}>
              <div className={styles.companyName}>{work.company}</div>
              <div className={styles.workMeta}>{work.role} | {work.period}</div>
            </div>

            <div className={styles.workProjectGrid}>
              {work.projects.map((p) => (
                <div key={p.id} className={styles.workProjectCard}>
                  <StatusBadge statusKey={p.status} />
                  <h4 style={{ fontWeight: 'bold', marginBottom: '4px', marginTop: '8px' }}>{p.title}</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '8px' }}>{p.duration}</p>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '12px' }}>{p.description}</p>
                  <div className={styles.tagList}>
                    {p.techStack.slice(0, 3).map((t, i) => (
                      <span key={i} className={styles.pillTag}>{t}</span>
                    ))}
                  </div>
                  <button className={styles.btnDetail} onClick={() => openModal(p)}>
                    상세보기
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8', fontSize: '0.85rem' }}>
        &copy; 2026 {portfolioData.name}. All rights reserved.
      </footer>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className={styles.modalContent}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.btnClose} onClick={closeModal}>&times;</button>

              <div className={styles.modalHeader}>
                <div className={styles.modalMeta}>
                  <StatusBadge statusKey={selectedProject.status} />
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{selectedProject.duration}</span>
                </div>
                <h2 className={styles.modalTitle}>{selectedProject.title}</h2>
                <div style={{ color: '#3b82f6', fontWeight: '700', fontSize: '0.95rem' }}>{selectedProject.role}</div>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.modalSection}>
                  <span className={styles.modalLabel}>Key Features</span>
                  <ul className={styles.featureList}>
                    {selectedProject.keyFeatures.map((f: string, i: number) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.modalSection}>
                  <span className={styles.modalLabel}>Tech Stack</span>
                  <div className={styles.tagList}>
                    {selectedProject.techStack.map((t: string, i: number) => (
                      <span key={i} className={styles.pillTag}>{t}</span>
                    ))}
                  </div>
                </div>

                <div className={styles.modalSection}>
                  <span className={styles.modalLabel}>Challenges & Solutions</span>
                  <p className={styles.modalText}>{selectedProject.challenges}</p>
                </div>

                {selectedProject.links && (
                  <div className={styles.linkGroup}>
                    {selectedProject.links.github && (
                      <a href={selectedProject.links.github} target="_blank" className={`${styles.linkButton} ${styles.linkButtonSecondary}`}>
                        GitHub
                      </a>
                    )}
                    {selectedProject.links.demo && (
                      <a href={selectedProject.links.demo} target="_blank" className={`${styles.linkButton} ${styles.linkButtonPrimary}`}>
                        Live Demo
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
