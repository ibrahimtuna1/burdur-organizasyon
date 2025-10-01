// app/components/Footer.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate mt-16 bg-white text-slate-900">
      {/* süper ince gradient çizgi */}
      <div className="h-1 w-full bg-gradient-to-r from-pink-200 via-amber-200 to-fuchsia-200" />

      {/* arka plan soft bloblar */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <motion.div
          className="absolute -top-20 -right-10 h-48 w-48 rounded-full bg-rose-200/50 blur-2xl"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-fuchsia-200/50 blur-2xl"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* marka */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png" // kendi logon
                alt="Burdur Organizasyon"
                width={160}
                height={44}
                className="h-11 w-auto"
                priority
              />
              <span className="sr-only">Burdur Organizasyon</span>
            </div>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
              Düğün, kına, nişan ve özel günler için A’dan Z’ye çözüm.
              Burdur & Isparta’da tek ekip, şeffaf fiyat, stressiz organizasyon.
            </p>

            {/* mini rozetler */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
                13+ yıl tecrübe
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
                3.625+ organizasyon
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
                1.854 olumlu yorum
              </span>
            </div>
          </div>

          {/* kurumsal */}
          <div className="md:col-span-3">
            <div className="text-sm font-semibold">Kurumsal</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="#hakkimizda" className="text-slate-600 hover:text-slate-900 transition">Hakkımızda</Link></li>
              <li><Link href="#hizmetler" className="text-slate-600 hover:text-slate-900 transition">Hizmetler</Link></li>
              <li><Link href="#galeri" className="text-slate-600 hover:text-slate-900 transition">Galeri</Link></li>
              <li><Link href="#teklif" className="text-slate-600 hover:text-slate-900 transition">Teklif Formu</Link></li>
              <li><Link href="#iletisim" className="text-slate-600 hover:text-slate-900 transition">İletişim</Link></li>
            </ul>
          </div>

          {/* sosyal */}
          <div className="md:col-span-2">
            <div className="text-sm font-semibold">Sosyal</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition">
                  {/* instagram */}
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5.5A5.5 5.5 0 1 0 17.5 13 5.5 5.5 0 0 0 12 7.5Zm6-1.3a1 1 0 1 0 1.2 1.6 1 1 0 0 0-1.2-1.6Z"/></svg>
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition">
                  {/* youtube */}
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M23 12s0-3.2-.4-4.7a3 3 0 0 0-2.1-2.1C18.9 4.5 12 4.5 12 4.5s-6.9 0-8.5.7A3 3 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a3 3 0 0 0 2.1 2.1c1.6.7 8.5.7 8.5.7s6.9 0 8.5-.7a3 3 0 0 0 2.1-2.1c.4-1.5.4-4.7.4-4.7ZM10 9.8l5.7 2.2L10 14.2V9.8Z"/></svg>
                  YouTube
                </a>
              </li>
              <li>
                <a href="#" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition">
                  {/* facebook */}
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.7V12h2.7V9.8c0-2.7 1.6-4.2 4-4.2 1.2 0 2.4.2 2.4.2v2.6h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 2.9h-2.4v7A10 10 0 0 0 22 12Z"/></svg>
                  Facebook
                </a>
              </li>
            </ul>
          </div>

          {/* iletişim */}
          <div className="md:col-span-2">
            <div className="text-sm font-semibold">İletişim</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>📍 Burdur Merkez</li>
              <li>
                📞{" "}
                <a href="tel:+905412029659" className="hover:text-slate-900 transition">
                  +90 541 202 96 59
                </a>
              </li>
              <li>
                💬{" "}
                <a
                  href="https://wa.me/905412029659"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-900 transition"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                ✉️{" "}
                <a
                  href="mailto:destek@organizasyoncum.net"
                  className="hover:text-slate-900 transition"
                >
                  destek@organizasyoncum.net
                </a>
              </li>
            </ul>

            {/* mini CTA */}
            <div className="mt-4">
              <a
                href="tel:+905412029659"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-700 transition"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.63 2.61a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.47-1.09a2 2 0 0 1 2.11-.45c.84.3 1.71.51 2.61.63A2 2 0 0 1 22 16.92z"/></svg>
                Hemen Ara
              </a>
            </div>
          </div>
        </div>

        {/* alt satır */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500 md:flex-row">
          <div>© {year} Burdur Organizasyon. Tüm hakları saklıdır.</div>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-slate-700">KVKK</Link>
            <span className="opacity-30">•</span>
            <Link href="#" className="hover:text-slate-700">Çerez Politikası</Link>
            <span className="opacity-30">•</span>
            <a href="#top" className="hover:text-slate-700">Yukarı Çık</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
