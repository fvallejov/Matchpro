// ─────────────────────────────────────────────────────────────
// Réplica fiel de MatchPro TV — heredada de clubmanager-landing,
// ES-only, personalizada con el club activo.
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { EASE, ladderSpring } from "../motion";
import { useClub } from "../club";
import { Icon } from "../icons";
import qrDark from "../assets/qr-dark.svg";
import isotipo from "../assets/isotipo.svg";

const TV_CHIP_STYLE = {
  Libre: "bg-[#22c55e]/15 text-[#4ade80]",
  Mantención: "bg-[#f59e0b]/15 text-[#fbbf24]",
  "En juego": "bg-[#38bdf8]/15 text-[#7dd3fc]",
  Programado: "bg-[#a855f7]/20 text-[#c084fc]",
};

const CANCHAS_TV = [
  ["Cancha Central", "Tenis", "Mantención", "Vuelve 09:00"],
  ["Cancha 2", "Tenis", "En juego", "L. Gutiérrez · Set 3"],
  ["Cancha 3", "Tenis", "Libre", "Próx. 19:00"],
  ["Pádel 1", "Pádel", "En juego", "C. Riffo · 18:00–19:30"],
  ["Pádel 2", "Pádel", "Libre", "$25.000/h tarifa alta"],
  ["Cancha 4", "Tenis", "Libre", "Iluminación ✓"],
];

const COPA_MATCHES = [
  ["Cancha 2 · 19:00", "L. Gutiérrez vs C. Álvarez"],
  ["Cancha 3 · 19:00", "G. Pérez vs A. Valenzuela"],
  ["Cancha 4 · 20:30", "C. Paredes vs P. Núñez"],
];

const POS_STATS = ["24 PJ · 78%", "21 PJ · 71%", "23 PJ · 69%", "19 PJ · 64%", "17 PJ · 58%"];

const CUMPLES = [
  ["VC", "V. Contreras", "Hoy · 38 años"],
  ["MS", "M. Salgado", "Sáb 28 · 41 años"],
];

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

function ModuloTV({ icon, iconBg, title, children, className = "" }) {
  return (
    <div className={`rounded-md bg-white/[0.05] p-1.5 ring-1 ring-white/10 ${className}`}>
      <p className="flex items-center gap-1 text-[6.5px] font-bold text-white">
        <span className={`flex h-3 w-3 items-center justify-center rounded-[4px] text-white ${iconBg}`} aria-hidden="true">
          <Icon name={icon} className="h-2 w-2" />
        </span>
        {title}
      </p>
      {children}
    </div>
  );
}

function HeaderTV({ club }) {
  return (
    <div className="flex items-center justify-between pb-1.5">
      <p className="flex items-center gap-1.5 text-[9px] font-semibold text-white">
        <img src={isotipo} alt="" className="h-3 w-auto" aria-hidden="true" />
        Hola, {club.nombre}
      </p>
      <p className="flex items-center gap-2 text-[8px] text-white/70">
        ☀️ 19°C <span className="font-mono text-[11px] font-bold text-white">18:58</span>
      </p>
    </div>
  );
}

