// robots.txt · sitemap.xml이 열리고 서로 맞는 주소를 가리키는지 확인하는 E2E 테스트
import { expect, test } from "@playwright/test";

test("robots.txt는 수집을 허용하고 사이트맵 주소를 알려 준다", async ({
  request,
}) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);

  const body = await response.text();
  expect(body).toContain("Allow: /");
  expect(body).not.toContain("Disallow");
  expect(body).toMatch(/Sitemap: https?:\/\/[^/]+\/sitemap\.xml/);
});

test("sitemap.xml에 홈이 있고 준비 중 화면은 없다", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);

  const body = await response.text();
  expect(body).toMatch(/<loc>https?:\/\/[^/]+\/<\/loc>/);
  expect(body).not.toContain("coming-soon");
});

test("파비콘과 홈 화면 아이콘이 열린다", async ({ page, request }) => {
  await page.goto("/");

  for (const selector of [
    'link[rel="icon"][href*="favicon.ico"]',
    'link[rel="icon"][href*="icon.png"]',
    'link[rel="apple-touch-icon"]',
  ]) {
    const href = await page.locator(selector).getAttribute("href");
    const response = await request.get(href!);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/");
  }
});
