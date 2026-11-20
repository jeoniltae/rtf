import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// 단위 테스트(Vitest) — 순수 함수·zod 스키마용. E2E(e2e/)는 Playwright가 맡는다.
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
    passWithNoTests: true,
  },
});
