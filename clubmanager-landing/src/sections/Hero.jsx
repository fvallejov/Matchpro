import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { EASE, ladderSpring } from "../motion";
import { Reveal, RevealItem, CtaPair, PanelChrome, Sparkline } from "../ui";
import { useLang } from "../i18n";

/* ─────────────────────────────────────────────────────────────
   Hero NIGHT — el centro de control del club.
   El panel ROTA entre tres vistas reales (Dashboard → Calendario
   → Cuadro del torneo). Aspecto fijo 16:10. Parallax al mouse.
   El producto tiene modo inglés → los mocks se traducen (MK).
   Datos y nombres ficticios: Club Los Aromos.
   ───────────────────────────────────────────────────────────── */

const MK = {
  es: {
    club8: "8 canchas · Tenis y pádel",
    dash: {
      titulo: "Panel de Club Los Aromos",
      sub: "Administra tu club, socios y escalerillas desde aquí.",
      enVivo: "En vivo",
      socios: "Socios Activos",
      sociosNota: "+3 vs mes pasado",
      partidos: "Partidos Este Mes",
      partidosNota: "+6 vs mes pasado",
      desafios: "Desafíos Activos",
      desafiosNota: "97% aceptados",
      ingresos: "Ingresos del Mes",
      alDia: "Al día",
      factura: "Última factura",
      pagada: "Pagada",
      crecimiento: "Crecimiento de Socios",
      actividad: "Actividad Reciente",
      update: "actualizado hace 3 s",
      vencio: "venció a",
      ahora: "ahora",
      hace: ["hace 14 min", "hace 42 min"],
    },
    cal: {
      titulo: "Calendario de Reservas",
      sub: "Cancha 2 · Tenis · Ocupación semanal 74%",
      nueva: "+ Nueva Reserva",
      dias: ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"],
      libre: "—",
      reservada: "Reservada",
      torneo: "Torneo",
      ley1: "Reservada · pagada",
      ley2: "Bloqueo torneo",
      tarifa: "Tarifa alta 18–22 h",
    },
    cuadro: {
      titulo: "Copa Los Aromos · Cuadro",
      sub: "Eliminación simple · fixture automático",
      ronda: "● Ronda 2 en juego",
      semis: "Semifinales",
      final: "Final · en juego",
      control: "Control en Vivo → TV del club",
      pie1: "Se redibuja solo con cada resultado ·",
      pie2: "2 canchas",
      pie3: "asignadas",
      crear: "+ Crear Torneo",
    },
  },
  en: {
    club8: "8 courts · Tennis & padel",
    dash: {
      titulo: "Club Los Aromos Panel",
      sub: "Manage your club, members and ladders from here.",
      enVivo: "Live",
      socios: "Active Members",
      sociosNota: "+3 vs last month",
      partidos: "Matches This Month",
      partidosNota: "+6 vs last month",
      desafios: "Active Challenges",
      desafiosNota: "97% accepted",
      ingresos: "Monthly Revenue",
      alDia: "Up to date",
      factura: "Last invoice",
      pagada: "Paid",
      crecimiento: "Member Growth",
      actividad: "Recent Activity",
      update: "updated 3 s ago",
      vencio: "beat",
      ahora: "now",
      hace: ["14 min ago", "42 min ago"],
    },
    cal: {
      titulo: "Booking Calendar",
      sub: "Court 2 · Tennis · Weekly occupancy 74%",
      nueva: "+ New Booking",
      dias: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
      libre: "—",
      reservada: "Booked",
      torneo: "Tourney",
      ley1: "Booked · paid",
      ley2: "Tournament block",
      tarifa: "Peak rate 6–10 PM",
    },
    cuadro: {
      titulo: "Copa Los Aromos · Bracket",
      sub: "Single elimination · automatic fixture",
      ronda: "● Round 2 in play",
      semis: "Semifinals",
      final: "Final · in play",
      control: "Live Control → club TV",
      pie1: "Redraws itself with every result ·",
      pie2: "2 courts",
      pie3: "assigned",
      crear: "+ Create Tournament",
    },
  },
};

const ACTIVIDAD_POOL = [
  { a: "V. Contreras", b: "M. Salgado" },
  { a: "C. Riffo", b: "A. Baeza" },
  { a: "P. Fuentealba", b: "D. Aravena" },
  { a: "J. Maldonado", b: "R. Cisternas" },
];

