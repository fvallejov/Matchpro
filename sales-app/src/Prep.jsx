// ─────────────────────────────────────────────────────────────
// Preparación de la reunión (tecla E o ⚙) — versión ordenada.
// Secciones: Club → Diagnóstico → Supuestos → Concesiones →
// Contrapropuesta (excepción) → Láminas → Links.
//
// Integridad: los precios de lista y el menú de concesiones
// viven en src/pricing.js. Todo lo que exceda el menú va en
// "Contrapropuesta": rotulado, con % explícito y trazado en
// el link. La excepción deja huella, no reemplaza la política.
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { motion } from "framer-motion";
import { derivar, configAQuery } from "./club";
import { clp, NEGOCIACION, DESC_ANUAL, COMISION_PISO } from "./pricing";
import { Range } from "./ui";
import { registrarReunion } from "./Bitacora";
import Resumen from "./Resumen";

/* ── Piezas de UI ───────────────────────────────────────────── */

function Seccion({ titulo, nota, children }) {
  return (
    <div className="mt-8 border-t border-nightline pt-6 first:mt-0 first:border-0 first:pt-0">
      <div className="flex items-baseline justify-between gap-4">
        <p className="eyebrow text-tealbrand">{titulo}</p>
        {nota && <p className="text-right font-mono text-[9.5px] text-nightsecond">{nota}</p>}
      </div>
      {children}
    </div>
  );
}

