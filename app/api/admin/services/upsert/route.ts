// app/api/admin/services/upsert/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/serverAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

/* ---------- helpers ---------- */
function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}
const asStr = (v: unknown) => (typeof v === "string" ? v : undefined);
const asStrOrNull = (v: unknown) =>
  typeof v === "string" ? v : v === null ? null : undefined;
const asNumOrNull = (v: unknown) =>
  typeof v === "number"
    ? v
    : typeof v === "string" && v.trim() !== ""
    ? Number(v)
    : v === null
    ? null
    : undefined;
const asBool = (v: unknown, fallback: boolean) =>
  typeof v === "boolean" ? v : fallback;

type UpsertReturn = { id: string; slug: string };

export async function POST(req: Request) {
  // auth
  if ((await cookies()).get("admin_session")?.value !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // body parse
  const raw = (await req.json().catch(() => null)) as unknown;
  const b = isRecord(raw) ? raw : {};

  // fields
  const title = (asStr(b.title) ?? "").trim();
  const slug = (asStr(b.slug) ?? "").trim();
  const image_url = asStrOrNull(b.image_url) ?? null;
  const description = asStrOrNull(b.description) ?? null;
  const order_no = asNumOrNull(b.order_no) ?? 1000;
  const is_published = asBool(b.is_published, true);
  const is_archived = asBool(b.is_archived, false);
  const keywords = Array.isArray(b.keywords)
    ? b.keywords.map((s) => String(s).trim()).filter(Boolean)
    : null;

  if (!title || !slug) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const payload = {
    title,
    slug,
    image_url,
    description,
    order_no,
    is_published,
    is_archived,
    keywords, // text[] kolonu
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from("services")
    .upsert(payload, { onConflict: "slug" })
    .select("id,slug")
    .maybeSingle<UpsertReturn>();

  if (error) {
    console.error("[api/admin/services:upsert]", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, id: data?.id, slug: data?.slug });
}
