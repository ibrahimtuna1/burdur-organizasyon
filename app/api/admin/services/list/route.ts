import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/serverAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const cookieStore = await cookies();
  const role = cookieStore.get("admin_session")?.value;
  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("services")
    .select(
      "id, slug, title, image_url, description, source_url, is_published, is_archived, order_no, updated_at"
    )
    .order("is_archived", { ascending: true, nullsFirst: true })
    .order("order_no", { ascending: true, nullsFirst: false })
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[api/admin/services/list]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ items: data ?? [] });
}
