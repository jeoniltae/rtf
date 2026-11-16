# 작업 목록

개발 작업만 관리한다. 기획 결정과 포럼에서 받을 자료는 노션 화면설계서 11-2 '남은 일'에서 관리한다.

- 항목에는 **무엇을 할지만** 적는다. 이유와 배경은 `docs/context-notes.md` 또는 `docs/features/`에 적는다.
- 항목을 끝내면 체크하고, 그 과정에서 내린 결정이 있으면 `docs/context-notes.md`에 이유를 남긴다.
- 분량이 커진 항목은 `docs/features/<기능>.md`로 분리한다.

## 미결정

- [ ] 기능별 폴더 구조 (`src/features/` 도입 여부)
- [ ] 테스트 도구 도입 여부

요금제 · 디자인 톤 · 모션 규칙 등 기획 결정은 노션 화면설계서 11-2에서 관리한다.

## 환경 · 배포

- [x] 개발 환경 초기 세팅 (2026-11-16)
- [ ] Supabase 프로젝트 생성 → `.env.local` 작성, `supabase link`
- [ ] Vercel 프로젝트 연결, Node.js 버전 맞추기, Vercel Authentication 끄기
- [ ] `staging` 브랜치 생성 + staging.rtf.or.kr 연결, Preview 환경에 `PREVIEW_PASSWORD`
- [ ] rtf.or.kr DNS 연결 (등록업체 계정 권한 받기) + '준비 중' 화면
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
- [ ] Tiptap에 HWP · 워드 문서 붙여넣기 시험
- [ ] 지난 포럼(1~27차) 초기 데이터 입력

## 자료 대기

포럼에서 받을 자료(인사말, 임원 명단, 로고 등)는 노션 화면설계서 11-2에서 관리한다.
https://app.notion.com/p/40e45580eb6b8188a778f988146df5fd
