"use client";

import React, { useState, useEffect } from 'react';
import styles from './admin.module.css';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [certs, setCerts] = useState<any[]>([]);
  const [isAddingCert, setIsAddingCert] = useState(false);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [isUnknownDate, setIsUnknownDate] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    status: '취득완료',
    acquireDate: ''
  });

  // Load password from localStorage on mount
  useEffect(() => {
    const savedPassword = localStorage.getItem('admin_token');
    if (savedPassword === 'admin1234') {
      setPassword(savedPassword);
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch certs when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchCerts();
    }
  }, [isLoggedIn]);

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

  const fetchCerts = async () => {
    const res = await fetch('/api/certifications');
    if (res.ok) {
      const data = await res.json();
      setCerts(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = {
      ...formData,
      acquireDate: isUnknownDate ? null : formData.acquireDate,
    };

    const url = editingCertId
      ? `/api/admin/certifications/${editingCertId}`
      : '/api/admin/certifications';

    const method = editingCertId ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': password
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setIsAddingCert(false);
      setEditingCertId(null);
      setFormData({ name: '', issuer: '', status: '취득완료', acquireDate: '' });
      fetchCerts();
    } else {
      alert('저장 실패: ' + (await res.json()).error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;
    const res = await fetch(`/api/admin/certifications/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': password }
    });
    if (res.ok) fetchCerts();
  };

  const startEdit = (cert: any) => {
    setIsAddingCert(true);
    setEditingCertId(cert.id);
    setFormData({
      name: cert.name,
      issuer: cert.issuer,
      status: cert.status,
      acquireDate: cert.acquireDate ? new Date(cert.acquireDate).toISOString().split('T')[0] : ''
    });
    setIsUnknownDate(!cert.acquireDate);
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
      <header className={styles.adminHeader}>
        <h1>Certification Management</h1>
        <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
      </header>

      <main className={styles.adminMain}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>자격증 목록</h2>
            <button
              className={styles.addBtn}
              onClick={() => {
                setIsAddingCert(true);
                setEditingCertId(null);
                setFormData({ name: '', issuer: '', status: '취득완료', acquireDate: '' });
              }}
            >
              + 새 자격증 추가
            </button>
          </div>

          <div className={styles.certList}>
            {certs.map((cert) => (
              <div key={cert.id} className={styles.certItem}>
                <div className={styles.certInfo}>
                  <span className={styles.certName}>{cert.name}</span>
                  <span className={styles.certMeta}>{cert.issuer} | {cert.status}</span>
                </div>
                <div className={styles.certActions}>
                  <button onClick={() => startEdit(cert)} className={styles.editBtn}>수정</button>
                  <button onClick={() => handleDelete(cert.id)} className={styles.deleteBtn}>삭제</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {isAddingCert && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h2>{editingCertId ? '자격증 수정' : '새 자격증 추가'}</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>자격증 명칭</label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>발급 기관</label>
                  <input
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>상태</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="취득완료">취득완료</option>
                    <option value="준비중">준비중</option>
                    <option value="응시예정">응시예정</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <div className={styles.labelRow}>
                    <label>취득 일자</label>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={isUnknownDate}
                        onChange={(e) => setIsUnknownDate(e.target.checked)}
                      /> 모름/준비중
                    </label>
                  </div>
                  <input
                    type="date"
                    disabled={isUnknownDate}
                    value={formData.acquireDate}
                    onChange={(e) => setFormData({ ...formData, acquireDate: e.target.value })}
                    required={!isUnknownDate}
                  />
                </div>
                <div className={styles.modalActions}>
                  <button type="submit" className={styles.submitBtn}>저장</button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCert(false)}
                    className={styles.cancelBtn}
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
