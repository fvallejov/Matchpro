// ─────────────────────────────────────────────────────────────
// Resumen enviable — UNA página con la propuesta específica.
// Si hay excepción activa, ES la CONTRAPROPUESTA (rotulada).
// Jerarquía: qué pago (héroe) → condición → cómo funciona la
// comisión → qué incluye → aceptar. Imprimible a PDF.
// ─────────────────────────────────────────────────────────────

import { useClub, fechaLegible, fechaVencimiento, estadoValidez } from "./club";
import { cotizar, comisionTx, clp, ufa, DESC_ANUAL } from "./pricing";
import { DEMO_URL, WHATSAPP_NUM, VIDEO_CM } from "./links";
import logoColor from "./assets/logo-oficial-color.svg";

const FECHA = new Date().toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });

export default function Resumen() {
  const club = useClub();
  const com = { fijo: club.cfijo, pct: club.cpct };
  const q = cotizar({ canchas: club.canchas, gmv: club.gmv, ticket: club.ticket, com });
  const netoTicket = Math.max(0, club.ticket - comisionTx(club.ticket, com));
  const pctNeto = club.ticket > 0 ? Math.round((netoTicket / club.ticket) * 100) : 0;

  /* Concesión efectiva: la excepción (si existe) reemplaza al menú */
  const excepcion = club.feex > 0 || club.mgx > 0 || club.dctox > 0;
  const mg = club.mgx || club.mesesGratis || 0;
  const dcto = club.dctox || club.dcto || 0;
  const dm = club.dctox ? club.dmx || 6 : club.dctoMeses;
  const feeFinal = club.feex > 0 ? club.feex : q.fee * (1 - dcto);
  const pctEquiv = club.feex > 0 ? Math.round((1 - club.feex / q.fee) * 100) : Math.round(dcto * 100);
  const hayCondicion = mg > 0 || dcto > 0 || club.feex > 0;
  const vence = fechaLegible(fechaVencimiento(club));
  /* La condición caduca; el documento NO. Vencida: el precio de
     lista queda intacto y el CTA cambia a retomar la conversación. */
  const val = estadoValidez(club);

  /* CTA WhatsApp pre-armado — el "sí" (o el re-enganche) en un toque */
  const aceptarMsg = encodeURIComponent(
    val.vencida
      ? `Hola, la ${excepcion ? "contrapropuesta" : "propuesta"} para ${club.nombre} venció el ${vence} — me gustaría retomarla.`
      : `Hola, acepto la ${excepcion ? "contrapropuesta" : "propuesta"} para ${club.nombre}: Plan ${q.plan.nombre}` +
          (club.feex > 0 ? ` con fee ${clp(feeFinal)}/mes` : dcto > 0 ? ` con −${pctEquiv}% por ${dm} meses` : "") +
          (mg > 0 ? ` y ${mg} mes${mg > 1 ? "es" : ""} gratis` : "") +
          `. Coordinemos la activación.`,
  );
  const aceptarURL = `https://wa.me/${WHATSAPP_NUM}?text=${aceptarMsg}`;

  return (
    <div className="min-h-dvh bg-surface py-10 print:bg-white print:py-0">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-inkstrong/10 print:max-w-none print:rounded-none print:shadow-none">
        {/* Regla de marca: el único gesto de color del documento */}
        <div className="h-1.5 bg-gradient-to-r from-tealbrand via-mint to-limebrand" aria-hidden="true" />

        {/* Cabecera clara — el logo en su integridad natural */}
        <div className="px-10 pt-9 pb-2">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="flex items-center gap-2.5">
                <span
                  className={`rounded-full px-2.5 py-1 font-mono text-[9.5px] font-bold tracking-[0.14em] uppercase ${
                    excepcion ? "bg-pmamber/10 text-pmamber ring-1 ring-pmamber/30" : "bg-limetint text-limeink"
                  }`}
                >
                  {excepcion ? "Contrapropuesta comercial" : "Propuesta comercial"}
                </span>
                <span className="font-mono text-[10.5px] text-mutedink">{FECHA}</span>
              </p>
              <h1 className="mt-3 text-[34px] leading-tight font-extrabold tracking-tight text-inkstrong">
                {club.nombre}
              </h1>
              <p className="mt-0.5 text-sm text-second">
                {club.deportes} · {club.canchas} canchas
                {club.contacto && ` · atención: ${club.contacto}${club.cargo ? ` (${club.cargo})` : ""}`}
              </p>
            </div>
            <img src={logoColor} alt="MatchPro" className="mt-1.5 h-6 w-auto" />
          </div>
        </div>

        <div className="px-10 pb-8">
          {/* Héroe: lo que paga el club */}
          <div className="-mt-0 grid gap-4 border-b border-line py-6 sm:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="text-[11px] font-bold tracking-wide text-second uppercase">
                Plan {q.plan.nombre} · de tu bolsillo
              </p>
              <p className="mt-1 text-5xl font-extrabold tracking-tight text-inkstrong">
                UF {ufa(q.plan.uf)}
                <span className="ml-2 align-middle text-lg font-semibold text-second">≈ {clp(q.fee)}/mes</span>
              </p>
              <p className="mt-1 text-[12.5px] text-second">
                {q.plan.detalle} · jugadores ilimitados · sin permanencia
              </p>
            </div>
            {hayCondicion && val.vencida ? (
              <div className="flex flex-col justify-center rounded-2xl bg-surface px-5 py-4 ring-1 ring-line">
                <p className="text-[10px] font-bold tracking-wide text-second uppercase">
                  Condición para {club.corto}
                </p>
                <p className="mt-0.5 text-2xl font-extrabold tracking-tight text-inkstrong">
                  Vencida el {vence}
                </p>
                <p className="mt-1 text-[12px] leading-snug text-second">
                  El precio de lista sigue vigente. Escríbenos y la retomamos — sin compromiso.
                </p>
              </div>
            ) : hayCondicion ? (
              <div className="flex flex-col justify-center rounded-2xl bg-limetint/60 px-5 py-4 ring-1 ring-limebrand/40">
                <p className="text-[10px] font-bold tracking-wide text-limeink uppercase">
                  {excepcion ? "Condición especial para" : "Condición para"} {club.corto}
                </p>
                {(club.feex > 0 || dcto > 0) && (
                  <p className="mt-0.5 text-3xl font-extrabold tracking-tight text-limeink">
                    {clp(feeFinal)}
                    <span className="text-sm font-bold">/mes</span>
                  </p>
                )}
                <p className="text-[12px] font-bold text-limeink">
                  {club.feex > 0
                    ? `−${pctEquiv}% vs precio de lista`
                    : dcto > 0
                      ? `−${pctEquiv}% por ${dm} meses`
                      : ""}
                  {mg > 0 && `${club.feex > 0 || dcto > 0 ? " · " : ""}${mg} mes${mg > 1 ? "es" : ""} gratis al partir`}
                </p>
                <p className="mt-1 font-mono text-[8.5px] text-limeink/80">
                  {excepcion ? "excepción aprobada por dirección · " : ""}luego precio de lista · válida
                  hasta el {vence}
                  {val.dias !== null && val.dias >= 0 && val.dias <= 7 && (
                    <span className="font-bold">
                      {" "}
                      · {val.dias === 0 ? "vence HOY" : `quedan ${val.dias} día${val.dias === 1 ? "" : "s"}`}
                    </span>
                  )}
                </p>
              </div>
            ) : null}
          </div>

          {/* Cómo funcionan los cobros */}
          <div className="grid gap-x-8 gap-y-3 border-b border-line py-5 sm:grid-cols-3">
            <div>
              <p className="text-[10.5px] font-bold tracking-wide text-second uppercase">Cobros online</p>
              <p className="mt-0.5 text-xl font-extrabold text-inkstrong">
                Te transferimos el {pctNeto}%
              </p>
              <p className="mt-0.5 text-[11.5px] leading-snug text-second">
                Comisión ${club.cfijo} + {Math.round(club.cpct * 1000) / 10}% + IVA descontada de lo
                recaudado — nunca factura aparte. Ej: cobro de {clp(club.ticket)} → recibes {clp(netoTicket)}.
              </p>
            </div>
            <div>
              <p className="text-[10.5px] font-bold tracking-wide text-second uppercase">Implementación</p>
              <p className="mt-0.5 text-xl font-extrabold text-inkstrong">Incluida</p>
              <p className="mt-0.5 text-[11.5px] leading-snug text-second">
                Configuración guiada + migración de datos. Operativo el mismo día.
              </p>
            </div>
            <div>
              <p className="text-[10.5px] font-bold tracking-wide text-second uppercase">Pago anual</p>
              <p className="mt-0.5 text-xl font-extrabold text-inkstrong">−{DESC_ANUAL * 100}%</p>
              <p className="mt-0.5 text-[11.5px] leading-snug text-second">
                Sobre el fee mensual, si prefieres pagar el año completo.
              </p>
            </div>
          </div>

          {/* Incluye */}
          <div className="border-b border-line py-5">
            <p className="text-[10.5px] font-bold tracking-wide text-second uppercase">Tu plan incluye</p>
            <div className="mt-2.5 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
              {q.plan.incluye.map((f) => (
                <p key={f} className="flex items-center gap-2 text-[13.5px] text-ink">
                  <span className="text-limefg" aria-hidden="true">
                    ✓
                  </span>
                  {f}
                </p>
              ))}
            </div>
          </div>

          {/* Condiciones */}
          <p className="py-4 text-[11.5px] leading-relaxed text-second">
            <span className="font-bold text-inkstrong">Condiciones:</span> sin contrato de permanencia ·{" "}
            {val.vencida
              ? `la condición promocional venció el ${vence} — el precio de lista sigue vigente`
              : `válida hasta el ${vence}`}{" "}
            · soporte humano por WhatsApp incluido · MatchPro TV incluido · tus
            socios acceden gratis a las actividades del club en la app MatchPro (plan Free) ·{" "}
            <a href={VIDEO_CM} target="_blank" rel="noreferrer" className="font-bold text-limefg underline">
              mira Club Manager por dentro (video 2 min) ↗
            </a>
          </p>

          {/* Aceptar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-surface px-5 py-4">
            <div className="no-print flex flex-wrap gap-2.5">
              <a
                href={aceptarURL}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-limebrand px-6 py-2.5 text-[14px] font-bold text-limeink shadow-lg shadow-limebrand/30 transition-transform hover:-translate-y-0.5"
              >
                {val.vencida ? "Retomar la conversación →" : `Aceptar ${excepcion ? "contrapropuesta" : "propuesta"} →`}
              </a>
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-line bg-white px-5 py-2.5 text-[13px] font-semibold text-inkstrong"
              >
                Agendar una llamada
              </a>
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-full border border-line bg-white px-4 py-2.5 font-mono text-[11px] text-second"
              >
                ↓ PDF
              </button>
            </div>
            <p className="text-right font-mono text-[9.5px] leading-relaxed text-mutedink">
              {club.vendedor && (
                <>
                  Preparada por {club.vendedor}
                  <br />
                </>
              )}
              getmatchpro.com · @getmatchpro
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
