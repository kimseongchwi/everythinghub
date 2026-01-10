import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google"; // Geist 대신 한국어에 최적화된 Noto Sans KR 사용
import "./globals.css";

// Nuxt 설정에 있던 Noto Sans KR 폰트 적용
const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["100", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Everything Hub | 잡다한 것들 창고",
  // description: "개발자 성취의 개인 프로젝트와 유용한 도구들을 모아놓은 허브입니다.",
  // Nuxt 설정에 있던 네이버 소유 확인 및 파비콘 등 추가
  icons: {
    icon: "/favicon.ico",
  },
  verification: {
    other: {
      "naver-site-verification": "28d29139dc4c618c1adcdcf418b8fc3162b7dede",
    },
  },
  // OpenGraph (카톡/페이스북 공유 시 보이는 설정)
  openGraph: {
    title: "Everything Hub",
    description: "성취의 잡다한 프로젝트 창고",
    url: "https://everythinghub.vercel.app",
    siteName: "Everything Hub",
    images: [
      {
        url: "/img/thumb.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKr.className} antialiased bg-gray-50 text-gray-900`}>
        {/* 공통 헤더 (모든 페이지 상단에 노출) */}
        <header className="border-b bg-white p-4 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <a href="/" className="text-xl font-black text-primary">EVERYTHING HUB</a>
            <nav className="space-x-4 font-medium text-sm">
              <a href="/projects" className="hover:text-primary">Projects</a>
              <a href="/about" className="hover:text-primary">About</a>
            </nav>
          </div>
        </header>

        {/* 페이지별 실제 콘텐츠 */}
        <main className="max-w-5xl mx-auto min-h-screen">
          {children}
        </main>

        {/* 공통 푸터 */}
        <footer className="border-t bg-white p-8 mt-20 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Everything Hub. All rights reserved.
        </footer>
      </body>
      
    </html>
  );
}