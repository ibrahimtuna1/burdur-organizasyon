import Hero from "./components/Hero";
import Sections from "./blocks/section";

export default function Page() {
  return (
    <>
      {/* SEO için ana H1 (görselde görünmez, tarayıcı okur) */}
      <h1 className="sr-only">Burdur Organizasyon</h1>

      {/* Kısa site açıklaması (görünür, sade) */}
      <section className="border-y border-slate-200">
        <div className="mx-auto max-w-5xl px-4 py-5 text-center text-sm sm:text-base text-slate-700">
          Burdur Organizasyon Şirketi Olarak Sizlere; Düğün, Nişan, Açılış, Sünnet,
          Kına Gecelerini Anlamlı ve Unutulmaz Kılmak İçin Ciddiyet ve
          Profesyonellikle Çalışıyoruz.
        </div>
      </section>

      <Hero />
      <Sections />

      {/* Anahtar kelimeler sayfaya gömülü (görünmez) */}
      <section aria-hidden className="sr-only">
        Burdur organizasyon, Burdur düğün organizasyon, Burdur nişan organizasyon,
        Burdur açılış organizasyon, Burdur sünnet organizasyon,
        Burdur kına gecesi organizasyon, Burdur söz organizasyon,
        Burdur organizasyon şirketi, Burdur organizasyon firmaları
      </section>
    </>
  );
}
