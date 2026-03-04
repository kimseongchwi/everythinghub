"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './admin.module.css';
import CustomDatePicker from '@/components/CustomDatePicker';
import {
  LayoutDashboard,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit,
  Copy,
  File as FileIcon,
  Award,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  UploadCloud
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('portfolio');

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

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === 'portfolio') fetchCerts();
    if (activeTab === 'media') fetchMedia();
  }, [activeTab]);

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
    const url = editingCertId ? `/api/certifications/${editingCertId}` : '/api/certifications';
    const method = editingCertId ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
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
    const res = await fetch(`/api/certifications/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) fetchCerts();
  };

  // Media Logic
  const fetchMedia = async () => {
    const res = await fetch('/api/media');
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
      const response = await fetch(`/api/media?filename=${file.name}`, {
        method: 'POST',
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
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleMediaDelete = async (id: string) => {
    if (!confirm('파일을 삭제하시겠습니까?')) return;
    const res = await fetch(`/api/media/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) fetchMedia();
  };

  return (
    <div className={styles.adminContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logoContainer}>
          <div className={styles.logoIcon}>
            <LayoutDashboard size={24} />
          </div>
          <h2>Admin<span className={styles.logoAccent}>Panel</span></h2>
        </div>

        <div className={styles.navGroup}>
          <p className={styles.navLabel}>MENU</p>
          <nav className={styles.sidebarNav}>
            <button
              className={`${styles.navItem} ${activeTab === 'portfolio' ? styles.active : ''}`}
              onClick={() => setActiveTab('portfolio')}
            >
              <Award size={20} />
              <span>포트폴리오 관리</span>
            </button>
            <button
              className={`${styles.navItem} ${activeTab === 'media' ? styles.active : ''}`}
              onClick={() => setActiveTab('media')}
            >
              <ImageIcon size={20} />
              <span>미디어/파일 관리</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.topHeader}>
          <div className={styles.pageTitle}>
            <h1>
              {activeTab === 'portfolio' ? '포트폴리오 관리' : '미디어 라이브러리'}
            </h1>
            <p className={styles.pageSubtitle}>
              {activeTab === 'portfolio' ? '인증 및 자격증 리스트를 생성하고 관리하세요.' : '프로젝트에 사용할 이미지 및 파일을 업로드하세요.'}
            </p>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.adminAvatar}>
              A
            </div>
            <div className={styles.adminInfo}>
              <span className={styles.adminName}>Administrator</span>
              <span className={styles.adminRole}>Super Admin</span>
            </div>
          </div>
        </header>

        <div className={styles.contentWrapper}>
          {activeTab === 'portfolio' && (
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionTitleBlock}>
                  <div className={styles.iconCircle}><Award size={20} /></div>
                  <h3>자격증 목록</h3>
                </div>
                <button className={styles.primaryBtn} onClick={() => { setIsAddingCert(true); setEditingCertId(null); }}>
                  <Plus size={18} />
                  <span>새 자격증 추가</span>
                </button>
              </div>

              <div className={styles.dataTable}>
                <div className={styles.tableHeader}>
                  <div className={styles.colName}>자격증명</div>
                  <div className={styles.colIssuer}>발급기관</div>
                  <div className={styles.colStatus}>상태</div>
                  <div className={styles.colDate}>취득일</div>
                  <div className={styles.colActions}>액션</div>
                </div>
                <div className={styles.tableBody}>
                  {certs.length === 0 ? (
                    <div className={styles.emptyState}>등록된 자격증이 없습니다.</div>
                  ) : (
                    certs.map((cert) => (
                      <div key={cert.id} className={styles.tableRow}>
                        <div className={styles.colName}>
                          <span className={styles.recordTitle}>{cert.name}</span>
                        </div>
                        <div className={styles.colIssuer}>
                          <span className={styles.recordSubtitle}>
                            <Building size={14} /> {cert.issuer}
                          </span>
                        </div>
                        <div className={styles.colStatus}>
                          <span className={`${styles.statusBadge} ${cert.status === '취득완료' ? styles.statusSuccess : styles.statusPending}`}>
                            {cert.status === '취득완료' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                            {cert.status}
                          </span>
                        </div>
                        <div className={styles.colDate}>
                          <span className={styles.dateText}>
                            <Calendar size={14} />
                            {cert.acquireDate ? new Date(cert.acquireDate).toLocaleDateString() : '미상'}
                          </span>
                        </div>
                        <div className={styles.colActions}>
                          <button
                            className={styles.iconBtnEdit}
                            title="수정"
                            onClick={() => {
                              setIsAddingCert(true);
                              setEditingCertId(cert.id);
                              setFormData({
                                name: cert.name,
                                issuer: cert.issuer,
                                status: cert.status,
                                acquireDate: cert.acquireDate ? new Date(cert.acquireDate).toISOString().split('T')[0] : ''
                              });
                            }}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className={styles.iconBtnDelete}
                            title="삭제"
                            onClick={() => handleCertDelete(cert.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionTitleBlock}>
                  <div className={styles.iconCircleBlue}><ImageIcon size={20} /></div>
                  <h3>업로드된 미디어</h3>
                </div>
                <button
                  className={`${styles.primaryBtn} ${isUploading ? styles.uploadingState : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? <span className={styles.spinner}></span> : <UploadCloud size={18} />}
                  <span>{isUploading ? '업로드 중...' : '파일 업로드'}</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
              </div>

              {mediaList.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}><UploadCloud size={48} /></div>
                  <h4>미디어가 없습니다</h4>
                  <p>새 파일을 업로드하여 라이브러리를 채워보세요.</p>
                </div>
              ) : (
                <div className={styles.mediaGrid}>
                  {mediaList.map((item) => (
                    <div key={item.id} className={styles.mediaCard}>
                      <div className={styles.mediaThumb}>
                        {item.mimeType.startsWith('image/') ? (
                          <img src={item.url} alt={item.filename} />
                        ) : (
                          <div className={styles.docFileIcon}>
                            <FileIcon size={40} />
                          </div>
                        )}
                        <div className={styles.mediaOverlay}>
                          <button
                            onClick={() => handleMediaDelete(item.id)}
                            className={styles.overlayDelBtn}
                            title="삭제"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <div className={styles.mediaFooter}>
                        <div className={styles.mediaInfo}>
                          <span className={styles.mediaName} title={item.filename}>{item.filename}</span>
                          <span className={styles.mediaMime}>{item.mimeType || 'Unknown format'}</span>
                        </div>
                        <button
                          onClick={() => navigator.clipboard.writeText(item.url)}
                          className={styles.copyBtn}
                          title="URL 복사"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal - only show when isAddingCert is true */}
      {isAddingCert && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h3>{editingCertId ? '자격증 수정' : '새 자격증 추가'}</h3>
              <p>{editingCertId ? '기존 자격증 정보를 수정합니다.' : '포트폴리오에 추가할 정보를 입력해주세요.'}</p>
            </div>

            <form onSubmit={handleCertSubmit} className={styles.formContainer}>
              <div className={styles.formGroup}>
                <label>자격증 명칭</label>
                <div className={styles.inputWrapper}>
                  <div className={styles.inputIcon}><Award size={18} /></div>
                  <input
                    placeholder="예: 정보처리기사"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                    className={styles.inputField}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>발급 기관</label>
                <div className={styles.inputWrapper}>
                  <div className={styles.inputIcon}><Building size={18} /></div>
                  <input
                    placeholder="예: 한국산업인력공단"
                    value={formData.issuer}
                    onChange={e => setFormData({ ...formData, issuer: e.target.value })}
                    required
                    className={styles.inputField}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>상태</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className={styles.selectField}
                  >
                    <option value="취득완료">취득완료</option>
                    <option value="준비중">준비중</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>취득일자</label>
                  <div className={styles.datePickerWrap}>
                    <CustomDatePicker
                      value={formData.acquireDate}
                      onChange={(val: string) => setFormData({ ...formData, acquireDate: val })}
                      label=""
                    />
                  </div>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsAddingCert(false)} className={styles.secondaryBtn}>
                  취소
                </button>
                <button type="submit" className={styles.primaryBtn}>
                  {editingCertId ? '수정 사항 저장' : '자격증 등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
