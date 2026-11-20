import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/shared/api/index.server";

// staging 보호: PREVIEW_PASSWORD는 Vercel Preview 환경에만 넣는다 (운영은 그대로 통과).
function checkPreviewAuth(request: NextRequest) {
  const password = process.env.PREVIEW_PASSWORD;
  if (!password) return null;

  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    const decoded = atob(auth.slice(6)); // "아이디:비밀번호" — 아이디는 무엇이든 허용
    if (decoded.slice(decoded.indexOf(":") + 1) === password) return null;
  }

  return new NextResponse("인증이 필요합니다.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="staging", charset="UTF-8"' },
  });
}

export async function proxy(request: NextRequest) {
  const denied = checkPreviewAuth(request);
  if (denied) return denied;

  const response = await updateSession(request);
  if (process.env.PREVIEW_PASSWORD) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2)$).*)",
  ],
};
