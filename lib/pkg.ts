import { supabaseServer } from "./supabase/server";

export type PkgFeature = { id: string; text: string; order_no: number };
export type Pkg = {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string | null;
  price: number;
  currency: string;
  is_featured: boolean;
  order_no: number;
  features: PkgFeature[];
};
export type Category = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  order_no: number;
  packages: Pkg[];
};

export async function getCategories(): Promise<Category[]> {
  const sb = supabaseServer();

  // kategoriler
  const { data: cats, error: ce } = await sb
    .from("service_categories")
    .select("*")
    .eq("is_published", true)
    .order("order_no", { ascending: true });

  if (ce) throw ce;

  // paketler
  const { data: packs, error: pe } = await sb
    .from("service_packages")
    .select("*")
    .eq("is_published", true)
    .order("order_no", { ascending: true });

  if (pe) throw pe;

  // özellikler
  const { data: feats, error: fe } = await sb
    .from("package_features")
    .select("*")
    .order("order_no", { ascending: true });

  if (fe) throw fe;

  const featsByPack = new Map<string, PkgFeature[]>();
  (feats ?? []).forEach(f => {
    const arr = featsByPack.get(f.package_id) ?? [];
    arr.push({ id: f.id, text: f.text, order_no: f.order_no });
    featsByPack.set(f.package_id, arr);
  });

  const packsByCat = new Map<string, Pkg[]>();
  (packs ?? []).forEach(p => {
    const arr = packsByCat.get(p.category_id) ?? [];
    arr.push({
      id: p.id,
      title: p.title,
      subtitle: p.subtitle,
      slug: p.slug,
      price: Number(p.price),
      currency: p.currency,
      is_featured: p.is_featured,
      order_no: p.order_no,
      features: featsByPack.get(p.id) ?? [],
    });
    packsByCat.set(p.category_id, arr);
  });

  return (cats ?? []).map(c => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    description: c.description,
    order_no: c.order_no,
    packages: packsByCat.get(c.id) ?? [],
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const all = await getCategories();
  return all.find(c => c.slug === slug) ?? null;
}

export function fmtPrice(price: number, currency = "TRY") {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency }).format(price);
}
