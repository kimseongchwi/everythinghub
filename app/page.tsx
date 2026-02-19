import Link from 'next/link';
import { Briefcase, Wallet, Target, Clock, Code } from 'lucide-react';

const projects = [
  { id: 1, slug: 'portfolio', name: '포트폴리오', color: 'text-blue-500', bg: 'bg-blue-50', icon: Briefcase },
  { id: 2, slug: 'salary-calculator', name: '실수령 계산기', color: 'text-purple-500', bg: 'bg-purple-50', icon: Wallet },
  { id: 3, slug: 'target-amount-simulator', name: '목표금액 시뮬레이터', color: 'text-emerald-500', bg: 'bg-emerald-50', icon: Target },
  { id: 4, slug: 'code-archive', name: '코드 아카이브', color: 'text-slate-700', bg: 'bg-slate-100', icon: Code },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-blue-100 flex flex-col items-center justify-center p-4 sm:p-8">
      {/* 백그라운드 디테일 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-b from-gray-50/50 to-transparent" />
      </div>

      <main className="w-full max-w-6xl relative z-10">
        {/* 히어로 섹션 */}
        <header className="mb-24 text-center">
          <h2 className="text-[1.75rem] leading-[1.1] sm:text-4xl md:text-6xl font-black tracking-tighter text-gray-950 mb-6 uppercase whitespace-nowrap">
            Everything Hub
          </h2>
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <div className="h-px w-6 sm:w-12 bg-gray-200" />
            <p className="text-gray-400 font-medium tracking-wide text-[13px] sm:text-sm whitespace-nowrap">
              내 방식대로 만든, 나를 위한 도구 모음
            </p>
            <div className="h-px w-6 sm:w-12 bg-gray-200" />
          </div>
        </header>

        {/* 프로젝트 버튼 그리드 (5열) */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={project.slug === 'portfolio' ? '/portfolio' : `/tools/${project.slug}`}
              className="group relative flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-8 bg-white border border-gray-100 rounded-[2.5rem] transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] hover:-translate-y-2 hover:border-blue-100 active:scale-95"
            >
              {/* 아이콘 영역 */}
              <div className={`w-14 h-14 rounded-3xl ${project.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                <project.icon className={`w-6 h-6 ${project.color}`} />
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest group-hover:text-blue-400 transition-colors">
                  0{project.id}
                </span>
                <span className="text-[13px] sm:text-[15px] font-black text-gray-800 tracking-tight group-hover:text-gray-950 text-center break-keep">
                  {project.name}
                </span>
              </div>

              {/* 하단 점 포인트 */}
              <div className={`absolute bottom-6 w-1 h-1 rounded-full ${project.color.replace('text', 'bg')} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}