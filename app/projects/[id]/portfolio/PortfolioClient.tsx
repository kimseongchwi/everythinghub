"use client";

import React, { useState, useRef } from 'react';
import styles from './portfolio.module.css';
import { ProjectModal, StatusBadge } from './ProjectModal';

interface PortfolioClientProps {
  initialCerts: any[];
  portfolioData: any;
}

const SkillItem = ({ skill }: { skill: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.skillItem}>
      <div
        className={styles.skillMain}
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer' }}
      >
        <div className={styles.skillHeader}>
          <div className={styles.skillNameGroup}>
            {skill.icon}
            <span className={styles.skillName}>{skill.name}</span>
            <span
              style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
              className={styles.chevronIcon}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
          <span className={styles.skillGrade}>{skill.level}</span>
        </div>
        <div className={styles.gaugeContainer}>
          <div
            className={styles.gaugeFill}
            style={{ width: `${skill.percent}%` }}
          />
        </div>
      </div>

      {isOpen && (
        <div className={styles.skillDescWrap}>
          <p className={styles.skillDescText}>{skill.desc}</p>
        </div>
      )}
    </div>
  );
};

export default function PortfolioClient({ initialCerts, portfolioData }: PortfolioClientProps) {
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const openModal = (project: any) => setSelectedProject(project);
  const closeModal = () => setSelectedProject(null);

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
      <header className={styles.header}>
        <div className={styles.profileTag}>Available for New Tech</div>
        <h1 className={styles.title}>{portfolioData.name}</h1>
        <p className={styles.subtitle}>{portfolioData.role}</p>
        <p className={styles.description}>{portfolioData.description}</p>
        <div className={styles.contactInfo}>
          <span>{portfolioData.email}</span>
          <span className={styles.divider}>|</span>
          <span>{portfolioData.phone}</span>
        </div>
      </header>

      <section className={styles.sectionWrapperSmall}>
        <div className={styles.summaryCard}>
          <h2 className={styles.summaryTitle}>About Me</h2>
          <p className={styles.summaryText}>{portfolioData.description}</p>
        </div>
      </section>

      <section className={styles.sectionWrapper}>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <h2 className={styles.sectionTitle}>Technical Skills</h2>
            <div className={styles.skillList}>
              {portfolioData.skills.map((skill: any, i: number) => (
                <SkillItem key={i} skill={skill} />
              ))}
            </div>
            <div className={styles.toolGroups}>
              <div className={styles.toolSubGroup}>
                <h3 className={styles.subTitle}>Design & Collab</h3>
                <div className={styles.tagList}>
                  {portfolioData.tools.map((t: any, i: number) => (
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
                  {portfolioData.aiTools.map((t: any, i: number) => (
                    <span key={i} className={styles.aiTag}>
                      {t.icon}
                      <span style={{ marginLeft: '6px' }}>{t.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.infoCard}>
            <h2 className={styles.sectionTitle}>Edu & Credentials</h2>
            <div className={styles.eduSection}>
              {portfolioData.education.map((edu: any, i: number) => (
                <div key={i} className={styles.eduItem}>
                  <div className={styles.infoLabel}>{edu.school}</div>
                  <div className={styles.infoValue}>{edu.degree} ({edu.period})</div>
                </div>
              ))}
            </div>
            <div className={styles.certGrid}>
              {initialCerts.length > 0 ? initialCerts.map((cert, i) => (
                <div key={i} className={styles.certItem}>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span className={styles.certName}>{cert.name}</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{cert.issuer} ({cert.status})</span>
                  </div>
                  <span className={styles.certDate}>
                    {cert.acquireDate ? (() => {
                      const d = new Date(cert.acquireDate);
                      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
                    })() : '미지정'}
                  </span>
                </div>
              )) : (
                <div className={styles.emptyCerts}>등록된 자격증이 없습니다.</div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionWrapper}>
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
          {portfolioData.personalProjects.map((project: any) => (
            <div key={project.id} className={styles.scrollCard}>
              <StatusBadge statusKey={project.status} />
              <h3 className={styles.cardTitle}>{project.title}</h3>
              <p className={styles.cardDuration}>{project.duration}</p>
              <p className={styles.cardDescShort}>{project.description}</p>
              <div className={styles.tagList}>
                {project.techStack.map((t: any, i: number) => (
                  <span key={i} className={styles.pillTagSmall}>{t}</span>
                ))}
              </div>
              <button className={styles.btnDetail} onClick={() => openModal(project)}>상세 정보 보기</button>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.sectionWrapper}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>실무 경력</h2>
        </div>
        {portfolioData.workExperience.map((work: any, idx: number) => (
          <div key={idx} className={styles.experienceItem}>
            <div className={styles.companySide}>
              <div className={styles.companyName}>{work.company}</div>
              <div className={styles.companyGroup}>
                <div className={styles.workRole}>{work.role}</div>
                <div className={styles.workPeriod}>{work.period}</div>
              </div>
            </div>
            <div className={styles.workProjectGrid}>
              {work.projects.map((p: any) => (
                <div key={p.id} className={styles.workProjectCard}>
                  <StatusBadge statusKey={p.status} />
                  <h4 className={styles.projTitle}>{p.title}</h4>
                  <p className={styles.projDuration}>{p.duration}</p>
                  <p className={styles.projDesc}>{p.description}</p>
                  <div className={styles.tagList}>
                    {p.techStack.map((t: any, i: number) => (
                      <span key={i} className={styles.pillTagSmall}>{t}</span>
                    ))}
                  </div>
                  <button className={styles.btnDetailSimple} onClick={() => openModal(p)}>
                    상세보기
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <footer className={styles.footer}>
        &copy; 2026 {portfolioData.name}. All rights reserved.
      </footer>

      {selectedProject && <ProjectModal project={selectedProject} onClose={closeModal} />}
    </div>
  );
}
