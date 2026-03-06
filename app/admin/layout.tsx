'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Image as ImageIcon,
  User,
  Projector as FolderOpen,
  Briefcase,
  Award,
  Code2,
  ExternalLink
} from 'lucide-react';
import styles from './admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin/profile', label: '프로필 관리', icon: User },
    { href: '/admin/tech', label: '기술스택 관리', icon: Code2 },
    { href: '/admin/work', label: '근무경력 관리', icon: Briefcase },
    { href: '/admin/side', label: '사이드 프로젝트 관리', icon: FolderOpen },
    { href: '/admin/cert', label: '자격증 및 수상 관리', icon: Award },
    { href: '/admin/media', label: '전체 파일 관리', icon: ImageIcon },
  ];

  const currentTitle = navItems.find(item => pathname.startsWith(item.href))?.label || 'Admin Console';

  return (
    <div className={styles.adminContainer}>
      {/* 사이드바 메뉴 */}
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}><LayoutDashboard size={20} /></div>
          <h2>Admin Console</h2>
        </div>

        <div className={styles.navSection}>
          <label>Portfolio</label>
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navButton} ${isActive ? styles.active : ''}`}
                style={{ textDecoration: 'none' }}
              >
                <item.icon size={18} /> <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className={`${styles.navSection} mt-4`}>
          <label>Assets</label>
          <Link
            href="/admin/media"
            className={`${styles.navButton} ${pathname.startsWith('/admin/media') ? styles.active : ''}`}
            style={{ textDecoration: 'none' }}
          >
            <ImageIcon size={18} /> <span>전체 파일 관리</span>
          </Link>
        </div>

        <div className={`${styles.navSection} mt-5`}>
          <label>Live View</label>
          <a
            href="/portfolio"
            target="_blank"
            className={styles.navButton}
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <ExternalLink size={18} /> <span>포트폴리오 페이지 오픈</span>
          </a>
          <a
            href="/"
            target="_blank"
            className={styles.navButton}
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <ExternalLink size={18} /> <span>메인 페이지 오픈</span>
          </a>
        </div>
      </aside>

      {/* 메인 콘텐츠 영역 */}
      <main className={styles.mainLayout}>
        <header className={styles.pageHeader}>
          <div className={styles.titleGroup}>
            <h1>{currentTitle}</h1>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
