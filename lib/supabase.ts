import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;

/** Read-only client (publishable key) — sees published posts only via RLS. */
export function supabasePublic(): SupabaseClient {
  return createClient(url, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false },
  });
}

/** Admin client (secret key) — bypasses RLS. Server-side only: publish API, seed scripts. */
export function supabaseAdmin(): SupabaseClient {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error("SUPABASE_SECRET_KEY is not set");
  return createClient(url, key, { auth: { persistSession: false } });
}
