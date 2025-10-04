"use client";
import { useEffect, useMemo, useState } from "react";

/** ==== TYPES ==== */
type Cat = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  order_no: number;
  is_published: boolean;
  archived_at?: string | null;
};
type Pack = {
  id: string;
  category_id: string;
  title: string;
  subtitle: string | null;
  slug: string | null;
  price: number;
  currency: string;
  is_featured: boolean;
  is_published: boolean;
  order_no: number;
  archived_at: string | null;
  updated_at: string | null;
};
type Feat = { id: string; package_id: string; text: string; order_no: number };

type PackageForm = {
  id?: string; // yeni oluşturulanda yok
  category_id: string;
  title: string;
  subtitle: string | null;
  slug: string | null;
  price: number | string; // input'tan number-string gelebilir
  currency: string;
  is_featured: boolean;
  is_published: boolean;
  order_no: number | string;
  features: string[];
};

type CategoryForm = {
  id?: string;
  title: string;
  slug: string;
  description: string | null;
  order_no: number | string;
  is_published: boolean;
};

/** ==== PAGE ==== */
export default function AdminPackagesPage() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [feats, setFeats] = useState<Feat[]>([]);
  const [q, setQ] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [editing, setEditing] = useState<Pack | null>(null);
  const [catModal, setCatModal] = useState<Cat | null>(null);

  const load = async () => {
    const r = await fetch("/api/admin/packages");
    const j: { cats: Cat[]; packs: Pack[]; feats: Feat[] } = await r.json();
    setCats(j.cats || []);
    setPacks(j.packs || []);
    setFeats(j.feats || []);
  };
  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return packs.filter((p) => {
      if (!showArchived && p.archived_at) return false;
      return s === "" || p.title.toLowerCase().includes(s) || (p.slug || "").toLowerCase().includes(s);
    });
  }, [packs, q, showArchived]);

  const featuresOf = (id: string) =>
    feats.filter((f) => f.package_id === id).sort((a, b) => a.order_no - b.order_no);

  const toggleArchive = async (id: string, archived: boolean) => {
    const r = await fetch(`/api/admin/packages/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ archived }),
    });
    if (r.ok) load();
  };

  const hardDelete = async (id: string) => {
    if (!confirm("Kalıcı olarak silinsin mi? Geri dönüş yok.")) return;
    const r = await fetch(`/api/admin/packages/${id}`, { method: "DELETE" });
    if (r.ok) load();
  };

  return (
    <main className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Paketler</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setCatModal({
                id: "",
                title: "Yeni Kategori",
                slug: "",
                description: null,
                order_no: 0,
                is_published: true,
                archived_at: null,
              })
            }
            className="rounded bg-slate-700 px-3 py-2 text-white"
          >
            Kategori Ekle
          </button>
          <button
            onClick={() =>
              setEditing({
                id: "",
                category_id: cats[0]?.id || "",
                title: "Yeni Paket",
                subtitle: null,
                slug: null,
                price: 0,
                currency: "TRY",
                is_featured: false,
                is_published: true,
                order_no: 0,
                archived_at: null,
                updated_at: null,
              })
            }
            className="rounded bg-black px-3 py-2 text-white"
          >
            Yeni Paket
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ara..."
          className="w-72 rounded border px-3 py-2"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
          />
          Arşivdekileri göster
        </label>
      </div>

      {/* kategoriye göre grupla */}
      <div className="space-y-8">
        {cats
          .filter((c) => showArchived || !c.archived_at)
          .sort((a, b) => a.order_no - b.order_no)
          .map((cat) => {
            const items = filtered
              .filter((p) => p.category_id === cat.id)
              .sort((a, b) => a.order_no - b.order_no);
            if (!items.length && !showArchived) return null;
            return (
              <section key={cat.id}>
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    {cat.title} {cat.archived_at && <span className="text-xs text-amber-700">(arşivde)</span>}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      className="rounded border px-2 py-1 text-sm"
                      onClick={() => setCatModal(cat)}
                    >
                      Düzenle
                    </button>
                    <button
                      className="rounded border px-2 py-1 text-sm"
                      onClick={async () => {
                        await fetch(`/api/admin/categories/${cat.id}`, {
                          method: "PATCH",
                          headers: { "content-type": "application/json" },
                          body: JSON.stringify({ archived: !cat.archived_at }),
                        });
                        load();
                      }}
                    >
                      {cat.archived_at ? "Arşivden Çıkar" : "Arşive Al"}
                    </button>
                    {cat.archived_at && (
                      <button
                        className="rounded bg-rose-600 px-2 py-1 text-sm text-white"
                        onClick={async () => {
                          if (!confirm("Kategori kalıcı silinsin mi?")) return;
                          await fetch(`/api/admin/categories/${cat.id}`, { method: "DELETE" });
                          load();
                        }}
                      >
                        Sil
                      </button>
                    )}
                  </div>
                </div>

                <div className="overflow-auto rounded border">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="p-2 text-left">Başlık</th>
                        <th className="p-2 text-left">Slug</th>
                        <th className="p-2">Fiyat</th>
                        <th className="p-2">Öne Çıkan</th>
                        <th className="p-2">Yayın</th>
                        <th className="p-2">Özellik</th>
                        <th className="p-2">Aksiyon</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((p) => (
                        <tr key={p.id} className={`border-t ${p.archived_at ? "bg-amber-50" : ""}`}>
                          <td className="p-2">{p.title}</td>
                          <td className="p-2">{p.slug}</td>
                          <td className="p-2 text-center">
                            {new Intl.NumberFormat("tr-TR", {
                              style: "currency",
                              currency: p.currency,
                            }).format(p.price)}
                          </td>
                          <td className="p-2 text-center">{p.is_featured ? "★" : "-"}</td>
                          <td className="p-2 text-center">{p.is_published ? "✔" : "—"}</td>
                          <td className="p-2 text-slate-600">
                            {featuresOf(p.id)
                              .map((f) => f.text)
                              .slice(0, 3)
                              .join(" • ")}
                            {featuresOf(p.id).length > 3 ? "…" : ""}
                          </td>
                          <td className="p-2">
                            <div className="flex flex-wrap gap-2">
                              <button
                                className="rounded bg-slate-800 px-2 py-1 text-white"
                                onClick={() => setEditing(p)}
                              >
                                Düzenle
                              </button>

                              {!p.archived_at ? (
                                <button
                                  className="rounded bg-amber-600 px-2 py-1 text-white"
                                  onClick={() => toggleArchive(p.id, true)}
                                >
                                  Arşive Al
                                </button>
                              ) : (
                                <>
                                  <button
                                    className="rounded bg-emerald-600 px-2 py-1 text-white"
                                    onClick={() => toggleArchive(p.id, false)}
                                  >
                                    Arşivden Çıkar
                                  </button>
                                  <button
                                    className="rounded bg-rose-600 px-2 py-1 text-white"
                                    onClick={() => hardDelete(p.id)}
                                  >
                                    Sil
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })}
      </div>

      {editing && (
        <EditorModal
          cats={cats.filter((c) => !c.archived_at)}
          pack={editing}
          features={featuresOf(editing.id)}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}

      {catModal && (
        <CategoryModal
          cat={catModal}
          onClose={() => setCatModal(null)}
          onSaved={() => {
            setCatModal(null);
            load();
          }}
        />
      )}
    </main>
  );
}

/* ------------ Paket Editor Modal --------------- */
function EditorModal({
  cats,
  pack,
  features,
  onClose,
  onSaved,
}: {
  cats: Cat[];
  pack: Pack;
  features: Feat[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<PackageForm>({
    id: pack.id || undefined,
    category_id: pack.category_id,
    title: pack.title,
    subtitle: pack.subtitle,
    slug: pack.slug,
    price: pack.price,
    currency: pack.currency,
    is_featured: pack.is_featured,
    is_published: pack.is_published,
    order_no: pack.order_no,
    features: (features || []).sort((a, b) => a.order_no - b.order_no).map((f) => f.text),
  });

  const save = async () => {
    if (!form.category_id) {
      alert("Kategori seç.");
      return;
    }
    const method = form.id ? "PUT" : "POST";
    const url = form.id ? `/api/admin/packages/${form.id}` : "/api/admin/packages";
    const r = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        category_id: form.category_id,
        title: form.title,
        subtitle: form.subtitle,
        slug: form.slug,
        price: Number(form.price || 0),
        currency: form.currency || "TRY",
        is_featured: !!form.is_featured,
        order_no: Number(form.order_no || 0),
        is_published: !!form.is_published,
        features: (form.features || []).filter((t) => t && t.trim()),
      }),
    });
    if (r.ok) onSaved();
    else alert("Kaydedilemedi");
  };

  const setFeature = (idx: number, val: string) => {
    const arr = [...form.features];
    arr[idx] = val;
    setForm({ ...form, features: arr });
  };
  const addFeature = () => setForm({ ...form, features: [...(form.features || []), ""] });
  const delFeature = (idx: number) => {
    const arr = [...(form.features || [])];
    arr.splice(idx, 1);
    setForm({ ...form, features: arr });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{form.id ? "Paketi Düzenle" : "Yeni Paket"}</h3>
          <button onClick={onClose} className="text-slate-600">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="col-span-2">
            <span className="text-xs text-slate-600">Kategori</span>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="mt-1 w-full rounded border p-2"
            >
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="text-xs text-slate-600">Başlık</span>
            <input
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 w-full rounded border p-2"
            />
          </label>

          <label>
            <span className="text-xs text-slate-600">Alt başlık</span>
            <input
              value={form.subtitle || ""}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="mt-1 w-full rounded border p-2"
            />
          </label>

          <label>
            <span className="text-xs text-slate-600">Slug</span>
            <input
              value={form.slug || ""}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="mt-1 w-full rounded border p-2"
            />
          </label>

          <label>
            <span className="text-xs text-slate-600">Fiyat</span>
            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="mt-1 w-full rounded border p-2"
            />
          </label>

          <label>
            <span className="text-xs text-slate-600">Para Birimi</span>
            <input
              value={form.currency || "TRY"}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
              className="mt-1 w-full rounded border p-2"
            />
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
            />
            <span>En çok tercih edilen</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
            />
            <span>Yayında</span>
          </label>

          <label>
            <span className="text-xs text-slate-600">Sıra (order_no)</span>
            <input
              type="number"
              value={form.order_no}
              onChange={(e) => setForm({ ...form, order_no: e.target.value })}
              className="mt-1 w-full rounded border p-2"
            />
          </label>
        </div>

        <div className="mt-5">
          <div className="mb-2 text-sm font-semibold">Özellikler</div>
          <div className="space-y-2">
            {(form.features || []).map((t, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={t}
                  onChange={(e) => setFeature(i, e.target.value)}
                  className="w-full rounded border p-2"
                />
                <button className="rounded bg-slate-200 px-2" onClick={() => delFeature(i)}>
                  Sil
                </button>
              </div>
            ))}
            <button className="rounded bg-slate-800 px-3 py-1 text-white" onClick={addFeature}>
              Özellik Ekle
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button className="rounded border px-4 py-2" onClick={onClose}>
            Vazgeç
          </button>
          <button className="rounded bg-black px-4 py-2 text-white" onClick={save}>
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------ Kategori Modal --------------- */
function CategoryModal({
  cat,
  onClose,
  onSaved,
}: {
  cat: Cat;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<CategoryForm>({
    id: cat.id || undefined,
    title: cat.title || "",
    slug: cat.slug || "",
    description: cat.description ?? null,
    order_no: cat.order_no ?? 0,
    is_published: cat.is_published ?? true,
  });

  const save = async () => {
    const method = form.id ? "PUT" : "POST";
    const url = form.id ? `/api/admin/categories/${form.id}` : `/api/admin/categories`;
    const r = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        slug: form.slug,
        description: form.description || null,
        order_no: Number(form.order_no || 0),
        is_published: !!form.is_published,
      }),
    });
    if (r.ok) onSaved();
    else alert("Kategori kaydedilemedi");
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{form.id ? "Kategoriyi Düzenle" : "Yeni Kategori"}</h3>
          <button onClick={onClose} className="text-slate-600">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="col-span-2">
            <span className="text-xs text-slate-600">Başlık</span>
            <input
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 w-full rounded border p-2"
            />
          </label>
          <label className="col-span-2">
            <span className="text-xs text-slate-600">Slug</span>
            <input
              value={form.slug || ""}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="mt-1 w-full rounded border p-2"
            />
          </label>
          <label className="col-span-2">
            <span className="text-xs text-slate-600">Açıklama</span>
            <textarea
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 w-full rounded border p-2"
            />
          </label>
          <label>
            <span className="text-xs text-slate-600">Sıra (order_no)</span>
            <input
              type="number"
              value={form.order_no}
              onChange={(e) => setForm({ ...form, order_no: e.target.value })}
              className="mt-1 w-full rounded border p-2"
            />
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
            />
            <span>Yayında</span>
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button className="rounded border px-4 py-2" onClick={onClose}>
            Vazgeç
          </button>
          <button className="rounded bg-black px-4 py-2 text-white" onClick={save}>
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
