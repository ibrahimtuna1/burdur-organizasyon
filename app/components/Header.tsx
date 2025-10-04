// app/components/Header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const links = [
    { href: "/paketler", label: "Organizasyon Paketleri" },
    { href: "/hizmetlerimiz", label: "Hizmetlerimiz" },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50">
      {/* Blur arkaplan + hairline */}
      <div className="bg-white/70 backdrop-blur-xl ring-1 ring-black/5 shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* üst sıra: logo + iletişim */}
          <div className="flex h-14 items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Organizasyoncum"
                width={140}
                height={36}
                className="h-9 w-auto md:h-10"
                priority
              />
              <span className="sr-only">Organizasyoncum</span>
            </Link>

            {/* CTA – mobilde ikon, md+ buton */}
            <Link
              href="#iletisim"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-pink-500 px-3 py-2 text-white shadow-md transition hover:opacity-90 md:px-5"
              aria-label="İletişim"
            >
              <span className="hidden text-sm font-semibold md:inline">İletişim</span>
              <svg
                className="h-5 w-5 md:hidden"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2 5.5C2 4.67 2.67 4 3.5 4h17A1.5 1.5 0 0 1 22 5.5V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5.5Zm0 0L12 12l10-6.5"
                />
              </svg>
            </Link>
          </div>

          {/* mobil: segment nav (iki büyük buton); md+: ince pill nav */}
          <div className="pb-3">
            {/* Mobile segmented control */}
            <nav className="md:hidden">
              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white/80 p-1 ring-1 ring-slate-200 shadow-sm">
                {links.map(({ href, label }) => {
                  const active = isActive(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "inline-flex items-center justify-center rounded-xl px-3 py-2 text-[13px] font-semibold transition",
                        active
                          ? "bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow"
                          : "text-slate-700 hover:text-amber-700 hover:bg-amber-50",
                      ].join(" ")}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Desktop pills */}
            <nav className="hidden items-center justify-center gap-2 py-2 md:flex">
              <div className="rounded-full bg-white/70 p-1 ring-1 ring-slate-200 shadow-sm">
                {links.map(({ href, label }) => {
                  const active = isActive(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "mx-0.5 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition",
                        active
                          ? "bg-slate-900 text-white"
                          : "text-slate-800 hover:text-amber-700 hover:ring-amber-500 hover:bg-white/80 ring-1 ring-transparent",
                      ].join(" ")}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>

        {/* alt renk şeridi */}
        <div className="h-[3px] w-full bg-gradient-to-r from-pink-400 via-amber-400 to-fuchsia-500" />
      </div>
    </header>
  );
}
