import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/shared/api/index.server";
import {
  COMING_SOON_PATH,
  shouldShowComingSoon,
} from "@/shared/lib/coming-soon";

// staging 보호: PREVIEW_PASSWORD는 Vercel Preview 환경에만 넣는다 (운영은 그대로 통과).
function checkPreviewAuth(request: NextRequest) {
  const password = process.env.PREVIEW_PASSWORD;
  if (!password) return null;

  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    try {
      const decoded = atob(auth.slice(6)); // "아이디:비밀번호" — 아이디는 무엇이든 허용
      if (decoded.slice(decoded.indexOf(":") + 1) === password) return null;
    } catch {
      // base64가 아닌 헤더는 500 대신 401로 처리한다
    }
  }

  return new NextResponse("인증이 필요합니다.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="staging", charset="UTF-8"' },
  });
}

export async function proxy(request: NextRequest) {
  const denied = checkPreviewAuth(request);
  if (denied) return denied;

  // 오픈 전: SITE_COMING_SOON=true(운영에만 설정)이면 주소는 그대로 두고 준비 중 화면을 보여 준다.
  const response = shouldShowComingSoon(
    request.nextUrl.pathname,
    process.env.SITE_COMING_SOON,
  )
    ? NextResponse.rewrite(new URL(COMING_SOON_PATH, request.url))
    : await updateSession(request);

  // staging(Vercel Preview)은 비밀번호 유무와 상관없이 검색에서 제외한다.
  if (process.env.VERCEL_ENV === "preview") {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2)$).*)",
  ],
};
