// ─────────────────────────────────────────────────────────────
// Módulo CONTRAPROPUESTA — el momento de NEGOCIAR, separado del
// de preparar. Se abre desde la bitácora (o ?panel=contra).
//
// Arriba: lo propuesto en la reunión, en solo lectura.
// Editable: SOLO lo negociable — excepciones (fee/meses/%/plazo),
// comisión online y nueva validez. Los datos del club NO se
// tocan aquí (eso es Editar → Preparar).
// La contrapropuesta es un documento NUEVO: re-sella su emisión.
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { motion } from "framer-motion";
import { configAQuery, empacar, hoyISO, fechaLegible, fechaVencimiento } from "./club";
import { clp, ufa, UF_CLP, cotizar, COMISION_PISO } from "./pricing";
import { Range } from "./ui";
import { registrarReunion } from "./Bitacora";
import Resumen from "./Resumen";

const inputCls =
  "rounded-xl border border-nightline bg-night px-3 py-2 text-sm font-semibold text-white outline-none focus:border-tealbrand";

function Campo({ label, value, onChange, min = 0, max, step = 1, unit = "", fmt, disabled = false }) {
  const [topMax, setTopMax] = useState(() => Math.max(max, value));
  const escribir = (v) => {
    const nv = Math.max(min, v);
    if (nv > topMax) setTopMax(nv);
    onChange(nv);
  };
  return (
    <div className={disabled ? "opacity-35 select-none" : ""}>
      <span className="block text-[10.5px] font-bold tracking-wide text-nightsecond uppercase">{label}</span>
      <div className="mt-2 flex items-center gap-3">
        <Range min={min} max={topMax} step={step} value={value} onChange={onChange} dark disabled={disabled} className="flex-1" />
        <span className="flex shrink-0 items-center gap-1">
          <input
            type="number"
            min={min}
            step={step}
            value={value}
            disabled={disabled}
            onChange={(e) => escribir(Number(e.target.value) || 0)}
            className={`${inputCls} w-24 px-2 py-1 text-right font-mono text-[12px]`}
          />
          {unit && <span className="w-7 font-mono text-[10px] text-nightsecond">{unit}</span>}
        </span>
      </div>
      {fmt && <p className="mt-0.5 text-right font-mono text-[9.5px] text-nightsecond">{fmt(value)}</p>}
    </div>
  );
}

