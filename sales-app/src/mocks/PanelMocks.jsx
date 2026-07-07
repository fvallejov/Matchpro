// ─────────────────────────────────────────────────────────────
// Mocks del panel — réplicas del producto real, heredadas de
// clubmanager-landing y personalizadas con el club activo.
// Datos ficticios; el nombre del club viene del contexto.
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { EASE, ladderSpring } from "../motion";
import { PanelChrome, CountUp } from "../ui";
import { useClub } from "../club";

/* ── QR falso anatómicamente correcto (heredado) ────────────── */

const QR_N = 25;
const QR_MARGIN = 2;
const QR_CELLS = (() => {
  let s = 1337;
  const rnd = () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
  const finderAt = [
    [0, 0],
    [0, QR_N - 7],
    [QR_N - 7, 0],
  ];
  const alignAt = [QR_N - 9, QR_N - 9];
  const cells = [];
  for (let r = 0; r < QR_N; r++) {
    for (let c = 0; c < QR_N; c++) {
      let dark = null;
      for (const [fr, fc] of finderAt) {
        if (r >= fr - 1 && r < fr + 8 && c >= fc - 1 && c < fc + 8) {
          const lr = r - fr;
          const lc = c - fc;
          if (lr < 0 || lr > 6 || lc < 0 || lc > 6) dark = false;
          else {
            const ring = lr === 0 || lr === 6 || lc === 0 || lc === 6;
            const core = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
            dark = ring || core;
          }
        }
      }
      if (dark === null && r >= alignAt[0] && r < alignAt[0] + 5 && c >= alignAt[1] && c < alignAt[1] + 5) {
        const lr = r - alignAt[0];
        const lc = c - alignAt[1];
        dark = lr === 0 || lr === 4 || lc === 0 || lc === 4 || (lr === 2 && lc === 2);
      }
      if (dark === null) {
        if (r === 6 || c === 6) dark = (r + c) % 2 === 0;
        else dark = rnd() < 0.38;
      }
      if (dark) cells.push([c + QR_MARGIN, r + QR_MARGIN]);
    }
  }
  return cells;
})();

export function FakeQR({ className = "", light = "#5eead4", dark = "#0f2a52" }) {
  const size = QR_N + QR_MARGIN * 2;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={className} aria-hidden="true" shapeRendering="crispEdges">
      <rect width={size} height={size} fill={light} rx="1" />
      {QR_CELLS.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="1" height="1" fill={dark} />
      ))}
    </svg>
  );
}

/* ── Reservas: tabla real + fila nueva entrando ─────────────── */

const RESERVAS_BASE = [
  { u: "E. Sandoval", c: "Pádel 1", h: "10:00", m: "$22.000", est: 0 },
  { u: "I. Figueroa", c: "Cancha 2", h: "11:00", m: "$18.000", est: 0 },
  { u: "F. Carrasco", c: "Central", h: "12:00", m: "$20.000", est: 1 },
];

const RESERVAS_POOL = [
  { u: "A. Venegas", c: "Cancha 4", h: "18:00", m: "$25.000" },
  { u: "D. Cárcamo", c: "Pádel 2", h: "19:00", m: "$25.000" },
  { u: "H. Cifuentes", c: "Pádel 1", h: "20:00", m: "$25.000" },
];

