// app/components/Header.tsx
import Image from "next/image";
import Link from "next/link";

function Divider() {
  return <span className="mx-3 hidden h-4 w-px shrink-0 bg-slate-300 sm:inline-block" />;
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm">
      {/* Top info bar */}
      <div className="border-b border-slate-200 bg-gradient-to-r from-amber-50 to-pink-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs text-slate-600 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <span className="mr-2 select-none text-amber-600">›</span>
            <span className="whitespace-nowrap">Profesyonel Hizmet Kalitesinin Adresi</span>
            <Divider />
            <Link
              href="tel:+905412029659"
              className="inline-flex items-center gap-2 hover:text-amber-700 transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden className="opacity-60">
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.63 2.61a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.47-1.09a2 2 0 0 1 2.11-.45c.84.3 1.71.51 2.61.63A2 2 0 0 1 22 16.92z"
                  fill="currentColor"
                />
              </svg>
              <span>0 541 202 96 59</span>
            </Link>
            <Divider />
            <Link
              href="mailto:destek@organizasyoncum.net"
              className="inline-flex items-center gap-2 hover:text-amber-700 transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden className="opacity-60">
                <path
                  d="M4 4h16a2 2 0 0 1 2 2v.4l-10 6.25L2 6.4V6a2 2 0 0 1 2-2Zm16 16H4a2 2 0 0 1-2-2V8.3l9.4 5.87a2 2 0 0 0 2.2 0L22 8.3V18a2 2 0 0 1-2 2Z"
                  fill="currentColor"
                />
              </svg>
              <span>destek@organizasyoncum.net</span>
            </Link>
          </div>

          {/* socials */}
          <nav className="ml-4 hidden items-center gap-3 sm:flex">
            <Link href="#" aria-label="Facebook" className="hover:text-amber-700 transition">
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                <path
                  d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.7V12h2.7V9.8c0-2.7 1.6-4.2 4-4.2 1.2 0 2.4.2 2.4.2v2.6h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 2.9h-2.4v7A10 10 0 0 0 22 12Z"
                  fill="currentColor"
                />
              </svg>
            </Link>
            {/* diğer ikonlar aynı kalabilir */}
          </nav>
        </div>
      </div>

      {/* Main nav */}
      <div className="relative bg-white/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Organizasyoncum"
              width={150}
              height={40}
              className="h-10 w-auto"
              priority
            />
            <span className="sr-only">Organizasyoncum</span>
          </Link>

          {/* Menu */}
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-800 md:flex">
            {[
              ["#hizmetler", "Organizasyon Paketleri"],
              ["#galeri", "Galeri"],
              ["#hizmetler", "Hizmetlerimiz"],
              ["#hakkimizda", "Faaliyetlerimiz"],
              ["#hizmetler", "Ürünler"],
              ["#hakkimizda", "Blog"],
              ["#", "Diğer"],
            ].map(([href, label]) => (
              <Link
                key={label}
                href={href}
                className="relative hover:text-amber-700 transition"
              >
                {label}
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-amber-600 transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            <Link
              href="#iletisim"
              className="rounded-md bg-gradient-to-r from-amber-500 to-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-md hover:opacity-90 transition"
            >
              İletişim
            </Link>
          </div>
        </div>

        {/* gradient alt çizgi */}
        <div className="h-1 w-full bg-gradient-to-r from-pink-400 via-amber-400 to-fuchsia-500" />
      </div>
    </header>
  );
}
