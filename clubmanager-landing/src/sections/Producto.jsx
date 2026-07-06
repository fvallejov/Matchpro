import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { EASE, ladderSpring } from "../motion";
import { Reveal, RevealItem, SectionHeading, PanelChrome, CountUp, AccentTitle } from "../ui";
import { useLang } from "../i18n";
import isotipo from "../assets/isotipo.svg";

/* ─────────────────────────────────────────────────────────────
   Mocks = RÉPLICAS del producto real (banda azul, Poppins,
   colores del panel). El producto tiene modo inglés → los mocks
   se traducen con el diccionario local MK. Datos y nombres
   ficticios — Club Los Aromos.
   ───────────────────────────────────────────────────────────── */

const MK = {
  es: {
    reservas: {
      titulo: "Reservas de Canchas",
      sub: "Gestiona las reservas de Club Los Aromos.",
      nueva: "+ Nueva Reserva",
      cols: ["Usuario", "Cancha", "Monto", "Estado"],
      confirmada: "Confirmada",
      completada: "Completada",
      pub1: "Reservas públicas activas.",
      pub2: "Usuarios externos reservan y pagan por link o QR, sin crear cuenta.",
      activas: "● Activas",
    },
    pagos: {
      titulo: "Estado de Pagos (Este Mes)",
      sub: "Todos los cobros del club, en un solo lugar.",
      pagados: "Pagados",
      pendientes: "Pendientes",
      fallidos: "Fallidos",
      reservasN: (n) => `${n} reservas`,
      movs: [
        ["Reserva Pádel 1 · E. Sandoval", "+$22.000"],
        ["Cuota socio · V. Contreras", "+$35.000"],
        ["Inscripción Mexicano · C. Riffo", "+$5.000"],
      ],
    },
    finanzas: {
      titulo: "Dashboard de Arriendos",
      sub: "Monitorea los ingresos y reservas de Club Los Aromos.",
      kpis: [
        ["Ingresos Hoy", "+10% vs ayer"],
        ["Semana", "+8%"],
        ["Mes", "+12%"],
        ["Anual", "+24%"],
      ],
      porCancha: "Ingresos por Cancha (Este Mes)",
      canchas: ["Pádel 1", "Central", "Cancha 2", "Pádel 2"],
      tendencia: "Tendencia de Ingresos (12 Meses)",
      exportar: "Exportar",
    },
    torneos: {
      titulo: "Torneos",
      sub: "Gestiona los torneos de Club Los Aromos.",
      crear: "+ Crear Torneo",
      wizardTitulo: "Crear Torneo · Paso 2 de 7: Formato",
      completado: "28% completado",
      pasos: ["Tipo", "Formato", "Info", "Canchas", "Puntos", "Estructura", "Revisión"],
      formatos: ["Eliminación Simple", "Todos contra Todos", "Grupos + Eliminación"],
      copa: "Copa Los Aromos",
      inscripciones: "Inscripciones abiertas",
      copaSub: "Eliminación Simple · Competitivo",
      copaInfo: "👥 8/16 · 🎾 4 canchas · 💰 $10.000",
      cierra: "◷ Cierra en 1 semana",
      mexicano: "Mexicano Semanal",
      enCurso: "● En curso",
      mexSub: "Mexicano · Social · 12/12",
      progreso: "Progreso 6/9 ·",
      control: "Control en Vivo → TV",
    },
    tv: {
      hola: "Hola, Club Los Aromos",
      canchasT: "Estado de Canchas",
      canchas: [
        ["Cancha Central", "Tenis", "Mantención", "Vuelve 09:00"],
        ["Cancha 2", "Tenis", "En juego", "L. Gutiérrez · Set 3"],
        ["Cancha 3", "Tenis", "Libre", "Próx. 19:00"],
        ["Pádel 1", "Pádel", "En juego", "C. Riffo · 18:00–19:30"],
        ["Pádel 2", "Pádel", "Libre", "$25.000/h tarifa alta"],
        ["Cancha 4", "Tenis", "Libre", "Iluminación ✓"],
      ],
      chips: { Mantención: "Mantención", "En juego": "En juego", Libre: "Libre", Programado: "Programado" },
      copaT: "Copa Los Aromos",
      copaSub: "Eliminación Simple · Cuartos de final",
      copaJugados: "6/8 jugados",
      copaMatches: [
        ["Cancha 2 · 19:00", "L. Gutiérrez vs C. Álvarez"],
        ["Cancha 3 · 19:00", "G. Pérez vs A. Valenzuela"],
        ["Cancha 4 · 20:30", "C. Paredes vs P. Núñez"],
      ],
      posT: "Tabla de Posiciones",
      posTBig: "Tabla de Posiciones · Ranking en vivo",
      posStats: ["24 PJ · 78%", "21 PJ · 71%", "23 PJ · 69%", "19 PJ · 64%", "17 PJ · 58%"],
      marcadorT: "Marcador en Vivo · Cancha 2",
      set3: "Set 3 · en juego",
      duracion: "⏱ 1:13 · 132 pts",
      cumpleT: "Próximos Cumpleaños",
      cumples: [
        ["VC", "V. Contreras", "Hoy · 38 años 🎉"],
        ["MS", "M. Salgado", "Sáb 28 · 41 años"],
      ],
      sponsorsT: "Sponsors",
      oro: "ORO",
      plata: "PLATA",
      qrT: "QR Reservas",
      qrSub: "Escanea y reserva desde tu celular",
      powered: "Powered by",
      enVivo: "EN VIVO · 18:58",
      rota: "Rotación automática · siguiente: Estado de Canchas",
      vincula: "Vincula tu pantalla",
      escanea1: "Escanea el código QR o ingresa el código en",
      codigoDe: "Código de activación",
      expira: "◷ El código expira en 14:58",
      celular: "Escanea con tu celular",
      conectado: "Conectado",
    },
    escalerilla: {
      titulo: "Escalerilla General",
      predeterminada: "☆ Predeterminada",
      patrocina: "Club Patrocina",
      sub: "45/100 participantes · 6 desafíos activos",
      cols: ["Pos", "Jugador", "Puntos", "% Vict."],
      subioUna: "▲ +1",
    },
  },
  en: {
    reservas: {
      titulo: "Court Bookings",
      sub: "Manage Club Los Aromos bookings.",
      nueva: "+ New Booking",
      cols: ["User", "Court", "Amount", "Status"],
      confirmada: "Confirmed",
      completada: "Completed",
      pub1: "Public bookings on.",
      pub2: "Outside users book and pay via link or QR, no account needed.",
      activas: "● Active",
    },
    pagos: {
      titulo: "Payment Status (This Month)",
      sub: "Every club charge, in one place.",
      pagados: "Paid",
      pendientes: "Pending",
      fallidos: "Failed",
      reservasN: (n) => `${n} bookings`,
      movs: [
        ["Booking Padel 1 · E. Sandoval", "+$22.000"],
        ["Membership · V. Contreras", "+$35.000"],
        ["Mexicano entry · C. Riffo", "+$5.000"],
      ],
    },
    finanzas: {
      titulo: "Rentals Dashboard",
      sub: "Track Club Los Aromos revenue and bookings.",
      kpis: [
        ["Revenue Today", "+10% vs yesterday"],
        ["Week", "+8%"],
        ["Month", "+12%"],
        ["Year", "+24%"],
      ],
      porCancha: "Revenue by Court (This Month)",
      canchas: ["Padel 1", "Center", "Court 2", "Padel 2"],
      tendencia: "Revenue Trend (12 Months)",
      exportar: "Export",
    },
    torneos: {
      titulo: "Tournaments",
      sub: "Manage Club Los Aromos tournaments.",
      crear: "+ Create Tournament",
      wizardTitulo: "Create Tournament · Step 2 of 7: Format",
      completado: "28% complete",
      pasos: ["Type", "Format", "Info", "Courts", "Scoring", "Structure", "Review"],
      formatos: ["Single Elimination", "Round Robin", "Groups + Knockout"],
      copa: "Copa Los Aromos",
      inscripciones: "Registration open",
      copaSub: "Single Elimination · Competitive",
      copaInfo: "👥 8/16 · 🎾 4 courts · 💰 $10.000",
      cierra: "◷ Closes in 1 week",
      mexicano: "Weekly Mexicano",
      enCurso: "● Live",
      mexSub: "Mexicano · Social · 12/12",
      progreso: "Progress 6/9 ·",
      control: "Live Control → TV",
    },
    tv: {
      hola: "Hello, Club Los Aromos",
      canchasT: "Court Status",
      canchas: [
        ["Center Court", "Tennis", "Mantención", "Back 09:00"],
        ["Court 2", "Tennis", "En juego", "L. Gutiérrez · Set 3"],
        ["Court 3", "Tennis", "Libre", "Next 7 PM"],
        ["Padel 1", "Padel", "En juego", "C. Riffo · 6–7:30 PM"],
        ["Padel 2", "Padel", "Libre", "$25.000/h peak rate"],
        ["Court 4", "Tennis", "Libre", "Lights ✓"],
      ],
      chips: { Mantención: "Maintenance", "En juego": "In play", Libre: "Free", Programado: "Scheduled" },
      copaT: "Copa Los Aromos",
      copaSub: "Single Elimination · Quarterfinals",
      copaJugados: "6/8 played",
      copaMatches: [
        ["Court 2 · 7 PM", "L. Gutiérrez vs C. Álvarez"],
        ["Court 3 · 7 PM", "G. Pérez vs A. Valenzuela"],
        ["Court 4 · 8:30 PM", "C. Paredes vs P. Núñez"],
      ],
      posT: "Standings",
      posTBig: "Standings · Live ranking",
      posStats: ["24 MP · 78%", "21 MP · 71%", "23 MP · 69%", "19 MP · 64%", "17 MP · 58%"],
      marcadorT: "Live Score · Court 2",
      set3: "Set 3 · in play",
      duracion: "⏱ 1:13 · 132 pts",
      cumpleT: "Upcoming Birthdays",
      cumples: [
        ["VC", "V. Contreras", "Today · 38 🎉"],
        ["MS", "M. Salgado", "Sat 28 · 41"],
      ],
      sponsorsT: "Sponsors",
      oro: "GOLD",
      plata: "SILVER",
      qrT: "QR Bookings",
      qrSub: "Scan and book from your phone",
      powered: "Powered by",
      enVivo: "LIVE · 18:58",
      rota: "Auto rotation · next: Court Status",
      vincula: "Link your screen",
      escanea1: "Scan the QR code or enter the code at",
      codigoDe: "Activation code",
      expira: "◷ Code expires in 14:58",
      celular: "Scan with your phone",
      conectado: "Connected",
    },
    escalerilla: {
      titulo: "General Ladder",
      predeterminada: "☆ Default",
      patrocina: "Club Sponsored",
      sub: "45/100 participants · 6 active challenges",
      cols: ["Pos", "Player", "Points", "Win %"],
      subioUna: "▲ +1",
    },
  },
};

