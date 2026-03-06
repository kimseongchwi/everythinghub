'use client';

import React, { useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';

// 공통 빈 데이터 표시 컴포넌트
export const EmptyState = ({ message, onAdd }: { message: string, onAdd?: () => void }) => (
  <div style={{
    textAlign: 'center',
    padding: '60px 24px',
    color: '#94a3b8',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px'
  }}>
    <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{message}</p>
    {onAdd && (
      <button
        onClick={onAdd}
        style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#3b82f6',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: '4px',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.background = '#eff6ff'}
        onMouseOut={(e) => e.currentTarget.style.background = 'none'}
      >
        새 데이터 등록하기
      </button>
    )}
  </div>
);

// 로딩 상태 표시 컴포넌트
export const LoadingState = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    color: '#94a3b8',
    gap: '12px'
  }}>
    <Loader2 size={24} className="animate-spin" />
  </div>
);

// 공통 모달 컴포넌트
export const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{title}</h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
          >
            <Plus size={24} style={{ transform: 'rotate(45deg)' }} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// 프로필 체크를 위한 래퍼 컴포넌트
export const AdminPageWrapper = ({ children }: { children: (profile: any) => React.ReactNode }) => {
  const [profile, setProfile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/admin?target=profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <LoadingState />;

  if (!profile) {
    return (
      <div className={styles.contentCard} style={{ padding: '80px 40px', textAlign: 'center' }}>
        <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: 600 }}>
          프로필 정보를 먼저 입력하고 저장해 주세요.<br />
          프로필이 생성된 후에 각 항목 관리가 가능합니다.
        </p>
      </div>
    );
  }

  return <>{children(profile)}</>;
};
