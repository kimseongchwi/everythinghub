"use client";

import React, { useState, useEffect } from 'react';
import styles from './archive.module.css';
import { Search, Plus, X, List, Hash, Terminal, Book, Trash2, Copy, Check, Filter } from 'lucide-react';

interface Snippet {
  id: string;
  title: string;
  content: string;
  language: string;
  createdAt: number;
}

const CATEGORIES = [
  { name: 'React', color: '#e0f2fe', text: '#0369a1', icon: <Terminal size={16} /> },
  { name: 'Vue', color: '#f0fdf4', text: '#15803d', icon: <Terminal size={16} /> },
  { name: 'Java', color: '#fef2f2', text: '#b91c1c', icon: <Terminal size={16} /> },
  { name: 'Common JS', color: '#fffbeb', text: '#b45309', icon: <Terminal size={16} /> },
  { name: 'Terms', color: '#f8fafc', text: '#475569', icon: <Book size={16} /> },
  { name: 'UI/UX', color: '#f5f3ff', text: '#6d28d9', icon: <Filter size={16} /> },
];

const ARCHIVE_DATA: Snippet[] = [
];

export default function CodeArchive() {
  const [snippets, setSnippets] = useState<Snippet[]>(ARCHIVE_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newLang, setNewLang] = useState('React');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const addSnippet = () => {
    if (!newTitle || !newContent) return;
    const snippet: Snippet = {
      id: Date.now().toString(),
      title: newTitle,
      content: newContent,
      language: newLang,
      createdAt: Date.now()
    };
    setSnippets([snippet, ...snippets]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewContent('');
  };

  const deleteSnippet = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('이 기록을 아카이브에서 영구적으로 삭제할까요?')) {
      setSnippets(snippets.filter(s => s.id !== id));
    }
  };

  const filteredSnippets = snippets.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLang = selectedLang ? s.language === selectedLang : true;
    return matchesSearch && matchesLang;
  });

  const getLangStyle = (langName: string) => {
    const config = CATEGORIES.find(l => l.name === langName) || { color: '#f1f5f9', text: '#64748b' };
    return { backgroundColor: config.color, color: config.text };
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <Search size={22} className="text-slate-300" />
        <input
          type="text"
          placeholder="코드 스니펫이나 용어를 검색해보세요..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.mainGrid}>
        <aside className={styles.sidebar}>
          <div className={styles.categoryGroup}>
            <p className={styles.categoryLabel}>Categories</p>
            <button
              className={`${styles.categoryBtn} ${selectedLang === null ? styles.categoryBtnActive : ''}`}
              onClick={() => setSelectedLang(null)}
            >
              <div className="flex items-center gap-3">
                <List size={18} /> <span>All Records</span>
              </div>
              <span className={styles.categoryCount}>{snippets.length}</span>
            </button>

            {CATEGORIES.map(cat => {
              const count = snippets.filter(s => s.language === cat.name).length;
              return (
                <button
                  key={cat.name}
                  className={`${styles.categoryBtn} ${selectedLang === cat.name ? styles.categoryBtnActive : ''}`}
                  onClick={() => setSelectedLang(cat.name)}
                >
                  <div className="flex items-center gap-3">
                    {cat.icon}
                    <span>{cat.name}</span>
                  </div>
                  <span className={styles.categoryCount}>{count}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <main className={styles.contentList}>
          {filteredSnippets.length === 0 ? (
            <div className={styles.noResult}>
              <Hash size={48} className="mx-auto mb-5 opacity-10" />
              <h3 className="text-xl font-bold text-slate-400">결과가 없습니다</h3>
              <p className="text-sm text-slate-400 mt-1">검색어나 카테고리를 확인해보세요.</p>
            </div>
          ) : (
            filteredSnippets.map(snip => (
              <article key={snip.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div>
                    <span className={styles.langBadge} style={getLangStyle(snip.language)}>
                      {snip.language}
                    </span>
                    <h3 className={styles.cardTitle + ' mt-3'}>{snip.title}</h3>
                  </div>
                  <button onClick={(e) => deleteSnippet(snip.id, e)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className={styles.codeBox}>
                  <button
                    onClick={() => handleCopy(snip.id, snip.content)}
                    className={styles.copyBtn}
                    title="클립보드로 복사"
                  >
                    {copiedId === snip.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                  <pre className={styles.codeContent}>
                    <code>{snip.content}</code>
                  </pre>
                </div>
              </article>
            ))
          )}
        </main>
      </div>

      <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
        <Plus size={28} />
      </button>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">아카이브 생성</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-all">
                <X size={24} />
              </button>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>제목 또는 핵심 키워드</label>
              <input
                className={styles.input}
                placeholder="예: Java 8 Stream API 패턴"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Category 선택</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.name}
                    onClick={() => setNewLang(cat.name)}
                    className={`px-5 py-2.5 rounded-2xl text-[13px] font-extrabold transition-all ${newLang === cat.name
                      ? 'bg-slate-900 text-white shadow-xl transform scale-105'
                      : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                      }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>상세 내용 및 코드</label>
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                placeholder="코드나 중요한 내용을 여기에 적어주세요..."
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
              />
            </div>

            <div className={styles.modalFooter}>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setIsModalOpen(false)}>취소</button>
              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={addSnippet}>아카이브에 저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