/* ── Reservas: la tabla real + fila nueva entrando ──────────── */

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

function MockReservas() {
  const { lang } = useLang();
  const L = MK[lang].reservas;
  const prefersReduced = useReducedMotion();
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => setBeat((b) => b + 1), 8000);
    return () => clearInterval(id);
  }, [prefersReduced]);

  const nueva = RESERVAS_POOL[beat % RESERVAS_POOL.length];
  const rows = [{ ...nueva, est: 0, nueva: true }, ...RESERVAS_BASE].slice(0, 4);
  const estLabel = [L.confirmada, L.completada];
  const estStyle = ["bg-pmgreen/10 text-pmgreen", "bg-pmblue/10 text-pmblue"];

  return (
    <PanelChrome active="Canchas">
      <div className="bg-surface/70 p-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <p className="text-[12px] font-bold text-inkstrong">{L.titulo}</p>
            <p className="text-[9px] text-second">{L.sub}</p>
          </div>
          <span className="rounded-lg bg-pmlime px-2.5 py-1 text-[9px] font-bold text-white shadow-sm">
            {L.nueva}
          </span>
        </div>
        <div className="mt-2.5 overflow-hidden rounded-xl border border-line bg-white">
          <div className="grid grid-cols-[1.3fr_1fr_0.7fr_0.8fr] gap-2 border-b border-line px-3 py-1.5 text-[8px] font-semibold tracking-wide text-second uppercase">
            {L.cols.map((c) => (
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
        {/* Reservas públicas — feature real */}
        <div className="mt-2.5 flex items-center gap-2.5 rounded-xl border border-line bg-white px-3 py-2">
          <FakeQR className="h-8 w-8 shrink-0 rounded" light="#e2e8f0" dark="#0f172a" />
          <p className="text-[9px] leading-snug text-second">
            <span className="font-bold text-inkstrong">{L.pub1}</span> {L.pub2}
          </p>
          <span className="ml-auto rounded-full bg-pmgreen/10 px-2 py-0.5 text-[8px] font-bold whitespace-nowrap text-pmgreen">
            {L.activas}
          </span>
        </div>
      </div>
    </PanelChrome>
  );
}

/* ── Pagos: réplica del módulo Estado de Pagos ──────────────── */

function MockPagos() {
  const { lang } = useLang();
  const L = MK[lang].pagos;
  return (
    <PanelChrome active="Canchas">
      <div className="bg-surface/70 p-3">
        <div className="px-1">
          <p className="text-[12px] font-bold text-inkstrong">{L.titulo}</p>
          <p className="text-[9px] text-second">{L.sub}</p>
        </div>
        <div className="mt-2.5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between rounded-xl border border-pmgreen/20 bg-pmgreen/5 px-3 py-2.5">
            <span className="flex items-center gap-2 text-[11px] font-bold text-inkstrong">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pmgreen/15 text-[10px] text-pmgreen">✓</span>
              {L.pagados} <span className="font-medium text-second">{L.reservasN(35)}</span>
            </span>
            <CountUp to={680000} prefix="$" className="text-[13px] font-bold text-pmgreen" />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-pmamber/25 bg-pmamber/5 px-3 py-2.5">
            <span className="flex items-center gap-2 text-[11px] font-bold text-inkstrong">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pmamber/15 text-[10px] text-pmamber">◷</span>
              {L.pendientes} <span className="font-medium text-second">{L.reservasN(2)}</span>
            </span>
            <span className="text-[13px] font-bold text-pmamber">$36.000</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-line bg-white px-3 py-2.5">
            <span className="flex items-center gap-2 text-[11px] font-bold text-inkstrong">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pmred/10 text-[10px] text-pmred">✕</span>
              {L.fallidos} <span className="font-medium text-second">{L.reservasN(0)}</span>
            </span>
            <span className="text-[13px] font-bold text-second">$0</span>
          </div>
        </div>
        <div className="mt-2.5 overflow-hidden rounded-xl border border-line bg-white">
          {L.movs.map(([c, m]) => (
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

/* ── Finanzas: réplica del Dashboard de Arriendos ───────────── */

const TENDENCIA = [28, 34, 40, 36, 42, 38, 44, 40, 46, 52, 88, 58];
const KPI_VALS = [86000, 524000, 2104000, 8936000];
const KPI_COLORS = ["text-pmgreen", "text-pmblue", "text-pmpurple", "text-pmorange"];
const CANCHA_VALS = [
  ["$616.000", 100],
  ["$480.000", 78],
  ["$468.000", 76],
  ["$374.000", 61],
];

function MockFinanzas() {
  const { lang } = useLang();
  const L = MK[lang].finanzas;
  return (
    <PanelChrome active="Canchas">
      <div className="bg-surface/70 p-3">
        <div className="px-1">
          <p className="text-[12px] font-bold text-inkstrong">{L.titulo}</p>
          <p className="text-[9px] text-second">{L.sub}</p>
        </div>
        <div className="mt-2.5 grid grid-cols-4 gap-1.5">
          {L.kpis.map(([label, nota], i) => (
            <div key={label} className="rounded-xl border border-line bg-white px-2 py-1.5">
              <p className="text-[7.5px] font-medium text-second">{label}</p>
              <CountUp to={KPI_VALS[i]} prefix="$" className={`mt-0.5 block text-[11px] leading-tight font-bold ${KPI_COLORS[i]}`} />
              <p className="text-[7px] font-semibold text-pmgreen">{nota}</p>
            </div>
          ))}
        </div>

        <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-white p-2.5">
            <p className="text-[9px] font-bold text-inkstrong">{L.porCancha}</p>
            <div className="mt-1.5 flex flex-col gap-1.5">
              {L.canchas.map((c, i) => (
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
            <p className="text-[9px] font-bold text-inkstrong">{L.tendencia}</p>
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
              <span className="text-second">{L.exportar}</span>
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

/* ── Competencias: réplica de Torneos (wizard 7 pasos + cards) ── */

function MockTorneos() {
  const { lang } = useLang();
  const L = MK[lang].torneos;
  return (
    <PanelChrome active="Torneos">
      <div className="bg-surface/70 p-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <p className="text-[12px] font-bold text-inkstrong">{L.titulo}</p>
            <p className="text-[9px] text-second">{L.sub}</p>
          </div>
          <span className="rounded-lg bg-pmlime px-2.5 py-1 text-[9px] font-bold text-white shadow-sm">
            {L.crear}
          </span>
        </div>

        {/* Wizard de creación — paso a paso como el real */}
        <div className="mt-2.5 rounded-xl border border-line bg-white p-2.5">
          <div className="flex items-center justify-between text-[8.5px]">
            <p className="font-bold text-inkstrong">{L.wizardTitulo}</p>
            <p className="font-semibold text-second">{L.completado}</p>
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
            {L.pasos.map((s, i) => (
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
              {L.formatos[0]}
            </span>
            <span className="rounded-lg border border-line px-1 py-1.5 text-second">{L.formatos[1]}</span>
            <span className="rounded-lg border border-line px-1 py-1.5 text-second">{L.formatos[2]}</span>
          </div>
        </div>

        {/* Cards de torneos como el listado real */}
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          <div className="rounded-xl border border-line bg-white p-2.5">
            <div className="flex items-center justify-between">
              <p className="text-[9.5px] font-bold text-inkstrong">{L.copa}</p>
              <span className="rounded-full bg-pmblue/10 px-1.5 py-0.5 text-[7px] font-bold text-pmblue">
                {L.inscripciones}
              </span>
            </div>
            <p className="mt-0.5 text-[8px] text-second">{L.copaSub}</p>
            <p className="mt-1 text-[8px] text-second">{L.copaInfo}</p>
            <p className="mt-1 rounded bg-pmamber/10 px-1.5 py-0.5 text-[7.5px] font-semibold text-pmamber">
              {L.cierra}
            </p>
          </div>
          <div className="rounded-xl border border-line bg-white p-2.5">
            <div className="flex items-center justify-between">
              <p className="text-[9.5px] font-bold text-inkstrong">{L.mexicano}</p>
              <span className="rounded-full bg-pmgreen/10 px-1.5 py-0.5 text-[7px] font-bold text-pmgreen">
                {L.enCurso}
              </span>
            </div>
            <p className="mt-0.5 text-[8px] text-second">{L.mexSub}</p>
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
              {L.progreso} <span className="font-bold text-pmgreen">{L.control}</span>
            </p>
          </div>
        </div>
      </div>
    </PanelChrome>
  );
}

/* ── Réplica fiel de MatchPro TV ────────────────────────────── */

const TV_CHIP_STYLE = {
  Libre: "bg-[#22c55e]/15 text-[#4ade80]",
  Mantención: "bg-[#f59e0b]/15 text-[#fbbf24]",
  "En juego": "bg-[#38bdf8]/15 text-[#7dd3fc]",
  Programado: "bg-[#a855f7]/20 text-[#c084fc]",
};

function useTvModo() {
  const prefersReduced = useReducedMotion();
  const [modo, setModo] = useState(0);
  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => setModo((m) => (m + 1) % 3), 4500);
    return () => clearInterval(id);
  }, [prefersReduced]);
  return modo;
}

/* QR falso pero anatómicamente correcto: quiet zone, finders con
   separador, alignment pattern, timing pattern y PRNG. */
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

function FakeQR({ className = "", light = "#5eead4", dark = "#0f2a52" }) {
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

function ModuloTV({ icon, iconBg, title, children, className = "" }) {
  return (
    <div className={`rounded-md bg-white/[0.05] p-1.5 ring-1 ring-white/10 ${className}`}>
      <p className="flex items-center gap-1 text-[6.5px] font-bold text-white">
        <span className={`flex h-3 w-3 items-center justify-center rounded-[4px] text-[6px] ${iconBg}`} aria-hidden="true">
          {icon}
        </span>
        {title}
      </p>
      {children}
    </div>
  );
}

function HeaderTV({ L }) {
  return (
    <div className="flex items-center justify-between pb-1.5">
      <p className="flex items-center gap-1.5 text-[9px] font-semibold text-white">
        <img src={isotipo} alt="" className="h-3 w-auto" aria-hidden="true" />
        {L.hola}
      </p>
      <p className="flex items-center gap-2 text-[8px] text-white/70">
        ☀️ 19°C <span className="font-mono text-[11px] font-bold text-white">18:58</span>
      </p>
    </div>
  );
}

function ModEstadoCanchas({ L, compact }) {
  const visibles = compact ? L.canchas.slice(0, 4) : L.canchas;
  return (
    <ModuloTV icon="🎾" iconBg="bg-teal-500/70" title={L.canchasT} className="h-full">
      <div className={`mt-1 grid gap-1 ${compact ? "grid-cols-2" : "grid-cols-3"}`}>
        {visibles.map(([c, dep, est, extra]) => (
          <div key={c} className="rounded-sm bg-white/[0.05] px-1 py-[3px]">
            <div className="flex items-center justify-between">
              <p className="text-[6px] leading-tight font-bold text-white">{c}</p>
              <span className={`rounded-full px-1 py-px text-[4.5px] font-bold ${TV_CHIP_STYLE[est]}`}>
                {L.chips[est]}
              </span>
            </div>
            <p className="text-[5px] text-white/45">
              {dep} · <span className="text-white/60">{extra}</span>
            </p>
          </div>
        ))}
      </div>
    </ModuloTV>
  );
}

function ModCopa({ L }) {
  return (
    <ModuloTV icon="🏆" iconBg="bg-purple-500/70" title={L.copaT} className="h-full">
      <div className="mt-0.5 flex items-center justify-between">
        <p className="text-[5px] text-white/45">{L.copaSub}</p>
        <p className="text-[5px] font-bold text-[#c084fc]">{L.copaJugados}</p>
      </div>
      <div className="mt-1 flex flex-col gap-1">
        {L.copaMatches.map(([c, m]) => (
          <div key={c} className="rounded-sm bg-white/[0.05] px-1 py-[3px]">
            <div className="flex items-center justify-between">
              <p className="text-[5px] font-bold text-[#c084fc]">{c}</p>
              <span className={`rounded-full px-1 py-px text-[4.5px] font-bold ${TV_CHIP_STYLE.Programado}`}>
                {L.chips.Programado}
              </span>
            </div>
            <p className="text-[5.5px] font-semibold text-white">{m}</p>
          </div>
        ))}
      </div>
    </ModuloTV>
  );
}

const POS_FILAS = [
  ["01", "V. Contreras", "2.840", "▲ +3"],
  ["02", "M. Salgado", "2.712", "▲ +1"],
  ["03", "A. Baeza", "2.690", "▼ -1"],
  ["04", "C. Riffo", "2.544", "—"],
  ["05", "D. Aravena", "2.410", "▲ +2"],
];

function ModPosiciones({ L, big }) {
  const filas = POS_FILAS.slice(0, big ? 5 : 3);
  return (
    <ModuloTV icon="🏆" iconBg="bg-yellow-500/70" title={big ? L.posTBig : L.posT} className="flex h-full flex-col">
      <div className={`flex flex-1 flex-col ${big ? "mt-0.5 justify-around" : "mt-1 justify-start gap-[3px]"}`}>
        {filas.map(([p, n, pts, tr], i) => (
          <p
            key={p}
            className={`flex items-center justify-between text-white ${
              big ? `text-[8px] ${i < filas.length - 1 ? "border-b border-white/[0.07] pb-[3px]" : ""}` : "text-[6px]"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span className="font-mono text-white/40 italic"># {p}</span>
              {big && (
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white/10 text-[5px] font-bold">
                  {n.split(" ")[1]?.slice(0, 2).toUpperCase()}
                </span>
              )}
              <span className="font-semibold">{n}</span>
              {big && <span className="text-[5.5px] text-white/40">{L.posStats[i]}</span>}
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className={`flex justify-center rounded-full bg-limebrand font-mono font-bold text-limeink ${
                  big ? "w-11 py-px text-[6px]" : "w-8 py-px text-[5px]"
                }`}
              >
                {pts}
              </span>
              <span
                className={`font-mono ${big ? "w-7 text-[6.5px]" : "w-6 text-[5.5px]"} ${
                  tr.startsWith("▲") ? "text-[#4ade80]" : tr.startsWith("▼") ? "text-[#f87171]" : "text-white/40"
                }`}
              >
                {tr}
              </span>
            </span>
          </p>
        ))}
      </div>
    </ModuloTV>
  );
}

function ModMarcador({ L }) {
  return (
    <ModuloTV icon="🎾" iconBg="bg-sky-500/70" title={L.marcadorT} className="h-full">
      <div className="mt-1 flex flex-col gap-[3px]">
        {[
          ["L. Gutiérrez", ["6", "4", "40"], true],
          ["C. Álvarez", ["4", "6", "30"], false],
        ].map(([n, sets, gana]) => (
          <p
            key={n}
            className={`flex items-center justify-between rounded-sm px-1 py-[3px] text-[6px] ${
              gana ? "bg-white/[0.08] font-bold text-white" : "bg-white/[0.03] text-white/70"
            }`}
          >
            <span>{n}</span>
            <span className="flex gap-1 font-mono">
              {sets.map((s, i) => (
                <span key={i} className={i === 2 ? "text-limebrand" : ""}>
                  {s}
                </span>
              ))}
            </span>
          </p>
        ))}
        <div className="flex items-center justify-between">
          <p className="text-[4.5px] tracking-widest text-white/40 uppercase">{L.set3}</p>
          <p className="text-[4.5px] text-white/40">{L.duracion}</p>
        </div>
      </div>
    </ModuloTV>
  );
}

function ModCumple({ L }) {
  return (
    <ModuloTV icon="🎁" iconBg="bg-pink-500/70" title={L.cumpleT} className="h-full">
      <div className="mt-1 flex flex-col gap-1">
        {L.cumples.map(([ini, n, f]) => (
          <div key={n} className="flex items-center gap-1.5 rounded-sm bg-white/[0.05] px-1 py-[3px]">
            <span className="flex h-3 w-3 items-center justify-center rounded-full bg-pink-500/30 text-[4.5px] font-bold text-white">
              {ini}
            </span>
            <span>
              <p className="text-[5.5px] leading-tight font-semibold text-white">{n}</p>
              <p className="text-[4.5px] text-white/45">{f}</p>
            </span>
          </div>
        ))}
      </div>
    </ModuloTV>
  );
}

function ModExtras({ L }) {
  return (
    <div className="flex h-full flex-col gap-1.5">
      <ModuloTV icon="📣" iconBg="bg-orange-500/70" title={L.sponsorsT} className="flex-1">
        <div className="mt-0.5 flex flex-col gap-[2px] text-[5.5px]">
          <p className="flex justify-between">
            <span className="font-extrabold tracking-wide text-white/85">BABOLAT</span>
            <span className="rounded-full bg-yellow-500/20 px-1 text-[4.5px] font-bold text-yellow-300">{L.oro}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-bold tracking-wide text-white/60">HEAD · WILSON</span>
            <span className="rounded-full bg-white/10 px-1 text-[4.5px] font-bold text-white/50">{L.plata}</span>
          </p>
        </div>
      </ModuloTV>
      <ModuloTV icon="▦" iconBg="bg-sky-500/70" title={L.qrT} className="flex-1">
        <div className="mt-0.5 flex items-center gap-1.5">
          <FakeQR className="h-6 w-6 rounded-[2px]" light="#cbd5e1" dark="#0c1c38" />
          <p className="text-[5px] leading-tight text-white/50">{L.qrSub}</p>
        </div>
      </ModuloTV>
    </div>
  );
}

/* La grilla persiste entre modos: módulos como LISTA con claves
   estables — layout anima posición/tamaño; AnimatePresence maneja
   el que entra (Marcador) y el que sale (Cumpleaños). */
function GridDinamica({ L, rotado }) {
  const mods = rotado
    ? [
        { id: "posiciones", span: "col-span-2", el: <ModPosiciones L={L} big /> },
        { id: "canchas", span: "", el: <ModEstadoCanchas L={L} compact /> },
        { id: "marcador", span: "", el: <ModMarcador L={L} /> },
        { id: "copa", span: "", el: <ModCopa L={L} /> },
        { id: "extras", span: "", el: <ModExtras L={L} /> },
      ]
    : [
        { id: "canchas", span: "col-span-2", el: <ModEstadoCanchas L={L} /> },
        { id: "copa", span: "", el: <ModCopa L={L} /> },
        { id: "posiciones", span: "", el: <ModPosiciones L={L} /> },
        { id: "cumple", span: "", el: <ModCumple L={L} /> },
        { id: "extras", span: "", el: <ModExtras L={L} /> },
      ];

  return (
    <div className="flex h-full flex-col">
      <HeaderTV L={L} />
      <div className="grid flex-1 grid-cols-3 grid-rows-2 gap-1.5">
        <AnimatePresence initial={false} mode="popLayout">
          {mods.map(({ id, span, el }) => (
            <motion.div
              key={id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ layout: ladderSpring, duration: 0.3, ease: EASE }}
              className={span}
            >
              {el}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <p className="pt-1 text-right text-[5px] font-semibold text-white/35">
        {L.powered} <span className="text-white/60">MatchPro TV</span>
      </p>
    </div>
  );
}

/* Modo vinculación: réplica de la pantalla real de activación */
function CodigoVinculacion({ L }) {
  return (
    <div className="flex h-full flex-col px-2">
      <p className="flex items-center justify-center gap-1.5 pt-1.5 pb-1">
        <img src={isotipo} alt="" className="h-4 w-auto" aria-hidden="true" />
        <span className="text-[11px] font-extrabold tracking-tight text-white">
          MATCH<span className="font-medium italic">PRO</span> TV
        </span>
      </p>
      <div className="flex flex-1 items-stretch justify-center gap-5">
        <div className="flex max-w-[52%] flex-col justify-center">
          <p className="text-[14px] font-bold text-white">{L.vincula}</p>
          <p className="mt-1 text-[8px] leading-relaxed text-white/60">
            {L.escanea1}
            <br />
            <span className="font-mono text-[8.5px] text-[#5eead4]">https://getmatchpro.com/activate</span>
          </p>
          <div className="tv-glow mt-2.5 inline-block rounded-xl bg-[#1d3a6e]/70 px-4 py-2.5 ring-1 ring-[#2dd4bf]/30">
            <p className="text-[6px] tracking-[0.24em] text-white/60 uppercase">{L.codigoDe}</p>
            <div className="mt-1 flex gap-[3px] font-mono text-[26px] leading-none font-bold text-limebrand">
              {["G", "P", "M", "-", "Y", "M", "A"].map((c, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.06, duration: 0.25 }}
                >
                  {c}
                </motion.span>
              ))}
            </div>
          </div>
          <p className="mt-1.5 text-[7px] text-white/50">{L.expira}</p>
        </div>
        <div className="tv-glow flex flex-col items-center justify-center self-center rounded-xl bg-[#0f2a52]/80 p-3 ring-1 ring-[#2dd4bf]/40">
          <FakeQR className="h-[5.25rem] w-[5.25rem] rounded-md" />
          <p className="mt-1.5 text-[6.5px] text-white/60">{L.celular}</p>
        </div>
      </div>
      <div className="flex items-center justify-between pb-1">
        <p className="flex items-center gap-1 text-[7px] font-semibold text-[#4ade80]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" /> {L.conectado}
        </p>
        <p className="text-[7px] text-white/40">
          {L.powered} <span className="font-semibold text-white/70">MatchPro TV</span>
        </p>
      </div>
    </div>
  );
}

function MockTV() {
  const { t, lang } = useLang();
  const L = MK[lang].tv;
  const modo = useTvModo();

  return (
    <div className="w-full">
      {/* TV colgada: sin base — solo el marco y la sombra en la pared */}
      <div className="rounded-lg border-[7px] border-[#1b1b1f] shadow-2xl shadow-black/50 ring-1 ring-black">
        <div className="tv-screen relative aspect-video overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {modo === 2 ? (
              <motion.div
                key="vinculacion"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="absolute inset-0 p-2"
              >
                <CodigoVinculacion L={L} />
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="absolute inset-0 p-2.5"
              >
                <GridDinamica L={L} rotado={modo === 1} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Control segmentado: un solo contenedor, tres estados */}
      <div
        className="mx-auto mt-4 flex w-fit max-w-full rounded-full border border-line bg-white p-1 shadow-sm"
        role="tablist"
        aria-label={t.operacion.tvAria}
      >
        {t.operacion.tvModos.map((chip, i) => (
          <span
            key={chip}
            role="tab"
            aria-selected={i === modo}
            className={`rounded-full px-3 py-1.5 text-[10px] font-semibold whitespace-nowrap transition-colors duration-300 sm:px-4 sm:text-[11px] ${
              i === modo ? "bg-inkstrong text-limebrand" : "text-second"
            }`}
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── 5 · Operación — scroll-telling en desktop ──────────────── */

function StepText({ eyebrow, t, d, pill, dim = false }) {
  return (
    <div className={`max-w-md transition-opacity duration-300 ${dim ? "opacity-35" : "opacity-100"}`}>
      <p className="eyebrow text-tealbrand">{eyebrow}</p>
      <h3 className="mt-2 text-2xl font-bold tracking-tight text-inkstrong sm:text-3xl">{t}</h3>
      <p className="mt-3 leading-relaxed text-second">{d}</p>
      <p className="mt-4 inline-block rounded-full bg-limetint px-4 py-1.5 text-sm font-semibold text-limeink">
        {pill}
      </p>
    </div>
  );
}

/* Resplandor de fondo que acompaña al paso activo */
const GLOW_POR_PASO = [
  { left: "70%", top: "6%", backgroundColor: "rgba(52, 211, 153, 0.20)" },
  { left: "8%", top: "24%", backgroundColor: "rgba(187, 244, 81, 0.22)" },
  { left: "72%", top: "44%", backgroundColor: "rgba(130, 232, 150, 0.20)" },
  { left: "6%", top: "62%", backgroundColor: "rgba(52, 211, 153, 0.16)" },
  { left: "70%", top: "82%", backgroundColor: "rgba(187, 244, 81, 0.20)" },
];

export function Operacion() {
  const { t } = useLang();
  const [active, setActive] = useState(0);
  const MOCKS = [<MockReservas key="r" />, <MockPagos key="p" />, <MockTorneos key="t" />, <MockTV key="tv" />, <MockFinanzas key="f" />];
  const pasos = t.operacion.pasos.map((s, i) => ({ ...s, mock: MOCKS[i] }));

  return (
    /* overflow-x-clip (NO overflow-hidden): hidden crea un contenedor
       de scroll y mata el position:sticky del panel */
    <section id="producto" className="relative overflow-x-clip bg-surface py-20 sm:py-24">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute hidden h-[34rem] w-[34rem] rounded-full blur-[110px] lg:block"
        animate={GLOW_POR_PASO[active]}
        transition={{ duration: 0.9, ease: EASE }}
      />
      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow={t.operacion.eyebrow}
          title={<AccentTitle parts={t.operacion.title} />}
          sub={t.operacion.sub}
        />

        {/* Desktop: texto avanza, el panel se queda y cambia */}
        <div className="mt-10 hidden gap-14 lg:grid lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            {pasos.map((s, i) => (
              <motion.div
                key={s.eyebrow}
                className="flex min-h-[62vh] items-center"
                onViewportEnter={() => setActive(i)}
                viewport={{ margin: "-46% 0px -46% 0px" }}
              >
                <StepText {...s} dim={active !== i} />
              </motion.div>
            ))}
          </div>
          <div>
            <div className="sticky top-24 flex min-h-[70vh] items-center">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 28, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -28, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="w-full"
                >
                  {pasos[active].mock}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile / tablet: apilado simple */}
        <div className="mt-12 flex flex-col gap-16 lg:hidden">
          {pasos.map(({ mock, ...s }) => (
            <Reveal key={s.eyebrow} className="flex flex-col gap-6">
              <div>{mock}</div>
              <StepText {...s} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 6 · Competencia — escalerilla fiel al producto ─────────── */

const LADDER_BASE = [
  { id: "vc", name: "V. Contreras", pts: 2840, pct: "78%" },
  { id: "ms", name: "M. Salgado", pts: 2712, pct: "71%" },
  { id: "ab", name: "A. Baeza", pts: 2690, pct: "69%" },
  { id: "cr", name: "C. Riffo", pts: 2544, pct: "64%" },
  { id: "da", name: "D. Aravena", pts: 2410, pct: "58%" },
];

/* Top 1/2/3 como el producto: oro, plata, bronce */
const POS_STYLE = ["bg-pmamber text-white", "bg-line text-inkstrong", "bg-pmorange/80 text-white"];

function EscalerillaViva() {
  const { lang } = useLang();
  const L = MK[lang].escalerilla;
  const prefersReduced = useReducedMotion();
  const [rows, setRows] = useState(LADDER_BASE);
  const [moved, setMoved] = useState(null);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => {
      setRows((prev) => {
        const next = [...prev];
        const i = 3; // C. Riffo sube una posición
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
            {L.titulo}
            <span className="rounded-full bg-pmamber/15 px-1.5 py-0.5 text-[8px] font-bold text-pmamber">
              {L.predeterminada}
            </span>
            <span className="rounded-full bg-pmgreen/10 px-1.5 py-0.5 text-[8px] font-bold text-pmgreen">
              {L.patrocina}
            </span>
          </p>
          <p className="mt-0.5 text-[10px] text-second">{L.sub}</p>
        </div>
        <p className="eyebrow font-mono text-tealbrand">TrueRank</p>
      </div>
      <div className="mt-3 grid grid-cols-[2rem_1fr_3.2rem_2.6rem] gap-2 px-3 text-[8px] font-semibold tracking-wide text-second uppercase">
        {L.cols.map((c, i) => (
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
                <span className="rounded-full bg-pmlime px-2 py-0.5 text-[9px] font-bold text-white">
                  {L.subioUna}
                </span>
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

export function Competencia() {
  const { t } = useLang();
  return (
    <section className="border-y border-line bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow={t.competencia.eyebrow}
          title={<AccentTitle parts={t.competencia.title} />}
          sub={t.competencia.sub}
        />
        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <EscalerillaViva />
            <p className="mt-4 text-center text-sm text-second">
              {t.competencia.caption1}
              <span className="font-semibold text-inkstrong">{t.competencia.caption2}</span>.
            </p>
          </Reveal>
          <Reveal staggered className="flex flex-col gap-6">
            {t.competencia.items.map(([titulo, d]) => (
              <RevealItem key={titulo} className="flex gap-4">
                <span
                  className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-limetint text-limeink"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div>
                  <h3 className="font-bold text-inkstrong">{titulo}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-second">{d}</p>
                </div>
              </RevealItem>
            ))}

            {/* Mini-réplicas: gestión de desafíos + torneo en curso */}
            <RevealItem className="font-product grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-surface/50 p-4">
                <p className="text-[9px] font-medium text-second">{t.competencia.miniDesafios}</p>
                <p className="mt-1 text-2xl font-bold text-pmgreen">97%</p>
                <p className="text-[11px] font-semibold text-inkstrong">{t.competencia.miniTasa}</p>
                <p className="mt-1 text-[11px] text-second">{t.competencia.miniCompletados}</p>
              </div>
              <div className="rounded-2xl border border-line bg-surface/50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-medium text-second">{t.competencia.miniTorneo}</p>
                  <span className="rounded-full bg-pmgreen/10 px-2 py-0.5 text-[9px] font-bold text-pmgreen">
                    {t.competencia.miniVivo}
                  </span>
                </div>
                <p className="mt-1 text-sm font-bold text-inkstrong">Mexicano Semanal</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white ring-1 ring-line">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "67%" }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-pmgreen"
                  />
                </div>
                <p className="mt-1.5 text-[10px] text-second">{t.competencia.miniProgreso}</p>
              </div>
            </RevealItem>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── 7 · Caso real ──────────────────────────────────────────────
   TODO(publicación): TODO el contenido de esta sección es
   PLACEHOLDER (club y persona ficticios). Reemplazar por un
   cliente real, con autorización escrita, foto real y una
   métrica medida. NO publicar este placeholder.               */

export function Caso() {
  const { t } = useLang();
  return (
    <section className="tint-lime py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-5">
        <Reveal>
          <figure className="relative overflow-hidden rounded-3xl border border-line bg-white p-8 shadow-xl shadow-inkstrong/5 sm:p-12">
            <p className="eyebrow text-limefg">{t.caso.eyebrow}</p>
            <blockquote className="mt-4 text-xl leading-relaxed font-medium text-balance text-inkstrong sm:text-2xl">
              {t.caso.quote}
            </blockquote>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
              <figcaption className="flex items-center gap-4">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-limetint text-base font-extrabold text-limeink"
                  aria-hidden="true"
                >
                  RM
                </span>
                <span>
                  <span className="block font-bold text-inkstrong">{t.caso.nombre}</span>
                  <span className="block text-sm text-second">{t.caso.cargo}</span>
                </span>
              </figcaption>
              <p className="font-mono text-3xl font-semibold text-inkstrong">
                +18%{" "}
                <span className="block font-sans text-xs font-medium text-second">{t.caso.metrica}</span>
              </p>
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