function ModEstadoCanchas({ compact }) {
  const visibles = compact ? CANCHAS_TV.slice(0, 4) : CANCHAS_TV;
  return (
    <ModuloTV icon="ball" iconBg="bg-teal-500/70" title="Estado de Canchas" className="h-full">
      <div className={`mt-1 grid gap-1 ${compact ? "grid-cols-2" : "grid-cols-3"}`}>
        {visibles.map(([c, dep, est, extra]) => (
          <div key={c} className="rounded-sm bg-white/[0.05] px-1 py-[3px]">
            <div className="flex items-center justify-between">
              <p className="text-[6px] leading-tight font-bold text-white">{c}</p>
              <span className={`rounded-full px-1 py-px text-[4.5px] font-bold ${TV_CHIP_STYLE[est]}`}>{est}</span>
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

function ModCopa({ club }) {
  return (
    <ModuloTV icon="trophy" iconBg="bg-purple-500/70" title={`Copa ${club.corto}`} className="h-full">
      <div className="mt-0.5 flex items-center justify-between">
        <p className="text-[5px] text-white/45">Eliminación Simple · Cuartos de final</p>
        <p className="text-[5px] font-bold text-[#c084fc]">6/8 jugados</p>
      </div>
      <div className="mt-1 flex flex-col gap-1">
        {COPA_MATCHES.map(([c, m]) => (
          <div key={c} className="rounded-sm bg-white/[0.05] px-1 py-[3px]">
            <div className="flex items-center justify-between">
              <p className="text-[5px] font-bold text-[#c084fc]">{c}</p>
              <span className={`rounded-full px-1 py-px text-[4.5px] font-bold ${TV_CHIP_STYLE.Programado}`}>
                Programado
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

function ModPosiciones({ big }) {
  const filas = POS_FILAS.slice(0, big ? 5 : 3);
  return (
    <ModuloTV
      icon="trophy"
      iconBg="bg-yellow-500/70"
      title={big ? "Tabla de Posiciones · Ranking en vivo" : "Tabla de Posiciones"}
      className="flex h-full flex-col"
    >
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
              {big && <span className="text-[5.5px] text-white/40">{POS_STATS[i]}</span>}
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

function ModMarcador() {
  return (
    <ModuloTV icon="ball" iconBg="bg-sky-500/70" title="Marcador en Vivo · Cancha 2" className="h-full">
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
          <p className="text-[4.5px] tracking-widest text-white/40 uppercase">Set 3 · en juego</p>
          <p className="text-[4.5px] text-white/40">⏱ 1:13 · 132 pts</p>
        </div>
      </div>
    </ModuloTV>
  );
}

function ModCumple() {
  return (
    <ModuloTV icon="gift" iconBg="bg-pink-500/70" title="Próximos Cumpleaños" className="h-full">
      <div className="mt-1 flex flex-col gap-1">
        {CUMPLES.map(([ini, n, f]) => (
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

function ModExtras() {
  return (
    <div className="flex h-full flex-col gap-1.5">
      <ModuloTV icon="megaphone" iconBg="bg-orange-500/70" title="Sponsors" className="flex-1">
        <div className="mt-0.5 flex flex-col gap-[2px] text-[5.5px]">
          <p className="flex justify-between">
            <span className="font-extrabold tracking-wide text-white/85">BABOLAT</span>
            <span className="rounded-full bg-yellow-500/20 px-1 text-[4.5px] font-bold text-yellow-300">ORO</span>
          </p>
          <p className="flex justify-between">
            <span className="font-bold tracking-wide text-white/60">HEAD · WILSON</span>
            <span className="rounded-full bg-white/10 px-1 text-[4.5px] font-bold text-white/50">PLATA</span>
          </p>
        </div>
      </ModuloTV>
      <ModuloTV icon="qr" iconBg="bg-sky-500/70" title="QR Reservas" className="flex-1">
        <div className="mt-0.5 flex items-center gap-1.5">
          <img src={qrDark} alt="" className="h-6 w-6 rounded-[2px]" aria-hidden="true" />
          <p className="text-[5px] leading-tight text-white/50">Escanea y reserva desde tu celular</p>
        </div>
      </ModuloTV>
    </div>
  );
}

function GridDinamica({ club, rotado }) {
  const mods = rotado
    ? [
        { id: "posiciones", span: "col-span-2", el: <ModPosiciones big /> },
        { id: "canchas", span: "", el: <ModEstadoCanchas compact /> },
        { id: "marcador", span: "", el: <ModMarcador /> },
        { id: "copa", span: "", el: <ModCopa club={club} /> },
        { id: "extras", span: "", el: <ModExtras /> },
      ]
    : [
        { id: "canchas", span: "col-span-2", el: <ModEstadoCanchas /> },
        { id: "copa", span: "", el: <ModCopa club={club} /> },
        { id: "posiciones", span: "", el: <ModPosiciones /> },
        { id: "cumple", span: "", el: <ModCumple /> },
        { id: "extras", span: "", el: <ModExtras /> },
      ];

  return (
    <div className="flex h-full flex-col">
      <HeaderTV club={club} />
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
        Powered by <span className="text-white/60">MatchPro TV</span>
      </p>
    </div>
  );
}

function CodigoVinculacion() {
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
          <p className="text-[14px] font-bold text-white">Vincula tu pantalla</p>
          <p className="mt-1 text-[8px] leading-relaxed text-white/60">
            Escanea el código QR o ingresa el código en
            <br />
            <span className="font-mono text-[8.5px] text-[#5eead4]">https://getmatchpro.com/activate</span>
          </p>
          <div className="tv-glow mt-2.5 inline-block rounded-xl bg-[#1d3a6e]/70 px-4 py-2.5 ring-1 ring-[#2dd4bf]/30">
            <p className="text-[6px] tracking-[0.24em] text-white/60 uppercase">Código de activación</p>
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
          <p className="mt-1.5 text-[7px] text-white/50">◷ El código expira en 14:58</p>
        </div>
        <div className="tv-glow flex flex-col items-center justify-center self-center rounded-xl bg-[#0f2a52]/80 p-3 ring-1 ring-[#2dd4bf]/40">
          <img src={qrDark} alt="" className="h-[5.25rem] w-[5.25rem] rounded-md" aria-hidden="true" />
          <p className="mt-1.5 text-[6.5px] text-white/60">Escanea con tu celular</p>
        </div>
      </div>
      <div className="flex items-center justify-between pb-1">
        <p className="flex items-center gap-1 text-[7px] font-semibold text-[#4ade80]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" /> Conectado
        </p>
        <p className="text-[7px] text-white/40">
          Powered by <span className="font-semibold text-white/70">MatchPro TV</span>
        </p>
      </div>
    </div>
  );
}

const TV_MODOS = ["Grid editable", "Rotación automática", "Código de 6 dígitos"];

export function MockTV() {
  const club = useClub();
  const modo = useTvModo();

  return (
    <div className="w-full">
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
                <CodigoVinculacion />
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
                <GridDinamica club={club} rotado={modo === 1} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div
        className="mx-auto mt-3 flex w-fit max-w-full items-center gap-1.5"
        role="tablist"
        aria-label="Modos de MatchPro TV"
      >
        {TV_MODOS.map((chip, i) => (
          <span
            key={chip}
            role="tab"
            aria-selected={i === modo}
            className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] whitespace-nowrap transition-colors duration-300 ${
              i === modo ? "bg-white/10 font-bold text-limebrand ring-1 ring-white/15" : "text-nightsecond"
            }`}
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}
