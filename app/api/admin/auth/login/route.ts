// app/api/admin/auth/login/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// ---- Types
type LoginBody = { email: string; password: string };
function isLoginBody(x: unknown): x is LoginBody {
  if (!x || typeof x !== "object") return false;
  const b = x as Record<string, unknown>;
  return typeof b.email === "string" && typeof b.password === "string";
}
type UserRoleRow = { role: string | null };

// ---- Supabase clients (server'da session tutma yok)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function POST(req: Request) {
  try {
    // 1) Body doğrulama
    const bodyUnknown = (await req.json().catch(() => null)) as unknown;
    if (!isLoginBody(bodyUnknown)) {
      return NextResponse.json({ error: "Geçersiz gövde" }, { status: 400 });
    }
    const { email, password } = bodyUnknown;

    // 2) Şifre doğrulama
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data?.user) {
      console.error("🔴 Supabase login error:", error?.message, error);
      return NextResponse.json({ error: "E-posta ya da şifre hatalı." }, { status: 401 });
    }

    // 3) Rol kontrolü (users tablosu)
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

    // 4) Cookie yaz
    const res = NextResponse.json({ ok: true, role: profile.role });
    res.cookies.set("admin_session", profile.role, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 30, // 30 dk
    });
    console.log("✅ Login başarılı:", email, "rol:", profile.role);
    return res;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("🔥 Sunucu hatası:", msg);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
