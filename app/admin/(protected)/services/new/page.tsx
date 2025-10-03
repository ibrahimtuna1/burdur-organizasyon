"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

/* -------------------- Types -------------------- */
type FormState = {
  id?: string;
  title: string;
  slug: string;
  image_url: string | null;
  description: string | null;
  order_no: number | null;
  is_published: boolean;
  is_archived?: boolean | null;
};

/* -------------------- Utils -------------------- */
function slugify(v: string) {
  return v
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/* -------------------- Page -------------------- */
export default function NewServicePage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    title: "",
    slug: "",
    image_url: null,
    description: null,
    order_no: 1000,
    is_published: true,
    is_archived: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const autoSlug = useMemo(() => slugify(form.title || ""), [form.title]);

  async function saveDraft(redirectAfter = false) {
    setErr(null);
    setOk(null);

    const payload: FormState = {
      ...form,
      slug: form.slug?.trim() ? slugify(form.slug) : autoSlug,
    };

    const res = await fetch("/api/admin/services/upsert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j?.error || "Kaydedilemedi.");
    }
    const saved = await res.json();
    setForm((p) => ({ ...p, id: saved?.id ?? p.id, slug: saved?.slug ?? payload.slug }));
    setOk("Kaydedildi.");

    if (redirectAfter) {
      router.push("/admin/services");
    }
  }

  async function uploadImage() {
    if (!file) {
      setErr("Önce bir dosya seç.");
      return;
    }
    if (!form.id) {
      setErr("Önce kaydı kaydet (taslak oluştur), sonra görsel yükle.");
      return;
    }
    setErr(null);
    setOk(null);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("serviceId", form.id);

    const res = await fetch("/api/admin/services/upload", {
      method: "POST",
      body: fd,
    });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j?.error || `Yükleme hatası (${res.status})`);
      return;
    }

    const j = await res.json();
    setForm((p) => ({ ...p, image_url: j.url }));
    setOk("Görsel yüklendi.");
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Yeni Hizmet</h1>
        <button
          onClick={() => router.push("/admin/services")}
          className="rounded-md border px-3 py-2 text-sm"
        >
          Listeye Dön
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* -------- Form -------- */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            start(async () => {
              await saveDraft(false).catch((e) => setErr(e.message));
            });
          }}
          className="space-y-4 rounded-xl border bg-white p-4 shadow-sm"
        >
          <div className="grid gap-2">
            <label className="text-sm font-medium">Başlık</label>
            <input
              className="rounded-md border px-3 py-2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Örn: Vip Nişan Konsepti"
              required
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Slug</label>
              <button
                type="button"
                className="text-xs underline"
                onClick={() => setForm((p) => ({ ...p, slug: autoSlug }))}
              >
                Başlıktan öner: {autoSlug || "-"}
              </button>
            </div>
            <input
              className="rounded-md border px-3 py-2"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="vip-nisan-konsepti"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Açıklama</label>
            <textarea
              className="min-h-32 rounded-md border px-3 py-2"
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Kısa açıklama…"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Sıra</label>
            <input
              type="number"
              className="w-32 rounded-md border px-3 py-2"
              value={form.order_no ?? 1000}
              onChange={(e) =>
                setForm({
                  ...form,
                  order_no: Number.isNaN(+e.target.value) ? 1000 : +e.target.value,
                })
              }
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!form.is_published}
                onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
              />
              Yayında
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!form.is_archived}
                onChange={(e) => setForm({ ...form, is_archived: e.target.checked })}
              />
              Arşiv
            </label>
          </div>

          {/* -------- Görsel Yükleme -------- */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Kapak Görseli</label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="text-sm"
              />
              <button
                type="button"
                disabled={!file || pending}
                onClick={() =>
                  start(async () => {
                    // id yoksa önce kaydı oluştur
                    if (!form.id) {
                      await saveDraft(false).catch((e) => setErr(e.message));
                    }
                    if (form.id || !err) {
                      await uploadImage();
                    }
                  })
                }
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                title={form.id ? "Görseli yükle" : "Önce kaydı kaydetmen gerekir"}
              >
                {pending ? "Yükleniyor…" : "Yükle"}
              </button>
            </div>
            {form.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.image_url}
                alt="Kapak"
                className="mt-2 h-32 w-56 rounded-md border object-cover"
              />
            )}
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}
          {ok && <p className="text-sm text-green-600">{ok}</p>}

          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
              disabled={pending}
            >
              {pending ? "Kaydediliyor…" : "Kaydet / Taslak Oluştur"}
            </button>

            <button
              type="button"
              className="rounded-md border px-4 py-2"
              disabled={pending}
              onClick={() =>
                start(async () => {
                  await saveDraft(true).catch((e) => setErr(e.message));
                })
              }
            >
              Kaydet ve Listeye Dön
            </button>
          </div>
        </form>

        {/* -------- Önizleme -------- */}
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="mb-2 text-sm text-gray-500">Önizleme</p>
          <article className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100">
              {form.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.image_url}
                  alt={form.title || "Kapak"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  Kapak yok
                </div>
              )}
            </div>
            <div className="space-y-2 p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="line-clamp-2 text-base font-semibold text-gray-900">
                  {form.title || "Başlık"}
                </h3>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    form.is_published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {form.is_published ? "Yayında" : "Taslak"}
                </span>
              </div>
              <p
                className={`line-clamp-2 text-sm ${
                  form.description ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {form.description || "Açıklama girilmemiş."}
              </p>
              <div className="flex items-center justify-between pt-1 text-xs text-gray-500">
                <span>Sıra: {form.order_no ?? "—"}</span>
                <span className="truncate">/{form.slug || slugify(form.title || "")}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
