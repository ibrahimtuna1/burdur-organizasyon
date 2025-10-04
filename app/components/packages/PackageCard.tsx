// app/(site)/components/packages/PackageCard.tsx
import { fmtPrice } from "@/lib/pkg";
import Link from "next/link";

const CALL_NUMBER = "05412029659";
const WHATSAPP = `https://wa.me/90${CALL_NUMBER.replace(/\D/g, "").slice(-10)}`;

export default function PackageCard({
  title,
  subtitle,
  price,
  currency = "TRY",
  featured = false,
  children,
}: {
  title: string;
  subtitle?: string | null;
  price: number;
  currency?: string;
  featured?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={[
        featured
          ? "rounded-2xl bg-gradient-to-r from-amber-500 to-pink-500 p-[1.5px]"
          : "rounded-2xl border",
        "bg-white shadow-sm",
      ].join(" ")}
    >
      <div className="rounded-[calc(1rem-1.5px)] bg-white p-6">
        {featured && (
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 px-3 py-1 text-xs font-semibold text-white shadow">
            <span>★</span> En Çok Tercih Edilen
          </div>
        )}

        {/* Başlık ve alt başlık */}
        <h3 className="text-xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h3>
        {subtitle && <p className="mt-1 text-sm text-slate-800">{subtitle}</p>}

        {/* Fiyat */}
        <div className="mt-4">
          <span className="text-4xl font-black text-slate-900">
            {fmtPrice(price, currency)}
          </span>
          <span className="align-super text-xl text-slate-400"> /</span>
        </div>

        {/* Özellikler */}
        <ul className="mt-5 space-y-2 text-slate-800">{children}</ul>

        <Link
          href={WHATSAPP}
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 px-4 py-2.5 font-semibold text-white shadow-md transition hover:opacity-90"
        >
          Whatsapp İletişim
        </Link>
      </div>
    </div>
  );
}
