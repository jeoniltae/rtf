// robots.txt — 모든 수집을 허용한다. staging은 proxy.ts의 noindex 헤더로 막으므로 여기서 막지 않는다
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/shared/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", SITE_URL).href,
  };
}
