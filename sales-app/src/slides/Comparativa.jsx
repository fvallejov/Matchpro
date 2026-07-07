// Comparativa de mercado — datos del benchmark interno 2026.
// Con el pricing plano la tabla es honesta de punta a punta:
// nuestra comisión online se declara, no se esconde.
// Incluye la variante gráfica (cobertura de atributos vs precio,
// del benchmark de 31 atributos).

import { motion } from "framer-motion";
import { Reveal } from "../ui";
import { PLANES } from "../pricing";
import { EASE } from "../motion";

const COLS = ["MatchPro", "EasyCancha", "CourtReserve", "PlayByPoint", "Playtomic"];

const FILAS = [
  {
    label: "Precio mensual",
    vals: [`UF ${PLANES.club.uf} plano`, "UF 5 + IVA", "US$329", "US$400", "≈ US$132"],
    texto: true,
  },
  {
    label: "Costo por socio / jugador",
    vals: ["Ilimitados", "—", "—", "—", "—"],
    texto: true,
  },
  {
    label: "Comisión sobre pagos",
    vals: ["$750 + 4% solo online", "No", "No", "No", "5–15% arriendos"],
    texto: true,
  },
  { label: "Pagos chilenos (Transbank)", vals: [1, 1, 0, 0, 0] },
  { label: "Escalerillas + desafíos", vals: [1, 0, 0, 0, 0] },
  { label: "Motores de torneo", vals: ["9", "1", "1", "1", "Varios"], texto: true },
  { label: "Pantallas en el club (TV)", vals: [1, 0, 0, "Básico", 0] },
  { label: "Gestión por WhatsApp", vals: [1, 0, 0, 0, 0] },
  { label: "Live scoring", vals: [1, 0, 0, 0, "Básico"] },
];

function Celda({ v, destacada }) {
  if (typeof v === "string")
    return (
      <span className={`text-[12px] font-bold ${destacada ? "text-limefg" : "text-inkstrong"}`}>{v}</span>
    );
  if (v === 1)
    return (
      <span className={`text-[13px] font-bold ${destacada ? "text-limefg" : "text-inkstrong"}`}>✓</span>
    );
  return <span className="text-[12px] text-mutedink">—</span>;
}

