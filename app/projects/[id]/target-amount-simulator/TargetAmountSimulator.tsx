"use client";

import React, { useState, useEffect } from 'react';
import styles from './target.module.css';
import { HelpCircle, Target, TrendingUp, Calendar, ArrowRightLeft, Trash2 } from 'lucide-react';
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
    chartData: [] as { year: string; amount: number; target: number }[],
    tableData: [] as { year: number; months: (number | null)[] }[],
  });


  useEffect(() => {
    const monthlySaving = Math.max(0, monthlyIncome - monthlyExpense);
    const savingRate = monthlyIncome > 0 ? (monthlySaving / monthlyIncome) * 100 : 0;
    const remainingAmount = Math.max(0, targetAmount - initialAmount);

    // 1. Simulation
    let currentWealth = initialAmount;
    let totalMonths = 0;
    let exactMonthsNeeded = Infinity;
    let tempMonthlyIncome = monthlyIncome;
    let tempMonthlyExpense = monthlyExpense;

    const maxYears = 30;
    const maxMonths = maxYears * 12;

    const chartData = [];
    const tableData: { year: number; months: (number | null)[] }[] = [];

    const currentMonthIdx = new Date().getMonth(); // 0-11

    // Initial data point for chart
    chartData.push({
      year: `${thisYear}.${currentMonthIdx + 1}`,
      amount: initialAmount,
      target: targetAmount
    });


    // Helper for table data
    const getYearRow = (yearNum: number) => {
      let row = tableData.find(r => r.year === yearNum);
      if (!row) {
        row = { year: yearNum, months: new Array(12).fill(null) };
        tableData.push(row);
      }
      return row;
    };

    // Store Month 0 (Current)
    getYearRow(thisYear).months[currentMonthIdx] = initialAmount;

    if (currentWealth >= targetAmount) {
      exactMonthsNeeded = 0;
    } else if (monthlySaving <= 0 && annualBonus <= 0) {
      exactMonthsNeeded = Infinity;
    } else {
      while (totalMonths < maxMonths) {
        totalMonths++;

        // 1-1. Monthly saving
        const currentMonthlySaving = Math.max(0, tempMonthlyIncome - tempMonthlyExpense);
        currentWealth += currentMonthlySaving;



        // 1-3. Annual occurrences (Bonus)
        if (totalMonths % 12 === 0) {
          currentWealth += annualBonus;
        }


        // Record exact achievement month
        if (currentWealth >= targetAmount && exactMonthsNeeded === Infinity) {
          exactMonthsNeeded = totalMonths;
        }

        // Record for Table
        const absoluteMonth = currentMonthIdx + totalMonths;
        const yearOffsetFromStart = Math.floor(absoluteMonth / 12);
        const simMonthIdx = absoluteMonth % 12;
        if (yearOffsetFromStart < maxYears) {
          getYearRow(thisYear + yearOffsetFromStart).months[simMonthIdx] = Math.floor(currentWealth);
        }


        // Record for Chart (Every 12 months for cleaner X-axis, or 6 months if period is short)
        const chartInterval = maxMonths <= 60 ? 6 : 12;
        if (totalMonths % chartInterval === 0 && totalMonths > 0) {
          const absMonth = currentMonthIdx + totalMonths;
          const simYear = thisYear + Math.floor(absMonth / 12);
          const simMonth = (absMonth % 12) + 1;

          const label = totalMonths % 12 === 0
            ? `${simYear}년`
            : `${simYear}.${simMonth}`;

          chartData.push({
            year: label,
            amount: Math.floor(currentWealth),
            target: targetAmount
          });
        }



        // Stop simulation if target reached and we've filled the current year's chart markers
        if (exactMonthsNeeded !== Infinity && totalMonths % 12 === 0) break;
      }
    }

    const monthsNeeded = exactMonthsNeeded;

    // 2. Achievement Date
    let achievementDate = '';
    if (monthsNeeded !== Infinity) {
      const date = new Date();
      date.setMonth(date.getMonth() + monthsNeeded);
      achievementDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
    }

    // 3. Reverse Calculation
    const totalBonusInTime = annualBonus * targetYears;
    const gapToBridge = Math.max(0, targetAmount - initialAmount - totalBonusInTime);

    const requiredMonthlySaving = gapToBridge / (targetYears * 12);
    const requiredSavingRate = monthlyIncome > 0 ? (requiredMonthlySaving / monthlyIncome) * 100 : 0;

    // 4. Progress
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
  }, [targetAmount, initialAmount, monthlyIncome, monthlyExpense, annualBonus, targetYears]);



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
      {/* 모드 전환 탭 */}
      <div className="flex justify-center mb-12">
        <div className={styles.toggleGroup}>
          <button
            onClick={() => setMode('reach')}
            className={`${styles.toggleBtn} ${mode === 'reach' ? styles.toggleBtnActive : ''}`}
          >
            기본 달성 계산
          </button>
          <button
            onClick={() => setMode('reverse')}
            className={`${styles.toggleBtn} ${mode === 'reverse' ? styles.toggleBtnActive : ''}`}
          >
            목표 기간 역계산
          </button>
        </div>
      </div>

      <div className={styles.mainLayout}>
        {/* 입력 섹션 */}
        <section className={styles.inputSection}>
          <div className={styles.inputWrapper}>
            <label className={styles.fieldLabel}>목표 금액</label>
            <div className="relative">
              <input
                type="text"
                value={targetAmount === 0 ? '' : targetAmount.toLocaleString()}
                onFocus={(e) => { if (targetAmount === 0) e.target.value = ''; }}
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
                <ReductionTooltip text="보유 현금, 예적금, 주식 등 즉시 활용 가능한 총 자산입니다." />
              </div>
              <input
                type="text"
                value={initialAmount === 0 ? '' : initialAmount.toLocaleString()}
                onFocus={(e) => { if (initialAmount === 0) e.target.value = ''; }}
                onChange={(e) => handlePriceChange(e.target.value, setInitialAmount)}
                className={styles.baseInput}
                placeholder="0"
              />
            </div>
            <div className={styles.smallInputGroup}>
              <div className="flex items-center gap-1 mb-2">
                <label className={styles.fieldLabel + ' !mb-0'}>연간 보너스(추가저축)</label>
                <ReductionTooltip text="성과급이나 명절 상여 등 매년 주기적으로 추가 저축이 가능한 금액입니다." />
              </div>
              <input
                type="text"
                value={annualBonus === 0 ? '' : annualBonus.toLocaleString()}
                onFocus={(e) => { if (annualBonus === 0) e.target.value = ''; }}
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
                onFocus={(e) => { if (monthlyIncome === 0) e.target.value = ''; }}
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
                  onFocus={(e) => { if (monthlyExpense === 0) e.target.value = ''; }}
                  onChange={(e) => handlePriceChange(e.target.value, setMonthlyExpense)}
                  className={styles.baseInput}
                  placeholder="0"
                />
              </div>
            ) : (
              <div className={styles.smallInputGroup}>
                <div className="flex items-center gap-1 mb-2">
                  <label className={styles.fieldLabel + ' !mb-0'}>목표 달성 기간 (년)</label>
                  <ReductionTooltip text="몇 년 안에 목표 금액을 달성하고 싶으신가요?" />
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

        {/* 결과 섹션 */}
        <section className={styles.resultSection}>
          <div className={styles.resultSticky}>
            {mode === 'reach' ? (
              <>
                <p className={styles.netPayLabel}>목표 달성 소요 기간</p>
                {results.monthsNeeded === Infinity ? (
                  <h2 className={styles.netPayValue} style={{ fontSize: '2.5rem' }}>저축액을 늘려보세요</h2>
                ) : (
                  <h2 className={styles.netPayValue}>
                    {results.yearsNeeded > 0 ? `${results.yearsNeeded}년 ` : ''}
                    {results.monthsRemaining}개월
                  </h2>
                )}
              </>
            ) : (
              <>
                <p className={styles.netPayLabel}>달성을 위한 필요 월 저축액</p>
                <h2 className={styles.netPayValue}>{formatKrw(results.requiredMonthlySaving)}</h2>
                <p className={styles.subValue}>
                  수입의 {results.requiredSavingRate.toFixed(1)}% 저축 필요
                </p>
              </>
            )}

            <div className={styles.summaryTable}>
              <div className={styles.summaryRow}>
                <div className="flex items-center gap-1">
                  <span className={styles.summaryLabel}>목표 금액</span>
                  <ReductionTooltip text="당신이 도달하고자 하는 최종 목표 자산입니다." />
                </div>
                <span className={styles.summaryValue}>{formatKrw(targetAmount)}</span>
              </div>
              <div className={styles.summaryRow}>
                <div className="flex items-center gap-1">
                  <span className={styles.summaryLabel}>현재 자산</span>
                  <ReductionTooltip text="현재 보유 중인 순자산(현금, 주식, 예적금 등)입니다." />
                </div>
                <span className={styles.summaryValue}>{formatKrw(initialAmount)}</span>
              </div>

              <div className={styles.summaryRow}>
                <div className="flex items-center gap-1">
                  <span className={styles.summaryLabel}>
                    {mode === 'reach' ? '월 저축액' : '필요 월 저축액'}
                  </span>
                  <ReductionTooltip text={mode === 'reach' ? "현재 수입과 지출을 기반으로 매달 저축 가능한 금액입니다." : "설정한 기간 내에 목표를 달성하기 위해 매달 저축해야 하는 최소 금액입니다."} />
                </div>
                <span className={styles.summaryValue}>
                  {mode === 'reach' ? formatKrw(results.monthlySaving) : formatKrw(results.requiredMonthlySaving)}
                </span>
              </div>



              <div className={styles.summaryRow}>
                <div className="flex items-center gap-1">
                  <span className={styles.summaryLabel}>
                    {mode === 'reach' ? '저축률' : '필요 저축률'}
                  </span>
                  <ReductionTooltip text="월 실수령액 대비 저축액이 차지하는 비중입니다." />
                </div>
                <span className={styles.summaryValue}>
                  {mode === 'reach' ? results.savingRate.toFixed(1) : results.requiredSavingRate.toFixed(1)}%
                </span>
              </div>
              <div className={styles.summaryRow}>
                <div className="flex items-center gap-1">
                  <span className={styles.summaryLabel}>목표까지 부족한 금액</span>
                  <ReductionTooltip text="현재 자산에서 목표 금액까지 도달하기 위해 더 모아야 하는 순수 금액입니다." />
                </div>
                <span className={`${styles.summaryValue} !text-emerald-600`}>{formatKrw(results.remainingAmount)}</span>
              </div>

            </div>

            {/* 마일스톤 프로그레스 */}
            <div className={styles.progressContainer}>
              <div className={styles.progressLabel}>
                <span>현재 자산 달성률</span>
                <span>{results.progress.toFixed(1)}%</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${results.progress}%` }}
                />
              </div>
              <div className={styles.milestones}>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>

            {/* 자산 성장 차트 */}
            {results.chartData.length > 0 && (
              <div className={styles.chartContainer}>
                <h4 className={styles.chartTitle}>자산 성장 추이</h4>
                <div style={{ width: '100%', minHeight: 260 }}>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart
                      data={results.chartData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorAsset" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        dataKey="year"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#94a3b8', fontWeight: 600 }}
                        dy={10}
                      />
                      <YAxis
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#94a3b8', fontWeight: 600 }}
                        tickFormatter={(value) => {
                          if (value >= 100000000) return `${(value / 100000000).toFixed(value % 100000000 === 0 ? 0 : 1)}억`;
                          if (value >= 10000) return `${(value / 10000).toLocaleString()}만`;
                          return value;
                        }}
                        width={50}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className={styles.chartTooltip}>
                                <p className={styles.tooltipYear}>{payload[0].payload.year}</p>
                                <p className={styles.tooltipAmount}>
                                  {payload[0].value?.toLocaleString()}원
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
                          value: '목표',
                          position: 'right',
                          fill: '#94a3b8',
                          fontSize: 10,
                          fontWeight: 700
                        }}
                      />
                      <Area
                        type="linear"
                        dataKey="amount"
                        stroke="#10b981"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorAsset)"
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}



          </div>
        </section>
      </div>

      {/* 월간 자산 성장 테이블 */}
      {results.tableData.length > 0 && (
        <section className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <h3 className={styles.tableTitle}>월간 자산 성장 시뮬레이션</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#f0fdf4] border border-emerald-100 rounded-sm"></div>
                <span className="text-[10px] font-bold text-slate-400">목표 달성</span>
              </div>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.assetTable}>
              <thead>
                <tr>
                  <th>구분</th>
                  {Array.from({ length: 12 }, (_, i) => (
                    <th key={i}>{i + 1}월</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.tableData.map((row) => (
                  <tr key={row.year}>
                    <td>{row.year === thisYear ? `${row.year}년` : `${row.year}년`}</td>
                    {row.months.map((amount, monthIdx) => {
                      const isReached = amount !== null && amount >= targetAmount;

                      return (
                        <td
                          key={monthIdx}
                          className={isReached ? styles.cellReached : ''}
                        >
                          {amount !== null ? `${amount.toLocaleString()}원` : '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

    </div>


  );
}

function ReductionTooltip({ text }: { text: string }) {
  return (
    <div className={styles.tooltipContainer}>
      <HelpCircle size={12} className={styles.helpIcon} />
      <div className={styles.tooltipText}>{text}</div>
    </div>
  );
}
