// 오픈 전 준비 중 화면 블록(ERR-01, 시안 C) — 클라이언트 JS 없이 CSS 모션만 쓴다
import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import {
  BAND_URL,
  FOUNDED_LABEL,
  FOUNDED_YEAR,
  OFFICE_ADDRESS,
  PHONE,
  SECRETARY_GENERAL,
  SITE_NAME,
  SITE_NAME_EN,
} from "@/shared/config";

const FACTS = [
  { label: "창립", value: FOUNDED_LABEL },
  { label: "신앙 표준", value: "웨스트민스터 신앙고백 (1647년 초판)" },
  {
    label: "연구 분야",
    value: "성경신학 · 조직신학 · 역사신학 · 실천신학 · 교회와 사회",
  },
  { label: "사무실", value: OFFICE_ADDRESS },
] as const;

const BUTTON_BASE =
  "group/btn inline-flex min-h-12 flex-[1_1_200px] items-center justify-center gap-2 bg-[length:0%_100%] bg-no-repeat px-6 text-base font-medium no-underline hover:bg-[length:100%_100%] focus-visible:bg-[length:100%_100%] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rtf-accent motion-safe:transition-[background-size] motion-safe:duration-450";

export function ComingSoon() {
  return (
    <div className="flex flex-1 flex-col bg-white wrap-break-word break-keep text-neutral-900">
      <div
        aria-hidden="true"
        className="h-1.5 flex-none origin-left bg-rtf-accent motion-safe:animate-rtf-draw"
      />

      <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-neutral-300 px-[6%] py-6">
        <div className="flex items-center gap-5">
          <Image
            src="/rtf-logo.png"
            alt={`RTF ${SITE_NAME_EN}`}
            width={1195}
            height={420}
            preload
            className="h-14 w-auto"
          />
          <p className="border-l border-neutral-300 pl-5 text-xl font-bold tracking-[0.04em]">
            {SITE_NAME}
          </p>
        </div>
        <p className="text-[13px] tracking-[0.08em] text-neutral-600">
          Since {FOUNDED_YEAR}
        </p>
      </header>

      <main className="flex flex-1 flex-col gap-12 px-[6%] pt-10 pb-14 lg:flex-row lg:items-start lg:gap-18 lg:pt-18">
        <div className="flex flex-1 flex-col gap-5">
          <p className="flex items-center gap-2.5 text-[13px] font-bold tracking-[0.2em] text-rtf-accent">
            <span
              aria-hidden="true"
              className="relative size-2 rounded-full bg-rtf-accent after:absolute after:inset-0 after:rounded-full after:bg-inherit motion-safe:after:animate-rtf-ping"
            />
            NOTICE
          </p>
          <h1 className="text-[clamp(34px,4.4vw,54px)] leading-[1.3] font-bold">
            <span className="block motion-safe:animate-rtf-rise">
              새 홈페이지를
            </span>
            <span className="block motion-safe:animate-rtf-rise motion-safe:[animation-delay:0.5s]">
              준비하고 있습니다
            </span>
          </h1>
          <p className="text-[17px] leading-[1.9] text-neutral-700 motion-safe:animate-rtf-fade">
            종교개혁의 전통을 계승하여 개혁파 신학을 연구하고, 그 가르침을
            오늘의 교회와 삶에 바르게 적용하고자 합니다. 그동안의 포럼 발제와
            연구를 정리하여 곧 이곳에서 나누겠습니다.
          </p>
          <div className="mt-3 flex flex-wrap gap-3 motion-safe:animate-rtf-fade">
            <a
              href={BAND_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                BUTTON_BASE,
                "bg-rtf-accent bg-linear-to-r from-black/28 to-black/28 text-white",
              )}
            >
              네이버 밴드에서 소식 보기
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                className="fill-none stroke-current stroke-[1.6] group-hover/btn:translate-x-1 group-focus-visible/btn:translate-x-1 motion-safe:transition-transform motion-safe:duration-450 [&_path]:[stroke-linecap:round] [&_path]:[stroke-linejoin:round]"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
            <a
              href={PHONE.href}
              className={cn(
                BUTTON_BASE,
                "border border-neutral-900 bg-linear-to-r from-neutral-100 to-neutral-100 text-neutral-900",
              )}
            >
              전화 문의
            </a>
          </div>
        </div>

        <dl className="flex flex-1 flex-col border-t-2 border-neutral-900">
          {FACTS.map(({ label, value }) => (
            <Row key={label} label={label}>
              {value}
            </Row>
          ))}
          <Row label="문의">
            <a
              href={PHONE.href}
              className="hover:text-rtf-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rtf-accent"
            >
              {PHONE.label}
            </a>
          </Row>
        </dl>
      </main>

      <footer className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-neutral-300 px-[6%] pt-6 pb-8">
        <p
          tabIndex={0}
          className="group/motto grid cursor-default text-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rtf-accent"
        >
          <span
            lang="la"
            className="text-[19px] tracking-[0.06em] [grid-area:1/1] group-hover/motto:animate-none group-hover/motto:opacity-0 group-focus/motto:animate-none group-focus/motto:opacity-0 motion-safe:animate-rtf-motto-out motion-safe:transition-opacity motion-safe:duration-400"
          >
            Ecclesia reformata, semper reformanda
          </span>
          <span className="self-center text-base font-semibold opacity-0 [grid-area:1/1] group-hover/motto:animate-none group-hover/motto:opacity-100 group-focus/motto:animate-none group-focus/motto:opacity-100 motion-safe:animate-rtf-motto-in motion-safe:transition-opacity motion-safe:duration-400">
            개혁된 교회는 항상 개혁되어야 한다
          </span>
        </p>
        <p className="text-[13px] text-neutral-600">
          © {SITE_NAME} · 사무총장 {SECRETARY_GENERAL}
        </p>
      </footer>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rtf-row relative flex flex-wrap gap-x-6 gap-y-1 py-4.5 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-neutral-300">
      <dt className="flex-[0_0_96px] text-sm font-bold">{label}</dt>
      <dd className="flex-[1_1_200px] text-base leading-[1.7] text-neutral-700">
        {children}
      </dd>
    </div>
  );
}
