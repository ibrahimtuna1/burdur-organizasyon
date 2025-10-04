// app/api/admin/auth/login/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// ---- types
type LoginBody = { email: string; password: string };
type UserRoleRow = { role: string | null };

function isLoginBody(x: unknown): x is LoginBody {
  if (!x || typeof x !== "object") return false;
  const b = x as Record<string, unknown>;
  return typeof b.email === "string" && typeof b.password === "string";
}

function makeSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon, { auth: { persistSession: false } });
}
function makeSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const svc = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !svc) return null;
  return createClient(url, svc, { auth: { persistSession: false } });
}

export async function POST(req: Request) {
  try {
    const bodyUnknown = (await req.json().catch(() => null)) as unknown;
    if (!isLoginBody(bodyUnknown)) {
      return NextResponse.json({ error: "Geçersiz gövde" }, { status: 400 });
    }
    const { email, password } = bodyUnknown;

    // lazy clients
    const supabase = makeSupabase();
    const supabaseAdmin = makeSupabaseAdmin();
    if (!supabase || !supabaseAdmin) {
      // build/preview ortamında env yoksa buraya düşecek
      return NextResponse.json(
        { error: "Sunucu yapılandırması eksik (Supabase env)." },
        { status: 500 }
      );
    }

    // 1) şifre doğrulama
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data?.user) {
      console.error("🔴 Supabase login error:", error?.message, error);
      return NextResponse.json({ error: "E-posta ya da şifre hatalı." }, { status: 401 });
    }

    // 2) rol kontrolü
    const { data: profile, error: pErr } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle<UserRoleRow>();

    if (pErr) {
      console.error("🔴 Supabase profile error:", pErr.message, pErr);
      return NextResponse.json({ error: "Rol okunamadı." }, { status: 500 });
    }

    if (!profile?.role) {
      console.warn("⚠️ Kullanıcıda rol yok:", data.user.id, email);
      return NextResponse.json({ error: "Bu hesaba rol atanmadı." }, { status: 403 });
    }

    // 3) cookie
    const res = NextResponse.json({ ok: true, role: profile.role });
    res.cookies.set("admin_session", profile.role, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 30,
    });
    return res;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("🔥 Sunucu hatası:", msg);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
