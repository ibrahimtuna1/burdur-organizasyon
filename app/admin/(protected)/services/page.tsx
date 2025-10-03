// app/admin/services/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/serverAdmin";
import ConfirmDelete from "./1components/ConfirmDelete";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ServiceRow = {
  id: string;
  slug: string;
  title: string;
  image_url: string | null;
  description: string | null;
  source_url: string | null;
  order_no: number | null;
  is_published: boolean;
  is_archived?: boolean | null; // yeni kolon (aşağıdaki SQL)
  updated_at: string | null;
};

async function getData(): Promise<ServiceRow[]> {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_session")?.value !== "admin") redirect("/admin/signin");

  const sb = supabaseServer();
  const { data, error } = await sb
    .from("services")
    .select(
      "id, slug, title, image_url, description, source_url, is_published, is_archived, order_no, updated_at"
    )
    .order("is_archived", { ascending: true, nullsFirst: true }) // arşivdekileri alta it
    .order("order_no", { ascending: true, nullsFirst: false })
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[admin/services:list]", error);
    return [];
  }
  return (data ?? []) as ServiceRow[];
}

/* -------- Server Actions -------- */
async function togglePublish(id: string, nextVal: boolean) {
  "use server";
  await supabaseAdmin.from("services").update({ is_published: nextVal }).eq("id", id);
  revalidatePath("/admin/services");
}

type OrderRow = { id: string; order_no: number | null };
async function moveService(id: string, dir: "up" | "down") {
  "use server";
  const { data: rows } = await supabaseAdmin
    .from("services")
    .select("id,order_no, is_archived")
    .order("is_archived", { ascending: true, nullsFirst: true })
    .order("order_no", { ascending: true });

  const visible = (rows ?? []).filter((r: any) => !r.is_archived);
  const list: OrderRow[] = visible.map((r: any, i: number) => ({
    id: r.id,
    order_no: r.order_no ?? i + 1,
  }));
  if (list.length === 0) return revalidatePath("/admin/services");

  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return revalidatePath("/admin/services");

  const swapIdx = dir === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= list.length) return revalidatePath("/admin/services");

  const a = list[idx];
  const b = list[swapIdx];

  await Promise.all([
    supabaseAdmin.from("services").update({ order_no: b.order_no }).eq("id", a.id),
    supabaseAdmin.from("services").update({ order_no: a.order_no }).eq("id", b.id),
  ]);

  revalidatePath("/admin/services");
}

async function deleteService(id: string) {
  "use server";
  await supabaseAdmin.from("services").delete().eq("id", id);
  revalidatePath("/admin/services");
}

async function setArchive(id: string, nextVal: boolean) {
  "use server";
  // arşive alınca yayından da düşürmek mantıklı
  const patch: Record<string, any> = { is_archived: nextVal };
  if (nextVal) patch.is_published = false;

  await supabaseAdmin.from("services").update(patch).eq("id", id);
  revalidatePath("/admin/services");
}

export default async function ServicesAdminPage() {
  const items = await getData();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Hizmetler</h1>
        <Link
          href="/admin/services/new"
          className="rounded-lg bg-black px-3 py-2 text-white hover:bg-gray-800"
        >
          Yeni Hizmet
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s, i) => {
          const archived = !!s.is_archived;
          return (
            <article
              key={s.id}
              className={`group relative overflow-hidden rounded-xl border bg-white shadow-sm ${
                archived ? "opacity-70" : ""
              }`}
            >
              {/* Kapak */}
              <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100">
                {s.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.image_url}
                    alt={s.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    Kapak yok
                  </div>
                )}
              </div>

              {/* İçerik */}
              <div className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="line-clamp-2 text-base font-semibold text-gray-900">
                    {s.title}
                  </h3>

                  <div className="flex items-center gap-1">
                    {archived && (
                      <span className="rounded-full bg-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700">
                        Arşiv
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        s.is_published
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                      title={s.is_published ? "Yayında" : "Taslak"}
                    >
                      {s.is_published ? "Yayında" : "Taslak"}
                    </span>
                  </div>
                </div>

                <p className={`line-clamp-2 text-sm ${s.description ? "text-gray-600" : "text-gray-400"}`}>
                  {s.description || "Açıklama girilmemiş."}
                </p>

                <div className="flex items-center justify-between pt-1 text-xs text-gray-500">
                  <span>Sıra: {s.order_no ?? (!archived ? i + 1 : "—")}</span>
                  <span className="truncate">/{s.slug}</span>
                </div>
              </div>

              {/* Aksiyonlar */}
              <div className="flex items-center justify-between gap-2 border-t bg-gray-50 p-3">
                <div className="flex items-center gap-2">
                  {/* Yayınla / Taslak */}
                  <form action={togglePublish.bind(null, s.id, !s.is_published)}>
                    <button
                      type="submit"
                      className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                        s.is_published
                          ? "bg-amber-600 text-white hover:bg-amber-700"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                      title={s.is_published ? "Taslağa al" : "Yayına al"}
                      disabled={archived}
                    >
                      {s.is_published ? "Gizle" : "Yayınla"}
                    </button>
                  </form>

                  {/* Yukarı / Aşağı (arşivdekilerde pasif) */}
                  <form action={moveService.bind(null, s.id, "up")}>
                    <button
                      type="submit"
                      className="rounded-md bg-white px-2 py-1 text-xs text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100 disabled:opacity-50"
                      title="Yukarı al"
                      disabled={archived}
                    >
                      ↑
                    </button>
                  </form>
                  <form action={moveService.bind(null, s.id, "down")}>
                    <button
                      type="submit"
                      className="rounded-md bg-white px-2 py-1 text-xs text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100 disabled:opacity-50"
                      title="Aşağı al"
                      disabled={archived}
                    >
                      ↓
                    </button>
                  </form>

                  {/* Arşive al/çıkar */}
                  <form action={setArchive.bind(null, s.id, !archived)}>
                    <button
                      type="submit"
                      className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                        archived
                          ? "bg-sky-600 text-white hover:bg-sky-700"
                          : "bg-gray-700 text-white hover:bg-gray-800"
                      }`}
                      title={archived ? "Arşivden çıkar" : "Arşive al"}
                    >
                      {archived ? "Arşivden Al" : "Arşive Al"}
                    </button>
                  </form>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/services/edit/${s.slug}`}
                    className="rounded-md bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100"
                  >
                    Düzenle
                  </Link>

                  <ConfirmDelete
                    label="Sil"
                    onConfirmAction={deleteService.bind(null, s.id)}
                  />
                </div>
              </div>
            </article>
          );
        })}

        {items.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed p-10 text-center text-gray-600">
            Henüz hizmet eklenmemiş.{" "}
            <Link href="/admin/services/new" className="underline">
              İlk hizmeti oluştur
            </Link>
            .
          </div>
        )}
      </div>
    </div>
  );
}