function Chip({ on, onClick, disabled, children }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-[12px] font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-limebrand/70 disabled:opacity-30 ${
        on
          ? "border-limebrand bg-limebrand/15 text-limebrand"
          : "border-nightline text-nightsecond hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

const inputCls =
  "rounded-xl border border-nightline bg-night px-3 py-2 text-sm font-semibold text-white outline-none focus:border-tealbrand";

/* Slider + valor editable: el número escrito DEFINE el máximo del
   slider y ese máximo queda fijo (sticky) — deslizar después no lo
   reduce, así el recorrido es consistente. */
function NumField({ label, value, onChange, min = 0, max, step = 1, fmt, unit = "", hint = "" }) {
  const [topMax, setTopMax] = useState(() => Math.max(max, value));
  const escribir = (v) => {
    const nv = Math.max(min, v);
    if (nv > topMax) setTopMax(nv);
    onChange(nv);
  };
  const sliderMax = topMax;
  return (
    <div>
      <span className="block text-[10.5px] font-bold tracking-wide text-nightsecond uppercase">{label}</span>
      <div className="mt-2 flex items-center gap-3">
        <Range min={min} max={sliderMax} step={step} value={value} onChange={onChange} dark className="flex-1" />
        <span className="flex shrink-0 items-center gap-1">
          <input
            type="number"
            min={min}
            step={step}
            value={value}
            onChange={(e) => escribir(Number(e.target.value) || 0)}
            className={`${inputCls} w-24 px-2 py-1 text-right font-mono text-[12px]`}
          />
          {unit && <span className="w-7 font-mono text-[10px] text-nightsecond">{unit}</span>}
        </span>
      </div>
      {fmt && <p className="mt-0.5 text-right font-mono text-[9.5px] text-nightsecond">{fmt(value)}</p>}
      {hint && <p className="mt-1.5 font-mono text-[9px] leading-relaxed text-nightsecond/90">{hint}</p>}
    </div>
  );
}

/* ── Deportes disponibles en la plataforma ──────────────────── */

const DEPORTES = ["Tenis", "Pádel", "Squash", "Pickleball"];

/* ── Sugerencia de configuración por perfil/tamaño ──────────── */

function sugerir(config) {
  const chico = config.canchas <= 4;
  const RECETAS = {
    planillas: {
      laminas: ["problema", "panel", "reservas", "pagos", "socios", "tv", "proyeccion", "implementacion", "precio"],
      mesesGratis: 1,
      dcto: 0,
      motivo:
        "Perfil planillas: el dolor es orden y confianza → foco en operación (reservas, pagos, cuotas) e implementación acompañada. 1 mes gratis baja la fricción de partir.",
    },
    software: {
      laminas: ["problema", "panel", "torneos", "escalerilla", "tv", "app", "efecto", "comparativa", "mercadograf", "precio"],
      mesesGratis: 0,
      dcto: 0.1,
      motivo:
        "Perfil software: ya paga por reservas → foco en lo que su sistema NO tiene (competencia, TV, app) y comparativa de mercado. −10% × 6m facilita el cambio sin regalar valor.",
    },
    mixto: {
      laminas: ["problema", "panel", "pagos", "socios", "finanzas", "ecosistema", "proyeccion", "implementacion", "precio"],
      mesesGratis: 1,
      dcto: 0,
      motivo:
        "Perfil mixto: el dolor es la fragmentación → foco en consolidación (pagos, finanzas, un solo panel) y ecosistema. 1 mes gratis para migrar sin costo doble.",
    },
  };
  const r = RECETAS[config.perfil] ?? RECETAS.planillas;
  const laminas = chico ? r.laminas.filter((l) => !["finanzas", "mercadograf"].includes(l)) : r.laminas;
  return { ...r, laminas, dctoMeses: 6 };
}

/* ── Panel ──────────────────────────────────────────────────── */

export default function Prep({ config, setConfig, slides, onClose }) {
  const [copiado, setCopiado] = useState("");
  const [motivo, setMotivo] = useState("");
  const [preview, setPreview] = useState(false);
  const laminas = config.laminas ?? slides.map((s) => s.id);

  const set = (patch) => setConfig((c) => ({ ...c, ...patch }));
  /* Sin trim() por tecla: permite espacios y borrar todo mientras
     se escribe. El fallback solo se aplica al salir del campo. */
  const setNombre = (v) => set({ nombre: v, ...derivar(v || "Club") });
  const nombreBlur = () => {
    if (!config.nombre.trim()) set({ nombre: "Club Demo", ...derivar("Club Demo") });
  };

  const deportesSel = config.deportes ? config.deportes.split(/,\s*|\s+y\s+/i) : [];
  const toggleDeporte = (d) => {
    const next = deportesSel.includes(d) ? deportesSel.filter((x) => x !== d) : [...deportesSel, d];
    set({ deportes: next.length > 1 ? next.slice(0, -1).join(", ") + " y " + next.at(-1) : (next[0] ?? "") });
  };

  const toggleLamina = (id, locked) => {
    if (locked) return;
    const next = laminas.includes(id) ? laminas.filter((x) => x !== id) : [...laminas, id];
    set({ laminas: next });
  };

  const gmvSugerido = config.socios * config.cuota + config.torneos;

  const aplicarSugerencia = () => {
    const s = sugerir(config);
    set({ laminas: s.laminas, mesesGratis: s.mesesGratis, dcto: s.dcto, dctoMeses: s.dctoMeses });
    setMotivo(s.motivo);
  };

  /* base desde href (window.location.origin es "null" al abrir el
     archivo con doble clic — rompía el botón "Ver ↗") */
  const base = window.location.href.split(/[?#]/)[0];
  const link = `${base}?${configAQuery(config)}`;
  const linkResumen = `${base}?${configAQuery(config)}&modo=resumen`;

  const copiar = async (texto, tag) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(tag);
      setTimeout(() => setCopiado(""), 1600);
    } catch {
      /* file:// sin clipboard: los inputs permiten copiar a mano */
    }
  };

  const hayExcepcion = config.feex > 0 || config.mgx > 0 || config.dctox > 0;

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
        className="max-h-full w-full max-w-4xl overflow-y-auto rounded-3xl bg-nightcard p-8 ring-1 ring-nightline"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="eyebrow text-tealbrand">Preparar la reunión</p>
            <h2 className="mt-1 text-xl font-bold text-white">{config.nombre}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={aplicarSugerencia}
              className="rounded-full bg-tealbrand/15 px-4 py-2 text-[12px] font-bold text-tealbrand ring-1 ring-tealbrand/30 transition-colors hover:bg-tealbrand/25"
              title="Sugiere láminas y concesiones según perfil y tamaño del club"
            >
              ✦ Sugerir configuración
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-3 py-1.5 font-mono text-[11px] text-nightsecond hover:bg-white/5 hover:text-white"
            >
              Esc
            </button>
          </div>
        </div>
        {motivo && (
          <p className="mt-3 rounded-xl bg-tealbrand/10 px-4 py-2.5 text-[12px] leading-relaxed text-tealbrand ring-1 ring-tealbrand/20">
            {motivo}
          </p>
        )}

        {/* 1 · El club */}
        <Seccion titulo="1 · El club">
          <div className="mt-3 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-[10.5px] font-bold tracking-wide text-nightsecond uppercase">
                Nombre
              </span>
              <input
                className={`${inputCls} w-full`}
                value={config.nombre}
                onChange={(e) => setNombre(e.target.value)}
                onBlur={nombreBlur}
              />
            </label>
            <div>
              <span className="mb-1 block text-[10.5px] font-bold tracking-wide text-nightsecond uppercase">
                Deportes
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {DEPORTES.map((d) => (
                  <Chip key={d} on={deportesSel.includes(d)} onClick={() => toggleDeporte(d)}>
                    {d}
                  </Chip>
                ))}
              </div>
            </div>
            <NumField
              label="Canchas"
              value={config.canchas}
              onChange={(v) => set({ canchas: v })}
              min={1}
              max={14}
              hint="Define el plan sugerido: hasta 6 canchas → Club (UF 3) · 7 o más → Club Pro (UF 5)."
            />
          </div>
        </Seccion>

        {/* 2 · La reunión */}
        <Seccion titulo="2 · La reunión" nota="aparece en la portada y en el resumen; viaja en el link">
          <div className="mt-3 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-[10.5px] font-bold tracking-wide text-nightsecond uppercase">
                Contacto (con quién es la reunión)
              </span>
              <input
                className={`${inputCls} w-full`}
                value={config.contacto}
                placeholder="Nombre y apellido"
                onChange={(e) => set({ contacto: e.target.value })}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-[10.5px] font-bold tracking-wide text-nightsecond uppercase">
                  Cargo
                </span>
                <input
                  className={`${inputCls} w-full`}
                  value={config.cargo}
                  placeholder="Administrador…"
                  onChange={(e) => set({ cargo: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[10.5px] font-bold tracking-wide text-nightsecond uppercase">
                  Fecha reunión
                </span>
                <input
                  type="date"
                  className={`${inputCls} w-full`}
                  value={config.fecha}
                  onChange={(e) => set({ fecha: e.target.value })}
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-1 block text-[10.5px] font-bold tracking-wide text-nightsecond uppercase">
                Email o teléfono del contacto
              </span>
              <input
                className={`${inputCls} w-full`}
                value={config.fono}
                placeholder="opcional"
                onChange={(e) => set({ fono: e.target.value })}
              />
            </label>
            <NumField
              label="Validez de la propuesta"
              value={config.validez}
              onChange={(v) => set({ validez: Math.max(v, 1) })}
              min={1}
              max={90}
              unit="días"
              hint="Corre desde el día en que copias el link (la emisión queda sellada en él). La propuesta, el resumen y la bitácora muestran la fecha exacta de vencimiento."
            />
          </div>
        </Seccion>

        {/* 3 · Diagnóstico */}
        <Seccion titulo="3 · Diagnóstico inicial" nota="también se cambia en vivo, en la lámina">
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {[
              ["planillas", "Personas y planillas"],
              ["software", "Ya usa un software"],
              ["mixto", "Automatización parcial"],
            ].map(([id, label]) => (
              <Chip key={id} on={config.perfil === id} onClick={() => set({ perfil: id })}>
                {label}
              </Chip>
            ))}
          </div>
        </Seccion>

        {/* 4 · Números del club — alimentan la calculadora de precio */}
        <Seccion titulo="4 · Números del club" nota="alimentan la calculadora de precio">
          <div className="mt-3 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <NumField
              label="Socios"
              value={config.socios}
              onChange={(v) => set({ socios: v })}
              min={0}
              max={400}
              step={5}
              hint="Cuántos socios activos tiene el club. Solo se usa para sugerir los pagos online (socios × cuota)."
            />
            <NumField
              label="Cuota mensual promedio"
              value={config.cuota}
              onChange={(v) => set({ cuota: v })}
              min={0}
              max={80000}
              step={1000}
              unit="CLP"
              hint="Cuota social promedio por socio. Junto con Socios, arma la sugerencia de pagos online."
            />
            <div>
              <NumField
                label="Pagos online estimados / mes"
                value={config.gmv}
                onChange={(v) => set({ gmv: v })}
                min={0}
                max={10000000}
                step={250000}
                unit="CLP"
                hint="Todo lo que la plataforma cobraría por el club cada mes: arriendos + cuotas + inscripciones. Sobre esto se estima la comisión."
              />
              <button
                type="button"
                onClick={() => set({ gmv: gmvSugerido })}
                className="mt-1 font-mono text-[10px] text-tealbrand hover:underline"
              >
                Sugerencia: {clp(gmvSugerido)} = socios × cuota + torneos — aplicar
              </button>
              <p className="font-mono text-[9px] leading-relaxed text-nightsecond">
                La sugerencia asume cuotas cobradas por la plataforma. Si el club seguirá cobrando por
                caja, baja el número.
              </p>
            </div>
            <NumField
              label="Monto promedio por transacción"
              value={config.ticket}
              onChange={(v) => set({ ticket: v })}
              min={1000}
              max={40000}
              step={1000}
              unit="CLP"
              hint={`Cuánto vale UNA operación online típica (un arriendo, una cuota). Se usa para estimar cuántas transacciones componen los pagos online y cuántas veces se aplica el fijo $${config.cfijo} de la comisión.`}
            />
          </div>
        </Seccion>

        {/* 5 · Supuestos del simulador */}
        <Seccion titulo="5 · Supuestos del simulador" nota="lámina «El club que podría ser» — editables también en vivo">
          <div className="mt-3 grid gap-x-8 gap-y-6 sm:grid-cols-3">
            <NumField
              label="Horas muertas recuperadas / semana"
              value={config.horas}
              onChange={(v) => set({ horas: v })}
              min={0}
              max={40}
              unit="h"
              hint="Horas de cancha que hoy quedan vacías y que el club recuperaría con reservas online 24/7 y QR."
            />
            <NumField
              label="Tarifa promedio por hora"
              value={config.tarifa}
              onChange={(v) => set({ tarifa: v })}
              min={0}
              max={30000}
              step={1000}
              unit="CLP"
              hint="Precio de arriendo por hora. El simulador calcula: horas × 4,33 semanas × tarifa."
            />
            <NumField
              label="Torneos e inscripciones / mes"
              value={config.torneos}
              onChange={(v) => set({ torneos: v })}
              min={0}
              max={800000}
              step={50000}
              unit="CLP"
              hint="Ingresos por torneos con inscripción online que hoy NO se hacen. Se suma al simulador."
            />
          </div>
        </Seccion>

        {/* 6 · Comisión por pago online */}
        <Seccion titulo="6 · Comisión por pago online" nota="configuración del contrato — viaja en el link">
          <div className="mt-3 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <NumField
              label="Comisión fija por transacción"
              value={config.cfijo}
              onChange={(v) => set({ cfijo: Math.max(v, COMISION_PISO.fijo) })}
              min={COMISION_PISO.fijo}
              max={2000}
              step={50}
              unit="CLP"
              hint="Monto fijo que se descuenta de CADA cobro online. Se resta de lo recaudado — el club nunca lo paga aparte."
            />
            <NumField
              label="Comisión variable"
              value={Math.round(config.cpct * 1000) / 10}
              onChange={(v) => set({ cpct: Math.max(Math.min(v, 15) / 100, COMISION_PISO.pct) })}
              min={Math.round(COMISION_PISO.pct * 1000) / 10}
              max={10}
              step={0.5}
              unit="%"
              hint={`% sobre cada cobro online. Piso BLOQUEADO en ${Math.round(COMISION_PISO.pct * 1000) / 10}% (costo Transbank): el sistema no acepta menos, ni siquiera por URL.`}
            />
          </div>
        </Seccion>

        {/* 4 · Concesiones sancionadas */}
        <Seccion titulo="7 · Concesiones (menú sancionado)" nota={`pago anual −${DESC_ANUAL * 100}% vive en la calculadora`}>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <div>
              <span className="mb-1.5 block text-[10.5px] font-bold tracking-wide text-nightsecond uppercase">
                Meses gratis al partir
              </span>
              <div className="flex gap-1.5">
                {NEGOCIACION.mesesGratis.map((m) => (
                  <Chip key={m} on={config.mesesGratis === m && !config.mgx} onClick={() => set({ mesesGratis: m, mgx: 0 })}>
                    {m}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <span className="mb-1.5 block text-[10.5px] font-bold tracking-wide text-nightsecond uppercase">
                Descuento sobre el fee
              </span>
              <div className="flex gap-1.5">
                {NEGOCIACION.descuentos.map((d) => (
                  <Chip key={d} on={config.dcto === d && !config.dctox} onClick={() => set({ dcto: d, dctox: 0 })}>
                    {d === 0 ? "0%" : `−${d * 100}%`}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <span className="mb-1.5 block text-[10.5px] font-bold tracking-wide text-nightsecond uppercase">
                Duración del descuento
              </span>
              <div className="flex gap-1.5">
                {NEGOCIACION.duraciones.map((m) => (
                  <Chip key={m} on={config.dctoMeses === m} onClick={() => set({ dctoMeses: m })} disabled={config.dcto === 0}>
                    {m} m
                  </Chip>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-2.5 font-mono text-[9.5px] leading-relaxed text-nightsecond">
            Siempre por tiempo limitado y con precio de lista visible. La comisión por pago online
            se configura en Supuestos (piso: costo Transbank).
          </p>
        </Seccion>

        {/* 5 · Contrapropuesta (excepción) */}
        <Seccion titulo="8 · Contrapropuesta · excepción" nota="valores libres, rotulados y trazados en el link">
          <div className="mt-3 grid gap-x-8 gap-y-6 sm:grid-cols-3">
            <NumField label="Fee mensual excepcional" value={config.feex} onChange={(v) => set({ feex: v })} min={0} max={300000} step={5000} unit="CLP" />
            <NumField label="Meses gratis excepcionales" value={config.mgx} onChange={(v) => set({ mgx: v, ...(v > 0 ? { mesesGratis: 0 } : {}) })} min={0} max={6} />
            <div>
              <NumField
                label="Descuento excepcional (%)"
                value={Math.round(config.dctox * 100)}
                onChange={(v) => set({ dctox: Math.min(v, 90) / 100, ...(v > 0 ? { dcto: 0 } : {}) })}
                min={0}
                max={60}
                step={5}
                unit="%"
              />
              {config.dctox > 0 && (
                <NumField label="Duración (meses)" value={config.dmx || 6} onChange={(v) => set({ dmx: v })} min={1} max={24} unit="m" />
              )}
            </div>
          </div>
          <p className="mt-2.5 font-mono text-[9.5px] leading-relaxed text-nightsecond">
            {hayExcepcion
              ? "⚠ Esta propuesta incluye condiciones fuera de política: se rotulan como excepción, muestran el % equivalente y quedan registradas en el link."
              : "En cero = sin excepción. Úsalo solo para contrapropuestas negociadas después de la reunión."}
          </p>
        </Seccion>

        {/* 6 · Láminas, por categoría */}
        <Seccion titulo="9 · Láminas de esta reunión" nota="Portada y Propuesta siempre visibles">
          {["Inicio", "Producto", "Jugadores", "Crecimiento", "Cierre"].map((grupo) => (
            <div key={grupo} className="mt-2.5 flex items-baseline gap-3">
              <span className="w-24 shrink-0 pt-1.5 font-mono text-[9.5px] tracking-[0.15em] text-nightsecond uppercase">
                {grupo}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {slides
                  .filter((s) => s.grupo === grupo)
                  .map((s) => {
                    const on = s.locked || laminas.includes(s.id);
                    return (
                      <Chip key={s.id} on={on} disabled={s.locked} onClick={() => toggleLamina(s.id, s.locked)}>
                        {s.label}
                        {s.locked && " ·"}
                      </Chip>
                    );
                  })}
              </div>
            </div>
          ))}
        </Seccion>

        {/* 7 · Links */}
        <Seccion titulo="10 · Compartir">
          <div className="mt-3 flex flex-col gap-2">
            <div className="flex gap-2">
              <input readOnly className={`${inputCls} w-full font-mono text-[11px]`} value={link} onFocus={(e) => e.target.select()} />
              <button
                type="button"
                onClick={() => copiar(link, "pres")}
                className="w-44 shrink-0 rounded-xl bg-limebrand px-4 py-2 text-[12.5px] font-bold text-limeink transition-transform hover:-translate-y-0.5"
              >
                {copiado === "pres" ? "✓ Copiado" : "Copiar presentación"}
              </button>
            </div>
            <div className="flex gap-2">
              <input readOnly className={`${inputCls} w-full font-mono text-[11px]`} value={linkResumen} onFocus={(e) => e.target.select()} />
              <button
                type="button"
                onClick={() => setPreview(true)}
                className="shrink-0 rounded-xl bg-white/10 px-4 py-2 text-center text-[12.5px] font-bold text-white ring-1 ring-white/20 transition-transform hover:-translate-y-0.5"
                title="Previsualizar el resumen antes de enviarlo (se abre aquí mismo)"
              >
                Ver
              </button>
              <button
                type="button"
                onClick={() => copiar(linkResumen, "res")}
                className="w-40 shrink-0 rounded-xl bg-white/10 px-4 py-2 text-[12.5px] font-bold text-white ring-1 ring-white/20 transition-transform hover:-translate-y-0.5"
              >
                {copiado === "res" ? "✓ Copiado" : "Copiar resumen"}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  registrarReunion(config, configAQuery(config));
                  setCopiado("bit");
                  setTimeout(() => setCopiado(""), 1600);
                }}
                className="shrink-0 rounded-xl bg-tealbrand/15 px-4 py-2 text-[12.5px] font-bold whitespace-nowrap text-tealbrand ring-1 ring-tealbrand/30 hover:bg-tealbrand/25"
              >
                {copiado === "bit" ? "✓ Guardada" : "＋ Guardar en bitácora (R)"}
              </button>
              <p className="font-mono text-[9.5px] leading-relaxed text-nightsecond">
                Presentación: la reunión completa · Resumen: 1 página con la propuesta, imprimible a PDF ·
                Bitácora: registro local con estados y export CSV.
              </p>
            </div>
          </div>
        </Seccion>
      </div>

      {/* Previsualización del resumen — dentro de la app, sin
          depender de pestañas nuevas (file:// las puede bloquear) */}
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
              Previsualización · así lo verá el cliente al abrir el link del resumen
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
