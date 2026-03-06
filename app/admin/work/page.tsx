'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Briefcase, Edit, Trash2, Loader2, Calendar, CheckCircle2, Save } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import { AdminPageWrapper, LoadingState, EmptyState, Modal } from '@/components/admin/AdminComponents';

export default function WorkAdminPage() {
  const [workExperiences, setWorkExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddingWork, setIsAddingWork] = useState(false);
  const [editingWorkId, setEditingWorkId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    position: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    summary: '',
    description: '',
    sortOrder: 0
  });

  useEffect(() => {
    fetchWorkExperiences();
  }, []);

  const fetchWorkExperiences = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin?target=work');
      if (res.ok) {
        const data = await res.json();
        setWorkExperiences(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWorkSubmit = async (e: React.FormEvent, showToast: any) => {
    e.preventDefault();
    const url = editingWorkId ? `/api/admin?target=work&id=${editingWorkId}` : '/api/admin?target=work';
    const method = editingWorkId ? 'PATCH' : 'POST';

    setIsUploading(true);
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsAddingWork(false);
        setEditingWorkId(null);
        setFormData({ companyName: '', role: '', position: '', startDate: '', endDate: '', isCurrent: false, summary: '', description: '', sortOrder: 0 });
        fetchWorkExperiences();
        showToast('근무 경력이 저장되었습니다.', 'success');
      } else {
        showToast('저장에 실패했습니다.', 'error');
      }
    } catch (e) {
      showToast('오류가 발생했습니다.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleWorkDelete = async (id: string, showToast: any) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;
    const res = await fetch(`/api/admin?target=work&id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('삭제되었습니다.', 'success');
      fetchWorkExperiences();
    } else {
      showToast('삭제에 실패했습니다.', 'error');
    }
  };

  const handleWorkEdit = (work: any) => {
    setFormData({
      companyName: work.companyName,
      role: work.role,
      position: work.position || '',
      startDate: work.startDate || '',
      endDate: work.endDate || '',
      isCurrent: work.isCurrent || false,
      summary: work.summary || '',
      description: work.description || '',
      sortOrder: work.sortOrder
    });
    setEditingWorkId(work.id);
    setIsAddingWork(true);
  };

  return (
    <AdminPageWrapper>
      {(profile, showToast) => (
        <div className={styles.fadeIn}>
          {/* Header */}
          <div className={styles.pageHeader}>
            <div className={styles.titleGroup}>
              <h1>근무경력 관리</h1>
              <p>나의 커리어와 주요 업무 내용을 상세하게 기록합니다.</p>
            </div>
            <button
              className={styles.btnPrimary}
              onClick={() => {
                setIsAddingWork(true);
                setEditingWorkId(null);
                setFormData({ companyName: '', role: '', position: '', startDate: '', endDate: '', isCurrent: false, summary: '', description: '', sortOrder: workExperiences.length });
              }}
            >
              <Plus size={16} /> 경력 등록
            </button>
          </div>

          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {loading ? <LoadingState /> : (
              workExperiences.length > 0 ? (
                workExperiences.sort((a: any, b: any) => (b.sortOrder || 0) - (a.sortOrder || 0)).map(work => (
                  <div key={work.id} className={styles.contentCard} style={{ margin: 0 }}>
                    <div style={{ padding: '32px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', gap: '20px' }}>
                          <div style={{ 
                            width: '48px', 
                            height: '48px', 
                            borderRadius: '12px', 
                            background: '#f8fafc', 
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#10b981'
                          }}>
                            <Briefcase size={24} />
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                              <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>{work.companyName}</h4>
                              {work.isCurrent && (
                                <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                                  <CheckCircle2 size={12} style={{ marginRight: '4px' }} /> 재직 중
                                </span>
                              )}
                            </div>
                            <p style={{ margin: 0, fontSize: '0.95rem', color: '#10b981', fontWeight: 600 }}>
                              {work.position && `${work.position} | `}{work.role}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#94a3b8', marginTop: '8px' }}>
                              <Calendar size={14} />
                              <span>{work.startDate} ~ {work.isCurrent ? '현재' : work.endDate}</span>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className={styles.btnIcon} onClick={() => handleWorkEdit(work)}><Edit size={16} /></button>
                          <button className={styles.btnIcon} onClick={() => handleWorkDelete(work.id, showToast)}><Trash2 size={16} /></button>
                        </div>
                      </div>

                      {work.summary && (
                        <div style={{ marginTop: '24px', padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                          <p style={{ margin: 0, fontSize: '0.9rem', color: '#1e293b', fontWeight: 600 }}>{work.summary}</p>
                        </div>
                      )}
                      
                      {work.description && (
                        <div style={{ marginTop: '20px' }}>
                          <p style={{ 
                            margin: 0, 
                            fontSize: '0.9rem', 
                            color: '#64748b', 
                            whiteSpace: 'pre-wrap', 
                            lineHeight: 1.7,
                            paddingLeft: '12px',
                            borderLeft: '3px solid #f1f5f9'
                          }}>
                            {work.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState message="등록된 근무 경력이 없습니다." onAdd={() => {
                  setIsAddingWork(true);
                  setEditingWorkId(null);
                  setFormData({ companyName: '', role: '', position: '', startDate: '', endDate: '', isCurrent: false, summary: '', description: '', sortOrder: workExperiences.length });
                }} />
              )
            )}
          </div>

          <Modal
            isOpen={isAddingWork}
            onClose={() => setIsAddingWork(false)}
            title={editingWorkId ? '경력 수정' : '경력 등록'}
            footer={
              <>
                <button type="button" onClick={() => setIsAddingWork(false)} className={styles.btnSecondary} disabled={isUploading}>취소</button>
                <button type="submit" form="work-form" className={styles.btnPrimary} disabled={isUploading}>
                  {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  데이터 저장
                </button>
              </>
            }
          >
            <form id="work-form" onSubmit={(e) => handleWorkSubmit(e, showToast)} className={styles.formGrid}>
              <div className={styles.field}>
                <label>회사명</label>
                <input className={styles.input} placeholder="예: (주)에이비씨 컴퍼니" value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className={styles.field}>
                  <label>직책 (타이틀)</label>
                  <input className={styles.input} placeholder="예: 팀장, 과장, 수석" value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} />
                </div>
                <div className={styles.field}>
                  <label>담당 역할 (포지션)</label>
                  <input className={styles.input} placeholder="예: 프론트엔드 개발자" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className={styles.field}>
                  <label>입사일</label>
                  <input type="text" className={styles.input} placeholder="예: 2020.03" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} required />
                </div>
                <div className={styles.field}>
                  <label>퇴사일 / 상태</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input 
                      type="text" 
                      className={styles.input} 
                      placeholder="예: 2024.02" 
                      value={formData.endDate} 
                      onChange={e => setFormData({ ...formData, endDate: e.target.value, isCurrent: false })} 
                      disabled={formData.isCurrent}
                      style={{ opacity: formData.isCurrent ? 0.5 : 1, backgroundColor: formData.isCurrent ? '#f1f5f9' : '#fff' }}
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                      <input type="checkbox" checked={formData.isCurrent} onChange={e => setFormData({ ...formData, isCurrent: e.target.checked })} />
                      현재 재직 중
                    </label>
                  </div>
                </div>
              </div>

              <div className={styles.field}>
                <label>주요 요약</label>
                <input className={styles.input} placeholder="해당 경력을 한 줄로 요약해 보세요." value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })} />
              </div>

              <div className={styles.field}>
                <label>상세 업무 및 성과</label>
                <textarea className={styles.input} style={{ minHeight: '140px', resize: 'none' }} placeholder="구체적인 성과나 추진 업무를 기록하세요." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
            </form>
          </Modal>
        </div>
      )}
    </AdminPageWrapper>
  );
}
