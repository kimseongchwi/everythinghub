
"use client";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none bg-[#f1f5f9]">
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative">
          {/* 심플한 센터 로더 */}
          <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-blue-100 border-t-blue-600"></div>

          {/* 중앙 라이브 포인트 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
          </div>
        </div>

        {/* 아주 가벼운 로딩 문구 */}
        <span className="text-[10px] font-black text-blue-600/50 uppercase tracking-[0.2em] animate-pulse">
          Loading
        </span>
      </div>
    </div>
  );
}
