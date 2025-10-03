// app/api/admin/services/upload/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/serverAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = (process.env.SUPABASE_BUCKET_SERVICES || "services").trim();

async function ensureBucket(name: string) {
  const { data: list, error: listErr } = await supabaseAdmin.storage.listBuckets();
  if (listErr) throw listErr;
  const buckets = (list ?? []) as Array<{ name: string }>;
  if (buckets.some((b) => b.name === name)) return;

  const { error: createErr } = await supabaseAdmin.storage.createBucket(name, {
    public: true,
    fileSizeLimit: "20MB",
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
    const file = form.get("file");
    const serviceId = form.get("serviceId");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }
    if (typeof serviceId !== "string" || !serviceId.trim()) {
      return NextResponse.json({ error: "serviceId is required" }, { status: 400 });
    }

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

    if (upErr || !up) {
      console.error("[upload:storage]", upErr);
      return NextResponse.json({ error: upErr?.message ?? "Upload failed" }, { status: 500 });
    }

    // getPublicUrl: error yok, sadece data döner
    const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(up.path);
    const publicUrl = pub.publicUrl;

    const { error: updErr } = await supabaseAdmin
      .from("services")
      .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
      .eq("id", serviceId);

    if (updErr) {
      console.error("[upload:update-row]", updErr);
      return NextResponse.json({ error: updErr.message }, { status: 500 });
    }

    return NextResponse.json({ url: publicUrl, path: up.path });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[upload:catch]", message);
    return NextResponse.json({ error: message || "Unknown error" }, { status: 500 });
  }
}
