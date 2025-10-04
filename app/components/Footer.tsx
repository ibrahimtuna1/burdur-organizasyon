// app/components/Footer.tsx
"use client";

import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate mt-0 bg-white text-slate-900 overflow-hidden">
      {/* ince üst çizgi */}
      <div className="h-px w-full bg-gradient-to-r from-pink-200 via-amber-200 to-fuchsia-200" />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* marka + sosyal + iletişim */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 items-start">
          {/* Marka */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Burdur Organizasyon"
                width={160}
                height={44}
                className="h-10 w-auto"
                priority
              />
              <span className="sr-only">Burdur Organizasyon</span>
            </div>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
              Düğün, kına, nişan ve özel günler için A’dan Z’ye çözüm.
              Burdur &amp; Isparta’da tek ekip, şeffaf fiyat, stressiz organizasyon.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-700">13+ yıl tecrübe</span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-700">3.625+ organizasyon</span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-700">1.854 olumlu yorum</span>
            </div>
          </div>

          {/* Sosyal – Instagram + YouTube */}
          <div className="md:col-span-3">
            <div className="text-sm font-semibold">Sosyal</div>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li>
                <a
                  href="https://www.instagram.com/organizasyoncummm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                    <path
                      fill="currentColor"
                      d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5.5A5.5 5.5 0 1 0 17.5 13 5.5 5.5 0 0 0 12 7.5Zm6-1.3a1 1 0 1 0 1.2 1.6 1 1 0 0 0-1.2-1.6Z"
                    />
                  </svg>
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://m.youtube.com/channel/UCbw9XoUz60qTaLChvA51Bmw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                    <path
                      fill="currentColor"
                      d="M23 12s0-3.2-.4-4.7a3 3 0 0 0-2.1-2.1C18.9 4.5 12 4.5 12 4.5s-6.9 0-8.5.7A3 3 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a3 3 0 0 0 2.1 2.1c1.6.7 8.5.7 8.5.7s6.9 0 8.5-.7a3 3 0 0 0 2.1-2.1c.4-1.5.4-4.7.4-4.7ZM10 9.8l5.7 2.2L10 14.2V9.8Z"
                    />
                  </svg>
                  YouTube
                </a>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div className="md:col-span-4">
            <div className="text-sm font-semibold">İletişim</div>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
              <li>📍 Burdur Merkez</li>
              <li>📞 <a href="tel:+905412029659" className="hover:text-slate-900 transition">+90 541 202 96 59</a></li>
              <li>💬 <a href="https://wa.me/905412029659" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition">WhatsApp</a></li>
              <li>✉️ <a href="mailto:destek@organizasyoncum.net" className="hover:text-slate-900 transition">destek@organizasyoncum.net</a></li>
            </ul>
            <div className="mt-3">
              {/* Footer CTA */}
              <a
                href="tel:+905412029659"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-pink-500 px-3.5 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.63 2.61a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.47-1.09a2 2 0 0 1 2.11-.45c.84.3 1.71.51 2.61.63A2 2 0 0 1 22 16.92z"
                  />
                </svg>
                Hemen Ara
              </a>
            </div>
          </div>
        </div>

        {/* alt satır */}
        <div className="mt-4 border-t border-slate-200 pt-3 text-center text-xs text-slate-500">
          © {year} işify.com. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
