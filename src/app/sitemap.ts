// sitemap.xml — 공개 화면을 만들 때마다 여기에 추가한다 (지금은 홈만, /coming-soon은 넣지 않는다)
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/shared/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: new URL("/", SITE_URL).href }];
}
