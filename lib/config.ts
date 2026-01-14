import 'server-only';

const phase = process.env.NODE_ENV || 'development';

// 1. 기본 설정 객체 선언
const config: any = {
  env: phase,
  isProd: false,
  project: {},
  db: {},
  api: {}
};

// 2. 환경별 분기 처리 (if-else)
if (phase === 'production') {
  // --- [운영 환경 설정 (Vercel)] ---
  config.isProd = true;

  config.project = {
    name: "Everything Hub",
  };

  config.db = {
    // Vercel 환경변수에 등록한 Postgres 주소를 사용
    url: process.env.DATABASE_URL,
  };

  config.api = {
    openai: process.env.OPENAI_KEY,
  };

} else {
  // --- [개발 환경 설정 (Local)] ---
  config.isProd = false;

  config.project = {
    name: "Everything Hub (Dev)",
  };

  config.db = {
    // 로컬 .env에 있는 Supabase(Postgres) 주소를 사용
    url: process.env.DATABASE_URL,
  };

  config.api = {
    openai: 'sk-test-123456789',
  };
}

// 3. 설정 객체 내보내기
export { config };
export default config;