// 준비 중 화면(ERR-01) E2E — 개발 서버는 SITE_COMING_SOON 없이 뜨므로 /coming-soon에 직접 들어가 확인한다
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/coming-soon");
});

test("안내 문구 · 소개 표 · 검색용 canonical이 보인다", async ({ page }) => {
  await expect(page).toHaveTitle("개혁신학포럼");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "새 홈페이지를 준비하고 있습니다",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", { name: "RTF Reformed Theological Forum" }),
  ).toBeVisible();

  for (const text of [
    "2010년 12월",
    "웨스트민스터 신앙고백 (1647년 초판)",
    "성경신학 · 조직신학 · 역사신학 · 실천신학 · 교회와 사회",
    "서울 은평구 진관3로 22 이로운프라자 601호",
    "© 개혁신학포럼 · 사무총장 공성권",
  ]) {
    await expect(page.getByText(text)).toBeVisible();
  }

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /^https?:\/\/[^/]+\/?$/,
  );
});

test("밴드는 새 탭, 전화는 tel: 링크로 열린다", async ({ page }) => {
  const band = page.getByRole("link", { name: "네이버 밴드에서 소식 보기" });
  await expect(band).toHaveAttribute("href", "https://band.us/band/57603243");
  await expect(band).toHaveAttribute("target", "_blank");
  await expect(band).toHaveAttribute("rel", "noopener noreferrer");

  await expect(page.getByRole("link", { name: "전화 문의" })).toHaveAttribute(
    "href",
    "tel:029412019",
  );
  await expect(page.getByRole("link", { name: "02-941-2019" })).toHaveAttribute(
    "href",
    "tel:029412019",
  );
});

test("가로 스크롤이 생기지 않는다", async ({ page }) => {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test("'동작 줄이기'면 아무것도 움직이지 않고 모든 내용이 처음부터 보인다", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();

  const animated = await page.evaluate(
    () =>
      [...document.querySelectorAll("*")].filter(
        (el) =>
          getComputedStyle(el).animationName !== "none" ||
          getComputedStyle(el, "::after").animationName !== "none",
      ).length,
  );
  expect(animated).toBe(0);
  await expect(page.getByText("준비하고 있습니다")).toHaveCSS("opacity", "1");
  await expect(page.getByText("Ecclesia reformata")).toHaveCSS("opacity", "1");
});

test("표어에 마우스를 올리면 한글 번역이 보인다", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "마우스 올림은 PC에서만 확인");

  await page.locator("footer p").first().hover();
  await expect(page.getByText("개혁된 교회는 항상 개혁되어야 한다")).toHaveCSS(
    "opacity",
    "1",
  );
});
