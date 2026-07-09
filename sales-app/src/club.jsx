// ─────────────────────────────────────────────────────────────
// Configuración de la reunión — el corazón comercial de la app.
//
// Tres vías, sin backend:
//  1. Presets: CLUBES (un objeto por prospecto) → ?club=<slug>
//  2. Overrides por URL → ?nombre=...&canchas=5&gmv=2500000
//  3. Panel de preparación (tecla E): edita todo y genera el link.
//
// NOTA de integridad: los PRECIOS no se editan aquí ni en el
// panel. Viven en src/pricing.js — cambiarlos es una decisión
// de negocio, no de reunión.
// ─────────────────────────────────────────────────────────────

import { createContext, useContext } from "react";
import { COMISION, COMISION_PISO } from "./pricing";

const CLUBES = {
  demo: {
    slug: "demo",
    nombre: "Club Los Aromos",
    canchas: 8,
    deportes: "Tenis y pádel",
    gmv: 3000000,
  },
  ossandon: {
    slug: "ossandon",
    nombre: "Club Ossandón",
    canchas: 6, // TODO: confirmar número real de canchas
    deportes: "Tenis",
    gmv: 3000000,
  },
};

/* Defaults de la reunión: concesiones y supuestos de proyección */
const REUNION = {
  laminas: null, // null = todas; array de ids = selección del vendedor
  perfil: "planillas", // diagnóstico: planillas | software | mixto
  // Nivel 1 · datos de la reunión (viajan en el link):
  contacto: "", // persona con quien es la reunión
  vendedor: "", // quién está a cargo de la reunión (nuestro lado)
  cargo: "",
  fono: "", // email o teléfono
  fecha: "", // fecha de la reunión (yyyy-mm-dd)
  socios: 120, // n° de socios (para sugerir el GMV: socios × cuota + torneos)
  cuota: 35000, // cuota mensual promedio (CLP)
  // Contrapropuesta / excepción fuera de bandas (todo rotulado y trazado):
  feex: 0, // fee mensual excepcional (CLP)
  mgx: 0, // meses gratis excepcionales (fuera del menú 0–3)
  dctox: 0, // % de descuento excepcional (fuera del menú 10/20/30)
  dmx: 0, // duración excepcional del descuento (meses)
  // Concesiones sancionadas:
  mesesGratis: 0, // meses sin fee al partir (0–3, menú sancionado)
  dcto: 0, // % de descuento sobre el fee (0 / 0.1 / 0.2 / 0.3)
  dctoMeses: 6, // duración del descuento (3 / 6 / 12) — nunca permanente
  // Comisión por pago online (configuración del contrato — editable en Preparar):
  cfijo: COMISION.fijo,
  cpct: COMISION.pct,
  // Validez de la propuesta:
  validez: 30, // días desde la emisión (editable en Preparar)
  em: "", // fecha de emisión (se fija sola al generar el link)
  // Supuestos:
  ticket: 15000, // monto promedio de UNA transacción online (estima el fijo $750 de la comisión)
  horas: 6, // horas muertas recuperadas / semana (supuesto de proyección)
  tarifa: 18000, // tarifa promedio por hora (CLP)
  torneos: 200000, // ingresos por torneos e inscripciones / mes (CLP)
};

export function derivar(nombre) {
  const corto = nombre.replace(/^club\s+/i, "").trim();
  const partes = corto.split(/\s+/);
  const iniciales = (partes.length > 1 ? partes[0][0] + partes[1][0] : corto.slice(0, 2)).toUpperCase();
  return { corto, iniciales };
}

/* ── Links opacos ─────────────────────────────────────────────
   Toda la configuración viaja en UN parámetro (?d=…) codificado
   y con firma de integridad: sin campos legibles ni editables a
   mano. HONESTIDAD TÉCNICA: la sal vive en este archivo — evita
   la edición casual, no es criptografía. Links cortos e
   inviolables de verdad = acortador propio (ver
   shortener-worker.js) cuando la app esté hosteada.          */

const SAL = "mp·sales·2026";

function firmar(texto) {
  let h = 5381;
  for (const c of texto + SAL) h = ((h * 33) ^ c.charCodeAt(0)) >>> 0;
  return h.toString(36);
}

export function empacar(query) {
  const payload = `${query}&h=${firmar(query)}`;
  return btoa(String.fromCharCode(...new TextEncoder().encode(payload)))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function desempacar(d) {
  try {
    const b64 = d.replaceAll("-", "+").replaceAll("_", "/");
    const bin = atob(b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), "="));
    const payload = new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
    const i = payload.lastIndexOf("&h=");
    if (i < 0) return { query: payload, integro: false };
    const query = payload.slice(0, i);
    const h = payload.slice(i + 3);
    return { query, integro: firmar(query) === h };
  } catch {
    return { query: "", integro: false };
  }
}

export function configDesdeURL() {
  return configDesdeQuery(window.location.search);
}

/** Parsea una query (con o sin payload `d=` empacado) a configuración.
 *  La usa la bitácora para aplicar un registro SIN recargar la página. */
