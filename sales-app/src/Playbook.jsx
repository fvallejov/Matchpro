// ─────────────────────────────────────────────────────────────
// PLAYBOOK DE PRECIOS — solo uso interno (equipo MatchPro).
// La superficie para explicar CÓMO cobramos y POR QUÉ: planes y
// tramos, anatomía de la comisión con su piso, bandas sancionadas,
// flujo propuesta → contrapropuesta y los principios de estrategia.
//
// Se alimenta 100% de pricing.js (fuente única): si el modelo
// cambia, esta página cambia sola. NUNCA visible en modo cliente:
// no está en el índice del deck ni viaja en ningún link.
// ─────────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import {
  PLANES,
  COMISION,
  COMISION_PISO,
  NEGOCIACION,
  DESC_ANUAL,
  UF_CLP,
  TICKET_DEFAULT,
  clp,
  ufa,
  comisionTx,
} from "./pricing";
import { Icon } from "./icons";

const pctFmt = (p) => `${Math.round(p * 1000) / 10}%`;

function Chip({ children, amber = false }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-[12px] font-bold ${
        amber ? "bg-pmamber/15 text-pmamber ring-1 ring-pmamber/30" : "bg-limebrand/15 text-limebrand"
      }`}
    >
      {children}
    </span>
  );
}

function Titulo({ n, children }) {
  return (
    <p className="flex items-baseline gap-3 font-mono text-[11px] font-semibold tracking-[0.2em] text-tealbrand uppercase">
      <span className="text-limebrand">{n}</span> {children}
    </p>
  );
}

const PRINCIPIOS = [
  [
    "coins",
    "Vendemos el NETO, no la comisión",
    "La comisión se descuenta de lo recaudado antes de transferir — nunca es una factura aparte. En la reunión se dice \"te transferimos el 9X%\", no \"te cobramos 4%\". Mismo número, otra psicología.",
  ],
  [
    "tag",
    "El precio de lista SIEMPRE visible",
    "Toda concesión se muestra junto al precio de lista y con fecha de término. El descuento es un ancla temporal, no un precio nuevo: el club siempre sabe cuánto vale lo que recibe.",
  ],
  [
    "clock",
    "La condición caduca; el link no",
    "Propuestas y resúmenes viven para siempre (son marketing que circula solo). Lo que vence es la condición: pasado el plazo muestra \"vencida — conversemos\" y el CTA cambia a re-enganche. Urgencia antes, puerta abierta después.",
  ],
  [
    "lock",
    "Las excepciones se rotulan y se trazan",
    "Todo lo fuera de banda es CONTRAPROPUESTA: documento aparte, rotulado \"excepción aprobada por dirección\", con % vs lista visible y emisión re-sellada. El cliente percibe esfuerzo real; nosotros mantenemos control y registro.",
  ],
];

export default function Playbook({ onClose }) {
  const ejTx = TICKET_DEFAULT;
  const comEj = comisionTx(ejTx); // $750 + 4% sin IVA
  const costoTransbank = comisionTx(ejTx, COMISION_PISO);
  const margenTx = comEj - costoTransbank;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="no-print fixed inset-0 z-50 overflow-y-auto bg-night"
      onClick={onClose}
    >
      <div className="mx-auto max-w-5xl px-8 py-10" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-loss/15 px-3 py-1 font-mono text-[10px] font-bold tracking-[0.18em] text-loss uppercase ring-1 ring-loss/30">
              Solo uso interno — no se muestra a clientes
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white">
              Cómo cobramos. <em className="text-limebrand not-italic">Y por qué.</em>
            </h2>
            <p className="mt-2 max-w-2xl text-[14px] text-nightsecond">
              El modelo completo en una página: para que cualquiera que venda lo explique igual — y
              conceda solo lo que está sancionado.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1.5 font-mono text-[11px] text-nightsecond hover:bg-white/5 hover:text-white"
          >
            Esc
          </button>
        </div>

        {/* 01 · Los dos motores */}
        <div className="mt-10">
          <Titulo n="01">Dos motores de ingreso — nunca se mezclan al comunicar</Titulo>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-nightcard p-6 ring-1 ring-nightline">
              <p className="font-mono text-[10px] tracking-[0.18em] text-nightsecond uppercase">Motor 1 · fijo</p>
              <p className="mt-1 text-2xl font-extrabold text-white">
                Fee plano mensual <span className="text-limebrand">en UF</span>
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-nightsecond">
                Por tamaño de club (canchas), jugadores ilimitados, sin permanencia. Es{" "}
                <span className="font-bold text-white">lo único que sale del bolsillo del club</span> —
                así se dice en la reunión.
              </p>
            </div>
            <div className="rounded-3xl bg-nightcard p-6 ring-1 ring-nightline">
              <p className="font-mono text-[10px] tracking-[0.18em] text-nightsecond uppercase">Motor 2 · variable</p>
              <p className="mt-1 text-2xl font-extrabold text-white">
                Comisión <span className="text-limebrand">del flujo online</span>
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-nightsecond">
                {clp(COMISION.fijo)} + {pctFmt(COMISION.pct)} + IVA por transacción, descontada de lo
                recaudado. El club recibe el neto:{" "}
                <span className="font-bold text-white">nunca una factura aparte</span>.
              </p>
            </div>
          </div>
        </div>

        {/* 02 · Planes y tramos */}
        <div className="mt-10">
          <Titulo n="02">Planes y tramos — el fee lo fija el tamaño, no la negociación</Titulo>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {Object.values(PLANES).map((p) => (
              <div
                key={p.id}
                className={`rounded-3xl p-5 ring-1 ${
                  p.id === "club"
                    ? "bg-white text-inkstrong ring-limebrand shadow-xl shadow-limebrand/10"
                    : "bg-nightcard text-white ring-nightline"
                }`}
              >
                <p
                  className={`font-mono text-[9.5px] tracking-[0.16em] uppercase ${
                    p.id === "club" ? "text-limeink" : "text-tealbrand"
                  }`}
                >
                  {p.tag}
                </p>
                <p className="mt-1 text-lg font-extrabold">{p.nombre}</p>
                <p className="text-3xl font-extrabold tracking-tight">
                  UF {ufa(p.uf)}
                  <span className={`ml-1 text-xs font-semibold ${p.id === "club" ? "text-second" : "text-nightsecond"}`}>
                    ≈ {clp(p.uf * UF_CLP)}/mes
                  </span>
                </p>
                <p className={`mt-1 text-[11.5px] ${p.id === "club" ? "text-second" : "text-nightsecond"}`}>
                  {p.detalle}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 font-mono text-[10.5px] text-nightsecond">
            Tramo automático: ≤6 canchas → Club · 7+ o multisede → Club Pro · pago anual −
            {DESC_ANUAL * 100}% sobre el fee. El vendedor no elige el plan: lo eligen las canchas.
          </p>
        </div>

        {/* 03 · Anatomía de la comisión */}
        <div className="mt-10">
          <Titulo n="03">La comisión por dentro — y su piso intocable</Titulo>
          <div className="mt-4 rounded-3xl bg-nightcard p-6 ring-1 ring-nightline">
            <div className="grid items-center gap-6 sm:grid-cols-[1fr_1.2fr]">
              <div>
                <p className="text-[13px] text-nightsecond">Ejemplo con el ticket promedio ({clp(ejTx)}):</p>
                <p className="mt-2 text-3xl font-extrabold text-white">
                  {clp(comEj)} <span className="text-sm font-semibold text-nightsecond">+ IVA por transacción</span>
                </p>
                <div className="mt-3 flex flex-col gap-1 font-mono text-[11px]">
                  <span className="text-nightsecond">
                    costo Transbank ({clp(COMISION_PISO.fijo)} + {pctFmt(COMISION_PISO.pct)}):{" "}
                    <span className="text-loss">−{clp(costoTransbank)}</span>
                  </span>
                  <span className="text-nightsecond">
                    margen MatchPro: <span className="font-bold text-limebrand">{clp(margenTx)}</span>
                  </span>
                </div>
              </div>
              <div>
                {/* Barra: costo vs margen */}
                <div className="flex h-9 overflow-hidden rounded-full ring-1 ring-white/10">
                  <div
                    className="flex items-center justify-center bg-loss/40 font-mono text-[9.5px] text-white"
                    style={{ width: `${(costoTransbank / comEj) * 100}%` }}
                  >
                    costo
                  </div>
                  <div className="flex items-center justify-center bg-limebrand font-mono text-[9.5px] font-bold text-limeink" style={{ flex: 1 }}>
                    margen
                  </div>
                </div>
                <p className="mt-3 text-[12.5px] leading-relaxed text-nightsecond">
                  <span className="font-bold text-white">Piso Transbank ({pctFmt(COMISION_PISO.pct)}): duro.</span>{" "}
                  El código lo clampa — ni el panel ni la URL pueden dejar la comisión bajo el costo.
                  Bajo el piso no hay descuento posible: hay pérdida por transacción.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 04 · Bandas sancionadas */}
        <div className="mt-10">
          <Titulo n="04">Lo que un vendedor puede conceder — sin pedir permiso</Titulo>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-nightcard p-5 ring-1 ring-nightline">
              <p className="text-[13px] font-bold text-white">Meses gratis al partir</p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {NEGOCIACION.mesesGratis.map((m) => (
                  <Chip key={m}>{m}</Chip>
                ))}
              </div>
              <p className="mt-2.5 font-mono text-[10px] leading-relaxed text-nightsecond">
                sin fee esos meses · las comisiones corren desde el día 1
              </p>
            </div>
            <div className="rounded-3xl bg-nightcard p-5 ring-1 ring-nightline">
              <p className="text-[13px] font-bold text-white">Descuento sobre el fee</p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {NEGOCIACION.descuentos.map((d) => (
                  <Chip key={d}>{d === 0 ? "0%" : `−${d * 100}%`}</Chip>
                ))}
                {NEGOCIACION.duraciones.map((m) => (
                  <Chip key={`d${m}`} amber>
                    × {m} m
                  </Chip>
                ))}
              </div>
              <p className="mt-2.5 font-mono text-[10px] leading-relaxed text-nightsecond">
                siempre por tiempo limitado · nunca permanente · lista visible
              </p>
            </div>
            <div className="rounded-3xl bg-pmamber/10 p-5 ring-1 ring-pmamber/30">
              <p className="text-[13px] font-bold text-pmamber">Todo lo demás = excepción</p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-nightsecond">
                Fee especial, más meses, más % o comisión distinta:{" "}
                <span className="font-bold text-white">no se promete en la reunión</span>. Se levanta a
                dirección y sale como contrapropuesta rotulada, desde la bitácora.
              </p>
            </div>
          </div>
        </div>

        {/* 05 · El flujo */}
        <div className="mt-10">
          <Titulo n="05">El flujo comercial — cada momento tiene su superficie</Titulo>
          <div className="mt-4 grid gap-3 sm:grid-cols-5">
            {[
              ["1", "Preparar", "datos del club, láminas y concesiones EN banda. Sugerencias por perfil."],
              ["2", "Presentar", "el deck muestra solo lista + concesiones sancionadas. La cocina nunca."],
              ["3", "Enviar", "resumen de una página, link sellado (emisión + validez + firma)."],
              ["4", "Seguir", "bitácora: estados, vencimientos y consejos. Todo queda trazado."],
              ["5", "Negociar", "módulo Contrapropuesta: excepción rotulada, re-sella la emisión."],
            ].map(([n, t, d], i) => (
              <div key={n} className="relative rounded-2xl bg-nightcard p-4 ring-1 ring-nightline">
                <p className="font-mono text-lg font-bold text-limebrand">{n}</p>
                <p className="mt-0.5 text-[14px] font-bold text-white">{t}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-nightsecond">{d}</p>
                {i < 4 && (
                  <span
                    className="absolute top-1/2 -right-[18px] z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-night ring-1 ring-limebrand/40 sm:flex"
                    aria-hidden="true"
                  >
                    <Icon name="arrowRight" className="h-3 w-3 text-limebrand" />
                  </span>
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 font-mono text-[10.5px] text-nightsecond">
            Vencida la condición, el link NO muere: muestra "vencida — conversemos" con la lista intacta.
            El re-enganche es parte del flujo, no un accidente.
          </p>
        </div>

        {/* 06 · Principios */}
        <div className="mt-10 pb-4">
          <Titulo n="06">La estrategia detrás — por qué el modelo es así</Titulo>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {PRINCIPIOS.map(([ic, t, d]) => (
              <div key={t} className="flex gap-4 rounded-3xl bg-nightcard p-5 ring-1 ring-nightline">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-limebrand/15 text-limebrand">
                  <Icon name={ic} className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-[14px] font-bold text-white">{t}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-nightsecond">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
