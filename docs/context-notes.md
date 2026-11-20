# 작업 결정 기록

결정한 내용과 이유를 최신순으로 남긴다. 기획 단계 결정은 노션 화면설계서 11장 · 기술 스택 문서를 따른다.

## 2026-11-20 — 폴더 구조 FSD 경량 적용 + Steiger

- **B안(경량)** 채택. Next.js 라우팅 `src/app`은 그대로 두고 `widgets` · `features` · `entities` · `shared`만 FSD로. FSD 원칙대로(A안) 하면 FSD의 `app` · `pages` 레이어가 Next.js 폴더 이름과 겹쳐 라우팅 폴더를 루트로 옮기고 `_app` · `_pages`로 이름을 바꾸고 화면마다 다시 내보내는 파일을 둬야 함 — 1인 개발에 비해 부담이 커서 제외. 화면 조립은 `page.tsx`가 맡는다
- Supabase 클라이언트는 `shared/api/supabase`. 공개 진입점을 `index.ts`(브라우저용 `createSupabaseBrowserClient`)와 `index.server.ts`(서버용 `createSupabaseServerClient`, `updateSession`)로 나눔 — 하나에 섞으면 Client Component가 import할 때 `next/headers`가 브라우저 번들로 끌려감. Steiger `--fix`는 하나로 묶어 버려서 쓰지 않음
- 원본 파일의 함수 이름(`createClient`)은 그대로 두고 진입점에서만 새 이름으로 내보냄. 두 클라이언트가 같은 이름이라 진입점에서 구분이 필요했음
- Steiger 0.10 + `@feature-sliced/steiger-plugin` 0.8. `src/app` · `src/proxy.ts` · 테스트 파일은 검사 제외. `npm run lint`에 묶어 feature-workflow VERIFY에서 자동 실행되게 함
- Steiger 설정 파일은 `steiger.config.mts` + `--config`로 지정. `.ts`로 두면 package.json에 `"type": "module"`이 없어 Node가 매번 경고를 냄. `.mts`는 자동 탐색이 안 돼서 경로를 명시
- shadcn `components.json` 경로를 `@/shared/ui` · `@/shared/lib`로 바꿈 → `shadcn add`가 `src/shared/ui/`에 생성 (dry-run으로 확인)
- `db:types` 출력은 `src/shared/api/supabase/database.ts`
- 빈 레이어 폴더는 만들지 않음. 첫 슬라이스가 생길 때 만든다

## 2026-11-20 — 테스트 도구 도입 (Vitest + Playwright)

- 단위 테스트는 Vitest, E2E는 Playwright. feature-workflow VERIFY에서 바뀐 파일에 따라 골라 실행한다 — 전역 스킬은 고치지 않고 `.claude/feature-workflow.md`의 VERIFY · BUILD 섹션에만 조건을 적었다. 다른 프로젝트에서도 같은 패턴이 반복되면 전역 스킬로 옮긴다
- `npm test`는 Vitest. 스킬의 `test: auto`가 `test` 스크립트를 자동으로 찾기 때문에 빠른 Vitest를 두고, 느린 E2E는 `test:e2e`로 분리
- Vitest 5는 Node 22.12 이상이 필요해 **Vitest 4.1**을 쓴다 (프로젝트는 Node 20.9 이상 지원). Node 22 이상으로 올리면 Vitest 5로 바꿀 수 있다
- `passWithNoTests` — 단위 테스트가 아직 없어도 `npm test`가 실패하지 않게
- Playwright 1.65.1 → Chromium 1255를 새로 받음. 브라우저 캐시(`%LOCALAPPDATA%\ms-playwright`)는 다른 프로젝트와 공유
- Playwright는 Chromium만, 모바일 360px · PC 1280px 두 프로젝트. 개발 서버는 `webServer`로 자동 실행
- BUILD에서 `test-driven-development`는 `src/lib/` 로직에만 적용. 화면은 기능 단위로 E2E를 쓴다 — 매 작업마다 E2E를 먼저 쓰면 너무 무거움
- 로그인 E2E는 테스트용 Supabase와 테스트 계정 준비 뒤로 미룬다

