import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import SafeImage from "../components/SafeImage";

// Her istekte taze veriyi çek (admin değişiklikleri anında yansısın)
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Service = {
  slug: string;
  title: string;
  image_url: string | null;
  description: string | null;
  order_no: number | null;
  created_at: string;
  is_published: boolean;
};

export default async function Page() {
  const sb = supabaseServer();
  const { data, error } = await sb
    .from("services")
    .select("slug,title,image_url,description,order_no,created_at,is_published")
    .eq("is_published", true)
    .order("order_no", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) console.error("[services:list]", error);
  const items = (data ?? []) as Service[];

  return (
    <div className="bg-white text-black">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-semibold">Hizmetlerimiz</h1>
        <p className="mt-2 text-gray-600">
          Profesyonel ekibimizin sunduğu paket ve konseptleri inceleyin.
        </p>

        {items.length === 0 ? (
          <div className="mt-10 rounded-xl border border-gray-200 p-6 text-gray-600">
            Şu an listelenecek hizmet yok. Yakında eklenecek. ✨
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((s) => (
              <Link
                key={s.slug}
                href={`/hizmet/${s.slug}`}
                aria-label={s.title}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* KESİLME YOK: aspect-ratio + object-contain */}
                <div className="relative w-full bg-gray-50">
                  {/* mobilde 5:4, tablet 4:3, desktop 16:9  */}
                  <div className="aspect-[5/4] sm:aspect-[4/3] lg:aspect-[16/9] relative">
                    <SafeImage
                      src={s.image_url ?? undefined}
                      alt={s.title}
                      fill
                      className="object-contain object-center transition duration-300 group-hover:scale-[1.01]"
                      label="Görsel yok"
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                    />
                    {/* İnce hairline */}
                    <div className="pointer-events-none absolute inset-0 ring-1 ring-black/5" />
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="line-clamp-1 text-base font-semibold md:text-lg">
                    {s.title}
                  </h3>
                  {s.description ? (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                      {s.description}
                    </p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
