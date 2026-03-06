'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Save,
  GraduationCap,
  Github,
  Globe,
  Mail,
  Phone,
  Loader2,
  Calendar,
  CheckCircle2
} from 'lucide-react';

import styles from '@/app/admin/admin.module.css';
import { LoadingState } from '@/components/admin/AdminComponents';

export default function ProfileAdminPage() {
  const [profile, setProfile] = useState({
    name: '김성취',
    position: '',
    email: 'ghfkddl665@naver.com',
    phone: '010-3708-4460',
    school: '',
    major: '',
    degreeStatus: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    github: 'https://github.com/kimseongchwi',
    blog: '',
    intro: '',
    privateMemo: '',
    avatarUrl: '',
    avatarId: '',
    id: ''
  });

  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
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
            blog: data.blog || '',
            intro: data.intro || '',
            privateMemo: data.privateMemo || '',
            avatarUrl: data.avatar?.url || '',
            avatarId: data.avatarId || '',
            id: data.id || ''
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async () => {
    setIsUploading(true);
    try {
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
    } catch (error) {
      console.error(error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className={styles.fadeIn}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.titleGroup}>
          <h1>프로필 관리</h1>
          <p>포트폴리오 사이드바에 표시되는 기본 정보를 관리합니다.</p>
        </div>
        <button
          className={styles.btnPrimary}
          onClick={handleProfileSave}
          disabled={isUploading}
        >
          {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          저정하기
        </button>
      </div>

      <div className={styles.formGrid}>
        {/* Card 1: 기본 정보 */}
        <div className={styles.contentCard}>
          <div className={styles.cardTop}>
            <h3><User size={18} className="text-emerald-500" /> 기본 정보</h3>
          </div>
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div className={styles.field}>
                <label>이름</label>
                <input 
                  className={styles.input} 
                  value={profile.name} 
                  onChange={e => setProfile({ ...profile, name: e.target.value })} 
                />
              </div>
              <div className={styles.field}>
                <label>희망 직함 / 포지션</label>
                <input 
                  className={styles.input} 
                  placeholder="예: Fullstack Developer" 
                  value={profile.position} 
                  onChange={e => setProfile({ ...profile, position: e.target.value })} 
                />
              </div>
            </div>
            <div className={styles.field}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>자기소개 (인사말)</label>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  * HTML 태그({'<b>'}, {'<span>'} 등) 사용 가능
                </span>
              </div>
              <textarea
                className={styles.input}
                style={{ minHeight: '100px', resize: 'none' }}
                value={profile.intro}
                onChange={e => setProfile({ ...profile, intro: e.target.value })}
                placeholder="자신을 표현하는 소개글을 입력하세요."
              />
            </div>
          </div>
        </div>

        {/* Card 2: 연락처 */}
        <div className={styles.contentCard}>
          <div className={styles.cardTop}>
            <h3><Mail size={18} className="text-emerald-500" /> 연락처 및 링크</h3>
          </div>
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div className={styles.field}>
                <label>이메일</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    className={styles.input} 
                    style={{ paddingLeft: '40px' }}
                    value={profile.email} 
                    onChange={e => setProfile({ ...profile, email: e.target.value })} 
                  />
                  <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                </div>
              </div>
              <div className={styles.field}>
                <label>전화번호</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    className={styles.input} 
                    style={{ paddingLeft: '40px' }}
                    value={profile.phone} 
                    onChange={e => setProfile({ ...profile, phone: e.target.value })} 
                  />
                  <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                </div>
              </div>
            </div>
            <div className={styles.field} style={{ marginBottom: '24px' }}>
              <label>GitHub URL</label>
              <div style={{ position: 'relative' }}>
                <input 
                  className={styles.input} 
                  style={{ paddingLeft: '40px' }}
                  value={profile.github} 
                  onChange={e => setProfile({ ...profile, github: e.target.value })} 
                />
                <Github size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
            </div>
            <div className={styles.field}>
              <label>Blog URL</label>
              <div style={{ position: 'relative' }}>
                <input 
                  className={styles.input} 
                  style={{ paddingLeft: '40px' }}
                  value={profile.blog} 
                  onChange={e => setProfile({ ...profile, blog: e.target.value })} 
                />
                <Globe size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: 학력 사항 */}
        <div className={styles.contentCard}>
          <div className={styles.cardTop}>
            <h3><GraduationCap size={18} className="text-emerald-500" /> 학력 사항</h3>
          </div>
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr', gap: '20px', marginBottom: '24px' }}>
              <div className={styles.field}>
                <label>학교명</label>
                <input 
                  className={styles.input} 
                  placeholder="예: OO대학교"
                  value={profile.school} 
                  onChange={e => setProfile({ ...profile, school: e.target.value })} 
                />
              </div>
              <div className={styles.field}>
                <label>전공</label>
                <input 
                  className={styles.input} 
                  placeholder="예: 컴퓨터공학"
                  value={profile.major} 
                  onChange={e => setProfile({ ...profile, major: e.target.value })} 
                />
              </div>
              <div className={styles.field}>
                <label>학위 상태</label>
                <select
                  className={styles.select}
                  value={profile.degreeStatus}
                  onChange={e => setProfile({ ...profile, degreeStatus: e.target.value })}
                >
                  <option value="">선택하세요</option>
                  <option value="학사">학사</option>
                  <option value="전문학사">전문학사</option>
                  <option value="석사">석사</option>
                  <option value="박사">박사</option>
                  <option value="졸업">졸업</option>
                  <option value="수료">수료</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className={styles.field}>
                <label>입학일</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    className={styles.input} 
                    style={{ paddingLeft: '40px' }}
                    placeholder="예: 2020.03"
                    value={profile.startDate} 
                    onChange={e => setProfile({ ...profile, startDate: e.target.value })} 
                  />
                  <Calendar size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                </div>
              </div>
              <div className={styles.field}>
                <label>졸업일 (또는 예정)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ position: 'relative' }}>
                    <input 
                      className={styles.input} 
                      style={{ paddingLeft: '40px', opacity: profile.isCurrent ? 0.5 : 1 }}
                      placeholder="예: 2024.02"
                      value={profile.endDate} 
                      onChange={e => setProfile({ ...profile, endDate: e.target.value, isCurrent: false })} 
                      disabled={profile.isCurrent}
                    />
                    <Calendar size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                    <input 
                      type="checkbox" 
                      checked={profile.isCurrent} 
                      onChange={e => setProfile({ ...profile, isCurrent: e.target.checked })} 
                    />
                    재학 중 (또는 휴학)
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: 비공개 메모 */}
        <div className={styles.contentCard}>
          <div className={styles.cardTop}>
            <h3><CheckCircle2 size={18} style={{ color: '#94a3b8' }} /> 비공개 메모</h3>
          </div>
          <div style={{ padding: '32px' }}>
            <div className={styles.field}>
              <label>개인적인 메모 (포트폴리오 비노출)</label>
              <textarea
                className={styles.input}
                style={{ minHeight: '80px', resize: 'none', background: '#f8fafc' }}
                value={profile.privateMemo}
                onChange={e => setProfile({ ...profile, privateMemo: e.target.value })}
                placeholder="나만 볼 수 있는 개인적인 메모를 기록하세요."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
