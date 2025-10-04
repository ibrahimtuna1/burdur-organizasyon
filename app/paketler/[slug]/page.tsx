// app/(site)/paketler/[slug]/page.tsx
import FeatureItem from "@/app//components/packages/FeatureItem";
import PackageCard from "@/app//components/packages/PackageCard";
import { getCategoryBySlug } from "@/lib/pkg";
import { notFound } from "next/navigation";

type Params = { slug: string };

export const dynamic = "force-dynamic";

// Bazı Next sürümlerinde params Promise gelebiliyor → await ediyoruz
export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);
  if (!category) return notFound();

  const packs = [...category.packages].sort((a, b) => a.order_no - b.order_no);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
        {category.title} Paketlerimiz
      </h1>
      {category.description && (
        <p className="mt-2 max-w-3xl text-slate-800">{category.description}</p>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packs.map((p) => (
          <PackageCard
            key={p.id}
            title={p.title}
            subtitle={p.subtitle ?? undefined}
            price={p.price}
            currency={p.currency}
            featured={p.is_featured}
          >
            {p.features.map((f) => (
              <FeatureItem key={f.id}>{f.text}</FeatureItem>
            ))}
          </PackageCard>
        ))}
      </div>
    </main>
  );
}
