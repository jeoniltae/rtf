import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/shared/config";
import "./globals.css";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-sans",
  weight: "45 920",
  display: "swap",
});

// 영문 표제 전용(라틴어 표어 · 회차 숫자 · 영문 기관명). 한글에는 쓰지 않는다
const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "개혁신학포럼",
    template: "%s | 개혁신학포럼",
  },
  description:
    "종교개혁의 전통을 계승하는 개혁파 신학을 연구하고 현대 교회에 바르게 적용하는 연구 공동체, 개혁신학포럼(RTF)",
  // 네이버 서치어드바이저 소유 확인 — 지우면 확인이 풀린다
  verification: {
    other: {
      "naver-site-verification": "05ac01b82aa10caaccb3b355fc78fdd1f5512469",
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${ebGaramond.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
