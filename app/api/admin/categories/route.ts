import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/serverAdmin";

const ensure = async () => {
  const c = await cookies();
  if (c.get("admin_session")?.value !== "admin")
    throw NextResponse.json({ error: "Unauthorized" }, { status: 401 });
};

export const dynamic = "force-dynamic";

export async function GET() {
  await ensure();
  const { data: cats } = await supabaseAdmin
    .from("service_categories")
    .select("id,title,slug,order_no,is_published,archived_at")
    .order("order_no");

  const { data: packs } = await supabaseAdmin
    .from("service_packages")
    .select("id,category_id,title,subtitle,slug,price,currency,is_featured,is_published,order_no,archived_at,updated_at")
    .order("order_no");

  const { data: feats } = await supabaseAdmin
    .from("package_features")
    .select("id,package_id,text,order_no");

  return NextResponse.json({ cats, packs, feats });
}

export async function POST(req: Request) {
  await ensure();
  const body = await req.json();
  const {
    category_id, title, subtitle = null, slug = null,
    price = 0, currency = "TRY", is_featured = false,
    order_no = 0, is_published = true, features = []
  } = body;

  const { data: ins, error } = await supabaseAdmin
    .from("service_packages")
    .insert([{ category_id, title, subtitle, slug, price, currency, is_featured, order_no, is_published }])
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (Array.isArray(features) && features.length) {
    const rows = features.map((t: string, i: number) => ({ package_id: ins.id, text: t, order_no: i + 1 }));
    await supabaseAdmin.from("package_features").insert(rows);
  }
  return NextResponse.json({ ok: true, id: ins.id });
}
