// shared/api 서버 전용 진입점 — Server Component · Server Action · proxy에서만 import한다
export { createClient as createSupabaseServerClient } from "./supabase/server";
export { updateSession } from "./supabase/proxy";
