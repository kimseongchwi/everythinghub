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
  const [profile, setProfile] = React.useState<any>(null);

  React.useEffect(() => {
    fetch('/api/admin?target=profile')
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error(err));
  }, []);

  const navItems = [
    { href: '/admin/profile', label: '프로필 관리', icon: User, category: 'PORTFOLIO' },
    { href: '/admin/tech', label: '기술스택 관리', icon: Code2, category: 'PORTFOLIO' },
    { href: '/admin/work', label: '근무경력 관리', icon: Briefcase, category: 'PORTFOLIO' },
    { href: '/admin/side', label: '사이드 프로젝트 관리', icon: FolderOpen, category: 'PORTFOLIO' },
    { href: '/admin/cert', label: '자격증 및 수상 관리', icon: Award, category: 'PORTFOLIO' },
    { href: '/admin/media', label: '전체 파일 관리', icon: ImageIcon, category: 'ASSETS' },
  ];

  return (
    <div className={styles.adminContainer}>
      {/* 사이드바 메뉴 */}
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}>N</div>
          <h2>Admin Console</h2>
        </div>

        <div className={styles.navContainer}>
          <div className={styles.navSection}>
            <div className={styles.navSectionLabel}>PORTFOLIO</div>
            {navItems.filter(i => i.category === 'PORTFOLIO').map((item) => {
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

          <div className={styles.navSection}>
            <div className={styles.navSectionLabel}>ASSETS</div>
            {navItems.filter(i => i.category === 'ASSETS').map((item) => {
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

          <div className={styles.navSection}>
            <div className={styles.navSectionLabel}>LIVE VIEW</div>
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
        </div>

        <div className={styles.sidebarFooter}>
          <div className={styles.userAvatarMini}>
            {profile?.name ? profile.name[0] : 'K'}
          </div>
          <div className={styles.userInfoMini}>
            <span className={styles.userNameMini}>{profile?.name || '김성취'}</span>
            <span className={styles.userRoleMini}>관리자</span>
          </div>
        </div>
      </aside>

      {/* 메인 콘텐츠 영역 */}
      <main className={styles.mainLayout}>
        {children}
      </main>
    </div>
  );
}
