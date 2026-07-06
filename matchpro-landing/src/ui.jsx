import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, animate } from "framer-motion";
import { reveal, stagger } from "./motion";
import { useLang } from "./i18n";

/* ── Reveal: patrón único de entrada de sección ─────────────── */

export function Reveal({ children, className = "", as = "div", staggered = false }) {
  const prefersReduced = useReducedMotion();
  const Comp = motion[as] ?? motion.div;
  const variants = prefersReduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.2 } } }
    : staggered
      ? stagger
      : reveal;
  return (
    <Comp
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </Comp>
  );
}

export function RevealItem({ children, className = "" }) {
  const prefersReduced = useReducedMotion();
  const variants = prefersReduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.2 } } }
    : reveal;
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}

/* ── CountUp: contador de social proof (una sola vez) ───────── */

export function CountUp({ to, prefix = "", suffix = "", className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReduced = useReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (prefersReduced) {
      setVal(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, prefersReduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {val.toLocaleString("es-CL")}
      {suffix}
    </span>
  );
}

/* ── Encabezado de sección ──────────────────────────────────── */

export function SectionHeading({ eyebrow, title, sub, dark = false, center = true }) {
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={`eyebrow ${dark ? "text-limebrand" : "text-limefg"}`}>{eyebrow}</p>
      <h2
        className={`mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl ${
          dark ? "text-nightink" : "text-inkstrong"
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p className={`mt-4 text-lg leading-relaxed ${dark ? "text-nightsecond" : "text-second"}`}>
          {sub}
        </p>
      )}
    </Reveal>
  );
}

/* ── Badges de descarga ─────────────────────────────────────── */

const AppleGlyph = ({ className }) => (
  <svg viewBox="0 0 384 512" className={className} fill="currentColor" aria-hidden="true">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

/** CTA primaria a App Store + Google Play "pronto". */
export function StoreBadges({ className = "", light = false }) {
  const { t } = useLang();
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <a
        href="https://getmatchpro.com/app"
        className="group flex items-center gap-3 rounded-full bg-inkstrong px-6 py-2.5 text-white transition-all hover:-translate-y-0.5 hover:bg-night"
        aria-label={t.badges.appAria}
      >
        <AppleGlyph className="h-7 w-7" />
        <span className="leading-tight">
          <span className="block text-[10px] font-medium opacity-80">{t.badges.appTop}</span>
          <span className="block text-lg font-semibold -mt-0.5">{t.badges.appName}</span>
        </span>
      </a>
      <div
        className={`flex items-center gap-3 rounded-full border px-6 py-2.5 ${
          light ? "border-nightline text-nightsecond" : "border-line text-mutedink"
        }`}
      >
        <svg viewBox="0 0 512 512" className="h-6 w-6" fill="currentColor" aria-hidden="true">
          <path d="M325.3 234.3 104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
        </svg>
        <span className="leading-tight">
          <span className="block text-[10px] font-medium opacity-80">{t.badges.playTop}</span>
          <span className="block text-base font-semibold -mt-0.5">{t.badges.playName}</span>
        </span>
      </div>
    </div>
  );
}

/** QR de descarga — solo desktop (el usuario está en su laptop, el teléfono en la mano). */
export function QrCard({ className = "" }) {
  const { t } = useLang();
  return (
    <div
      className={`hidden items-center gap-4 rounded-2xl border border-line bg-white p-4 lg:flex ${className}`}
    >
      <img src="/qr-app.svg" alt="QR MatchPro" className="h-20 w-20" />
      <p className="max-w-[150px] text-sm leading-snug text-second">
        {t.badges.qr1} <span className="font-semibold text-inkstrong">{t.badges.qr2}</span>
      </p>
    </div>
  );
}

/* ── Marco de iPhone para screenshots reales ────────────────── */

export function PhoneFrame({ src, alt, className = "", eager = false }) {
  return (
    <div
      className={`overflow-hidden rounded-[2.6rem] border-[6px] border-inkstrong bg-inkstrong shadow-2xl shadow-inkstrong/25 ${className}`}
    >
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        className="block w-full rounded-[2.2rem]"
      />
    </div>
  );
}
