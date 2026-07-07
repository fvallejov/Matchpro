// ─────────────────────────────────────────────────────────────
// Bitácora de reuniones (tecla R) — Nivel 2 del tracking.
// Guarda en localStorage: SOLO en este navegador. La medición
// de efectividad vive en tu planilla/CRM — de aquí se exporta
// (CSV / fila TSV), no se reemplaza.
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { motion } from "framer-motion";
import { fechaLegible } from "./club";

/** Vencimiento de la propuesta guardada (desde em+val de su query). */
export function vencimientoInfo(r) {
  const q = new URLSearchParams(r.query ?? r.link?.split("?")[1] ?? "");
  const em = q.get("em");
  if (!em) return null;
  const val = Number(q.get("val")) || 30;
  const d = new Date(`${em}T12:00:00`);
  d.setDate(d.getDate() + val);
  const dias = Math.ceil((d - Date.now()) / 86400000);
  return { vence: d.toISOString().slice(0, 10), dias };
}

const KEY = "mp-sales-bitacora";
export const ESTADOS = ["Agendada", "Realizada", "Propuesta enviada", "Ganada", "Perdida"];

const ESTADO_CLS = {
  Agendada: "bg-white/10 text-nightsecond",
  Realizada: "bg-tealbrand/15 text-tealbrand",
  "Propuesta enviada": "bg-pmamber/20 text-pmamber",
  Ganada: "bg-limebrand/20 text-limebrand",
  Perdida: "bg-loss/15 text-loss",
};

