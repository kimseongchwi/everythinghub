"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './admin.module.css';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Portfolio state
  const [certs, setCerts] = useState<any[]>([]);
  const [isAddingCert, setIsAddingCert] = useState(false);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [isUnknownDate, setIsUnknownDate] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    status: '취득완료',
    acquireDate: ''
  });

  // Media state
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load password from localStorage on mount
  useEffect(() => {
    const savedPassword = localStorage.getItem('admin_token');
    if (savedPassword === 'admin1234') {
      setPassword(savedPassword);
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch data when logged in or tab changes
  useEffect(() => {
    if (isLoggedIn) {
      if (activeTab === 'portfolio') fetchCerts();
      if (activeTab === 'media') fetchMedia();
    }
  }, [isLoggedIn, activeTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin1234') {
      setIsLoggedIn(true);
      localStorage.setItem('admin_token', password);
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword('');
    localStorage.removeItem('admin_token');
  };

  // Cert Logic
  const fetchCerts = async () => {
    const res = await fetch('/api/certifications');
    if (res.ok) {
      const data = await res.json();
      setCerts(data);
    }
  };

  const handleCertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      ...formData,
      acquireDate: isUnknownDate ? null : formData.acquireDate,
    };
    const url = editingCertId ? `/api/admin/certifications/${editingCertId}` : '/api/admin/certifications';
    const method = editingCertId ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setIsAddingCert(false);
      setEditingCertId(null);
      setFormData({ name: '', issuer: '', status: '취득완료', acquireDate: '' });
      fetchCerts();
    }
  };

  const handleCertDelete = async (id: string) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;
    const res = await fetch(`/api/admin/certifications/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': password }
    });
    if (res.ok) fetchCerts();
  };

  // Media Logic
  const fetchMedia = async () => {
    const res = await fetch('/api/admin/media');
    if (res.ok) {
      const data = await res.json();
      setMediaList(data);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await fetch(`/api/admin/media?filename=${file.name}`, {
        method: 'POST',
        headers: { 'x-admin-password': password },
        body: file,
      });

      if (response.ok) {
        fetchMedia();
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleMediaDelete = async (id: string) => {
    if (!confirm('파일을 삭제하시겠습니까?')) return;
    const res = await fetch(`/api/admin/media/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': password }
    });
    if (res.ok) fetchMedia();
  };

  if (!isLoggedIn) {
    return (
      <div className={styles.adminContainer}>
        <div className={styles.loginBox}>
          <h1>Admin Access</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
            <button type="submit" className={styles.loginBtn}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>Admin Hub</div>
        <nav className={styles.sidebarNav}>
          <button
            className={`${styles.navItem} ${activeTab === 'portfolio' ? styles.active : ''}`}
            onClick={() => setActiveTab('portfolio')}
          >
            포트폴리오 관리
          </button>
          <button
            className={`${styles.navItem} ${activeTab === 'media' ? styles.active : ''}`}
            onClick={() => setActiveTab('media')}
          >
            미디어/파일 관리
          </button>
          <button
            className={`${styles.navItem} ${activeTab === 'salary' ? styles.active : ''}`}
            onClick={() => setActiveTab('salary')}
          >
            연봉계산기 설정
          </button>
        </nav>
        <button onClick={handleLogout} className={styles.sidebarLogoutBtn}>로그아웃</button>
      </aside>

      <main className={styles.adminMain}>
        <header className={styles.mainHeader}>
          <h1>
            {activeTab === 'portfolio' && 'Portfolio Management'}
            {activeTab === 'media' && 'Media & Assets'}
            {activeTab === 'salary' && 'Salary Calculator Settings'}
          </h1>
          <div className={styles.userBadge}>Admin User</div>
        </header>

        {activeTab === 'portfolio' && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>자격증 관리</h2>
                <p className={styles.sectionDesc}>포트폴리오에 표시될 자격증 목록을 관리합니다.</p>
              </div>
              <button className={styles.addBtn} onClick={() => { setIsAddingCert(true); setEditingCertId(null); }}>+ 추가</button>
            </div>
            <div className={styles.certList}>
              {certs.map((cert) => (
                <div key={cert.id} className={styles.certItem}>
                  <div className={styles.certInfo}>
                    <span className={styles.certName}>{cert.name}</span>
                    <span className={styles.certMeta}>{cert.issuer} | {cert.status}</span>
                  </div>
                  <div className={styles.certActions}>
                    <button onClick={() => {
                      setIsAddingCert(true);
                      setEditingCertId(cert.id);
                      setFormData({ name: cert.name, issuer: cert.issuer, status: cert.status, acquireDate: cert.acquireDate ? new Date(cert.acquireDate).toISOString().split('T')[0] : '' });
                    }} className={styles.editBtn}>수정</button>
                    <button onClick={() => handleCertDelete(cert.id)} className={styles.deleteBtn}>삭제</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'media' && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>미디어 라이브러리</h2>
                <p className={styles.sectionDesc}>Vercel Blob에 저장된 파일을 관리합니다.</p>
              </div>
              <button
                className={styles.addBtn}
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? '업로드 중...' : '+ 파일 업로드'}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </div>
            <div className={styles.mediaGrid}>
              {mediaList.map((item) => (
                <div key={item.id} className={styles.mediaCard}>
                  <div className={styles.mediaThumb}>
                    {item.mimeType.startsWith('image/') ? (
                      <img src={item.url} alt={item.filename} />
                    ) : (
                      <div className={styles.fileIcon}>📄</div>
                    )}
                  </div>
                  <div className={styles.mediaInfo}>
                    <span className={styles.mediaName}>{item.filename}</span>
                    <button onClick={() => navigator.clipboard.writeText(item.url)} className={styles.copyBtn}>URL 복사</button>
                    <button onClick={() => handleMediaDelete(item.id)} className={styles.mediaDelBtn}>삭제</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'salary' && (
          <div className={styles.emptyContent}>준비 중입니다.</div>
        )}

        {isAddingCert && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h2>자격증 관리</h2>
              <form onSubmit={handleCertSubmit} className={styles.form}>
                <input placeholder="명칭" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className={styles.input} />
                <input placeholder="기관" value={formData.issuer} onChange={e => setFormData({ ...formData, issuer: e.target.value })} required className={styles.input} />
                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className={styles.input}>
                  <option value="취득완료">취득완료</option>
                  <option value="준비중">준비중</option>
                </select>
                <input type="date" value={formData.acquireDate} onChange={e => setFormData({ ...formData, acquireDate: e.target.value })} className={styles.input} />
                <div className={styles.modalActions}>
                  <button type="submit" className={styles.submitBtn}>저장</button>
                  <button type="button" onClick={() => setIsAddingCert(false)} className={styles.cancelBtn}>취소</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
