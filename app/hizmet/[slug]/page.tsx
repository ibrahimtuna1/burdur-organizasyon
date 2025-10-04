// app/hizmet/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import SafeImage from "../../components/SafeImage";

export const revalidate = 120;

type ServiceRow = {
  slug: string;
  title: string;
  image_url: string | null;
  description: string | null;
  is_published: boolean;
  keywords: string[] | null;
};

type SidebarRow = { slug: string; title: string };

function fallbackKeywords(title?: string) {
  const base = [
    "organizasyon", "düğün organizasyonu", "kına", "nişan",
    "mekan süsleme", "organizasyon şirketi", "Burdur organizasyon", "Isparta organizasyon",
  ];
  if (!title) return base;
  const t = title.toLowerCase();
  return Array.from(
    new Set([...base, t, `${t} fiyatları`, `${t} paketleri`, `${t} konsepti`, `${t} hizmeti`])
  );
}

/* ---------- SSG ---------- */
export async function generateStaticParams() {
  const sb = supabaseServer();
  const { data } = await sb.from("services").select("slug").eq("is_published", true);
  const rows = (data ?? []) as SidebarRow[];
  return rows.map(({ slug }) => ({ slug }));
}

/* ---------- Metadata ---------- */
export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  const sb = supabaseServer();
  const { data } = await sb
    .from("services")
    .select("title, description, keywords")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle<Pick<ServiceRow, "title" | "description" | "keywords">>();

  const title = data?.title ? `${data.title} | Hizmet` : "Hizmet";
  const description = (
    data?.description ?? "Burdur ve Isparta'da düğün, kına, nişan ve özel gün organizasyonları."
  ).slice(0, 160);

  const keywords: string[] =
    Array.isArray(data?.keywords) && (data?.keywords?.length ?? 0) > 0
      ? (data!.keywords as string[])
      : fallbackKeywords(data?.title ?? undefined);

  const url = `https://www.burdurorganizasyon.com/hizmet/${slug}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: "article",
      url,
      locale: "tr_TR",
      siteName: "Burdur Organizasyon",
    },
  };
}

/* ---------- Page ---------- */
export default async function ServicePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const sb = supabaseServer();

  // Seçili hizmet
  const { data } = await sb
    .from("services")
    .select("slug,title,image_url,description,is_published,keywords")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle<ServiceRow>();

  if (!data) return notFound();
  const s = data;

  // Sidebar listesi
  const { data: all } = await sb
    .from("services")
    .select("slug,title")
    .eq("is_published", true)
    .order("order_no", { ascending: true, nullsFirst: false })
    .order("updated_at", { ascending: false });

  const list = (all ?? []) as SidebarRow[];

  // Breadcrumb JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Hizmetlerimiz",
        item: "https://www.burdurorganizasyon.com/hizmetlerimiz",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: s.title,
        item: `https://www.burdurorganizasyon.com/hizmet/${s.slug}`,
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* metinler net siyah; sidebar başlığı opak */}
      <style>{`
        .service-detail * { color:#0f172a !important; }
        .svc-title { color:#0f172a !important; background:#fff; }
        .svc-sidebar a { display:block; padding:10px 12px; border-bottom:1px solid #eef2f7; color:#0f172a; }
        .svc-sidebar a:hover { background:#f8fafc; }
        .svc-sidebar a.active { background:#eef2ff; color:#4338ca; font-weight:600; }
        details > summary { list-style: none; cursor: pointer; }
        details > summary::-webkit-details-marker { display:none; }
      `}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* MOBİL: açılır liste (sidebar yerine) */}
      <div className="md:hidden mb-4">
        <details className="rounded-xl border">
          <summary className="px-4 py-3 text-sm font-semibold flex items-center justify-between">
            Tüm Hizmetler
            <span className="text-slate-400">▼</span>
          </summary>
        {/* aynı sidebar stilleriyle liste */}
          <nav className="svc-sidebar max-h-[65vh] overflow-auto border-t">
            {list.map((item) => {
              const active = item.slug === s.slug;
              return (
                <Link
                  key={item.slug}
                  href={`/hizmet/${item.slug}`}
                  className={active ? "active" : ""}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="inline-flex items-center gap-2">
                    {!active && <span className="text-slate-400">›</span>}
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </nav>
        </details>
      </div>

      {/* GRID: mobilde içerik önce, desktop'ta sidebar + içerik */}
      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        {/* Sidebar - sadece md ve üstü */}
        <aside className="svc-sidebar h-fit bg-transparent p-0 hidden md:block md:sticky md:top-6 md:order-1">
          <div className="svc-title px-4 py-3 text-lg font-semibold">Tüm Hizmetler</div>
          <nav className="max-h-[70vh] overflow-auto rounded-xl border">
            {list.map((item) => {
              const active = item.slug === s.slug;
              return (
                <Link
                  key={item.slug}
                  href={`/hizmet/${item.slug}`}
                  className={active ? "active" : ""}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="inline-flex items-center gap-2">
                    {!active && <span className="text-slate-400">›</span>}
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Detay */}
        <section className="service-detail mx-auto max-w-5xl bg-transparent p-0 order-1 md:order-2">
          <h1 className="mb-4 text-2xl font-semibold md:text-3xl">{s.title}</h1>

          <div className="grid gap-6 md:grid-cols-2 md:items-start">
            {/* Görsel */}
            <div>
              <div className="relative overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <SafeImage
                    src={s.image_url ?? undefined}
                    alt={s.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Metin */}
            <div className="flex flex-col gap-4 md:mt-8">
              {s.description ? (
                <article className="prose max-w-none prose-p:leading-relaxed">
                  <p>{s.description}</p>
                </article>
              ) : (
                <p className="text-slate-700">Bu hizmet için açıklama yakında eklenecek.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