/* ── Vista 1 · Dashboard ────────────────────────────────────── */

function Kpi({ label, value, note, noteClass = "text-pmgreen" }) {
  return (
    <div className="rounded-xl border border-line bg-white px-3 py-2 shadow-sm shadow-black/[0.03]">
      <p className="text-[9px] font-medium text-second">{label}</p>
      <p className="mt-0.5 text-lg leading-tight font-bold text-inkstrong">{value}</p>
      {note && <p className={`text-[9px] font-semibold ${noteClass}`}>{note}</p>}
    </div>
  );
}

function VistaDashboard({ beat, m }) {
  const actividad = [0, 1, 2].map((i) => ACTIVIDAD_POOL[(beat + i) % ACTIVIDAD_POOL.length]);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <div>
          <p className="text-[12px] font-bold text-inkstrong">{m.dash.titulo}</p>
          <p className="text-[9px] text-second">{m.dash.sub}</p>
        </div>
        <span className="flex items-center gap-1 text-[9px] font-semibold text-pmgreen">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute h-full w-full animate-ping rounded-full bg-pmgreen opacity-60" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-pmgreen" />
          </span>
          {m.dash.enVivo}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Kpi label={m.dash.socios} value="128" note={m.dash.sociosNota} />
        <Kpi label={m.dash.partidos} value={42 + beat} note={m.dash.partidosNota} />
        <Kpi label={m.dash.desafios} value="6" note={m.dash.desafiosNota} noteClass="text-pmpurple" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-line bg-white p-3 shadow-sm shadow-black/[0.03]">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-medium text-second">{m.dash.ingresos}</p>
            <span className="rounded-full bg-pmgreen/10 px-1.5 py-0.5 text-[8px] font-bold text-pmgreen">
              {m.dash.alDia}
            </span>
          </div>
          <p className="mt-1 text-xl font-bold text-pmgreen">
            ${(2104000 + beat * 22000).toLocaleString("es-CL")}
          </p>
          <p className="mt-0.5 text-[9px] font-semibold text-second">
            {m.dash.factura} <span className="font-bold text-pmgreen">{m.dash.pagada}</span>
          </p>
        </div>
        <div className="rounded-xl border border-line bg-white p-3 shadow-sm shadow-black/[0.03]">
          <p className="text-[9px] font-medium text-second">{m.dash.crecimiento}</p>
          <p className="mt-1 text-xl font-bold text-inkstrong">128</p>
          <Sparkline
            points="0,26 14,25 28,23 42,24 56,20 70,18 84,17 98,13 112,12 126,8 140,4"
            className="mt-1 h-6 w-full"
            stroke="var(--color-pmlime)"
          />
        </div>
      </div>

      <div className="rounded-xl border border-line bg-white p-3 shadow-sm shadow-black/[0.03]">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-medium text-second">{m.dash.actividad}</p>
          <p className="text-[8px] text-mutedink">{m.dash.update}</p>
        </div>
        <ul className="mt-1.5 flex flex-col gap-1">
          <AnimatePresence mode="popLayout" initial={false}>
            {actividad.slice(0, 2).map(({ a, b }, i) => (
              <motion.li
                key={a + b + beat}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={ladderSpring}
                className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[10px] ${
                  i === 0 ? "bg-pmgreen/10" : "bg-surface"
                }`}
              >
                <span className="text-ink">
                  <span className="mr-1 text-pmgreen">🏆</span>
                  <span className="font-bold text-inkstrong">{a}</span> {m.dash.vencio}{" "}
                  <span className="font-semibold">{b}</span>
                </span>
                <span className="text-[8px] font-medium text-mutedink">
                  {i === 0 ? m.dash.ahora : m.dash.hace[i - 1]}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}

/* ── Vista 2 · Calendario de reservas (semana) ──────────────── */

const HORAS = ["09:00", "11:00", "18:00", "20:00"];
/* 0 libre · 1 reservada · 2 torneo */
const GRILLA = [
  [1, 0, 1, 1, 0, 2, 2],
  [0, 1, 1, 0, 1, 2, 1],
  [1, 1, 0, 1, 1, 1, 0],
  [1, 0, 1, 1, 1, 0, 1],
];
const CELDA = {
  0: "bg-surface text-mutedink",
  1: "bg-pmlime/25 text-limeink font-bold",
  2: "bg-pmblue/15 text-pmblue font-bold",
};

function VistaCalendario({ m }) {
  const label = { 0: m.cal.libre, 1: m.cal.reservada, 2: m.cal.torneo };
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <div>
          <p className="text-[12px] font-bold text-inkstrong">{m.cal.titulo}</p>
          <p className="text-[9px] text-second">{m.cal.sub}</p>
        </div>
        <span className="rounded-lg bg-pmlime px-2.5 py-1 text-[9px] font-bold text-white shadow-sm">
          {m.cal.nueva}
        </span>
      </div>
      <div className="flex-1 rounded-xl border border-line bg-white p-2.5">
        <div className="grid grid-cols-[2.4rem_repeat(7,1fr)] gap-1">
          <span />
          {m.cal.dias.map((d) => (
            <span key={d} className="text-center font-mono text-[7px] font-bold text-second">
              {d}
            </span>
          ))}
          {HORAS.map((h, fila) => (
            <div key={h} className="contents">
              <span className="self-center font-mono text-[7px] text-second">{h}</span>
              {GRILLA[fila].map((v, col) => (
                <motion.span
                  key={col}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, ease: EASE, delay: 0.15 + (fila * 7 + col) * 0.015 }}
                  className={`rounded px-1 py-1.5 text-center text-[6.5px] leading-none ${CELDA[v]}`}
                >
                  {label[v]}
                </motion.span>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-3 border-t border-line pt-1.5 text-[7.5px] text-second">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-pmlime/40" /> {m.cal.ley1}
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-pmblue/25" /> {m.cal.ley2}
          </span>
          <span className="ml-auto font-semibold text-pmgreen">{m.cal.tarifa}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Vista 3 · Torneos: el cuadro (bracket) ─────────────────── */

function LlaveBox({ a, b, sa, sb, ganaA }) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-line bg-white text-[7.5px]">
      <p
        className={`flex justify-between px-1.5 py-1 ${
          ganaA ? "bg-pmlime/15 font-bold text-inkstrong" : "text-second"
        }`}
      >
        {a} <span className="font-mono">{sa}</span>
      </p>
      <p
        className={`flex justify-between border-t border-line/60 px-1.5 py-1 ${
          ganaA ? "text-second" : "bg-pmlime/15 font-bold text-inkstrong"
        }`}
      >
        {b} <span className="font-mono">{sb}</span>
      </p>
    </div>
  );
}

function VistaTorneos({ m }) {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <div>
          <p className="text-[12px] font-bold text-inkstrong">{m.cuadro.titulo}</p>
          <p className="text-[9px] text-second">{m.cuadro.sub}</p>
        </div>
        <span className="rounded-full bg-pmgreen/10 px-2 py-1 text-[8px] font-bold text-pmgreen">
          {m.cuadro.ronda}
        </span>
      </div>
      <div className="flex flex-1 items-center gap-2 rounded-xl border border-line bg-white p-2.5">
        <div className="flex flex-1 flex-col justify-around gap-2">
          <p className="font-mono text-[6.5px] font-bold text-second uppercase">{m.cuadro.semis}</p>
          <LlaveBox a="Contreras/Riffo" b="Salgado/Baeza" sa="6-3" sb="3-6" ganaA />
          <LlaveBox a="Aravena/Venegas" b="Sandoval/Mora" sa="7-5" sb="5-7" ganaA />
        </div>
        <div className="flex h-3/5 w-3 flex-col justify-around" aria-hidden="true">
          <span className="h-1/2 w-full rounded-tr border-t border-r border-line" />
          <span className="h-1/2 w-full rounded-br border-r border-b border-line" />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          <p className="font-mono text-[6.5px] font-bold text-pmgreen uppercase">{m.cuadro.final}</p>
          <LlaveBox a="Contreras/Riffo" b="Aravena/Venegas" sa="4-2" sb="2-4" ganaA />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="text-[7.5px] font-bold text-pmgreen"
          >
            {m.cuadro.control}
          </motion.p>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-xl border border-line bg-white px-3 py-1.5 text-[8px]">
        <span className="text-second">
          {m.cuadro.pie1} <span className="font-bold text-inkstrong">{m.cuadro.pie2}</span> {m.cuadro.pie3}
        </span>
        <span className="rounded-lg bg-pmlime px-2 py-0.5 text-[8px] font-bold text-white">{m.cuadro.crear}</span>
      </div>
    </div>
  );
}

/* ── Rotación de vistas + parallax ──────────────────────────── */

const VISTA_NAVS = ["Dashboard", "Canchas", "Torneos"];

function DashboardVivo() {
  const { t, lang } = useLang();
  const m = MK[lang];
  const prefersReduced = useReducedMotion();
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => setBeat((b) => b + 1), 7000);
    return () => clearInterval(id);
  }, [prefersReduced]);

  const vista = beat % 3;

  /* Parallax sutil al mouse — solo transform, max 3° */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [2.5, -2.5]), { stiffness: 120, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-3, 3]), { stiffness: 120, damping: 20 });
  const ref = useRef(null);

  const onMouseMove = (e) => {
    if (prefersReduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} style={{ perspective: 1200 }}>
      <motion.div style={prefersReduced ? undefined : { rotateX: rx, rotateY: ry }}>
        <PanelChrome active={VISTA_NAVS[vista]} className="mx-auto w-full max-w-xl">
          {/* Aspecto FIJO: el panel no cambia de alto al rotar vistas
              ni al variar el ancho del browser */}
          <div className="relative aspect-[4/5] overflow-hidden bg-surface/70 sm:aspect-[16/10]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={vista}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="absolute inset-0 p-2.5"
              >
                {vista === 0 && <VistaDashboard beat={beat} m={m} />}
                {vista === 1 && <VistaCalendario m={m} />}
                {vista === 2 && <VistaTorneos m={m} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </PanelChrome>
      </motion.div>

      {/* Indicador de vistas + estado */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <div className="flex gap-1.5" role="tablist" aria-label={t.hero.vistasAria}>
          {t.hero.vistas.map((v, i) => (
            <span
              key={v}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === vista ? "w-6 bg-limebrand" : "w-1.5 bg-white/25"
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
        <p className="text-xs font-semibold text-nightsecond">
          {t.hero.vistas[vista]} · <span className="text-tealbrand">{t.hero.unPanel}</span>
        </p>
      </div>
    </div>
  );
}

/* ── Ticker de actividad — puente hero → clientes ───────────── */

export function Ticker() {
  const { t } = useLang();
  return (
    <div className="marquee overflow-hidden border-y border-nightline bg-night py-2.5" aria-hidden="true">
      <div className="marquee-track flex w-max gap-10">
        {[...t.ticker, ...t.ticker].map((item, i) => (
          <span key={i} className="flex items-center gap-2 font-mono text-[11px] whitespace-nowrap text-nightsecond">
            <span className="text-tealbrand">●</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const { t } = useLang();
  return (
    <section className="hero-night-cm relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-20">
      {/* Aurora */}
      <div className="aurora-blob aurora-a top-[-10%] right-[-5%] h-96 w-96 bg-tealbrand/20" aria-hidden="true" />
      <div className="aurora-blob aurora-b bottom-[-20%] left-[-8%] h-80 w-80 bg-limebrand/10" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1fr_1.15fr]">
        <Reveal staggered>
          <RevealItem>
            <p className="eyebrow text-tealbrand">{t.hero.eyebrow}</p>
          </RevealItem>
          <RevealItem>
            <h1 className="mt-4 text-4xl leading-[1.06] font-extrabold tracking-tight text-white sm:text-5xl">
              {t.hero.h1a}
              <em className="text-limebrand">{t.hero.h1b}</em>
            </h1>
          </RevealItem>
          <RevealItem>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-nightsecond">{t.hero.sub}</p>
          </RevealItem>
          <RevealItem>
            <CtaPair dark className="mt-8" />
          </RevealItem>
          <RevealItem>
            <p className="eyebrow mt-6 text-nightsecond">{t.hero.micro}</p>
          </RevealItem>
        </Reveal>

        <Reveal>
          <DashboardVivo />
        </Reveal>
      </div>
    </section>
  );
}
