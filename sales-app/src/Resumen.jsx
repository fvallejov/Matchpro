// ─────────────────────────────────────────────────────────────
// Resumen de propuesta — UNA página enviable/imprimible con los
// datos específicos que espera el cliente después de la reunión.
// Se abre con ?modo=resumen (el link se genera en Preparar).
// ─────────────────────────────────────────────────────────────

import { useClub, fechaLegible, fechaVencimiento } from "./club";
import { cotizar, comisionTx, clp, ufa, DESC_ANUAL } from "./pricing";
import { DEMO_URL, WHATSAPP_URL } from "./links";
import logoColor from "./assets/logo-oficial-color.svg";

const FECHA = new Date().toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });

export default function Resumen() {
  const club = useClub();
  const com = { fijo: club.cfijo, pct: club.cpct };
  const q = cotizar({ canchas: club.canchas, gmv: club.gmv, ticket: club.ticket, com });
  const netoTicket = Math.max(0, club.ticket - comisionTx(club.ticket, com));

  /* Concesión efectiva: la excepción (si existe) reemplaza al menú */
  const mg = club.mgx || club.mesesGratis || 0;
  const dcto = club.dctox || club.dcto || 0;
  const dm = club.dctox ? club.dmx || 6 : club.dctoMeses;
  const feeFinal = club.feex > 0 ? club.feex : q.fee * (1 - dcto);
  const pctEquiv = club.feex > 0 ? Math.round((1 - club.feex / q.fee) * 100) : Math.round(dcto * 100);
  const excepcion = club.feex > 0 || club.mgx > 0 || club.dctox > 0;

  return (
    <div className="min-h-dvh bg-surface py-10 print:bg-white print:py-0">
      <div className="relative mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-xl shadow-inkstrong/10 print:max-w-none print:rounded-none print:shadow-none">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="eyebrow text-limefg">Propuesta comercial · {FECHA}</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-inkstrong">{club.nombre}</h1>
            <p className="text-sm text-second">
              {club.deportes} · {club.canchas} canchas
            </p>
            {(club.contacto || club.fecha) && (
              <p className="mt-1 font-mono text-[11px] text-mutedink">
                {club.contacto && `Atención: ${club.contacto}${club.cargo ? ` · ${club.cargo}` : ""}`}
                {club.contacto && club.fecha && "  ·  "}
                {club.fecha && `reunión del ${fechaLegible(club.fecha)}`}
              </p>
            )}
          </div>
          <img src={logoColor} alt="MatchPro" className="h-5 w-auto" />
        </div>

        {/* Plan y precio */}
        <div className="mt-8 rounded-2xl border border-line bg-surface/60 p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-wide text-second uppercase">Plan {q.plan.nombre}</p>
              <p className="mt-1 text-3xl font-extrabold text-inkstrong">
                UF {ufa(q.plan.uf)} <span className="text-lg font-semibold text-second">≈ {clp(q.fee)}/mes</span>
              </p>
              <p className="text-[12px] text-second">{q.plan.detalle} · jugadores ilimitados · sin permanencia</p>
            </div>
            {(mg > 0 || dcto > 0 || club.feex > 0) && (
              <div className="rounded-xl bg-limetint/60 px-5 py-3 text-right ring-1 ring-limebrand/40">
                <p className="text-[10px] font-bold tracking-wide text-limeink uppercase">
                  Condición para {club.corto}
                </p>
                {club.feex > 0 ? (
                  <p className="text-2xl font-extrabold text-limeink">
                    {clp(feeFinal)}/mes{" "}
                    <span className="text-sm font-bold">(−{pctEquiv}% vs lista)</span>
                  </p>
                ) : dcto > 0 ? (
                  <p className="text-2xl font-extrabold text-limeink">
                    {clp(feeFinal)}/mes <span className="text-sm font-bold">(−{pctEquiv}% por {dm} meses)</span>
                  </p>
                ) : null}
                {mg > 0 && (
                  <p className="text-sm font-bold text-limeink">
                    + {mg} mes{mg > 1 ? "es" : ""} gratis al partir
                  </p>
                )}
                <p className="mt-0.5 font-mono text-[9px] text-limeink/80">
                  {excepcion ? "condición especial · excepción aprobada por dirección" : "según política comercial"} ·
                  luego precio de lista
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 grid gap-x-8 gap-y-2 border-t border-line pt-4 sm:grid-cols-2">
            <p className="text-[13px] text-second">
              <span className="font-bold text-inkstrong">Comisión por pago online:</span> ${club.cfijo} +{" "}
              {Math.round(club.cpct * 1000) / 10}% + IVA — se descuenta de lo recaudado al transferirte,
              no es una factura aparte (ej: de un cobro de {clp(club.ticket)} recibes {clp(netoTicket)}).
              Torneos: 4% + tarifa por participante.
            </p>
            <p className="text-[13px] text-second">
              <span className="font-bold text-inkstrong">Pago anual:</span> −{DESC_ANUAL * 100}% sobre el fee ·{" "}
              <span className="font-bold text-inkstrong">Implementación:</span> incluida (configuración guiada +
              migración de datos, operativo el mismo día).
            </p>
          </div>
        </div>

        {/* Incluye */}
        <div className="mt-6 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
          {q.plan.incluye.map((f) => (
            <p key={f} className="flex items-center gap-2 text-[13.5px] text-ink">
              <span className="text-limefg" aria-hidden="true">
                ✓
              </span>
              {f}
            </p>
          ))}
        </div>

        {/* Condiciones y cierre */}
        <div className="mt-6 rounded-2xl border border-line p-5">
          <p className="text-[12.5px] leading-relaxed text-second">
            <span className="font-bold text-inkstrong">Condiciones:</span> sin contrato de permanencia ·
            propuesta válida hasta el {fechaLegible(fechaVencimiento(club))} · soporte humano por WhatsApp incluido · MatchPro TV incluido ·
            los socios acceden gratis a las actividades del club en la app MatchPro (plan Free).
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="no-print flex gap-3">
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-limebrand px-5 py-2.5 text-[14px] font-bold text-limeink"
            >
              Agendar activación →
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-line px-5 py-2.5 text-[14px] font-semibold text-inkstrong"
            >
              WhatsApp
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full border border-line px-5 py-2.5 font-mono text-[12px] text-second"
            >
              ↓ Guardar PDF
            </button>
          </div>
          <p className="font-mono text-[10px] text-mutedink">getmatchpro.com · @getmatchpro</p>
        </div>
      </div>
    </div>
  );
}
