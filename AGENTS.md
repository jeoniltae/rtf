# AGENTS.md

## 프로젝트 개요

개혁신학포럼(RTF, Reformed Theological Forum) 홈페이지 — rtf.or.kr.
포럼 소개, 이번 포럼(개요·프로그램·발제자·장소), 연구자료(논문·칼럼·자료실), 지난 포럼·영상 아카이브, 공지·Q&A 게시판을 제공한다.
UI는 **모바일 우선** 반응형 웹으로 제작한다 (360px → `md:` 768px → `lg:` 1024px).
팀 규모: 1인 개발.

---

## 관련 문서

작업 전에 아래 문서를 반드시 확인하세요.

- 화면설계서 · 기능 명세서 v0.4 (노션): https://app.notion.com/p/40e45580eb6b8188a778f988146df5fd
  — 화면 ID(`MAIN-01`, `EVT-03P` 등), URL 규칙, 권한표(8장), 입력값 규칙(9-2), 데이터 구조(10장)의 원본
- 기술 스택 (노션): https://app.notion.com/p/41a45580eb6b81a3a6cfebc9bd5aab09
- 디자인 기준 (색 · 글꼴 · 모양 · 버튼): `DESIGN.md` — 화면을 만들거나 고치기 전에 확인. 준비 중 화면은 예외
- 코딩 규칙 및 금지 사항: `docs/coding-guidelines.md`
- 작업 결정 기록 (여러 기능에 걸친 결정): `docs/context-notes.md`
- 작업 목록 (프로젝트 전체 목차): `docs/todo.md`
- 기능별 spec · plan: `docs/plans/YYYY-MM-DD-<slug>/` — `/feature-workflow` 산출물.
  해당 기능을 손대기 전에 반드시 확인할 것
- feature-workflow 프로젝트 설정: `.claude/feature-workflow.md`

---

## 기술 스택

### Frontend

- Framework: Next.js 16.4.x (App Router) + React 19 — canary·preview 버전 사용 금지
- 렌더링: **Cache Components** (`cacheComponents: true`)
- Language: TypeScript (strict mode)
- Styling: Tailwind CSS 4 + shadcn/ui (Radix, 쓰는 컴포넌트만 `npx shadcn@latest add`로 추가)
- 에디터: Tiptap (MIT 오픈소스 확장만, Pro 확장 금지)
- 입력값 검사: zod — 화면과 서버가 같은 스키마 공유
- 폰트: Pretendard (`next/font/local`, `src/app/fonts/`) + 영문 표제만 EB Garamond (`next/font/google`, `font-serif`)
- Testing: Vitest 4 (단위 — `src/**/*.test.ts`) + Playwright (E2E — `e2e/`, 모바일 360px · PC 1280px)
  - Vitest 5는 Node 22.12 이상이 필요해 처음에 4로 시작했다. Node 24로 고정했으니 필요할 때 5로 올릴 수 있다

### Backend

- Supabase (Postgres + Auth + Storage)
- ORM 없음 — Supabase JS 클라이언트 직접 사용 (`src/shared/api/`)
- API Route 대신 Server Action 사용
- 콘텐츠 관리(포럼·발제자·인물·사이트 설정·회원 상태)는 **Supabase 대시보드**에서 직접 — 별도 관리자 화면(`/admin`) 없음

#### 인증 (Auth)

- 이메일 + 비밀번호 가입, 이메일 인증, 비밀번호 재설정
- 소셜 로그인 없음 (오픈 후 결정)
- 회원 3단계: 비회원 / 가입자 / 관리자(`profiles.role = 'admin'`)

#### 접근 제어

- 권한은 **화면(버튼 숨김)과 DB(RLS) 양쪽**에서 막는다. 화면에서만 막지 않는다.
- 읽기·첨부 다운로드: 비로그인 포함 누구나
- Q&A 질문 작성: 가입자 이상 / 본인 질문 수정·삭제는 **답변이 달리기 전까지만**
- 공지·연구자료 작성, Q&A 답변, 숨김·고정: 관리자만
- 관리자 전용 화면(RES-03 등)에 권한 없이 접근하면 404

---

## DevOps

