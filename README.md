# 개혁신학포럼 홈페이지 (rtf.or.kr)

Next.js 16 (App Router · Cache Components) · TailwindCSS 4 · shadcn/ui · Supabase · Vercel

## 시작하기

Node.js 20.9 이상이 필요합니다.

```bash
npm install
cp .env.example .env.local   # Supabase URL·키 입력
npm run dev                  # http://localhost:3000
```

## 스크립트

| 명령                | 설명                                                                |
| ------------------- | ------------------------------------------------------------------- |
| `npm run dev`       | 개발 서버                                                           |
| `npm run build`     | 운영 빌드                                                           |
| `npm run lint`      | ESLint + Steiger(FSD 규칙 검사)                                     |
| `npm run typecheck` | 라우트 타입 생성 + TypeScript 검사                                  |
| `npm run format`    | Prettier 정리 (Tailwind 클래스 정렬 포함)                           |
| `npm run db:types`  | 연결된 Supabase 스키마로 `src/shared/api/supabase/database.ts` 생성 |
| `npm test`          | Vitest 단위 테스트                                                  |
| `npm run test:e2e`  | Playwright E2E (개발 서버 자동 실행)                                |

Playwright 브라우저가 없으면 처음 한 번 `npx playwright install chromium`을 실행한다.

## shadcn/ui 컴포넌트 추가

실제로 쓰는 컴포넌트만 하나씩 추가합니다.

```bash
npx shadcn@latest add dialog
```

## Supabase

```bash
npx supabase login
npx supabase link --project-ref <프로젝트 ref>
npx supabase migration new <이름>   # supabase/migrations 에 SQL 작성
npx supabase db push
npm run db:types
```

## 폴더 구조

```txt
src/
  app/              라우트 (App Router)
    fonts/          Pretendard (next/font/local)
  widgets/          화면 블록 (FSD)
  features/         사용자 행동 (FSD)
  entities/         도메인 (FSD)
  shared/ui/        shadcn/ui 컴포넌트
  shared/lib/       공용 함수
  shared/api/       Supabase 클라이언트 (index.ts 브라우저용 · index.server.ts 서버용)
  proxy.ts          세션 갱신 + staging 비밀번호 보호
supabase/           Supabase CLI 설정 · 마이그레이션
```

## 배포

- `main` → rtf.or.kr / `stg` → stg.rtf.or.kr
- staging(Vercel Preview)에는 `X-Robots-Tag: noindex, nofollow`가 항상 붙고, `PREVIEW_PASSWORD`를 넣으면 Basic Auth도 적용됩니다.
