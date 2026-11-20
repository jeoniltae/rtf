// 홈 화면이 한국어 문서로 열리고 사이트 이름이 보이는지 확인하는 기본 E2E 테스트
import { expect, test } from "@playwright/test";

test("홈 화면이 열린다", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("개혁신학포럼");
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  await expect(
    page.getByRole("heading", { level: 1, name: "개혁신학포럼" }),
  ).toBeVisible();
});