export function configDesdeQuery(search) {
  let p = new URLSearchParams(search);
  let alterado = false;
  const d = p.get("d");
  if (d) {
    const { query, integro } = desempacar(d);
    p = new URLSearchParams(query);
    alterado = !integro;
  }
  const base = CLUBES[p.get("club")] ?? CLUBES.demo;
  const num = (k) => (Number(p.get(k)) > 0 ? Number(p.get(k)) : undefined);
  const nombre = p.get("nombre")
    ? /^club/i.test(p.get("nombre"))
      ? p.get("nombre")
      : `Club ${p.get("nombre")}`
    : base.nombre;

  return {
    ...base,
    ...REUNION,
    nombre,
    ...derivar(nombre),
    canchas: num("canchas") ?? base.canchas,
    gmv: num("gmv") ?? base.gmv,
    deportes: p.get("deportes") ?? base.deportes,
    perfil: ["planillas", "software", "mixto"].includes(p.get("perfil")) ? p.get("perfil") : REUNION.perfil,
    contacto: p.get("cto") ?? "",
    vendedor: p.get("vnd") ?? localStorage.getItem("mp-vendedor") ?? "",
    cargo: p.get("cargo") ?? "",
    fono: p.get("fono") ?? "",
    fecha: p.get("fecha") ?? "",
    validez: num("val") ?? REUNION.validez,
    em: p.get("em") ?? "",
    socios: num("soc") ?? REUNION.socios,
    cuota: num("cuo") ?? REUNION.cuota,
    feex: num("feex") ?? 0,
    mgx: num("mgx") ?? 0,
    dctox: Math.min((num("dctox") ?? 0) / 100, 0.9),
    dmx: num("dmx") ?? 0,
    mesesGratis: Math.min(num("mg") ?? REUNION.mesesGratis, 3),
    dcto: Math.min((num("dcto") ?? 0) / 100, 0.3),
    dctoMeses: [3, 6, 12].includes(num("dm")) ? num("dm") : REUNION.dctoMeses,
    cfijo: Math.max(num("cfijo") ?? REUNION.cfijo, COMISION_PISO.fijo),
    cpct: Math.max(
      p.get("cpct") !== null && Number(p.get("cpct")) >= 0 ? Number(p.get("cpct")) / 100 : REUNION.cpct,
      COMISION_PISO.pct,
    ),
    ticket: num("ticket") ?? REUNION.ticket,
    horas: num("horas") ?? REUNION.horas,
    tarifa: num("tarifa") ?? REUNION.tarifa,
    torneos: num("torneos") ?? REUNION.torneos,
    laminas: p.get("laminas") ? p.get("laminas").split(",") : null,
    cliente: p.get("modo") === "cliente", // link enviado: sin paneles internos
    modoResumen: p.get("modo") === "resumen", // el modo viaja dentro del payload empacado
    alterado, // el payload no coincide con su firma → link manipulado
  };
}

/** Serializa la configuración a query string — para "Copiar link". */
export function configAQuery(c) {
  const p = new URLSearchParams();
  p.set("nombre", c.nombre);
  p.set("canchas", c.canchas);
  p.set("gmv", c.gmv);
  if (c.deportes) p.set("deportes", c.deportes);
  if (c.perfil && c.perfil !== REUNION.perfil) p.set("perfil", c.perfil);
  if (c.contacto) p.set("cto", c.contacto);
  if (c.vendedor) p.set("vnd", c.vendedor);
  if (c.cargo) p.set("cargo", c.cargo);
  if (c.fono) p.set("fono", c.fono);
  if (c.fecha) p.set("fecha", c.fecha);
  if (c.validez !== REUNION.validez) p.set("val", c.validez);
  p.set("em", c.em || hoyISO()); // la emisión queda sellada en el link
  if (c.socios !== REUNION.socios) p.set("soc", c.socios);
  if (c.cuota !== REUNION.cuota) p.set("cuo", c.cuota);
  if (c.feex > 0) p.set("feex", c.feex);
  if (c.mgx > 0) p.set("mgx", c.mgx);
  if (c.dctox > 0) {
    p.set("dctox", Math.round(c.dctox * 100));
    p.set("dmx", c.dmx || 6);
  }
  if (c.mesesGratis) p.set("mg", c.mesesGratis);
  if (c.dcto) {
    p.set("dcto", Math.round(c.dcto * 100));
    p.set("dm", c.dctoMeses);
  }
  if (c.cfijo !== REUNION.cfijo) p.set("cfijo", c.cfijo);
  if (c.cpct !== REUNION.cpct) p.set("cpct", +(c.cpct * 100).toFixed(2));
  if (c.ticket !== REUNION.ticket) p.set("ticket", c.ticket);
  p.set("horas", c.horas);
  p.set("tarifa", c.tarifa);
  p.set("torneos", c.torneos);
  if (c.laminas) p.set("laminas", c.laminas.join(","));
  return p.toString();
}

export const hoyISO = () => new Date().toISOString().slice(0, 10);

/** Fecha de vencimiento (ISO) de la propuesta: emisión + validez. */
export function fechaVencimiento(c) {
  const d = new Date(`${c.em || hoyISO()}T12:00:00`);
  d.setDate(d.getDate() + (c.validez ?? 30));
  return d.toISOString().slice(0, 10);
}

/** Estado de la validez sellada en el link. Solo aplica si hay
 *  emisión (em): un link nunca copiado no puede vencer. Es un
 *  chequeo del lado del cliente — el link NO muere: lo que caduca
 *  es la CONDICIÓN; el precio de lista y el CTA siguen vivos. */
export function estadoValidez(c) {
  if (!c.em) return { vencida: false, dias: null, vence: null };
  const vence = fechaVencimiento(c);
  const dias = Math.floor((new Date(`${vence}T23:59:59`) - Date.now()) / 86400000);
  return { vencida: dias < 0, dias, vence };
}

/** Fecha de reunión legible ("14 de agosto") desde yyyy-mm-dd. */
export function fechaLegible(iso) {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00`);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("es-CL", { day: "numeric", month: "long" });
}

const ClubContext = createContext({ ...CLUBES.demo, ...REUNION, ...derivar(CLUBES.demo.nombre) });
export const ClubProvider = ClubContext.Provider;
export const useClub = () => useContext(ClubContext);
