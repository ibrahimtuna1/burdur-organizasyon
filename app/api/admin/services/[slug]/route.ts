// app/api/admin/services/[slug]/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/serverAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = { slug: string };

type ServiceRow = {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
  description: string | null;
  order_no: number | null;
  is_published: boolean;
  is_archived: boolean | null;
  keywords: string[] | null;
};

type ServiceUpdate = {
  title: string;
  description: string | null;
  image_url: string | null;
  order_no: number | null;
  is_published: boolean;
  is_archived: boolean | null;
  keywords: string[] | null;
};

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

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
    .maybeSingle<ServiceRow>();

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

  const raw = (await req.json().catch(() => null)) as unknown;
  const body = isRecord(raw) ? raw : {};

  const title =
    typeof body.title === "string" && body.title.trim() ? body.title : undefined;

  const description =
    typeof body.description === "string"
      ? body.description
      : body.description === null
      ? null
      : undefined;

  const image_url =
    typeof body.image_url === "string"
      ? body.image_url
      : body.image_url === null
      ? null
      : undefined;

  let order_no: number | null | undefined;
  const orderRaw = body.order_no;
  if (typeof orderRaw === "number") order_no = orderRaw;
  else if (typeof orderRaw === "string" && orderRaw.trim() !== "")
    order_no = Number(orderRaw);
  else if (orderRaw === null) order_no = null;

  const is_published =
    typeof body.is_published === "boolean" ? body.is_published : undefined;

  const is_archived =
    typeof body.is_archived === "boolean"
      ? body.is_archived
      : body.is_archived === null
      ? null
      : undefined;

  const kwRaw = body.keywords;
  const keywords =
    Array.isArray(kwRaw)
      ? kwRaw
          .map((s: unknown) => String(s).trim())
          .filter((s) => s.length > 0)
      : kwRaw === null
      ? null
      : undefined;

  const payload: Partial<ServiceUpdate> = {
    title,
    description,
    image_url,
    order_no,
    is_published,
    is_archived,
    keywords,
  };

  // undefined olan key'leri temizle
  for (const k of Object.keys(payload) as (keyof typeof payload)[]) {
    if (payload[k] === undefined) delete payload[k];
  }

  const { data, error } = await supabaseAdmin
    .from("services")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("slug", slug)
    .select(
      "id,slug,title,keywords,is_published,is_archived,order_no"
    )
    .maybeSingle<ServiceRow>();

  if (error) {
    console.error("[api/admin/services/:slug:patch]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
