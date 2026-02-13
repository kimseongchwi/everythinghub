
"use client";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none bg-white/80 backdrop-blur-sm">
      <div className="relative">
        {/* 심플하고 프리미엄한 원형 로더 */}
        <div className="h-10 w-10 animate-spin rounded-full border-[2.5px] border-gray-100 border-t-blue-600"></div>
      </div>
    </div>
  );
}
