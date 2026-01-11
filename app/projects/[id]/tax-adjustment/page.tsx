"use client";

import React, { useState } from 'react';
import styles from './tax.module.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function TaxAdjustmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "1234") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("비밀번호가 올바르지 않습니다.");
      setPassword("");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.passwordWrapper}>
          <motion.div
            className={styles.passwordCard}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className={styles.iconCircle}>
              🔒
            </div>
            <h2 className={styles.title}>보안 접근</h2>
            <p className={styles.description}>
              '우리집 연말정산 방법' 내용을 확인하시려면<br />
              비밀번호를 입력해주세요.
            </p>
            <form onSubmit={handlePasswordSubmit}>
              <div className={styles.inputGroup}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.passwordInput}
                  placeholder="••••"
                  autoFocus
                />
                {error && <p className={styles.errorText}>{error}</p>}
              </div>
              <button type="submit" className={styles.submitButton}>
                입장하기
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className="max-w-4xl mx-auto">
        <header className={styles.contentHeader}>
          <motion.span
            className={styles.badge}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            FAMILY GUIDE
          </motion.span>
          <motion.h1
            className={styles.mainTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            우리집 연말정산 방법
          </motion.h1>
          <motion.p
            className={styles.mainDescription}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            절세의 핵심! 우리 가족 상황에 맞는 최적의 정산 전략을 확인하세요.
          </motion.p>
        </header>

        <section className={styles.grid}>
          <motion.div
            className={styles.card}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className={styles.cardIcon}>💰</div>
            <h3 className={styles.cardTitle}>인적 공제 최적화</h3>
            <p className={styles.cardText}>
              소득이 높은 배우자에게 부양가족 공제를 몰아주는 것이 기본이지만,
              의료비 등은 예외일 수 있으니 주의하세요.
            </p>
          </motion.div>
          <motion.div
            className={styles.card}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className={styles.cardIcon}>💳</div>
            <h3 className={styles.cardTitle}>신용카드 vs 체크카드</h3>
            <p className={styles.cardText}>
              총 급여의 25%까지는 혜택 좋은 신용카드를,
              그 이상부터는 공제율이 높은 체크카드와 현금영수증을 사용하세요.
            </p>
          </motion.div>
        </section>

        <motion.section
          className={styles.section}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className={styles.sectionTitle}>체크리스트</h2>
          <div className={styles.list}>
            <div className={styles.listItem}>
              <span className={styles.listBullet}>✓</span>
              <div className={styles.listContent}>
                <h4>연금저축 및 IRP 납입</h4>
                <p>연간 최대 900만원(연금저축 600만원 한도)까지 세액공제 혜택을 챙기세요.</p>
              </div>
            </div>
            <div className={styles.listItem}>
              <span className={styles.listBullet}>✓</span>
              <div className={styles.listContent}>
                <h4>주택마련 저축</h4>
                <p>무주택 세대주라면 주택청약종합저축 납입액의 40%를 소득공제 받을 수 있습니다.</p>
              </div>
            </div>
            <div className={styles.listItem}>
              <span className={styles.listBullet}>✓</span>
              <div className={styles.listContent}>
                <h4>기타 증빙서류 확보</h4>
                <p>안경/콘택트렌즈 구입비, 교복 구입비, 기부금 등 자동 수집되지 않는 내역을 챙기세요.</p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
