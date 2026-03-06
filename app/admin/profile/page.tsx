'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Save,
  GraduationCap,
  Github,
  Globe,
  ImageIcon,
  Loader2
} from 'lucide-react';

import styles from '@/app/admin/admin.module.css';
import { LoadingState } from '@/components/admin/AdminComponents';

export default function ProfileAdminPage() {
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
    blog: '',
    intro: '',
    privateMemo: '',
    avatarUrl: '',
    avatarId: '',
    id: ''
  });

  const [isUploading, setIsUploading] = useState(false);
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const profileFileInputRef = useRef<HTMLInputElement>(null);

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

  const handleProfileAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile(prev => ({ ...prev, avatarUrl: reader.result as string }));
      setPendingAvatarFile(file);
      alert(`프로필 이미지가 변경되었습니다. \n최종 [프로필 수정] 버튼을 눌러야 반영됩니다.`);
    };
    reader.readAsDataURL(file);

    if (profileFileInputRef.current) profileFileInputRef.current.value = '';
  };

  const handleProfileSave = async () => {
    setIsUploading(true);
    try {
      let currentAvatarId = profile.avatarId;

      if (pendingAvatarFile) {
        const response = await fetch(`/api/admin?target=attachments&filename=${encodeURIComponent(pendingAvatarFile.name)}`, {
          method: 'POST',
          body: pendingAvatarFile,
        });

        if (response.ok) {
          const data = await response.json();
          currentAvatarId = data.id;
        } else {
          alert('프로필 이미지 업로드에 실패하여 기존 정보만 저장합니다.');
        }
      }

      const profileToSave = { ...profile, avatarId: currentAvatarId };
      const url = profile.id ? `/api/admin?target=profile&id=${profile.id}` : '/api/admin?target=profile';
      const method = profile.id ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileToSave),
      });

      if (res.ok) {
        alert(profile.id ? '프로필이 수정되었습니다.' : '프로필이 저장되었습니다.');
        setPendingAvatarFile(null);
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
    <div className={styles.contentCard}>
      <div className={styles.cardTop}>
        <div className="flex items-center gap-2">
          <User size={18} className="text-blue-500" />
          <h3 className="font-bold" style={{ margin: 0 }}>프로필 관리</h3>
        </div>
        <button
          className={styles.btnPrimary}
          style={{ padding: '6px 16px', fontSize: '0.85rem' }}
          onClick={handleProfileSave}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Save size={14} />
          )}
          {" "}
          {isUploading
            ? (profile.id ? '수정 중...' : '저장 중...')
            : (profile.id ? '프로필 수정' : '프로필 저장')
          }
        </button>
      </div>

      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', gap: '40px' }}>
          {/* 좌측: 프로필 이미지 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #cccccc',
              overflow: 'hidden',
              position: 'relative'
            }}>
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <User size={40} />
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, marginTop: '8px' }}>PROFILE</span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={profileFileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleProfileAvatarUpload}
            />
            <button
              className={styles.btnIcon}
              style={{ fontSize: '0.75rem', fontWeight: 700, width: '100%' }}
              onClick={() => profileFileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? '업로드 중...' : '이미지 변경'}
            </button>
          </div>

          {/* 우측: 상세 정보 입력 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className={styles.field}>
                <label>이름</label>
                <input className={styles.input} value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label>희망 직무 / 포지션</label>
                <input className={styles.input} placeholder="예: Full-Stack Developer" value={profile.position} onChange={e => setProfile({ ...profile, position: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className={styles.field}>
                <label>이메일</label>
                <input className={styles.input} value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label>전화번호</label>
                <input className={styles.input} value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr', gap: '16px' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className={styles.field}>
                <label className="flex items-center gap-2"><Github size={14} /> Github URL</label>
                <input className={styles.input} value={profile.github} onChange={(e) => setProfile({ ...profile, github: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label className="flex items-center gap-2"><Globe size={14} /> Blog URL</label>
                <input className={styles.input} value={profile.blog} onChange={(e) => setProfile({ ...profile, blog: e.target.value })} />
              </div>
            </div>

            <div className={styles.field}>
              <label>인사말</label>
              <textarea
                className={styles.input}
                style={{ minHeight: '80px', resize: 'none' }}
                value={profile.intro}
                onChange={e => setProfile({ ...profile, intro: e.target.value })}
                placeholder="자신을 한 줄로 표현해 보세요."
              />
            </div>

            <div className={styles.field}>
              <label>개인 메모 (포트폴리오 비노출)</label>
              <textarea
                className={styles.input}
                style={{ minHeight: '60px', resize: 'none', background: '#f8fafc' }}
                value={profile.privateMemo}
                onChange={e => setProfile({ ...profile, privateMemo: e.target.value })}
                placeholder="공개되지 않는 개인적인 메모를 입력하세요."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
