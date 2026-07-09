// ─────────────────────────────────────────────────────────────
// Láminas "bajo demanda" — apagadas en las sugerencias, viven
// en el índice (G) para cuando la conversación las pida:
//  · TrueRank: la respuesta a "¿cómo saben el nivel real?" y
//    "los rankings siempre terminan en peleas".
//  · Explora: links del ecosistema para el leave-behind.
// ─────────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import { EASE } from "../motion";
import { Reveal, RevealItem } from "../ui";
import { useClub } from "../club";

/* ── TrueRank: cómo funciona ────────────────────────────────── */

const PASOS_TR = [
  [
    "01",
    "Nadie declara su nivel",
    "Al entrar, el jugador recibe un nivel PROVISIONAL a partir de un cuestionario simple. Es un punto de partida, no una verdad.",
  ],
  [
    "02",
    "Cada partido es evidencia",
    "Los resultados confirmados por ambos jugadores alimentan el cálculo: contra quién jugó, cuán parejo fue y cuándo.",
  ],
  [
    "03",
    "El nivel se valida jugando",
    "Con partidos suficientes, el nivel pasa de provisional a VALIDADO. Sube o baja solo — nadie lo administra ni lo discute.",
  ],
];

/* Mini demo: nivel provisional → validado */
function TrueRankDemo() {
  return (
    <div className="rounded-3xl bg-nightcard p-6 ring-1 ring-nightline">
      <p className="font-mono text-[10px] tracking-[0.18em] text-tealbrand uppercase">TrueRank · C. Riffo</p>
      <div className="mt-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between font-mono text-[10px] text-nightsecond">
            <span>Provisional</span>
            <span className="text-limebrand">Validado ✓</span>
          </div>
          <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
            <motion.div
              initial={{ width: "18%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.2, ease: EASE, delay: 0.5 }}
              className="h-full rounded-full bg-gradient-to-r from-tealbrand to-limebrand"
            />
          </div>
          <p className="mt-1.5 font-mono text-[9px] text-nightsecond">14 partidos confirmados</p>
        </div>
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4 }}
            className="text-4xl font-extrabold text-limebrand drop-shadow-[0_0_18px_rgba(187,244,81,0.4)]"
          >
            4.2
          </motion.p>
          <p className="font-mono text-[8px] text-nightsecond uppercase">nivel</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-center">
        {[
          ["96%", "compatibilidad del próximo desafío"],
          ["±0.3", "rango de rivales sugeridos"],
          ["0", "discusiones de ranking"],
        ].map(([v, l]) => (
          <div key={l}>
            <p className="text-xl font-bold text-white">{v}</p>
            <p className="mt-0.5 font-mono text-[8px] leading-tight text-nightsecond">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SlideTrueRank() {
  const club = useClub();
  return (
    <section className="night-cm flex h-full items-center">
      <div className="mx-auto w-full max-w-6xl px-10">
        <Reveal>
          <p className="eyebrow text-tealbrand">TrueRank · el motor del ranking</p>
          <h2 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-balance text-white">
            El nivel no se declara. <em className="text-limebrand">Se juega.</em>
          </h2>
          <p className="mt-3 max-w-2xl text-[14px] text-nightsecond">
            La razón por la que las escalerillas de {club.corto} no van a terminar en peleas: el ranking
            no lo administra una persona — lo calcula la evidencia.
          </p>
        </Reveal>

        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1fr_1fr]">
          <Reveal staggered className="flex flex-col gap-3">
            {PASOS_TR.map(([n, t, d]) => (
              <RevealItem key={n} className="flex gap-4 rounded-2xl bg-nightcard p-4 ring-1 ring-nightline">
                <span className="font-mono text-xl font-bold text-limebrand">{n}</span>
                <div>
                  <h3 className="text-[15px] font-bold text-white">{t}</h3>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-nightsecond">{d}</p>
                </div>
              </RevealItem>
            ))}
          </Reveal>
          <Reveal>
            <TrueRankDemo />
            <p className="mt-4 font-mono text-[10px] leading-relaxed text-nightsecond">
              Emparejamientos parejos = partidos que se aceptan y se juegan. En desarrollo: validación
              de nivel por video — dirección, no promesa con fecha.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Explora el ecosistema — página marketera para el
      leave-behind: cada producto con su claim real y su glow ── */

const SITIOS = [
  {
    nombre: "MatchPro",
    claim: ["Convierte cada partido en ", "competencia real."],
    d: "Matchmaking por nivel, escalerillas y tu perfil competitivo. La app que trae jugadores.",
    url: "https://getmatchpro.com",
    corta: "getmatchpro.com",
    glow: "rgba(187,244,81,0.14)",
    tag: "App del jugador",
  },
  {
    nombre: "Club Manager",
    claim: ["El siguiente nivel de tu club no es deportivo. ", "Es operativo."],
    d: "Reservas, cobros, socios, torneos y finanzas — el centro de control del club.",
    url: "https://getmatchpro.com/club-management",
    corta: "getmatchpro.com/club-management",
    glow: "rgba(52,211,153,0.16)",
    tag: "Gestión del club",
  },
  {
    nombre: "MatchPro TV",
    claim: ["Tu club en vivo, ", "todo el día."],
    d: "Cualquier televisor convertido en pantalla viva: canchas, rankings y marcadores.",
    url: "https://matchpro.tv",
    corta: "matchpro.tv",
    glow: "rgba(130,232,150,0.15)",
    tag: "Pantallas del club",
  },
  {
    nombre: "ScoreMatch",
    claim: ["Marca el punto. ", "Siente el partido."],
    d: "El marcador de tenis para Apple Watch: cada punto medido, cada partido en tu historial.",
    url: "https://scorematch.app",
    corta: "scorematch.app",
    glow: "rgba(203,253,128,0.13)",
    tag: "Apple Watch",
  },
];

export function SlideExplora() {
  return (
    <section className="hero-night-cm relative flex h-full items-center overflow-hidden">
      <div className="aurora-blob aurora-a top-[-12%] right-[-6%] h-96 w-96 bg-tealbrand/15" aria-hidden="true" />
      <div className="aurora-blob aurora-b bottom-[-20%] left-[-8%] h-80 w-80 bg-limebrand/10" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-6xl px-10">
        <Reveal>
          <p className="eyebrow text-tealbrand">Explora el ecosistema</p>
          <h2 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-balance text-white">
            Un solo ecosistema. <em className="text-limebrand">Todo juega junto.</em>
          </h2>
        </Reveal>

        <Reveal staggered className="mt-8 grid gap-4 sm:grid-cols-2">
          {SITIOS.map(({ nombre, claim, d, url, corta, glow, tag }) => (
            <RevealItem key={nombre}>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-nightcard p-6 ring-1 ring-nightline transition-all hover:-translate-y-1 hover:ring-limebrand/50"
              >
                <div
                  className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full blur-3xl transition-opacity group-hover:opacity-150"
                  style={{ background: glow }}
                  aria-hidden="true"
                />
                <div className="relative flex items-center justify-between">
                  <p className="font-mono text-[10px] font-semibold tracking-[0.18em] text-tealbrand uppercase">
                    {nombre}
                  </p>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[8.5px] text-nightsecond ring-1 ring-white/10">
                    {tag}
                  </span>
                </div>
                <h3 className="relative mt-3 text-[22px] leading-snug font-extrabold tracking-tight text-white">
                  {claim[0]}
                  <em className="text-limebrand">{claim[1]}</em>
                </h3>
                <p className="relative mt-2 flex-1 text-[12.5px] leading-relaxed text-nightsecond">{d}</p>
                <div className="relative mt-4 flex items-center justify-between gap-3">
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-limebrand px-4 py-1.5 text-[12px] font-bold text-limeink transition-transform group-hover:translate-x-1">
                    Visitar sitio →
                  </span>
                  <span className="truncate font-mono text-[9.5px] text-nightsecond/80">{corta}</span>
                </div>
              </a>
            </RevealItem>
          ))}
        </Reveal>

        <Reveal>
          <p className="mt-4 text-center">
            <a
              href="https://youtu.be/PYDsLlWsREs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-[12px] font-bold text-white ring-1 ring-white/15 transition-colors hover:ring-limebrand/50"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-limebrand text-[8px] text-limeink">▶</span>
              Mira Club Manager por dentro · video de 2 minutos
            </a>
          </p>
          <p className="mt-3 text-center text-[12px] text-nightsecond">
            También en el ecosistema: <span className="font-bold text-white">TrueRank</span> — el motor del
            ranking (lámina TrueRank de esta presentación) · <span className="font-bold text-white">CoachingPro</span> —
            entrenadores del club, <span className="text-tealbrand">en desarrollo</span>
          </p>
          <p className="mt-2 text-center font-mono text-[10px] text-nightsecond/70">
            Links clicables en la versión enviada y en el PDF — compártelos con tu directorio.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
