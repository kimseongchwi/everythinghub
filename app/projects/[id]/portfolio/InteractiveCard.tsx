
"use client";

import { useState, useEffect } from "react";

export default function InteractiveCard() {
  const [likes, setLikes] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLike = () => {
    setLikes((prev) => prev + 1);
  };

  if (!isClient) return null;

  return (
    <div className="mt-12 p-8 rounded-[2rem] border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all">
      <h3 className="text-xl font-bold mb-2 text-gray-800">프로젝트 상호작용</h3>
      <p className="text-gray-500 mb-6 text-sm">
        이 섹션은 클라이언트 사이드 스크립트로 동작합니다. 버튼을 눌러 좋아요를 표시해보세요.
      </p>

      <div className="flex items-center gap-4">
        <button
          onClick={handleLike}
          className="px-6 py-2.5 bg-gray-900 text-white hover:bg-gray-800 rounded-xl font-semibold transition-all active:scale-95 flex items-center gap-2"
        >
          <span>❤️</span> 좋아요
        </button>
        <span className="text-2xl font-black text-blue-600">{likes}</span>
      </div>
    </div>
  );
}
