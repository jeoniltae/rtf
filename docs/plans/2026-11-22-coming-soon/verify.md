# 검증 기록: 준비 중 화면 (ERR-01)

- 검증일: 2026-11-22
- 대상 커밋: `efc3e77` (작업 트리 변경 없음)

## 실행한 명령

| 명령                | 결과                                                            |
| ------------------- | --------------------------------------------------------------- |
| `npm test`          | 1개 파일, 5개 테스트 통과                                       |
| `npm run lint`      | ESLint + Steiger 문제 없음                                      |
| `npm run typecheck` | 통과                                                            |
| `npm run build`     | 성공 — `/`, `/coming-soon` 정적, Proxy 포함                     |
| `npm run test:e2e`  | 11개 통과, 1개 의도적 건너뜀 (표어 마우스 올림은 PC에서만 검사) |

E2E를 고른 이유는 `src/proxy.ts`, `src/app`, 위젯 `ui` 세그먼트가 바뀌어서다.

## 실제 동작 확인 (운영 빌드 `next start`, 3001번)

빌드에는 `SITE_COMING_SOON`이 없고 실행할 때만 넣었다. 운영 서버가 실행 시점의 값을 읽는다는 뜻이다.

**운영 조건** (`SITE_COMING_SOON=true`, `VERCEL_ENV=production`)

| 주소               | 결과                                                 |
| ------------------ | ---------------------------------------------------- |
| `/`                | 200, `/coming-soon`으로 rewrite, 검색 제외 헤더 없음 |
| `/research/papers` | 200, rewrite                                         |
| `/about/greeting`  | 200, rewrite                                         |
| `/coming-soon`     | 200, rewrite 없음                                    |
| `/robots.txt`      | rewrite 없음 (파일이 아직 없어 404)                  |

- 브라우저(360px · 1280px)에서 `/research/papers`에 들어가도 주소가 그대로이고, 준비 중 화면 h1이 보이며, 콘솔 오류가 없다

**staging 조건** (`VERCEL_ENV=preview`, 스위치 없음)

- `/`는 기존 임시 홈이고, 모든 응답에 `X-Robots-Tag: noindex, nofollow`가 붙는다

**화면** (BUILD 중 개발 서버에서 Playwright 스크립트로 확인)

- 가로 스크롤이 없다 (360 · 1280)
- '동작 줄이기'에서 움직이는 요소가 0개다
- 표어에 마우스를 올리면 한글 opacity가 1이 된다

## 남은 위험

- 운영 canonical은 Vercel 운영 환경에 `NEXT_PUBLIC_SITE_URL=https://rtf.or.kr`이 있어야 맞다. 로컬에서는 `http://localhost:3000`으로 나온다
- 스크롤 연동 효과(`animation-timeline: view()`)는 Chromium에서만 확인했다. 지원하지 않는 브라우저(Safari 등)에서는 효과 없이 바로 보인다 (`@supports`로 감쌌다)
- rewrite 자체는 E2E에 없다. E2E 서버에 환경변수가 없어서다. 단위 테스트와 위 수동 확인으로 대신했다
