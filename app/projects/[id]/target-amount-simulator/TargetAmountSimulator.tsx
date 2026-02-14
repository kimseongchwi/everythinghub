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

interface FinancialEvent {
  id: string;
  name: string;
  amount: number; // positive for income, negative for expense
  yearsAfter: number;
}

export default function TargetAmountSimulator() {
  // Inputs
  const [targetAmount, setTargetAmount] = useState<number>(100000000);
  const [initialAmount, setInitialAmount] = useState<number>(10000000);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(3000000);
  const [monthlyExpense, setMonthlyExpense] = useState<number>(1500000);
  const [annualBonus, setAnnualBonus] = useState<number>(5000000);
  const [salaryGrowth, setSalaryGrowth] = useState<number>(3); // 3% growth
  const [inflationRate, setInflationRate] = useState<number>(2.5); // 2.5% inflation
  const [events, setEvents] = useState<FinancialEvent[]>([]);

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
    finalMonthlyIncome: 0,
    chartData: [] as { year: string; amount: number; target: number }[],
  });

  useEffect(() => {
    const monthlySaving = Math.max(0, monthlyIncome - monthlyExpense);
    const savingRate = monthlyIncome > 0 ? (monthlySaving / monthlyIncome) * 100 : 0;
    const remainingAmount = Math.max(0, targetAmount - initialAmount);

    // 1. Simulation & Chart Data
    let currentWealth = initialAmount;
    let totalMonths = 0;
    let exactMonthsNeeded = Infinity;
    let tempMonthlyIncome = monthlyIncome;
    let tempMonthlyExpense = monthlyExpense;
    const maxMonths = 1200;
    const chartData = [];

    // Initial data point
    chartData.push({
      year: '현재',
      amount: initialAmount,
      target: targetAmount
    });

    if (currentWealth >= targetAmount) {
      exactMonthsNeeded = 0;
    } else if (monthlySaving <= 0 && annualBonus <= 0) {
      exactMonthsNeeded = Infinity;
    } else {
      // Continue until target is reached AND we hit a 6-month marker (for visual crossing)
      while (totalMonths < maxMonths) {
        totalMonths++;

        // 1-1. Monthly saving
        const currentMonthlySaving = Math.max(0, tempMonthlyIncome - tempMonthlyExpense);
        currentWealth += currentMonthlySaving;

        // 1-2. Financial Events (One-time)
        events.forEach(event => {
          if (totalMonths === event.yearsAfter * 12) {
            currentWealth += event.amount;
          }
        });

        // 1-3. Annual occurrences (Salary increase, Bonus)
        if (totalMonths % 12 === 0) {
          currentWealth += annualBonus;
          tempMonthlyIncome *= (1 + salaryGrowth / 100);
          tempMonthlyExpense *= (1 + inflationRate / 100);
        }

        // Record exact achievement month
        if (currentWealth >= targetAmount && exactMonthsNeeded === Infinity) {
          exactMonthsNeeded = totalMonths;
        }

        // 1-4. Collect data for chart (every 6 months)
        if (totalMonths % 6 === 0) {
          const yearNum = totalMonths / 12;
          chartData.push({
            year: yearNum % 1 === 0 ? `${yearNum}년뒤` : `${Math.floor(yearNum)}.5년뒤`,
            amount: Math.floor(currentWealth),
            target: targetAmount
          });

          // Stop simulation after hitting a 6-month marker IF target was reached
          if (exactMonthsNeeded !== Infinity) break;
          // Security break for very long durations in chart
          if (yearNum >= 25) break;
        }
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
    const totalEventsInTime = events.reduce((acc, curr) => {
      if (curr.yearsAfter <= targetYears) return acc + curr.amount;
      return acc;
    }, 0);
    const gapToBridge = Math.max(0, targetAmount - initialAmount - totalBonusInTime - totalEventsInTime);
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
      finalMonthlyIncome: tempMonthlyIncome,
      chartData,
    });
  }, [targetAmount, initialAmount, monthlyIncome, monthlyExpense, annualBonus, salaryGrowth, inflationRate, targetYears, events]);

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
              />
            </div>
            <div className={styles.smallInputGroup}>
              <div className="flex items-center gap-1 mb-2">
                <label className={styles.fieldLabel + ' !mb-0'}>연봉 상승률 (연)</label>
                <ReductionTooltip text="매년 인상될 것으로 예상되는 급여 상승률입니다." />
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={salaryGrowth === 0 ? '' : salaryGrowth}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, '');
                    setSalaryGrowth(val === '' ? 0 : Number(val));
                  }}
                  className={styles.baseInput}
                />
                <span className="absolute right-0 bottom-3.5 text-gray-400 font-bold">%</span>
              </div>
            </div>
          </div>

          <div className={styles.gridInputs}>
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
            <div className={styles.smallInputGroup}>
              <div className="flex items-center gap-1 mb-2">
                <label className={styles.fieldLabel + ' !mb-0'}>물가 상승률 (연)</label>
                <ReductionTooltip text="예상되는 연간 물가 상승률입니다. 매년 지출액이 해당 비율만큼 상승한다고 가정합니다." />
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={inflationRate === 0 ? '' : inflationRate}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, '');
                    setInflationRate(val === '' ? 0 : Number(val));
                  }}
                  className={styles.baseInput}
                />
                <span className="absolute right-0 bottom-3.5 text-gray-400 font-bold">%</span>
              </div>
            </div>
          </div>

          {/* 이벤트 추가 섹션 */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                <span className="text-xl">📅</span> 목돈 이벤트 (지출/수입)
              </h3>
              <button
                onClick={() => setEvents([...events, { id: Date.now().toString(), name: '', amount: 0, yearsAfter: 3 }])}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all"
              >
                + 항목 추가
              </button>
            </div>

            <div className="space-y-4">
              {events.length === 0 ? (
                <div className="py-8 px-4 border-2 border-dashed border-slate-100 rounded-2xl text-center">
                  <p className="text-sm text-slate-400 font-medium tracking-tight">
                    중간에 결혼, 이사, 만기 적금 등<br />큰 돈이 나갈 일이 있다면 추가해 보세요!
                  </p>
                </div>
              ) : (
                events.map((event) => (
                  <div key={event.id} className="grid grid-cols-[1fr_1.2fr_0.8fr_40px] gap-3 items-end p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 mb-1 block">항목 명칭</label>
                      <input
                        type="text"
                        value={event.name}
                        placeholder="예: 결혼 자금"
                        onChange={(e) => {
                          const newEvents = events.map(ev => ev.id === event.id ? { ...ev, name: e.target.value } : ev);
                          setEvents(newEvents);
                        }}
                        className="w-full bg-white border-none rounded-lg px-2 py-1.5 text-sm font-bold shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 mb-1 block">금액 (지출은 -)</label>
                      <input
                        type="text"
                        value={event.amount === 0 ? '' : event.amount.toLocaleString()}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9-]/g, '');
                          const num = Number(val);
                          const newEvents = events.map(ev => ev.id === event.id ? { ...ev, amount: num } : ev);
                          setEvents(newEvents);
                        }}
                        className={`w-full bg-white border-none rounded-lg px-2 py-1.5 text-sm font-bold shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none ${event.amount < 0 ? 'text-rose-500' : 'text-emerald-600'}`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 mb-1 block">발생 시점</label>
                      <div className="flex items-center gap-1.5 bg-white rounded-lg px-2 py-1.5 shadow-sm">
                        <input
                          type="text"
                          value={event.yearsAfter === 0 ? '' : event.yearsAfter}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            const newEvents = events.map(ev => ev.id === event.id ? { ...ev, yearsAfter: val === '' ? 0 : Number(val) } : ev);
                            setEvents(newEvents);
                          }}
                          className="w-10 border-none text-sm font-bold p-0 focus:ring-0 outline-none text-center"
                        />
                        <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">년 뒤</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setEvents(events.filter(ev => ev.id !== event.id))}
                      className="h-9 w-9 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
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
                <span className={styles.summaryLabel}>목표 금액</span>
                <span className={styles.summaryValue}>{formatKrw(targetAmount)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>현재 자산</span>
                <span className={styles.summaryValue}>{formatKrw(initialAmount)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>
                  {mode === 'reach' ? '월 저축액' : '필요 월 저축액'}
                </span>
                <span className={styles.summaryValue}>
                  {mode === 'reach' ? formatKrw(results.monthlySaving) : formatKrw(results.requiredMonthlySaving)}
                </span>
              </div>
              {mode === 'reach' && results.monthsNeeded > 12 && (
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>최종 예상 월 실수령액</span>
                  <span className={styles.summaryValue}>{formatKrw(results.finalMonthlyIncome)}</span>
                </div>
              )}
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>
                  {mode === 'reach' ? '저축률' : '필요 저축률'}
                </span>
                <span className={styles.summaryValue}>
                  {mode === 'reach' ? results.savingRate.toFixed(1) : results.requiredSavingRate.toFixed(1)}%
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>목표까지 부족한 금액</span>
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
            <div className={styles.chartContainer}>
              <h4 className={styles.chartTitle}>자산 성장 추이</h4>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
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
                        if (value >= 100000000) return `${(value / 100000000).toFixed(1)}억`;
                        if (value >= 10000) return `${(value / 10000).toLocaleString()}만`;
                        return value;
                      }}
                      width={45}
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

            <div className="mt-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
              <h4 className="text-emerald-900 font-bold mb-2 flex items-center gap-2">
                <span>📊</span> 저축 분석 팁
              </h4>
              <div className="text-emerald-700 text-sm leading-relaxed space-y-2">
                <p>
                  {mode === 'reach' ? (
                    results.monthsNeeded !== Infinity ? (
                      `매년 ${salaryGrowth}%의 급여 인상과 ${inflationRate}%의 물가 상승(지출 증가)을 반영한 결과, ${results.achievementDate}에 목표에 도달합니다.`
                    ) : (
                      "급여 인상을 고려해도 지출이 너무 많습니다. 고정 지출을 줄이는 것이 급선무입니다."
                    )
                  ) : (
                    `${targetYears}년 뒤 달성을 위해 필요한 최소 저축액입니다. 연봉 상승률을 고려하면 실제로는 이보다 조금 더 여유롭게 달성 가능합니다.`
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
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
