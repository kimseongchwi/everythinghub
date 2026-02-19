"use client";

import React, { useState, useEffect } from 'react';
import styles from './target.module.css';
import { HelpCircle, Target, TrendingUp, Calendar, ArrowRightLeft, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

export default function TargetAmountSimulator() {
  const thisYear = new Date().getFullYear();
  // Inputs
  const [targetAmount, setTargetAmount] = useState<number>(100000000);
  const [initialAmount, setInitialAmount] = useState<number>(10000000);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(2500000);
  const [monthlyExpense, setMonthlyExpense] = useState<number>(1000000);
  const [annualBonus, setAnnualBonus] = useState<number>(0);

  // Reverse Mode Inputs
  const [mode, setMode] = useState<'reach' | 'reverse'>('reach');
  const [targetYears, setTargetYears] = useState<number>(5);
  const [selectedYearIndex, setSelectedYearIndex] = useState<number>(0);

  const [results, setResults] = useState({
    monthlySaving: 0,
    savingRate: 0,
    monthsNeeded: 0,
    yearsNeeded: 0,
    monthsRemaining: 0,
    achievementDate: '',
    requiredMonthlySaving: 0,
    requiredSavingRate: 0,
    progress: 0,
    remainingAmount: 0,
    chartData: [] as { x: number; label: string; amount: number; isGoal?: boolean }[],
    tableData: [] as { year: number; months: (number | null)[] }[],
  });

  useEffect(() => {
    const monthlySaving = Math.max(0, monthlyIncome - monthlyExpense);
    const savingRate = monthlyIncome > 0 ? (monthlySaving / monthlyIncome) * 100 : 0;
    const remainingAmount = Math.max(0, targetAmount - initialAmount);

    let currentWealth = initialAmount;
    let totalMonths = 0;
    let exactMonthsNeeded = Infinity;

    const maxYears = 30;
    const maxMonths = maxYears * 12;
    const chartData: { x: number; label: string; amount: number; isGoal?: boolean }[] = [];
    const tableData: { year: number; months: (number | null)[] }[] = [];
    const currentMonthIdx = new Date().getMonth();

    const getYearRow = (yearNum: number) => {
      let row = tableData.find(r => r.year === yearNum);
      if (!row) {
        row = { year: yearNum, months: new Array(12).fill(null) };
        tableData.push(row);
      }
      return row;
    };

    getYearRow(thisYear).months[currentMonthIdx] = initialAmount;

    // 시작 지점 (예: 2026.2)
    chartData.push({
      x: 0,
      label: `${thisYear}.${currentMonthIdx + 1}`,
      amount: initialAmount,
    });

    if (currentWealth >= targetAmount) {
      exactMonthsNeeded = 0;
      chartData[0].isGoal = true;
    } else if (monthlySaving <= 0 && annualBonus <= 0) {
      exactMonthsNeeded = Infinity;
    } else {
      while (totalMonths < maxMonths) {
        totalMonths++;
        currentWealth += monthlySaving;

        if (totalMonths % 12 === 0) {
          currentWealth += annualBonus;
        }

        const absoluteMonth = currentMonthIdx + totalMonths;
        const simYear = thisYear + Math.floor(absoluteMonth / 12);
        const simMonth = (absoluteMonth % 12) + 1;

        // 표 데이터 기록
        const yearOffsetFromStart = Math.floor(absoluteMonth / 12);
        const simMonthIdx = absoluteMonth % 12;
        if (yearOffsetFromStart < maxYears) {
          getYearRow(thisYear + yearOffsetFromStart).months[simMonthIdx] = Math.floor(currentWealth);
        }

        // 매년 1월 눈금용 데이터 (2027년 등)
        if (absoluteMonth % 12 === 0) {
          chartData.push({
            x: totalMonths,
            label: `${simYear}년`,
            amount: Math.floor(currentWealth),
          });
        }

        // 목표 달성 시점 (예: 2031.2) - 데이터만 보관하고 X축 ticks에서는 제외
        if (currentWealth >= targetAmount && exactMonthsNeeded === Infinity) {
          exactMonthsNeeded = totalMonths;
          chartData.push({
            x: totalMonths,
            label: `${simYear}.${simMonth}`,
            amount: Math.floor(currentWealth),
            isGoal: true
          });
          break;
        }
      }
    }

    const monthsNeeded = exactMonthsNeeded;
    let achievementDate = '';
    if (monthsNeeded !== Infinity) {
      const date = new Date();
      date.setMonth(date.getMonth() + monthsNeeded);
      achievementDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
    }

    const totalBonusInTime = annualBonus * targetYears;
    const gapToBridge = Math.max(0, targetAmount - initialAmount - totalBonusInTime);
    const requiredMonthlySaving = gapToBridge / (targetYears * 12);
    const requiredSavingRate = monthlyIncome > 0 ? (requiredMonthlySaving / monthlyIncome) * 100 : 0;
    const progress = Math.min(100, (initialAmount / targetAmount) * 100);

    setResults({
      monthlySaving,
      savingRate,
      monthsNeeded,
      yearsNeeded: Math.floor(monthsNeeded / 12),
      monthsRemaining: monthsNeeded % 12,
      achievementDate,
      requiredMonthlySaving,
      requiredSavingRate,
      progress,
      remainingAmount,
      chartData,
      tableData,
    });
  }, [targetAmount, initialAmount, monthlyIncome, monthlyExpense, annualBonus, targetYears, thisYear]);

  const formatKrw = (val: number) => {
    if (val === Infinity) return '계산 불가';
    return Math.floor(val).toLocaleString('ko-KR') + '원';
  };

  const handlePriceChange = (value: string, setter: (n: number) => void) => {
    const num = Number(value.replace(/[^0-9]/g, ''));
    setter(num);
  };

  return (
    <div className={styles.container}>
      <div className="flex justify-center mb-12">
        <div className={styles.toggleGroup}>
          <button
            onClick={() => setMode('reach')}
            className={`${styles.toggleBtn} ${mode === 'reach' ? styles.toggleBtnActive : ''}`}
          >기본 달성 계산</button>
          <button
            onClick={() => setMode('reverse')}
            className={`${styles.toggleBtn} ${mode === 'reverse' ? styles.toggleBtnActive : ''}`}
          >목표 기간 역계산</button>
        </div>
      </div>

      <div className={styles.mainLayout}>
        <section className={styles.inputSection}>
          <div className={styles.inputWrapper}>
            <label className={styles.fieldLabel}>목표 금액</label>
            <div className="relative">
              <input
                type="text"
                value={targetAmount === 0 ? '' : targetAmount.toLocaleString()}
                onChange={(e) => handlePriceChange(e.target.value, setTargetAmount)}
                className={styles.largeInput}
                placeholder="0"
              />
              <span className={styles.inputUnit}>원</span>
            </div>
          </div>

          <div className={styles.gridInputs}>
            <div className={styles.smallInputGroup}>
              <div className="flex items-center gap-1 mb-2">
                <label className={styles.fieldLabel + ' !mb-0'}>현재 자산</label>
              </div>
              <input
                type="text"
                value={initialAmount === 0 ? '' : initialAmount.toLocaleString()}
                onChange={(e) => handlePriceChange(e.target.value, setInitialAmount)}
                className={styles.baseInput}
                placeholder="0"
              />
            </div>
            <div className={styles.smallInputGroup}>
              <div className="flex items-center gap-1 mb-2">
                <label className={styles.fieldLabel + ' !mb-0'}>연간 보너스(추가저축)</label>
              </div>
              <input
                type="text"
                value={annualBonus === 0 ? '' : annualBonus.toLocaleString()}
                onChange={(e) => handlePriceChange(e.target.value, setAnnualBonus)}
                className={styles.baseInput}
                placeholder="0"
              />
            </div>
          </div>

          <div className={styles.gridInputs}>
            <div className={styles.smallInputGroup}>
              <div className="flex items-center gap-1 mb-2">
                <label className={styles.fieldLabel + ' !mb-0'}>월 실수령액</label>
              </div>
              <input
                type="text"
                value={monthlyIncome === 0 ? '' : monthlyIncome.toLocaleString()}
                onChange={(e) => handlePriceChange(e.target.value, setMonthlyIncome)}
                className={styles.baseInput}
                placeholder="0"
              />
            </div>
            {mode === 'reach' ? (
              <div className={styles.smallInputGroup}>
                <div className="flex items-center gap-1 mb-2">
                  <label className={styles.fieldLabel + ' !mb-0'}>월 평균 지출</label>
                </div>
                <input
                  type="text"
                  value={monthlyExpense === 0 ? '' : monthlyExpense.toLocaleString()}
                  onChange={(e) => handlePriceChange(e.target.value, setMonthlyExpense)}
                  className={styles.baseInput}
                  placeholder="0"
                />
              </div>
            ) : (
              <div className={styles.smallInputGroup}>
                <div className="flex items-center gap-1 mb-2">
                  <label className={styles.fieldLabel + ' !mb-0'}>목표 달성 기간 (년)</label>
                </div>
                <input
                  type="text"
                  value={targetYears === 0 ? '' : targetYears}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setTargetYears(val === '' ? 0 : Number(val));
                  }}
                  className={styles.baseInput}
                />
              </div>
            )}
          </div>
        </section>

        <section className={styles.resultSection}>
          <div className={styles.resultSticky}>
            {mode === 'reach' ? (
              <>
                <p className={styles.netPayLabel}>목표 달성 예상 시점</p>
                {results.monthsNeeded === Infinity ? (
                  <h2 className={styles.netPayValue} style={{ fontSize: '2rem' }}>저축 계획이 필요해요</h2>
                ) : (
                  <>
                    <h2 className={styles.netPayValue}>
                      {results.achievementDate}
                    </h2>
                    <p className={styles.subValue}>
                      앞으로 {results.yearsNeeded > 0 ? `${results.yearsNeeded}년 ` : ''}
                      {results.monthsRemaining}개월 더 모으면 돼요
                    </p>
                  </>
                )}
              </>
            ) : (
              <>
                <p className={styles.netPayLabel}>달성을 위한 필요 월 저축액</p>
                <h2 className={styles.netPayValue}>{formatKrw(results.requiredMonthlySaving)}</h2>
                <p className={styles.subValue}>수입의 {results.requiredSavingRate.toFixed(1)}% 저축 필요</p>
              </>
            )}

            <div className={styles.summaryTable}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>목표 금액</span>
                <span className={styles.summaryValue}>{formatKrw(targetAmount)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>현재 자산</span>
                <span className={styles.summaryValue}>{formatKrw(initialAmount)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>{mode === 'reach' ? '월 저축액' : '필요 월 저축액'}</span>
                <span className={styles.summaryValue}>{mode === 'reach' ? formatKrw(results.monthlySaving) : formatKrw(results.requiredMonthlySaving)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>목표까지 부족한 금액</span>
                <span className={`${styles.summaryValue} !text-emerald-600`}>{formatKrw(results.remainingAmount)}</span>
              </div>
            </div>

            <div className={styles.progressContainer}>
              <div className={styles.progressLabel}>
                <span>현재 자산 달성률</span>
                <span>{results.progress.toFixed(1)}%</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${results.progress}%` }} />
              </div>
              <div className={styles.milestones}>
                <span>25%</span><span>50%</span><span>75%</span><span>100%</span>
              </div>
            </div>

            {results.chartData.length > 0 && (
              <div className={styles.chartContainer}>
                <h4 className={styles.chartTitle}>자산 성장 추이</h4>
                <div style={{ width: '100%', minHeight: 260 }}>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={results.chartData} margin={{ top: 10, right: 40, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAsset" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        dataKey="x"
                        type="number"
                        domain={[0, results.monthsNeeded + Math.max(1, Math.floor(results.monthsNeeded * 0.05))]}
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#94a3b8', fontWeight: 600 }}
                        dy={10}
                        tickFormatter={(val) => {
                          const point = results.chartData.find(p => p.x === val);
                          if (!point) return '';
                          return point.label;
                        }}
                        ticks={results.chartData.filter((p) => {
                          // 시작점(0)과 '년' 단위 데이터만 축 레이블로 표시
                          return p.x === 0 || p.label.includes('년');
                        }).map(p => p.x)}
                      />
                      <YAxis
                        fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontWeight: 600 }}
                        tickFormatter={(value) => {
                          if (value >= 100000000) return `${(value / 100000000).toFixed(value % 100000000 === 0 ? 0 : 1)}억`;
                          if (value >= 10000) return `${Math.floor(value / 10000).toLocaleString()}만`;
                          return value;
                        }}
                        width={50}
                      />
                      <Tooltip
                        cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className={styles.chartTooltip}>
                                <p className={styles.tooltipYear}>
                                  {data.isGoal ? "💰 목표 달성 예정" : data.label}
                                </p>
                                <p className={styles.tooltipAmount} style={{ color: data.isGoal ? '#10b981' : '#1e293b' }}>
                                  {data.isGoal ? `${data.label} 기준 | ` : ''}
                                  {data.amount?.toLocaleString()}원
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <ReferenceLine
                        y={targetAmount}
                        stroke="#cbd5e1"
                        strokeDasharray="5 5"
                        label={{
                          value: '목표액',
                          position: 'right',
                          fill: '#94a3b8',
                          fontSize: 10,
                          fontWeight: 700,
                          dx: 5
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#10b981"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorAsset)"
                        animationDuration={2000}
                        activeDot={{
                          r: 6,
                          fill: '#10b981',
                          strokeWidth: 2,
                          stroke: '#fff'
                        }}
                        // Goal dot always visible as a hollow circle
                        dot={(props: any) => {
                          const { cx, cy, payload } = props;
                          if (payload.isGoal) {
                            return (
                              <circle key="goal-dot" cx={cx} cy={cy} r={5} fill="white" stroke="#10b981" strokeWidth={2} />
                            );
                          }
                          return <></>;
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {results.tableData.length > 0 && (
        <section className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <div className="flex flex-col gap-1">
              <h3 className={styles.tableTitle}>월간 자산 성장 시뮬레이션</h3>
              <p className="text-xs font-bold text-slate-400">단위: 원 | 목표 달성 시 <span className="text-emerald-500">초록색</span>으로 표시됩니다.</p>
            </div>
          </div>

          <div className={styles.yearNav}>
            <button
              onClick={() => setSelectedYearIndex(prev => Math.max(0, prev - 1))}
              disabled={selectedYearIndex === 0}
              className={styles.navBtn}
            >
              <ChevronLeft size={20} />
            </button>
            <div className={styles.currentYearDisplay}>
              <Calendar size={16} className="text-emerald-500" />
              <span className={styles.yearText}>{results.tableData[selectedYearIndex]?.year}년 예상 자산</span>
            </div>
            <button
              onClick={() => setSelectedYearIndex(prev => Math.min(results.tableData.length - 1, prev + 1))}
              disabled={selectedYearIndex === results.tableData.length - 1}
              className={styles.navBtn}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className={styles.tableContainer}>
            <div className={styles.mobileGrid}>
              {results.tableData[selectedYearIndex]?.months.map((amount, monthIdx) => {
                const isReached = amount !== null && amount >= targetAmount;
                return (
                  <div key={monthIdx} className={`${styles.monthCard} ${isReached ? styles.cardReached : ''}`}>
                    <span className={styles.monthLabel}>{monthIdx + 1}월</span>
                    <span className={styles.monthValue}>
                      {amount !== null ? amount.toLocaleString() : '-'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

