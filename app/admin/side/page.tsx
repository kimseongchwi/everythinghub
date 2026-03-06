'use client';

import React, { useState, useEffect } from 'react';
import { Plus, FolderOpen, Edit, Trash2, Loader2, Link as LinkIcon, Calendar } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import { AdminPageWrapper, LoadingState, EmptyState, Modal } from '@/components/admin/AdminComponents';
import CustomDatePicker from '@/components/CustomDatePicker';
import TechIcon from '@/components/TechIcon';

export default function SideProjectAdminPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    period: '',
    description: '',
    achievements: '',
    techStack: '',
    link: '',
    sortOrder: 0
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin?target=projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingProjectId ? `/api/admin?target=projects&id=${editingProjectId}` : '/api/admin?target=projects';
    const method = editingProjectId ? 'PATCH' : 'POST';

    setIsUploading(true);
    try {
      const payload = {
        ...formData,
        techStack: formData.techStack.split(',').map(s => s.trim()).filter(s => s !== '')
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(editingProjectId ? '프로젝트가 수정되었습니다.' : '새 프로젝트가 등록되었습니다.');
        setIsAddingProject(false);
        setEditingProjectId(null);
        setFormData({ title: '', period: '', description: '', achievements: '', techStack: '', link: '', sortOrder: 0 });
        fetchProjects();
      } else {
        const error = await res.json();
        alert(`저장 실패: ${error.error || '알 수 없는 오류'}`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleProjectDelete = async (id: string) => {
    if (!confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) return;
    const res = await fetch(`/api/admin?target=projects&id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      alert('삭제되었습니다.');
      fetchProjects();
    } else {
      alert('삭제에 실패했습니다.');
    }
  };

  const handleProjectEdit = (proj: any) => {
    setFormData({
      title: proj.title,
      period: proj.period || '',
      description: proj.description || '',
      achievements: (proj.achievements || []).join('\n'),
      techStack: (proj.techStack || []).join(', '),
      link: proj.link || '',
      sortOrder: proj.sortOrder
    });
    setEditingProjectId(proj.id);
    setIsAddingProject(true);
  };

  return (
    <AdminPageWrapper>
      {() => (
        <div className={styles.contentCard}>
          <div className={styles.cardTop}>
            <div className="flex items-center gap-2">
              <FolderOpen size={18} className="text-purple-500" />
              <h3 className="font-bold" style={{ margin: 0 }}>사이드 프로젝트 (Side Projects)</h3>
            </div>
            <button
              className={styles.btnPrimary}
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              onClick={() => {
                setIsAddingProject(true);
                setEditingProjectId(null);
                setFormData({ title: '', period: '', description: '', achievements: '', techStack: '', link: '', sortOrder: projects.length });
              }}
            >
              <Plus size={14} /> 프로젝트 등록
            </button>
          </div>
          <div style={{ padding: '24px' }}>
            {loading ? <LoadingState /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {projects.length > 0 ? (
                  projects.sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0)).map(proj => (
                    <div key={proj.id} className={styles.listItem}>
                      <div className={styles.itemMain}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h4 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', fontWeight: 800 }}>{proj.title}</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#94a3b8' }}>
                              <Calendar size={12} />
                              <span>{proj.period}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className={styles.btnIcon} onClick={() => handleProjectEdit(proj)}><Edit size={14} /></button>
                            <button className={styles.btnIcon} onClick={() => handleProjectDelete(proj.id)}><Trash2 size={14} /></button>
                          </div>
                        </div>

                        <p style={{ marginTop: '16px', fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>{proj.description}</p>

                        <ul style={{ marginTop: '12px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {(proj.achievements || []).map((ach: string, k: number) => (
                            <li key={k} style={{ fontSize: '0.82rem', color: '#475569' }}>{ach}</li>
                          ))}
                        </ul>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '16px' }}>
                          {(proj.techStack || []).map((tech: string, k: number) => (
                            <span key={k} style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '4px', 
                              fontSize: '0.7rem', 
                              padding: '2px 8px', 
                              background: '#eff6ff', 
                              color: '#3b82f6', 
                              borderRadius: '4px',
                              fontWeight: 700
                            }}>
                              <TechIcon name={tech} size={10} />
                              #{tech}
                            </span>
                          ))}
                        </div>

                        {proj.link && (
                          <div style={{ marginTop: '12px' }}>
                            <a href={proj.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <LinkIcon size={12} /> {proj.link}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState message="등록된 사이드 프로젝트가 없습니다." onAdd={() => {
                    setIsAddingProject(true);
                    setEditingProjectId(null);
                    setFormData({ title: '', period: '', description: '', achievements: '', techStack: '', link: '', sortOrder: projects.length });
                  }} />
                )}
              </div>
            )}
          </div>

          <Modal
            isOpen={isAddingProject}
            onClose={() => setIsAddingProject(false)}
            title={editingProjectId ? '프로젝트 수정' : '프로젝트 등록'}
          >
            <form onSubmit={handleProjectSubmit} className={styles.formGrid}>
              <div className={styles.field}>
                <label>프로젝트 제목</label>
                <input className={styles.input} placeholder="예: OO 개인 포트폴리오 웹사이트" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
              </div>

              <div className={styles.field}>
                <label>진행 기간</label>
                <input className={styles.input} placeholder="예: 2024.01 - 2024.02" value={formData.period} onChange={e => setFormData({ ...formData, period: e.target.value })} />
              </div>

              <div className={styles.field}>
                <label>프로젝트 한줄 소개</label>
                <textarea className={styles.input} style={{ minHeight: '60px', resize: 'none' }} placeholder="프로젝트의 핵심 주제를 간단히 요약하세요." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>

              <div className={styles.field}>
                <label>주요 개발 내용 및 성과 (한 절씩 엔터로 구분)</label>
                <textarea className={styles.input} style={{ minHeight: '120px', resize: 'none' }} placeholder="구체적인 기능 구현 사항이나 해결한 문제를 기록하세요." value={formData.achievements} onChange={e => setFormData({ ...formData, achievements: e.target.value })} />
              </div>

              <div className={styles.field}>
                <label>기술 스택 (콤마로 구분)</label>
                <input className={styles.input} placeholder="예: React, TypeScript, Prisma" value={formData.techStack} onChange={e => setFormData({ ...formData, techStack: e.target.value })} />
              </div>

              <div className={styles.field}>
                <label>배포/Github 링크 (선택)</label>
                <input className={styles.input} placeholder="https://..." value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} />
              </div>

              <div className={styles.btnGroup}>
                <button type="button" onClick={() => setIsAddingProject(false)} className={styles.btnCancel} disabled={isUploading}>닫기</button>
                <button type="submit" className={styles.btnPrimary} disabled={isUploading}>
                  {isUploading ? <><Loader2 size={14} className="animate-spin" /> {editingProjectId ? '수정 중...' : '등록 중...'}</> : (editingProjectId ? '수정 완료' : '등록 완료')}
                </button>
              </div>
            </form>
          </Modal>
        </div>
      )}
    </AdminPageWrapper>
  );
}
