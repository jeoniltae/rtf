import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

// FSD 규칙 검사(Steiger). src/app은 Next.js 라우팅 폴더라 FSD의 app 레이어가 아니므로 제외한다.
export default defineConfig([
  ...fsd.configs.recommended,
  {
    ignores: [
      "./src/app/**",
      "./src/proxy.ts",
      "**/*.test.ts",
      "**/*.test.tsx",
    ],
  },
]);
