// shared/api 공개 진입점 — 브라우저(Client Component)에서도 쓸 수 있는 것만 내보낸다. 서버 전용은 index.server.ts
export { createClient as createSupabaseBrowserClient } from "./supabase/client";
