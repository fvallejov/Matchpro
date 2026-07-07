// ─────────────────────────────────────────────────────────────
// Modelo de pricing — fuente única de verdad del kit comercial.
//
// Estructura real del producto (panel de Club Manager, 2026):
//  · Fee plano por tamaño de club (canchas). Jugadores ILIMITADOS.
//  · Comisión por transacción online: $750 + 4% (Transbank)
//    en arriendos y cuotas; torneos 4% + tarifa por participante.
//  · Módulos "incluidos en tu plan".
//
// NEGOCIACIÓN CON BARANDAS: el vendedor puede conceder solo lo
// que está en NEGOCIACION (meses gratis, % por tiempo limitado).
// Las comisiones NO se negocian: cubren el costo Transbank.
// Cualquier concesión fuera de estos rangos se decide aquí
// (negocio), no en la reunión.
// ─────────────────────────────────────────────────────────────

export const UF_CLP = 40000; // valor UF referencial — actualizar

/* Comisión por transacción pagada online (arriendos y cuotas) */
export const COMISION = { fijo: 750, pct: 0.04 };

/* PISO DURO: el costo Transbank es intocable — la comisión
   configurada en Preparar NUNCA puede quedar bajo esto (se
   clampa en código, la URL tampoco puede saltárselo).
   TODO(negocio): ajustar al contrato Transbank vigente. */
export const COMISION_PISO = { fijo: 0, pct: 0.0295 };
export const TICKET_DEFAULT = 15000; // ticket promedio por transacción (supuesto editable en Preparar)

export const DESC_ANUAL = 0.15; // pago anual: −15% sobre el fee

/* Concesiones sancionadas — el menú del vendedor */
export const NEGOCIACION = {
  mesesGratis: [0, 1, 2, 3], // meses sin fee al partir (comisiones corren igual)
  descuentos: [0, 0.1, 0.2, 0.3], // % sobre el fee…
  duraciones: [3, 6, 12], // …por tiempo limitado (meses). Nunca permanente.
};

export const PLANES = {
  competencia: {
    id: "competencia",
    nombre: "Competencia",
    uf: 1.5,
    tag: "Solo competencia",
    detalle: "Escalerillas, desafíos, torneos y MatchPro TV",
    incluye: ["Escalerillas y desafíos", "Torneos ilimitados", "MatchPro TV", "Jugadores ilimitados"],
  },
  club: {
    id: "club",
    nombre: "Club",
    uf: 3,
    tag: "Hasta 6 canchas",
    detalle: "Gestión integral, todo incluido",
    incluye: [
      "Arriendos y reservas online",
      "Cuotas de membresía",
      "Cobros con Transbank",
      "Torneos y escalerillas",
      "Gestión de socios",
      "Finanzas y reportes",
      "MatchPro TV",
      "Jugadores ilimitados",
    ],
  },
  clubpro: {
    id: "clubpro",
    nombre: "Club Pro",
    uf: 5,
    tag: "7+ canchas o multisede",
    detalle: "Todo incluido + soporte prioritario",
    incluye: [
      "Todo lo del plan Club",
      "Soporte prioritario",
      "Onboarding asistido",
      "Jugadores ilimitados",
    ],
  },
};

export const planPorCanchas = (n) => (n <= 6 ? PLANES.club : PLANES.clubpro);

export const clp = (n) => "$" + Math.round(n).toLocaleString("es-CL");
export const ufa = (uf) => uf.toLocaleString("es-CL", { maximumFractionDigits: 1 });

/** Comisión de UNA transacción online. */
export function comisionTx(monto, c = COMISION) {
  return c.fijo + monto * c.pct;
}

/** Comisión online mensual estimada: n transacciones × fijo + % del GMV.
    `c` permite la comisión configurada para la reunión (Preparar). */
export function comisionMensual(gmv, ticket = TICKET_DEFAULT, c = COMISION) {
  if (!gmv || gmv <= 0) return 0;
  const n = ticket > 0 ? gmv / ticket : 0;
  return n * c.fijo + gmv * c.pct;
}

/** Cálculo central: un solo lugar para la matemática comercial. */
export function cotizar({ canchas, gmv = 0, ticket = TICKET_DEFAULT, soloCompetencia = false, anual = false, com = COMISION }) {
  const plan = soloCompetencia ? PLANES.competencia : planPorCanchas(canchas);
  const feeUF = anual ? plan.uf * (1 - DESC_ANUAL) : plan.uf;
  const fee = feeUF * UF_CLP;
  const comision = comisionMensual(gmv, ticket, com);
  return { plan, feeUF, fee, comision, total: fee + comision };
}

/** Referencias de mercado para la comparación honesta (2026). */
export const MERCADO = [
  { nombre: "EasyCancha", precio: "UF 5 (~$200.000)", nota: "sin escalerillas, sin TV" },
  { nombre: "Playtomic", precio: "~US$132 + 5–15%", nota: "comisión sobre arriendos" },
  { nombre: "CourtReserve", precio: "US$329", nota: "sin pagos chilenos" },
  { nombre: "PlayByPoint", precio: "US$400", nota: "sin pagos chilenos" },
];
