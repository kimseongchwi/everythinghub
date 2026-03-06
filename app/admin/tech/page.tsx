'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Code2, Edit, Trash2, Loader2, Eye, EyeOff, Star, Save } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import { AdminPageWrapper, LoadingState, EmptyState, Modal } from '@/components/admin/AdminComponents';
import TechIcon from '@/components/TechIcon';

export default function TechAdminPage() {
  const [techStacks, setTechStacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddingTech, setIsAddingTech] = useState(false);
  const [editingTechId, setEditingTechId] = useState<string | null>(null);
  const [techFormData, setTechFormData] = useState({ name: '', category: 'Frontend', description: '', sortOrder: 0, isVisible: false });
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');

  const categories = ['Frontend', 'Backend', 'Database', 'Infra/DevOps', 'ORM'];

  const commonTechList = {
    'Frontend': ['Vue.js', 'React', 'TypeScript', 'JavaScript', 'TailwindCSS', 'Styled Components', 'Recoil', 'Redux', 'Zustand'],
    'Backend': ['Node.js', 'Express', 'NestJS', 'Go', 'Python', 'Django', 'FastAPI', 'Spring Boot', 'Java'],
    'Database': ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase'],
    'Infra/DevOps': ['AWS', 'Vercel', 'Docker', 'Github Actions', 'Nginx', 'GCP', 'Azure'],
    'ORM': ['Prisma', 'TypeORM', 'Sequelize', 'Drizzle']
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

  const handleTechSubmit = async (e: React.FormEvent, showToast: any) => {
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
        setIsAddingTech(false);
        setEditingTechId(null);
        setTechFormData({ name: '', category: 'Frontend', description: '', sortOrder: 0, isVisible: false });
        setShowManualTech(false);
        fetchTechStacks();
        showToast('기술 스택이 저장되었습니다.', 'success');
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
    if (!confirm('모든 기술 스택을 비공개로 전환하시겠습니까?')) return;
    try {
      const res = await fetch('/api/admin?target=batch-hide', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'tech' }),
      });
      if (res.ok) {
        showToast('전체 비공개 처리되었습니다.', 'success');
        fetchTechStacks();
      }
    } catch (e) {
      showToast('처리에 실패했습니다.', 'error');
    }
  };

  const toggleVisibility = async (stack: any) => {
    const res = await fetch(`/api/admin?target=tech&id=${stack.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...stack, isVisible: !stack.isVisible }),
    });
    if (res.ok) fetchTechStacks();
  };

  const handleTechDelete = async (id: string, showToast: any) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;
    const res = await fetch(`/api/admin?target=tech&id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('삭제되었습니다.', 'success');
      fetchTechStacks();
    } else {
      showToast('삭제에 실패했습니다.', 'error');
    }
  };

  const handleTechEdit = (stack: any) => {
    const currentCatList = commonTechList[stack.category as keyof typeof commonTechList] || [];
    const isManual = stack.name && !currentCatList.includes(stack.name);
    setTechFormData({
      name: stack.name,
      category: stack.category,
      description: stack.description || '',
      sortOrder: stack.sortOrder,
      isVisible: stack.isVisible !== undefined ? stack.isVisible : true
    });
    setShowManualTech(isManual);
    setEditingTechId(stack.id);
    setIsAddingTech(true);
  };

  return (
    <AdminPageWrapper>
      {(profile, showToast) => (
        <div className={styles.fadeIn}>
          {/* Header */}
          <div className={styles.pageHeader}>
            <div className={styles.titleGroup}>
              <h1>기술스택 관리</h1>
              <p>포트폴리오에 노출될 기술 스택을 선택하고 관리합니다.</p>
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
                  setIsAddingTech(true);
                  setEditingTechId(null);
                  setTechFormData({ name: '', category: 'Frontend', description: '', sortOrder: techStacks.length, isVisible: true });
                  setShowManualTech(false);
                }}
              >
                <Plus size={16} /> 기술 스택 등록
              </button>
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setSelectedFilter('All')}
              style={{
                padding: '6px 16px',
                borderRadius: '99px',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: '1px solid',
                borderColor: selectedFilter === 'All' ? '#10b981' : '#e2e8f0',
                background: selectedFilter === 'All' ? '#10b981' : '#fff',
                color: selectedFilter === 'All' ? '#fff' : '#64748b',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              전체 ({techStacks.length})
            </button>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '99px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: selectedFilter === cat ? '#10b981' : '#e2e8f0',
                  background: selectedFilter === cat ? '#10b981' : '#fff',
                  color: selectedFilter === cat ? '#fff' : '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {cat} ({techStacks.filter(s => s.category === cat).length})
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {categories.map(cat => {
              if (selectedFilter !== 'All' && selectedFilter !== cat) return null;
              const stacksInCat = techStacks.filter(s => s.category === cat);
              if (stacksInCat.length === 0 && selectedFilter !== 'All') return (
                <EmptyState message={`${cat} 카테고리에 등록된 기술이 없습니다.`} key={cat} />
              );
              if (stacksInCat.length === 0) return null;

              return (
                <div key={cat} className={styles.contentCard}>
                  <div className={styles.cardTop}>
                    <h3>
                      <span style={{ color: '#10b981' }}>|</span> 
                      {cat} 
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>({stacksInCat.length})</span>
                    </h3>
                  </div>
                  <div style={{ padding: '0 32px' }}>
                    {stacksInCat.map((stack, idx) => (
                      <div 
                        key={stack.id} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          padding: '20px 0', 
                          borderBottom: idx === stacksInCat.length - 1 ? 'none' : '1px solid #f1f5f9' 
                        }}
                      >
                        <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <TechIcon name={stack.name} size={32} />
                        </div>
                        <div style={{ flex: 1, marginLeft: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>{stack.name}</span>
                          </div>
                          {stack.description && (
                            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>{stack.description}</p>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            onClick={() => toggleVisibility(stack)}
                            title={stack.isVisible ? '공개 중' : '비공개 중'}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              border: '1px solid',
                              borderColor: stack.isVisible ? '#d1fae5' : '#f1f5f9',
                              background: stack.isVisible ? '#ecfdf5' : '#f8fafc',
                              color: stack.isVisible ? '#10b981' : '#94a3b8',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s'
                            }}
                          >
                            {stack.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                          <button className={styles.btnIcon} onClick={() => handleTechEdit(stack)}>
                            <Edit size={16} />
                          </button>
                          <button className={styles.btnIcon} onClick={() => handleTechDelete(stack.id, showToast)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal */}
          <Modal
            isOpen={isAddingTech}
            onClose={() => setIsAddingTech(false)}
            title={editingTechId ? '기술 스택 수정' : '기술 스택 등록'}
            footer={
              <>
                <button type="button" onClick={() => setIsAddingTech(false)} className={styles.btnSecondary} disabled={isUploading}>취소</button>
                <button type="submit" form="tech-form" className={styles.btnPrimary} disabled={isUploading}>
                  {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  데이터 저장
                </button>
              </>
            }
          >
            <form id="tech-form" onSubmit={(e) => handleTechSubmit(e, showToast)} className={styles.formGrid}>
              <div className={styles.field}>
                <label>카테고리</label>
                <select
                  className={styles.select}
                  value={techFormData.category}
                  onChange={e => setTechFormData({ ...techFormData, category: e.target.value, name: '' })}
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
                      if (e.target.value === 'custom') {
                        setShowManualTech(true);
                        setTechFormData({ ...techFormData, name: '' });
                      } else {
                        setShowManualTech(false);
                        setTechFormData({ ...techFormData, name: e.target.value });
                      }
                    }}
                  >
                    <option value="" disabled hidden>선택하세요</option>
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
                      required
                    />
                  )}
                </div>
              </div>

              <div className={styles.field}>
                <label>설명 (선택사항)</label>
                <textarea
                  className={styles.input}
                  style={{ minHeight: '80px', resize: 'none' }}
                  value={techFormData.description}
                  onChange={e => setTechFormData({ ...techFormData, description: e.target.value })}
                />
              </div>

              <div className={styles.field}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={techFormData.isVisible}
                    onChange={e => setTechFormData({ ...techFormData, isVisible: e.target.checked })}
                  />
                  <span>포트폴리오에 공개</span>
                </label>
              </div>
            </form>
          </Modal>
        </div>
      )}
    </AdminPageWrapper>
  );
}
