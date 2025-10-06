// app/admin/(protected)/services/edit/[slug]/page.tsx
"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useParams } from "next/navigation";

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
  keywords?: string[] | null;
};

/* -------------------- Guards & helpers -------------------- */
function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}
function asString(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}
function asStringOrNull(v: unknown): string | null | undefined {
  return typeof v === "string" ? v : v === null ? null : undefined;
}
function asNumberOrNull(v: unknown): number | null | undefined {
  return typeof v === "number"
    ? v
    : typeof v === "string" && v.trim() !== ""
    ? Number(v)
    : v === null
    ? null
    : undefined;
}
function asBool(v: unknown): boolean | undefined {
  return typeof v === "boolean" ? v : undefined;
}
function asStringArrayOrNull(v: unknown): string[] | null | undefined {
  if (Array.isArray(v)) return v.map((s) => String(s));
  return v === null ? null : undefined;
}
/** API error çıkarıcı */
function extractError(x: unknown): string | undefined {
  if (!isRecord(x)) return;
  if (typeof x.error === "string") return x.error;
  if (typeof x.message === "string") return x.message;
  return;
}

/** Basit slugify */
function slugify(v: string) {
  return v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/* -------------------- Page -------------------- */
export default function EditService() {
  const router = useRouter();

  // useParams tipli
  const params = useParams<{ slug?: string | string[] }>();
  const slug = useMemo<string | undefined>(() => {
    const s = params?.slug;
    return Array.isArray(s) ? s[0] : s;
  }, [params]);

  const [form, setForm] = useState<FormState>({
    title: "",
    slug: "",
    image_url: null,
    description: null,
    order_no: 1000,
    is_published: true,
    is_archived: false,
    keywords: [],
  });

  // 🔑 Virgül sorunu için ham metin state'i
  const [keywordsText, setKeywordsText] = useState<string>("");

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  /* -------- Kayıt Çek -------- */
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!slug || typeof slug !== "string") return;
      setLoading(true);
      setErr(null);

      const res = await fetch(`/api/admin/services/${encodeURIComponent(slug)}`, {
        cache: "no-store",
      });

      if (!alive) return;

      if (res.ok) {
        const dataUnknown = (await res.json().catch(() => null)) as unknown;
        if (isRecord(dataUnknown)) {
          const fetchedKeywords = asStringArrayOrNull(dataUnknown.keywords) ?? [];
          setForm((prev) => ({
            ...prev,
            id: asString(dataUnknown.id) ?? prev.id,
            title: asString(dataUnknown.title) ?? "",
            slug: asString(dataUnknown.slug) ?? "",
            image_url: asStringOrNull(dataUnknown.image_url) ?? null,
            description: asStringOrNull(dataUnknown.description) ?? null,
            order_no: asNumberOrNull(dataUnknown.order_no) ?? 1000,
            is_published: asBool(dataUnknown.is_published) ?? false,
            is_archived: (asBool(dataUnknown.is_archived) ?? false) as boolean,
            keywords: fetchedKeywords,
          }));
          // Input'a ham metin olarak bas
          setKeywordsText(fetchedKeywords.join(", "));
        }
      } else if (res.status === 404) {
        setErr("Kayıt bulunamadı.");
      } else {
        const j = (await res.json().catch(() => null)) as unknown;
        setErr(extractError(j) ?? `Hata: ${res.status}`);
      }
      setLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, [slug]);

  const autoSlug = useMemo(() => slugify(form.title || ""), [form.title]);

  /* -------- Görsel Upload -------- */
  type UploadResp = { url: string; path?: string };
  function isUploadResp(x: unknown): x is UploadResp {
    if (!isRecord(x)) return false;
    return typeof x.url === "string";
  }

  async function uploadImage() {
    if (!file) return setErr("Önce bir dosya seç.");
    if (!form.id) return setErr("Kayıt ID’si yok. Sayfayı yenile.");

    setErr(null);
    setOk(null);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("serviceId", form.id);

    const res = await fetch("/api/admin/services/upload", { method: "POST", body: fd });

    if (!res.ok) {
      const j = (await res.json().catch(() => null)) as unknown;
      setErr(extractError(j) ?? `Yükleme hatası (${res.status})`);
      return;
    }

    const j = (await res.json().catch(() => null)) as unknown;
    if (isUploadResp(j)) {
      setForm((p) => ({ ...p, image_url: j.url }));
      setOk("Görsel yüklendi.");
    } else {
      setErr("Beklenmeyen cevap.");
    }
  }

  /* -------- Keywords parse (önizleme & submit) -------- */
  const parsedKeywords = useMemo(
    () =>
      keywordsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [keywordsText]
  );

  /* -------- Kaydet -------- */
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(null);

    const payload: FormState = {
      ...form,
      slug: form.slug?.trim() ? slugify(form.slug) : autoSlug,
      keywords: parsedKeywords,
    };

    // UI tutarlılığı
    setForm((p) => ({ ...p, keywords: parsedKeywords }));

    startTransition(async () => {
      const res = await fetch("/api/admin/services/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as unknown;
        setErr(extractError(j) ?? "Kaydedilemedi.");
        return;
      }
      setOk("Kaydedildi.");
      setTimeout(() => router.push("/admin/services"), 700);
    });
  }

  if (!slug) {
    return (
      <div className="p-6">
        Geçersiz URL.{" "}
        <button className="underline" onClick={() => router.push("/admin/services")}>
          Listeye dön
        </button>
      </div>
    );
  }

  if (loading) return <div className="p-6">Yükleniyor…</div>;

  /* -------------------- UI -------------------- */
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Hizmet Düzenle</h1>
        <button
          onClick={() => router.push("/admin/services")}
          className="rounded-md border px-3 py-2 text-sm"
        >
          Listeye Dön
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* -------- Form -------- */}
        <form onSubmit={onSubmit} className="space-y-4 rounded-xl border bg-white p-4 shadow-sm">
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
              required
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

          {/* -------- Keywords -------- */}
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">Keywords (virgülle ayır)</label>
            <input
              className="rounded-md border px-3 py-2"
              value={keywordsText}
              onChange={(e) => setKeywordsText(e.target.value)}
              placeholder="düğün, kına, nişan, mekan süsleme, organizasyon"
            />
            <p className="text-xs text-gray-500">
              Örn: <em>düğün, kına, nişan</em>. Araya virgül koy; boşluk önemli değil.
            </p>
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
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="text-sm"
              />
              <button
                type="button"
                disabled={!file || !form.id || pending}
                onClick={() => uploadImage()}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
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

          <div className="flex gap-3">
            <button
              className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
              disabled={pending}
            >
              {pending ? "Kaydediliyor…" : "Kaydet"}
            </button>
            <button
              type="button"
              className="rounded-md border px-4 py-2"
              onClick={() => router.back()}
            >
              Vazgeç
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
              {parsedKeywords.length > 0 && (
                <div className="pt-2 text-xs text-gray-500">
                  <span className="mr-1 font-medium">Keywords:</span>
                  {parsedKeywords.join(", ")}
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
