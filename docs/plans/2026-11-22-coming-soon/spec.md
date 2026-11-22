# 준비 중 화면 (ERR-01)

- 작성일: 2026-11-22
- 상태: 승인됨

## 배경 / 문제

rtf.or.kr은 오픈 전까지 '준비 중' 화면만 보여 준다(노션 화면설계서 6장 ERR-01, 9-6 배포). 지금 `src/app/page.tsx`는 제목 한 줄과 안내 문장뿐인 임시 화면이라 포럼의 무게감이 없고, 책자를 보고 찾아온 사람이 연락처·소식 창구를 찾을 수 없다.

또 `page.tsx`에 준비 중 화면을 바로 넣으면, 나중에 진짜 홈 화면(MAIN-01)을 만들 때 `main` · `staging` 브랜치가 같은 파일로 부딪힌다. 개발 중인 화면을 staging에서 보면서도 운영(rtf.or.kr)에는 준비 중 화면만 보이게 할 방법이 필요하다.

## 목표

- 캔버스 시안 C(학술지 느낌)를 그대로 옮긴 준비 중 화면을 만든다 — 로고, 소개 문구, 포럼 소개 표, 밴드·전화 버튼, 라틴어 표어, 애니메이션
- 운영 환경변수 하나로 사이트 전체를 준비 중 화면으로 바꾸고, 오픈 당일 그 값만 끄면 원래 화면이 나오게 한다
- 오픈 전에도 검색엔진에 rtf.or.kr이 노출되게 한다
- staging은 비밀번호 유무와 상관없이 검색에서 제외한다

## 비목표 (이번에 하지 않는 것)

- 진짜 홈 화면(MAIN-01)과 현재 임시 `page.tsx` · `e2e/home.spec.ts` 변경
- Supabase 연결, `site_settings`에서 내용 불러오기 — 고정 글로 충분 (ponytail 점검: DB를 붙일 이유 없음)
- OG(공유 미리보기) 이미지
- 대표 이메일 표기 — 아직 확정 전이라 넣지 않음
- 오픈 카운트다운 · D-day · 소식 메일 신청 같은 추가 기능 (검토했지만 범위 밖)
- 로고 벡터(SVG) 재작업과 로고 '쓰기' 애니메이션(시안 검토 1번)
- 오픈 후 `/coming-soon` 경로 정리 — 그때 지울지 검색 제외로 바꿀지 정한다
- staging 비밀번호(`PREVIEW_PASSWORD`) 설정 — 로그인·가입 기능을 staging에 올릴 때 넣는다 (코드 변경 없음)

## 사용자 시나리오

1. **책자를 본 성도** → 휴대폰(360px)으로 rtf.or.kr 접속 → 준비 중 화면이 열림 → 로고·"새 홈페이지를 준비하고 있습니다"·소개 표를 읽고, \[전화 문의\]를 누르면 전화 앱이 02-941-2019로 열리는지 확인
2. **예전에 받은 상세 주소로 온 방문자** → `rtf.or.kr/research/papers` 접속 → 주소창은 그대로인 채 같은 준비 중 화면이 보이는지 확인
3. **소식을 보려는 방문자** → \[네이버 밴드에서 소식 보기\] 클릭 → 새 탭에서 `https://band.us/band/57603243`이 열리는지 확인
4. **'동작 줄이기'를 켠 사용자** → 준비 중 화면 접속 → 아무것도 움직이지 않고 모든 내용이 처음부터 보이는지 확인
5. **PC 방문자** → 1280px 화면으로 접속 → 왼쪽 안내·오른쪽 소개 표 2단 배치, 버튼 마우스 올림 효과, 표어에 마우스를 올리면 한글 번역이 보이는지 확인
6. **개발자(제이)** → 로컬 또는 staging에서 `/coming-soon` 직접 접속 → 준비 중 화면이 보이고, 다른 주소는 개발 중인 화면이 그대로 보이는지 확인
7. **오픈 당일 제이** → Vercel 운영 환경에서 `SITE_COMING_SOON`을 지우고 재배포 → rtf.or.kr이 원래 화면으로 바뀌는지 확인

## 설계 요약

**켜고 끄기** (대화에서 확정)

- 환경변수 `SITE_COMING_SOON` — 값이 정확히 `"true"`일 때만 켜짐. **Vercel 운영(Production) 환경에만** 넣는다
- 준비 중 화면은 별도 경로 `src/app/coming-soon/page.tsx`
- `src/proxy.ts` 처리 순서: ① staging 비밀번호 확인(기존) ② 켜져 있고 주소가 `/coming-soon`이 아니며 확장자 없는 주소면 `/coming-soon`으로 **rewrite**(주소 유지, Supabase 세션 갱신 생략) ③ 그 밖에는 기존처럼 세션 갱신
- rewrite 여부 판단은 순수 함수로 분리해 Vitest로 검사한다
- 응답 코드는 200. 503은 오래 두면 검색엔진이 사이트를 내릴 수 있어 쓰지 않음
- 검토했지만 버린 안: 다른 주소를 `/`로 redirect(B안) — 책자 등에 적힌 상세 주소가 홈으로 튕김

**검색 노출** (대화에서 확정)

- 운영은 노출. 제목·설명은 `layout.tsx` 기본값 사용, canonical은 `/` (Vercel 운영에 `NEXT_PUBLIC_SITE_URL=https://rtf.or.kr` 필요)
- staging 검색 제외 조건을 `PREVIEW_PASSWORD` 유무에서 **`VERCEL_ENV === "preview"`** 로 바꾼다 — 비밀번호 없이 시작하는 staging도 제외되도록
- 검토했지만 버린 안: 오픈 전 noindex(B안) — 오픈 후 재수집까지 시간이 걸림

