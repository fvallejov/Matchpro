// Problema — diagnóstico por PERFIL de club. No todos los clubes
// tienen el mismo problema: el presentador elige el perfil en
// vivo (o lo preconfigura en Preparar) y los dolores cambian.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE } from "../motion";
import { Reveal } from "../ui";
import { useClub } from "../club";

export const PERFILES = {
  planillas: {
    label: "Personas y planillas",
    sub: "Cuaderno, WhatsApp y Excel — todo depende de alguien",
    dolores: [
      ["📓", "Doble arriendo de canchas", "Dos reservas para la misma hora porque el cuaderno y el WhatsApp no conversan. El socio que llega y no puede jugar no siempre vuelve."],
      ["💸", "Pagos no anotados", "Transferencias que nadie registró, morosidad invisible y cobros incómodos meses después."],
      ["🧍", "Todo depende de una persona", "Si el administrador se enferma o se va, el club queda ciego: la operación vive en su cabeza."],
      ["🏆", "La competencia se apaga", "Rankings en la pizarra, resultados que se pierden y socios que dejan de desafiar."],
    ],
  },
  software: {
    label: "Ya usa un software",
    sub: "Automatizado, pero caro o incompleto",
    dolores: [
      ["💰", "Paga caro por solo reservas", "UF 5 o más al mes por un calendario. Torneos, escalerillas y pantallas siguen a mano o no existen."],
      ["🧩", "La competencia vive fuera", "El software agenda canchas, pero la vida deportiva del club — desafíos, rankings, torneos — no cabe en él."],
      ["📉", "Costos que crecen con el club", "Cobros por socio, módulos extra o comisiones sobre arriendos: crecer sale caro."],
      ["🔒", "Datos encerrados", "La información del club vive en una herramienta que no conversa con nada más."],
    ],
  },
  mixto: {
    label: "Automatización parcial",
    sub: "Varias herramientas sueltas que no conversan",
    dolores: [
      ["🔀", "Un sistema para cada cosa", "Reservas en una app, pagos por transferencia, torneos en Excel, avisos por WhatsApp. Nada conectado."],
      ["🧮", "Conciliación manual", "Fin de mes cruzando la cartola del banco contra tres planillas para saber qué se pagó."],
      ["🌫️", "Sin foto consolidada", "Ocupación, ingresos y morosidad viven en lugares distintos: las decisiones se toman a ciegas."],
      ["🔑", "Cada proceso con su clave", "Cuentas, contraseñas y formatos distintos. Capacitar a alguien nuevo toma semanas."],
    ],
  },
};

export default function Problema() {
  const club = useClub();
  const [perfil, setPerfil] = useState(club.perfil in PERFILES ? club.perfil : "planillas");
  const P = PERFILES[perfil];

  return (
    <section className="hero-night-cm relative flex h-full items-center overflow-hidden">
      <div className="aurora-blob aurora-a top-[-12%] left-[-6%] h-96 w-96 bg-tealbrand/15" aria-hidden="true" />
      <div className="aurora-blob aurora-b right-[-8%] bottom-[-20%] h-80 w-80 bg-limebrand/10" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-6xl px-10">
        <Reveal>
          <p className="eyebrow text-tealbrand">Diagnóstico</p>
          <h2 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-balance text-white">
            ¿Cómo opera <em className="text-limebrand">{club.corto}</em> hoy?
          </h2>
        </Reveal>

        {/* Selector de perfil — se usa EN VIVO: que el club se reconozca */}
        <Reveal className="mt-6 grid gap-2.5 sm:grid-cols-3">
          {Object.entries(PERFILES).map(([id, p]) => (
            <button
              key={id}
              type="button"
              onClick={() => setPerfil(id)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                perfil === id
                  ? "border-limebrand bg-limebrand/10 shadow-[0_0_28px_rgba(187,244,81,0.18)]"
                  : "border-nightline bg-nightcard/70 hover:border-nightsecond"
              }`}
            >
              <span className="flex items-center justify-between">
                <span className={`text-[14.5px] font-bold ${perfil === id ? "text-limebrand" : "text-white"}`}>
                  {p.label}
                </span>
                <span
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    perfil === id ? "bg-limebrand shadow-[0_0_10px_rgba(187,244,81,0.8)]" : "bg-white/15"
                  }`}
                  aria-hidden="true"
                />
              </span>
              <span className="mt-0.5 block text-[11px] text-nightsecond">{p.sub}</span>
            </button>
          ))}
        </Reveal>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={perfil}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="mt-5 grid gap-3 sm:grid-cols-2"
          >
            {P.dolores.map(([icon, t, d], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.07, duration: 0.3, ease: EASE }}
                className="rounded-2xl bg-nightcard p-5 ring-1 ring-nightline"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-lg ring-1 ring-white/10"
                    aria-hidden="true"
                  >
                    {icon}
                  </span>
                  <h3 className="text-[15px] font-bold text-white">{t}</h3>
                </div>
                <p className="mt-2.5 text-[12.5px] leading-relaxed text-nightsecond">{d}</p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <Reveal>
          <p className="mt-6 text-center font-mono text-[12px] text-nightsecond">
            Puntos de partida distintos, mismo destino:{" "}
            <span className="font-bold text-limebrand">una sola plataforma, sin depender de nadie.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
