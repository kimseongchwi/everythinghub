'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Briefcase, Edit, Trash2, Loader2, Calendar } from 'lucide-react';
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

  const handleWorkSubmit = async (e: React.FormEvent) => {
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
        alert(editingWorkId ? '경력이 수정되었습니다.' : '새 경력이 등록되었습니다.');
        setIsAddingWork(false);
        setEditingWorkId(null);
        setFormData({ companyName: '', role: '', position: '', startDate: '', endDate: '', isCurrent: false, summary: '', description: '', sortOrder: 0 });
        fetchWorkExperiences();
      } else {
        const error = await res.json();
        alert(`저장 실패: ${error.error || '알 수 없는 오류'}`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleWorkDelete = async (id: string) => {
    if (!confirm('정말로 이 경력을 삭제하시겠습니까?')) return;
    const res = await fetch(`/api/admin?target=work&id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      alert('삭제되었습니다.');
      fetchWorkExperiences();
    } else {
      alert('삭제에 실패했습니다.');
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
      {() => (
        <div className={styles.contentCard}>
          <div className={styles.cardTop}>
            <div className="flex items-center gap-2">
              <Briefcase size={18} className="text-orange-500" />
              <h3 className="font-bold" style={{ margin: 0 }}>근무 경력 (Work Experience)</h3>
            </div>
            <button
              className={styles.btnPrimary}
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              onClick={() => {
                setIsAddingWork(true);
                setEditingWorkId(null);
                setFormData({ companyName: '', role: '', position: '', startDate: '', endDate: '', isCurrent: false, summary: '', description: '', sortOrder: workExperiences.length });
              }}
            >
              <Plus size={14} /> 경력 등록
            </button>
          </div>
          <div style={{ padding: '24px' }}>
            {loading ? <LoadingState /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {workExperiences.length > 0 ? (
                  workExperiences.sort((a: any, b: any) => (b.sortOrder || 0) - (a.sortOrder || 0)).map(work => (
                    <div key={work.id} className={styles.listItem}>
                      <div className={styles.itemMain}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 700 }}>{work.companyName}</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#10b981', fontWeight: 600 }}>
                              {work.position && `${work.position} | `}{work.role}
                            </p>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className={styles.btnIcon} onClick={() => handleWorkEdit(work)}><Edit size={14} /></button>
                            <button className={styles.btnIcon} onClick={() => handleWorkDelete(work.id)}><Trash2 size={14} /></button>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#94a3b8', marginTop: '12px' }}>
                          <Calendar size={12} />
                          <span>{work.startDate} ~ {work.isCurrent ? '현재' : work.endDate}</span>
                        </div>
                        {work.summary && <p style={{ marginTop: '12px', fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }}>{work.summary}</p>}
                        <p style={{ marginTop: '12px', fontSize: '0.85rem', color: '#64748b', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{work.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState message="등록된 근무 경력이 없습니다." onAdd={() => {
                    setIsAddingWork(true);
                    setEditingWorkId(null);
                    setFormData({ companyName: '', role: '', position: '', startDate: '', endDate: '', isCurrent: false, summary: '', description: '', sortOrder: workExperiences.length });
                  }} />
                )}
              </div>
            )}
          </div>

          <Modal
            isOpen={isAddingWork}
            onClose={() => setIsAddingWork(false)}
            title={editingWorkId ? '경력 수정' : '경력 등록'}
          >
            <form onSubmit={handleWorkSubmit} className={styles.formGrid}>
              <div className={styles.field}>
                <label>회사명</label>
                <input className={styles.input} placeholder="예: (주)에이비씨 컴퍼니" value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className={styles.field}>
                  <label>직책 (타이틀)</label>
                  <input className={styles.input} placeholder="예: 팀장, 과장, 수석" value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} />
                </div>
                <div className={styles.field}>
                  <label>담당 역할 (포지션)</label>
                  <input className={styles.input} placeholder="예: 프론트엔드 개발자" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className={styles.field}>
                  <label>입사일</label>
                  <input 
                    type="text"
                    className={styles.input}
                    placeholder="예: 2020.03"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className={styles.field}>
                  <label>퇴사일 (재직 중인 경우 생략)</label>
                  <input 
                    type="text"
                    className={styles.input}
                    placeholder="예: 2024.02"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value, isCurrent: false })}
                    disabled={formData.isCurrent}
                    style={{ 
                      background: formData.isCurrent ? '#f8fafc' : '#fafafa',
                      color: formData.isCurrent ? '#94a3b8' : '#1e293b',
                      cursor: formData.isCurrent ? 'not-allowed' : 'text',
                      borderColor: formData.isCurrent ? '#e2e8f0' : '#eaeaea',
                      opacity: formData.isCurrent ? 0.7 : 1
                    }}
                  />
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>
                    <input type="checkbox" checked={formData.isCurrent} onChange={e => setFormData({ ...formData, isCurrent: e.target.checked })} />
                    현재 재직 중
                  </label>
                </div>
              </div>

              <div className={styles.field}>
                <label>주요 업무 및 성과</label>
                <textarea className={styles.input} style={{ minHeight: '150px', resize: 'none' }} placeholder="구체적인 성과나 추진 업무를 기록하세요 (엔터로 구분)" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>

              <div className={styles.btnGroup}>
                <button type="button" onClick={() => setIsAddingWork(false)} className={styles.btnCancel} disabled={isUploading}>닫기</button>
                <button type="submit" className={styles.btnPrimary} disabled={isUploading}>
                  {isUploading ? <><Loader2 size={14} className="animate-spin" /> {editingWorkId ? '수정 중...' : '등록 중...'}</> : (editingWorkId ? '수정 완료' : '등록 완료')}
                </button>
              </div>
            </form>
          </Modal>
        </div>
      )}
    </AdminPageWrapper>
  );
}
