// 오픈 전 준비 중 화면으로 rewrite할 주소인지 판단한다 (proxy.ts에서 사용)
export const COMING_SOON_PATH = "/coming-soon";

export function shouldShowComingSoon(
  pathname: string,
  flag: string | undefined,
): boolean {
  if (flag !== "true") return false;
  if (
    pathname === COMING_SOON_PATH ||
    pathname.startsWith(`${COMING_SOON_PATH}/`)
  )
    return false;
  const lastSegment = pathname.slice(pathname.lastIndexOf("/") + 1);
  return !lastSegment.includes("."); // robots.txt 같은 파일 주소는 그대로 둔다
}
