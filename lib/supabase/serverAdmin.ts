// lib/supabase/serverAdmin.ts
import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

/**
 * Admin (service role) Supabase client
 * - Yalnızca server’da kullan (RLS bypass eder).
 * - PUBLIC anahtar DEĞİL; "SUPABASE_SERVICE_ROLE_KEY" kullanır.
 */
export const supabaseAdmin: SupabaseClient = (() => {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error(
      "[supabaseAdmin] NEXT_PUBLIC_SUPABASE_URL eksik. .env dosyanı kontrol et."
    );
  }
  if (!serviceKey) {
    throw new Error(
      "[supabaseAdmin] SUPABASE_SERVICE_ROLE_KEY eksik. Bu anahtar sadece server'da tutulmalı."
    );
  }

  _client = createClient(url, serviceKey, {
    auth: {
      persistSession: false, // server için session tutma
      autoRefreshToken: false,
    },
    global: {
      headers: { "X-Client-Info": "admin-server" },
    },
  });

  return _client;
})();

/* -----------------------------------------------------------
   Dikkat:
   - Bu client RLS’i BYPASS eder. Yalnızca güvenli admin işlemlerinde kullan.
   - ASLA client component / "use client" içinde import etme.
   - Route handlers (app/api/*), server actions ve server component’larda kullan.
------------------------------------------------------------ */