export function leerBitacora() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function guardarBitacora(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

/** Base actual del archivo (funciona en file://, localhost y hosteado). */
const baseActual = () => window.location.href.split(/[?#]/)[0];

/** Query almacenada → link completo con la base de HOY (así los
    registros viejos no quedan atados a una ruta antigua). */
export function linkDeRegistro(r) {
  const query = r.query ?? r.link?.split("?")[1] ?? "";
  return `${baseActual()}?${query}`;
}

/** Guarda (o actualiza por club+fecha) la reunión actual. */
export function registrarReunion(config, query) {
  const items = leerBitacora();
  const id = `${config.nombre}|${config.fecha || "sin-fecha"}`;
  const previa = items.find((r) => r.id === id);
  const nueva = {
    id,
    club: config.nombre,
    contacto: config.contacto,
    cargo: config.cargo,
    fono: config.fono,
    fecha: config.fecha,
    estado: previa?.estado ?? "Agendada",
    notas: previa?.notas ?? "",
    query, // solo la query: la base se resuelve al abrir
    ts: Date.now(),
  };
  guardarBitacora([nueva, ...items.filter((r) => r.id !== id)]);
  return nueva;
}

const csvCell = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;

function exportarCSV(items) {
  const head = ["fecha", "club", "contacto", "cargo", "fono", "estado", "notas", "link"];
  const rows = items.map((r) =>
    head.map((h) => csvCell(h === "link" ? linkDeRegistro(r) : r[h])).join(";"),
  );
  const csv = [head.join(";"), ...rows].join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "reuniones-matchpro.csv";
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function Bitacora({ onClose }) {
  const [items, setItems] = useState(leerBitacora);
  const [copiado, setCopiado] = useState("");

  const actualizar = (id, patch) => {
    const next = items.map((r) => (r.id === id ? { ...r, ...patch } : r));
    setItems(next);
    guardarBitacora(next);
  };

  const eliminar = (id) => {
    const next = items.filter((r) => r.id !== id);
    setItems(next);
    guardarBitacora(next);
  };

  const copiarTSV = async (r) => {
    const tsv = [r.fecha, r.club, r.contacto, r.cargo, r.fono, r.estado, r.notas, linkDeRegistro(r)].join("\t");
    try {
      await navigator.clipboard.writeText(tsv);
      setCopiado(r.id);
      setTimeout(() => setCopiado(""), 1500);
    } catch {
      /* sin clipboard */
    }
  };

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
        className="max-h-full w-full max-w-4xl overflow-y-auto rounded-3xl bg-nightcard p-7 ring-1 ring-nightline"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="eyebrow text-tealbrand">Bitácora de reuniones</p>
            <p className="mt-1 font-mono text-[10px] text-nightsecond">
              Guardada SOLO en este navegador · la medición de efectividad vive en tu planilla — exporta desde aquí
            </p>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={() => exportarCSV(items)}
                className="rounded-full bg-tealbrand/15 px-4 py-2 text-[12px] font-bold text-tealbrand ring-1 ring-tealbrand/30 hover:bg-tealbrand/25"
              >
                ↓ Exportar CSV
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-3 py-1.5 font-mono text-[11px] text-nightsecond hover:bg-white/5 hover:text-white"
            >
              Esc
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <p className="mt-8 rounded-2xl bg-white/5 p-6 text-center text-[13px] text-nightsecond ring-1 ring-white/10">
            Sin reuniones registradas. En <span className="font-bold text-white">Preparar (E)</span> completa
            los datos y usa <span className="font-bold text-white">"Guardar en bitácora"</span>.
          </p>
        ) : (
          <div className="mt-5 flex flex-col gap-2.5">
            {items.map((r) => (
              <div key={r.id} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[15px] font-bold text-white">
                      {r.club}
                      {r.contacto && (
                        <span className="ml-2 text-[12px] font-semibold text-nightsecond">
                          {r.contacto}
                          {r.cargo ? ` · ${r.cargo}` : ""}
                        </span>
                      )}
                    </p>
                    <p className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-nightsecond">
                      <span>
                        {r.fecha ? fechaLegible(r.fecha) : "sin fecha"}
                        {r.fono ? ` · ${r.fono}` : ""}
                      </span>
                      {(() => {
                        const v = vencimientoInfo(r);
                        if (!v) return null;
                        const cls =
                          v.dias < 0
                            ? "bg-loss/15 text-loss"
                            : v.dias <= 7
                              ? "bg-pmamber/20 text-pmamber"
                              : "bg-white/10 text-nightsecond";
                        const txt =
                          v.dias < 0
                            ? "propuesta VENCIDA"
                            : v.dias === 0
                              ? "propuesta vence HOY"
                              : v.dias <= 7
                                ? `propuesta vence en ${v.dias} día${v.dias > 1 ? "s" : ""}`
                                : `válida hasta ${fechaLegible(v.vence)}`;
                        return <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${cls}`}>{txt}</span>;
                      })()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ESTADOS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => actualizar(r.id, { estado: e })}
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition-colors ${
                          r.estado === e ? ESTADO_CLS[e] : "text-nightsecond/60 hover:text-white"
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <input
                    value={r.notas}
                    onChange={(e) => actualizar(r.id, { notas: e.target.value })}
                    placeholder="Notas (objeciones, próximos pasos…)"
                    className="min-w-0 flex-1 rounded-xl border border-nightline bg-night px-3 py-1.5 text-[12px] text-white outline-none placeholder:text-nightsecond/50 focus:border-tealbrand"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = linkDeRegistro(r);
                    }}
                    className="rounded-full bg-limebrand px-3 py-1.5 text-[11px] font-bold text-limeink"
                    title="Cargar esta reunión (recarga la app con su configuración)"
                  >
                    Abrir reunión
                  </button>
                  <button
                    type="button"
                    onClick={() => copiarTSV(r)}
                    className="rounded-full border border-nightline px-3 py-1.5 text-[11px] font-semibold text-nightsecond hover:text-white"
                    title="Copia esta reunión como una fila lista para pegar en Excel/Google Sheets (fecha, club, contacto, estado, notas y link)"
                  >
                    {copiado === r.id ? "✓ Copiada" : "⧉ Para planilla"}
                  </button>
                  <button
                    type="button"
                    onClick={() => eliminar(r.id)}
                    className="rounded-full px-2 py-1.5 text-[11px] text-nightsecond/60 hover:text-loss"
                    title="Eliminar"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
