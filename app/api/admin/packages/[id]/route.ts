import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/serverAdmin";

const ensure = async () => {
  const c = await cookies();
  return c.get("admin_session")?.value === "admin";
};

export const dynamic = "force-dynamic";

/** PUT /api/admin/packages/[id]  -> paket + özellikleri güncelle */
export async function PUT(req: NextRequest, context: unknown) {
  if (!(await ensure())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // context type-safe extract
  const { params } = context as { params: { id: string } };
  const id = params.id;

  type Body = {
    title: string;
    subtitle?: string | null;
    slug?: string | null;
    price: number;
    currency?: string;
    is_featured?: boolean;
    order_no?: number;
    is_published?: boolean;
    features?: string[];
  };

  const body: Body = await req.json();
  const {
    title,
    subtitle = null,
    slug = null,
    price,
    currency = "TRY",
    is_featured = false,
    order_no = 0,
    is_published = true,
    features = [],
  } = body;

  const { error } = await supabaseAdmin.rpc("admin_update_package_with_features", {
    p_id: id,
    p_title: title,
    p_subtitle: subtitle,
    p_slug: slug,
    p_price: price,
    p_currency: currency,
    p_is_featured: is_featured,
    p_order_no: order_no,
    p_is_published: is_published,
    p_features: features,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

/** PATCH /api/admin/packages/[id]  -> arşiv toggle */
export async function PATCH(req: NextRequest, context: unknown) {
  if (!(await ensure())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { params } = context as { params: { id: string } };
  const id = params.id;

  const { archived }: { archived: boolean } = await req.json();

  const { error } = await supabaseAdmin
    .from("service_packages")
    .update({
      archived_at: archived ? new Date().toISOString() : null,
      is_published: archived ? false : true,
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

/** DELETE /api/admin/packages/[id]  -> kalıcı silme */
export async function DELETE(_req: NextRequest, context: unknown) {
  if (!(await ensure())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { params } = context as { params: { id: string } };
  const id = params.id;

  await supabaseAdmin.from("package_features").delete().eq("package_id", id);
  const { error } = await supabaseAdmin.from("service_packages").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
