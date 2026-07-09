// Comparativa de mercado — datos del benchmark interno 2026.
// Con el pricing plano la tabla es honesta de punta a punta:
// nuestra comisión online se declara, no se esconde.
// Incluye la variante gráfica (cobertura de atributos vs precio,
// del benchmark de 31 atributos).

import { motion } from "framer-motion";
import { Reveal, Accent } from "../ui";
import { Icon } from "../icons";
import isotipo from "../assets/isotipo.svg";
import { PLANES } from "../pricing";
import { EASE } from "../motion";

const RIVALES = ["EasyCancha", "CourtReserve", "PlayByPoint", "Playtomic"];

/* [label, MatchPro, ...rivales] · 1 = check, 0 = — , string = texto */
const FILAS = [
  ["Precio mensual", "UF 3 plano", "UF 5 + IVA", "US$329", "US$400", "≈ US$132", true],
  ["Costo por socio", "Ilimitados", "—", "—", "—", "—"],
  ["Comisión sobre pagos", "$750 + 4% solo online", "No", "No", "No", "5–15%"],
  ["Pagos chilenos (Transbank)", 1, 1, 0, 0, 0],
  ["Escalerillas + desafíos", 1, 0, 0, 0, 0],
  ["Motores de torneo", "9", "1", "1", "1", "Varios"],
  ["Pantallas en el club (TV)", 1, 0, 0, "Básico", 0],
  ["Gestión por WhatsApp", 1, 0, 0, 0, 0],
  ["Live scoring", 1, 0, 0, 0, "Básico"],
];

function Celda({ v, hero = false, precio = false }) {
  if (v === 1)
    return hero ? (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-limebrand">
        <Icon name="check" className="h-3 w-3 text-limeink" />
      </span>
    ) : (
      <Icon name="check" className="h-3.5 w-3.5 text-second" />
    );
  if (v === 0 || v === "—") return <span className="text-[12px] text-mutedink">—</span>;
  return (
    <span
      className={`${precio ? "text-[15px]" : "text-[12px]"} font-bold ${hero ? "text-limeink" : precio ? "text-inkstrong" : "text-second"}`}
    >
      {v}
    </span>
  );
}

export default function Comparativa() {
  return (
    <section className="tint-lime flex h-full items-center">
      <div className="mx-auto w-full max-w-6xl px-10">
        <Reveal>
          <p className="eyebrow text-limefg">El mercado</p>
          <h2 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-balance text-inkstrong">
            Más capacidades que <Accent>cualquier actor del rubro.</Accent>
          </h2>
        </Reveal>

        <Reveal className="relative mt-8">
          <div className="grid grid-cols-[1.5fr_1.25fr_repeat(4,1fr)] items-stretch">
            {/* Header */}
            <span className="pb-1" />
            <div className="relative -mt-4 flex flex-col items-center rounded-t-2xl bg-white pt-4 pb-2 shadow-xl shadow-limebrand/20 ring-2 ring-limebrand">
              <img src={isotipo} alt="MatchPro" className="h-6 w-auto" />
              <span className="mt-1 font-mono text-[9px] font-bold tracking-[0.14em] text-limefg uppercase">
                MatchPro
              </span>
            </div>
            {RIVALES.map((r) => (
              <span key={r} className="flex items-end justify-center pb-2 text-[12.5px] font-bold text-second">
                {r}
              </span>
            ))}
            {/* Filas */}
            {FILAS.map(([label, mp, ...resto], f) => {
              const precio = Boolean(resto[4]);
              const vals = resto.slice(0, 4);
              return (
                <div key={label} className="contents">
                  <span className="flex items-center border-t border-line py-[11px] pr-4 text-[12.5px] font-semibold text-inkstrong">
                    {label}
                  </span>
                  <span
                    className={`flex items-center justify-center bg-white py-[11px] ring-2 ring-limebrand ${
                      f === FILAS.length - 1 ? "rounded-b-2xl shadow-xl shadow-limebrand/20" : ""
                    } ${f > 0 ? "border-t border-limetint" : ""}`}
                    style={{ clipPath: f === FILAS.length - 1 ? undefined : "inset(0 -2px 0 -2px)" }}
                  >
                    <Celda v={mp} hero precio={precio} />
                  </span>
                  {vals.map((v, i) => (
                    <span key={i} className="flex items-center justify-center border-t border-line py-[11px]">
                      <Celda v={v} precio={precio} />
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-5 flex items-center justify-between">
            <p className="font-mono text-[10px] text-mutedink">
              Precios referenciales de planes comparables — sitios oficiales y propuestas públicas (2026).
            </p>
            <span className="rounded-full bg-inkstrong px-4 py-1.5 text-[12px] font-bold text-limebrand">
              El precio plano más bajo entre plataformas completas
            </span>
          </div>
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

        {/* .print-figure: en el PDF se imprime como bloque oscuro para
            que las barras y la curva se vean (en papel blanco quedarían
            invisibles) — ver @media print. En pantalla no cambia nada. */}
        <div className="print-figure">
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
                      : "bench-bar-rival bg-gradient-to-t from-white/10 to-white/25"
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
      </div>
    </section>
  );
}
