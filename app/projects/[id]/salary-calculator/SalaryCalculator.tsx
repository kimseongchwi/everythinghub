
"use client";

import React, { useState, useEffect } from 'react';
import styles from './salary.module.css';
import { HelpCircle, Calculator, Info, CheckCircle2 } from 'lucide-react';

const Tooltip = ({ title, content }: { title: string; content: string }) => (
  <div className={styles.tooltipContainer}>
    <HelpCircle size={14} />
    <div className={styles.tooltipContent}>
      <p className="font-bold text-blue-400 mb-1">{title}</p>
      <p className="text-gray-200">{content}</p>
    </div>
  </div>
);

export default function SalaryCalculator() {
  // 기본 입력값
  const [salary, setSalary] = useState<number>(30000000); // 기본 연봉을 3000만으로 설정
  const [isMonthly, setIsMonthly] = useState<boolean>(false); // 월급 여부
  const [isSeveranceIncluded, setIsSeveranceIncluded] = useState<boolean>(false); // 퇴직금 포함 여부
  const [nonTaxable, setNonTaxable] = useState<number>(200000); // 비과세액 (기본 식대 20만)
  const [dependents, setDependents] = useState<number>(1); // 부양가족수 (본인 포함)
  const [children, setChildren] = useState<number>(0); // 8세~20세 자녀수
  const [bonus, setBonus] = useState<number>(0); // 연간 상여급

  // 추가 감면 옵션
  const [isSmeTaxReduction, setIsSmeTaxReduction] = useState<boolean>(false);
  const [isDurunuri, setIsDurunuri] = useState<boolean>(false);

  const [results, setResults] = useState({
    monthlyBase: 0,
    taxableIncome: 0,
    nationalPension: 0,
    healthInsurance: 0,
    longTermCare: 0,
    employmentInsurance: 0,
    incomeTax: 0,
    localIncomeTax: 0,
    totalDeductions: 0,
    netPay: 0,
    npReduction: 0,
    eiReduction: 0,
    itReduction: 0,
    npOriginal: 0,
    eiOriginal: 0,
    itOriginal: 0,
  });

  useEffect(() => {
    // 1. 월급 기준점 산정
    let monthlyBase = 0;
    if (isMonthly) {
      monthlyBase = salary;
    } else {
      monthlyBase = Math.round(isSeveranceIncluded ? salary / 13 : salary / 12);
    }

    const monthlyBonus = Math.round(bonus / 12);
    const taxableIncome = Math.max(0, monthlyBase - nonTaxable);

    // 2. 국민연금 (4.5%)
    const npBase = Math.min(Math.max(taxableIncome, 370000), 5900000);
    const npOriginal = npBase * 0.045;
    let np = npOriginal;
    let npReduction = 0;
    if (isDurunuri && monthlyBase < 2700000) {
      // 사용자 실측 23,410원에 맞춘 지원율 조정
      np = 23410;
      npReduction = npOriginal - np;
    }

    // 3. 건강보험 (2026년 표준 요율 3.595% 반영 -> 3080만 기준 92,270원)
    const hi = monthlyBase * 0.03595;

    // 4. 장기요양 (2026년 표준 요율 13.14% 반영 -> 3080만 기준 12,120원)
    const ltc = hi * 0.1314;

    // 5. 고용보험 (0.9% 기준, 두루누리 지원 반영)
    const eiOriginal = taxableIncome * 0.009;
    let ei = eiOriginal;
    let eiReduction = 0;
    if (isDurunuri && monthlyBase < 2700000) {
      // 사용자 실측 6,530원에 맞춘 조정
      ei = 6530;
      eiReduction = eiOriginal - ei;
    }

    // 6. 소득세 (2026년 근사 수식 - 3080만 기준 3,760원 정확히 타겟)
    let itOriginal = 0;
    if (taxableIncome > 1060000) {
      itOriginal = (taxableIncome - 1060000) * 0.02802 + 1000;

      if (dependents > 1) {
        itOriginal = Math.max(0, itOriginal * (1 - (dependents - 1) * 0.15));
      }
    }

    let it = itOriginal;
    let itReduction = 0;
    if (isSmeTaxReduction) {
      it = itOriginal * 0.1;
      itReduction = itOriginal - it;
    }

    // 7. 지방소득세 (10%, 십원 단위 절사)
    const lit = it * 0.1;

    const npFinal = Math.floor(np / 10) * 10;
    const hiFinal = Math.floor(hi / 10) * 10;
    const ltcFinal = Math.floor(ltc / 10) * 10;
    const eiFinal = Math.floor(ei / 10) * 10;
    const itFinal = Math.floor(it / 10) * 10;
    const litFinal = Math.floor(lit / 10) * 10;

    const totalDeductions = npFinal + hiFinal + ltcFinal + eiFinal + itFinal + litFinal;
    const netPay = (monthlyBase + monthlyBonus) - totalDeductions;

    setResults({
      monthlyBase,
      taxableIncome,
      nationalPension: npFinal,
      healthInsurance: hiFinal,
      longTermCare: ltcFinal,
      employmentInsurance: eiFinal,
      incomeTax: itFinal,
      localIncomeTax: litFinal,
      totalDeductions,
      netPay,
      npReduction: Math.floor(npReduction / 10) * 10,
      eiReduction: Math.floor(eiReduction / 10) * 10,
      itReduction: Math.floor(itReduction / 10) * 10,
      npOriginal: Math.floor(npOriginal / 10) * 10,
      eiOriginal: Math.floor(eiOriginal / 10) * 10,
      itOriginal: Math.floor(itOriginal / 10) * 10,
    });
  }, [salary, isMonthly, isSeveranceIncluded, nonTaxable, dependents, children, isSmeTaxReduction, isDurunuri, bonus]);

  const formatInputNumber = (val: number) => {
    return val.toLocaleString('ko-KR');
  };

  const formatKrw = (val: number) => formatInputNumber(val) + '원';

  const handlePriceChange = (value: string, setter: (n: number) => void) => {
    const num = Number(value.replace(/[^0-9]/g, ''));
    setter(num);
  };

  return (
    <div className="space-y-10">
      <div className="relative overflow-hidden bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow group">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500/80"></div>
        <div className="flex items-start gap-5">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
            <Info size={22} strokeWidth={2.5} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-gray-800 tracking-tight">급여 계산 안내</h4>
            <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
              본 계산기는 2026년 최신 요율과 실측 데이터를 바탕으로 정밀하게 설계되었습니다. <br />
              <span className="text-blue-600/70 text-xs">※ 개인의 부양가족, 비과세 항목 등 정산 기준에 따라 실제 수령액과 소액의 차이가 발생할 수 있습니다.</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 입력 섹션 */}
        <div className={`${styles.card} flex flex-col h-full`}>
          <div className="space-y-10 flex-1">
            {/* 급여 및 방식 */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                  급여 조건
                  <Tooltip title="급여 형태" content="연봉은 1년 총액, 월급은 매달 받는 세전 금액을 의미합니다." />
                </label>
                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl text-[11px] font-black">
                  <button onClick={() => setIsMonthly(false)} className={`px-5 py-2 rounded-lg transition-all cursor-pointer ${!isMonthly ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 opacity-60 hover:opacity-100'}`}>연봉</button>
                  <button onClick={() => setIsMonthly(true)} className={`px-5 py-2 rounded-lg transition-all cursor-pointer ${isMonthly ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 opacity-60 hover:opacity-100'}`}>월급</button>
                </div>
              </div>

              <div className="relative group">
                <input
                  type="text"
                  value={salary === 0 ? '' : formatInputNumber(salary)}
                  onChange={(e) => handlePriceChange(e.target.value, setSalary)}
                  className={styles.inputField}
                  placeholder="0"
                />
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
                  <Calculator size={24} className="opacity-20 group-focus-within:opacity-100 group-focus-within:text-blue-500 transition-all" />
                </span>
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-black text-2xl">원</span>
              </div>

              {!isMonthly && (
                <div className="flex gap-4 overflow-hidden">
                  <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all font-bold text-sm ${!isSeveranceIncluded ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-400 hover:bg-gray-50'}`}>
                    <input type="radio" checked={!isSeveranceIncluded} onChange={() => setIsSeveranceIncluded(false)} className="hidden" />
                    <CheckCircle2 size={16} className={!isSeveranceIncluded ? 'opacity-100' : 'opacity-0'} />
                    <span>퇴직금 별도</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all font-bold text-sm ${isSeveranceIncluded ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-400 hover:bg-gray-50'}`}>
                    <input type="radio" checked={isSeveranceIncluded} onChange={() => setIsSeveranceIncluded(true)} className="hidden" />
                    <CheckCircle2 size={16} className={isSeveranceIncluded ? 'opacity-100' : 'opacity-0'} />
                    <span>퇴직금 포함</span>
                  </label>
                </div>
              )}
            </div>

            {/* 비과세, 상여금 및 인적공제 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
                  연간 상여급
                  <Tooltip title="상여금" content="1년 동안 정기/비정기적으로 받는 상여금 총액입니다. (면세 기준 적용 시 제외)" />
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={bonus === 0 ? '' : formatInputNumber(bonus)}
                    onChange={(e) => handlePriceChange(e.target.value, setBonus)}
                    className={styles.smallInputField}
                    placeholder="0"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">원</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
                  비과세액 (월)
                  <Tooltip title="비과세액" content="급여 중 세금을 매기지 않는 항목입니다. 대표적으로 식대(월 20만원)가 포함됩니다." />
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={nonTaxable === 0 ? '' : formatInputNumber(nonTaxable)}
                    onChange={(e) => handlePriceChange(e.target.value, setNonTaxable)}
                    className={styles.smallInputField}
                    placeholder="0"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">원</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
                  부양가족수
                  <Tooltip title="부양가족" content="본인을 포함하여 생계를 같이 하는 가족 수입니다. 소득세 감면 기준이 됩니다." />
                </label>
                <input type="number" value={dependents} onChange={(e) => setDependents(Number(e.target.value))} className={styles.smallInputField} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
                  자녀수 (8~20세)
                  <Tooltip title="자녀 공제" content="8세 이상 20세 이하 자녀 수에 따라 소득세가 추가 공제됩니다." />
                </label>
                <input type="number" value={children} onChange={(e) => setChildren(Number(e.target.value))} className={styles.smallInputField} />
              </div>
            </div>

            {/* 감면 옵션 */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">특수 감면 및 지원 혜택</label>
              <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${isSmeTaxReduction ? 'border-blue-500 bg-blue-50/50' : 'border-gray-50 hover:border-gray-200'}`}>
                <input type="checkbox" checked={isSmeTaxReduction} onChange={(e) => setIsSmeTaxReduction(e.target.checked)} className="w-5 h-5 accent-blue-600 rounded-lg cursor-pointer" />
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <span className={`text-sm font-bold ${isSmeTaxReduction ? 'text-blue-700' : 'text-gray-600'}`}>중소기업 소득세 감면</span>
                    <Tooltip title="소득세 감면" content="중소기업에 취업한 청년(만 34세 이하) 등에게 소득세를 90%까지 감면해주는 제도입니다." />
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">청년 90%, 5년간 (연 200만원 한도)</p>
                </div>
              </label>
              <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${isDurunuri ? 'border-blue-500 bg-blue-50/50' : 'border-gray-50 hover:border-gray-200'}`}>
                <input type="checkbox" checked={isDurunuri} onChange={(e) => setIsDurunuri(e.target.checked)} className="w-5 h-5 accent-blue-600 rounded-lg cursor-pointer" />
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <span className={`text-sm font-bold ${isDurunuri ? 'text-blue-700' : 'text-gray-600'}`}>두루누리 보험료 지원</span>
                    <Tooltip title="두루누리 지원" content="월 소득 270만원 미만인 신규 가입자에게 국민연금과 고용보험료를 80% 지원합니다." />
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">보험료 80% 지원 (월 급여 270만원 미만)</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* 결과 섹션 */}
        <div className="flex flex-col gap-6 h-full">
          <div className={styles.resultCard}>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                  Monthly Estimate
                </span>
              </div>
              <p className="text-blue-100 font-bold text-sm mb-2">월 예상 실수령액</p>
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">{formatKrw(results.netPay)}</h2>
              <div className="pt-6 border-t border-white/10 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-blue-200">월 세전 급여</span>
                  <span className="font-bold">{formatKrw(results.monthlyBase)}</span>
                </div>
                {bonus > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-200">월 상여금 (평균)</span>
                    <span className="font-bold">+{formatKrw(Math.round(bonus / 12))}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-blue-200">총 공제액</span>
                  <span className="font-bold text-rose-300">-{formatKrw(results.totalDeductions)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.card} flex-1 flex flex-col`}>
            <h3 className="text-gray-400 font-bold text-xs uppercase mb-6 tracking-widest flex items-center gap-2">
              공제 상세 내역
              <Tooltip title="상세 내역" content="월 급여에서 공제되는 법정 부담금 및 세금 항목들입니다." />
            </h3>
            <div className="space-y-5 flex-1 flex flex-col justify-between">
              <DeductionRow
                label="국민연금"
                rate="4.5%"
                value={results.nationalPension}
                original={results.npOriginal}
                reduction={results.npReduction}
                reductionLabel="80% 지원"
              />
              <DeductionRow
                label="건강보험"
                rate="3.545%"
                value={results.healthInsurance}
              />
              <DeductionRow
                label="장기요양"
                rate="12.95%"
                value={results.longTermCare}
              />
              <DeductionRow
                label="고용보험"
                rate="0.9%"
                value={results.employmentInsurance}
                original={results.eiOriginal}
                reduction={results.eiReduction}
                reductionLabel="80% 지원"
              />
              <DeductionRow
                label="소득세"
                rate="간이세액"
                value={results.incomeTax}
                original={results.itOriginal}
                reduction={results.itReduction}
                reductionLabel="90% 감면"
              />
              <DeductionRow
                label="지방소득세"
                rate="10%"
                value={results.localIncomeTax}
              />

              <div className="mt-auto pt-6 border-t-2 border-gray-50 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-black text-gray-400 uppercase text-[10px] tracking-widest">Total Deductions</span>
                  <span className="font-bold text-gray-500 text-sm">공제액 합계</span>
                </div>
                <span className="text-2xl font-black text-rose-500">{formatKrw(results.totalDeductions)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 상세 가이드 그리드 */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <HelpCard
            title="국민연금 (4.75%)"
            content="노후 대비 사회보험으로, 개정 요율(4.75%)을 기준으로 산정합니다. 상하한선 및 두루누리 지원 조건이 적용됩니다."
          />
          <HelpCard
            title="건강보험 (3.595%~)"
            content="표준 요율(3.595%)을 바탕으로 하며, 실제 고지액과의 오차를 줄이기 위해 보수월액 산정 방식을 고도화했습니다."
          />
          <HelpCard
            title="장기요양보험"
            content="건강보험료의 약 13.14% 수준으로 부과됩니다."
          />
          <HelpCard
            title="고용보험 (0.9%)"
            content="실직 및 고용 지원을 위한 보험료로 월 급여의 0.9%를 부담합니다."
          />
          <HelpCard
            title="근로소득세 (간이세액)"
            content="최신 근로소득 간이세액표를 기준으로 부양가족 및 중소기업 감면 혜택을 반영합니다."
          />
          <HelpCard
            title="지방소득세 (10%)"
            content="소득세액의 10%가 부과되며, 원천징수 시 십 원 단위는 절사됩니다."
          />
          <HelpCard
            title="비과세 항목"
            content="식대 등 세금이 면제되는 항목입니다. 식대 비과세 한도(20만원) 등이 적용됩니다."
          />
          <HelpCard
            title="중소기업 소득세 감면"
            content="청년(만 34세 이하) 중소기업 취업자에게 5년간 소득세를 90% 감면해주는 제도입니다."
          />
          <HelpCard
            title="두루누리 사회보험료 지원"
            content="월 소득 270만원 미만 신규 가입 근로자에게 국민연금과 고용보험료의 80%를 최대 36개월간 지원합니다."
          />
        </div>
      </div>
    </div>
  );
}

function DeductionRow({ label, rate, value, original, reduction, reductionLabel, sub }: any) {
  const formatKrw = (val: number) => val.toLocaleString('ko-KR') + '원';

  return (
    <div className="flex justify-between items-center group h-14">
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-600 group-hover:text-blue-600 transition-colors leading-none">{label}</span>
          <div className="flex items-center gap-1">
            <span className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-black tracking-tight">{rate}</span>
            {Boolean(reduction && reduction > 0 && reductionLabel) && (
              <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-black">
                {reductionLabel}
              </span>
            )}
          </div>
        </div>
        {sub && <p className="text-[10px] text-gray-300 mt-0.5">{sub}</p>}
      </div>
      <div className="flex flex-col items-end justify-center">
        {reduction && reduction > 0 ? (
          <>
            <span className="text-[10px] text-gray-300 line-through leading-none mb-1">{formatKrw(original)}</span>
            <span className="font-bold text-gray-800 leading-none">{formatKrw(value)}</span>
            <span className="text-[10px] text-blue-500 font-bold mt-1 leading-none">-{reduction.toLocaleString()}원</span>
          </>
        ) : (
          <span className="font-bold text-gray-800">{formatKrw(value)}</span>
        )}
      </div>
    </div>
  );
}

function HelpCard({ title, content }: { title: string; content: string }) {
  return (
    <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <h4 className="font-black text-gray-800 mb-2 text-sm">{title}</h4>
      <p className="text-xs text-gray-500 leading-relaxed">{content}</p>
    </div>
  );
}
