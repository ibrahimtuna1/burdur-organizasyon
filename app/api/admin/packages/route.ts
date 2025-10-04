import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/serverAdmin";

const ensure = async () => {
  const c = await cookies();
  if (c.get("admin_session")?.value !== "admin") {
    return false;
  }
  return true;
};

export const dynamic = "force-dynamic";

export async function GET() {
  const ok = await ensure();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: cats } = await supabaseAdmin
    .from("service_categories")
    .select("id,title,slug,order_no,is_published,archived_at")
    .order("order_no");

  const { data: packs } = await supabaseAdmin
    .from("service_packages")
    .select(
      "id,category_id,title,subtitle,slug,price,currency,is_featured,is_published,order_no,archived_at,updated_at"
    )
    .order("order_no");

  const { data: feats } = await supabaseAdmin
    .from("package_features")
    .select("id,package_id,text,order_no");

  return NextResponse.json({ cats, packs, feats });
}

export async function POST(req: Request) {
  const ok = await ensure();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  type Body = {
    category_id: string;
    title: string;
    subtitle?: string | null;
    slug?: string | null;
    price?: number;
    currency?: string;
    is_featured?: boolean;
    order_no?: number;
    is_published?: boolean;
    features?: string[];
  };

  const body: Body = await req.json();
  const {
    category_id,
    title,
    subtitle = null,
    slug = null,
    price = 0,
    currency = "TRY",
    is_featured = false,
    order_no = 0,
    is_published = true,
    features = [],
  } = body;

  const insRes = await supabaseAdmin
    .from("service_packages")
    .insert([{ category_id, title, subtitle, slug, price, currency, is_featured, order_no, is_published }])
    .select("id")
    .single();

  if (insRes.error) {
    return NextResponse.json({ error: insRes.error.message }, { status: 400 });
  }

  if (features.length) {
    const rows = features.map((t, i) => ({ package_id: insRes.data!.id, text: t, order_no: i + 1 }));
    await supabaseAdmin.from("package_features").insert(rows);
  }

  return NextResponse.json({ ok: true, id: insRes.data!.id });
}
