
import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["100", "400", "700", "900"],
});

import Script from "next/script";
import ConditionalNavigation from "./ConditionalNavigation";

export const metadata: Metadata = {
  metadataBase: new URL("https://everythinghub.vercel.app"),
  title: "Everything Hub | 내 방식대로 만든 도구 모음",
  description: "내 방식대로 만든, 나를 위한 도구 모음",
  icons: {
    icon: "/favicon.ico",
  },
  verification: {
    google: "ydxECgwPCCSU8vLbP6Wz2WdazvVMfgK3Yx1kN8LsfsQ",
    other: {
      "naver-site-verification": "28d29139dc4c618c1adcdcf418b8fc3162b7dede",
    },
  },
  openGraph: {
    title: "Everything Hub",
    description: "내 방식대로 만든, 나를 위한 도구 모음",
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
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4390230382155372"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <ConditionalNavigation notoSansKrClassName={notoSansKr.className}>
        {children}
      </ConditionalNavigation>
    </html>
  );
}