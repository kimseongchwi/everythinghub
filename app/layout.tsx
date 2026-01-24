
import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["100", "400", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://everythinghub.vercel.app"),
  title: "Everything Hub | 잡다한 것들 창고",
  icons: {
    icon: "/favicon.ico",
  },
  verification: {
    other: {
      "naver-site-verification": "28d29139dc4c618c1adcdcf418b8fc3162b7dede",
    },
  },
  openGraph: {
    title: "Everything Hub",
    description: "내 스타일 대로 만든 잡다한 프로젝트 창고",
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
      <body className={`${notoSansKr.className} antialiased bg-[#f1f5f9] text-gray-900 min-h-screen flex flex-col`}>
        {/* 공통 헤더 */}
        <header className="sticky top-0 z-[100] border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
            <Link href="/" className="text-xl font-black tracking-tighter text-blue-600">
              EVERYTHING HUB
            </Link>
            <nav className="flex gap-8 text-sm font-bold text-gray-500 items-center">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              {process.env.NODE_ENV === 'development' && (
                <Link href="/admin" className="px-3 py-1.5 bg-gray-100 rounded-lg text-gray-900 hover:bg-gray-200 transition-all flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  Admin
                </Link>
              )}
            </nav>
          </div>
        </header>

        {/* 페이지별 실제 콘텐츠 */}
        <main className="flex-grow">
          {children}
        </main>

        {/* 공통 푸터 */}
        <footer className="border-t border-gray-200 bg-white py-8">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm text-gray-400 font-medium">
              © {new Date().getFullYear()} Everything Hub. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}