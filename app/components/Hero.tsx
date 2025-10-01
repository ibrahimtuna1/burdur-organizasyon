"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Slide = {
  title: string;
  img: string;
};

const slides: Slide[] = [
  { title: "Düğün Organizasyonu", img: "/images/slides/1.png" },
  { title: "Kına Organizasyonu", img: "/images/slides/2.png" },
  { title: "Açılış Organizasyonu", img: "/images/slides/3.png" },
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

  return (
    <section className="relative min-h-[80vh] overflow-hidden">
      <div className="relative w-full min-h-[80vh]">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Arka plan */}
            <motion.img
              key={s.img}
              src={s.img}
              alt={s.title}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 6, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* İçerik */}
            <AnimatePresence mode="wait">
              {i === current && (
                <div className="relative z-30 flex h-full items-center">
                  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                      key={s.title}
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -40, opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="inline-block bg-black/50 backdrop-blur-sm rounded-xl px-6 py-3 
                                 text-4xl md:text-6xl font-extrabold tracking-tight text-white shadow-lg"
                    >
                      {s.title}
                    </motion.h1>

                    <motion.div
                      key={s.title + "-btn"}
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -40, opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                      className="mt-6"
                    >
                      <a
                        href={callHref}
                        className="inline-block rounded-xl bg-amber-600 px-10 py-4 
                                   text-lg font-extrabold tracking-tight text-white 
                                   shadow-lg hover:bg-amber-700 transition relative overflow-hidden"
                      >
                        <span className="relative z-10">Hemen Ara</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-amber-400/40 to-transparent animate-pulse" />
                      </a>
                    </motion.div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Kontrol butonları */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-40 rounded-full 
                     bg-white/80 p-3 shadow hover:bg-white transition"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-40 rounded-full 
                     bg-white/80 p-3 shadow hover:bg-white transition"
        >
          ›
        </button>

        {/* Pagination */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                idx === current
                  ? "w-6 bg-amber-500 shadow-md"
                  : "bg-white/70 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
