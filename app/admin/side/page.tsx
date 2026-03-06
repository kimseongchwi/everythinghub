'use client';

import React, { useState, useEffect } from 'react';
import { Plus, FolderOpen, Edit, Trash2, Loader2, Link as LinkIcon, Calendar, Eye, EyeOff, CheckCircle2, Clock, Save } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import { AdminPageWrapper, LoadingState, EmptyState, Modal } from '@/components/admin/AdminComponents';
import TechIcon from '@/components/TechIcon';

export default function SideProjectAdminPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [registeredTechs, setRegisteredTechs] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    status: '완료',
    isCurrent: false,
    isVisible: false,
    description: '',
    content: '',
    achievements: '',
    techStack: [] as string[],
    role: '',
    githubUrl: '',
    demoUrl: '',
    sortOrder: 0
  });

  useEffect(() => {
    fetchProjects();
    fetchRegisteredTechs();
  }, []);

  const fetchRegisteredTechs = async () => {
    try {
      const res = await fetch('/api/admin?target=tech');
      if (res.ok) {
        const data = await res.json();
        setRegisteredTechs(data);
      }
    } catch (e) {
      console.error('Failed to fetch techs', e);
    }
  };

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

  const handleProjectSubmit = async (e: React.FormEvent, showToast: any) => {
    e.preventDefault();
    const url = editingProjectId ? `/api/admin?target=projects&id=${editingProjectId}` : '/api/admin?target=projects';
    const method = editingProjectId ? 'PATCH' : 'POST';

    setIsUploading(true);
    try {
      const payload = {
        ...formData,
        keyFeatures: formData.achievements.split('\n').filter(s => s.trim() !== ''),
        githubLink: formData.githubUrl,
        demoLink: formData.demoUrl
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsAddingProject(false);
        setEditingProjectId(null);
        resetForm();
        fetchProjects();
        showToast('프로젝트가 저장되었습니다.', 'success');
      } else {
        showToast('저장에 실패했습니다.', 'error');
      }
    } catch (e) {
      showToast('오류가 발생했습니다.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBatchHide = async (showToast: any) => {
    if (!confirm('모든 사이드 프로젝트를 비공개로 전환하시겠습니까?')) return;
    try {
      const res = await fetch('/api/admin?target=batch-hide', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'projects' }),
      });
      if (res.ok) {
        showToast('전체 비공개 처리되었습니다.', 'success');
        fetchProjects();
      }
    } catch (e) {
      showToast('처리에 실패했습니다.', 'error');
    }
  };

  const resetForm = () => {
    setFormData({ 
      title: '', 
      startDate: '', 
      endDate: '', 
      status: '완료', 
      isCurrent: false, 
      isVisible: false,
      description: '', 
      content: '',
      achievements: '', 
      techStack: [], 
      role: '',
      githubUrl: '',
      demoUrl: '',
      sortOrder: 0 
    });
  };

  const toggleVisibility = async (proj: any) => {
    const res = await fetch(`/api/admin?target=projects&id=${proj.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...proj, isVisible: !proj.isVisible }),
    });
    if (res.ok) fetchProjects();
  };

  const handleProjectDelete = async (id: string, showToast: any) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;
    const res = await fetch(`/api/admin?target=projects&id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('삭제되었습니다.', 'success');
      fetchProjects();
    } else {
      showToast('삭제에 실패했습니다.', 'error');
    }
  };

  const handleProjectEdit = (proj: any) => {
    setFormData({
      title: proj.title,
      startDate: proj.startDate || '',
      endDate: proj.endDate || '',
      status: proj.status || '완료',
      isCurrent: proj.isCurrent || false,
      isVisible: proj.isVisible || false,
      description: proj.description || '',
      content: proj.content || '',
      achievements: (proj.keyFeatures || []).join('\n'), 
      techStack: Array.isArray(proj.techStack) ? proj.techStack : [], 
      role: proj.role || '',
      githubUrl: proj.githubLink || '',
      demoUrl: proj.demoLink || '',
      sortOrder: proj.sortOrder
    });
    setEditingProjectId(proj.id);
    setIsAddingProject(true);
  };

  return (
    <AdminPageWrapper>
      {(profile, showToast) => (
        <div className={styles.fadeIn}>
          {/* Header */}
          <div className={styles.pageHeader}>
            <div className={styles.titleGroup}>
              <h1>사이드 프로젝트 관리</h1>
              <p>개인 프로젝트 및 팀 프로젝트 성과물을 체계적으로 관리합니다.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className={styles.btnSecondary}
                onClick={() => handleBatchHide(showToast)}
                title="전체 비공개"
              >
                <EyeOff size={16} /> 전체 비공개
              </button>
              <button
                className={styles.btnPrimary}
                onClick={() => {
                  resetForm();
                  setEditingProjectId(null);
                  setIsAddingProject(true);
                }}
              >
                <Plus size={16} /> 프로젝트 등록
              </button>
            </div>
          </div>

          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {loading ? <LoadingState /> : (
              projects.length > 0 ? (
                projects.sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0)).map(proj => (
                  <div key={proj.id} className={styles.contentCard} style={{ margin: 0 }}>
                    <div style={{ padding: '32px' }}>
                      <div style={{ display: 'flex', gap: '24px' }}>
                        {/* Project Icon/Thumbnail Area */}
                        <div style={{ 
                          width: '100px', 
                          height: '100px', 
                          borderRadius: '16px', 
                          background: '#f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#94a3b8',
                          flexShrink: 0,
                          border: '1px solid #e2e8f0'
                        }}>
                          <FolderOpen size={40} />
                        </div>

                        {/* Info Area */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>{proj.title}</h4>
                                <span className={`${styles.badge} ${proj.status === '완료' ? styles.badgeSuccess : styles.badgeInfo}`}>
                                  {proj.status}
                                </span>
                              </div>
                              <p style={{ margin: 0, fontSize: '0.9rem', color: '#10b981', fontWeight: 600 }}>{proj.role }</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <button
                                onClick={() => toggleVisibility(proj)}
                                title={proj.isVisible ? '공개 중' : '비공개 중'}
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '8px',
                                  border: '1px solid',
                                  borderColor: proj.isVisible ? '#d1fae5' : '#f1f5f9',
                                  background: proj.isVisible ? '#ecfdf5' : '#f8fafc',
                                  color: proj.isVisible ? '#10b981' : '#94a3b8',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                {proj.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                              </button>
                              <button className={styles.btnIcon} onClick={() => handleProjectEdit(proj)}><Edit size={16} /></button>
                              <button className={styles.btnIcon} onClick={() => handleProjectDelete(proj.id, showToast)}><Trash2 size={16} /></button>
                            </div>
                          </div>

                          {/* Tech Stack Tags */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '16px' }}>
                            {Array.isArray(proj.techStack) && proj.techStack.map((tech: string) => (
                              <span key={tech} style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '4px', 
                                fontSize: '0.75rem', 
                                padding: '4px 8px', 
                                background: '#f8fafc', 
                                color: '#64748b', 
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0',
                                fontWeight: 500
                              }}>
                                <TechIcon name={tech} size={12} />
                                {tech}
                              </span>
                            ))}
                          </div>

                          <p style={{ marginTop: '16px', fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>{proj.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState message="등록된 사이드 프로젝트가 없습니다." onAdd={() => {
                  resetForm();
                  setEditingProjectId(null);
                  setIsAddingProject(true);
                }} />
              )
            )}
          </div>

          {/* Modal */}
          <Modal
            isOpen={isAddingProject}
            onClose={() => setIsAddingProject(false)}
            title={editingProjectId ? '프로젝트 수정' : '프로젝트 등록'}
            footer={
              <>
                <button type="button" onClick={() => setIsAddingProject(false)} className={styles.btnSecondary} disabled={isUploading}>취소</button>
                <button type="submit" form="side-form" className={styles.btnPrimary} disabled={isUploading}>
                  {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  데이터 저장
                </button>
              </>
            }
          >
            <form id="side-form" onSubmit={(e) => handleProjectSubmit(e, showToast)} className={styles.formGrid}>
              <div className={styles.field}>
                <label>프로젝트 제목</label>
                <input className={styles.input} placeholder="예: 개인 포트폴리오 웹사이트" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className={styles.field}>
                  <label>담당 역할</label>
                  <input className={styles.input} placeholder="예: Fullstack 개발 (개인)" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
                </div>
                <div className={styles.field}>
                  <label>상태</label>
                  <select className={styles.select} value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                    <option value="완료">완료</option>
                    <option value="진행 중">진행 중</option>
                    <option value="유지보수">유지보수</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className={styles.field}>
                  <label>시작일</label>
                  <input className={styles.input} placeholder="예: 2023.01" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                </div>
                <div className={styles.field}>
                  <label>종료일</label>
                  <input 
                    className={styles.input} 
                    placeholder="예: 2023.04" 
                    value={formData.endDate} 
                    onChange={e => setFormData({ ...formData, endDate: e.target.value, isCurrent: false })} 
                    disabled={formData.isCurrent}
                    style={{ opacity: formData.isCurrent ? 0.5 : 1, backgroundColor: formData.isCurrent ? '#f1f5f9' : '#fff' }}
                  />
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                    <input type="checkbox" checked={formData.isCurrent} onChange={e => setFormData({ ...formData, isCurrent: e.target.checked })} />
                    진행 중
                  </label>
                </div>
              </div>

              <div className={styles.field}>
                <label>한줄 소개</label>
                <input className={styles.input} placeholder="프로젝트의 핵심 주제를 간단히 설명하세요." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>

              <div className={styles.field}>
                <label>주요 기능 및 성과 (줄바꿈으로 구분)</label>
                <textarea className={styles.input} style={{ minHeight: '100px', resize: 'none' }} placeholder="구체적인 성과나 추진 업무를 기록하세요." value={formData.achievements} onChange={e => setFormData({ ...formData, achievements: e.target.value })} />
              </div>

              <div className={styles.field}>
                <label>사용 기술 스택</label>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '8px', 
                  padding: '16px', 
                  background: '#f8fafc', 
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  maxHeight: '150px',
                  overflowY: 'auto'
                }}>
                  {registeredTechs
                    .filter(tech => !['git', 'github', 'git & github'].includes(tech.name.toLowerCase()))
                    .map(tech => (
                    <button
                      key={tech.id}
                      type="button"
                      onClick={() => {
                        const isSelected = formData.techStack.includes(tech.name);
                        setFormData({
                          ...formData,
                          techStack: isSelected 
                            ? formData.techStack.filter(s => s !== tech.name)
                            : [...formData.techStack, tech.name]
                        });
                      }}
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.8rem',
                        borderRadius: '6px',
                        border: '1px solid',
                        borderColor: formData.techStack.includes(tech.name) ? '#10b981' : '#e2e8f0',
                        background: formData.techStack.includes(tech.name) ? '#ecfdf5' : '#fff',
                        color: formData.techStack.includes(tech.name) ? '#10b981' : '#64748b',
                        cursor: 'pointer',
                        fontWeight: 600,
                        transition: 'all 0.2s'
                      }}
                    >
                      {tech.name}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className={styles.field}>
                  <label>GitHub</label>
                  <input className={styles.input} placeholder="https://github.com/..." value={formData.githubUrl} onChange={e => setFormData({ ...formData, githubUrl: e.target.value })} />
                </div>
                <div className={styles.field}>
                  <label>Live Demo</label>
                  <input className={styles.input} placeholder="https://..." value={formData.demoUrl} onChange={e => setFormData({ ...formData, demoUrl: e.target.value })} />
                </div>
              </div>

              <div className={styles.field}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
                  <input type="checkbox" checked={formData.isVisible} onChange={e => setFormData({ ...formData, isVisible: e.target.checked })} />
                  포트폴리오에 즉시 공개
                </label>
              </div>
            </form>
          </Modal>
        </div>
      )}
    </AdminPageWrapper>
  );
}
