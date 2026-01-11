
"use client";

import React, { useState, useEffect } from 'react';
import styles from './salary.module.css';

export default function SalaryCalculator() {
  // 기본 입력값
  const [salary, setSalary] = useState<number>(30000000); // 연봉/월급 금액
  const [isMonthly, setIsMonthly] = useState<boolean>(false); // 월급 여부
  const [isSeveranceIncluded, setIsSeveranceIncluded] = useState<boolean>(false); // 퇴직금 포함 여부
  const [nonTaxable, setNonTaxable] = useState<number>(200000); // 비과세액 (기본 식대 20만)
  const [dependents, setDependents] = useState<number>(1); // 부양가족수 (본인 포함)
  const [children, setChildren] = useState<number>(0); // 8세~20세 자녀수
  const [bonus, setBonus] = useState<number>(0); // 연간 상여급

  // 추가 감면 옵션 (기존 유지)
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
    // 1. 월급 기준점 산정 (반올림하여 소수점 제거)
    let monthlyBase = 0;
    if (isMonthly) {
      monthlyBase = salary;
    } else {
      // 연봉인 경우 퇴직금 포함 여부에 따라 12 또는 13으로 나눔
      monthlyBase = Math.round(isSeveranceIncluded ? salary / 13 : salary / 12);
    }

    // 상여급 월할분 (반올림하여 소수점 제거)
    const monthlyBonus = Math.round(bonus / 12);

    // 과세 금액 (상여급은 면세 항목으로 보아 과세 금액에서 제외)
    const taxableIncome = Math.max(0, monthlyBase - nonTaxable);

    // 2. 국민연금 (4.5%)
    const npBase = Math.min(Math.max(taxableIncome, 370000), 5900000);
    const npOriginal = npBase * 0.045;
    let np = npOriginal;
    let npReduction = 0;
    if (isDurunuri && monthlyBase < 2700000) {
      np = npOriginal * 0.2;
      npReduction = npOriginal - np;
    }

    // 3. 건강보험 (3.545%)
    const hiBase = Math.min(Math.max(taxableIncome, 279266), 110332300);
    const hi = hiBase * 0.03545;

    // 4. 장기요양 (건보료의 12.95%)
    const ltc = hi * 0.1295;

    // 5. 고용보험 (0.9%)
    const eiOriginal = taxableIncome * 0.009;
    let ei = eiOriginal;
    let eiReduction = 0;
    if (isDurunuri && monthlyBase < 2700000) {
      ei = eiOriginal * 0.2;
      eiReduction = eiOriginal - ei;
    }

    // 6. 소득세 (근로소득 간이세액표 근사 공식)
    let itOriginal = 0;
    if (taxableIncome > 1060000) {
      const familyFactor = dependents + (children > 0 ? children : 0);
      const baseTaxable = taxableIncome - (familyFactor * 150000);
      if (baseTaxable > 0) {
        itOriginal = baseTaxable * 0.05;
      }
    }

    let it = itOriginal;
    let itReduction = 0;
    if (isSmeTaxReduction) {
      it = itOriginal * 0.1;
      itReduction = itOriginal - it;
    }

    // 7. 지방소득세 (소득세의 10%)
    const lit = it * 0.1;

    // 공제액 합계 (원 단위 절사 전의 합계 계산 후 각각 절사하여 합산)
    const npFinal = Math.floor(np / 10) * 10;
    const hiFinal = Math.floor(hi / 10) * 10;
    const ltcFinal = Math.floor(ltc / 10) * 10;
    const eiFinal = Math.floor(ei / 10) * 10;
    const itFinal = Math.floor(it / 10) * 10;
    const litFinal = Math.floor(lit / 10) * 10;

    const totalDeductions = npFinal + hiFinal + ltcFinal + eiFinal + itFinal + litFinal;
    // 실수령액 = (월 급여 + 상여급 월할분) - 공제액 합계
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
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-2xl">
        <p className="text-sm text-blue-800 leading-relaxed">
          실수령 계산기는 회사와 계약된 연봉/월급에서 공제 금액을 계산하여 실제로 수령하실 금액을 확인해 드립니다.
          따라서 연봉 지급조건과 상황에 따라 약간의 오차가 발생할 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 입력 섹션 */}
        <div className={styles.card}>
          <div className="space-y-8">
            {/* 급여 및 방식 */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-sm font-black text-gray-500 uppercase tracking-wider">급여 조건</label>
                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl text-[11px] font-black">
                  <button onClick={() => setIsMonthly(false)} className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${!isMonthly ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}>연봉</button>
                  <button onClick={() => setIsMonthly(true)} className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${isMonthly ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}>월급</button>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={formatInputNumber(salary)}
                  onChange={(e) => handlePriceChange(e.target.value, setSalary)}
                  className={styles.inputField}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl">원</span>
              </div>

              {!isMonthly && (
                <div className="flex gap-4">
                  <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-50 transition-all font-bold text-sm">
                    <input type="radio" checked={!isSeveranceIncluded} onChange={() => setIsSeveranceIncluded(false)} className="accent-blue-600" />
                    <span className={!isSeveranceIncluded ? 'text-blue-600' : 'text-gray-400'}>퇴직금 별도</span>
                  </label>
                  <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-50 transition-all font-bold text-sm">
                    <input type="radio" checked={isSeveranceIncluded} onChange={() => setIsSeveranceIncluded(true)} className="accent-blue-600" />
                    <span className={isSeveranceIncluded ? 'text-blue-600' : 'text-gray-400'}>퇴직금 포함</span>
                  </label>
                </div>
              )}
            </div>

            {/* 비과세, 상여금 및 인적공제 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">상여급 (면세기준)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formatInputNumber(bonus)}
                    onChange={(e) => handlePriceChange(e.target.value, setBonus)}
                    className={styles.smallInputField}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">원</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">비과세액 (월)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formatInputNumber(nonTaxable)}
                    onChange={(e) => handlePriceChange(e.target.value, setNonTaxable)}
                    className={styles.smallInputField}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">원</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">부양가족수 (본인포함)</label>
                <input type="number" value={dependents} onChange={(e) => setDependents(Number(e.target.value))} className={styles.smallInputField} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">8세~20세 자녀수</label>
                <input type="number" value={children} onChange={(e) => setChildren(Number(e.target.value))} className={styles.smallInputField} />
              </div>
            </div>

            {/* 감면 옵션 */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">특수 감면/지원</label>
              <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:bg-blue-50 cursor-pointer transition-all group">
                <input type="checkbox" checked={isSmeTaxReduction} onChange={(e) => setIsSmeTaxReduction(e.target.checked)} className="w-4 h-4 accent-blue-600 cursor-pointer" />
                <span className="text-sm font-bold text-gray-600 group-hover:text-blue-600">중소기업 소득세 감면 (90%)</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:bg-blue-50 cursor-pointer transition-all group">
                <input type="checkbox" checked={isDurunuri} onChange={(e) => setIsDurunuri(e.target.checked)} className="w-4 h-4 accent-blue-600 cursor-pointer" />
                <span className="text-sm font-bold text-gray-600 group-hover:text-blue-600">두루누리 보험료 지원 (80%)</span>
              </label>
            </div>
          </div>
        </div>

        {/* 결과 섹션 */}
        <div className="space-y-6">
          <div className={styles.resultCard}>
            <div className="flex justify-between items-start mb-4">
              <p className="text-blue-100 font-bold text-xs uppercase tracking-widest">월 예상 실수령액</p>
            </div>
            <h2 className="text-5xl font-black mb-2">{formatKrw(results.netPay)}</h2>
            <p className="text-blue-200 text-xs">월 급여 세전(상여급 포함): {formatKrw(results.monthlyBase + Math.round(bonus / 12))}</p>
          </div>

          <div className={styles.card}>
            <h3 className="text-gray-400 font-bold text-xs uppercase mb-6 tracking-widest">공제 상세 내역</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-start py-3 border-b border-gray-50">
                <span className="text-sm font-medium text-gray-500 pt-1">국민연금 (4.5%)</span>
                <div className="flex flex-col items-end">
                  {results.npReduction > 0 ? (
                    <>
                      <span className="text-xs text-gray-300 line-through">{formatKrw(results.npOriginal)}</span>
                      <span className="font-bold text-gray-800">{formatKrw(results.nationalPension)}</span>
                      <span className="text-[10px] text-blue-500 font-bold">- {formatInputNumber(results.npReduction)} 원</span>
                    </>
                  ) : (
                    <span className="font-bold text-gray-800">{formatKrw(results.nationalPension)}</span>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm font-medium text-gray-500">건강보험 (3.545%)</span>
                <span className="font-bold text-gray-800">{formatKrw(results.healthInsurance)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm font-medium text-gray-500">장기요양 (건보료의 12.95%)</span>
                <span className="font-bold text-gray-800">{formatKrw(results.longTermCare)}</span>
              </div>
              <div className="flex justify-between items-start py-3 border-b border-gray-50">
                <span className="text-sm font-medium text-gray-500 pt-1">고용보험 (0.9%)</span>
                <div className="flex flex-col items-end">
                  {results.eiReduction > 0 ? (
                    <>
                      <span className="text-xs text-gray-300 line-through">{formatKrw(results.eiOriginal)}</span>
                      <span className="font-bold text-gray-800">{formatKrw(results.employmentInsurance)}</span>
                      <span className="text-[10px] text-blue-500 font-bold">- {formatInputNumber(results.eiReduction)} 원</span>
                    </>
                  ) : (
                    <span className="font-bold text-gray-800">{formatKrw(results.employmentInsurance)}</span>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-start py-3 border-b border-gray-50">
                <span className="text-sm font-medium text-gray-500 pt-1">소득세 (간이세액)</span>
                <div className="flex flex-col items-end">
                  {results.itReduction > 0 ? (
                    <>
                      <span className="text-xs text-gray-300 line-through">{formatKrw(results.itOriginal)}</span>
                      <span className="font-bold text-gray-800">{formatKrw(results.incomeTax)}</span>
                      <span className="text-[10px] text-blue-500 font-bold">- {formatInputNumber(results.itReduction)} 원</span>
                    </>
                  ) : (
                    <span className="font-bold text-gray-800">{formatKrw(results.incomeTax)}</span>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm font-medium text-gray-500">지방소득세 (10%)</span>
                <span className="font-bold text-gray-800">{formatKrw(results.localIncomeTax)}</span>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <span className="font-black text-gray-400 uppercase text-xs">공제액 합계</span>
                <span className="text-xl font-black text-rose-500">{formatKrw(results.totalDeductions)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 도움말 섹션 */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-gray-500">
        <div className="space-y-4">
          <div>
            <h4 className="font-black text-gray-800 mb-1">비과세액</h4>
            <p>월급에서 세금공제 하지 않는 금액 (식대 20만원 등 기본 적용)</p>
          </div>
          <div>
            <h4 className="font-black text-gray-800 mb-1">부양가족수</h4>
            <p>기본공제대상자(본인 포함) 수. 연 소득 100만원 이하 기준</p>
          </div>
          <div>
            <h4 className="font-black text-gray-800 mb-1">8세~20세 자녀</h4>
            <p>6세 이상 20세 이하 자녀 수에 따라 소득세 추가 공제</p>
          </div>
          <div>
            <h4 className="font-black text-gray-800 mb-1">중소기업 취업자 소득세 감면</h4>
            <p>중소기업 취업 청년(만 15~34세) 등에게 3~5년간 소득세의 70~90%를 감면해주는 제도입니다.</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="font-black text-gray-800 mb-1">퇴직금 포함 여부</h4>
            <p>포함 시 연봉을 13으로 나누어 월급 산정 (지급 조건에 따라 다름)</p>
          </div>
          <div>
            <h4 className="font-black text-gray-800 mb-1">보험료 상/하한선</h4>
            <p>국민연금(37만~590만), 건강보험(28만~1.1억) 적용</p>
          </div>
          <div>
            <h4 className="font-black text-gray-800 mb-1">두루누리 사회보험료 지원</h4>
            <p>월 소득 270만원 미만인 신규 가입 근로자의 국민연금/고용보험료 80%를 지원합니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
