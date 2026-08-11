"use client";

/* Hero photo credits (Wikimedia Commons):
 * - /hero-commuter.jpg — app-owned asset.
 * - /hero-buses-nyabugogo.jpg — "Buses at Nyabugogo", Francisco Anzola, CC BY 2.0.
 * - /hero-rftc-bus.jpg — "Public bus transport" (RFTC, Kigali), Alex Shema, CC BY-SA 4.0.
 * - /hero-passengers.jpg — "Passengers waiting for bus at Ikeja Lagos", Tunesh247, CC BY-SA 4.0.
 * - /hero-conductor.jpg — "A bus-conductor calling for passengers", Oreoluwa Adetimehin, CC BY-SA 4.0.
 */

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const SLIDES = [
  "/hero-commuter.jpg",
  "/hero-buses-nyabugogo.jpg",
  "/hero-rftc-bus.jpg",
  "/hero-passengers.jpg",
  "/hero-conductor.jpg",
];

const INTERVAL = 6000;

export function HeroSlideshow({ captions }: { captions?: string[] }) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {SLIDES.map((src, i) => (
        <motion.div
          key={src}
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 1.4, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0"
            animate={i === index && !reduceMotion ? { scale: [1.02, 1.1] } : { scale: 1.02 }}
            transition={{ duration: INTERVAL / 1000 + 2, ease: "easeOut" }}
          >
            <Image
              src={src}
              alt="Kigali public transport in action — buses, stations and commuters"
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>
        </motion.div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-[#04140d] via-[#04140d]/85 to-[#04140d]/30" />
      <div className="absolute inset-0 bg-grid opacity-[0.14]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      {captions && captions[index] && (
        <div className="absolute bottom-8 left-4 z-10 sm:left-6 lg:left-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 backdrop-blur sm:px-4 sm:py-2.5"
            >
              <span className="grid h-5 w-5 place-items-center rounded-md bg-amber-400/20">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              </span>
              <span className="max-w-[60vw] text-xs font-semibold text-white/85 sm:max-w-md sm:text-sm">
                {captions[index]}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      <div className="absolute bottom-8 right-8 z-10 hidden items-center gap-2 lg:flex">
        {SLIDES.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1} of ${SLIDES.length}`}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index ? "w-7 bg-amber-400" : "w-1.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
