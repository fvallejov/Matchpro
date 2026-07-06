import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { EASE } from "../motion";
import { Reveal, PhoneFrame } from "../ui";
import { useLang } from "../i18n";

/* ─────────────────────────────────────────────────────────────
   5b · Progreso — la promesa de retención.
   "El partido completo" es el micro (un partido); esto es el
   macro (tu tendencia). Un partido deja datos → los datos se
   vuelven patrones → los patrones te dicen cómo mejorar.
   Visual: screenshot real de Progreso + gráfico de evolución
   que se dibuja hacia arriba al entrar en viewport.
   ───────────────────────────────────────────────────────────── */

// Curva de win rate: 8 semanas, tendencia al alza (como la pantalla real)
const PTS = [
  [0, 74],
  [20, 70],
  [40, 72],
  [60, 62],
  [80, 65],
  [100, 52],
  [120, 44],
  [140, 30],
];
const LINE = PTS.map(([x, y]) => `${x},${y}`).join(" ");
const AREA = `0,90 ${LINE.replaceAll(" ", " ")} 140,90`;

function EvolutionCard() {
  const { t } = useLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const prefersReduced = useReducedMotion();

  return (
    <div
      ref={ref}
      className="floaty floaty-delay w-56 rounded-2xl border border-white/60 bg-white/95 p-4 shadow-xl shadow-inkstrong/15 backdrop-blur"
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-[9px] font-semibold tracking-[0.16em] text-second uppercase">
          {t.progreso.evoLabel}
        </p>
        <span className="rounded-full bg-win/15 px-1.5 py-0.5 font-mono text-[9px] font-bold text-win">
          ↗ +13
        </span>
      </div>
      <p className="mt-1 text-3xl font-extrabold tracking-tight text-inkstrong italic">63%</p>
      <svg viewBox="0 0 140 90" className="mt-1 w-full" aria-hidden="true">
        <defs>
          <linearGradient id="evoFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(16,185,129,0.30)" />
            <stop offset="100%" stopColor="rgba(187,244,81,0.02)" />
          </linearGradient>
        </defs>
        <motion.polygon
          points={AREA}
          fill="url(#evoFill)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 0.6 }}
        />
        <motion.polyline
          points={LINE}
          fill="none"
          stroke="#10B981"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={prefersReduced ? { pathLength: 1 } : { pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.3, ease: EASE }}
        />
        {PTS.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r="3"
            fill="#fff"
            stroke="#10B981"
            strokeWidth="2"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: prefersReduced ? 0 : 0.15 * i, duration: 0.2 }}
          />
        ))}
      </svg>
      <p className="mt-1 text-[10px] leading-snug text-second">{t.progreso.evoCaption}</p>
    </div>
  );
}

export default function Progreso() {
  const { t } = useLang();
  const c = t.progreso;
  return (
    <section className="relative overflow-hidden border-y border-line bg-white py-20 sm:py-28">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="blob blob-b -top-24 left-[-8rem] h-96 w-96 bg-mint/30" />
        <div className="blob blob-c right-[-8rem] bottom-[-8rem] h-96 w-96 bg-mark/30" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow text-limefg">{c.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-inkstrong text-balance sm:text-4xl">
            {c.t1}{" "}
            <span className="relative inline-block">
              <span className="relative z-10 italic">{c.hi}</span>
              <span
                className="absolute inset-x-0 bottom-1 z-0 h-3.5 -rotate-1 rounded-sm bg-limebrand"
                aria-hidden="true"
              />
            </span>
            .
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-ink">{c.sub}</p>
          <ul className="mt-7 space-y-4">
            {c.bullets.map((b) => (
              <li key={b.title} className="flex gap-3.5">
                <span
                  className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-limetint text-[11px] font-bold text-limefg"
                  aria-hidden="true"
                >
                  ↗
                </span>
                <div>
                  <p className="font-bold text-inkstrong">{b.title}</p>
                  <p className="mt-0.5 leading-relaxed text-second">{b.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Screenshot real de Progreso + gráfico dibujándose */}
        <Reveal className="relative mx-auto w-full max-w-sm">
          <PhoneFrame src="/app/progreso.webp" alt={c.alt} className="mx-auto w-60 sm:w-64" />
          <div className="absolute -right-2 bottom-10 sm:right-0">
            <EvolutionCard />
          </div>
          <div className="floaty absolute top-8 -left-2 flex items-center gap-2 rounded-2xl border border-white/60 bg-white/90 px-3.5 py-2.5 text-sm font-semibold text-inkstrong shadow-xl shadow-inkstrong/10 backdrop-blur sm:left-0">
            <span className="rounded-full bg-win/15 px-2 py-0.5 font-mono text-[10px] font-bold text-win">
              {c.badgeUp}
            </span>
            {c.badgeRest}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
