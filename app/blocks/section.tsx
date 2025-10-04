// app/blocks/section.tsx
"use client";

import Image, { type ImageLoader } from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

/** Basit sayıcı animasyonu */
function Counter({ to, duration = 1500 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf = 0;
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(to * p));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <span>{val.toLocaleString("tr-TR")}</span>;
}

type Service = {
  id: string;
  slug: string;
  title: string;
  image_url: string | null;
};

const phoneE164 = "+905412029659";
const phoneHuman = "0 541 202 96 59";

// Supabase browser client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// next/image için whitelist gerekmeden dış URL gösteren loader
const passthroughLoader: ImageLoader = ({ src }) => src;

export default function Sections() {
  const [services, setServices] = useState<Service[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("id, slug, title, image_url")
          .eq("is_published", true)
          .order("order_no", { ascending: true })
          .limit(8);
        if (error) throw error;
        if (alive) setServices((data ?? []) as Service[]);
      } catch {
        if (alive) setServices([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Skeleton listesi tipli
  const list: (Service | null)[] =
    services ?? Array.from({ length: 8 }, () => null);

  return (
    <>
      {/* BİZ KİMİZ */}
      <section id="hakkimizda" className="w-full bg-white">
        <motion.div
          className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Biz kimiz?
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                Burdur ve Isparta&rsquo;da Hayalinizdeki Organizasyonu Gerçeğe Dönüştürüyoruz.
              </h2>

              <p className="mt-4 text-slate-600">
                Burdur Organizasyon olarak düğün, nişan, kına gecesi, sünnet, açılış ve özel etkinlik organizasyonlarında yılların tecrübesiyle hizmet vermekteyiz.
                Her detayı özenle planlayarak, siz sadece anın tadını çıkarın diye çalışıyoruz.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#hizmet"
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:shadow"
                >
                  Hizmetlerimizi Gör
                </a>
                <a
                  href={`tel:${phoneE164}`}
                  className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
                >
                  Hemen Ara • {phoneHuman}
                </a>
              </div>
            </div>

            <motion.div
              className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <Image
                src="/images/about/hero.jpg"
                alt="Organizasyon dekorasyonu"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-black/5" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* HİZMETLERİMİZ — Supabase'ten ilk 8 */}
      <section id="hizmet" className="w-full bg-white">
        <motion.div
          className="mx-auto max-w-7xl px-4 pb-4 pt-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900">Hizmetlerimiz</h3>
              <p className="mt-2 text-slate-600">Konsepte göre özelleştirilebilir paketler.</p>
            </div>
            <Link
              href="#iletisim"
              className="hidden rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:shadow md:inline-block"
              prefetch
            >
              İletişime Geç
            </Link>
          </div>

          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {list.map((s, i) => (
              <li key={s?.id ?? i}>
                <Link
                  href={s ? `/hizmet/${s.slug}` : "#"}
                  className="group relative block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  prefetch
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
                    {s ? (
                      <Image
                        src={s.image_url || "/images/placeholder.jpg"}
                        alt={s.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                        loader={passthroughLoader}
                        unoptimized
                      />
                    ) : (
                      <div className="h-full w-full animate-pulse bg-slate-100" />
                    )}
                    <div className="pointer-events-none absolute inset-0 ring-1 ring-black/5" />
                    <div className="absolute inset-0 translate-y-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="absolute bottom-2 right-2 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-slate-900 shadow">
                        İncele →
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="line-clamp-1 text-sm font-semibold text-slate-900">
                      {s ? s.title : loading ? "Yükleniyor..." : "—"}
                    </h4>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 md:hidden">
            <Link
              href="#iletisim"
              className="block rounded-md border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-900 shadow-sm transition hover:shadow"
              prefetch
            >
              İletişime Geç
            </Link>
          </div>
        </motion.div>
      </section>

      {/* İSTATİSTİKLER */}
      <section id="istatistikler" className="w-full bg-white">
        <motion.div
          className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
            <div className="grid grid-cols-2 gap-6 text-slate-900 md:grid-cols-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full border border-slate-200 p-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
                    <path
                      d="M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2Zm1 5h-2v6l5 3 .9-1.8-3.9-2.2V7Z"
                      fill="currentColor"
                      className="text-slate-700"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    <Counter to={13} />
                  </div>
                  <div className="text-sm text-slate-600">Yıllık Tecrübe</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full border border-slate-200 p-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
                    <path
                      d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z"
                      fill="currentColor"
                      className="text-slate-700"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    <Counter to={2845} />
                  </div>
                  <div className="text-sm text-slate-600">Müşteri</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full border border-slate-200 p-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
                    <path
                      d="M12 2 3 7l9 5 9-5-9-5Zm0 7L3 14l9 5 9-5-9-5Z"
                      fill="currentColor"
                      className="text-slate-700"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    <Counter to={3625} />
                  </div>
                  <div className="text-sm text-slate-600">Organizasyon</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full border border-slate-200 p-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
                    <path
                      d="M3 4h18v12H7l-4 4V4Z"
                      fill="currentColor"
                      className="text-slate-700"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    <Counter to={1854} />
                  </div>
                  <div className="text-sm text-slate-600">Olumlu Yorum</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* İLETİŞİM — Ara / WhatsApp */}
      <section id="iletisim" className="w-full bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-slate-900">İletişim</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Hemen ulaşmak için arayabilir veya WhatsApp’tan yazabilirsiniz.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`tel:${phoneE164}`}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Telefon: {phoneHuman}
            </a>
            <a
              href={`https://wa.me/905412029659?text=${encodeURIComponent(
                "Merhaba, organizasyon hizmetleri hakkında bilgi almak istiyorum."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:shadow"
            >
              WhatsApp’tan Yaz
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