export default function Contraprop({ config, setConfig, onClose }) {
  const [copiado, setCopiado] = useState(false);
  const [preview, setPreview] = useState(false);
  const set = (patch) => setConfig((c) => ({ ...c, ...patch }));

  const q = cotizar({ canchas: config.canchas });
  const base = window.location.href.split(/[?#]/)[0];
  /* Documento nuevo: emisión re-sellada HOY */
  const configNueva = { ...config, em: hoyISO() };
  const linkContra = `${base}?d=${empacar(`${configAQuery(configNueva)}&modo=resumen`)}`;

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(linkContra);
      registrarReunion(configNueva, configAQuery(configNueva));
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1600);
    } catch {
      /* file:// sin clipboard */
    }
  };

  const pctEquiv = config.feex > 0 ? Math.round((1 - config.feex / q.fee) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-night/95 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-full w-full max-w-2xl overflow-y-auto rounded-3xl bg-nightcard p-8 ring-1 ring-nightline"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="eyebrow text-pmamber">Contrapropuesta · {config.nombre}</p>
            <p className="mt-1 font-mono text-[10px] text-nightsecond">
              Documento nuevo: se emite hoy y define su propia validez · queda trazado en el link
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

        {/* Lo propuesto en la reunión — solo lectura */}
        <div className="mt-5 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <p className="font-mono text-[9px] tracking-[0.18em] text-nightsecond uppercase">
            Lo propuesto en la reunión
          </p>
          <p className="mt-1.5 text-[14px] text-white">
            Plan <span className="font-bold">{q.plan.nombre}</span> · UF {ufa(q.plan.uf)} ≈{" "}
            <span className="font-bold">{clp(q.fee)}/mes</span>
            {config.mesesGratis > 0 && (
              <span className="ml-2 rounded-full bg-limebrand/15 px-2 py-0.5 text-[10px] font-bold text-limebrand">
                {config.mesesGratis} mes{config.mesesGratis > 1 ? "es" : ""} gratis
              </span>
            )}
            {config.dcto > 0 && (
              <span className="ml-2 rounded-full bg-limebrand/15 px-2 py-0.5 text-[10px] font-bold text-limebrand">
                −{Math.round(config.dcto * 100)}% × {config.dctoMeses}m
              </span>
            )}
          </p>
          <p className="mt-1 font-mono text-[9.5px] text-nightsecond">
            Los datos del club no se editan aquí — para eso usa Editar (Preparar).
          </p>
        </div>

        {/* Lo negociable */}
        <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <Campo
            label="Fee mensual excepcional"
            value={config.feex}
            onChange={(v) => set({ feex: v })}
            min={0}
            max={300000}
            step={5000}
            unit="CLP"
            fmt={(v) =>
              v > 0 ? `≈ UF ${ufa(v / UF_CLP)} · −${Math.round((1 - v / q.fee) * 100)}% vs lista` : "0 = mantener lista"
            }
          />
          <Campo
            label="Meses gratis excepcionales"
            value={config.mgx}
            onChange={(v) => set({ mgx: v, ...(v > 0 ? { mesesGratis: 0 } : {}) })}
            min={0}
            max={6}
          />
          <Campo
            label="Descuento excepcional"
            value={Math.round(config.dctox * 100)}
            onChange={(v) => set({ dctox: Math.min(v, 90) / 100, ...(v > 0 ? { dcto: 0 } : {}) })}
            min={0}
            max={60}
            step={5}
            unit="%"
          />
          <Campo
            label="Duración del descuento"
            value={config.dmx || 6}
            onChange={(v) => set({ dmx: v })}
            min={1}
            max={24}
            unit="m"
            disabled={config.dctox === 0}
          />
          <Campo
            label="Comisión fija por transacción"
            value={config.cfijo}
            onChange={(v) => set({ cfijo: Math.max(v, COMISION_PISO.fijo) })}
            min={COMISION_PISO.fijo}
            max={2000}
            step={50}
            unit="CLP"
          />
          <Campo
            label="Comisión variable"
            value={Math.round(config.cpct * 1000) / 10}
            onChange={(v) => set({ cpct: Math.max(Math.min(v, 15) / 100, COMISION_PISO.pct) })}
            min={Math.round(COMISION_PISO.pct * 1000) / 10}
            max={10}
            step={0.5}
            unit="%"
          />
          <Campo
            label="Validez de la contrapropuesta"
            value={config.validez}
            onChange={(v) => set({ validez: Math.max(v, 1) })}
            min={1}
            max={90}
            unit="días"
            fmt={() => `vence el ${fechaLegible(fechaVencimiento(configNueva))}`}
          />
          <div className="flex flex-col justify-center rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
            <p className="font-mono text-[9px] tracking-[0.18em] text-nightsecond uppercase">Emisión del documento</p>
            <p className="mt-1 text-[13px] font-bold text-white">Hoy · {fechaLegible(hoyISO())}</p>
            <p className="mt-0.5 font-mono text-[9px] text-nightsecond">se sella al copiar el link — documento nuevo</p>
          </div>
        </div>

        <p className="mt-4 font-mono text-[9.5px] leading-relaxed text-nightsecond">
          {config.feex > 0 || config.mgx > 0 || config.dctox > 0
            ? `⚠ Excepción a la política — el resumen la rotula como contrapropuesta${
                config.feex > 0 ? ` (−${pctEquiv}% vs lista)` : ""
              } con el precio de lista visible.`
            : "Sin excepciones: el resumen saldrá como propuesta estándar."}{" "}
          Piso de comisión bloqueado en {Math.round(COMISION_PISO.pct * 1000) / 10}% (costo Transbank).
        </p>

        {/* Acciones */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-nightline pt-5">
          <button
            type="button"
            onClick={() => setPreview(true)}
            className="rounded-xl bg-white/10 px-4 py-2 text-[12.5px] font-bold text-white ring-1 ring-white/20 hover:-translate-y-0.5 transition-transform"
          >
            Previsualizar
          </button>
          <button
            type="button"
            onClick={copiar}
            className="rounded-xl bg-limebrand px-5 py-2 text-[12.5px] font-bold text-limeink transition-transform hover:-translate-y-0.5"
          >
            {copiado ? "✓ Copiada y registrada" : "Copiar link de la contrapropuesta"}
          </button>
          <p className="ml-auto font-mono text-[9px] text-nightsecond">al copiar se actualiza la bitácora</p>
        </div>
      </div>

      {/* Previsualización del resumen */}
      {preview && (
        <div
          className="fixed inset-0 z-[60] overflow-y-auto bg-night/95 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            setPreview(false);
          }}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between bg-night/90 px-6 py-3">
            <p className="font-mono text-[11px] text-nightsecond">
              Previsualización · así verá el cliente la contrapropuesta
            </p>
            <button
              type="button"
              onClick={() => setPreview(false)}
              className="rounded-full bg-white/10 px-4 py-1.5 text-[12px] font-bold text-white ring-1 ring-white/20"
            >
              ✕ Cerrar
            </button>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <Resumen />
          </div>
        </div>
      )}
    </motion.div>
  );
}
