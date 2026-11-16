# 작업 결정 기록

결정한 내용과 이유를 최신순으로 남긴다. 기획 단계 결정은 노션 화면설계서 11장 · 기술 스택 문서를 따른다.

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
