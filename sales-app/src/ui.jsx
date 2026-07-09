// ─────────────────────────────────────────────────────────────
// UI compartida — heredada de clubmanager-landing y adaptada a
// la Sales App: PanelChrome se personaliza con el club activo
// (nombre + iniciales) y todo es ES-only.
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, animate } from "framer-motion";
import { reveal, stagger } from "./motion";
import { DEMO_URL, WHATSAPP_URL } from "./links";
import { useClub } from "./club";
import cmLogo from "./assets/logo-clubmanager.svg";
import cmLogoBlanco from "./assets/logo-clubmanager-blanco.svg";

/* ── Reveal ─────────────────────────────────────────────────── */

export function Reveal({ children, className = "", as = "div", staggered = false }) {
  const prefersReduced = useReducedMotion();
  const Comp = motion[as] ?? motion.div;
  const variants = prefersReduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.2 } } }
    : staggered
      ? stagger
      : reveal;
  return (
    <Comp className={className} variants={variants} initial="hidden" animate="show">
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

/* ── CountUp ────────────────────────────────────────────────── */

export function CountUp({ to, prefix = "", suffix = "", className = "" }) {
  const prefersReduced = useReducedMotion();
  const [val, setVal] = useState(0);

  /* Anima al montar (no al entrar en viewport): en el deck cada lámina
     se monta al mostrarse, así que ya está a la vista; y al imprimir
     TODAS apiladas, las de más abajo también cuentan (antes quedaban
     en 0 porque nunca entraban al viewport). */
  useEffect(() => {
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
  }, [to, prefersReduced]);

  return (
    <span className={className}>
      {prefix}
      {val.toLocaleString("es-CL")}
      {suffix}
    </span>
  );
}

/* ── Acento lime en títulos ─────────────────────────────────── */

export function Accent({ children }) {
  return (
    <span className="underline decoration-limebrand decoration-[3px] underline-offset-[5px]">
      {children}
    </span>
  );
}

/* ── Lockup Club Manager — logo oficial (letras blancas en dark) ── */

export function Lockup({ dark = false, className = "" }) {
  return (
    <img
      src={dark ? cmLogoBlanco : cmLogo}
      alt="Club Manager"
      className={`w-auto ${className || "h-4.5"}`}
    />
  );
}

/* ── CTAs de conversión ─────────────────────────────────────── */

export function CtaPair({ dark = false, className = "" }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <a
        href={DEMO_URL}
        target="_blank"
        rel="noreferrer"
        className="group inline-flex items-center gap-2 rounded-full bg-limebrand px-6 py-3 text-[15px] font-bold whitespace-nowrap text-limeink shadow-lg shadow-limebrand/25 transition-all hover:-translate-y-0.5 hover:shadow-limebrand/40"
      >
        Agendar demo
        <span aria-hidden="true" className="inline-block transition-transform duration-150 group-hover:translate-x-[3px]">
          →
        </span>
      </a>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        className={`inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[15px] font-semibold whitespace-nowrap transition-all hover:-translate-y-0.5 ${
          dark
            ? "border-nightline bg-white/5 text-nightink hover:border-nightsecond hover:bg-white/10"
            : "border-line bg-white text-inkstrong hover:border-mutedink"
        }`}
      >
        <WhatsAppGlyph className="h-[18px] w-[18px]" />
        WhatsApp
      </a>
    </div>
  );
}

export function WhatsAppGlyph({ className = "" }) {
  return (
    <svg viewBox="0 0 448 512" className={className} fill="currentColor" aria-hidden="true">
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
    </svg>
  );
}

/* ── PanelChrome: frame real de Club Manager, personalizado ──── */

const NAV_ITEMS = ["Dashboard", "Socios", "Escalerillas", "Torneos", "Canchas"];
const WEATHER = [
  ["☀️", "27"],
  ["⛅", "28"],
  ["☀️", "1"],
];
const DIAS = ["VIE", "SÁB", "DOM"];

export function PanelChrome({ children, active = "Dashboard", className = "" }) {
  const club = useClub();
  return (
    <div
      className={`font-product overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/40 ring-1 ring-black/15 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <img src={cmLogo} alt="Club Manager" className="h-3 w-auto" />
        <span className="hidden items-center gap-3 text-[8.5px] font-medium text-second sm:flex">
          {NAV_ITEMS.map((i) => (
            <span key={i} className={i === active ? "font-bold text-inkstrong" : ""}>
              {i}
            </span>
          ))}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3.5 w-3.5 rounded-full bg-surface ring-1 ring-line" aria-hidden="true" />
        </span>
      </div>

      <div className="pm-band relative flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-limebrand text-[10px] font-extrabold text-limeink">
            {club.iniciales}
          </span>
          <div>
            <p className="text-[11px] leading-tight font-bold text-white">
              {club.nombre}{" "}
              <span className="ml-1 rounded bg-pmamber px-1 py-px text-[7px] font-bold text-white">
                Club Manager
              </span>
            </p>
            <p className="text-[8px] text-white/75">Administrador</p>
          </div>
        </div>
        <div className="flex gap-1" aria-hidden="true">
          {WEATHER.map(([ic, d], i) => (
            <span
              key={i}
              className="rounded-md bg-white/15 px-1.5 py-0.5 text-center text-[8px] leading-tight text-white"
            >
              {ic} <span className="font-bold">{d}</span>
              <span className="block text-[6px] font-semibold opacity-80">{DIAS[i]}</span>
            </span>
          ))}
        </div>
      </div>

      {children}
    </div>
  );
}

/* ── Range: slider con estilo propio (track lime + thumb) ───── */

export function Range({ value, min = 0, max = 100, step = 1, onChange, dark = false, disabled = false, className = "" }) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min || 1)) * 100));
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`range-pro ${dark ? "range-dark" : ""} ${className}`}
      style={{ "--pct": `${pct}%` }}
    />
  );
}

/* ── Sparkline ──────────────────────────────────────────────── */

export function Sparkline({ points, className = "", stroke = "var(--color-tealbrand)" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReduced = useReducedMotion();
  return (
    <svg ref={ref} viewBox="0 0 140 30" className={className} aria-hidden="true">
      <motion.polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: prefersReduced ? 1 : 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </svg>
  );
}

/* ── SlideSplit: layout estándar de diapositiva de módulo ─────
   Texto a la izquierda (eyebrow, título, descripción, pill),
   mock vivo a la derecha. La grilla usa items-center para que
   el mock respire a cualquier alto de pantalla.               */

export function SlideSplit({ eyebrow, title, desc, pill, mock, extra = null }) {
  return (
    <div className="mx-auto grid h-full w-full max-w-6xl items-center gap-10 px-10 py-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
      <Reveal staggered>
        <RevealItem>
          <p className="eyebrow text-tealbrand">{eyebrow}</p>
        </RevealItem>
        <RevealItem>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance text-inkstrong xl:text-4xl">
            {title}
          </h2>
        </RevealItem>
        <RevealItem>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-second xl:text-base">{desc}</p>
        </RevealItem>
        {pill && (
          <RevealItem>
            <p className="mt-5 inline-block rounded-full bg-limetint px-4 py-1.5 text-sm font-semibold text-limeink">
              {pill}
            </p>
          </RevealItem>
        )}
        {extra && <RevealItem>{extra}</RevealItem>}
      </Reveal>
      {/* .mock: en impresión se preserva tal cual (ver @media print) */}
      <Reveal className="min-w-0 mock">{mock}</Reveal>
    </div>
  );
}
