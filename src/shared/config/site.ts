// 기관 기본 정보 상수 — 준비 중 화면 · 푸터 · 오시는 길(ABT-05)에서 함께 쓴다
export const SITE_NAME = "개혁신학포럼";
export const SITE_NAME_EN = "Reformed Theological Forum";
export const FOUNDED_YEAR = 2010;
export const FOUNDED_LABEL = "2010년 12월";
export const SECRETARY_GENERAL = "공성권";
export const OFFICE_ADDRESS = "서울 은평구 진관3로 22 이로운프라자 601호";
export const PHONE = { label: "02-941-2019", href: "tel:029412019" } as const;
export const BAND_URL = "https://band.us/band/57603243";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
