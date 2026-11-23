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
