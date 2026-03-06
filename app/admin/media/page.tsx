'use client';

import React, { useState, useEffect } from 'react';
import { ImageIcon, Trash2, Loader2, FileText, Download, ExternalLink } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';
import { AdminPageWrapper, LoadingState, EmptyState } from '@/components/admin/AdminComponents';

export default function MediaAdminPage() {
  const [attachments, setAttachments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin?target=attachments');
      if (res.ok) {
        const data = await res.json();
        setAttachments(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMediaDelete = async (id: string, originalName: string) => {
    if (!confirm(`정말로 이 파일을 삭제하시겠습니까?\n파일명: ${originalName}`)) return;
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/admin?target=attachments&id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('삭제되었습니다.');
        fetchMedia();
      } else {
        alert('삭제에 실패했습니다.');
      }
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <AdminPageWrapper>
      {() => (
        <div className={styles.contentCard}>
          <div className={styles.cardTop}>
            <div className="flex items-center gap-2">
              <ImageIcon size={18} className="text-pink-500" />
              <h3 className="font-bold" style={{ margin: 0 }}>전체 파일 관리 (Media Library)</h3>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              총 {attachments.length}개의 파일
            </div>
          </div>
          <div style={{ padding: '24px' }}>
            {loading ? <LoadingState /> : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {attachments.length > 0 ? (
                  attachments.map(file => {
                    const isImage = file.contentType?.startsWith('image/');
                    return (
                      <div key={file.id} style={{ 
                        border: '1px solid #f1f5f9', 
                        borderRadius: '12px', 
                        overflow: 'hidden', 
                        background: '#fff',
                        transition: 'transform 0.2s',
                        position: 'relative'
                      }}>
                        <div style={{ height: '140px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                          {isImage ? (
                            <img src={file.url} alt={file.originalName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <FileText size={40} className="text-blue-200" />
                          )}
                          <div style={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            right: 0, 
                            bottom: 0, 
                            background: 'rgba(0,0,0,0.4)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            gap: '12px'
                          }} 
                          onMouseOver={e => e.currentTarget.style.opacity = '1'}
                          onMouseOut={e => e.currentTarget.style.opacity = '0'}
                          >
                            <a href={file.url} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', padding: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}>
                              <ExternalLink size={18} />
                            </a>
                            <button 
                              onClick={() => handleMediaDelete(file.id, file.originalName)}
                              disabled={isDeleting === file.id}
                              style={{ color: '#ff4d4f', padding: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', border: 'none', cursor: 'pointer' }}
                            >
                              {isDeleting === file.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                            </button>
                          </div>
                        </div>
                        <div style={{ padding: '12px' }}>
                          <p style={{ 
                            margin: 0, 
                            fontSize: '0.75rem', 
                            fontWeight: 700, 
                            color: '#1e293b', 
                            whiteSpace: 'nowrap', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis' 
                          }}>
                            {file.originalName}
                          </p>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.65rem', color: '#94a3b8' }}>
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <EmptyState message="업로드된 미디어 파일이 없습니다." />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </AdminPageWrapper>
  );
}
