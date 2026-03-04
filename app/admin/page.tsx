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
  UploadCloud,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('portfolio');

  // Portfolio state
  const [certs, setCerts] = useState<any[]>([]);
  const [isAddingCert, setIsAddingCert] = useState(false);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    status: '취득완료',
    acquiredAt: '',
    attachmentId: '',
    fileUrl: '', // UI 표시용
    sortOrder: 0
  });

  // Media state
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch data
  useEffect(() => {
    if (activeTab === 'portfolio') fetchCerts();
    if (activeTab === 'media') fetchMedia();
  }, [activeTab]);

  const fetchCerts = async () => {
    const res = await fetch('/api/admin?target=certs');
    if (res.ok) {
      const data = await res.json();
      setCerts(data);
    }
  };

  const fetchMedia = async () => {
    const res = await fetch('/api/admin?target=attachments');
    if (res.ok) {
      const data = await res.json();
      setMediaList(data);
    }
  };

  const handleCertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingCertId ? `/api/admin?id=${editingCertId}` : '/api/admin?target=certs';
    const method = editingCertId ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setIsAddingCert(false);
      setEditingCertId(null);
      setFormData({ title: '', issuer: '', status: '취득완료', acquiredAt: '', attachmentId: '', fileUrl: '', sortOrder: 0 });
      fetchCerts();
    }
  };

  const handleCertDelete = async (id: string) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;
    const res = await fetch(`/api/admin?target=certs&id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchCerts();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isForCert: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await fetch(`/api/admin?target=attachments&filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      if (response.ok) {
        const data = await response.json();
        if (isForCert) {
          setFormData(prev => ({ ...prev, attachmentId: data.id, fileUrl: data.url }));
        } else {
          fetchMedia();
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.logoContainer}>
          <div className={styles.logoIcon}><LayoutDashboard size={24} /></div>
          <h2>Admin<span className={styles.logoAccent}>Panel</span></h2>
        </div>
        <div className={styles.navGroup}>
          <p className={styles.navLabel}>MENU</p>
          <nav className={styles.sidebarNav}>
            <button className={`${styles.navItem} ${activeTab === 'portfolio' ? styles.active : ''}`} onClick={() => setActiveTab('portfolio')}>
              <Award size={20} />
              <span>포트폴리오 관리</span>
            </button>
            <button className={`${styles.navItem} ${activeTab === 'media' ? styles.active : ''}`} onClick={() => setActiveTab('media')}>
              <ImageIcon size={20} />
              <span>첨부파일 라이브러리</span>
            </button>
          </nav>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topHeader}>
          <div className={styles.pageTitle}>
            <h1>{activeTab === 'portfolio' ? '포트폴리오 관리' : '첨부파일 라이브러리'}</h1>
          </div>
        </header>

        <div className={styles.contentWrapper}>
          {activeTab === 'portfolio' && (
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h3>자격증 목록</h3>
                <button className={styles.primaryBtn} onClick={() => { setIsAddingCert(true); setEditingCertId(null); setFormData({ title: '', issuer: '', status: '취득완료', acquiredAt: '', attachmentId: '', fileUrl: '', sortOrder: certs.length }); }}>
                  <Plus size={18} /><span>새 항목 추가</span>
                </button>
              </div>
              <div className={styles.dataTable}>
                <div className={styles.tableHeader}>
                  <div className={styles.colName}>항목명</div>
                  <div className={styles.colIssuer}>발급기관</div>
                  <div className={styles.colStatus}>상태</div>
                  <div className={styles.colDate}>일자</div>
                  <div className={styles.colFile}>파일</div>
                  <div className={styles.colActions}>관리</div>
                </div>
                <div className={styles.tableBody}>
                  {certs.map((cert) => (
                    <div key={cert.id} className={styles.tableRow}>
                      <div className={styles.colName}>{cert.title}</div>
                      <div className={styles.colIssuer}>{cert.issuer}</div>
                      <div className={styles.colStatus}>
                        <span className={`${styles.statusBadge} ${cert.status === '취득완료' ? styles.statusSuccess : styles.statusPending}`}>
                          {cert.status}
                        </span>
                      </div>
                      <div className={styles.colDate}>{cert.acquiredAt ? new Date(cert.acquiredAt).toLocaleDateString() : '-'}</div>
                      <div className={styles.colFile}>
                        {cert.attachment?.url && (
                          <a href={cert.attachment.url} target="_blank" rel="noopener noreferrer" className={styles.fileIconLink}>
                            <FileIcon size={16} />
                          </a>
                        )}
                      </div>
                      <div className={styles.colActions}>
                        <button onClick={() => {
                          setIsAddingCert(true);
                          setEditingCertId(cert.id);
                          setFormData({
                            title: cert.title,
                            issuer: cert.issuer,
                            status: cert.status,
                            acquiredAt: cert.acquiredAt ? new Date(cert.acquiredAt).toISOString().split('T')[0] : '',
                            attachmentId: cert.attachmentId || '',
                            fileUrl: cert.attachment?.url || '',
                            sortOrder: cert.sortOrder
                          });
                        }}><Edit size={16} /></button>
                        <button onClick={() => handleCertDelete(cert.id)}><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h3>첨부파일 목록</h3>
                <button className={styles.primaryBtn} onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                  <UploadCloud size={18} /><span>파일 업로드</span>
                </button>
                <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={(e) => handleFileUpload(e)} />
              </div>
              <div className={styles.mediaGrid}>
                {mediaList.map((item) => (
                  <div key={item.id} className={styles.mediaCard}>
                    <div className={styles.mediaThumb}>
                      {item.mimeType.startsWith('image/') ? <img src={item.url} alt="" /> : <FileIcon size={40} />}
                    </div>
                    <div className={styles.mediaFooter}>
                      <span className={styles.mediaName}>{decodeURIComponent(item.originalName)}</span>
                      <div className={styles.mediaActions}>
                        <button onClick={() => navigator.clipboard.writeText(item.url)}><Copy size={14} /></button>
                        <button onClick={() => { if (confirm('삭제하시겠습니까?')) fetch(`/api/admin?target=attachments&id=${item.id}`, { method: 'DELETE' }).then(() => fetchMedia()) }}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {isAddingCert && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h3>{editingCertId ? '항목 수정' : '새 항목 추가'}</h3>
            </div>
            <form onSubmit={handleCertSubmit} className={styles.formContainer}>
              <div className={styles.formGroup}>
                <label>항목 명칭</label>
                <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required className={styles.inputField} />
              </div>
              <div className={styles.formGroup}>
                <label>발급 기관</label>
                <input value={formData.issuer} onChange={e => setFormData({ ...formData, issuer: e.target.value })} required className={styles.inputField} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>상태</label>
                  <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className={styles.selectField}>
                    <option value="취득완료">취득완료</option>
                    <option value="준비중">준비중</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>취득일자</label>
                  <div className={styles.datePickerWrap}>
                    <CustomDatePicker value={formData.acquiredAt} onChange={(val: string) => setFormData({ ...formData, acquiredAt: val })} label="" />
                  </div>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>파일 첨부</label>
                <div className={styles.fileUploadControl}>
                  {formData.fileUrl ? (
                    <div className={styles.fileAttached}>
                      <span>{decodeURIComponent(formData.fileUrl.split('/').pop() || '')}</span>
                      <button type="button" onClick={() => setFormData({ ...formData, fileUrl: '', attachmentId: '' })}><Trash2 size={14} /></button>
                    </div>
                  ) : (
                    <button type="button" className={styles.attachBtn} onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.onchange = (e: any) => handleFileUpload(e, true);
                      input.click();
                    }} disabled={isUploading}>
                      {isUploading ? '업로드 중...' : '파일 선택'}
                    </button>
                  )}
                </div>
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsAddingCert(false)} className={styles.secondaryBtn}>취소</button>
                <button type="submit" className={styles.primaryBtn}>저장</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
