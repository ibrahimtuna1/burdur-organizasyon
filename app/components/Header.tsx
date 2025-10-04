// app/components/Header.tsx
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm">
      {/* Main nav */}
      <div className="relative bg-white/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex min-w-0 flex-shrink-0 items-center gap-3">
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

          {/* Menu (mobilde de görünsün) */}
          <nav className="flex min-w-0 flex-1 items-center justify-center gap-2 overflow-x-auto text-[13px] font-medium text-slate-800 md:gap-3 md:text-sm">
            {[
              ["/paketler", "Organizasyon Paketleri"],
              ["/hizmetlerimiz", "Hizmetlerimiz"],
            ].map(([href, label]) => (
              <Link
                key={label}
                href={href}
                className="group inline-flex flex-shrink-0 items-center rounded-full bg-white/70 px-3 py-2 ring-1 ring-slate-200 shadow-sm transition hover:text-amber-700 hover:ring-amber-500"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* CTA (sadece md+ göster) */}
          <div className="hidden md:block">
            <Link
              href="#iletisim"
              className="rounded-full bg-gradient-to-r from-amber-500 to-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
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
