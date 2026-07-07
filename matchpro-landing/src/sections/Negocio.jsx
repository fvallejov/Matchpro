import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { EASE } from "../motion";
import { Reveal, RevealItem, SectionHeading } from "../ui";
import { useLang } from "../i18n";

/* ── 7 · Deportes ───────────────────────────────────────────── */
/* Ilustraciones de la app (tenis = arcilla) + íconos oficiales
   de la app (sport-*.svg de Assets.xcassets) en chip lime.    */

const SPORT_META = [
  { icon: "/sport-tennis.svg", img: "/courts/arcilla.webp" },
  { icon: "/sport-padel.svg", img: "/courts/padel.webp" },
  { icon: "/sport-squash.svg", img: "/courts/squash.webp" },
  { icon: "/sport-pickleball.svg", img: "/courts/pickleball.webp" },
];

export function Deportes() {
  const { t } = useLang();
  const c = t.deportes;
  return (
    <section className="border-y border-line bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} sub={c.sub} />
        <Reveal staggered className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {c.sports.map(([name, note], i) => (
            <RevealItem
              key={name}
              className="group relative h-80 overflow-hidden rounded-3xl transition-transform duration-150 hover:-translate-y-1"
            >
              <img
                src={SPORT_META[i].img}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/25 to-transparent"
                aria-hidden="true"
              />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-limebrand transition-transform duration-200 group-hover:rotate-6">
                  <img src={SPORT_META[i].icon} alt="" className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-xl font-extrabold text-white italic">{name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/85">{note}</p>
              </div>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ── 8 · Para tu club — cards aurora (gesto del Figma, en marca) ── */

/* ── Dashboards recreados en HTML (nítidos a cualquier escala) ──
   Club Manager: réplica del panel real, en un marco de browser.
   MatchPro TV: réplica del dashboard real de matchpro.tv.       */

// Sparkline de socios (área lime que se dibuja sola)
const SPARK = "0,26 14,24 28,25 42,20 56,21 70,16 84,14 98,15 112,9 126,7 140,4";

function BrowserMock() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const prefersReduced = useReducedMotion();
  const anim = inView || prefersReduced;

  return (
    <div
      ref={ref}
      className="floaty mx-auto flex aspect-video w-full max-w-sm flex-col overflow-hidden rounded-xl bg-white shadow-2xl shadow-black/50 ring-1 ring-black/10"
    >
      {/* Chrome del browser */}
      <div className="flex shrink-0 items-center gap-2 border-b border-line bg-surface px-3 py-2">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </span>
        <span className="mx-auto rounded-md bg-white px-3 py-0.5 font-mono text-[8px] text-second ring-1 ring-line">
          getmatchpro.com
        </span>
      </div>

      {/* Banner azul del panel */}
      <div className="relative shrink-0 overflow-hidden bg-gradient-to-r from-[#2563EB] to-[#3B82F6] px-3 py-2">
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-limebrand text-[10px] font-extrabold text-limeink italic">
              C
            </span>
            <div>
              <p className="text-[10px] leading-tight font-bold text-white">Club Cordillera</p>
              <p className="text-[7px] text-white/75">8 canchas · Tenis y pádel</p>
            </div>
          </div>
          <div className="flex gap-1" aria-hidden="true">
            {[
              ["☀️", "SÁB"],
              ["⛅", "DOM"],
              ["🌧️", "LUN"],
            ].map(([ic, d]) => (
              <span
                key={d}
                className="rounded-md bg-white/15 px-1.5 py-0.5 text-center text-[7px] text-white"
              >
                {ic}
                <span className="block text-[5.5px] font-bold">{d}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Módulos gráficos — gestión, no cifras sueltas */}
      <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-1.5 overflow-hidden p-2.5">
        {/* Ocupación de canchas: barras horizontales animadas */}
        <div className="flex flex-col overflow-hidden rounded-lg border border-line p-2">
          <p className="shrink-0 text-[7px] font-bold text-inkstrong">Ocupación de canchas</p>
          <div className="mt-1 flex min-h-0 flex-1 flex-col justify-evenly">
            {[
              ["C1", 92],
              ["C2", 78],
              ["C3", 55],
            ].map(([c, w], i) => (
              <div key={c} className="flex items-center gap-1">
                <span className="w-3.5 font-mono text-[6px] text-second">{c}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface">
                  <motion.div
                    className="h-full rounded-full bg-limebrand"
                    initial={{ scaleX: 0 }}
                    animate={anim ? { scaleX: 1 } : {}}
                    transition={{ delay: 0.15 * i, duration: 0.6, ease: EASE }}
                    style={{ width: `${w}%`, transformOrigin: "left" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Socios: sparkline que se dibuja */}
        <div className="flex flex-col overflow-hidden rounded-lg border border-line p-2">
          <div className="flex shrink-0 items-center justify-between">
            <p className="text-[7px] font-bold text-inkstrong">Socios</p>
            <span className="font-mono text-[6px] font-bold text-win">↗ +12</span>
          </div>
          <svg
            viewBox="0 0 140 30"
            preserveAspectRatio="none"
            className="mt-1 min-h-0 w-full flex-1"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="cmSpark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(187,244,81,0.5)" />
                <stop offset="100%" stopColor="rgba(187,244,81,0.03)" />
              </linearGradient>
            </defs>
            <motion.polygon
              points={`0,30 ${SPARK} 140,30`}
              fill="url(#cmSpark)"
              initial={{ opacity: 0 }}
              animate={anim ? { opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.5 }}
            />
            <motion.polyline
              points={SPARK}
              fill="none"
              stroke="#65A30D"
              strokeWidth="2"
              strokeLinecap="round"
              initial={prefersReduced ? { pathLength: 1 } : { pathLength: 0 }}
              animate={anim ? { pathLength: 1 } : {}}
              transition={{ duration: 1, ease: EASE }}
            />
          </svg>
        </div>

        {/* Reservas de hoy: timeline de bloques */}
        <div className="flex flex-col overflow-hidden rounded-lg border border-line p-2">
          <p className="shrink-0 text-[7px] font-bold text-inkstrong">Reservas de hoy</p>
          <div className="my-auto grid grid-cols-8 gap-0.5" aria-hidden="true">
            {[1, 1, 1, 0, 1, 1, 0, 1].map((on, i) => (
              <motion.span
                key={i}
                className={`h-2.5 rounded-[2px] ${on ? "bg-tealbrand/70" : "bg-surface"}`}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={anim ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.05 * i, duration: 0.25, ease: EASE }}
              />
            ))}
          </div>
          <p className="shrink-0 font-mono text-[6px] text-second">09:00 — 22:00 · 4 libres</p>
        </div>

        {/* Ingresos: barras que crecen */}
        <div className="flex flex-col overflow-hidden rounded-lg border border-line p-2">
          <div className="flex shrink-0 items-center justify-between">
            <p className="text-[7px] font-bold text-inkstrong">Ingresos</p>
            <span className="text-[6px] text-[#2563EB]">Ver Finanzas →</span>
          </div>
          <div className="mt-1 flex min-h-0 flex-1 items-end gap-0.5" aria-hidden="true">
            {[22, 18, 26, 19, 24, 30, 27, 38, 95, 46, 20, 14].map((h, i) => (
              <motion.span
                key={i}
                className="flex-1 rounded-sm bg-limebrand"
                style={{ height: `${h}%`, opacity: h > 50 ? 1 : 0.55, transformOrigin: "bottom" }}
                initial={{ scaleY: 0 }}
                animate={anim ? { scaleY: 1 } : {}}
                transition={{ delay: 0.06 * i, duration: 0.5, ease: EASE }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TvMock() {
  return (
    <div className="floaty mx-auto w-full max-w-sm" aria-hidden="true">
      <div className="flex aspect-video flex-col overflow-hidden rounded-lg border-[3px] border-[#05080a] bg-[#0E1413] shadow-2xl shadow-black/60">
        {/* Header del dashboard real de matchpro.tv */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-2.5 py-1.5">
          <p className="text-[8px] font-extrabold tracking-wide text-white italic">
            DOMO PADEL ARICA
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[7px] text-white/60">24° · Despejado</span>
            <span className="flex items-center gap-1 rounded-full bg-limebrand/15 px-1.5 py-0.5 text-[6px] font-bold text-limebrand">
              <span className="h-1 w-1 rounded-full bg-limebrand" /> EN VIVO
            </span>
          </div>
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-5 gap-1.5 overflow-hidden p-2">
          {/* Ranking del club */}
          <div className="col-span-2 rounded-md bg-white/[0.05] p-1.5">
            <p className="font-mono text-[6px] tracking-wider text-limebrand uppercase">
              Ranking del club
            </p>
            {[
              ["M. González", "▲", true],
              ["L. Soto", "▲", true],
              ["A. Vega", "▼", false],
              ["C. Vallejo", "▲", true],
              ["D. Reyes", "▲", true],
            ].map(([n, a, up], i) => (
              <div key={n} className="mt-0.5 flex items-center justify-between">
                <span className="text-[7px] font-semibold text-white/90">
                  <span className="font-mono text-white/40">{String(i + 1).padStart(2, "0")}</span>{" "}
                  {n}
                </span>
                <span className={`text-[7px] ${up ? "text-win" : "text-loss"}`}>{a}</span>
              </div>
            ))}
          </div>
          {/* Estado de canchas */}
          <div className="col-span-3 grid grid-cols-2 gap-1">
            {[
              ["Cancha 1", "DISPONIBLE", "text-win"],
              ["Cancha 2", "SET 2 · 4-3", "text-limebrand"],
              ["Cancha 3", "L. SOTO +1", "text-white/70"],
              ["Cancha 4", "MANTENCIÓN", "text-[#F59E0B]"],
            ].map(([c, s, color]) => (
              <div key={c} className="rounded-md bg-white/[0.05] p-1.5">
                <p className="text-[7px] font-bold text-white">{c}</p>
                <p className={`font-mono text-[6px] ${color}`}>{s}</p>
              </div>
            ))}
            {/* Marcador en vivo */}
            <div className="col-span-2 rounded-md bg-white/[0.05] p-1.5">
              <p className="font-mono text-[6px] tracking-wider text-limebrand uppercase">
                Marcador en vivo · Cancha 2
              </p>
              <div className="mt-0.5 flex justify-between text-[7px] font-semibold text-white/90">
                <span>González / Soto</span>
                <span className="font-mono text-limebrand">6 4 3</span>
              </div>
              <div className="flex justify-between text-[7px] text-white/60">
                <span>Vega / Reyes</span>
                <span className="font-mono">3 6 2</span>
              </div>
            </div>
          </div>
          {/* Sponsors + QR */}
          <div className="col-span-5 flex items-center justify-between rounded-md bg-white/[0.05] px-2 py-1">
            <span className="font-mono text-[6px] tracking-widest text-white/50 uppercase">
              Sponsors · BABOLAT · HEAD · WILSON
            </span>
            <span className="flex items-center gap-1 text-[6px] text-white/70">
              <span className="inline-block h-3 w-3 rounded-[2px] bg-white p-[2px]">
                <span className="block h-full w-full bg-[conic-gradient(#000_25%,transparent_0_50%,#000_0_75%,transparent_0)]" />
              </span>
              Reserva por QR
            </span>
          </div>
        </div>
        {/* Ticker inferior */}
        <div className="marquee shrink-0 overflow-hidden border-t border-white/10 py-0.5">
          <p className="marquee-track w-max font-mono text-[6px] tracking-widest text-limebrand uppercase">
            TORNEO MEXICANO · INSCRIPCIONES ABIERTAS · 12 DE MAYO · TORNEO MEXICANO ·
            INSCRIPCIONES ABIERTAS · 12 DE MAYO ·
          </p>
        </div>
      </div>
      {/* Pie del televisor */}
      <div className="mx-auto h-2 w-16 rounded-b-md bg-gradient-to-b from-[#05080a] to-transparent" />
    </div>
  );
}

/** Pago dividido: los checks van entrando uno a uno. */
const SPLIT_FRIENDS = ["JR", "DS", "CV", "TR"];

function SplitPayment() {
  const { t } = useLang();
  const c = t.clubes;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const prefersReduced = useReducedMotion();

  return (
    <div ref={ref} className="w-full max-w-xs rounded-2xl border border-line bg-white p-4 shadow-lg shadow-inkstrong/[0.05]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-second">{c.pagoCourt}</p>
        <p className="font-mono text-sm font-bold text-inkstrong">$24.000</p>
      </div>
      <div className="my-3 flex items-center gap-2" aria-hidden="true">
        <span className="h-px flex-1 bg-line" />
        <span className="rounded-full bg-limetint px-2 py-0.5 font-mono text-[10px] font-bold text-limefg">
          ÷ 4
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {SPLIT_FRIENDS.map((f, i) => (
          <div key={f} className="text-center">
            <span className="relative mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-mint to-tealbrand text-[10px] font-bold text-night">
              {f}
              <motion.span
                className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-win text-[8px] text-white ring-2 ring-white"
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{
                  delay: prefersReduced ? 0 : 0.5 + i * 0.35,
                  duration: 0.25,
                  ease: EASE,
                }}
                aria-hidden="true"
              >
                ✓
              </motion.span>
            </span>
            <p className="mt-1.5 font-mono text-[10px] font-semibold text-inkstrong">$6.000</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-center font-mono text-[9px] tracking-wider text-mutedink uppercase">
        {c.pagoEach} · Transbank
      </p>
    </div>
  );
}

export function Clubes() {
  const { t } = useLang();
  const c = t.clubes;
  return (
    <section id="clubes" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} sub={c.sub} />

        {/* El lado jugador: reservas + pago dividido, en una sola franja */}
        <Reveal className="mx-auto mt-10 max-w-4xl rounded-[2rem] border border-line bg-white p-7 sm:p-8">
          <div className="flex flex-col items-center gap-7 sm:flex-row sm:justify-between">
            <div>
              <p className="font-bold text-inkstrong">{c.playerTitle}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {c.playerChips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-limetint px-3.5 py-1 text-sm font-semibold text-limefg"
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-second">{c.playerBody}</p>
            </div>
            <SplitPayment />
          </div>
        </Reveal>

        <Reveal staggered className="mt-10 grid gap-5 lg:grid-cols-2">
          {/* Club Manager — night + aurora lime */}
          <RevealItem className="group grain relative flex flex-col overflow-hidden rounded-[2.5rem] bg-night p-8 sm:p-10">
            <div className="aurora bg-[radial-gradient(closest-side,rgba(187,244,81,0.28),transparent)]" aria-hidden="true" />
            <div className="relative">
              <h3 className="text-3xl font-extrabold tracking-tight text-limebrand italic">
                {c.cmTitle}
              </h3>
              <p className="mt-2 font-semibold text-nightink">{c.cmSub}</p>
              <ul className="mt-5 space-y-2 text-nightsecond">
                {c.cmBullets.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="mt-0.5 text-limebrand" aria-hidden="true">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative my-8">
              <BrowserMock />
            </div>
            <div className="relative mt-auto flex flex-wrap gap-3">
              <a
                href="https://getmatchpro.com/club-management"
                className="rounded-full bg-limebrand px-5 py-2.5 text-sm font-semibold text-limeink transition-transform hover:-translate-y-0.5"
              >
                {c.cmCta}
              </a>
              <a
                href="https://meet.getmatchpro.com/r/tv"
                className="rounded-full border border-nightline px-5 py-2.5 text-sm font-semibold text-nightink transition-colors hover:border-nightsecond"
              >
                {c.cmDemo}
              </a>
            </div>
          </RevealItem>

          {/* MatchPro TV — aurora teal/mint */}
          <RevealItem className="group grain relative flex flex-col overflow-hidden rounded-[2.5rem] bg-[#0B1512] p-8 sm:p-10">
            <div className="aurora bg-[radial-gradient(closest-side,rgba(52,211,153,0.35),transparent)]" aria-hidden="true" />
            <div
              className="aurora bg-[radial-gradient(closest-side,rgba(130,232,150,0.18),transparent)]"
              style={{ animationDelay: "-8s" }}
              aria-hidden="true"
            />
            <div className="relative">
              <h3 className="text-3xl font-extrabold tracking-tight text-mint italic">
                {c.tvTitle}
              </h3>
              <p className="mt-2 font-semibold text-nightink">{c.tvSub}</p>
              <ul className="mt-5 space-y-2 text-nightsecond">
                {c.tvBullets.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="mt-0.5 text-mint" aria-hidden="true">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative my-8">
              <TvMock />
            </div>
            <div className="relative mt-auto">
              <a
                href="https://matchpro.tv"
                className="inline-block rounded-full bg-mint px-5 py-2.5 text-sm font-semibold text-night transition-transform hover:-translate-y-0.5"
              >
                {c.tvCta}
              </a>
            </div>
          </RevealItem>
        </Reveal>

        {/* Trust B2B — vive aquí, no en el hero de jugadores */}
        <Reveal className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm font-medium text-second">
          {c.trust.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ── 9 · Pricing (modelo del onboarding: Free + Competitivo) ── */

function Price({ value, note }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={value}
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -18, opacity: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="inline-block"
      >
        {value} <span className="text-base font-medium opacity-60">{note}</span>
      </motion.span>
    </AnimatePresence>
  );
}

export function Pricing() {
  const { t } = useLang();
  const c = t.pricing;
  const [annual, setAnnual] = useState(false);

  return (
    <section id="precios" className="relative overflow-hidden border-y border-line bg-white py-20 sm:py-28">
      {/* Blobs suaves de fondo */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="blob blob-b -top-24 right-[-6rem] h-96 w-96 bg-mark/40" />
        <div className="blob blob-c bottom-[-8rem] left-[-6rem] h-96 w-96 bg-mint/30" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} sub={c.sub} />

        <Reveal className="mt-8 flex justify-center">
          <div className="inline-flex items-center rounded-full border border-line bg-surface p-1">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                !annual ? "bg-limebrand text-limeink" : "text-second"
              }`}
            >
              {c.monthly}
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                annual ? "bg-limebrand text-limeink" : "text-second"
              }`}
            >
              {c.annual}
            </button>
          </div>
        </Reveal>

        <Reveal staggered className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
          {/* Gratis — tint mint suave */}
          <RevealItem className="grain relative flex flex-col overflow-hidden rounded-[2rem] border border-line bg-gradient-to-br from-surface to-mint/25 p-8 transition-transform duration-200 hover:-translate-y-1">
            <h3 className="text-lg font-extrabold text-inkstrong italic">{c.freeName}</h3>
            <p className="mt-2 text-4xl font-extrabold tracking-tight text-inkstrong">
              $0 <span className="text-base font-medium text-second">{c.forever}</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {c.freeItems.map((f) => (
                <li key={f} className="flex gap-3 text-ink">
                  <span className="mt-0.5 text-win" aria-hidden="true">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a
              href="https://getmatchpro.com/app"
              className="mt-8 rounded-full border border-inkstrong/25 py-3 text-center font-semibold text-inkstrong transition-colors hover:bg-inkstrong hover:text-white"
            >
              {c.freeCta}
            </a>
          </RevealItem>

          {/* Competitivo — night + glow + shine */}
          <RevealItem className="shine grain relative flex flex-col overflow-hidden rounded-[2rem] bg-night p-8 ring-2 ring-limebrand transition-transform duration-200 hover:-translate-y-1">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(24rem 16rem at 80% -10%, rgba(187,244,81,0.18), transparent 60%)",
              }}
              aria-hidden="true"
            />
            <span className="absolute top-5 right-6 rounded-full bg-limebrand px-3 py-1 text-[11px] font-bold tracking-wide text-limeink uppercase">
              {c.badge}
            </span>
            <h3 className="relative text-lg font-extrabold text-limebrand italic">{c.compName}</h3>
            <p className="relative mt-2 text-4xl font-extrabold tracking-tight text-nightink">
              <Price
                value={annual ? "$99.900" : "$9.990"}
                note={annual ? c.perYear : c.perMonth}
              />
            </p>
            <p className="relative mt-1 text-sm text-nightsecond">
              {annual ? c.equivAnnual : c.equivMonthly}
            </p>
            <ul className="relative mt-6 flex-1 space-y-3">
              <li className="flex gap-3 text-nightsecond">
                <span className="mt-0.5 text-win" aria-hidden="true">✓</span>
                <span>{c.everything}</span>
              </li>
              {c.compItems.map((f) => (
                <li key={f} className="flex gap-3 text-nightink">
                  <span className="mt-0.5 text-win" aria-hidden="true">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a
              href="https://getmatchpro.com/app"
              className="relative mt-8 rounded-full bg-limebrand py-3 text-center font-bold text-limeink shadow-lg shadow-limebrand/25 transition-transform hover:-translate-y-0.5"
            >
              {c.compCta}
            </a>
          </RevealItem>
        </Reveal>

        {/* Club-paga: el tercer camino, transparente */}
        <Reveal className="mx-auto mt-8 max-w-4xl rounded-2xl border border-limetint bg-limetint/40 p-5 text-center">
          <p className="text-ink">
            <span className="font-bold text-inkstrong">{c.clubBold}</span> {c.clubRest}
          </p>
        </Reveal>

        <Reveal className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-second">
          {c.notes.map((n, i) => (
            <span key={n} className="flex items-center gap-6">
              {i > 0 && <span aria-hidden="true">·</span>}
              {n}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
