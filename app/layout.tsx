import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsappButton from "./components/WhatsappButton";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.burdurorganizasyon.com"),
  title: {
    default: "Burdur Organizasyon | Düğün • Kına • Nişan",
    template: "%s | Burdur Organizasyon",
  },
  description:
    "Burdur’da düğün, kına, nişan ve özel gün organizasyonlarında A-Z profesyonel hizmet. Hızlı kurulum, şeffaf fiyat, tek ekip.",
  openGraph: {
    title: "Burdur Organizasyon",
    description:
      "Burdur’da düğün, kına, nişan ve özel gün organizasyonlarında A-Z profesyonel hizmet.",
    type: "website",
    url: "https://www.burdurorganizasyon.com",
    locale: "tr_TR",
  },
  alternates: { canonical: "https://www.burdurorganizasyon.com" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="h-full bg-white">
      <body className="min-h-screen bg-white text-slate-900 antialiased overflow-x-hidden">
        {/* ekstra garanti: globalde siyah varsa ezelim */}
        <style>{`
          html, body { background:#fff !important; }
        `}</style>

        <a href="#main" className="sr-only focus:not-sr-only">İçeriğe atla</a>

        <Header />
        <main id="main" className="bg-white">
          {children}
        </main>
        <Footer />

        <WhatsappButton />
      </body>
    </html>
  );
}
