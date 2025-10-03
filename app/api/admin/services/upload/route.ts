// app/api/admin/services/upload/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/serverAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = process.env.SUPABASE_BUCKET_SERVICES || "services";

async function ensureBucket(name: string) {
  // listele
  const { data: list, error: listErr } = await supabaseAdmin.storage.listBuckets();
  if (listErr) throw listErr;
  const exists = (list || []).some((b) => b.name === name);
  if (exists) return;

  // yoksa oluştur (public)
  const { error: createErr } = await supabaseAdmin.storage.createBucket(name, {
    public: true,           // public URL ile göstereceğiz
    fileSizeLimit: "20MB",  // opsiyonel
  });
  if (createErr) throw createErr;
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_session")?.value !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const serviceId = form.get("serviceId") as string | null;

    if (!file) return NextResponse.json({ error: "file is required" }, { status: 400 });
    if (!serviceId) return NextResponse.json({ error: "serviceId is required" }, { status: 400 });

    // BUCKET garanti
    await ensureBucket(BUCKET);

    const buf = Buffer.from(await file.arrayBuffer());
    const ext = (file.name.split(".").pop() || "bin").toLowerCase();
    const filename = `${serviceId}/${Date.now()}.${ext}`;

    const { data: up, error: upErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(filename, buf, {
        contentType: file.type || "application/octet-stream",
        upsert: true,
      });
    if (upErr) {
      console.error("[upload:storage]", upErr);
      return NextResponse.json({ error: upErr.message }, { status: 500 });
    }

    const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(up.path);
    const publicUrl = pub.publicUrl;

    await supabaseAdmin
      .from("services")
      .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
      .eq("id", serviceId);

    return NextResponse.json({ url: publicUrl, path: up.path });
  } catch (e: any) {
    console.error("[upload:catch]", e);
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 });
  }
}
