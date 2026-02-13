"use client";

import React, { useState, useEffect } from 'react';
import styles from './salary.module.css';
import { Check, Info, HelpCircle } from 'lucide-react';

export default function SalaryCalculator() {
  const [salary, setSalary] = useState<number>(30000000);
  const [isMonthly, setIsMonthly] = useState<boolean>(false);
  const [isSeveranceIncluded, setIsSeveranceIncluded] = useState<boolean>(false);
  const [nonTaxable, setNonTaxable] = useState<number>(200000);
  const [dependents, setDependents] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [bonus, setBonus] = useState<number>(0);

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
    monthlyBonus: 0,
    npReduction: 0,
    eiReduction: 0,
    itReduction: 0,
    litReduction: 0,
  });

  useEffect(() => {
    let monthlyBase = 0;
    if (isMonthly) {
      monthlyBase = salary;
    } else {
      monthlyBase = Math.floor(isSeveranceIncluded ? salary / 13 : salary / 12);
    }

    const monthlyBonus = Math.floor(bonus / 12);
    const taxableIncome = Math.max(0, monthlyBase - nonTaxable);

    // 국민연금 (4.5%) - 2024 기준 본인부담금
    const npBase = Math.min(Math.max(taxableIncome, 370000), 6170000);
    const npOriginal = npBase * 0.045;
    let np = npOriginal;
    let npReduction = 0;
    if (isDurunuri && monthlyBase < 2700000) {
      np = npOriginal * 0.2; // 80% 지원
      npReduction = npOriginal - np;
    }

    // 건강보험 (3.545%) - 2024 기준
    const hi = monthlyBase * 0.03545;

    // 장기요양 (12.95% of hi)
    const ltc = hi * 0.1295;

    // 고용보험 (0.9%)
    const eiOriginal = taxableIncome * 0.009;
    let ei = eiOriginal;
    let eiReduction = 0;
    if (isDurunuri && monthlyBase < 2700000) {
      ei = eiOriginal * 0.2; // 80% 지원
      eiReduction = eiOriginal - ei;
    }

    // 소득세 (간이세액표 간략화된 로직)
    let itOriginal = 0;
    const annualTaxable = taxableIncome * 12 + bonus;
    if (annualTaxable > 14000000) {
      itOriginal = ((taxableIncome) * 0.025); // 간략화된 근사치
      if (dependents > 1) itOriginal = Math.max(0, itOriginal * (1 - (dependents - 1) * 0.15));
    } else {
      itOriginal = Math.max(0, (taxableIncome - 1000000) * 0.03);
    }

    let it = itOriginal;
    let itReduction = 0;
    if (isSmeTaxReduction) {
      it = itOriginal * 0.1;
      itReduction = Math.min(itOriginal - it, 2000000 / 12); // 연 200만원 한도
    }

    // 지방소득세
    const litOriginal = itOriginal * 0.1;
    const lit = it * 0.1;
    const litReduction = litOriginal - lit;

    const round = (val: number) => Math.floor(val / 10) * 10;
    const final = {
      np: round(np),
      hi: round(hi),
      ltc: round(ltc),
      ei: round(ei),
      it: round(it),
      lit: round(lit),
      npReduction: round(npReduction),
      eiReduction: round(eiReduction),
      itReduction: round(itReduction),
      litReduction: round(litReduction),
    };

    const totalDeductions = final.np + final.hi + final.ltc + final.ei + final.it + final.lit;
    const netPay = (monthlyBase + monthlyBonus) - totalDeductions;

    setResults({
      monthlyBase,
      taxableIncome,
      nationalPension: final.np,
      healthInsurance: final.hi,
      longTermCare: final.ltc,
      employmentInsurance: final.ei,
      incomeTax: final.it,
      localIncomeTax: final.lit,
      totalDeductions,
      netPay,
      monthlyBonus,
      npReduction: final.npReduction,
      eiReduction: final.eiReduction,
      itReduction: final.itReduction,
      litReduction: final.litReduction,
    });
  }, [salary, isMonthly, isSeveranceIncluded, nonTaxable, dependents, children, isSmeTaxReduction, isDurunuri, bonus]);

  const formatKrw = (val: number) => val.toLocaleString('ko-KR') + '원';

  const handlePriceChange = (value: string, setter: (n: number) => void) => {
    const num = Number(value.replace(/[^0-9]/g, ''));
    setter(num);
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainLayout}>
        {/* 입력 섹션 */}
        <section className={styles.inputSection}>
          <div className={styles.inputWrapper}>
            <label className={styles.fieldLabel}>{isMonthly ? '월 세전 급여' : '희망 연봉'}</label>
            <div className={styles.toggleGroup}>
              <button
                onClick={() => setIsMonthly(false)}
                className={`${styles.toggleBtn} ${!isMonthly ? styles.toggleBtnActive : ''}`}
              >연봉</button>
              <button
                onClick={() => setIsMonthly(true)}
                className={`${styles.toggleBtn} ${isMonthly ? styles.toggleBtnActive : ''}`}
              >월급</button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={salary === 0 ? '' : salary.toLocaleString()}
                onChange={(e) => handlePriceChange(e.target.value, setSalary)}
                className={styles.largeInput}
                placeholder="0"
              />
              <span className={styles.inputUnit}>원</span>
            </div>
          </div>

          {!isMonthly && (
            <div className={styles.smallInputGroup}>
              <label className={styles.fieldLabel}>퇴직금 방식</label>
              <div className={styles.toggleGroup}>
                <button
                  onClick={() => setIsSeveranceIncluded(false)}
                  className={`${styles.toggleBtn} ${!isSeveranceIncluded ? styles.toggleBtnActive : ''}`}
                >별도</button>
                <button
                  onClick={() => setIsSeveranceIncluded(true)}
                  className={`${styles.toggleBtn} ${isSeveranceIncluded ? styles.toggleBtnActive : ''}`}
                >포함</button>
              </div>
            </div>
          )}

          <div className={styles.gridInputs}>
            <div className={styles.smallInputGroup}>
              <div className="flex items-center gap-1 mb-2">
                <label className={styles.fieldLabel + ' !mb-0'}>연간 상여금</label>
                <ReductionTooltip text="연간 정기/부정기적으로 받는 상여 총액입니다. 12개월로 나누어 소득 수준에 반영되며, 실수령액 계산의 정확도를 높입니다." />
              </div>
              <input
                type="text"
                value={bonus === 0 ? '' : bonus.toLocaleString()}
                onChange={(e) => handlePriceChange(e.target.value, setBonus)}
                className={styles.baseInput}
                placeholder="0"
              />
            </div>
            <div className={styles.smallInputGroup}>
              <div className="flex items-center gap-1 mb-2">
                <label className={styles.fieldLabel + ' !mb-0'}>비과세액 (월)</label>
                <ReductionTooltip text="식대(20만원), 자가운전보조금(20만원), 육아수당(20만원) 등 세금이 부과되지 않는 급여입니다. 비과세가 높을수록 세금 부담이 줄어듭니다." />
              </div>
              <input
                type="text"
                value={nonTaxable === 0 ? '' : nonTaxable.toLocaleString()}
                onChange={(e) => handlePriceChange(e.target.value, setNonTaxable)}
                className={styles.baseInput}
                placeholder="0"
              />
            </div>
          </div>

          <div className={styles.gridInputs}>
            <div className={styles.smallInputGroup}>
              <div className="flex items-center gap-1 mb-2">
                <label className={styles.fieldLabel + ' !mb-0'}>부양가족수</label>
                <ReductionTooltip text="본인을 포함하여 생계를 같이 하는 가족 수입니다. 인원당 150만원의 기본공제가 적용되어 소득세 산정의 기준이 됩니다." />
              </div>
              <input
                type="number"
                value={dependents}
                onChange={(e) => setDependents(Number(e.target.value))}
                className={styles.baseInput}
              />
            </div>
            <div className={styles.smallInputGroup}>
              <div className="flex items-center gap-1 mb-2">
                <label className={styles.fieldLabel + ' !mb-0'}>자녀수 (8~20세)</label>
                <ReductionTooltip text="8세 이상 20세 이하 자녀 수입니다. 자녀 세액공제가 적용되어 소득세를 직접적으로 줄여주는 효과가 있습니다." />
              </div>
              <input
                type="number"
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                className={styles.baseInput}
              />
            </div>
          </div>

          <div className="mt-8">
            <label className={styles.fieldLabel}>추가 혜택 적용</label>
            <div
              className={`${styles.optionItem} ${isSmeTaxReduction ? styles.optionItemActive : ''}`}
              onClick={() => setIsSmeTaxReduction(!isSmeTaxReduction)}
            >
              <div className={styles.optionIcon}>
                {isSmeTaxReduction && <Check size={14} />}
              </div>
              <div className={styles.optionText}>
                <div className="flex items-center gap-1">
                  <span className={styles.optionTitle}>중소기업 취업자 소득세 감면</span>
                  <ReductionTooltip text="중소기업에 취업한 청년(만 15~34세)에게 5년간 소득세의 90%를 감면합니다. 그 외 60세 이상/장애인 등은 3년간 70% 감면되며, 연 최대 200만원 한도입니다." />
                </div>
                <span className={styles.optionSub}>청년 90% 감면 지원</span>
              </div>
            </div>
            <div
              className={`${styles.optionItem} ${isDurunuri ? styles.optionItemActive : ''}`}
              onClick={() => setIsDurunuri(!isDurunuri)}
            >
              <div className={styles.optionIcon}>
                {isDurunuri && <Check size={14} />}
              </div>
              <div className={styles.optionText}>
                <div className="flex items-center gap-1">
                  <span className={styles.optionTitle}>두루누리 사회보험료 지원</span>
                  <ReductionTooltip text="근로자 10인 미만 사업장의 월 급여 270만원 미만 신규 근로자에게 국민연금과 고용보험료의 80%를 국가가 지원합니다. (최대 36개월)" />
                </div>
                <span className={styles.optionSub}>보험료 80% 지원 (월 급여 270만원 미만)</span>
              </div>
            </div>
          </div>
        </section>

        {/* 결과 섹션 */}
        <section className={styles.resultSection}>
          <div className={styles.resultSticky}>
            <p className={styles.netPayLabel}>월 예상 실수령액</p>
            <h2 className={styles.netPayValue}>{formatKrw(results.netPay)}</h2>

            <div className={styles.summaryTable}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>월 세전 급여</span>
                <span className={styles.summaryValue}>{formatKrw(results.monthlyBase)}</span>
              </div>
              {results.monthlyBonus > 0 && (
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>월 상여금 (평균)</span>
                  <span className={styles.summaryValue}>+{formatKrw(results.monthlyBonus)}</span>
                </div>
              )}
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>공제액 합계</span>
                <span className={`${styles.summaryValue} !text-red-500`}>-{formatKrw(results.totalDeductions)}</span>
              </div>
            </div>

            <div className={styles.deductionList}>
              <DeductionRow
                label="국민연금"
                rate="4.5%"
                value={results.nationalPension}
                reduction={results.npReduction}
                tooltip="노후 대비를 위한 사회보험입니다. 과세급여의 4.5%를 부담하며, 2024년 기준 월 소득 상한 617만원, 하한 37만원이 적용됩니다."
              />
              <DeductionRow
                label="건강보험"
                rate="3.545%"
                value={results.healthInsurance}
                tooltip="보수월액의 3.545%를 부담합니다. 사용자(회사)와 근로자가 각각 50%씩 부담하여 질병/부상에 대비하는 보험입니다."
              />
              <DeductionRow
                label="장기요양"
                rate="12.95%"
                value={results.longTermCare}
                tooltip="노인장기요양보험 운영을 위한 비용으로, 건강보험료액의 12.95%가 부과됩니다."
              />
              <DeductionRow
                label="고용보험"
                rate="0.9%"
                value={results.employmentInsurance}
                reduction={results.eiReduction}
                tooltip="실업급여 및 고용지원을 위한 보험입니다. 비과세액을 제외한 월 급여의 0.9%를 부담합니다."
              />
              <DeductionRow
                label="소득세"
                rate="간이세액"
                value={results.incomeTax}
                reduction={results.itReduction}
                tooltip="급여액과 부양가족 수에 따라 근로소득 간이세액표를 기준으로 징수하며, 연말정산을 통해 최종 세액을 확정합니다."
              />
              <DeductionRow
                label="지방소득세"
                rate="10%"
                value={results.localIncomeTax}
                reduction={results.litReduction}
                tooltip="국가에 납부하는 소득세액의 10%를 거주하는 지방자치단체에 납부하는 세금입니다."
              />
            </div>

            <div className="mt-8 flex items-start gap-2 p-4 bg-white/50 rounded-xl text-[11px] text-gray-400 leading-relaxed border border-gray-100">
              <Info size={14} className="shrink-0 mt-0.5" />
              <p>본 계산 결과는 2024년 기준 요율을 바탕으로 산출된 예상치이며, 실제 월급날 수령액과는 개인별 상황에 따라 차이가 있을 수 있습니다.</p>
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

function DeductionRow({ label, rate, value, reduction, tooltip }: { label: string; rate: string; value: number; reduction?: number; tooltip?: string }) {
  return (
    <div className={styles.row}>
      <div className={styles.rowLabelGroup}>
        <div className={styles.rowLabel}>
          {label}
          {tooltip && <ReductionTooltip text={tooltip} />}
        </div>
        <span className={styles.rowRate}>{rate}</span>
      </div>
      <div className={styles.rowValueGroup}>
        <div className="flex items-center gap-2">
          {reduction && reduction > 0 ? (
            <>
              <span className={styles.originalAmount}>
                {(value + reduction).toLocaleString()}원
              </span>
              <span className={styles.slash}>/</span>
            </>
          ) : null}
          <span className={styles.rowValue}>{value.toLocaleString()}원</span>
        </div>
        {reduction && reduction > 0 ? (
          <span className={styles.reductionAmount}>-{reduction.toLocaleString()}원 절감</span>
        ) : null}
      </div>
    </div>
  );
}
