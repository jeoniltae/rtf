# 작업 목록

개발 작업만 관리한다. 기획 결정과 포럼에서 받을 자료는 노션 화면설계서 11-2 '남은 일'에서 관리한다.

- 이 파일은 프로젝트 전체 **목차**다. 항목에는 무엇을 할지만 적는다.
- 기능 항목은 `/feature-workflow`로 진행하고, 시작하면 항목 옆에 plan 폴더 링크를 단다. 예: `- [ ] 메인 (MAIN-01) → docs/plans/2026-11-20-main-page/`
- 기능의 세부 작업·설계·결정은 그 기능의 `spec.md` · `plan.md`에 적는다.
- 항목을 끝내면 체크하고, 여러 기능에 걸친 결정이 있었으면 `docs/context-notes.md`에 이유를 남긴다.

## 미결정

- [x] 기능별 폴더 구조 → FSD 경량 적용 + Steiger (2026-11-20)
- [x] 테스트 도구 도입 여부 → Vitest + Playwright (2026-11-20)

요금제 · 디자인 톤 · 모션 규칙 등 기획 결정은 노션 화면설계서 11-2에서 관리한다.

## 환경 · 배포

- [x] 개발 환경 초기 세팅 (2026-11-16)
- [ ] Supabase 프로젝트 생성 → `.env.local` 작성, `supabase link`
- [x] Vercel 프로젝트 연결, Node.js 버전 맞추기(24.x), Vercel Authentication 끄기 (2026-11-22)
- [ ] `staging` 브랜치 생성 + staging.rtf.or.kr 연결
  - `PREVIEW_PASSWORD`(비밀번호 보호)는 처음엔 넣지 않고, 로그인 · 가입 기능을 staging에 올릴 때 넣는다
- [x] rtf.or.kr DNS 연결 (2026-11-22)
  - 카페24 A 레코드를 Vercel로 변경. www는 카페24 기본 별칭이 따라와 `rtf.or.kr`로 308 리다이렉트
  - Vercel 운영 환경에 `SITE_COMING_SOON=true`, `NEXT_PUBLIC_SITE_URL=https://rtf.or.kr` 설정 완료
- [ ] 오픈 날: Vercel 운영의 `SITE_COMING_SOON` 삭제 후 재배포
- [x] '준비 중' 화면 (ERR-01) → docs/plans/2026-11-22-coming-soon/ (2026-11-22)
- [ ] 운영용 외부 SMTP (대표 이메일 확정 후)

## 1차 개발

- [ ] DB 마이그레이션: 화면설계서 10장 테이블 + RLS + GRANT + 제약
- [ ] 공통 레이아웃: 헤더 · 모바일 메뉴 · 푸터 · 서브 화면 틀 (5장)
- [ ] 인증: 로그인 · 회원가입 · 비밀번호 재설정 · 마이페이지 (AUTH, MY)
- [ ] 메인 (MAIN-01)
- [ ] 포럼 소개 (ABT-01~05)
- [ ] 이번 포럼 · 지난 포럼 (EVT-01~04, ARC-01~02)
- [ ] 연구자료 목록 · 상세 · 등록 (RES-01~03) + Tiptap
- [ ] 게시판 공지 · Q&A (BRD-01~03)
- [ ] 통합검색 (SRCH-01, `pg_trgm`)
- [ ] 오류 · 약관 화면 (ERR-01, POL-01)
- [ ] SEO: metadata, sitemap, robots, OG
  - robots.txt · sitemap.xml 기본은 추가함(홈만). 공개 화면을 만들 때마다 `src/app/sitemap.ts`에 넣는다
  - 검색 등록: 구글은 카페24 TXT, 네이버는 `layout.tsx` 메타 태그로 소유 확인 (둘 다 지우지 않는다)
- [ ] Tiptap에 HWP · 워드 문서 붙여넣기 시험
- [ ] 지난 포럼(1~27차) 초기 데이터 입력

## 자료 대기

포럼에서 받을 자료(인사말, 임원 명단, 로고 등)는 노션 화면설계서 11-2에서 관리한다.
https://app.notion.com/p/40e45580eb6b8188a778f988146df5fd
