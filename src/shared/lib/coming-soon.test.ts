// 준비 중 화면 rewrite 판단 함수의 단위 테스트
import { describe, expect, it } from "vitest";
import { shouldShowComingSoon } from "./coming-soon";

describe("shouldShowComingSoon", () => {
  it("값이 정확히 'true'일 때 일반 주소를 준비 중 화면으로 보낸다", () => {
    expect(shouldShowComingSoon("/", "true")).toBe(true);
    expect(shouldShowComingSoon("/research/papers", "true")).toBe(true);
  });

  it("값이 없거나 'true'가 아니면 보내지 않는다", () => {
    expect(shouldShowComingSoon("/", undefined)).toBe(false);
    expect(shouldShowComingSoon("/", "")).toBe(false);
    expect(shouldShowComingSoon("/", "false")).toBe(false);
    expect(shouldShowComingSoon("/", "TRUE")).toBe(false);
  });

  it("준비 중 화면 자신은 다시 보내지 않는다", () => {
    expect(shouldShowComingSoon("/coming-soon", "true")).toBe(false);
    expect(shouldShowComingSoon("/coming-soon/", "true")).toBe(false);
  });

  it("확장자가 있는 파일 주소는 보내지 않는다", () => {
    expect(shouldShowComingSoon("/robots.txt", "true")).toBe(false);
    expect(shouldShowComingSoon("/sitemap.xml", "true")).toBe(false);
    expect(shouldShowComingSoon("/icons/logo.ico", "true")).toBe(false);
  });

  it("중간 폴더 이름에 점이 있어도 마지막 조각만 본다", () => {
    expect(shouldShowComingSoon("/v1.0/about", "true")).toBe(true);
  });
});
