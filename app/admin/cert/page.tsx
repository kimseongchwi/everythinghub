'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Award, Edit, Trash2, Loader2, Calendar, FileText, CheckCircle2, Save } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import { AdminPageWrapper, LoadingState, EmptyState, Modal } from '@/components/admin/AdminComponents';

export default function CertAdminPage() {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddingCert, setIsAddingCert] = useState(false);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    status: '취득완료',
    acquiredAt: '',
    attachmentId: '',
    fileUrl: '',
    sortOrder: 0
  });

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin?target=certs');
      if (res.ok) {
        const data = await res.json();
        // 날짜(acquiredAt) 내림차순 정렬 (최신순)
        const sortedData = data.sort((a: any, b: any) => {
          if (!a.acquiredAt) return 1;
          if (!b.acquiredAt) return -1;
          return b.acquiredAt.localeCompare(a.acquiredAt);
        });
        setCerts(sortedData);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCertSubmit = async (e: React.FormEvent, showToast: any) => {
    e.preventDefault();
    const url = editingCertId ? `/api/admin?target=certs&id=${editingCertId}` : '/api/admin?target=certs';
    const method = editingCertId ? 'PATCH' : 'POST';

    setIsUploading(true);
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsAddingCert(false);
        setEditingCertId(null);
        resetForm();
        fetchCerts();
        showToast('성공적으로 저장되었습니다.', 'success');
      } else {
        showToast('저장에 실패했습니다.', 'error');
      }
    } catch (e) {
      showToast('오류가 발생했습니다.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', issuer: '', status: '취득완료', acquiredAt: '', attachmentId: '', fileUrl: '', sortOrder: 0 });
  };

  const handleCertDelete = async (id: string, showToast: any) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;
    const res = await fetch(`/api/admin?target=certs&id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('삭제되었습니다.', 'success');
      fetchCerts();
    } else {
      showToast('삭제에 실패했습니다.', 'error');
    }
  };

  const handleCertEdit = (cert: any) => {
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      status: cert.status,
      acquiredAt: cert.acquiredAt || '',
      attachmentId: cert.attachmentId || '',
      fileUrl: cert.attachment?.url || cert.fileUrl || '',
      sortOrder: cert.sortOrder
    });
    setEditingCertId(cert.id);
    setIsAddingCert(true);
  };

  const handleCertFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, showToast: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await fetch(`/api/admin?target=attachments&filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({
          ...prev,
          attachmentId: data.id,
          fileUrl: data.url
        }));
        showToast('파일이 업로드되었습니다.', 'success');
      } else {
        showToast('파일 업로드에 실패했습니다.', 'error');
      }
    } catch (e) {
      showToast('오류가 발생했습니다.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AdminPageWrapper>
      {(profile, showToast) => (
        <div className={styles.fadeIn}>
          {/* Header */}
          <div className={styles.pageHeader}>
            <div className={styles.titleGroup}>
              <h1>자격증 및 수상 관리</h1>
              <p>보유 중인 자격증과 직무 관련 수상 내역을 관리합니다.</p>
            </div>
            <button
              className={styles.btnPrimary}
              onClick={() => {
                resetForm();
                setEditingCertId(null);
                setIsAddingCert(true);
              }}
            >
              <Plus size={16} /> 항목 등록
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
            {loading ? <LoadingState /> : (
              certs.length > 0 ? (
                certs.map(cert => (
                  <div key={cert.id} className={styles.contentCard} style={{ margin: 0 }}>
                    <div style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{cert.title}</h4>
                              <span className={`${styles.badge} ${cert.status === '수상' ? styles.badgeInfo : styles.badgeSuccess}`} style={{ fontSize: '0.65rem' }}>
                                {cert.status}
                              </span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>{cert.issuer}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#94a3b8', marginTop: '12px' }}>
                              <Calendar size={14} />
                              <span>{cert.acquiredAt}</span>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {cert.attachment?.url && (
                            <a href={cert.attachment.url} target="_blank" rel="noopener noreferrer" className={styles.btnIcon} title="증빙 서류 보기">
                              <FileText size={14} />
                            </a>
                          )}
                          <button className={styles.btnIcon} onClick={() => handleCertEdit(cert)}><Edit size={14} /></button>
                          <button className={styles.btnIcon} onClick={() => handleCertDelete(cert.id, showToast)}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1' }}>
                  <EmptyState message="등록된 자격증 및 수상 내역이 없습니다." onAdd={() => {
                    resetForm();
                    setEditingCertId(null);
                    setIsAddingCert(true);
                  }} />
                </div>
              )
            )}
          </div>

          <Modal
            isOpen={isAddingCert}
            onClose={() => setIsAddingCert(false)}
            title={editingCertId ? '항목 수정' : '항목 등록'}
            footer={
              <>
                <button type="button" onClick={() => setIsAddingCert(false)} className={styles.btnSecondary} disabled={isUploading}>취소</button>
                <button type="submit" form="cert-form" className={styles.btnPrimary} disabled={isUploading}>
                  {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  데이터 저장
                </button>
              </>
            }
          >
            <form id="cert-form" onSubmit={(e) => handleCertSubmit(e, showToast)} className={styles.formGrid}>
              <div className={styles.field}>
                <label>항목 이름</label>
                <input className={styles.input} placeholder="예: 정보처리기사, 공모전 금상" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
              </div>

              <div className={styles.field}>
                <label>발행처 / 소속</label>
                <input className={styles.input} placeholder="예: 한국산업인력공단" value={formData.issuer} onChange={e => setFormData({ ...formData, issuer: e.target.value })} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className={styles.field}>
                  <label>상태</label>
                  <select className={styles.select} value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                    <option value="취득완료">취득완료</option>
                    <option value="수정완료">수정완료</option>
                    <option value="수상">수상</option>
                    <option value="수료">수료</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label>날짜</label>
                  <input className={styles.input} placeholder="예: 2024.01" value={formData.acquiredAt} onChange={e => setFormData({ ...formData, acquiredAt: e.target.value })} />
                </div>
              </div>

              <div className={styles.field}>
                <label>증빙 자료 (선택)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="file" style={{ display: 'none' }} id="cert-upload" onChange={(e) => handleCertFileUpload(e, showToast)} />
                  <label htmlFor="cert-upload" className={styles.btnSecondary} style={{ flex: 1, cursor: 'pointer', justifyContent: 'center' }}>
                    {isUploading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                    {formData.fileUrl ? '파일 변경' : '파일 업로드'}
                  </label>
                  {formData.fileUrl && (
                    <div style={{ 
                      padding: '10px', 
                      background: '#ecfdf5', 
                      borderRadius: '10px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      color: '#10b981' 
                    }}>
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </div>
              </div>
            </form>
          </Modal>
        </div>
      )}
    </AdminPageWrapper>
  );
}
