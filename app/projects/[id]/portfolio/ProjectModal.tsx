"use client";

import React from 'react';
import { motion } from 'framer-motion';
import styles from './portfolio.module.css';

/** 
 * [관리 포인트 1] 상태 설정
 */
export const STATUS_CONFIG: Record<string, { label: string, color: string }> = {
  working: { label: "개발 중", color: "#166534" },
  operating: { label: "운영 및 관리 중", color: "#075985" },
  maintenance: { label: "유지보수", color: "#475569" },
  completed: { label: "개발 완료", color: "#1e293b" },
  onhold: { label: "잠정 중단", color: "#92400e" },
};

export const StatusBadge = ({ statusKey }: { statusKey: string }) => {
  const config = STATUS_CONFIG[statusKey] || { label: statusKey, color: "#475569" };
  return (
    <div className={styles.statusBadge} data-status={statusKey}>
      {config.label}
    </div>
  );
};

interface ProjectModalProps {
  project: any;
  onClose: () => void;
}

export const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  if (!project) return null;

  return (
    <motion.div
      className={styles.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modalContent}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.btnClose} onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className={styles.modalHeader}>
          <div className={styles.modalMeta}>
            <StatusBadge statusKey={project.status} />
            <span className={styles.modalDuration}>{project.duration}</span>
          </div>
          <h2 className={styles.modalTitle}>{project.title}</h2>
          <div className={styles.modalRole}>{project.role}</div>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalSection}>
            <div className={styles.modalLabel}>
              <svg className={styles.modalSectionIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              주요 기능 및 진행 사항
            </div>
            <ul className={styles.featureList}>
              {project.keyFeatures?.map((f: string, i: number) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          <div className={styles.modalSection}>
            <div className={styles.modalLabel}>
              <svg className={styles.modalSectionIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                <line x1="6" y1="6" x2="6.01" y2="6"></line>
                <line x1="6" y1="18" x2="6.01" y2="18"></line>
              </svg>
              사용 기술 스택
            </div>
            <div className={styles.tagList}>
              {project.techStack.map((t: string, i: number) => (
                <span key={i} className={styles.modalPill}>{t}</span>
              ))}
            </div>
          </div>

          <div className={styles.modalSection}>
            <div className={styles.modalLabel}>
              <svg className={styles.modalSectionIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
              기술적 도전 및 해결
            </div>
            <p className={styles.modalText}>{project.challenges}</p>
          </div>

          {project.links && (
            <div className={styles.linkGroup}>
              {project.links.github && (
                <a href={project.links.github} target="_blank" className={styles.linkBtnSecondary}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                  GitHub
                </a>
              )}
              {project.links.demo && (
                <a href={project.links.demo} target="_blank" className={styles.linkBtnPrimary}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  Live Demo
                </a>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
