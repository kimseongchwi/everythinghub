import 'server-only'; // 보안: 이 파일의 내용은 브라우저로 절대 넘어가지 않음

// 1. 현재 실행 환경 파악 (development 또는 production)
const phase = process.env.NODE_ENV || 'development';

// 2. 기본 설정 객체 생성 (나중에 값을 채워넣을 빈 통)
// any를 써서 구조가 동적으로 바뀌는 것을 허용합니다.
const config: any = {
  env: phase,
  isProd: false
};

/**
 * [환경 분기 처리]
 * if 문을 사용해서 개발(Local)과 운영(Vercel/GCP) 설정을 명확히 나눕니다.
 */
if (phase === 'production') {
  // --- [운영 환경 설정] ---
  config.isProd = true;
  
  config.project = {
    name: "Everything Hub",
  };

  config.db = {
    host: process.env.DB_HOST,     // 운영 서버 IP (GCP 등)
    user: process.env.DB_USER,     // 운영 DB 계정
    password: process.env.DB_PASS, // 운영 DB 비번
    database: 'everythinghub',     // 운영 DB 명
  };

  config.api = {
    openai: process.env.OPENAI_KEY, // 운영 서버 환경변수 활용
  };

} else {
  // --- [개발 환경 설정] ---
  config.isProd = false;

  config.project = {
    name: "Everything Hub (Dev)",
  };

  config.db = {
    host: '127.0.0.1',             // 로컬 DB (내 컴퓨터)
    user: 'root',                  // 로컬 DB 계정
    password: process.env.DB_PASS, // 로컬 DB 비번 (보통 .env에 보관)
    database: 'everythinghub_dev', // 개발용 DB 명
  };

  config.api = {
    openai: 'sk-test-123456789', // 테스트용 키 직접 노출
  };
}

// 3. 완성된 설정 객체 내보내기
export { config };
export default config;