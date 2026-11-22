// 오픈 전 준비 중 화면(ERR-01). 운영에서는 proxy.ts가 모든 주소를 이 화면으로 rewrite한다
import type { Metadata } from "next";
import { ComingSoon } from "@/widgets/coming-soon";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function ComingSoonPage() {
  return <ComingSoon />;
}
