'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit,
  Copy,
  File as FileIcon,
  Award,
  UploadCloud,
  ExternalLink,
  User,
  Save,
  GraduationCap,
  Briefcase,
  FolderOpen,
  Github,
  Globe,
  Code2,
  Cpu,
  CheckCircle2
} from 'lucide-react';

import CustomDatePicker from '@/components/CustomDatePicker';

import styles from './admin.module.css';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('portfolio');

  // 프로필 정보 상태
  const [profile, setProfile] = useState({
    name: '김성취',
    position: '',
    email: 'ghfkddl665@naver.com',
    phone: '010-3708-4460',
    school: '명지전문대학',
    major: '정보통신공학과',
    degreeStatus: '전문학사',
    startDate: '',
    endDate: '',
    isCurrent: false,
    github: 'https://github.com/kimseongchwi',
    notion: '',
    intro: '',
    avatarUrl: '',
    avatarId: '',
    id: ''
  });

  // 기술 스택 상태
  const [techStacks, setTechStacks] = useState<any[]>([]);
  const categories = ['Frontend', 'Backend', 'Database', 'Infra/DevOps', 'ORM', 'ETC'];

  // 근무 경력 및 프로젝트 상태
  const [workExperiences, setWorkExperiences] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  // 포트폴리오 관리 상태 (자격증 등)
  const [certs, setCerts] = useState<any[]>([]);
  const [isAddingCert, setIsAddingCert] = useState(false);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    status: '취득완료',
    acquiredAt: '',
    attachmentId: '',
    fileUrl: '',
    sortOrder: 0
  });

  // 미디어 관리 상태 (파일)
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (activeTab === 'portfolio' && profile.id) {
      fetchTechStacks();
      fetchCerts();
      fetchWorkExperience();
      fetchProjects();
    }
    if (activeTab === 'media') fetchMedia();
  }, [activeTab, profile.id]);

  const fetchProfile = async () => {
    const res = await fetch('/api/admin?target=profile');
    if (res.ok) {
      const data = await res.json();
      if (data) {
        const edu = data.educations?.[0];

        setProfile({
          name: data.name || '',
          position: data.position || '',
          email: data.email || '',
          phone: data.phone || '',
          school: edu?.school || '',
          major: edu?.major || '',
          degreeStatus: edu?.degreeStatus || '',
          startDate: edu?.startDate || '',
          endDate: edu?.endDate || '',
          isCurrent: edu?.isCurrent || false,
          github: data.github || '',
          notion: data.notion || '',
          intro: data.intro || '',
          avatarUrl: data.avatar?.url || '',
          avatarId: data.avatarId || '',
          id: data.id || ''
        });
      }
    }
  };

  const fetchTechStacks = async () => {
    const res = await fetch('/api/admin?target=tech');
    if (res.ok) {
      const data = await res.json();
      setTechStacks(data);
    }
  };

  const fetchWorkExperience = async () => {
    const res = await fetch('/api/admin?target=work');
    if (res.ok) {
      const data = await res.json();
      setWorkExperiences(data);
    }
  };

  const fetchProjects = async () => {
    const res = await fetch('/api/admin?target=projects');
    if (res.ok) {
      const data = await res.json();
      setProjects(data);
    }
  };

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
      alert(editingCertId ? '항목이 수정되었습니다.' : '새 항목이 등록되었습니다.');
      setIsAddingCert(false);
      setEditingCertId(null);
      setFormData({ title: '', issuer: '', status: '취득완료', acquiredAt: '', attachmentId: '', fileUrl: '', sortOrder: 0 });
      fetchCerts();
    } else {
      const error = await res.json();
      alert(`저장 실패: ${error.error || '알 수 없는 오류'}`);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isForCert: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await fetch(`/api/admin?target=attachments&filename=${encodeURIComponent(file.name)}`, {
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
        alert('파일이 업로드되었습니다.');
      } else {
        alert('업로드 실패');
      }
    } catch (error) {
      console.error(error);
      alert('업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleProfileSave = async () => {
    const url = profile.id ? `/api/admin?target=profile&id=${profile.id}` : '/api/admin?target=profile';
    const method = profile.id ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });

    if (res.ok) {
      alert(profile.id ? '프로필이 수정되었습니다.' : '프로필이 저장되었습니다.');
      fetchProfile();
    } else {
      const error = await res.json();
      alert(`${profile.id ? '수정' : '저장'} 실패: ${error.error || '알 수 없는 오류'}`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('파일 URL이 복사되었습니다.');
  };

  return (
    <div className={styles.adminContainer}>
      {/* 사이드바 메뉴 */}
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}><LayoutDashboard size={20} /></div>
          <h2>Admin Console</h2>
        </div>

        <div className={styles.navSection}>
          <label>Manage</label>
          <button
            className={`${styles.navButton} ${activeTab === 'portfolio' ? styles.active : ''}`}
            onClick={() => setActiveTab('portfolio')}
          >
            <User size={18} /> <span>포트폴리오 관리</span>
          </button>
          <button
            className={`${styles.navButton} ${activeTab === 'media' ? styles.active : ''}`}
            onClick={() => setActiveTab('media')}
          >
            <ImageIcon size={18} /> <span>전체 파일 관리</span>
          </button>
        </div>

        <div className={styles.navSection}>
          <label>Live View</label>
          <a
            href="/portfolio"
            target="_blank"
            className={styles.navButton}
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <ExternalLink size={18} /> <span>포트폴리오 페이지 오픈</span>
          </a>
        </div>
      </aside>

      {/* 메인 콘텐츠 영역 */}
      <main className={styles.mainLayout}>
        <header className={styles.pageHeader}>
          <div className={styles.titleGroup}>
            <h1>포트폴리오 관리</h1>
            <p>프로필 정보와 핵심 역량을 최신 상태로 관리하세요.</p>
          </div>
        </header>

        {activeTab === 'portfolio' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 1. 프로필 관리 */}
            <div className={styles.contentCard}>
              <div className={styles.cardTop}>
                <div className="flex items-center gap-2">
                  <User size={18} className="text-blue-500" />
                  <h3 className="font-bold">프로필 통합 관리</h3>
                </div>
                <button
                  className={styles.btnPrimary}
                  style={{ background: '#3b82f6', padding: '6px 16px', fontSize: '0.85rem' }}
                  onClick={handleProfileSave}
                >
                  <Save size={14} /> {profile.id ? '전체 프로필 수정' : '전체 프로필 저장'}
                </button>
              </div>

              <div style={{ padding: '32px', display: 'flex', gap: '40px' }}>
                {/* 좌측: 프로필 사진 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '140px',
                    height: '140px',
                    borderRadius: '24px',
                    background: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed #cbd5e0',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400">
                        <User size={40} />
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, marginTop: '8px' }}>PHOTO</span>
                      </div>
                    )}
                  </div>
                  <button className={styles.btnIcon} style={{ fontSize: '0.75rem', fontWeight: 700, width: '100%' }}>
                    사진 변경
                  </button>
                </div>

                {/* 우측: 상세 정보 입력 */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className={styles.field}>
                      <label>이름</label>
                      <input className={styles.input} value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
                    </div>
                    <div className={styles.field}>
                      <label>희망 직무 / 포지션</label>
                      <input className={styles.input} placeholder="예: Full-Stack Developer" value={profile.position} onChange={e => setProfile({ ...profile, position: e.target.value })} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className={styles.field}>
                      <label>이메일</label>
                      <input className={styles.input} value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
                    </div>
                    <div className={styles.field}>
                      <label>전화번호</label>
                      <input className={styles.input} value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr', gap: '16px' }}>
                    <div className={styles.field}>
                      <label className="flex items-center gap-2"><GraduationCap size={14} /> 학교</label>
                      <input className={styles.input} placeholder="예: 명지전문대학" value={profile.school} onChange={(e) => setProfile({ ...profile, school: e.target.value })} />
                    </div>
                    <div className={styles.field}>
                      <label>전공(학과)</label>
                      <input className={styles.input} placeholder="예: 정보통신공학과" value={profile.major} onChange={(e) => setProfile({ ...profile, major: e.target.value })} />
                    </div>
                    <div className={styles.field}>
                      <label>학위 상태</label>
                      <select
                        className={styles.select}
                        value={profile.degreeStatus}
                        onChange={(e) => setProfile({ ...profile, degreeStatus: e.target.value })}
                      >
                        <option value="">선택하세요</option>
                        <option value="학사">학사</option>
                        <option value="전문학사">전문학사</option>
                        <option value="석사">석사</option>
                        <option value="박사">박사</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className={styles.field}>
                      <label>재학 시작 (입학일)</label>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="예: 2020.03"
                        value={profile.startDate}
                        onChange={(e) => setProfile({ ...profile, startDate: e.target.value })}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>재학 종료 (졸업일)</label>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="예: 2024.02"
                        value={profile.endDate}
                        onChange={(e) => setProfile({ ...profile, endDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className={styles.field}>
                      <label className="flex items-center gap-2"><Github size={14} /> Github URL</label>
                      <input className={styles.input} value={profile.github} onChange={(e) => setProfile({ ...profile, github: e.target.value })} />
                    </div>
                    <div className={styles.field}>
                      <label className="flex items-center gap-2"><ImageIcon size={14} /> Notion URL</label>
                      <input className={styles.input} value={profile.notion} onChange={(e) => setProfile({ ...profile, notion: e.target.value })} />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label>인사말</label>
                    <textarea
                      className={styles.input}
                      style={{ minHeight: '80px', resize: 'vertical' }}
                      value={profile.intro}
                      onChange={e => setProfile({ ...profile, intro: e.target.value })}
                      placeholder="자신을 한 줄로 표현해 보세요."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 프로필이 존재하는 경우에만 하위 섹션 노출 */}
            {profile.id ? (
              <>
                {/* 2. 기술 스택 관리 */}
                <div className={styles.contentCard}>
                  <div className={styles.cardTop}>
                    <div className="flex items-center gap-2">
                      <Code2 size={18} className="text-cyan-500" />
                      <h3 className="font-bold">기술 스택 (Tool & Skill)</h3>
                    </div>
                    <button className={styles.btnPrimary} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                      <Plus size={14} /> 스택 추가
                    </button>
                  </div>
                  <div style={{ padding: '24px' }}>
                    <div className="flex flex-col gap-10" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                      {categories.map(cat => {
                        const stacksInCat = techStacks.filter(s => s.category === cat);
                        return (
                          <div key={cat}>
                            <div className="flex items-center gap-2 mb-4" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                              <span style={{ width: '4px', height: '16px', background: '#000', borderRadius: '2px' }}></span>
                              <h4 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#111', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cat}</h4>
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>({stacksInCat.length})</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                              {stacksInCat.map(stack => (
                                <div key={stack.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50 hover:border-blue-100 transition-all" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px', border: '1px solid #f1f5f9', borderRadius: '12px', background: '#f8fafc' }}>
                                  <div style={{ flex: 1 }}>
                                    <div className="flex items-center gap-2 mb-1" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                      <span className="font-bold text-[0.95rem]" style={{ fontWeight: 800, fontSize: '0.95rem' }}>{stack.name}</span>
                                      <span className={`px-2 py-0.5 rounded text-[0.65rem] font-black ${stack.level === '상' ? 'bg-blue-100 text-blue-600' :
                                        stack.level === '중' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
                                        }`} style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 900 }}>
                                        {stack.level}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-500" style={{ fontSize: '0.8rem', color: '#64748b' }}>{stack.description}</p>
                                  </div>
                                  <div style={{ display: 'flex', gap: '4px' }}>
                                    <button className={styles.btnIcon} style={{ padding: '4px' }}><Edit size={12} /></button>
                                    <button className={styles.btnIcon} style={{ padding: '4px' }}><Trash2 size={12} /></button>
                                  </div>
                                </div>
                              ))}
                              {stacksInCat.length === 0 && (
                                <div style={{ gridColumn: 'span 2', padding: '16px', textAlign: 'center', border: '1px dashed #e2e8f0', borderRadius: '12px', color: '#94a3b8', fontSize: '0.85rem' }}>
                                  등록된 {cat} 기술이 없습니다.
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. 경력 및 프로젝트 관리 */}
                <div className={styles.contentCard}>
                  <div className={styles.cardTop}>
                    <div className="flex items-center gap-2">
                      <Briefcase size={18} className="text-orange-500" />
                      <h3 className="font-bold">근무 경력 및 프로젝트</h3>
                    </div>
                    <button className={styles.btnPrimary}>
                      <Plus size={16} /> 경력 추가
                    </button>
                  </div>
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {workExperiences.map(work => (
                        <div key={work.id} className="p-6 bg-gray-50 rounded-xl border border-gray-100" style={{ padding: '24px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                          <div className="flex justify-between items-start mb-6" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div>
                              <h4 className="text-lg font-black" style={{ fontSize: '1.2rem', fontWeight: 900 }}>{work.companyName}</h4>
                              <p className="text-sm text-gray-500" style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                {work.startDate} - {work.endDate || '현재'} | {work.role}
                              </p>
                            </div>
                            <div className="flex gap-2" style={{ display: 'flex', gap: '8px' }}>
                              <button className={styles.btnIcon}><Edit size={14} /></button>
                              <button className={styles.btnIcon}><Trash2 size={14} /></button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {work.projects?.map((proj: any) => (
                              <div key={proj.id} className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: '#fff', border: '1px solid #f1f5f9', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                <div className="w-10 h-10 bg-blue-50 text-blue-600 flex items-center justify-center rounded-lg" style={{ width: '40px', height: '40px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}><Cpu size={20} /></div>
                                <div style={{ flex: 1 }}>
                                  <p className="font-bold text-sm" style={{ fontWeight: 700, fontSize: '0.9rem' }}>{proj.title}</p>
                                  <p className="text-[10px] text-gray-400" style={{ fontSize: '10px', color: '#94a3b8' }}>{proj.techStack}</p>
                                </div>
                                <button className="text-gray-300 hover:text-black" style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Edit size={14} /></button>
                              </div>
                            ))}
                            <button className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg hover:bg-gray-50 text-gray-300 transition-all" style={{ padding: '12px', border: '2px dashed #e2e8f0', borderRadius: '8px', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#cbd5e0' }}>
                              <Plus size={16} />
                              <span className="text-[10px] font-bold mt-1" style={{ fontSize: '10px', fontWeight: 800, marginTop: '4px' }}>프로젝트 추가</span>
                            </button>
                          </div>
                        </div>
                      ))}
                      {workExperiences.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', border: '1px dashed #e2e8f0', borderRadius: '12px' }}>
                          등록된 경력 정보가 없습니다.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. 개인 프로젝트 및 자격증 관리 */}
                <div className="grid grid-cols-2 gap-8" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                  <div className={styles.contentCard}>
                    <div className={styles.cardTop}>
                      <div className="flex items-center gap-2">
                        <FolderOpen size={18} className="text-purple-500" />
                        <h3 className="font-bold">개인 프로젝트 (Side)</h3>
                      </div>
                      <button className={styles.btnIcon}><Plus size={16} /></button>
                    </div>
                    <div style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {projects.map(proj => (
                          <div key={proj.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #f1f5f9', borderRadius: '12px' }}>
                            <div>
                              <p className="font-bold text-blue-600 hover:underline cursor-pointer" style={{ fontWeight: 800, color: '#2563eb' }}>{proj.title}</p>
                              <p className="text-xs text-gray-400 mt-1" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{proj.description}</p>
                            </div>
                            <div className="flex gap-2" style={{ display: 'flex', gap: '6px' }}>
                              <button className={styles.btnIcon} style={{ padding: '4px' }}><Edit size={12} /></button>
                              <button className={styles.btnIcon} style={{ padding: '4px' }}><Trash2 size={12} /></button>
                            </div>
                          </div>
                        ))}
                        {projects.length === 0 && (
                          <div style={{ textAlign: 'center', padding: '16px', color: '#94a3b8', border: '1px dashed #e2e8f0', borderRadius: '12px', fontSize: '0.85rem' }}>
                            등록된 사이드 프로젝트가 없습니다.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.contentCard}>
                    <div className={styles.cardTop}>
                      <div className="flex items-center gap-2">
                        <Award size={18} className="text-yellow-500" />
                        <h3 className="font-bold">자격증 및 수상</h3>
                      </div>
                      <button className={styles.btnPrimary} onClick={() => {
                        setIsAddingCert(true);
                        setEditingCertId(null);
                        setFormData({ title: '', issuer: '', status: '취득완료', acquiredAt: '', attachmentId: '', fileUrl: '', sortOrder: certs.length });
                      }}>
                        <Plus size={14} /> 추가
                      </button>
                    </div>
                    <div style={{ padding: '0 24px 24px' }}>
                      <table className={styles.listTable}>
                        <thead className={styles.listHead}>
                          <tr>
                            <th style={{ padding: '12px 0' }}>명칭</th>
                            <th style={{ padding: '12px 0' }}>상태</th>
                            <th style={{ padding: '12px 0', textAlign: 'right' }}>관리</th>
                          </tr>
                        </thead>
                        <tbody>
                          {certs.map((cert) => (
                            <tr key={cert.id} className={styles.listRow}>
                              <td style={{ padding: '12px 0' }}>
                                <div className="font-bold" style={{ fontWeight: 700 }}>{cert.title}</div>
                                <div className="text-[10px] text-gray-400" style={{ fontSize: '10px' }}>{cert.issuer}</div>
                              </td>
                              <td style={{ padding: '12px 0' }}>{cert.status}</td>
                              <td style={{ padding: '12px 0', textAlign: 'right' }}>
                                <button className="text-gray-300 hover:text-red-500" style={{ color: '#cbd5e0', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => handleCertDelete(cert.id)}><Trash2 size={14} /></button>
                              </td>
                            </tr>
                          ))}
                          {certs.length === 0 && (
                            <tr><td colSpan={3} className="text-center py-10 text-gray-300" style={{ textAlign: 'center', padding: '40px', color: '#cbd5e0' }}>아직 등록된 정보가 없습니다.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: 600 }}>
                  프로필 정보를 먼저 입력하고 저장해 주세요.<br />
                  프로필이 생성된 후에 기술 스택 및 경력 관리가 가능합니다.
                </p>
              </div>
            )}

          </div>
        )}

        {activeTab === 'media' && (
          <div className={styles.contentCard}>
            <div className={styles.cardTop}>
              <h3>업로드된 모든 파일</h3>
            </div>
            <div className={styles.mediaStack}>
              {mediaList.map((item) => (
                <div key={item.id} className={styles.mediaItem}>
                  <div className={styles.mediaPreview}>
                    {item.mimeType.startsWith('image/') ? (
                      <img src={item.url} alt="" />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <FileIcon size={32} className="text-gray-300" />
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{item.mimeType.split('/')[1] || 'FILE'}</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.mediaNameBox}>
                    <span className={styles.mediaName}>{decodeURIComponent(item.originalName)}</span>
                    <div className={styles.mediaIconRow}>
                      <button className={styles.btnIcon} title="URL 복사" onClick={() => copyToClipboard(item.url)}><Copy size={12} /></button>
                      <a href={item.url} target="_blank" className={styles.btnIcon} title="열기"><ExternalLink size={12} /></a>
                      <button className={styles.btnIcon} title="삭제" onClick={() => { if (confirm('정말로 삭제하시겠습니까?')) fetch(`/api/admin?target=attachments&id=${item.id}`, { method: 'DELETE' }).then(() => fetchMedia()) }}><Trash2 size={12} /></button>
                    </div>
                  </div>
                </div>
              ))}
              {mediaList.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: '#888' }}>
                  업로드된 파일이 없습니다.
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* 등록/수정 모달 */}
      {isAddingCert && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{editingCertId ? '내용 수정하기' : '새 데이터 추가하기'}</h2>
            <form onSubmit={handleCertSubmit} className={styles.formGrid}>
              <div className={styles.field}>
                <label>항목 제목</label>
                <input
                  className={styles.input}
                  placeholder="예: 정보처리기사, OO 프로젝트"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>발행처 / 소속</label>
                <input
                  className={styles.input}
                  placeholder="예: 한국산업인력공단, OO대학교"
                  value={formData.issuer}
                  onChange={e => setFormData({ ...formData, issuer: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className={styles.field}>
                  <label>현재 상태</label>
                  <select
                    className={styles.select}
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="취득완료">취득완료</option>
                    <option value="준비중">준비중</option>
                    <option value="재직중">재직중</option>
                    <option value="만료">만료</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label>일자</label>
                  <CustomDatePicker
                    value={formData.acquiredAt}
                    onChange={(val: string) => setFormData({ ...formData, acquiredAt: val })}
                    label=""
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label>증빙 자료 / 관련 파일</label>
                {formData.fileUrl ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8f8f8', padding: '12px', borderRadius: '8px', border: '1px solid #eee' }}>
                    <FileIcon size={16} className="text-black" />
                    <span style={{ flex: 1, fontSize: '0.85rem', fontWeight: 600 }}>증명서가 첨부되었습니다</span>
                    <button type="button" onClick={() => setFormData({ ...formData, fileUrl: '', attachmentId: '' })} style={{ color: '#ff4d4f', border: 'none', background: 'none', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className={styles.btnCancel}
                    style={{ borderStyle: 'dashed' }}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.onchange = (e: any) => handleFileUpload(e, true);
                      input.click();
                    }}
                    disabled={isUploading}
                  >
                    {isUploading ? '업로드 중...' : '증빙 파일 선택 (PDF, 이미지 등)'}
                  </button>
                )}
              </div>

              <div className={styles.btnGroup}>
                <button type="button" onClick={() => setIsAddingCert(false)} className={styles.btnCancel}>닫기</button>
                <button type="submit" className={styles.btnPrimary}>데이터 저장</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
