// Proyección — "el club que podría ser", como SIMULADOR con
// supuestos visibles y editables en vivo. Lámina WOW: night,
// número héroe con glow y barras con gradiente. Sigue sin ser
// una promesa: es aritmética con los supuestos del club.

import { useState } from "react";
import { motion } from "framer-motion";
import { Reveal, CountUp, Range } from "../ui";
import { useClub } from "../club";
import { cotizar, comisionMensual, clp } from "../pricing";

const SEMANAS_MES = 4.33;

function SliderDark({ label, value, fmt, min, max, step, onChange, hint }) {
  return (
    <div className="rounded-2xl bg-nightcard p-4 ring-1 ring-nightline">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[13px] font-bold text-white">{label}</p>
        <p className="font-mono text-[13px] font-semibold whitespace-nowrap text-limebrand">{fmt(value)}</p>
      </div>
      <Range min={min} max={max} step={step} value={value} onChange={onChange} dark className="mt-2.5" />
      {hint && <p className="mt-1 font-mono text-[9.5px] text-nightsecond">{hint}</p>}
    </div>
  );
}

export default function Proyeccion() {
  const club = useClub();
  const [horas, setHoras] = useState(club.horas);
  const [tarifa, setTarifa] = useState(club.tarifa);
  const [torneos, setTorneos] = useState(club.torneos);
  /* Máximos consistentes con lo configurado en Preparar */
  const [maxHoras] = useState(() => Math.max(40, club.horas));
  const [maxTarifa] = useState(() => Math.max(30000, club.tarifa));
  const [maxTorneos] = useState(() => Math.max(800000, club.torneos));

  const arriendos = horas * SEMANAS_MES * tarifa;
  const bruto = arriendos + torneos;
  const com = { fijo: club.cfijo, pct: club.cpct };
  /* Neto: la comisión ya viene descontada — es lo que efectivamente
     le transferimos al club por sus ingresos nuevos */
  const adicional = Math.max(0, bruto - comisionMensual(bruto, club.ticket, com));
  const costo = cotizar({ canchas: club.canchas }).fee;
  const ratio = costo > 0 ? adicional / costo : 0;
  const maxBar = Math.max(adicional, costo, 1);

  return (
    <section className="hero-night-cm relative flex h-full items-center overflow-hidden">
      <div className="aurora-blob aurora-a top-[-14%] right-[-6%] h-[28rem] w-[28rem] bg-limebrand/15" aria-hidden="true" />
      <div className="aurora-blob aurora-b bottom-[-22%] left-[-8%] h-80 w-80 bg-tealbrand/20" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-6xl px-10">
        <Reveal>
          <p className="eyebrow text-tealbrand">El club que podría ser</p>
          <h2 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-balance text-white">
            Simulemos {club.corto} <em className="text-limebrand">con tus propios números.</em>
          </h2>
        </Reveal>

        <div className="mt-7 grid items-center gap-8 lg:grid-cols-[1fr_1.15fr]">
          {/* Palancas */}
          <Reveal className="flex flex-col gap-3">
            <SliderDark
              label="Horas muertas recuperadas / semana"
              value={horas}
              fmt={(v) => `${v} h`}
              min={0}
              max={maxHoras}
              step={1}
              onChange={setHoras}
              hint={`reservas públicas por QR + visibilidad 24/7 · ${club.canchas} canchas`}
            />
            <SliderDark label="Tarifa promedio por hora" value={tarifa} fmt={clp} min={8000} max={maxTarifa} step={1000} onChange={setTarifa} />
            <SliderDark
              label="Torneos e inscripciones / mes"
              value={torneos}
              fmt={clp}
              min={0}
              max={maxTorneos}
              step={50000}
              onChange={setTorneos}
              hint="torneos con inscripción y pago online que hoy no se hacen"
            />
            <p className="font-mono text-[9.5px] leading-relaxed text-nightsecond">
              Simulación con supuestos del club — no es promesa de resultados. Los ingresos nuevos se
              muestran NETOS (comisión online ya descontada). No incluye retención de socios (existe,
              no la prometemos en números).
            </p>
          </Reveal>

          {/* Resultado héroe */}
          <Reveal>
            <div className="relative">
              <div
                className="absolute -inset-6 rounded-[2.5rem] bg-limebrand/10 blur-2xl"
                aria-hidden="true"
              />
              <div className="relative rounded-3xl bg-nightcard/90 p-7 ring-1 ring-limebrand/25 backdrop-blur">
                <p className="font-mono text-[11px] tracking-[0.18em] text-nightsecond uppercase">
                  Ingreso adicional NETO estimado / mes
                </p>
                <CountUp
                  to={Math.round(adicional)}
                  prefix="$"
                  className="mt-1 block text-6xl font-extrabold tracking-tight text-limebrand drop-shadow-[0_0_24px_rgba(187,244,81,0.45)]"
                />

                <div className="mt-6 flex flex-col gap-3">
                  <div>
                    <div className="flex justify-between text-[11.5px]">
                      <span className="font-bold text-white">Ingresos nuevos (netos, comisión descontada)</span>
                      <span className="font-mono text-limebrand">{clp(adicional)}</span>
                    </div>
                    <div className="mt-1.5 h-4 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
                      <motion.div
                        animate={{ width: `${(adicional / maxBar) * 100}%` }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-tealbrand via-mint to-limebrand shadow-[0_0_16px_rgba(187,244,81,0.5)]"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11.5px]">
                      <span className="font-bold text-white">Fee mensual (lo único de tu bolsillo)</span>
                      <span className="font-mono text-nightsecond">{clp(costo)}</span>
                    </div>
                    <div className="mt-1.5 h-4 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
                      <motion.div
                        animate={{ width: `${(costo / maxBar) * 100}%` }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-white/30 to-white/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                  <p className="max-w-[55%] text-[13.5px] leading-snug text-nightsecond">
                    {ratio >= 1
                      ? "Por cada peso invertido en la plataforma, vuelven en ingresos nuevos:"
                      : "Con estos supuestos aún no se paga sola — mueve las palancas:"}
                  </p>
                  <p className="font-mono text-5xl font-extrabold text-limebrand">
                    ×{ratio.toLocaleString("es-CL", { maximumFractionDigits: 1 })}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