**화면 · 코드 배치** (대화에서 확정)

- `src/widgets/coming-soon/` — `ui/ComingSoon.tsx`(Server Component, 클라이언트 JS 없음) + `index.ts`
- `src/shared/config/site.ts` — 기관명, 사무총장, 주소, 전화, 밴드 주소 상수 (푸터·ABT-05에서 재사용)
- 로고 `next/image`로 `/rtf-logo.png`, `priority`, alt "RTF Reformed Theological Forum"
- 글꼴은 Pretendard 하나. 라틴어 표어는 기울이지 않고 자간만 넓힘
- 버건디 #7B1E26은 `globals.css` `@theme`의 `--color-rtf-accent` 하나로 등록 (shadcn 기본 색 설정은 그대로)
- 밴드 링크는 새 탭(`target="_blank" rel="noopener noreferrer"`), 전화는 `tel:029412019`

**문구** (대화에서 확정 — 시안 C 최종본)

- 머리말: 로고 · "개혁신학포럼" · "Since 2010"
- NOTICE / "새 홈페이지를 / 준비하고 있습니다"
- 소개: "종교개혁의 전통을 계승하여 개혁파 신학을 연구하고, 그 가르침을 오늘의 교회와 삶에 바르게 적용하고자 합니다. 그동안의 포럼 발제와 연구를 정리하여 곧 이곳에서 나누겠습니다."
- 버튼: \[네이버 밴드에서 소식 보기 →\] \[전화 문의\]
- 소개 표: 창립 2010년 12월 / 신앙 표준 웨스트민스터 신앙고백 (1647년 초판) / 연구 분야 성경신학 · 조직신학 · 역사신학 · 실천신학 · 교회와 사회 / 사무실 서울 은평구 진관3로 22 이로운프라자 601호 / 문의 02-941-2019
- 푸터: "Ecclesia reformata, semper reformanda" ↔ "개혁된 교회는 항상 개혁되어야 한다" · "© 개혁신학포럼 · 사무총장 공성권"
- 모바일: 단어 단위 줄바꿈(`word-break: keep-all`), 버튼 같은 폭, 위쪽 여백 모바일 40px · PC 72px

**애니메이션** (대화에서 확정 — 모두 `motion-safe:`, CSS만)

| 효과                    | 값                                                                    |
| ----------------------- | --------------------------------------------------------------------- |
| 맨 위 버건디 띠 그어짐  | 1.2초                                                                 |
| 제목 두 줄 올라옴       | 줄마다 1.1초, 0.35초 간격 (0.15초 뒤 시작)                            |
| 소개 문단 · 버튼 나타남 | 0.9초, 1.1초 뒤 시작                                                  |
| NOTICE 점 퍼짐          | 2.2초 × 2번, 0.8초 뒤 시작                                            |
| 표어 라틴어 ↔ 한글      | 4.9초 한 번(한글 약 3초), 1초 뒤 시작. 이후 마우스 올림 · 탭으로 한글 |
| 소개 표 줄 · 구분선     | 스크롤 연동(`animation-timeline: view()`), 지원 브라우저에서만        |
| 버튼 채우기 · 화살표    | 0.45초 (마우스 올림 · 포커스)                                         |

자동으로 움직이는 효과는 모두 5초 안에 끝난다(WCAG 2.2.2).

## 영향 범위

- **화면:** ERR-01 준비 중 화면 (노션 화면설계서 6장 ERR-01, 9-6 배포 · 도메인)
- **권한:** 화면설계서 8장 기준 비회원 · 가입자 · 관리자 모두 같은 화면 (권한 구분 없음)
- **데이터:** 없음 (DB 미사용, 화면설계서 10장 테이블 사용 안 함)
- **FSD 슬라이스:** 새로 `widgets/coming-soon`, `shared/config` (site.ts)
- **파일:**
  - 새로 만듦 — `src/app/coming-soon/page.tsx`, `src/widgets/coming-soon/`, `src/shared/config/site.ts`, rewrite 판단 함수와 `*.test.ts`, `e2e/coming-soon.spec.ts`
  - 고침 — `src/proxy.ts`, `src/app/globals.css`(`@theme` 색 · 키프레임), `.env.example`(`SITE_COMING_SOON` 설명)
  - 그대로 — `src/app/page.tsx`, `e2e/home.spec.ts`
- **배포 설정 (코드 밖):** Vercel 운영 환경에 `SITE_COMING_SOON=true`, `NEXT_PUBLIC_SITE_URL=https://rtf.or.kr`
- **문서:** `AGENTS.md`(환경변수 · 구조), `docs/todo.md`

## 성공 기준

- [ ] `SITE_COMING_SOON=true`면 `/`, `/research/papers` 등 어떤 주소로 와도 주소가 유지된 채 준비 중 화면이 나오고, 값이 없으면 원래 화면이 나온다
- [ ] `/coming-soon`과 확장자가 있는 주소(`/robots.txt` 등)는 rewrite되지 않는다
- [ ] 모바일 360px · PC 1280px에서 시안 C의 구성 · 문구가 보이고, 밴드 링크(새 탭) · `tel:` 링크가 맞다
- [ ] '동작 줄이기' 상태에서 아무것도 움직이지 않고 모든 내용이 처음부터 보인다
- [ ] 운영 응답에는 canonical `/`이 있고, `VERCEL_ENV=preview`인 응답에는 `X-Robots-Tag: noindex`가 붙는다
- [ ] `npm test`, `lint`(ESLint + Steiger), `typecheck`, `build`, `test:e2e`가 모두 통과한다

## 열린 질문

없음. (오픈 후 `/coming-soon` 경로 정리 방법은 비목표 — 오픈 시점에 결정)