export default function Comparativa() {
  return (
    <section className="flex h-full items-center bg-white">
      <div className="mx-auto w-full max-w-6xl px-10">
        <Reveal>
          <p className="eyebrow text-limefg">El mercado</p>
          <h2 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-balance text-inkstrong">
            Más capacidades que cualquier actor del rubro.
          </h2>
        </Reveal>

        <Reveal className="mt-7 overflow-hidden rounded-2xl border border-line shadow-lg shadow-inkstrong/5">
          <div className="grid grid-cols-[1.6fr_repeat(5,1fr)]">
            {/* Header */}
            <span className="border-b border-line bg-surface px-4 py-2.5" />
            {COLS.map((c, i) => (
              <span
                key={c}
                className={`border-b px-2 py-2.5 text-center text-[12px] font-extrabold ${
                  i === 0
                    ? "border-limebrand bg-limetint/50 text-limeink"
                    : "border-line bg-surface text-second"
                }`}
              >
                {c}
              </span>
            ))}
            {/* Filas */}
            {FILAS.map(({ label, vals }, f) => (
              <div key={label} className="contents">
                <span
                  className={`flex items-center px-4 py-[9px] text-[12px] font-semibold text-inkstrong ${
                    f % 2 ? "bg-surface/60" : "bg-white"
                  }`}
                >
                  {label}
                </span>
                {vals.map((v, i) => (
                  <span
                    key={i}
                    className={`flex items-center justify-center px-2 py-[9px] text-center ${
                      i === 0 ? "bg-limetint/25" : f % 2 ? "bg-surface/60" : "bg-white"
                    }`}
                  >
                    <Celda v={v} destacada={i === 0} />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <p className="mt-4 flex items-baseline justify-between font-mono text-[10px] text-mutedink">
            <span>
              Precios referenciales de planes comparables — sitios oficiales y propuestas públicas (2026).
            </span>
            <span className="text-[12px] font-bold text-inkstrong">
              Al precio plano más bajo entre plataformas completas.
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Variante gráfica: cobertura de atributos vs precio ──────
   Del benchmark interno de 31 atributos (misma fuente que la
   comparativa en PDF). Altura = atributos presentes; bajo cada
   barra, el precio — más capacidad, menos precio.             */

const BENCH = [
  { nombre: "MatchPro", score: 28, precio: `UF ${PLANES.club.uf} plano`, usd: 135, propio: true },
  { nombre: "Playtomic", score: 24, precio: "US$132 + 5–15%", usd: 132 },
  { nombre: "CourtReserve", score: 23, precio: "US$329", usd: 329 },
  { nombre: "EasyCancha", score: 22, precio: "UF 5 + IVA", usd: 225 },
  { nombre: "PlayByPoint", score: 22, precio: "US$400", usd: 400 },
];

const MAX_SCORE = 31;
const MAX_USD = 430;

export function MercadoGrafico() {
  /* Puntos de la curva de precio (x centrado por columna, y por USD) */
  const pts = BENCH.map(({ usd }, i) => [((i + 0.5) / BENCH.length) * 100, 92 - (usd / MAX_USD) * 84]);

  return (
    <section className="night-cm flex h-full items-center">
      <div className="mx-auto w-full max-w-6xl px-10">
        <Reveal>
          <p className="eyebrow text-tealbrand">Benchmark · 31 atributos</p>
          <h2 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-balance text-white">
            Más capacidades. <em className="text-limebrand">Menos precio.</em>
          </h2>
        </Reveal>

        {/* Curva de precio mensual (USD, referencial) */}
        <Reveal className="relative mt-8 h-24">
          <p className="absolute top-0 left-0 font-mono text-[9.5px] tracking-[0.15em] text-loss/90 uppercase">
            ● Precio mensual (US$, plan comparable)
          </p>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <motion.polyline
              points={pts.map(([x, y]) => `${x},${y}`).join(" ")}
              fill="none"
              stroke="#fb7185"
              strokeWidth="0.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
            />
          </svg>
          {BENCH.map(({ nombre, usd, propio }, i) => (
            <motion.span
              key={nombre}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55 + i * 0.18 }}
              className="absolute -translate-x-1/2"
              style={{ left: `${pts[i][0]}%`, top: `${pts[i][1]}%` }}
            >
              <span
                className={`block h-2.5 w-2.5 -translate-y-1/2 rounded-full ${
                  propio ? "bg-limebrand shadow-[0_0_12px_rgba(187,244,81,0.8)]" : "bg-loss"
                }`}
              />
              <span
                className={`absolute left-1/2 -translate-x-1/2 font-mono text-[11px] font-bold whitespace-nowrap ${
                  propio ? "-top-6 text-limebrand" : "-top-6 text-loss"
                }`}
              >
                US${usd}
              </span>
            </motion.span>
          ))}
        </Reveal>

        {/* Barras de cobertura de atributos */}
        <Reveal className="mt-2">
          <div className="grid grid-cols-5 items-end gap-6" style={{ height: 250 }}>
            {BENCH.map(({ nombre, score, precio, usd, propio }, i) => (
              <div key={nombre} className="flex h-full flex-col items-center justify-end">
                <p className={`mb-2 font-mono text-2xl font-bold ${propio ? "text-limebrand" : "text-white/70"}`}>
                  {score}
                  <span className="text-[11px] text-white/40">/{MAX_SCORE}</span>
                </p>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(score / MAX_SCORE) * 72}%` }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.15 + i * 0.1 }}
                  className={`w-full max-w-28 rounded-t-2xl ${
                    propio
                      ? "bg-gradient-to-t from-limebrand/60 to-limebrand shadow-[0_0_40px_rgba(187,244,81,0.35)]"
                      : "bg-gradient-to-t from-white/10 to-white/25"
                  }`}
                />
                <div className={`mt-3 w-full border-t pt-2 text-center ${propio ? "border-limebrand/50" : "border-nightline"}`}>
                  <p className={`text-[13px] font-bold ${propio ? "text-limebrand" : "text-white"}`}>{nombre}</p>
                  <p className="font-mono text-[10px] text-nightsecond">
                    {precio} <span className="text-white/35">· ≈US${usd}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <p className="mt-5 text-center font-mono text-[10px] text-nightsecond">
            Benchmark interno 2026 · 31 atributos funcionales, sin ponderar · USD referencial (UF{" "}
            {PLANES.club.uf} ≈ US$135) · fuentes: sitios oficiales y propuestas comerciales públicas
          </p>
        </Reveal>
      </div>
    </section>
  );
}
