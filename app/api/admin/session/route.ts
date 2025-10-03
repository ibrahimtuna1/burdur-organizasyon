import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "no token" }, { status: 401 });
  }

  // İstekten gelen JWT ile supabase client oluştur
  const supabase = createClient(SB_URL, SB_ANON, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  });

  const { data: authData, error: uErr } = await supabase.auth.getUser();
  if (uErr || !authData?.user) {
    return NextResponse.json({ error: "invalid user" }, { status: 401 });
  }

  const user = authData.user;

  // Kullanıcı admin mi?
  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  if (!adminRow) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Admin: HttpOnly cookie yaz
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", "admin", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 gün
  });
  return res;
}
