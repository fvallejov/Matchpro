// Calculadora de precio — lámina WOW del cierre: controles
// limpios a la izquierda, resultado héroe night con glow a la
// derecha. La comparación de mercado vive en sus propias
// láminas (tabla y gráfico) — aquí solo el precio del club.

import { useState } from "react";
import { Reveal, CountUp, Range } from "../ui";
import { useClub } from "../club";
import { cotizar, comisionTx, clp, ufa, UF_CLP, DESC_ANUAL } from "../pricing";

function Control({ label, value, children }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-bold text-inkstrong">{label}</p>
        <p className="font-mono text-sm font-semibold text-limefg">{value}</p>
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange, label, sub }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-colors ${
        checked ? "border-limebrand bg-limetint/40" : "border-line bg-white"
      }`}
    >
      <span>
        <span className="block text-sm font-bold text-inkstrong">{label}</span>
        <span className="block text-xs text-second">{sub}</span>
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-limebrand" : "bg-line"}`}
        aria-hidden="true"
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

export default function Calculadora() {
  const club = useClub();
  const [canchas, setCanchas] = useState(club.canchas);
  const [gmv, setGmv] = useState(club.gmv);
  const [soloCompetencia, setSoloCompetencia] = useState(false);
  const [anual, setAnual] = useState(false);
  /* Máximos consistentes con lo configurado en Preparar */
  const [maxCanchas] = useState(() => Math.max(14, club.canchas));
  const [maxGmv] = useState(() => Math.max(10000000, club.gmv));

  const com = { fijo: club.cfijo, pct: club.cpct };
  const q = cotizar({ canchas, gmv, ticket: club.ticket, soloCompetencia, anual, com });
  const nTrans = club.ticket > 0 ? Math.round(gmv / club.ticket) : 0;
  const netoTicket = Math.max(0, club.ticket - comisionTx(club.ticket, com));
  const pctNeto = club.ticket > 0 ? Math.round((netoTicket / club.ticket) * 100) : 0;
  const transferenciaMes = Math.max(0, gmv - q.comision);

  return (
    <section className="tint-lime flex h-full items-center">
      <div className="mx-auto w-full max-w-6xl px-10">
        <Reveal>
          <p className="eyebrow text-limefg">Precio</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-inkstrong">
            ¿Cuánto costaría para {club.corto}?
          </h2>
        </Reveal>

        <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1fr_1.15fr]">
          {/* Controles */}
          <Reveal className="flex flex-col gap-2.5">
            <Control label="Canchas del club" value={canchas}>
              <Range min={1} max={maxCanchas} value={canchas} onChange={setCanchas} disabled={soloCompetencia} className="mt-2.5" />
              <div className="mt-1 flex justify-between font-mono text-[10px] text-mutedink">
                <span>1</span>
                <span>hasta 6 → Plan Club</span>
                <span>{maxCanchas}</span>
              </div>
            </Control>
            <Control label="Pagos online / mes" value={clp(gmv)}>
              <Range min={0} max={maxGmv} step={250000} value={gmv} onChange={setGmv} className="mt-2.5" />
              <p className="mt-1 font-mono text-[10px] text-mutedink">
                arriendos + cuotas + inscripciones (~{nTrans} transacciones de {clp(club.ticket)})
              </p>
            </Control>
            <Toggle
              checked={soloCompetencia}
              onChange={setSoloCompetencia}
              label="Solo competencia"
              sub="Escalerillas, torneos y TV — sin reservas ni finanzas"
            />
            <Toggle checked={anual} onChange={setAnual} label="Pago anual" sub={`−${DESC_ANUAL * 100}% sobre el fee mensual`} />
          </Reveal>

          {/* Resultado héroe */}
          <Reveal>
            <div className="relative">
              <div className="absolute -inset-5 rounded-[2.5rem] bg-limebrand/15 blur-2xl" aria-hidden="true" />
              <div className="hero-night-cm relative overflow-hidden rounded-3xl p-7 ring-1 ring-limebrand/30">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.18em] text-nightsecond uppercase">
                      Plan sugerido
                    </p>
                    <p className="mt-1 text-3xl font-extrabold tracking-tight text-white">
                      {q.plan.nombre}
                      <span className="ml-2 align-middle font-mono text-[11px] font-semibold text-tealbrand">
                        {q.plan.tag}
                      </span>
                    </p>
                  </div>
                  <span className="rounded-full bg-limebrand px-3 py-1.5 text-xs font-bold text-limeink">
                    Jugadores ilimitados
                  </span>
                </div>

                {/* Lo ÚNICO que sale del bolsillo del club */}
                <div className="mt-6 flex items-end justify-between rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                  <div>
                    <p className="text-[11px] font-medium text-nightsecond">De tu bolsillo · fee mensual</p>
                    <p className="mt-0.5 text-lg font-bold text-white">UF {ufa(q.feeUF)}</p>
                  </div>
                  <CountUp
                    to={Math.round(q.fee)}
                    prefix="$"
                    className="text-5xl font-extrabold tracking-tight text-limebrand drop-shadow-[0_0_24px_rgba(187,244,81,0.4)]"
                  />
                </div>

                {/* Cobros online: transferencia neta, no factura */}
                <div className="mt-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-nightsecond">
                      Cobros online · te transferimos el neto
                    </p>
                    <p className="text-2xl font-extrabold text-tealbrand">{pctNeto}%</p>
                  </div>
                  <p className="mt-1.5 text-[13px] text-nightink">
                    De {clp(gmv)} recaudados por ti, te transferimos{" "}
                    <span className="font-bold text-white">≈ {clp(transferenciaMes)}</span>
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-nightsecond">
                    ej: arriendo de {clp(club.ticket)} → recibes {clp(netoTicket)} · la comisión ($
                    {club.cfijo} + {Math.round(club.cpct * 1000) / 10}%) se descuenta de lo recaudado —
                    nunca es una factura aparte
                  </p>
                </div>

                <ul className="mt-5 grid gap-x-6 gap-y-1 border-t border-white/10 pt-4 text-[12.5px] text-nightink sm:grid-cols-2">
                  {q.plan.incluye.slice(0, 8).map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-limebrand" aria-hidden="true">
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <p className="mt-4 font-mono text-[9px] text-nightsecond">
                  UF = {clp(UF_CLP)} · comisión + IVA solo con pago online · torneos: 4% + tarifa por
                  participante · sin pago online no hay comisión
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
