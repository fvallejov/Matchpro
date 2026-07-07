// ─────────────────────────────────────────────────────────────
// Dashboard vivo — heredado del hero de clubmanager-landing.
// Rota entre Dashboard → Calendario → Cuadro del torneo, con
// parallax al mouse. Personalizado con el club activo.
// ─────────────────────────────────────────────────────────────

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
import { PanelChrome } from "../ui";
import { useClub } from "../club";

/* Área de crecimiento: línea + relleno degradado (reemplaza al
   sparkline plano). Se dibuja al montar. */
const AREA_PTS = [
  [0, 30], [13, 29], [26, 27], [39, 27.5], [52, 24], [65, 22], [78, 21],
  [91, 17], [104, 15.5], [117, 11], [130, 8], [140, 5],
];
const AREA_LINE = AREA_PTS.map(([x, y]) => `${x},${y}`).join(" ");
const AREA_FILL = `0,34 ${AREA_LINE} 140,34`;

function AreaChart({ className = "" }) {
  return (
    <svg viewBox="0 0 140 34" className={className} aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaLime" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#84cc16" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#84cc16" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      {[8, 16, 24].map((y) => (
        <line key={y} x1="0" x2="140" y1={y} y2={y} stroke="#e2e8f0" strokeWidth="0.5" />
      ))}
      <motion.polygon
        points={AREA_FILL}
        fill="url(#areaLime)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      />
      <motion.polyline
        points={AREA_LINE}
        fill="none"
        stroke="#84cc16"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <motion.circle
        cx="140"
        cy="5"
        r="2.5"
        fill="#84cc16"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.1 }}
      />
    </svg>
  );
}

const ACTIVIDAD_POOL = [
  { a: "V. Contreras", b: "M. Salgado" },
  { a: "C. Riffo", b: "A. Baeza" },
  { a: "P. Fuentealba", b: "D. Aravena" },
  { a: "J. Maldonado", b: "R. Cisternas" },
];

function Kpi({ label, value, note, noteClass = "text-pmgreen" }) {
  return (
    <div className="rounded-xl border border-line bg-white px-3 py-2 shadow-sm shadow-black/[0.03]">
      <p className="text-[9px] font-medium text-second">{label}</p>
      <p className="mt-0.5 text-lg leading-tight font-bold text-inkstrong">{value}</p>
      {note && <p className={`text-[9px] font-semibold ${noteClass}`}>{note}</p>}
    </div>
  );
}

function VistaDashboard({ beat, club }) {
  const actividad = [0, 1, 2].map((i) => ACTIVIDAD_POOL[(beat + i) % ACTIVIDAD_POOL.length]);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <div>
          <p className="text-[12px] font-bold text-inkstrong">Panel de {club.nombre}</p>
          <p className="text-[9px] text-second">Administra tu club, socios y escalerillas desde aquí.</p>
        </div>
        <span className="flex items-center gap-1 text-[9px] font-semibold text-pmgreen">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute h-full w-full animate-ping rounded-full bg-pmgreen opacity-60" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-pmgreen" />
          </span>
          En vivo
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Kpi label="Socios Activos" value="128" note="+3 vs mes pasado" />
        <Kpi label="Partidos Este Mes" value={42 + beat} note="+6 vs mes pasado" />
        <Kpi label="Desafíos Activos" value="6" note="97% aceptados" noteClass="text-pmpurple" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-line bg-white p-3 shadow-sm shadow-black/[0.03]">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-medium text-second">Ingresos del Mes</p>
            <span className="rounded-full bg-pmgreen/10 px-1.5 py-0.5 text-[8px] font-bold text-pmgreen">
              Al día
            </span>
          </div>
          <p className="mt-1 text-xl font-bold text-pmgreen">
            ${(2104000 + beat * 22000).toLocaleString("es-CL")}
          </p>
          <p className="mt-0.5 text-[9px] font-semibold text-second">
            Última factura <span className="font-bold text-pmgreen">Pagada</span>
          </p>
        </div>
        <div className="rounded-xl border border-line bg-white p-3 shadow-sm shadow-black/[0.03]">
          <div className="flex items-baseline justify-between">
            <p className="text-[9px] font-medium text-second">Crecimiento de Socios</p>
            <p className="text-[8px] font-semibold text-pmgreen">▲ +14% en 12 meses</p>
          </div>
          <p className="mt-0.5 text-xl font-bold text-inkstrong">128</p>
          <AreaChart className="mt-1 h-9 w-full" />
        </div>
      </div>

      <div className="rounded-xl border border-line bg-white p-3 shadow-sm shadow-black/[0.03]">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-medium text-second">Actividad Reciente</p>
          <p className="text-[8px] text-mutedink">actualizado hace 3 s</p>
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
                  <span className="font-bold text-inkstrong">{a}</span> venció a{" "}
                  <span className="font-semibold">{b}</span>
                </span>
                <span className="text-[8px] font-medium text-mutedink">
                  {i === 0 ? "ahora" : ["hace 14 min", "hace 42 min"][i - 1]}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}

