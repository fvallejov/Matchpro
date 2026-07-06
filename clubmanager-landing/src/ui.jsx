import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, animate } from "framer-motion";
import { reveal, stagger } from "./motion";
import { DEMO_URL, WHATSAPP_URL } from "./links";
import { useLang } from "./i18n";
import isotipo from "./assets/isotipo.svg";

/* ── Reveal: patrón único de entrada de sección (heredado V5) ── */

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

/* ── CountUp: contador (una sola vez, 0.8 s) ────────────────── */

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

/* ── Acento de título: subraya EN LIME la frase clave.
      Regla: máximo un acento por título. ─────────────────────── */

export function Accent({ children }) {
  return (
    <span className="underline decoration-limebrand decoration-[3px] underline-offset-[5px]">
      {children}
    </span>
  );
}

/** Título traducible con acento: recibe [antes, acento, después]. */
export function AccentTitle({ parts }) {
  const [a, b, c] = parts;
  return (
    <>
      {a}
      <Accent>{b}</Accent>
      {c}
    </>
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

/* ── Lockup Club Manager: isotipo + wordmark (patrón sub-producto:
      bold + italic light, mismo gesto que MATCHPROtv) ─────────── */

export function Lockup({ dark = false, className = "" }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <img src={isotipo} alt="" className="h-6 w-auto" aria-hidden="true" />
      <span
        className={`text-[15px] leading-none font-extrabold tracking-tight ${
          dark ? "text-white" : "text-inkstrong"
        }`}
      >
        CLUB
        <span className="font-medium italic">MANAGER</span>
      </span>
    </span>
  );
}

/* ── Par de CTAs de conversión (el único primario del sitio) ──
   Labels cortos + nowrap: un botón que quiebra en dos líneas
   es un botón roto. Primario lime (color de acción del
   ecosistema); secundario subordinado de verdad.             */

export function CtaPair({ dark = false, className = "" }) {
  const { t } = useLang();
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <a
        href={DEMO_URL}
        className="group inline-flex items-center gap-2 rounded-full bg-limebrand px-6 py-3 text-[15px] font-bold whitespace-nowrap text-limeink shadow-lg shadow-limebrand/25 transition-all hover:-translate-y-0.5 hover:shadow-limebrand/40"
      >
        {t.cta.demo}
        <span aria-hidden="true" className="inline-block transition-transform duration-150 group-hover:translate-x-[3px]">
          →
        </span>
      </a>
      <a
        href={WHATSAPP_URL}
        className={`inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[15px] font-semibold whitespace-nowrap transition-all hover:-translate-y-0.5 ${
          dark
            ? "border-nightline bg-white/5 text-nightink hover:border-nightsecond hover:bg-white/10"
            : "border-line bg-white text-inkstrong hover:border-mutedink"
        }`}
      >
        <WhatsAppGlyph className="h-[18px] w-[18px]" />
        {t.cta.whatsapp}
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

/* ── Chrome de browser para mocks planos del panel (patrón V5) ── */

export function BrowserChrome({ children, url = "getmatchpro.com", className = "" }) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl shadow-inkstrong/15 ring-1 ring-black/10 ${className}`}
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-line bg-surface px-3 py-2">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </span>
        <span className="mx-auto rounded-md bg-white px-3 py-0.5 font-mono text-[9px] text-second ring-1 ring-line">
          {url}
        </span>
      </div>
      {children}
    </div>
  );
}

/* ── PanelChrome: réplica del frame REAL de Club Manager ────────
   Topnav blanco con logo MatchPro y menú, banda azul degradada
   con avatar del club + clima (como el producto), contenido en
   Poppins. La paleta pm* y --font-product viven SOLO aquí.    */

/* El producto tiene modo inglés: nav y metadatos del mock se
   traducen. Las claves de `active` son estables (es). */
const PANEL_I18N = {
  es: {
    nav: { Dashboard: "Dashboard", Socios: "Socios", Escalerillas: "Escalerillas", Torneos: "Torneos", Canchas: "Canchas" },
    rol: "Administrador",
    dias: ["VIE", "SÁB", "DOM"],
  },
  en: {
    nav: { Dashboard: "Dashboard", Socios: "Members", Escalerillas: "Ladders", Torneos: "Tournaments", Canchas: "Courts" },
    rol: "Admin",
    dias: ["FRI", "SAT", "SUN"],
  },
};

const NAV_ITEMS = ["Dashboard", "Socios", "Escalerillas", "Torneos", "Canchas"];
const WEATHER = [
  ["☀️", "27"],
  ["⛅", "28"],
  ["☀️", "1"],
];

export function PanelChrome({ children, active = "Dashboard", className = "" }) {
  const { lang } = useLang();
  const P = PANEL_I18N[lang];
  return (
    <div
      className={`font-product overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/40 ring-1 ring-black/15 ${className}`}
    >
      {/* Topnav blanco del producto — lockup Club Manager */}
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <span className="flex items-center gap-1.5">
          <img src={isotipo} alt="" className="h-3.5 w-auto" aria-hidden="true" />
          <span className="text-[10px] leading-none font-extrabold tracking-tight text-inkstrong">
            CLUB<span className="font-medium italic">MANAGER</span>
          </span>
        </span>
        <span className="hidden items-center gap-3 text-[8.5px] font-medium text-second sm:flex">
          {NAV_ITEMS.map((i) => (
            <span key={i} className={i === active ? "font-bold text-inkstrong" : ""}>
              {P.nav[i]}
            </span>
          ))}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3.5 w-3.5 rounded-full bg-surface ring-1 ring-line" aria-hidden="true" />
        </span>
      </div>

      {/* Banda azul del producto: club + clima */}
      <div className="pm-band relative flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-limebrand text-[10px] font-extrabold text-limeink">
            LA
          </span>
          <div>
            <p className="text-[11px] leading-tight font-bold text-white">
              Club Los Aromos <span className="ml-1 rounded bg-pmamber px-1 py-px text-[7px] font-bold text-white">Club Manager</span>
            </p>
            <p className="text-[8px] text-white/75">{P.rol}</p>
          </div>
        </div>
        <div className="flex gap-1" aria-hidden="true">
          {WEATHER.map(([ic, d], i) => (
            <span key={i} className="rounded-md bg-white/15 px-1.5 py-0.5 text-center text-[8px] leading-tight text-white">
              {ic} <span className="font-bold">{d}</span>
              <span className="block text-[6px] font-semibold opacity-80">{P.dias[i]}</span>
            </span>
          ))}
        </div>
      </div>

      {children}
    </div>
  );
}

/* ── Sparkline que se dibuja sola al entrar en viewport ─────── */

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
