import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/serverAdmin";

const ensure = async () => {
  const c = await cookies();
  if (c.get("admin_session")?.value !== "admin")
    throw NextResponse.json({ error: "Unauthorized" }, { status: 401 });
};

export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await ensure();
  const body = await req.json();
  const {
    title, subtitle, slug, price, currency = "TRY",
    is_featured = false, order_no = 0, is_published = true, features = [] as string[]
  } = body;

  const { error } = await supabaseAdmin.rpc("admin_update_package_with_features", {
    p_id: params.id,
    p_title: title,
    p_subtitle: subtitle,
    p_slug: slug,
    p_price: price,
    p_currency: currency,
    p_is_featured: is_featured,
    p_order_no: order_no,
    p_is_published: is_published,
    p_features: features
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await ensure();
  const { archived } = await req.json(); // true => arşive al, false => çıkar
  const { error } = await supabaseAdmin
    .from("service_packages")
    .update({ archived_at: archived ? new Date().toISOString() : null, is_published: archived ? false : true })
    .eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await ensure();
  // hard delete
  await supabaseAdmin.from("package_features").delete().eq("package_id", params.id);
  const { error } = await supabaseAdmin.from("service_packages").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