- 소스 관리: GitHub
- 배포: Vercel
  - `main` → rtf.or.kr (오픈 전에는 '준비 중' 화면)
  - `stg` → stg.rtf.or.kr (목사님 확인용)
  - `dev` → dev.rtf.or.kr (개발자 확인용)
- 병합 순서: `feature/* → dev → stg → main`. 기능 브랜치는 `dev`에서 만든다
  - `dev → stg`는 dev에 쌓인 것이 전부 목사님께 보여 드릴 만할 때만 통째로 합친다. 일부만 먼저 보여 드려야 하면 그 feature 브랜치를 `stg`로 직접 합치고, 뒤에 `stg`를 `dev`로 합쳐 맞춘다
  - 보는 사람에 따라 화면을 나누는 것은 환경변수나 코드 분기가 아니라 브랜치(주소)로 한다
  - 오픈 전에도 `stg → main`을 주기적으로 합쳐도 된다. 단 준비 중 rewrite는 확장자 있는 주소를 건너뛰므로 `robots.txt` · `sitemap.xml` · `public/` 파일은 운영에 그대로 나간다. sitemap에는 오픈 때까지 홈만 두고, `public/`에 공개하면 안 되는 파일을 두지 않는다
- staging 보호: `src/proxy.ts`가 `PREVIEW_PASSWORD`가 있을 때만 Basic Auth 적용. 이 변수는 **Vercel Preview 환경에만** 넣는다 (`dev` · `stg` 둘 다 적용). 한쪽에만 필요한 값은 Vercel에서 Preview 변수의 브랜치를 지정한다.
- staging 검색 제외: `VERCEL_ENV === "preview"`이면 `X-Robots-Tag: noindex, nofollow` (비밀번호 유무와 상관없음)
- 준비 중 화면: `SITE_COMING_SOON=true`(**Vercel Production 환경에만**)이면 `src/proxy.ts`가 확장자 없는 모든 주소를 `/coming-soon`으로 rewrite한다(주소 유지, 200). 오픈 날 이 값을 지우고 재배포한다. 운영에는 `NEXT_PUBLIC_SITE_URL=https://rtf.or.kr`도 넣어야 canonical이 맞다
- 환경변수: `.env.example` 참고. 로컬은 `.env.local`, 배포는 Vercel Dashboard
- Node.js 24.x — `package.json` `engines`로 고정. Vercel 대시보드 Node.js Version도 24.x로 맞춘다

---

## 주요 명령어

```bash
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드
npm run lint         # ESLint + Steiger(FSD 규칙)
npm run typecheck    # 라우트 타입 생성 + tsc
npm run format       # Prettier (Tailwind 클래스 정렬 포함)
npm run db:types     # Supabase DB → src/shared/api/supabase/database.ts 생성
npm test             # Vitest 단위 테스트
npm run test:e2e     # Playwright E2E (개발 서버 자동 실행)
```

작업을 마치면 `test`, `lint`, `typecheck`, `build`를 통과시킨다. 화면·컴포넌트·Server Action·proxy를 바꿨으면 `test:e2e`도 통과시킨다.

---

## 프로젝트 구조

**FSD(Feature-Sliced Design) 경량 적용.** Next.js 라우팅 폴더 `src/app`은 그대로 두고, 그 아래 네 레이어만 FSD로 쓴다. FSD의 `app`·`pages` 레이어는 Next.js 폴더 이름과 겹쳐서 두지 않는다.

```
src/
├── app/               # Next.js 라우팅(page · layout · route) + 전역 스타일 · 폰트. 화면 조립만
│   ├── fonts/         # Pretendard
│   └── coming-soon/   # 오픈 전 준비 중 화면 (ERR-01)
├── widgets/           # 화면 블록 — 헤더, 모바일 메뉴, 푸터, 서브 화면 틀, 발제자 팝업 등
│   └── coming-soon/   # 준비 중 화면 블록
├── features/          # 사용자 행동 — 로그인, 질문 작성, 답변 작성, 자료 등록, 검색 등
├── entities/          # 도메인 — 포럼 회차, 발제자, 연구자료, 게시글, 답변, 회원, 인물 등
├── shared/
│   ├── ui/            # shadcn/ui 컴포넌트
│   ├── config/        # 기관명 · 주소 · 전화 · 밴드 주소 등 사이트 상수
│   ├── lib/           # cn(), 준비 중 rewrite 판단 등 공용 함수
│   └── api/
│       ├── index.ts         # 브라우저에서도 쓰는 것 (createSupabaseBrowserClient)
│       ├── index.server.ts  # 서버 전용 (createSupabaseServerClient, updateSession)
│       └── supabase/        # 클라이언트 구현 · database.ts(자동 생성)
└── proxy.ts           # 세션 갱신 + staging 보호 · 검색 제외 + 준비 중 rewrite (Next.js 16의 middleware)
e2e/                   # Playwright E2E 테스트
supabase/              # Supabase CLI 설정 · migrations
docs/                  # 규칙 · 결정 기록 · 작업 목록
```

