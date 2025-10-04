import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsappButton from "./components/WhatsappButton";

const desc =
  "Burdur Organizasyon Şirketi Olarak Sizlere; Düğün, Nişan, Açılış, Sünnet, Kına Gecelerini Anlamlı ve Unutulmaz Kılmak İçin Ciddiyet ve Profesyonellikle Çalışıyoruz.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.burdurorganizasyon.com"),
  title: {
    default: "Burdur Organizasyon",
    template: "%s | Burdur Organizasyon",
  },
  description: desc,
  keywords: [
    "Burdur organizasyon",
    "Burdur düğün organizasyon",
    "Burdur nişan organizasyon",
    "Burdur açılış organizasyon",
    "Burdur sünnet organizasyon",
    "Burdur kına gecesi organizasyon",
    "Burdur söz organizasyon",
    "Burdur organizasyon şirketi",
    "Burdur organizasyon firmaları",
  ],
  openGraph: {
    title: "Burdur Organizasyon",
    description: desc,
    type: "website",
    url: "https://www.burdurorganizasyon.com",
    locale: "tr_TR",
  },
  alternates: { canonical: "https://www.burdurorganizasyon.com" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="h-full bg-white">
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased overflow-x-hidden">
        <style>{`html, body { background:#fff !important; }`}</style>

        <a href="#main" className="sr-only focus:not-sr-only">İçeriğe atla</a>

        <Header />
        <main id="main" className="flex-1 bg-white">{children}</main>
        <Footer />
        <WhatsappButton />
      </body>
    </html>
  );
}
