// ─────────────────────────────────────────────────────────────
// Propuesta y cierre — personalizada con el club y las
// concesiones elegidas en Preparar (meses gratis, descuento por
// tiempo limitado). El precio de lista SIEMPRE es visible.
// ─────────────────────────────────────────────────────────────

import { Reveal, RevealItem, CtaPair, Lockup } from "../ui";
import { useClub, fechaLegible, fechaVencimiento } from "../club";
import { cotizar, clp, ufa } from "../pricing";

const FECHA = new Date().toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });

const COMPROMISOS = [
  ["Sin permanencia", "Usas la plataforma porque te conviene, no porque estás atado."],
  ["Operativo el mismo día", "Configuramos canchas, tarifas y socios contigo. Migramos tus planillas."],
  ["Soporte humano", "Equipo directo por WhatsApp, con experiencia en clubes de raqueta."],
  ["Pagos certificados", "Transbank (PCI DSS), transferencias semanales automáticas al club."],
];

export default function Propuesta() {
  const club = useClub();
  const q = cotizar({ canchas: club.canchas, gmv: club.gmv, ticket: club.ticket, com: { fijo: club.cfijo, pct: club.cpct } });
  /* Concesión efectiva: la excepción (si existe) reemplaza al menú */
  const excepcion = (club.feex ?? 0) > 0 || (club.mgx ?? 0) > 0 || (club.dctox ?? 0) > 0;
  const mg = club.mgx || club.mesesGratis || 0;
  const dcto = club.dctox || club.dcto || 0;
  const dm = club.dctox ? club.dmx || 6 : club.dctoMeses;
  const feeConDcto = q.fee * (1 - dcto);
  const feex = club.feex ?? 0;
  const pctEquiv = feex > 0 ? Math.round((1 - feex / q.fee) * 100) : Math.round(dcto * 100);

  const titulo =
    feex > 0 ? (
      <>
        Contrapropuesta para {club.corto}. <em className="text-limebrand">Condición especial.</em>
      </>
    ) : mg > 0 ? (
      <>
        Parte con {mg} mes{mg > 1 ? "es" : ""} gratis. <em className="text-limebrand">Sin riesgo.</em>
      </>
    ) : dcto > 0 ? (
      <>
        Condiciones preferentes para partir. <em className="text-limebrand">Por tiempo limitado.</em>
      </>
    ) : (
      <>
        Partamos este mes. <em className="text-limebrand">Sin permanencia.</em>
      </>
    );

  return (
    <section className="hero-night-cm relative flex h-full items-center overflow-hidden">
      <div className="aurora-blob aurora-a top-[-10%] right-[-5%] h-96 w-96 bg-tealbrand/20" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-6xl px-10">
        <Reveal staggered>
          <RevealItem>
            <p className="eyebrow text-tealbrand">
              Propuesta para {club.nombre} · {FECHA}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-balance text-white xl:text-4xl">
              {titulo}
            </h2>
          </RevealItem>

          <RevealItem>
            <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
              {/* Oferta */}
              <div className="relative rounded-3xl bg-white p-6 shadow-2xl shadow-black/30">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="eyebrow text-limefg">Plan {q.plan.nombre} · sin permanencia</p>
                    <p className="mt-1 text-2xl font-extrabold tracking-tight text-inkstrong">
                      UF {ufa(q.plan.uf)}
                      <span className="ml-2 text-base font-semibold text-second">≈ {clp(q.fee)}/mes</span>
                    </p>
                    <p className="text-sm text-second">{q.plan.detalle}</p>
                  </div>
                  <span className="rounded-full bg-limetint px-3 py-1.5 text-xs font-bold text-limeink">
                    Jugadores ilimitados
                  </span>
                </div>

                {/* Concesiones de esta propuesta */}
                {(mg > 0 || dcto > 0 || feex > 0) && (
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                    {feex > 0 && (
                      <span className="rounded-full bg-pmamber px-3.5 py-1.5 text-[13px] font-bold text-white">
                        Condición especial: fee {clp(feex)}/mes (−{pctEquiv}% vs lista)
                      </span>
                    )}
                    {mg > 0 && (
                      <span className="rounded-full bg-limebrand px-3.5 py-1.5 text-[13px] font-bold text-limeink">
                        {mg} mes{mg > 1 ? "es" : ""} gratis al partir
                      </span>
                    )}
                    {feex === 0 && dcto > 0 && (
                      <span className="rounded-full bg-limebrand px-3.5 py-1.5 text-[13px] font-bold text-limeink">
                        Fee −{Math.round(dcto * 100)}% por {dm} meses → {clp(feeConDcto)}/mes
                      </span>
                    )}
                    <span className="self-center font-mono text-[10px] text-mutedink">
                      {excepcion ? "excepción a la política · aprobada por dirección · " : ""}
                      luego precio de lista{mg > 0 ? " · comisiones corren desde el día 1" : ""}
                    </span>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-end gap-x-10 gap-y-3 border-t border-line pt-4">
                  <div>
                    <p className="text-xs font-medium text-second">Comisión por pago online</p>
                    <p className="text-xl font-bold text-inkstrong">
                      ${club.cfijo} + {Math.round(club.cpct * 1000) / 10}%
                    </p>
                    <p className="text-[11px] text-second">
                      se descuenta de lo recaudado al transferirte — no es factura aparte
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-second">Implementación</p>
                    <p className="text-xl font-bold text-inkstrong">Incluida</p>
                    <p className="text-[11px] text-second">configuración guiada + migración de datos</p>
                  </div>
                </div>

                <ul className="mt-4 grid gap-x-6 gap-y-1.5 border-t border-line pt-4 text-[13px] text-ink sm:grid-cols-2">
                  {q.plan.incluye.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-limefg" aria-hidden="true">
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Compromisos + CTA */}
              <div className="flex flex-col justify-between gap-5">
                <div className="grid gap-3">
                  {COMPROMISOS.map(([t, d]) => (
                    <div key={t} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                      <p className="text-sm font-bold text-white">{t}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-nightsecond">{d}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <CtaPair dark className="no-print" />
                  <p className="mt-4 font-mono text-[10px] text-nightsecond">
                    Propuesta referencial · válida hasta el {fechaLegible(fechaVencimiento(club))} ·
                    comisión + IVA según transacciones
                  </p>
                </div>
              </div>
            </div>
          </RevealItem>

          <RevealItem>
            <div className="mt-6 flex items-center justify-between border-t border-nightline pt-4">
              <Lockup dark />
              <p className="font-mono text-[11px] text-nightsecond">getmatchpro.com · @getmatchpro</p>
            </div>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
