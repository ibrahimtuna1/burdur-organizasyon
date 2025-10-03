import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/serverAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = { slug: string };

// GET /api/admin/services/:slug
export async function GET(
  _req: Request,
  ctx: { params: Promise<Params> } // Next 15: params Promise
) {
  const { slug } = await ctx.params;

  const cookieStore = await cookies();
  if (cookieStore.get("admin_session")?.value !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("services")
    .select(
      "id,title,slug,image_url,description,order_no,is_published,is_archived,keywords"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[api/admin/services/:slug:get]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(data);
}

// PATCH /api/admin/services/:slug
export async function PATCH(req: Request, ctx: { params: Promise<Params> }) {
  const { slug } = await ctx.params;

  const cookieStore = await cookies();
  if (cookieStore.get("admin_session")?.value !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({} as any));

  const payload: Partial<{
    title: string;
    description: string | null;
    image_url: string | null;
    order_no: number | null;
    is_published: boolean;
    is_archived: boolean | null;
    keywords: string[] | null;
  }> = {
    title: body.title,
    description: body.description,
    image_url: body.image_url,
    order_no:
      typeof body.order_no === "number" ? body.order_no : Number(body.order_no ?? 1000),
    is_published: typeof body.is_published === "boolean" ? body.is_published : undefined,
    is_archived: typeof body.is_archived === "boolean" ? body.is_archived : undefined,
    keywords: Array.isArray(body.keywords)
      ? body.keywords.map((s: unknown) => String(s).trim()).filter(Boolean)
      : body.keywords === null
      ? null
      : undefined,
  };

  // undefined olan key'leri temizle
  for (const k of Object.keys(payload) as (keyof typeof payload)[]) {
    if (payload[k] === undefined) delete payload[k];
  }

  const { data, error } = await supabaseAdmin
    .from("services")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("slug", slug)
    .select("id,slug,title,keywords,is_published,is_archived,order_no")
    .maybeSingle();

  if (error) {
    console.error("[api/admin/services/:slug:patch]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
