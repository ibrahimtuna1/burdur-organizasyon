// app/sitemap.ts
import type { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase/serverAdmin";

export const revalidate = 3600;

const BASE_URL =
  (process.env.SITE_URL?.replace(/\/$/, "") as string | undefined) ??
  "https://burdurorganizasyon.com";

type RowWithSlug = { slug: string; updated_at: string | null };

function isString(v: unknown): v is string {
  return typeof v === "string";
}

function toRows(data: unknown): RowWithSlug[] {
  if (!Array.isArray(data)) return [];
  return data
    .map((r): RowWithSlug | null => {
      const slug = isString((r as Record<string, unknown>)["slug"])
        ? ((r as Record<string, unknown>)["slug"] as string)
        : null;
      const updated_atVal = (r as Record<string, unknown>)["updated_at"];
      const updated_at =
        isString(updated_atVal) || updated_atVal === null ? (updated_atVal as string | null) : null;
      return slug ? { slug, updated_at } : null;
    })
    .filter((x): x is RowWithSlug => x !== null);
}

async function fetchRows(table: "services" | "packages"): Promise<RowWithSlug[]> {
  const { data, error } = await supabaseAdmin
    .from(table)
    .select("slug, updated_at")
    .eq("is_active", true);

  if (error) return [];
  return toRows(data);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1) Statikler
  const staticRoutes: MetadataRoute.Sitemap = ["/", "/hizmetlerimiz", "/paketler", "/iletisim"].map(
    (path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changefreq: "weekly",
      priority: path === "/" ? 1 : 0.7,
    })
  );

  // 2) Dinamikler (Supabase)
  const [serviceRows, packageRows] = await Promise.all([
    fetchRows("services"),
    fetchRows("packages"),
  ]);

  const serviceRoutes: MetadataRoute.Sitemap = serviceRows.map((r) => ({
    url: `${BASE_URL}/hizmet/${r.slug}`,
    lastModified: r.updated_at ?? new Date().toISOString(),
    changefreq: "weekly",
    priority: 0.8,
  }));

  const packageRoutes: MetadataRoute.Sitemap = packageRows.map((r) => ({
    url: `${BASE_URL}/paketler/${r.slug}`,
    lastModified: r.updated_at ?? new Date().toISOString(),
    changefreq: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...serviceRoutes, ...packageRoutes];
}