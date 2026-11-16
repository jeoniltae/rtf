import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // next dev가 AGENTS.md를 자동 생성하지 않도록 (에이전트 문서는 직접 관리)
  agentRules: false,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
