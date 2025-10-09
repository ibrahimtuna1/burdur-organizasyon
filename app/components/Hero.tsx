// app/components/Hero.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Slide = {
  title: string;
  img: string;
  subtitle?: string;
};

const slides: Slide[] = [
  { title: "Düğün Organizasyonu", img: "/images/slides/1.png", subtitle: "Hayalinizdeki düğünü, en ince detayına kadar özenle planlıyoruz." },
  { title: "Kına Organizasyonu", img: "/images/slides/2.png", subtitle: "Hayalinizdeki kına gecesini unutulmaz bir anıya dönüştürüyoruz." },
  { title: "Açılış Organizasyonu", img: "/images/slides/3.png", subtitle: "Hayalinizdeki nişanı, size özel konseptlerle gerçeğe dönüştürüyoruz." },
];

const CALL_NUMBER = "05015529659";
const callHref = `tel:${CALL_NUMBER}`;

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const total = slides.length;
  const delay = 5000;

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  useEffect(() => {
    const id = setInterval(next, delay);
    return () => clearInterval(id);
  }, [next]);

  const s = slides[current];

  return (
    <section className="relative min-h-[100dvh] overflow-hidden">
      {/* arka plan */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          aria-hidden={i !== current}
        >
          <motion.img
            key={slide.img}
            src={slide.img}
            alt={slide.title}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "easeOut" }}
            className="absolute inset-0 h-full w-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 md:from-black/60 md:via-black/30 md:to-black/10" />
        </div>
      ))}

      {/* içerik */}
      <div
        className="
          relative z-30 flex min-h-[100dvh] items-center justify-center md:justify-start
          pb-[calc(96px+env(safe-area-inset-bottom))] md:pb-0
        "
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={s.title}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mx-auto max-w-3xl text-center md:mx-0 md:text-left"
            >
              <div className="inline-block">
                <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-2xl sm:text-6xl md:text-7xl">
                  {s.title}
                </h1>

                {s.subtitle && (
                  <p className="mt-3 text-base sm:text-lg md:text-2xl text-white/95 drop-shadow-md [text-wrap:balance]">
                    {s.subtitle}
                  </p>
                )}

                {/* Desktop CTA burada; mobilde gizli */}
                <div className="pt-5 hidden md:flex md:justify-start">
                  <a
                    href={callHref}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 px-7 py-3 font-semibold text-white shadow-lg transition hover:opacity-90 active:scale-[0.98]"
                  >
                    Hemen Ara <span aria-hidden>📞</span>
                  </a>
                </div>
              </div>

              {/* alt vurgu çizgisi */}
              <div className="mx-auto mt-4 h-1.5 w-28 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 shadow-[0_4px_18px_rgba(236,72,153,0.45)] md:mx-0" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* mobil CTA: tamamen alta sabit (hero içinde) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 px-4 md:hidden">
        <div className="pointer-events-auto mx-auto w-full max-w-7xl pb-[max(1rem,env(safe-area-inset-bottom))]">
          <a
            href={callHref}
            className="mx-auto block w-[min(92%,28rem)] rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 px-7 py-3 text-center font-semibold text-white shadow-lg transition hover:opacity-90 active:scale-[0.98]"
          >
            Hemen Ara 📞
          </a>
        </div>
      </div>

      {/* oklar */}
      <button
        onClick={prev}
        aria-label="Önceki"
        className="absolute left-3 top-1/2 z-40 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 p-3 text-white shadow-lg transition hover:opacity-90 active:scale-95"
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Sonraki"
        className="absolute right-3 top-1/2 z-40 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 p-3 text-white shadow-lg transition hover:opacity-90 active:scale-95"
      >
        ›
      </button>

      {/* pagination: CTA ile çakışmasın diye mobilde daha yukarı */}
      <div className="absolute bottom-24 md:bottom-8 left-1/2 z-40 -translate-x-1/2 flex gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              idx === current
                ? "w-7 bg-gradient-to-r from-amber-500 to-pink-500 shadow-md"
                : "w-2.5 bg-white/70 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