/* ── Calendario semanal ─────────────────────────────────────── */

const HORAS = ["08:00", "10:00", "12:00", "16:00", "18:00", "20:00"];
const GRILLA = [
  [0, 1, 0, 1, 0, 2, 2],
  [1, 0, 1, 1, 0, 2, 2],
  [0, 1, 1, 0, 1, 2, 1],
  [1, 1, 0, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 1, 1, 0, 1],
];
const CELDA = {
  0: "bg-surface text-mutedink",
  1: "bg-pmlime/25 text-limeink font-bold",
  2: "bg-pmblue/15 text-pmblue font-bold",
};
const DIAS = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];
const LABEL = { 0: "—", 1: "Reservada", 2: "Torneo" };

function VistaCalendario() {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <div>
          <p className="text-[12px] font-bold text-inkstrong">Calendario de Reservas</p>
          <p className="text-[9px] text-second">Cancha 2 · Tenis · Ocupación semanal 74%</p>
        </div>
        <span className="rounded-lg bg-pmlime px-2.5 py-1 text-[9px] font-bold text-white shadow-sm">
          + Nueva Reserva
        </span>
      </div>
      {/* El calendario ocupa TODO el alto disponible del panel */}
      <div className="flex flex-1 flex-col rounded-xl border border-line bg-white p-2.5">
        <div className="grid grid-cols-[2.4rem_repeat(7,1fr)] gap-1 pb-1">
          <span />
          {DIAS.map((d) => (
            <span key={d} className="text-center font-mono text-[7px] font-bold text-second">
              {d}
            </span>
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-1">
          {HORAS.map((h, fila) => (
            <div key={h} className="grid flex-1 grid-cols-[2.4rem_repeat(7,1fr)] gap-1">
              <span className="self-center font-mono text-[7px] text-second">{h}</span>
              {GRILLA[fila].map((v, col) => (
                <motion.span
                  key={col}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, ease: EASE, delay: 0.12 + (fila * 7 + col) * 0.012 }}
                  className={`flex items-center justify-center rounded px-1 text-center text-[6.5px] leading-none ${CELDA[v]}`}
                >
                  {LABEL[v]}
                </motion.span>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-3 border-t border-line pt-1.5 text-[7.5px] text-second">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-pmlime/40" /> Reservada · pagada
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-pmblue/25" /> Bloqueo torneo
          </span>
          <span className="ml-auto font-semibold text-pmgreen">Tarifa alta 18–22 h</span>
        </div>
      </div>
    </div>
  );
}

/* ── Cuadro del torneo ──────────────────────────────────────── */

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

/* El cuadro AVANZA: semifinales en juego → final en juego →
   campeón. Tres etapas mientras la vista está montada. */
const ETAPAS = ["● Semifinales en juego", "● Final en juego", "🏆 Campeón"];

function VistaTorneos({ club }) {
  const prefersReduced = useReducedMotion();
  const [etapa, setEtapa] = useState(0);

  useEffect(() => {
    if (prefersReduced) {
      setEtapa(2);
      return;
    }
    const t1 = setTimeout(() => setEtapa(1), 2200);
    const t2 = setTimeout(() => setEtapa(2), 4400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [prefersReduced]);

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <div>
          <p className="text-[12px] font-bold text-inkstrong">Copa {club.corto} · Cuadro</p>
          <p className="text-[9px] text-second">Eliminación simple · fixture automático</p>
        </div>
        <motion.span
          key={etapa}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-full px-2 py-1 text-[8px] font-bold ${
            etapa === 2 ? "bg-pmamber/15 text-pmamber" : "bg-pmgreen/10 text-pmgreen"
          }`}
        >
          {ETAPAS[etapa]}
        </motion.span>
      </div>
      <div className="flex flex-1 items-center gap-2 rounded-xl border border-line bg-white p-2.5">
        <div className="flex flex-1 flex-col justify-around gap-2">
          <p className="font-mono text-[6.5px] font-bold text-second uppercase">Semifinales</p>
          {etapa === 0 ? (
            <>
              <LlaveBox a="Contreras/Riffo" b="Salgado/Baeza" sa="5-3" sb="3-5" ganaA />
              <LlaveBox a="Aravena/Venegas" b="Sandoval/Mora" sa="6-5" sb="5-6" ganaA />
            </>
          ) : (
            <>
              <LlaveBox a="Contreras/Riffo" b="Salgado/Baeza" sa="6-3" sb="3-6" ganaA />
              <LlaveBox a="Aravena/Venegas" b="Sandoval/Mora" sa="7-5" sb="5-7" ganaA />
            </>
          )}
        </div>
        <div className="flex h-3/5 w-3 flex-col justify-around" aria-hidden="true">
          <span className="h-1/2 w-full rounded-tr border-t border-r border-line" />
          <span className="h-1/2 w-full rounded-br border-r border-b border-line" />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          <p className={`font-mono text-[6.5px] font-bold uppercase ${etapa === 2 ? "text-pmamber" : "text-pmgreen"}`}>
            {etapa === 0 ? "Final · por definir" : etapa === 1 ? "Final · en juego" : "Final · terminada"}
          </p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={etapa === 0 ? "vacia" : "final"}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {etapa === 0 ? (
                <div className="w-full rounded-lg border border-dashed border-line bg-surface/60 px-1.5 py-2.5 text-center text-[7px] text-mutedink">
                  Esperando ganadores…
                </div>
              ) : (
                <LlaveBox a="Contreras/Riffo" b="Aravena/Venegas" sa={etapa === 1 ? "4-2" : "6-4"} sb={etapa === 1 ? "2-4" : "4-6"} ganaA />
              )}
            </motion.div>
          </AnimatePresence>
          {etapa === 2 ? (
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-lg bg-pmamber/10 px-1.5 py-1 text-center text-[7.5px] font-bold text-pmamber"
            >
              🏆 Campeones: Contreras/Riffo
            </motion.p>
          ) : (
            <p className="text-[7.5px] font-bold text-pmgreen">Control en Vivo → TV del club</p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between rounded-xl border border-line bg-white px-3 py-1.5 text-[8px]">
        <span className="text-second">
          Se redibuja solo con cada resultado · <span className="font-bold text-inkstrong">2 canchas</span>{" "}
          asignadas
        </span>
        <span className="rounded-lg bg-pmlime px-2 py-0.5 text-[8px] font-bold text-white">+ Crear Torneo</span>
      </div>
    </div>
  );
}

/* ── El cuadro del torneo como mock independiente (lámina
      Competencias: "el torneo por dentro") ─────────────────── */

export function MockCuadro() {
  const club = useClub();
  return (
    <PanelChrome active="Torneos">
      <div className="relative aspect-[16/10] overflow-hidden bg-surface/70">
        <div className="absolute inset-0 p-2.5">
          <VistaTorneos club={club} />
        </div>
      </div>
    </PanelChrome>
  );
}

/* ── Rotación + parallax ────────────────────────────────────── */

const VISTA_NAVS = ["Dashboard", "Canchas", "Torneos"];
const VISTA_LABELS = ["Dashboard", "Calendario", "Cuadro del torneo"];

export function DashboardVivo({ dark = true }) {
  const club = useClub();
  const prefersReduced = useReducedMotion();
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => setBeat((b) => b + 1), 7000);
    return () => clearInterval(id);
  }, [prefersReduced]);

  const vista = beat % 3;

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
                {vista === 0 && <VistaDashboard beat={beat} club={club} />}
                {vista === 1 && <VistaCalendario />}
                {vista === 2 && <VistaTorneos club={club} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </PanelChrome>
      </motion.div>

      <div className="mt-4 flex items-center justify-center gap-4">
        <div className="flex gap-1.5" role="tablist" aria-label="Vistas del panel">
          {VISTA_LABELS.map((v, i) => (
            <span
              key={v}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === vista ? "w-6 bg-limebrand" : dark ? "w-1.5 bg-white/25" : "w-1.5 bg-line"
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
        <p className={`text-xs font-semibold ${dark ? "text-nightsecond" : "text-second"}`}>
          {VISTA_LABELS[vista]} · <span className="text-tealbrand">un solo panel</span>
        </p>
      </div>
    </div>
  );
}
