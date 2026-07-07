// ─────────────────────────────────────────────────────────────
// Implementación acompañada + soporte (timeline visual), y
// Roadmap honesto (solo lo que realmente viene).
// ─────────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import { EASE } from "../motion";
import { Reveal, RevealItem } from "../ui";
import { useClub } from "../club";

/* ── Implementación y soporte — timeline horizontal ─────────── */

const PASOS = [
  {
    n: "1",
    t: "Conversamos",
    dur: "30 min",
    d: "Demo por videollamada o en tu club. Vemos tu operación actual y qué resolver primero.",
  },
  {
    n: "2",
    t: "Activamos",
    dur: "El mismo día",
    d: "Sesión guiada: canchas, tarifas, socios y medios de pago. Migramos tus planillas — tu club queda operativo.",
  },
  {
    n: "3",
    t: "Te desligas",
    dur: "Desde la semana 1",
    d: "Reservas, cobros y competencia corren solos. Tú miras los números, no las planillas.",
  },
];

const SOPORTE = [
  ["Soporte humano", "WhatsApp directo con gente que sabe de clubes — no un chatbot"],
  ["Sin dependencia de personas", "la operación queda en el sistema, no en la cabeza de alguien"],
  ["100% web", "sin instalaciones, sin servidores, sin conocimientos técnicos"],
  ["Sin permanencia", "si no te sirve, te vas sin trámites — la confianza se gana operando"],
];

export function SlideImplementacion() {
  const club = useClub();
  return (
    <section className="tint-teal flex h-full items-center">
      <div className="mx-auto w-full max-w-6xl px-10">
        <Reveal>
          <p className="eyebrow text-limefg">Implementación y soporte</p>
          <h2 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-balance text-inkstrong">
            {club.corto} se desliga de la administración. <span className="text-limefg">Con confianza.</span>
          </h2>
        </Reveal>

        {/* Timeline: línea que se dibuja + 3 estaciones */}
        <Reveal className="relative mt-12">
          <div className="absolute top-7 right-[8%] left-[8%] h-1 rounded-full bg-line" aria-hidden="true">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
              className="h-full rounded-full bg-gradient-to-r from-tealbrand to-limebrand"
            />
          </div>
          <div className="relative grid grid-cols-3 gap-6">
            {PASOS.map(({ n, t, dur, d }, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.35, duration: 0.4, ease: EASE }}
                className="flex flex-col items-center text-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-inkstrong text-xl font-extrabold text-limebrand ring-4 ring-surface">
                  {n}
                </span>
                <p className="mt-3 text-lg font-bold text-inkstrong">{t}</p>
                <p className="font-mono text-[11px] font-semibold text-limefg">{dur}</p>
                <p className="mt-2 max-w-64 text-[13px] leading-relaxed text-second">{d}</p>
              </motion.div>
            ))}
          </div>
        </Reveal>

        {/* Soporte: franja compacta */}
        <Reveal staggered className="mt-10 grid gap-3 sm:grid-cols-4">
          {SOPORTE.map(([t, d]) => (
            <RevealItem key={t} className="rounded-2xl bg-white/80 p-4 ring-1 ring-line">
              <p className="text-[13.5px] font-bold text-inkstrong">✓ {t}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-second">{d}</p>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ── Roadmap — dirección, sin vender vaporware ──────────────── */

const PROYECTOS = [
  [
    "App MatchPro",
    "Lanzamiento próximo",
    "La app del jugador en iOS + Apple Watch: matchmaking, escalerillas y el módulo de tu club.",
  ],
  [
    "CoachPro",
    "En desarrollo",
    "Entrenadores del club: alumnos, clases, pagos y progreso deportivo.",
  ],
  [
    "TrueRank · validación por video",
    "En desarrollo",
    "El nivel del jugador validado con evidencia, no con autoevaluación.",
  ],
  [
    "Plataforma en evolución continua",
    "Siempre",
    "Actualizaciones constantes para todos los clubes, sin costo adicional — la analítica y los módulos crecen contigo.",
  ],
];

export function SlideRoadmap() {
  return (
    <section className="night-cm flex h-full items-center">
      <div className="mx-auto w-full max-w-6xl px-10">
        <Reveal>
          <p className="eyebrow text-tealbrand">Hacia dónde va MatchPro</p>
          <h2 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-balance text-white">
            Tu club entra hoy. <em className="text-limebrand">La plataforma sigue creciendo.</em>
          </h2>
          <p className="mt-3 max-w-2xl text-[14px] text-nightsecond">
            Dirección, no promesa con fecha. Lo que contratas hoy es lo que ya viste funcionando.
          </p>
        </Reveal>

        <Reveal staggered className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PROYECTOS.map(([t, tag, d]) => (
            <RevealItem key={t} className="flex flex-col rounded-2xl bg-nightcard p-5 ring-1 ring-nightline">
              <span
                className={`w-fit rounded-full px-2 py-0.5 font-mono text-[9px] font-bold tracking-wide uppercase ${
                  tag === "Lanzamiento próximo"
                    ? "bg-limebrand/15 text-limebrand"
                    : "bg-white/10 text-tealbrand"
                }`}
              >
                {tag}
              </span>
              <h3 className="mt-3 text-[15px] leading-snug font-bold text-white">{t}</h3>
              <p className="mt-2 text-[12px] leading-relaxed text-nightsecond">{d}</p>
            </RevealItem>
          ))}
        </Reveal>

        <Reveal>
          <p className="mt-8 text-center font-mono text-[12px] text-nightsecond">
            Los clubes que entran ahora <span className="font-bold text-white">crecen con cada actualización</span> —
            sin pagar más por ello.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
