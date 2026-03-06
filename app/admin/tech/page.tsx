'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Code2, Edit, Trash2, Loader2 } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import { AdminPageWrapper, LoadingState, EmptyState, Modal } from '@/components/admin/AdminComponents';
import TechIcon from '@/components/TechIcon';

export default function TechAdminPage() {
  const [techStacks, setTechStacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddingTech, setIsAddingTech] = useState(false);
  const [editingTechId, setEditingTechId] = useState<string | null>(null);
  const [techFormData, setTechFormData] = useState({ name: '', category: 'Frontend', description: '', sortOrder: 0 });
  const [isUploading, setIsUploading] = useState(false);

  const categories = ['Frontend', 'Backend', 'Database', 'Infra/DevOps', 'ORM', 'ETC'];

  const commonTechList = {
    'Frontend': ['Vue.js & Nuxt.js', 'React & Next.js', 'TypeScript', 'JavaScript', 'TailwindCSS', 'Styled Components', 'Recoil', 'Redux', 'Zustand'],
    'Backend': ['Node.js', 'Express', 'NestJS', 'Go', 'Python', 'Django', 'FastAPI', 'Spring Boot', 'Java'],
    'Database': ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase'],
    'Infra/DevOps': ['AWS', 'Vercel', 'Docker', 'Github Actions', 'Nginx', 'GCP', 'Azure'],
    'ORM': ['Prisma', 'TypeORM', 'Sequelize', 'Drizzle'],
    'ETC': ['Git & GitHub', 'Figma', 'Slack', 'Notion', 'Discord']
  };

  const [showManualTech, setShowManualTech] = useState(false);

  useEffect(() => {
    fetchTechStacks();
  }, []);

  const fetchTechStacks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin?target=tech');
      if (res.ok) {
        const data = await res.json();
        setTechStacks(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTechSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingTechId ? `/api/admin?target=tech&id=${editingTechId}` : '/api/admin?target=tech';
    const method = editingTechId ? 'PATCH' : 'POST';

    setIsUploading(true);
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(techFormData),
      });

      if (res.ok) {
        alert(editingTechId ? '기술 스택이 수정되었습니다.' : '새 기술 스택이 등록되었습니다.');
        setIsAddingTech(false);
        setEditingTechId(null);
        setTechFormData({ name: '', category: 'Frontend', description: '', sortOrder: 0 });
        setShowManualTech(false);
        fetchTechStacks();
      } else {
        const error = await res.json();
        alert(`저장 실패: ${error.error || '알 수 없는 오류'}`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleTechDelete = async (id: string) => {
    if (!confirm('정말로 이 기술 스택을 삭제하시겠습니까?')) return;
    const res = await fetch(`/api/admin?target=tech&id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      alert('삭제되었습니다.');
      fetchTechStacks();
    } else {
      alert('삭제에 실패했습니다.');
    }
  };

  const handleTechEdit = (stack: any) => {
    const currentCatList = commonTechList[stack.category as keyof typeof commonTechList] || [];
    const isManual = stack.name && !currentCatList.includes(stack.name);
    
    setTechFormData({
      name: stack.name,
      category: stack.category,
      description: stack.description || '',
      sortOrder: stack.sortOrder
    });
    setShowManualTech(isManual);
    setEditingTechId(stack.id);
    setIsAddingTech(true);
  };

  return (
    <AdminPageWrapper>
      {() => (
        <div className={styles.contentCard}>
          <div className={styles.cardTop}>
            <div className="flex items-center gap-2">
              <Code2 size={18} className="text-cyan-500" />
              <h3 className="font-bold" style={{ margin: 0 }}>기술 스택 (Tool & Skill)</h3>
            </div>
            <button
              className={styles.btnPrimary}
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              onClick={() => {
                setIsAddingTech(true);
                setEditingTechId(null);
                setTechFormData({ name: '', category: 'Frontend', description: '', sortOrder: techStacks.length });
                setShowManualTech(false);
              }}
            >
              <Plus size={14} /> 기술 스택 등록
            </button>
          </div>
          <div style={{ padding: '24px' }}>
            {loading ? <LoadingState /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {techStacks.length > 0 ? (
                  categories.map(cat => {
                    const stacksInCat = techStacks.filter(s => s.category === cat);
                    if (stacksInCat.length === 0) return null;

                    return (
                      <div key={cat}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                          <span style={{ width: '4px', height: '16px', background: '#000', borderRadius: '2px' }}></span>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#111', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{cat}</h4>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>({stacksInCat.length})</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
                          {stacksInCat.map(stack => (
                            <div key={stack.id} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px', border: '1px solid #f1f5f9', borderRadius: '12px', background: '#f8fafc' }}>
                              <TechIcon name={stack.name} size={32} />
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                  <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{stack.name}</span>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>{stack.description}</p>
                              </div>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button
                                  className={styles.btnIcon}
                                  style={{ padding: '4px' }}
                                  onClick={() => handleTechEdit(stack)}
                                >
                                  <Edit size={12} />
                                </button>
                                <button
                                  className={styles.btnIcon}
                                  style={{ padding: '4px' }}
                                  onClick={() => handleTechDelete(stack.id)}
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <EmptyState
                    message="아직 등록된 기술 스택이 없습니다."
                    onAdd={() => {
                      setIsAddingTech(true);
                      setEditingTechId(null);
                      setTechFormData({ name: '', category: 'Frontend', description: '', sortOrder: techStacks.length });
                      setShowManualTech(false);
                    }}
                  />
                )}
              </div>
            )}
          </div>

          {/* 기술 스택 등록/수정 모달 */}
          <Modal
            isOpen={isAddingTech}
            onClose={() => setIsAddingTech(false)}
            title={editingTechId ? '기술 스택 수정' : '기술 스택 등록'}
          >
            <form onSubmit={handleTechSubmit} className={styles.formGrid}>
              <div className={styles.field}>
                <label>카테고리</label>
                <select
                  className={styles.select}
                  value={techFormData.category}
                  onChange={e => {
                    const newCat = e.target.value;
                    setTechFormData({ ...techFormData, category: newCat, name: '' });
                    setShowManualTech(false);
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label>기술명</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <select
                    className={styles.select}
                    value={showManualTech ? 'custom' : techFormData.name}
                    onChange={e => {
                      const val = e.target.value;
                      if (val === 'custom') {
                        setShowManualTech(true);
                        setTechFormData({ ...techFormData, name: '' });
                      } else {
                        setShowManualTech(false);
                        setTechFormData({ ...techFormData, name: val });
                      }
                    }}
                  >
                    <option value="" disabled hidden>선택하세요</option>
                    <option value="">선택안함</option>
                    {(commonTechList[techFormData.category as keyof typeof commonTechList] || []).map(tech => (
                      <option key={tech} value={tech}>{tech}</option>
                    ))}
                    <option value="custom">직접 입력</option>
                  </select>

                  {showManualTech && (
                    <input
                      className={styles.input}
                      placeholder="기술명을 직접 입력하세요"
                      value={techFormData.name}
                      onChange={e => setTechFormData({ ...techFormData, name: e.target.value })}
                      autoFocus
                      required
                    />
                  )}
                </div>
              </div>

              <div className={styles.field}>
                <label>설명 (선택사항)</label>
                <textarea
                  className={styles.input}
                  style={{ minHeight: '100px', resize: 'none' }}
                  placeholder="해당 기술을 프로젝트에서 어떻게 활용했는지 간단히 적어주세요."
                  value={techFormData.description}
                  onChange={e => setTechFormData({ ...techFormData, description: e.target.value })}
                />
              </div>

              <div className={styles.btnGroup}>
                <button type="button" onClick={() => setIsAddingTech(false)} className={styles.btnCancel} disabled={isUploading}>닫기</button>
                <button type="submit" className={styles.btnPrimary} disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      {" "}
                      {editingTechId ? '수정 중...' : '등록 중...'}
                    </>
                  ) : (
                    editingTechId ? '수정 완료' : '등록 완료'
                  )}
                </button>
              </div>
            </form>
          </Modal>
        </div>
      )}
    </AdminPageWrapper>
  );
}
