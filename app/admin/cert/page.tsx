'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Award, Edit, Trash2, Loader2, Calendar, FileText, ExternalLink, GripVertical } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import { Reorder, useDragControls } from 'framer-motion';
import { AdminPageWrapper, LoadingState, EmptyState, Modal } from '@/components/admin/AdminComponents';

export default function CertAdminPage() {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddingCert, setIsAddingCert] = useState(false);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showManualIssuer, setShowManualIssuer] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    status: '취득완료',
    acquiredAt: '',
    attachmentId: '',
    fileUrl: '',
    sortOrder: 0
  });

  const commonIssuers = [
    '한국산업인력공단',
    '한국정보통신진흥협회',
    '한국정보통신자격협회',
    '대한상공회의소',
    '한국데이터산업진흥원',
    'AWS',
    'Oracle',
  ];

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin?target=certs');
      if (res.ok) {
        const data = await res.json();
        // 정렬 순서대로 초기화
        setCerts(data.sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0)));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOrder = async (newItems: any[]) => {
    setIsSavingOrder(true);
    try {
      // 새로운 순서에 따라 sortOrder 재할당 (0부터 시작하여 증가)
      const itemsWithNewOrder = newItems.map((item, index) => ({
        id: item.id,
        sortOrder: index
      }));

      const res = await fetch('/api/admin?target=reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'certs',
          items: itemsWithNewOrder
        })
      });

      if (res.ok) {
        // 성공시 상태 업데이트
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          sortOrder: index
        }));
        setCerts(updatedItems);
      }
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleCertSubmit = async (e: React.FormEvent) => {
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
        alert(editingCertId ? '자격증 및 수상이 수정되었습니다.' : '자격증 및 수상이 등록되었습니다.');
        setIsAddingCert(false);
        setEditingCertId(null);
        setFormData({ title: '', issuer: '', status: '취득완료', acquiredAt: '', attachmentId: '', fileUrl: '', sortOrder: 0 });
        setShowManualIssuer(false);
        fetchCerts();
      } else {
        const error = await res.json();
        alert(`저장 실패: ${error.error || '알 수 없는 오류'}`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleCertDelete = async (id: string) => {
    if (!confirm('정말로 이 항목을 삭제하시겠습니까?')) return;
    const res = await fetch(`/api/admin?target=certs&id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      alert('삭제되었습니다.');
      fetchCerts();
    } else {
      alert('삭제에 실패했습니다.');
    }
  };

  const handleCertEdit = (cert: any) => {
    const isManual = cert.issuer && !commonIssuers.includes(cert.issuer);
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      status: cert.status,
      acquiredAt: cert.acquiredAt || '',
      attachmentId: cert.attachmentId || '',
      fileUrl: cert.attachment?.url || cert.fileUrl || '',
      sortOrder: cert.sortOrder
    });
    setShowManualIssuer(!!isManual);
    setEditingCertId(cert.id);
    setIsAddingCert(true);
  };

  const handleCertFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        alert('증빙 서류가 업로드되었습니다.');
      } else {
        alert('업로드 실패');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const formatDate = (dateValue: any) => {
    if (!dateValue) return '';
    // 만약 이미 문자열이면 그대로 반환 (스키마 변경 후)
    if (typeof dateValue === 'string') return dateValue;
    
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return String(dateValue);
      
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}.${m}.${d}`;
    } catch (e) {
      return String(dateValue);
    }
  };

  return (
    <AdminPageWrapper>
      {() => (
        <div className={styles.contentCard}>
          <div className={styles.cardTop}>
            <div className="flex items-center gap-2">
              <Award size={18} className="text-yellow-500" />
              <h3 className="font-bold" style={{ margin: 0 }}>자격증 및 수상 (Certifications & Awards)</h3>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {isSavingOrder && <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>순서 저장 중...</span>}
              <button
                className={styles.btnPrimary}
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                onClick={() => {
                  setIsAddingCert(true);
                  setEditingCertId(null);
                  setFormData({ title: '', issuer: '', status: '취득완료', acquiredAt: '', attachmentId: '', fileUrl: '', sortOrder: certs.length });
                  setShowManualIssuer(false);
                }}
              >
                <Plus size={14} /> 항목 등록
              </button>
            </div>
          </div>
          <div style={{ padding: '24px' }}>
            {loading ? <LoadingState /> : (
              certs.length > 0 ? (
                <Reorder.Group 
                  axis="y" 
                  values={certs} 
                  onReorder={handleSaveOrder}
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '12px',
                    listStyle: 'none',
                    padding: 0
                  }}
                >
                  {certs.map(cert => (
                    <Reorder.Item 
                      key={cert.id} 
                      value={cert}
                      style={{ listStyle: 'none' }}
                    >
                      <div style={{
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        position: 'relative',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                        transition: 'all 0.2s',
                        cursor: 'grab'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                          <GripVertical size={16} className="text-gray-300" style={{ cursor: 'grab' }} />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em' }}>
                                {cert.title}
                              </h4>
                              <span style={{ 
                                padding: '2px 8px', 
                                background: cert.status === '취득완료' ? '#f0fdf4' : '#fffbeb', 
                                color: cert.status === '취득완료' ? '#166534' : '#92400e',
                                border: `1px solid ${cert.status === '취득완료' ? '#bbf7d0' : '#fde68a'}`,
                                borderRadius: '100px',
                                fontSize: '0.65rem',
                                fontWeight: 800,
                              }}>
                                {cert.status}
                              </span>
                            </div>
                            <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500, marginTop: '2px' }}>
                              {cert.issuer}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
                            <Calendar size={14} />
                            <span>{formatDate(cert.acquiredAt)}</span>
                          </div>

                          {cert.attachment?.url && (
                            <a 
                              href={cert.attachment.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              onClick={e => e.stopPropagation()}
                              style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '4px', 
                                fontSize: '0.75rem', 
                                color: '#2563eb', 
                                textDecoration: 'none', 
                                fontWeight: 700,
                                padding: '4px 8px',
                                background: '#eff6ff',
                                borderRadius: '6px'
                              }}
                            >
                              <FileText size={13} />
                            </a>
                          )}

                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button 
                              className={styles.btnIcon} 
                              style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              onClick={(e) => { e.stopPropagation(); handleCertEdit(cert); }}
                            >
                              <Edit size={14} />
                            </button>
                            <button 
                              className={styles.btnIcon} 
                              style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}
                              onClick={(e) => { e.stopPropagation(); handleCertDelete(cert.id); }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              ) : (
                <EmptyState message="등록된 자격증 및 수상 내역이 없습니다." onAdd={() => {
                  setIsAddingCert(true);
                  setEditingCertId(null);
                  setFormData({ title: '', issuer: '', status: '취득완료', acquiredAt: '', attachmentId: '', fileUrl: '', sortOrder: certs.length });
                  setShowManualIssuer(false);
                }} />
              )
            )}
          </div>

          <Modal
            isOpen={isAddingCert}
            onClose={() => setIsAddingCert(false)}
            title={editingCertId ? '자격증 및 수상 수정' : '자격증 및 수상 등록'}
          >
            <form onSubmit={handleCertSubmit} className={styles.formGrid}>
              <div className={styles.field}>
                <label>항목 제목</label>
                <input className={styles.input} placeholder="예: 정보처리기사, OO 프로젝트" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
              </div>

              <div className={styles.field}>
                <label>발행처 / 소속</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <select
                    className={styles.select}
                    value={showManualIssuer ? 'custom' : formData.issuer}
                    onChange={e => {
                      const val = e.target.value;
                      if (val === 'custom') {
                        setShowManualIssuer(true);
                        setFormData({ ...formData, issuer: '' });
                      } else {
                        setShowManualIssuer(false);
                        setFormData({ ...formData, issuer: val });
                      }
                    }}
                  >
                    <option value="" disabled hidden>선택하세요</option>
                    <option value="">선택안함</option>
                    {commonIssuers.map(issuer => (
                      <option key={issuer} value={issuer}>{issuer}</option>
                    ))}
                    <option value="custom">직접 입력</option>
                  </select>

                  {showManualIssuer && (
                    <input
                      className={styles.input}
                      placeholder="발행처를 직접 입력하세요"
                      value={formData.issuer}
                      onChange={e => setFormData({ ...formData, issuer: e.target.value })}
                      autoFocus
                      required
                    />
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className={styles.field}>
                  <label>현재 상태</label>
                  <select className={styles.select} value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                    <option value="취득완료">취득완료</option>
                    <option value="수료">수료</option>
                    <option value="준비중">준비중</option>
                    <option value="수상">수상</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label>날짜 (취득일 등)</label>
                  <input 
                    className={styles.input} 
                    value={formData.acquiredAt} 
                    onChange={e => setFormData({ ...formData, acquiredAt: e.target.value })} 
                    placeholder="예: 2024.01" 
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label>증빙 서류 (이미지/PDF)</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input type="file" style={{ display: 'none' }} id="cert-file" onChange={handleCertFileUpload} />
                  <label htmlFor="cert-file" className={styles.btnIcon} style={{ flex: 1, padding: '10px', textAlign: 'center', cursor: 'pointer' }}>
                    파일 업로드
                  </label>
                  {formData.fileUrl && (
                    <a href={formData.fileUrl} target="_blank" rel="noopener noreferrer" className={styles.btnIcon} style={{ padding: '10px' }}>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>

              <div className={styles.btnGroup}>
                <button type="button" onClick={() => setIsAddingCert(false)} className={styles.btnCancel} disabled={isUploading}>닫기</button>
                <button type="submit" className={styles.btnPrimary} disabled={isUploading}>
                  {isUploading ? <><Loader2 size={14} className="animate-spin" /> {editingCertId ? '수정 중...' : '등록 중...'}</> : (editingCertId ? '수정 완료' : '등록 완료')}
                </button>
              </div>
            </form>
          </Modal>
        </div>
      )}
    </AdminPageWrapper>
  );
}
