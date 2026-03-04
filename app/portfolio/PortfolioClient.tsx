"use client";

import React from 'react';
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
  GraduationCap
} from 'lucide-react';

interface PortfolioClientProps {
  initialCerts: any[];
  portfolioData: any;
}

export default function PortfolioClient({ initialCerts, portfolioData }: PortfolioClientProps) {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mainContainer}>
        {/* Left Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.profileInfo}>
            <h1>{portfolioData.name}</h1>
            <p>{portfolioData.role}</p>
          </div>

          <div className={styles.sidebarSection}>
            <span className={styles.sidebarLabel}>About</span>
            <div className={styles.contactList}>
              <div className={styles.contactItem}><Mail size={16} />{portfolioData.email}</div>
              <div className={styles.contactItem}><Phone size={16} />{portfolioData.phone}</div>
              <a href={portfolioData.github} target="_blank" className={styles.contactItem} rel="noopener noreferrer">
                <Github size={16} /> GitHub
              </a>
            </div>
          </div>

          <div className={styles.sidebarSection}>
            <span className={styles.sidebarLabel}>Skills</span>
            {portfolioData.skills.map((group: any, i: number) => (
              <div key={i} className={styles.skillGroup}>
                <h4 className={styles.skillTitle}>{group.category}</h4>
                <div className={styles.skillTags}>
                  {group.items.map((skill: string, j: number) => (
                    <span key={j} className={styles.skillTag}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.sidebarSection}>
            <span className={styles.sidebarLabel}>Education</span>
            {portfolioData.education.map((edu: any, i: number) => (
              <div key={i} className={styles.eduItem}>
                <h3>{edu.school}</h3>
                <p>{edu.degree}</p>
                <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>{edu.period}</p>
              </div>
            ))}
          </div>
        </aside>

        {/* Right Content */}
        <main className={styles.contentArea}>
          <section>
            <p className={styles.introText}>{portfolioData.description}</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Work Experience</h2>
            <div className={styles.experienceList}>
              {portfolioData.workExperience.map((work: any, i: number) => (
                <div key={i} className={styles.experienceItem}>
                  <div className={styles.expHeader}>
                    <h3 className={styles.companyName}>{work.company}</h3>
                    <span className={styles.expPeriod}>{work.period}</span>
                  </div>
                  <div className={styles.expProjects}>
                    {work.projects.map((proj: any) => (
                      <div key={proj.id} className={styles.workProject}>
                        <h4>{proj.title}</h4>
                        <p className={styles.wpDesc}>{proj.description}</p>
                        <ul className={styles.wpFeatures}>
                          {proj.keyFeatures?.map((f: string, k: number) => (
                            <li key={k}>{f}</li>
                          ))}
                        </ul>
                        <div className={styles.skillTags}>
                          {proj.techStack.map((tech: string, k: number) => (
                            <span key={k} className={styles.skillTag} style={{ background: '#eff6ff', color: '#3182ce' }}>#{tech}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Personal Projects</h2>
            <div className={styles.projectsGrid}>
              {portfolioData.personalProjects.map((proj: any) => (
                <div key={proj.id} className={styles.projectCard}>
                  <div className={styles.pTitleBox}>
                    <h3>{proj.title}</h3>
                    <div className={styles.pLinks}>
                      <a href={proj.links.github} target="_blank" className={styles.pLink} rel="noreferrer"><Github size={20} /></a>
                      <a href={proj.links.demo} target="_blank" className={styles.pLink} rel="noreferrer"><Globe size={20} /></a>
                    </div>
                  </div>
                  <p className={styles.pDesc}>{proj.description}</p>
                  <div className={styles.skillTags}>
                    {proj.techStack.map((tech: string, j: number) => (
                      <span key={j} className={styles.skillTag}>#{tech}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Certifications</h2>
            <div className={styles.certList}>
              {initialCerts.map((cert, i) => (
                <div key={i} className={styles.certItem}>
                  <div>
                    <div className={styles.certName}>{cert.title}</div>
                    <div className={styles.certIssuer}>{cert.issuer}</div>
                  </div>
                  <div className={styles.certRight}>
                    <span className={styles.certDateBadge}>
                      {cert.acquiredAt ? new Date(cert.acquiredAt).getFullYear() : '—'}
                    </span>
                    {cert.attachment?.url && (
                      <a href={cert.attachment.url} target="_blank" className={styles.certFileBtn} rel="noreferrer">
                        <FileText size={20} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
              {initialCerts.length === 0 && <p style={{ color: '#94a3b8' }}>등록된 인증 정보가 없습니다.</p>}
            </div>
          </section>

          <footer className={styles.footer}>
            <p>&copy; {new Date().getFullYear()} {portfolioData.name}. All rights reserved.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
