import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

// FSD 규칙 검사(Steiger). src/app은 Next.js 라우팅 폴더라 FSD의 app 레이어가 아니므로 제외한다.
export default defineConfig([
  ...fsd.configs.recommended,
  {
    // 화면 조립은 검사에서 빠진 src/app이 맡아서, 위젯·기능을 참조하는 곳이 없다고 잘못 나온다
    rules: { "fsd/insignificant-slice": "off" },
  },
  {
    ignores: [
      "./src/app/**",
      "./src/proxy.ts",
      "**/*.test.ts",
      "**/*.test.tsx",
    ],
  },
]);