`widgets` · `features` · `entities`는 첫 슬라이스를 만들 때 생긴다. 레이어 규칙은 `docs/coding-guidelines.md`의 "폴더 구조 (FSD)"에 있다. `npm run lint`가 Steiger로 FSD 규칙을 검사한다.

---

## 상태 관리

- 로컬 상태: `useState`
- 회차·페이지·검색어·팝업 상태: **URL 검색 파라미터** (`?round` `?page` `?q` `?speaker`) — 뒤로가기·링크 공유가 되도록
- 서버 데이터: Server Components + Cache Components. 등록·수정 시 태그 단위로 해당 화면만 갱신
- 전역 상태 라이브러리(Zustand 등), React Query/SWR 사용 안 함

---

## 코드 컨벤션

상세 규칙, 금지 사항, 에이전트 작업 지침은 `docs/coding-guidelines.md`에 있다. 아래는 요약이다.

- 컴포넌트 파일 PascalCase, 일반 파일 kebab-case, 상수 UPPER_SNAKE_CASE
- Named export (Next.js가 요구하는 `page`·`layout` 등은 default export)
- 기본은 Server Component, 인터랙션이 필요할 때만 `'use client'`
- className 조합은 `cn()`, 인라인 스타일 금지
- 날짜는 `Intl.DateTimeFormat` + `timeZone: 'Asia/Seoul'`
- `any` 금지, `useEffect` 데이터 페칭 금지, `console.log` 커밋 금지
- 새 소스 파일 첫 줄에 역할을 설명하는 한국어 한 줄 주석
- 한국어 문장은 콜론(`:`)으로 끝내지 않는다

---

## DB

스키마 원본은 `supabase/migrations/`의 SQL이다. 변경은 반드시 마이그레이션 파일로 하고, 바꾼 뒤 `npm run db:types`로 타입을 재생성한다.
테이블 설계 초안은 화면설계서 10장: `profiles`, `events`, `event_speakers`, `resources`, `posts`, `answers`, `attachments`, `people`, `site_settings`.

- Q&A 상태(답변대기/답변완료)는 `answers` 존재 여부로 판단 (상태 컬럼 없음)
- 대시보드에서 직접 입력하는 테이블은 DB 제약으로 실수를 막는다: 회차 `unique`, 필수값 `not null`, 역할 값 `check`
- 게시글 삭제는 soft delete (`deleted_at`)

### Supabase Data API GRANT 정책 (2026-10-30부터)

`public` 스키마에 새로 만드는 테이블은 명시적 GRANT 없이는 supabase-js로 접근할 수 없다. 테이블 생성 마이그레이션에 아래를 반드시 함께 넣는다.

```sql
grant select on public.새테이블 to anon;
grant select, insert, update, delete on public.새테이블 to authenticated;
grant select, insert, update, delete on public.새테이블 to service_role;
alter table public.새테이블 enable row level security;
```

에러 시 PostgREST가 `42501`과 함께 필요한 GRANT 구문을 알려 준다.

---

## SEO

- 페이지마다 `metadata` 또는 `generateMetadata` (제목·설명·OG). 포럼 개요의 OG 이미지는 포스터
- `src/app/sitemap.ts`, `src/app/robots.ts` 제공. staging은 noindex
- JSON-LD를 `<script>`에 넣을 때 `JSON.stringify`를 그대로 쓰지 않는다 — 본문의 `</script>`가 태그를 닫아 XSS가 된다. `<`를 `<`로 바꾸는 안전 직렬화 헬퍼를 쓴다

---

## TODO

`docs/todo.md`에서 관리한다.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
