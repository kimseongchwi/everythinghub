
import Link from 'next/link';

const projects = [
  { id: 1, slug: 'portfolio', name: '포트폴리오', color: 'bg-blue-500' },
  { id: 2, slug: 'salary-calculator', name: '실수령 계산기', color: 'bg-purple-500' },
  // { id: 3, slug: 'crypto-pulse', name: '크립토 펄스', color: 'bg-orange-500' },
  // { id: 4, slug: 'ai-image-gen', name: 'AI 이미지 생성기', color: 'bg-emerald-500' },
  // { id: 5, slug: 'memo', name: '메모장', color: 'bg-pink-500' },
  // { id: 6, slug: 'blog', name: '블로그', color: 'bg-indigo-500' },
  // { id: 7, slug: 'shop', name: '쇼핑몰', color: 'bg-rose-500' },
  // { id: 8, slug: 'music', name: '뮤직 플레이어', color: 'bg-cyan-500' },
  // { id: 9, slug: 'chat', name: '채팅 앱', color: 'bg-amber-500' },
  // { id: 10, slug: 'weather', name: '날씨 정보', color: 'bg-teal-500' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f1f5f9] text-gray-900 selection:bg-blue-100">
      {/* 장식용 배경 요소 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-200/30 blur-[100px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32">
        {/* 히어로 섹션 */}
        <section className="mb-20 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            EVERYTHING HUB
          </h1>
          <p className="text-lg md:text-xl text-gray-500 font-medium">
            나의 모든 프로젝트를 한눈에 확인하세요.
          </p>
        </section>

        {/* 프로젝트 버튼 그리드 (한 줄에 5개씩) */}
        <section id="projects">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}/${project.slug}`}
                className="group relative flex items-center justify-center h-24 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 overflow-hidden"
              >
                {/* 배경 살짝 컬러 강조 (호버 시) */}
                <div className={`absolute inset-0 ${project.color} opacity-0 group-hover:opacity-[0.03] transition-opacity`} />

                <span className="text-base font-bold text-gray-700 group-hover:text-blue-600 transition-colors px-4 text-center">
                  {project.name}
                </span>

                {/* 호버 시 하단 선 포인트 */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${project.color} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`} />
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}