## 2026-11-17 — feature-workflow 도입

- 새 기능은 전역 스킬 `/feature-workflow`로 진행. 설정은 `.claude/feature-workflow.md`
- 기능 단위 기록은 `docs/plans/YYYY-MM-DD-<slug>/`(spec·plan)로 통일하고 `docs/features/`는 삭제 — 같은 역할의 폴더가 두 개면 어디에 쓸지 헷갈림
- `docs/todo.md`는 전체 목차로만 쓰고 기능 항목에 plan 폴더 링크를 단다. `context-notes.md`는 여러 기능에 걸친 결정만
- `design: existing` — 브랜드 컬러·디자인 시안 전까지 shadcn 기본 토큰을 따른다. 시안이 나오면 다시 결정
- `base_branch: main` — `staging` 브랜치를 만든 뒤 `staging`으로 바꾼다
- 이 프로젝트는 CLAUDE.md 없이 AGENTS.md만 쓰므로, 스킬의 "CLAUDE.md 우선" 규칙은 AGENTS.md에 해당한다

## 2026-11-16 — 코딩 지침 정리

- mareca의 `docs/coding-guidelines.md`를 기준으로 금지 사항과 에이전트 작업 지침을 가져와 rtf에 맞게 조정
- 작업 체크리스트는 별도 `checklist.md` 없이 `docs/todo.md`로 통일
- 검증은 `lint` · `typecheck` · `build`. 테스트 도구는 추후 추가하면서 지침에 더한다
- "요청 없이 자동 커밋"(시맨틱 커밋) 지침은 넣지 않음 — 커밋은 사용자가 요청할 때만
- 한국어 문장 끝 콜론 금지 규칙은 대화 응답과 문서 모두에 적용
- 새 파일 첫 줄 한국어 주석은 이후 새로 만드는 파일부터 적용 (기존 파일 소급 안 함)
- `context-notes.md`(왜)와 `todo.md`(무엇)는 따로 둔다. 성격이 달라 합치면 끝난 할 일을 지울 때 결정 이유도 함께 사라지기 쉽다
- 노션과 겹치지 않게, 사람과 공유하는 기획 결정·자료 요청은 노션 11-2에, 개발 작업은 `todo.md`에 둔다. `todo.md`의 '자료 대기' 목록은 노션 링크로 대체

## 2026-11-16 — 개발 환경 초기 세팅

- **Next.js 16.4.6** (당시 latest). `create-next-app`에 `--cache-components --src-dir` 사용
- **shadcn/ui**: Radix 기반, Nova 프리셋. 초기화 시 `clsx` + `tailwind-merge` 대신 shadcn 공식 패키지 `cn`이 설치됨 — 같은 역할이라 그대로 사용 (`src/lib/utils.ts`)
- **폰트**: Pretendard 1.3.9 가변 폰트(`PretendardVariable.woff2`, OFL-1.1)를 `src/app/fonts/`에 직접 포함. 패키지 의존성은 두지 않음
- **Supabase 환경변수**: 새 키 체계에 맞춰 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 사용
- **proxy.ts**: Supabase 환경변수가 없으면 세션 갱신을 건너뜀 — `.env.local` 설정 전에도 화면이 뜨도록
- **staging 보호**: Vercel Hobby에는 비밀번호 보호가 없어 `proxy.ts`에서 Basic Auth. 아이디는 아무거나, 비밀번호만 `PREVIEW_PASSWORD`와 비교
- **에이전트 문서**: `CLAUDE.md` 없이 `AGENTS.md`만 둔다 (Claude Code v2.1.277+는 CLAUDE.md가 없으면 AGENTS.md를 읽음). Next.js `agentRules`를 켜 두어 `next dev`가 AGENTS.md에 Next.js 안내 블록을 관리하게 함 — 블록은 지우지 말고 커밋할 것
- **ESLint + Prettier**: `eslint-config-prettier`로 충돌 규칙 끔, `prettier-plugin-tailwindcss`로 클래스 정렬
