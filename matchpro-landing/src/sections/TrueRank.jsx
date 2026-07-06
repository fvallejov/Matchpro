import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, animate, AnimatePresence } from "framer-motion";
import { EASE } from "../motion";
import { Reveal, RevealItem } from "../ui";
import { useLang } from "../i18n";

/* ─────────────────────────────────────────────────────────────
   6 · TrueRank — el principio, no el producto.
   El momento técnico del sitio: un radar de atributos que se
   dibuja solo, mientras el nivel pasa de "sin validar" a
   "validado" y el número sube. Honestidad: hoy vs roadmap.
   ───────────────────────────────────────────────────────────── */

const AXES = ["Saque", "Resto", "Volea", "Presión", "Consistencia", "Físico"];
const R_OUT = 120;
const CX = 150;
const CY = 150;
// Valores 0-1 por atributo (perfil de ejemplo)
const VALUES = [0.82, 0.68, 0.55, 0.74, 0.88, 0.62];

function polar(i, r) {
  const a = (Math.PI * 2 * i) / AXES.length - Math.PI / 2;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}

const SHAPE = VALUES.map((v, i) => polar(i, v * R_OUT).join(",")).join(" ");

function Radar({ active, labels, ariaLabel }) {
  const prefersReduced = useReducedMotion();
  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[320px]" role="img" aria-label={ariaLabel}>
      {/* Anillos */}
      {[0.33, 0.66, 1].map((f) => (
        <polygon
          key={f}
          points={AXES.map((_, i) => polar(i, f * R_OUT).join(",")).join(" ")}
          fill="none"
          stroke="#2A3543"
          strokeWidth="1"
        />
      ))}
      {/* Ejes */}
      {AXES.map((_, i) => {
        const [x, y] = polar(i, R_OUT);
        return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="#2A3543" strokeWidth="1" />;
      })}
      {/* Barrido del radar: escaneando el juego, siempre */}
      <g className="radar-sweep" style={{ transformOrigin: "150px 150px" }} aria-hidden="true">
        <path
          d={`M ${CX} ${CY} L ${CX} ${CY - R_OUT} A ${R_OUT} ${R_OUT} 0 0 1 ${
            CX + R_OUT * Math.sin(Math.PI / 3)
          } ${CY - R_OUT * Math.cos(Math.PI / 3)} Z`}
          fill="url(#sweepGrad)"
        />
      </g>
      <defs>
        <linearGradient id="sweepGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(187,244,81,0.16)" />
          <stop offset="100%" stopColor="rgba(187,244,81,0)" />
        </linearGradient>
      </defs>
      {/* Forma del jugador: se dibuja al entrar y luego respira */}
      <motion.polygon
        points={SHAPE}
        fill="rgba(187, 244, 81, 0.14)"
        stroke="#BBF451"
        strokeWidth="2.5"
        strokeLinejoin="round"
        style={{ transformOrigin: "150px 150px" }}
        initial={prefersReduced ? { pathLength: 1 } : { pathLength: 0 }}
        animate={
          active
            ? prefersReduced
              ? { pathLength: 1 }
              : { pathLength: 1, scale: [1, 1.03, 1] }
            : {}
        }
        transition={{
          pathLength: { duration: 1.2, ease: EASE },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.4 },
        }}
      />
      {/* Vértices con pulso */}
      {VALUES.map((v, i) => {
        const [x, y] = polar(i, v * R_OUT);
        return (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r="4"
            fill="#BBF451"
            style={{ transformOrigin: `${x}px ${y}px` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={
              active
                ? prefersReduced
                  ? { scale: 1, opacity: 1 }
                  : { scale: [1, 1.5, 1], opacity: 1 }
                : {}
            }
            transition={{
              opacity: { delay: 0.9 + i * 0.06, duration: 0.3 },
              scale: prefersReduced
                ? { delay: 0.9 + i * 0.06, duration: 0.3 }
                : {
                    delay: 1.6 + i * 0.5,
                    duration: 1.2,
                    repeat: Infinity,
                    repeatDelay: AXES.length * 0.5,
                    ease: "easeInOut",
                  },
            }}
          />
        );
      })}
      {/* Etiquetas */}
      {labels.map((label, i) => {
        const [x, y] = polar(i, R_OUT + 20);
        return (
          <text
            key={label}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-nightsecond font-mono text-[10px] uppercase"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

function RankCard() {
  const { t } = useLang();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = useReducedMotion();
  const [rank, setRank] = useState(1310);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (!inView) return;
    if (prefersReduced) {
      setRank(1475);
      setValidated(true);
      return;
    }
    const t = setTimeout(() => {
      setValidated(true);
      const controls = animate(1310, 1475, {
        duration: 1.1,
        ease: "easeOut",
        onUpdate: (v) => setRank(Math.round(v)),
      });
      return () => controls.stop();
    }, 1100);
    return () => clearTimeout(t);
  }, [inView, prefersReduced]);

  return (
    <div ref={ref} className="rounded-3xl bg-nightcard p-6 ring-1 ring-nightline">
      <div className="flex items-center justify-between">
        <p className="eyebrow text-nightsecond">TrueRank</p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={validated ? "ok" : "prov"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE }}
            className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase ${
              validated
                ? "bg-limebrand text-limeink"
                : "border border-nightline text-nightsecond"
            }`}
          >
            {validated ? t.truerank.validated : t.truerank.provisional}
          </motion.span>
        </AnimatePresence>
      </div>
      <p className="mt-3 font-mono text-5xl font-bold tabular-nums text-nightink">
        {rank.toLocaleString("es-CL")}
      </p>
      <p className="mt-2 text-sm text-nightsecond">{t.truerank.rankBody}</p>
    </div>
  );
}

export default function TrueRank() {
  const { t } = useLang();
  const c = t.truerank;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <section
      id="truerank"
      className="night-app relative overflow-hidden py-20 sm:py-28"
    >
      <div className="relative mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow text-limebrand">{c.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-nightink text-balance sm:text-5xl">
              {c.t1}
              <br />
              <span className="text-limebrand italic">{c.t2}</span>
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-nightsecond">{c.sub}</p>
            <div className="mt-8">
              <RankCard />
            </div>
          </Reveal>

          <Reveal className="flex justify-center">
            <div ref={ref} className="rounded-[2.5rem] bg-nightcard/60 p-8 ring-1 ring-nightline sm:p-10">
              <Radar active={inView} labels={c.axes} ariaLabel={c.radarAria} />
              <p className="mt-4 text-center font-mono text-[10px] tracking-wider text-nightsecond uppercase">
                {c.radarCaption}
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal staggered className="mx-auto mt-16 grid max-w-4xl gap-5 md:grid-cols-2">
          <RevealItem className="rounded-3xl bg-nightcard p-7 ring-1 ring-limebrand/40">
            <span className="rounded-full bg-limebrand px-3 py-1 text-[11px] font-bold tracking-wide text-limeink uppercase">
              {c.hoyTag}
            </span>
            <ul className="mt-5 space-y-3">
              {c.hoy.map((item) => (
                <li key={item} className="flex gap-3 text-nightink">
                  <span className="mt-1 text-win" aria-hidden="true">✓</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </RevealItem>

          <RevealItem className="rounded-3xl border border-dashed border-nightline p-7">
            <span className="rounded-full border border-nightline px-3 py-1 text-[11px] font-bold tracking-wide text-nightsecond uppercase">
              {c.prontoTag}
            </span>
            <ul className="mt-5 space-y-3">
              {c.pronto.map((item) => (
                <li key={item} className="flex gap-3 text-nightsecond">
                  <span className="mt-1" aria-hidden="true">→</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-nightsecond/70">{c.honesty}</p>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
