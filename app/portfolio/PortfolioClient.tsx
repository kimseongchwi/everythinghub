"use client";

import React, { useState } from 'react';
import styles from './portfolio.module.css';
import {
  Mail,
  Phone,
  Github,
  Globe,
  ExternalLink,
  FileText,
  Award,
  Briefcase,
  Layers,
  FolderOpen,
  ChevronDown,
  ArrowUpRight,
  Code2,
  Cpu,
  Database,
  Cloud,
  Layers3,
  Terminal,
  ChevronRight,
  X
} from 'lucide-react';
import TechIcon from '@/components/TechIcon';

interface PortfolioClientProps {
  initialCerts: any[];
  portfolioData: any;
}

export default function PortfolioClient({ initialCerts, portfolioData }: PortfolioClientProps) {
  const [activeNav, setActiveNav] = useState('경력');
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const navItems = [
    { label: '경력', icon: <Briefcase size={16} />, id: 'career' },
    { label: '기술 스택', icon: <Cpu size={16} />, id: 'skills' },
    { label: '프로젝트', icon: <FolderOpen size={16} />, id: 'projects' },
    { label: '자격증', icon: <Award size={16} />, id: 'certs' },
  ];

  return (
    <div className={styles.pageWrapper}>
      {/* Sidebar - Dark Navy */}
      <aside className={styles.sidebar}>
        <div className={styles.profileInfo}>
          <h1>{portfolioData.name}</h1>
          <p className={styles.profilePosition}>{portfolioData.position}</p>
        </div>

        <div className={styles.sidebarSection}>
          <span className={styles.sidebarLabel}>CONTACT</span>
          <div className={styles.contactList}>
            <a href={`mailto:${portfolioData.email}`} className={styles.contactItem}>
              <div className={styles.contactIconBox}><Mail size={14} /></div>
              <span>{portfolioData.email}</span>
            </a>
            <a href={`tel:${portfolioData.phone}`} className={styles.contactItem}>
              <div className={styles.contactIconBox}><Phone size={14} /></div>
              <span>{portfolioData.phone}</span>
            </a>
            <a href={portfolioData.github} target="_blank" className={styles.contactItem} rel="noopener noreferrer">
              <div className={styles.contactIconBox}><Github size={14} /></div>
              <span>GitHub</span>
            </a>
          </div>
        </div>

        <div className={styles.sidebarSection}>
          <span className={styles.sidebarLabel}>EDUCATION</span>
          {portfolioData.education.map((edu: any, i: number) => (
            <div key={i} style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 800, margin: '0 0 4px 0' }}>{edu.school}</p>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0 0 4px 0' }}>{edu.major}</p>
              <p style={{ fontSize: '0.7rem', color: '#64748b', margin: 0 }}>{edu.degreeStatus} · {edu.period}</p>
            </div>
          ))}
        </div>

        <div className={styles.sidebarSection}>
          <span className={styles.sidebarLabel}>QUICK NAV</span>
          <div className={styles.navMenu}>
            {navItems.map((item) => (
              <a 
                key={item.id} 
                href={`#${item.id}`} 
                className={`${styles.navItem} ${activeNav === item.label ? styles.navItemActive : ''}`}
                onClick={() => setActiveNav(item.label)}
              >
                {item.icon}
                {item.label}
              </a>
            ))}
          </div>
        </div>


      </aside>

      {/* Content Area */}
      <main className={`${styles.mainContainer} ${styles.fadeIn}`}>
        
        {/* Intro */}
        <section className={styles.introSection}>
          <div className={styles.introSmallTitle}>PORTFOLIO</div>
          <h2 className={styles.introTitle}>
            안녕하세요,<br />
            <span>{portfolioData.position}</span> {portfolioData.name}입니다.
          </h2>
          <div 
            className={styles.introText} 
            style={{ whiteSpace: 'pre-wrap' }}
            dangerouslySetInnerHTML={{ __html: portfolioData.description }}
          />
        </section>

        {/* Career (Work Experience) */}
        <section id="career" className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}><Briefcase size={20} /></div>
            <h2 className={styles.sectionTitle}>경력</h2>
            <div className={styles.titleLine}></div>
          </div>
          
          <div className={styles.experienceList}>
            {portfolioData.workExperience.map((work: any, i: number) => (
              <div key={i} className={styles.expItemWrapper}>
                <div className={styles.expCard}>
                  <div className={styles.expInfo}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <h3>{work.company}</h3>
                    </div>
                    <div className={styles.expRole}>{work.role}</div>
                    <div className={styles.expDate}>
                      <FileText size={12} /> {work.period}
                    </div>
                    <p className={styles.expSummary}>{work.summary}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Expertise */}
        <section id="skills" className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}><Code2 size={20} /></div>
            <h2 className={styles.sectionTitle}>기술 스택</h2>
            <div className={styles.titleLine}></div>
          </div>
          
          {portfolioData.skills.map((group: any, i: number) => (
            <div key={i} className={styles.techCategoryBlock}>
              <span className={styles.techCategoryLabel}>{group.category}</span>
              <div className={styles.techGrid}>
                {group.items.map((skill: any, j: number) => (
                  <div key={j} className={styles.techPill}>
                    <TechIcon name={skill.name} size={18} />
                    <span>{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Projects */}
        <section id="projects" className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}><FolderOpen size={20} /></div>
            <h2 className={styles.sectionTitle}>프로젝트</h2>
            <div className={styles.titleLine}></div>
          </div>
          
          <div className={styles.projectsGrid}>
            {portfolioData.sideProjects.map((proj: any) => (
              <div key={proj.id} className={styles.projectCard}>
                <div className={styles.projectImage}>
                  {proj.thumbnailUrl ? (
                    <img src={proj.thumbnailUrl} alt={proj.title} />
                  ) : (
                    <div className={styles.emptyProjectImage}>
                      <FolderOpen size={48} strokeWidth={1.5} />
                    </div>
                  )}
                </div>
                <div className={styles.projectContent}>
                  <div className={styles.projectHeader}>
                    <div>
                      <h4>{proj.title}</h4>
                      <div className={styles.projectDate}>{proj.period}</div>
                    </div>
                    {proj.status && (
                      <span className={styles.currentBadge}>{proj.status}</span>
                    )}
                  </div>
                  
                  {proj.description && (
                    <p className={styles.projectDesc}>{proj.description}</p>
                  )}
                  
                  <div className={styles.projectTechs}>
                    {proj.techStack.slice(0, 5).map((tech: string, k: number) => (
                      <span key={k} className={styles.projectTechTag}>
                        <TechIcon name={tech} size={12} />
                        {tech}
                      </span>
                    ))}
                    {proj.techStack.length > 5 && <span className={styles.projectTechTag}>+{proj.techStack.length - 5}</span>}
                  </div>

                  <div className={styles.projectActions}>
                    <button 
                      onClick={() => setSelectedProject(proj)}
                      className={`${styles.btnAction} ${styles.btnActionOutline}`}
                    >
                      간략히
                    </button>
                    <a href={`/portfolio/${proj.id}`} className={`${styles.btnAction} ${styles.btnActionSecondary}`}>
                      자세히
                    </a>
                    {proj.links.github && (
                      <a href={proj.links.github} target="_blank" rel="noreferrer" className={`${styles.btnAction} ${styles.btnActionSecondary}`}>
                        <Github size={14} /> GitHub
                      </a>
                    )}
                    {proj.links.demo && (
                      <a href={proj.links.demo} target="_blank" rel="noreferrer" className={`${styles.btnAction} ${styles.btnActionPrimary}`}>
                        <ExternalLink size={14} /> 페이지 오픈
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Project Summary Modal */}
          {selectedProject && (
            <div className={styles.modalOverlay} onClick={() => setSelectedProject(null)}>
              <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                  <h3>프로젝트 요약</h3>
                  <button className={styles.closeBtn} onClick={() => setSelectedProject(null)}>
                    <X size={20} />
                  </button>
                </div>
                <div className={styles.modalBody}>
                  <div className={styles.modalScroll}>
                    <div className={styles.modalIntro}>{selectedProject.title}</div>
                    <div className={styles.modalDescription}>
                      {selectedProject.content || selectedProject.description || "설명이 아직 등록되지 않았습니다."}
                    </div>
                  </div>
                </div>
                <div className={styles.modalFooter}>
                  <button 
                    className={styles.btnAction} 
                    style={{ maxWidth: '100px' }} 
                    onClick={() => setSelectedProject(null)}
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Accreditations */}
        <section id="certs" className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}><Award size={20} /></div>
            <h2 className={styles.sectionTitle}>자격증</h2>
            <div className={styles.titleLine}></div>
          </div>
          
          <div className={styles.certsList}>
            {initialCerts.map((cert, i) => (
              <div key={i} className={styles.certItem}>
                <div className={styles.certMain}>
                  <h5 className={styles.certTitle}>{cert.title}</h5>
                  <p className={styles.certOrg}>{cert.issuer}</p>
                </div>
                <div className={styles.certDate}>{cert.acquiredAt}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
