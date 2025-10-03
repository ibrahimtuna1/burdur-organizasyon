import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/serverAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  if ((await cookies()).get("admin_session")?.value !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({} as any));

  const keywords =
    Array.isArray(body.keywords)
      ? body.keywords.map((s: unknown) => String(s).trim()).filter(Boolean)
      : null;

  const payload = {
    // id yoksa upsert zaten slug üstünden eşleşecek
    title: String(body.title || "").trim(),
    slug: String(body.slug || "").trim(),
    image_url: body.image_url || null,
    description: body.description ?? null,
    order_no:
      typeof body.order_no === "number" ? body.order_no : Number(body.order_no ?? 1000),
    is_published: Boolean(body.is_published ?? true),
    is_archived: typeof body.is_archived === "boolean" ? body.is_archived : false,
    keywords, // text[] kolon
    updated_at: new Date().toISOString(),
  };

  if (!payload.slug || !payload.title) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("services")
    .upsert(payload, { onConflict: "slug" })
    .select("id,slug")
    .single();

  if (error) {
    console.error("[api/admin/services:upsert]", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, id: data?.id, slug: data?.slug });
}
