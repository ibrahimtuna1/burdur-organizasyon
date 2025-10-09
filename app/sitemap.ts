// app/sitemap.ts
import type { MetadataRoute } from "next";

export const revalidate = 3600; // 1 saat cache

// PROD'da Vercel env'e ekle: SITE_URL=https://alanadinin.com
const BASE_URL =
  process.env.SITE_URL?.replace(/\/$/, "") || "https://burdurorganizasyon.com";

// Burayı şimdilik elle giriyoruz (hızlı çözüm):
// İster burada tut, ister sonra Supabase'ten/JSON'dan çektirelim.
const SERVICE_SLUGS: any[] = [
  // ör: "dugun-organizasyonu", "kina-gecesi", "acilis-organizasyonu"
];
const PACKAGE_SLUGS: any[] = [
  // ör: "bronze", "silver", "gold"
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Statik sayfalar
  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/hizmetlerimiz",
    "/paketler",
    "/iletisim", // varsa
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changefreq: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  // Dinamik: Hizmet detayları
  const serviceRoutes: MetadataRoute.Sitemap = SERVICE_SLUGS.map((slug) => ({
    url: `${BASE_URL}/hizmet/${slug}`,
    lastModified: new Date(),
    changefreq: "weekly",
    priority: 0.8,
  }));

  // Dinamik: Paket detayları
  const packageRoutes: MetadataRoute.Sitemap = PACKAGE_SLUGS.map((slug) => ({
    url: `${BASE_URL}/paketler/${slug}`,
    lastModified: new Date(),
    changefreq: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...serviceRoutes, ...packageRoutes];
}