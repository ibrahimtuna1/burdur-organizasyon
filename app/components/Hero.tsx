"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Slide = {
  title: string;
  img: string;
  subtitle?: string;
};

const slides: Slide[] = [
  { title: "Düğün Organizasyonu", img: "/images/slides/1.png", subtitle: "Işığını yak, detayları bize bırak." },
  { title: "Kına Organizasyonu", img: "/images/slides/2.png", subtitle: "Gelenek + estetik = tam uyum." },
  { title: "Açılış Organizasyonu", img: "/images/slides/3.png", subtitle: "İlk izlenim, mükemmel olsun." },
];

const CALL_NUMBER = "05412029659";
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
    <section className="relative min-h-[80vh] overflow-hidden">
      {/* arka plan */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
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
          {/* üstten alta gradient; yazıyı netleştirir */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/30 to-black/10" />
        </div>
      ))}

      {/* içerik */}
      <div className="relative z-30 flex min-h-[80vh] items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={s.title}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-3xl"
            >
              {/* GLASS CARD: yazı bu kutuda; blur + ring + shadow */}
              <div className="inline-block rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/20 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]">
                <h1 className="px-6 pt-6 text-white text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow">
                  {s.title}
                </h1>

                {s.subtitle && (
                  <p className="px-6 pt-2 text-white/90 text-base sm:text-lg md:text-xl">
                    {s.subtitle}
                  </p>
                )}

                <div className="px-6 pb-6 pt-5">
                  <a
                    href={callHref}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-3 text-white font-semibold shadow-lg hover:bg-amber-700 transition"
                  >
                    Hemen Ara
                    <span aria-hidden>📞</span>
                  </a>
                </div>
              </div>

              {/* alt vurgu çizgisi */}
              <div className="mt-4 h-1.5 w-28 rounded-full bg-amber-500/90 shadow-[0_4px_18px_rgba(245,158,11,0.6)]" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* kontroller */}
      <button
        onClick={prev}
        aria-label="Önceki"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-40 rounded-full bg-white/85 p-3 shadow hover:bg-white transition"
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Sonraki"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-40 rounded-full bg-white/85 p-3 shadow hover:bg-white transition"
      >
        ›
      </button>

      {/* pagination */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              idx === current ? "w-7 bg-amber-500 shadow-md" : "w-2.5 bg-white/70 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
