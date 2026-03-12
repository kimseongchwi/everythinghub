'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, ShoppingCart, TrendingDown, Bell, ExternalLink, 
  Loader2, AlertCircle, Sparkles, Filter, ChevronRight, CheckCircle2, X,
  RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShoppingItem {
  title: string;
  link: string;
  image: string;
  lprice: string;
  hprice: string;
  mallName: string;
  productId: string;
  productType: string;
  brand: string;
  maker: string;
}

export default function PriceTracker() {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('전체');
  const [sortBy, setSortBy] = useState<'price' | 'score'>('price'); // 정렬 상태 추가
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const suggestRef = useRef<HTMLDivElement>(null);
  const isTyping = useRef(false);

  // ... (기존 useEffect 로직 생략되지 않도록 주의)
  // 자동완성 처리
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!isTyping.current) return;
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      setSuggestLoading(true);
      try {
        const response = await fetch(`/api/shopping/suggest?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setSuggestions(data.items || []);
        setIsSuggestOpen(true);
        setSelectedIndex(-1);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setSuggestLoading(false);
      }
    };
    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isSuggestOpen || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0) {
        e.preventDefault();
        handleSearch(suggestions[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsSuggestOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target as Node)) {
        setIsSuggestOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleReset = () => {
    setQuery('');
    setItems([]);
    setSuggestions([]);
    setSelectedBrand('전체');
    setSortBy('price');
    setError('');
    setIsSuggestOpen(false);
    isTyping.current = false;
  };

  const handleSearch = async (targetQuery: string) => {
    isTyping.current = false;
    setQuery(targetQuery);
    setIsSuggestOpen(false);
    setLoading(true);
    setError('');
    setSelectedBrand('전체');
    
    try {
      const response = await fetch(`/api/shopping?query=${encodeURIComponent(targetQuery)}&display=40`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '검색 중 오류가 발생했습니다.');
      setItems(data.items || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('ko-KR').format(parseInt(price)) + '원';
  };

  const removeTags = (text: string) => {
    return text.replace(/<b>/g, '').replace(/<\/b>/g, '').replace(/&quot;/g, '"');
  };

  const getPriceScore = (price: string, allItems: ShoppingItem[]) => {
    const prices = allItems.map(i => parseInt(i.lprice));
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const current = parseInt(price);
    if (prices.length < 2) return null;
    if (max === min) return 100;
    const score = 100 - Math.round(((current - min) / (max - min)) * 100);
    return score;
  };

  // 필터링 및 정렬 로직
  const getProcessedItems = () => {
    let result = [...items];
    if (selectedBrand !== '전체') {
      result = result.filter(i => i.brand === selectedBrand);
    }
    
    if (sortBy === 'score') {
      result.sort((a, b) => {
        const scoreA = getPriceScore(a.lprice, items) || 0;
        const scoreB = getPriceScore(b.lprice, items) || 0;
        return scoreB - scoreA;
      });
    } else {
      result.sort((a, b) => parseInt(a.lprice) - parseInt(b.lprice));
    }
    return result;
  };

  const filteredItems = getProcessedItems();
  const brands = ['전체', ...Array.from(new Set(items.map(i => i.brand).filter(b => b)))];

  const stats = items.length > 0 ? {
    min: Math.min(...items.map(i => parseInt(i.lprice))),
    max: Math.max(...items.map(i => parseInt(i.lprice))),
    avg: Math.round(items.reduce((acc, i) => acc + parseInt(i.lprice), 0) / items.length),
    mallCount: new Set(items.map(i => i.mallName)).size,
    bestMall: items.reduce((acc, i) => {
      acc[i.mallName] = (acc[i.mallName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  } : null;

  const topMall = stats ? Object.entries(stats.bestMall).sort((a, b) => b[1] - a[1])[0][0] : null;

  const quickTags = ['아이폰 16', '에어팟 프로 2', '갤럭시 S24', '맥북 M3', '플레이스테이션 5'];

  // 가이드 메시지 생성
  const getAdvice = (score: number) => {
    if (score >= 95) return { text: "역대급 찬물! 지금 사세요", color: "text-emerald-500", bg: "bg-emerald-50" };
    if (score >= 80) return { text: "만족스러운 가격대입니다", color: "text-blue-500", bg: "bg-blue-50" };
    if (score >= 50) return { text: "평이한 수준의 가격입니다", color: "text-gray-500", bg: "bg-gray-50" };
    return { text: "가격이 높네요. 조금 더 지켜보세요", color: "text-red-500", bg: "bg-red-50" };
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 검색 & 자동완성 */}
      <div className="space-y-4">
        <div className="relative" ref={suggestRef}>
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSearch(query); }} 
            className="relative group"
          >
            <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              isTyping.current = true; // 타이핑 시에만 자동완성 활성화
            }}
            onFocus={() => {
              if (query.trim().length >= 2) {
                isTyping.current = true;
                setIsSuggestOpen(true);
              }
            }}
              onKeyDown={handleKeyDown}
              placeholder="상품명을 입력하세요"
              className="w-full h-14 pl-12 pr-28 bg-white border border-gray-100 rounded-3xl shadow-sm text-[15px] font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
              <div className="relative flex items-center">
                <AnimatePresence mode="wait">
                  {query && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      type="button"
                      onClick={handleReset}
                      className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-all cursor-pointer mr-1"
                      title="전체 초기화"
                    >
                      <RefreshCcw className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="h-10 px-6 bg-gray-950 text-white rounded-2xl font-bold text-[13px] hover:bg-gray-800 disabled:bg-gray-200 disabled:cursor-not-allowed transition-all shadow-lg shadow-gray-950/10 cursor-pointer active:scale-95 ml-1 flex items-center justify-center min-w-[70px]"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '검색'}
              </button>
            </div>
          </form>

          {/* 자동완성 목록 */}
          <AnimatePresence>
            {isSuggestOpen && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-[115%] left-0 w-full bg-white border border-gray-100 rounded-[2rem] shadow-2xl z-[150] overflow-hidden py-3"
              >
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearch(s)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`
                      w-full px-5 py-3 text-left flex items-center gap-3 transition-colors group cursor-pointer
                      ${selectedIndex === idx ? 'bg-blue-50' : 'hover:bg-gray-50'}
                    `}
                  >
                    <Search className={`w-3.5 h-3.5 transition-colors ${selectedIndex === idx ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} />
                    <span className={`text-[14px] font-semibold transition-colors ${selectedIndex === idx ? 'text-blue-700' : 'text-gray-700 group-hover:text-gray-950'}`}>{s}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 퀵 태그 (검색 전 가이드) */}
        {!items.length && !loading && (
          <div className="flex flex-wrap items-center justify-center gap-2 px-4 text-center">
            <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest mr-2 block w-full mb-2">Trend Items</span>
            {quickTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleSearch(tag)}
                className="px-4 py-2 bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-600 rounded-2xl text-[12px] font-bold transition-all border border-transparent hover:border-blue-100 cursor-pointer active:scale-95"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 실시간 인사이트 대시보드 */}
      {items.length > 0 && stats && (
        <AnimatePresence>
          <div className="space-y-3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-950 text-white rounded-[2.5rem] shadow-2xl shadow-gray-950/20 relative overflow-hidden"
            >
              {/* 장식용 레이더 스피너 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 animate-pulse" />
              
              <div className="flex flex-col justify-center space-y-1 z-10 min-h-[60px]">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">실시간 최저가</p>
                <p className="text-xl font-black text-emerald-400 tracking-tighter">{formatPrice(stats.min.toString())}</p>
              </div>
              <div className="flex flex-col justify-center space-y-1 border-l border-white/10 pl-4 z-10 min-h-[60px]">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">평균 가격대</p>
                <p className="text-xl font-black text-white/90 tracking-tighter">{formatPrice(stats.avg.toString())}</p>
              </div>
              <div className="flex flex-col justify-center space-y-1 border-l border-white/10 pl-4 z-10 min-h-[60px]">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">비교 판매처</p>
                <p className="text-xl font-black text-white/90 tracking-tighter">{stats.mallCount}곳</p>
              </div>
              <div className="flex flex-col justify-center space-y-1 border-l border-white/10 pl-4 z-10 min-h-[60px]">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">최다 입점몰</p>
                <p className="text-[17px] md:text-xl font-black text-blue-400 leading-tight tracking-tight">{topMall}</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-50/50 rounded-2xl border border-blue-50"
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
              <p className="text-[13px] font-bold text-blue-900/80">
                <span className="font-black text-blue-600">마켓 리포트:</span> 현재 {query} 검색 결과 내 제품들의 평균가는 {formatPrice(stats.avg.toString())}이며, 상위권 모델들은 매우 강력한 경쟁력을 갖추고 있습니다.
              </p>
            </motion.div>
          </div>
        </AnimatePresence>
      )}

      {/* 필터 & 정렬 */}
      {items.length > 0 && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-1">
            <Filter className="w-4 h-4 text-gray-400 shrink-0 mr-1" />
            {brands.map(brand => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`
                  px-4 py-2 rounded-2xl text-[12px] font-bold tracking-tight whitespace-nowrap transition-all border cursor-pointer active:scale-95
                  ${selectedBrand === brand 
                    ? 'bg-gray-950 text-white border-gray-950 shadow-lg shadow-gray-950/10' 
                    : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                  }
                `}
              >
                {brand}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-gray-100/50 p-1.5 rounded-2xl shrink-0 border border-gray-100">
            <button
              onClick={() => setSortBy('price')}
              className={`px-4 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${sortBy === 'price' ? 'bg-white text-gray-950 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
            >
              낮은가격순
            </button>
            <button
              onClick={() => setSortBy('score')}
              className={`px-4 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${sortBy === 'score' ? 'bg-white text-blue-600 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
            >
              가성비순
            </button>
          </div>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-3xl flex gap-3 text-red-600">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-[13px] font-medium">{error}</p>
        </div>
      )}

      {/* 결과 리스트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const score = getPriceScore(item.lprice, items);
          const advice = score !== null ? getAdvice(score) : null;
          const isBest = score && score >= 95;

          return (
            <motion.div 
              layout
              key={item.productId} 
              className={`
                bg-white border rounded-[2rem] p-4 flex gap-4 transition-all group relative overflow-hidden active:scale-[0.98]
                ${isBest 
                  ? 'border-emerald-200 shadow-xl shadow-emerald-500/10' 
                  : 'border-gray-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5'
                }
              `}
            >
              {isBest && (
                <div className="absolute top-0 right-0 px-4 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-bl-2xl z-20 shadow-sm">
                  CROWN CHOICE
                </div>
              )}

              <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-2xl bg-gray-50 overflow-hidden relative border border-gray-50 p-2">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="flex flex-col justify-between flex-grow py-1">
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none mb-1">{item.mallName}</span>
                      {advice && (
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md ${advice.bg} ${advice.color} w-fit`}>
                          <Sparkles className="w-3 h-3" />
                          <span className="text-[10px] font-black">RADAR ADVICE: {advice.text}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 leading-tight text-[144x] sm:text-[15px] line-clamp-2 pr-4 mt-1 tracking-tight">
                    {removeTags(item.title)}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] text-gray-400 font-bold">{item.brand || 'No Brand'}</p>
                    <ChevronRight className="w-3 h-3 text-gray-200" />
                    <p className="text-[11px] text-gray-400 font-bold">{item.maker || 'Etc'}</p>
                  </div>
                </div>

                <div className="flex items-end justify-between mt-auto">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-gray-950 tracking-tighter">{formatPrice(item.lprice)}</span>
                  </div>

                  <div className="flex gap-1.5 pointer-events-auto relative z-10">
                    <button 
                      onClick={(e) => { e.preventDefault(); alert('추적 기능 커밍쑨!'); }}
                      className="w-9 h-9 flex items-center justify-center bg-gray-50 text-gray-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent shadow-sm cursor-pointer active:scale-95"
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`
                        w-9 h-9 flex items-center justify-center rounded-xl transition-all shadow-lg cursor-pointer active:scale-95
                        ${isBest ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' : 'bg-gray-950 hover:bg-gray-800 shadow-gray-950/20'}
                        text-white
                      `}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {score !== null && (
                  <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-50">
                    <div className="absolute bottom-3 left-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
                      <TrendingDown className={`w-3 h-3 ${score > 80 ? 'text-emerald-500' : 'text-blue-500'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-tighter ${score > 80 ? 'text-emerald-600' : 'text-blue-600'}`}>
                        가성비 점수 {score}점
                      </span>
                    </div>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      className={`h-full transition-colors ${score > 80 ? 'bg-emerald-400' : 'bg-blue-400'}`}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {loading && (
        <div className="py-20 text-center relative overflow-hidden rounded-[3rem] bg-gray-50 border border-gray-100">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute inset-0 border-2 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            />
            <div className="absolute inset-2 border border-blue-100 rounded-full animate-ping" />
            <Loader2 className="w-8 h-8 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
          </div>
          <p className="text-lg font-black text-gray-950 tracking-tighter uppercase italic">Detecting Market Price...</p>
          <p className="text-[13px] text-gray-400 font-bold mt-1">전국 쇼핑몰의 최신 데이터를 레이더로 스캔하고 있습니다.</p>
        </div>
      )}

      {!loading && items.length === 0 && !error && (
        <div className="text-center py-32 border-2 border-dashed border-gray-100 rounded-[3rem]">
          <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-gray-200">
            <Search className="w-8 h-8 animate-pulse" />
          </div>
          <p className="font-black text-gray-400 tracking-tighter text-lg uppercase">Radar Idle Mode</p>
          <p className="text-[13px] text-gray-500 font-bold mt-1 max-w-xs mx-auto">찾고 싶은 상품을 검색하면 반경 전체의 가격대를 스캔하여 구매 인사이트를 출력합니다.</p>
        </div>
      )}
    </div>
  );
}
