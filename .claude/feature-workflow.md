---
plans_dir: docs/plans
design: existing # DESIGN.md를 따른다 (색 · 글꼴 · 모양은 globals.css 토큰)
test: auto # npm test(Vitest) · lint · typecheck · build 자동 감지. E2E(Playwright)는 아래 VERIFY 조건으로 실행
base_branch: stg # 개발은 stg에서 하고, 오픈 당일 stg를 main에 합친다
---

# feature-workflow 프로젝트 설정

<!-- 비밀값·실제 개인정보를 적지 않는다. 상세 규칙은 원문 문서 경로로 가리킨다. -->
<!-- 이 프로젝트는 CLAUDE.md 없이 AGENTS.md를 쓴다. 스킬의 "CLAUDE.md 우선" 규칙은 AGENTS.md에 해당한다. -->

## DEFINE

- spec의 "영향 범위"에 화면 ID(예: `RES-01`)와 노션 화면설계서의 해당 절을 적는다
- 권한이 갈리는 기능이면 화면설계서 8장 권한표에서 해당하는 줄(비회원 / 가입자 / 관리자)을 spec에 옮겨 적는다
- 데이터를 쓰는 기능이면 화면설계서 10장에서 쓰는 테이블·컬럼을 "영향 범위"에 적는다
- `docs/todo.md`의 해당 항목 옆에 이 기능 폴더 링크를 단다
- spec의 "영향 범위"에 만들거나 고칠 FSD 슬라이스(예: `entities/speaker`, `widgets/speaker-popup`)를 적는다

## PLAN

- DB를 바꾸는 기능이면 아래를 각각 별도 작업으로 넣는다
  - `supabase/migrations/` 마이그레이션 (테이블 · 제약 · GRANT · RLS 정책)
  - `npm run db:types`로 타입 재생성
- 관리자 버튼이 있는 기능이면 "화면에서 숨김"과 "Server Action · RLS에서 차단"을 따로 검증하는 작업을 넣는다
- 입력 폼이 있는 기능이면 zod 스키마 작업을 넣고, 오류 문구를 화면설계서 9-2와 맞춘다

## BUILD

- 코딩 규칙 `docs/coding-guidelines.md`를 따른다 (금지 사항, FSD 폴더 구조, 새 파일 첫 줄 한국어 주석 포함)
- 새 코드는 FSD 레이어(`widgets` · `features` · `entities` · `shared`) 중 어디에 둘지 먼저 정하고, Steiger 오류(`npm run lint`)가 없게 한다
- Next.js 16 API는 `node_modules/next/dist/docs/`에서 확인한 뒤 쓴다
- shadcn/ui 컴포넌트가 필요하면 `npx shadcn@latest add <이름>`으로 그 컴포넌트만 추가한다
- 예시 데이터에는 더미 값만 쓴다 (홍길동, 010-0000-0000, test@example.com)
- 테스트 작성 범위 (`test-driven-development` 적용 범위를 이렇게 좁힌다)
  - 순수 함수·zod 스키마·날짜 포맷 등 로직(`shared/lib`, 각 슬라이스의 `model` · `lib` 세그먼트) → Vitest로 테스트를 먼저 쓴다 (`*.test.ts`, 대상 파일 옆에 둔다)
  - 화면·컴포넌트·Server Action → 작업마다 테스트를 먼저 쓰지 않는다. 기능 단위로 spec의 사용자 시나리오를 `e2e/<기능>.spec.ts`에 Playwright로 작성한다 (BUILD 마지막 작업으로 넣는다)

## VERIFY

- 이 기능에서 바뀐 파일(미커밋 변경 + 기능 진행 중 커밋했다면 그 커밋)을 보고 테스트를 고른다. 고른 이유와 결과를 종료 보고에 적는다
  - `shared/lib`, 슬라이스의 `model` · `lib` 세그먼트(zod 스키마·유틸 함수) → `npm test` (Vitest — `test: auto`로 매번 자동 실행됨)
  - `src/app`, 슬라이스의 `ui` · `api` 세그먼트(화면·컴포넌트·Server Action·조회 함수), `shared/ui`, `shared/api`, `src/proxy.ts`, `next.config.ts` → `npm run test:e2e` (Playwright, 모바일 360px · PC 1280px 두 프로젝트)
  - 문서·설정만 바뀌었으면 E2E 생략
- E2E는 개발 서버를 자동으로 띄운다 (`playwright.config.ts`의 `webServer`). 이미 3000번 포트에 서버가 떠 있으면 그 서버를 쓴다
- E2E가 실패하면 `test-results/`의 trace를 먼저 열어 본다 (`npx playwright show-trace <경로>`)
- 로그인이 필요한 E2E는 테스트용 Supabase와 테스트 계정이 준비되기 전까지 작성하지 않는다. 그동안은 아래 항목을 `agent-browser`로 직접 확인한다

- 화면을 건드렸으면 360px 모바일과 1024px 이상 PC 두 폭으로 확인한다
- 권한이 갈리는 기능이면 비회원 · 가입자 · 관리자 세 상태로 각각 확인한다. 관리자 전용 화면은 권한 없이 들어가면 404인지 확인한다
- 로그인이 필요한 화면은 주소창 직접 진입과 다른 화면을 거쳐 이동하는 경로 두 가지로 확인한다
- URL 상태(`?round` `?page` `?q` `?speaker`)를 쓰는 화면이면 뒤로가기와 주소 공유(새 탭에서 열기)를 확인한다

## REVIEW

- 권한을 화면과 DB(RLS) **양쪽에서** 막았는지 diff로 대조한다. Server Action에서 권한을 다시 확인하는지 본다
- 새 테이블에 GRANT와 `enable row level security`가 있는지 확인한다
- `NEXT_PUBLIC_` 변수와 클라이언트 코드에 비밀 키(service_role 등)가 없는지 확인한다
- `dangerouslySetInnerHTML`은 Tiptap HTML과 안전 직렬화한 JSON-LD에만 쓰였는지 확인한다
- `docs/coding-guidelines.md`의 "하지 말아야 할 것" 항목을 diff에 대조한다

## SHIP

- `docs/todo.md`의 해당 항목을 체크한다
- 여러 기능에 걸친 결정이 있었으면 `docs/context-notes.md`에 이유를 남긴다
- 폴더 구조·DB·명령어가 바뀌었으면 `AGENTS.md`의 해당 섹션을 갱신한다
- 커밋 메시지는 한국어로 짧게 쓴다
