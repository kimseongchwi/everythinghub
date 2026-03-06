'use client';

import React, { useState, useEffect } from 'react';
import { Plus, FolderOpen, Edit, Trash2, Loader2, Link as LinkIcon, Calendar } from 'lucide-react';
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
    link: '',
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

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingProjectId ? `/api/admin?target=projects&id=${editingProjectId}` : '/api/admin?target=projects';
    const method = editingProjectId ? 'PATCH' : 'POST';

    setIsUploading(true);
    try {
      const payload = {
        ...formData,
        techStack: formData.techStack,
        keyFeatures: formData.achievements.split('\n').map(s => s.trim()).filter(s => s !== ''),
        githubUrl: formData.githubUrl || formData.link, 
        demoUrl: formData.demoUrl || formData.link
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
          link: '', 
          githubUrl: '',
          demoUrl: '',
          sortOrder: 0 
        });
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
      startDate: proj.startDate || '',
      endDate: proj.endDate || '',
      status: proj.status || '완료',
      isCurrent: proj.isCurrent || false,
      isVisible: proj.isVisible || false,
      description: proj.description || '',
      content: proj.content || '',
      achievements: (proj.keyFeatures || []).join('\n'), 
      techStack: Array.isArray(proj.techStack) ? proj.techStack : [], 
      link: proj.demoLink || proj.githubLink || '',
      githubUrl: proj.githubLink || '',
      demoUrl: proj.demoLink || '',
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
                setFormData({ 
                  title: '', 
                  startDate: '', 
                  endDate: '', 
                  status: '제작 중', 
                  isCurrent: true, 
                  isVisible: false,
                  description: '', 
                  content: '',
                  achievements: '', 
                  techStack: [], 
                  link: '', 
                  githubUrl: '',
                  demoUrl: '',
                  sortOrder: projects.length 
                });
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>{proj.title}</h4>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                {proj.status && (
                                  <span style={{ 
                                    padding: '2px 8px', 
                                    background: proj.status === '완료' ? '#f0fdf4' : '#eff6ff', 
                                    color: proj.status === '완료' ? '#166534' : '#2563eb',
                                    border: `1px solid ${proj.status === '완료' ? '#bbf7d0' : '#dbeafe'}`,
                                    borderRadius: '100px',
                                    fontSize: '0.65rem',
                                    fontWeight: 800,
                                  }}>
                                    {proj.status}
                                  </span>
                                )}
                                {proj.isVisible && (
                                  <span style={{ 
                                    padding: '2px 8px', 
                                    background: '#f0f9ff', 
                                    color: '#0369a1',
                                    border: '1px solid #bae6fd',
                                    borderRadius: '100px',
                                    fontSize: '0.65rem',
                                    fontWeight: 800,
                                  }}>
                                    👁️ 노출 중
                                  </span>
                                )}
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#94a3b8' }}>
                              <Calendar size={12} />
                              <span>
                                {proj.startDate} ~ {proj.isCurrent ? '진행 중' : (proj.endDate || '')}
                              </span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className={styles.btnIcon} onClick={() => handleProjectEdit(proj)}><Edit size={14} /></button>
                            <button className={styles.btnIcon} onClick={() => handleProjectDelete(proj.id)}><Trash2 size={14} /></button>
                          </div>
                        </div>

                        <p style={{ marginTop: '16px', fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>{proj.description}</p>
                        {proj.content && <p style={{ marginTop: '8px', fontSize: '0.82rem', color: '#94a3b8', fontStyle: 'italic' }}>상세 내용 포함됨</p>}

                        <ul style={{ marginTop: '12px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {(proj.keyFeatures || []).map((ach: string, k: number) => (
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

                        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                          {proj.githubLink && (
                            <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                              <LinkIcon size={12} /> GitHub
                            </a>
                          )}
                          {proj.demoLink && (
                            <a href={proj.demoLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                              <LinkIcon size={12} /> Demo
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState message="등록된 사이드 프로젝트가 없습니다." onAdd={() => {
                    setIsAddingProject(true);
                    setEditingProjectId(null);
                    setFormData({ 
                      title: '', 
                      startDate: '', 
                      endDate: '', 
                      status: '제작 중', 
                      isCurrent: true, 
                      isVisible: false,
                      description: '', 
                      content: '',
                      achievements: '', 
                      techStack: [], 
                      link: '', 
                      githubUrl: '',
                      demoUrl: '',
                      sortOrder: projects.length 
                    });
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className={styles.field}>
                  <label>시작일</label>
                  <input 
                    type="text"
                    className={styles.input}
                    placeholder="예: 2023.01"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className={styles.field}>
                  <label>종료일 (또는 예정)</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input 
                      type="text"
                      className={styles.input}
                      placeholder="예: 2023.12"
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
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                      <input 
                        type="checkbox" 
                        checked={formData.isCurrent} 
                        onChange={e => setFormData({ 
                          ...formData, 
                          isCurrent: e.target.checked, 
                          endDate: e.target.checked ? '' : formData.endDate,
                          status: e.target.checked ? '제작 중' : '완료'
                        })}
                      />
                      진행 중 (제작/유지보수 포함)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, color: '#0369a1' }}>
                      <input 
                        type="checkbox" 
                        checked={formData.isVisible} 
                        onChange={e => setFormData({ 
                          ...formData, 
                          isVisible: e.target.checked
                        })}
                      />
                      포트폴리오 노출 여부
                    </label>
                  </div>
                </div>
              </div>

              <div className={styles.field}>
                <label>프로젝트 상태</label>
                <select 
                  className={styles.select}
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="제작 중">제작 중</option>
                  <option value="유지보수 중">유지보수 중</option>
                  <option value="완료">완료</option>
                  <option value="중단">중단</option>
                </select>
              </div>

              <div className={styles.field}>
                <label>프로젝트 한줄 소개</label>
                <textarea className={styles.input} style={{ minHeight: '60px', resize: 'none' }} placeholder="프로젝트의 핵심 주제를 간단히 요약하세요." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>

              <div className={styles.field}>
                <label>주요 개발 내용 및 성과 (한 절씩 엔터로 구분)</label>
                <textarea className={styles.input} style={{ minHeight: '100px', resize: 'none' }} placeholder="구체적인 기능 구현 사항이나 해결한 문제를 기록하세요." value={formData.achievements} onChange={e => setFormData({ ...formData, achievements: e.target.value })} />
              </div>

              <div className={styles.field}>
                <label>상세 설명 및 회고 (Markdown 지원) </label>
                <textarea className={styles.input} style={{ minHeight: '150px', resize: 'vertical' }} placeholder="프로젝트의 상세한 배경, 기술적 도전 과제, 배운 점 등을 기록하세요." value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label>기술 스택 선택 (내 기술 목록)</label>

                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px', 
                  maxHeight: '250px', 
                  overflowY: 'auto',
                  padding: '16px',
                  background: '#fafafa',
                  border: '1px solid #eaeaea',
                  borderRadius: '12px'
                }}>
                  {/* 선택된 기술 요약 */}
                  {formData.techStack.length > 0 && (
                    <div style={{ marginBottom: '16px', padding: '12px', background: '#fff', borderRadius: '8px', border: '1px solid #000' }}>
                      <label style={{ fontSize: '0.7rem', fontWeight: 900, display: 'block', marginBottom: '8px', color: '#000' }}>선택된 기술 ({formData.techStack.length})</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {formData.techStack.map(tech => (
                          <span key={tech} style={{ padding: '2px 8px', background: '#000', color: '#fff', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {tech}
                            <button type="button" onClick={() => setFormData({ ...formData, techStack: formData.techStack.filter(s => s !== tech) })} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, fontSize: '0.8rem' }}>×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {registeredTechs.length > 0 ? (
                    (Object.entries(
                      registeredTechs.reduce((acc, tech: any) => {
                        const cat = tech.category || '기타';
                        if (!acc[cat]) acc[cat] = [];
                        acc[cat].push(tech);
                        return acc;
                      }, {} as Record<string, any[]>)
                    ) as [string, any[]][]).map(([category, techs]) => (
                      <div key={category} style={{ marginBottom: '8px' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>{category}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {techs.map((tech: any) => {
                            const isSelected = formData.techStack.includes(tech.name);
                            return (
                              <button
                                key={tech.id}
                                type="button"
                                onClick={() => {
                                  const newStack = isSelected
                                    ? formData.techStack.filter(s => s !== tech.name)
                                    : [...formData.techStack, tech.name];
                                  setFormData({ ...formData, techStack: newStack });
                                }}
                                style={{
                                  padding: '4px 10px',
                                  fontSize: '0.75rem',
                                  borderRadius: '6px',
                                  border: `1px solid ${isSelected ? '#000' : '#eaeaea'}`,
                                  background: isSelected ? '#000' : '#fff',
                                  color: isSelected ? '#fff' : '#64748b',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  transition: 'all 0.15s',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                <TechIcon name={tech.name} size={12} />
                                {tech.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>등록된 기술 스택이 없습니다.</p>
                  )}

                  {/* 직접 입력 추가 */}
                  <div style={{ marginTop: '8px', paddingTop: '16px', borderTop: '1px dashed #eaeaea' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        id="manualTechInput"
                        className={styles.input} 
                        placeholder="기타 기술 직접 입력 (엔터로 추가)" 
                        style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (val && !formData.techStack.includes(val)) {
                              setFormData({ ...formData, techStack: [...formData.techStack, val] });
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                      />
                      <button 
                        type="button" 
                        className={styles.btnPrimary} 
                        style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                        onClick={() => {
                          const input = document.getElementById('manualTechInput') as HTMLInputElement;
                          const val = input.value.trim();
                          if (val && !formData.techStack.includes(val)) {
                            setFormData({ ...formData, techStack: [...formData.techStack, val] });
                            input.value = '';
                          }
                        }}
                      >추가</button>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className={styles.field}>
                  <label>Github 링크 (선택)</label>
                  <input className={styles.input} placeholder="https://github.com/..." value={formData.githubUrl} onChange={e => setFormData({ ...formData, githubUrl: e.target.value })} />
                </div>
                <div className={styles.field}>
                  <label>데모/라이브 링크 (선택)</label>
                  <input className={styles.input} placeholder="https://..." value={formData.demoUrl} onChange={e => setFormData({ ...formData, demoUrl: e.target.value })} />
                </div>
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