export function MockReservas() {
  const club = useClub();
  const prefersReduced = useReducedMotion();
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => setBeat((b) => b + 1), 8000);
    return () => clearInterval(id);
  }, [prefersReduced]);

  const nueva = RESERVAS_POOL[beat % RESERVAS_POOL.length];
  const rows = [{ ...nueva, est: 0, nueva: true }, ...RESERVAS_BASE].slice(0, 4);
  const estLabel = ["Confirmada", "Completada"];
  const estStyle = ["bg-pmgreen/10 text-pmgreen", "bg-pmblue/10 text-pmblue"];

  return (
    <PanelChrome active="Canchas">
      <div className="bg-surface/70 p-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <p className="text-[12px] font-bold text-inkstrong">Reservas de Canchas</p>
            <p className="text-[9px] text-second">Gestiona las reservas de {club.nombre}.</p>
          </div>
          <span className="rounded-lg bg-pmlime px-2.5 py-1 text-[9px] font-bold text-white shadow-sm">
            + Nueva Reserva
          </span>
        </div>
        <div className="mt-2.5 overflow-hidden rounded-xl border border-line bg-white">
          <div className="grid grid-cols-[1.3fr_1fr_0.7fr_0.8fr] gap-2 border-b border-line px-3 py-1.5 text-[8px] font-semibold tracking-wide text-second uppercase">
            {["Usuario", "Cancha", "Monto", "Estado"].map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
          <AnimatePresence mode="popLayout" initial={false}>
            {rows.map((r) => (
              <motion.div
                key={r.u + beat * Number(Boolean(r.nueva))}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={ladderSpring}
                className={`grid grid-cols-[1.3fr_1fr_0.7fr_0.8fr] items-center gap-2 border-b border-line/60 px-3 py-2 text-[10px] last:border-0 ${
                  r.nueva ? "bg-pmlime/10" : "bg-white"
                }`}
              >
                <span className="flex items-center gap-1.5 font-semibold text-inkstrong">
                  <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-surface text-[7px] font-bold text-second ring-1 ring-line">
                    {r.u.slice(0, 1)}
                  </span>
                  {r.u}
                </span>
                <span className="text-second">
                  {r.c} · {r.h}
                </span>
                <span className="font-semibold text-inkstrong">{r.m}</span>
                <span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${
                      r.nueva ? "bg-pmlime text-white" : estStyle[r.est]
                    }`}
                  >
                    {estLabel[r.est]}
                  </span>
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="mt-2.5 flex items-center gap-2.5 rounded-xl border border-line bg-white px-3 py-2">
          <FakeQR className="h-8 w-8 shrink-0 rounded" light="#e2e8f0" dark="#0f172a" />
          <p className="text-[9px] leading-snug text-second">
            <span className="font-bold text-inkstrong">Reservas públicas activas.</span> Usuarios externos
            reservan y pagan por link o QR, sin crear cuenta.
          </p>
          <span className="ml-auto rounded-full bg-pmgreen/10 px-2 py-0.5 text-[8px] font-bold whitespace-nowrap text-pmgreen">
            ● Activas
          </span>
        </div>
      </div>
    </PanelChrome>
  );
}

/* ── Pagos: Estado de Pagos ─────────────────────────────────── */

const MOVS = [
  ["Reserva Pádel 1 · E. Sandoval", "+$22.000"],
  ["Cuota socio · V. Contreras", "+$35.000"],
  ["Inscripción Americano · C. Riffo", "+$5.000"],
];

export function MockPagos() {
  return (
    <PanelChrome active="Canchas">
      <div className="bg-surface/70 p-3">
        <div className="px-1">
          <p className="text-[12px] font-bold text-inkstrong">Estado de Pagos (Este Mes)</p>
          <p className="text-[9px] text-second">Todos los cobros del club, en un solo lugar.</p>
        </div>
        <div className="mt-2.5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between rounded-xl border border-pmgreen/20 bg-pmgreen/5 px-3 py-2.5">
            <span className="flex items-center gap-2 text-[11px] font-bold text-inkstrong">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pmgreen/15 text-[10px] text-pmgreen">✓</span>
              Pagados <span className="font-medium text-second">35 reservas</span>
            </span>
            <CountUp to={680000} prefix="$" className="text-[13px] font-bold text-pmgreen" />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-pmamber/25 bg-pmamber/5 px-3 py-2.5">
            <span className="flex items-center gap-2 text-[11px] font-bold text-inkstrong">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pmamber/15 text-[10px] text-pmamber">◷</span>
              Pendientes <span className="font-medium text-second">2 reservas</span>
            </span>
            <span className="text-[13px] font-bold text-pmamber">$36.000</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-line bg-white px-3 py-2.5">
            <span className="flex items-center gap-2 text-[11px] font-bold text-inkstrong">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pmred/10 text-[10px] text-pmred">✕</span>
              Fallidos <span className="font-medium text-second">0 reservas</span>
            </span>
            <span className="text-[13px] font-bold text-second">$0</span>
          </div>
        </div>
        <div className="mt-2.5 overflow-hidden rounded-xl border border-line bg-white">
          {MOVS.map(([c, m]) => (
            <div key={c} className="flex items-center justify-between border-b border-line/60 px-3 py-2 text-[10px] last:border-0">
              <span className="text-second">{c}</span>
              <span className="flex items-center gap-2">
                <span className="font-bold text-pmgreen">{m}</span>
                <span className="rounded bg-surface px-1.5 py-0.5 text-[7px] font-bold text-second ring-1 ring-line">
                  Webpay
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </PanelChrome>
  );
}

/* ── Finanzas: Dashboard de Arriendos ───────────────────────── */

const TENDENCIA = [28, 34, 40, 36, 42, 38, 44, 40, 46, 52, 88, 58];
const KPI_VALS = [86000, 524000, 2104000, 8936000];
const KPI_LABELS = [
  ["Ingresos Hoy", "+10% vs ayer"],
  ["Semana", "+8%"],
  ["Mes", "+12%"],
  ["Anual", "+24%"],
];
const KPI_COLORS = ["text-pmgreen", "text-pmblue", "text-pmpurple", "text-pmorange"];
const CANCHA_VALS = [
  ["$616.000", 100],
  ["$480.000", 78],
  ["$468.000", 76],
  ["$374.000", 61],
];
const CANCHAS_NOMBRES = ["Pádel 1", "Central", "Cancha 2", "Pádel 2"];

export function MockFinanzas() {
  const club = useClub();
  return (
    <PanelChrome active="Canchas">
      <div className="bg-surface/70 p-3">
        <div className="px-1">
          <p className="text-[12px] font-bold text-inkstrong">Dashboard de Arriendos</p>
          <p className="text-[9px] text-second">Monitorea los ingresos y reservas de {club.nombre}.</p>
        </div>
        <div className="mt-2.5 grid grid-cols-4 gap-1.5">
          {KPI_LABELS.map(([label, nota], i) => (
            <div key={label} className="rounded-xl border border-line bg-white px-2 py-1.5">
              <p className="text-[7.5px] font-medium text-second">{label}</p>
              <CountUp to={KPI_VALS[i]} prefix="$" className={`mt-0.5 block text-[11px] leading-tight font-bold ${KPI_COLORS[i]}`} />
              <p className="text-[7px] font-semibold text-pmgreen">{nota}</p>
            </div>
          ))}
        </div>

        <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-white p-2.5">
            <p className="text-[9px] font-bold text-inkstrong">Ingresos por Cancha (Este Mes)</p>
            <div className="mt-1.5 flex flex-col gap-1.5">
              {CANCHAS_NOMBRES.map((c, i) => (
                <div key={c} className="flex items-center gap-1.5 text-[8.5px]">
                  <span className="w-11 shrink-0 font-semibold text-second">{c}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${CANCHA_VALS[i][1]}%` }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full bg-pmlime"
                    />
                  </div>
                  <span className="w-12 text-right font-semibold text-inkstrong">{CANCHA_VALS[i][0]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-line bg-white p-2.5">
            <p className="text-[9px] font-bold text-inkstrong">Tendencia de Ingresos (12 Meses)</p>
            <div className="mt-2 flex h-16 items-end gap-1">
              {TENDENCIA.map((h, i) => (
                <motion.span
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.04 }}
                  className="flex-1 rounded-t-sm bg-pmlime"
                />
              ))}
            </div>
            <div className="mt-1.5 flex items-center justify-between border-t border-line pt-1.5 text-[8px]">
              <span className="text-second">Exportar</span>
              <span className="flex gap-1">
                <span className="rounded bg-pmgreen px-1.5 py-0.5 font-bold text-white">PDF</span>
                <span className="rounded bg-surface px-1.5 py-0.5 font-bold text-second ring-1 ring-line">CSV</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </PanelChrome>
  );
}

/* ── Torneos: wizard 7 pasos + cards ────────────────────────── */

const PASOS_WIZARD = ["Tipo", "Formato", "Info", "Canchas", "Puntos", "Estructura", "Revisión"];
const FORMATOS = ["Eliminación Simple", "Todos contra Todos", "Grupos + Eliminación"];

export function MockTorneos() {
  const club = useClub();
  return (
    <PanelChrome active="Torneos">
      <div className="bg-surface/70 p-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <p className="text-[12px] font-bold text-inkstrong">Torneos</p>
            <p className="text-[9px] text-second">Gestiona los torneos de {club.nombre}.</p>
          </div>
          <span className="rounded-lg bg-pmlime px-2.5 py-1 text-[9px] font-bold text-white shadow-sm">
            + Crear Torneo
          </span>
        </div>

        <div className="mt-2.5 rounded-xl border border-line bg-white p-2.5">
          <div className="flex items-center justify-between text-[8.5px]">
            <p className="font-bold text-inkstrong">Crear Torneo · Paso 2 de 7: Formato</p>
            <p className="font-semibold text-second">28% completado</p>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "28%" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-pmlime"
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            {PASOS_WIZARD.map((s, i) => (
              <span key={s} className="flex flex-col items-center gap-0.5">
                <span
                  className={`flex h-3.5 w-3.5 items-center justify-center rounded-full text-[7px] font-bold ${
                    i === 0
                      ? "bg-pmgreen text-white"
                      : i === 1
                        ? "bg-pmlime text-white ring-2 ring-pmlime/30"
                        : "bg-surface text-second ring-1 ring-line"
                  }`}
                >
                  {i === 0 ? "✓" : i + 1}
                </span>
                <span className={`text-[6px] ${i === 1 ? "font-bold text-inkstrong" : "text-second"}`}>{s}</span>
              </span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5 text-center text-[7.5px] font-semibold">
            <span className="rounded-lg border-2 border-pmlime bg-pmlime/5 px-1 py-1.5 text-inkstrong">
              {FORMATOS[0]}
            </span>
            <span className="rounded-lg border border-line px-1 py-1.5 text-second">{FORMATOS[1]}</span>
            <span className="rounded-lg border border-line px-1 py-1.5 text-second">{FORMATOS[2]}</span>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-1.5">
          <div className="rounded-xl border border-line bg-white p-2.5">
            <div className="flex items-center justify-between">
              <p className="text-[9.5px] font-bold text-inkstrong">Copa {club.corto}</p>
              <span className="rounded-full bg-pmblue/10 px-1.5 py-0.5 text-[7px] font-bold text-pmblue">
                Inscripciones abiertas
              </span>
            </div>
            <p className="mt-0.5 text-[8px] text-second">Eliminación Simple · Competitivo</p>
            <p className="mt-1 text-[8px] text-second">👥 8/16 · 🎾 4 canchas · 💰 $10.000</p>
            <p className="mt-1 rounded bg-pmamber/10 px-1.5 py-0.5 text-[7.5px] font-semibold text-pmamber">
              ◷ Cierra en 1 semana
            </p>
          </div>
          <div className="rounded-xl border border-line bg-white p-2.5">
            <div className="flex items-center justify-between">
              <p className="text-[9.5px] font-bold text-inkstrong">Americano del Sábado</p>
              <span className="rounded-full bg-pmgreen/10 px-1.5 py-0.5 text-[7px] font-bold text-pmgreen">
                ● En curso
              </span>
            </div>
            <p className="mt-0.5 text-[8px] text-second">Americano · Social · 12/12</p>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "67%" }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="h-full rounded-full bg-pmgreen"
              />
            </div>
            <p className="mt-1 text-[7.5px] text-second">
              Progreso 6/9 · <span className="font-bold text-pmgreen">Control en Vivo → TV</span>
            </p>
          </div>
        </div>
      </div>
    </PanelChrome>
  );
}

/* ── Cuotas de Membresía (según panel real 2026) ────────────── */

const CUOTAS_KPIS = [
  ["Al día", "96", "text-pmgreen", "border-pmgreen/20 bg-pmgreen/5"],
  ["Por vencer", "8", "text-pmamber", "border-pmamber/25 bg-pmamber/5"],
  ["Morosos", "4", "text-pmred", "border-pmred/20 bg-pmred/5"],
];

const CUOTAS_ROWS = [
  ["V. Contreras", "Socio Full · $35.000", "Pagada", "bg-pmgreen/10 text-pmgreen", "Webpay"],
  ["M. Salgado", "Socio Full · $35.000", "Reintento auto", "bg-pmamber/15 text-pmamber", "mañana 09:00"],
  ["A. Baeza", "Socio Junior · $28.000", "Aviso enviado", "bg-pmblue/10 text-pmblue", "WhatsApp"],
  ["D. Aravena", "Socio Full · $35.000", "Pagada", "bg-pmgreen/10 text-pmgreen", "Transferencia"],
];

export function MockCuotas() {
  const club = useClub();
  return (
    <PanelChrome active="Socios">
      <div className="bg-surface/70 p-3">
        <div className="px-1">
          <p className="text-[12px] font-bold text-inkstrong">Cuotas de Membresía</p>
          <p className="text-[9px] text-second">Cobro automático mensual · {club.nombre}</p>
        </div>

        <div className="mt-2.5 grid grid-cols-3 gap-1.5">
          {CUOTAS_KPIS.map(([label, val, color, box]) => (
            <div key={label} className={`rounded-xl border px-3 py-2 ${box}`}>
              <p className="text-[8px] font-medium text-second">{label}</p>
              <p className={`text-[15px] leading-tight font-bold ${color}`}>{val}</p>
            </div>
          ))}
        </div>

        <div className="mt-2 overflow-hidden rounded-xl border border-line bg-white">
          {CUOTAS_ROWS.map(([n, tipo, est, estCls, via]) => (
            <div
              key={n}
              className="flex items-center justify-between border-b border-line/60 px-3 py-2 text-[10px] last:border-0"
            >
              <span className="flex items-center gap-1.5 font-semibold text-inkstrong">
                <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-surface text-[7px] font-bold text-second ring-1 ring-line">
                  {n.slice(0, 1)}
                </span>
                {n} <span className="font-normal text-second">· {tipo}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${estCls}`}>{est}</span>
                <span className="w-16 text-right text-[8px] text-mutedink">{via}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {["Multas configurables", "Congelamiento", "Dcto. pronto pago", "Cuota incorporación"].map((c) => (
            <span key={c} className="rounded-full bg-white px-2 py-0.5 text-[7.5px] font-semibold text-second ring-1 ring-line">
              {c}
            </span>
          ))}
        </div>
      </div>
    </PanelChrome>
  );
}

/* ── Escalerilla viva (fiel al producto) ────────────────────── */

const LADDER_BASE = [
  { id: "vc", name: "V. Contreras", pts: 2840, pct: "78%" },
  { id: "ms", name: "M. Salgado", pts: 2712, pct: "71%" },
  { id: "ab", name: "A. Baeza", pts: 2690, pct: "69%" },
  { id: "cr", name: "C. Riffo", pts: 2544, pct: "64%" },
  { id: "da", name: "D. Aravena", pts: 2410, pct: "58%" },
];

const POS_STYLE = ["bg-pmamber text-white", "bg-line text-inkstrong", "bg-pmorange/80 text-white"];

export function EscalerillaViva() {
  const prefersReduced = useReducedMotion();
  const [rows, setRows] = useState(LADDER_BASE);
  const [moved, setMoved] = useState(null);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => {
      setRows((prev) => {
        const next = [...prev];
        const i = 3;
        if (next[i].id === "cr") {
          [next[i - 1], next[i]] = [next[i], next[i - 1]];
          setMoved("cr");
        } else {
          setMoved(null);
          return LADDER_BASE;
        }
        return next;
      });
    }, 8000);
    return () => clearInterval(id);
  }, [prefersReduced]);

  return (
    <div className="font-product rounded-2xl border border-line bg-white p-4 shadow-xl shadow-inkstrong/10">
      <div className="flex items-start justify-between px-1">
        <div>
          <p className="flex items-center gap-1.5 text-[13px] font-bold text-inkstrong">
            Escalerilla General
            <span className="rounded-full bg-pmamber/15 px-1.5 py-0.5 text-[8px] font-bold text-pmamber">
              ☆ Predeterminada
            </span>
            <span className="rounded-full bg-pmgreen/10 px-1.5 py-0.5 text-[8px] font-bold text-pmgreen">
              Club Patrocina
            </span>
          </p>
          <p className="mt-0.5 text-[10px] text-second">45/100 participantes · 6 desafíos activos</p>
        </div>
        <p className="eyebrow font-mono text-tealbrand">TrueRank</p>
      </div>
      <div className="mt-3 grid grid-cols-[2rem_1fr_3.2rem_2.6rem] gap-2 px-3 text-[8px] font-semibold tracking-wide text-second uppercase">
        {["Pos", "Jugador", "Puntos", "% Vict."].map((c, i) => (
          <span key={c} className={i > 1 ? "text-right" : ""}>
            {c}
          </span>
        ))}
      </div>
      <ul className="mt-1 flex flex-col gap-1">
        {rows.map((r, i) => (
          <motion.li
            key={r.id}
            layout
            transition={ladderSpring}
            className={`grid grid-cols-[2rem_1fr_3.2rem_2.6rem] items-center gap-2 rounded-xl px-3 py-2 text-sm ${
              moved === r.id ? "bg-pmlime/15 ring-1 ring-pmlime/60" : i < 3 ? "bg-surface" : "bg-white"
            }`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                POS_STYLE[i] ?? "bg-white text-second ring-1 ring-line"
              }`}
            >
              {i + 1}
            </span>
            <span className="flex items-center gap-2 text-[13px] font-semibold text-inkstrong">
              {r.name}
              {moved === r.id && (
                <span className="rounded-full bg-pmlime px-2 py-0.5 text-[9px] font-bold text-white">▲ +1</span>
              )}
            </span>
            <span className="text-right text-[12px] font-semibold text-inkstrong">
              {r.pts.toLocaleString("es-CL")}
            </span>
            <span className="text-right text-[11px] text-second">{r.pct}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
