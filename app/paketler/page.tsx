// app/(site)/paketler/page.tsx
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

async function fetchCategories() {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  const { data, error } = await sb
    .from("service_categories")
    .select("id,title,slug,description,order_no,is_published")
    .eq("is_published", true)
    .order("order_no", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export default async function PackagesIndexPage() {
  const categories = await fetchCategories();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Paketlerimiz</h1>
      <p className="mt-2 text-slate-800">
        Aşağıdan ihtiyacınıza uygun kategoriyi seçin. Her kategoride 3 paket bulunur (Mini / Standart / VİP).
      </p>

      {categories.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed p-8 text-slate-700">
          Henüz yayınlanmış kategori yok.
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl bg-gradient-to-r from-amber-500 to-pink-500 p-[1.5px]"
            >
              <Link
                href={`/paketler/${c.slug}`}
                className="group block h-full rounded-[calc(1rem-1.5px)] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="text-base font-semibold text-slate-900">
                  {c.title}
                </div>
                {c.description && (
                  <div className="mt-1 line-clamp-2 text-sm text-slate-800">
                    {c.description}
                  </div>
                )}
                <div className="mt-4 text-sm font-semibold">
                  <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">
                    Detaya git →
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
