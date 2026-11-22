# 구현 계획: 준비 중 화면 (ERR-01)

- spec: ./spec.md
- 상태: 진행 중

## 개요

캔버스 시안 C를 `src/widgets/coming-soon`으로 옮기고 `src/app/coming-soon/page.tsx`에서 보여 준다. 운영 환경변수 `SITE_COMING_SOON=true`이면 `src/proxy.ts`가 확장자 없는 모든 주소를 `/coming-soon`으로 rewrite한다(주소 유지, 200). staging 검색 제외 조건은 `VERCEL_ENV === "preview"`로 바꾼다. DB는 쓰지 않는다.

## 설계 결정

- **rewrite 판단은 `src/shared/lib/coming-soon.ts`의 순수 함수** `shouldShowComingSoon(pathname, flag)`. `proxy.ts`는 Steiger 검사 밖이고 Vitest로 바로 부르기 번거로워서 판단만 떼어 낸다. 기존 `shared/lib/utils.ts`처럼 index 없이 둔다
- **로고는 `next/image`의 `preload`** — spec에는 `priority`라고 적었지만 Next 16에서 `priority`는 폐기됨(`node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md` 292행). spec의 의도(먼저 불러오기)는 같다
- **canonical은 `/coming-soon/page.tsx`의 `metadata.alternates.canonical = "/"`**. 제목·설명은 layout 기본값을 그대로 쓴다(page에서 title 지정 안 함)
- **색은 `globals.css`의 `@theme`에 `--color-rtf-accent: #7B1E26` 하나**. 시안의 회색(#161616, #3D3D3D, #5F5F5F, #DADADA)은 Tailwind 기본 회색 중 가까운 값으로 맞추고, 대비 4.5:1 이상인지 본다
- **애니메이션은 CSS만** — 키프레임과 `--animate-*` 토큰을 `globals.css` `@theme`에, 클래스에는 `motion-safe:animate-…`. 표어 교차 · 스크롤 연동(`@supports (animation-timeline: view())`)처럼 유틸리티로 쓰기 어려운 것만 `globals.css`에 `@layer components`로 작은 CSS 블록을 둔다. 인라인 style은 쓰지 않는다
  - 코딩 지침의 "모션은 transition + IntersectionObserver"와 다르게 스크롤 연동 CSS를 쓴다 — spec에서 확정, 클라이언트 JS 없이 되기 때문
- **글자 크기는 지침(본문 16px 이상)에 맞춰 시안보다 1px 키운다** — 소개 표 값 · 버튼 글자 15px → 16px. NOTICE · Since 2010 · 저작권 줄 같은 작은 표지(13px)는 본문이 아니라 그대로 둔다
- 라틴어 표어는 Pretendard, 기울이지 않고 자간만 넓힘(spec대로). 시안의 Noto Serif/Cormorant는 쓰지 않는다
- `src/shared/config/`는 새 세그먼트라 Steiger가 공개 진입점을 요구하면 `index.ts`를 둔다

## 작업 목록

### 1단계: 켜고 끄기 (위험한 것 먼저)

- [x] 작업 1: rewrite 판단 함수 + 단위 테스트
- [x] 작업 2: proxy 연결 + staging 검색 제외 조건 변경 + `/coming-soon` 임시 화면

### 체크포인트: 켜고 끄기

- [ ] `npm test`, `npm run lint`, `npm run typecheck` 통과
- [ ] 환경변수를 켠 개발 서버에서 상세 주소가 준비 중 화면으로 rewrite됨 (curl)

### 2단계: 화면

- [x] 작업 3: 사이트 상수 + 버건디 색 토큰
- [x] 작업 4: 준비 중 위젯 — 구성 · 문구 · 반응형 (정지 상태)
- [x] 작업 5: 애니메이션

### 체크포인트: 화면

- [ ] 360px · 1280px에서 시안 C와 같은 구성
- [ ] '동작 줄이기'에서 아무것도 움직이지 않음

### 3단계: 마무리

- [x] 작업 6: E2E `e2e/coming-soon.spec.ts`
- [x] 작업 7: 문서 — `.env.example`, `AGENTS.md`

### 체크포인트: 완료

- [ ] spec 성공 기준 6개 충족
- [ ] `npm test` · `lint` · `typecheck` · `build` · `test:e2e` 통과
- [ ] REVIEW 준비됨

## 작업 상세

#### 작업 1: rewrite 판단 함수 + 단위 테스트

**설명:** `shouldShowComingSoon(pathname: string, flag: string | undefined): boolean`. flag가 정확히 `"true"`이고, 경로가 `/coming-soon`(및 그 하위)이 아니며, 마지막 조각에 확장자(`.`)가 없을 때만 true. 테스트를 먼저 쓴다.

**완료 기준:**

- [x] `/`, `/research/papers` + `"true"` → true / `undefined` · `"false"` · `"TRUE"` → false
- [x] `/coming-soon`, `/robots.txt`, `/sitemap.xml` → false

**검증:**

- [ ] `npm test`
- [ ] 수동 확인: 테스트가 구현 전에 실패하는 것을 먼저 봄

**의존:** 없음

**예상 파일:** `src/shared/lib/coming-soon.ts`, `src/shared/lib/coming-soon.test.ts`

**규모:** XS

#### 작업 2: proxy 연결 + 검색 제외 조건 + 임시 화면

**설명:** `proxy.ts`를 ① 기존 비밀번호 확인 ② `shouldShowComingSoon`이 true면 `NextResponse.rewrite(new URL("/coming-soon", request.url))` (세션 갱신 생략) ③ 그 밖에는 `updateSession` 순서로 바꾼다. `X-Robots-Tag` 조건을 `process.env.VERCEL_ENV === "preview"`로 바꾸고, rewrite 응답에도 같은 조건으로 붙인다. `/coming-soon/page.tsx`는 h1 한 줄과 canonical `/` metadata만 둔 임시 화면.

**완료 기준:**

- [x] `SITE_COMING_SOON=true`인 서버에서 `/research/papers`가 200 + 준비 중 내용, 주소 유지
- [x] 값이 없으면 `/`가 기존 임시 홈 그대로
- [x] `VERCEL_ENV=preview`면 `X-Robots-Tag: noindex, nofollow`, 아니면 없음

**검증:**

- [ ] `npm run lint`, `npm run typecheck`
- [ ] 수동 확인: `$env:SITE_COMING_SOON='true'; npx next dev -p 3001` 뒤 `curl -i` 로 `/`, `/research/papers`, `/robots.txt`, `/coming-soon` 확인. `$env:VERCEL_ENV='preview'`로 다시 띄워 헤더 확인

**의존:** 작업 1

**예상 파일:** `src/proxy.ts`, `src/app/coming-soon/page.tsx`

**규모:** S

#### 작업 3: 사이트 상수 + 버건디 색 토큰

**설명:** `src/shared/config/site.ts`에 기관명 · 영문명 · 창립 · 사무총장 · 주소 · 대표 전화(표기용 `02-941-2019`, 링크용 `tel:029412019`) · 밴드 주소 상수. `globals.css` `@theme`에 `--color-rtf-accent`.

**완료 기준:**

- [x] 상수가 UPPER_SNAKE_CASE로 export되고 위젯에서 import 가능
- [x] `bg-rtf-accent` · `text-rtf-accent` 클래스가 생성됨

**검증:**

- [ ] `npm run lint` (Steiger 공개 진입점 경고 없음), `npm run typecheck`

**의존:** 없음

**예상 파일:** `src/shared/config/site.ts`, (필요 시) `src/shared/config/index.ts`, `src/app/globals.css`

**규모:** XS

#### 작업 4: 준비 중 위젯 — 정지 상태

**설명:** `src/widgets/coming-soon/ui/ComingSoon.tsx`(Server Component)에 시안 C의 버건디 띠 · 머리말(로고 `next/image` preload, 개혁신학포럼, Since 2010) · NOTICE · 제목 두 줄 · 소개 · 버튼 두 개 · 소개 표(`dl`) · 푸터(표어, 저작권)를 Tailwind로 옮긴다. 모바일 기본 → `lg:` 2단. `break-keep`, 버튼 같은 폭 · 최소 높이 48px, 위쪽 여백 40px → PC 72px. 표어는 라틴어 위에 한글을 겹쳐 두고 마우스 올림 · 포커스(탭)로 한글 표시(`tabIndex`로 탭 가능). `index.ts`로 export하고 `/coming-soon/page.tsx`에서 조립.

**완료 기준:**

- [x] spec '문구'의 글이 한 글자도 다르지 않게 보임
- [x] 밴드 링크 `target="_blank" rel="noopener noreferrer"`, 전화 `tel:029412019` 두 곳
- [x] 360px에서 가로 스크롤 없음, 1280px에서 2단

**검증:**

- [ ] `npm run lint`, `npm run typecheck`
- [ ] 수동 확인: `agent-browser`로 360px · 1280px 스크린샷을 시안 C와 비교

**의존:** 작업 2, 3

- 변경: Steiger `fsd/insignificant-slice` 규칙 끔(사용자 확인) — `src/app`이 검사에서 빠져 위젯 참조를 못 봄. `shared/config/index.ts` 추가

**예상 파일:** `src/widgets/coming-soon/ui/ComingSoon.tsx`, `src/widgets/coming-soon/index.ts`, `src/app/coming-soon/page.tsx`

**규모:** S

#### 작업 5: 애니메이션

**설명:** spec 애니메이션 표의 7가지를 시안 C의 키프레임(`OptionC.dc.html` — `rtf-draw` · `rise` · `fade` · `ping` · `out` · `in` · `row`)과 같은 값으로 옮긴다. 모두 `motion-safe:`이거나 `@media (prefers-reduced-motion: no-preference)` 안. 스크롤 연동은 `@supports` 안에서만.

**완료 기준:**

- [x] 자동 효과가 모두 5초 안에 끝남 (가장 긴 것 표어 1초 + 4.9초)
- [x] '동작 줄이기'에서 `animation-name`이 모두 none이고 모든 글이 처음부터 보임
- [x] 버튼 채우기 · 화살표 0.45초가 마우스 올림과 키보드 포커스 둘 다에서 동작

**검증:**

- [ ] `npm run build`
- [ ] 수동 확인: `agent-browser`로 일반 · reduced-motion 두 상태 확인

**의존:** 작업 4

- 변경: 소개 표 스크롤 연동 범위를 시안의 `cover 40%` · `cover 50%`에서 `entry 100%`로 줄임 — 스크롤이 없는 PC 1280×800에서 아래 두 줄 구분선이 덜 그려진 채 멈춰서

**예상 파일:** `src/app/globals.css`, `src/widgets/coming-soon/ui/ComingSoon.tsx`

**규모:** S

#### 작업 6: E2E

**설명:** `e2e/coming-soon.spec.ts` — 개발 서버는 환경변수 없이 뜨므로 `/coming-soon`에 직접 들어가 검사한다(rewrite 자체는 작업 1 단위 테스트 + 작업 2 curl로 확인). 시나리오 1 · 3 · 4 · 5 · 6을 옮긴다.

**완료 기준:**

- [x] 제목 · 소개 표 · 버튼 링크 속성(`href`, `target`, `rel`) · canonical `/` 검사
- [x] `emulateMedia({ reducedMotion: "reduce" })`에서 애니메이션 없음, PC에서 표어 hover 시 한글 보임
- [x] 기존 `e2e/home.spec.ts`도 그대로 통과 (`/`는 rewrite 안 됨)

**검증:**

- [ ] `npm run test:e2e` (모바일 360px · PC 1280px)

**의존:** 작업 5

**예상 파일:** `e2e/coming-soon.spec.ts`

**규모:** S

#### 작업 7: 문서

**설명:** `.env.example`에 `SITE_COMING_SOON`(운영에만 `true`, 오픈 날 삭제) 설명 추가, `PREVIEW_PASSWORD` 주석에서 검색 제외 설명 정리. `AGENTS.md`의 DevOps(staging 검색 제외는 `VERCEL_ENV` 기준, 준비 중 스위치)와 프로젝트 구조(`widgets/coming-soon`, `shared/config`, proxy 역할) 갱신.

**완료 기준:**

- [x] 두 문서가 실제 코드 동작과 같음
- [x] 한국어 문장이 콜론으로 끝나지 않음

**검증:**

- [ ] `npm run format:check`
- [ ] 수동 확인: AGENTS.md 끝의 Next.js 블록이 그대로 있음

**의존:** 작업 2

**예상 파일:** `.env.example`, `AGENTS.md`

**규모:** XS

## 위험과 대응

| 위험                                                                    | 영향 | 대응                                                                                                                                                                          |
| ----------------------------------------------------------------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| rewrite가 RSC · prefetch 요청이나 `_next` 경로를 건드림                 | 상   | matcher가 `_next/static` · `_next/image`를 이미 제외. 작업 2에서 화면 안 링크 이동 없이 curl + 브라우저로 확인. `NextResponse.rewrite`는 RSC 헤더를 자동 전달(proxy.md 474행) |
| Cache Components에서 rewrite된 주소가 엉뚱한 캐시를 씀                  | 중   | `/coming-soon`은 정적 화면이라 영향 작음. `npm run build` + `next start`로 한 번 확인                                                                                         |
| Steiger가 `shared/config`·`shared/lib/coming-soon`에 공개 진입점을 요구 | 하   | 경고가 나오면 `index.ts` 추가                                                                                                                                                 |
| 운영에서 `NEXT_PUBLIC_SITE_URL` 누락 시 canonical이 localhost           | 중   | 코드 밖 설정. SHIP 보고에 Vercel 설정 체크 항목으로 남김                                                                                                                      |
| 시안 회색을 Tailwind 기본 회색으로 바꾸며 대비 부족                     | 하   | 작업 4에서 4.5:1 확인                                                                                                                                                         |

## 열린 질문

- 없음. (글자 크기 1px 키움, `priority` → `preload`는 위 설계 결정에 적었다. 다르게 원하면 승인 때 알려 주면 된다)
