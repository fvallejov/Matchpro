import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ladderSpring, EASE } from "../motion";
import { StoreBadges, QrCard, PhoneFrame } from "../ui";
import { useLang } from "../i18n";

/* ─────────────────────────────────────────────────────────────
   La escalerilla viva — réplica de la pantalla real de ranking
   de la app ("Club Cordillera"): La Cima con medallas + Tu Zona
   con desafiables (rayo lime) y tu fila destacada. Cada 4 s
   "Tú" sube una posición con spring físico y la lista se
   renumera sola.
   ⚠️ Fotos: pravatar.cc como placeholder — reemplazar.
   ───────────────────────────────────────────────────────────── */

const CIMA = [
  { name: "Martín Salas", photo: "https://i.pravatar.cc/64?img=13", medal: "#F59E0B", crown: true },
  { name: "Rodrigo Tapia", photo: "https://i.pravatar.cc/64?img=33", medal: "#94A3B8" },
  { name: "Esteban Rojas", photo: "https://i.pravatar.cc/64?img=53", medal: "#D97706" },
];

const ZONA_INIT = [
  { id: "cristobal", name: "Cristóbal Pinto", photo: "https://i.pravatar.cc/64?img=18", level: "Avanzado" },
  { id: "tomas", name: "Tomás Reyes", photo: "https://i.pravatar.cc/64?img=51", bolt: true },
  { id: "diego", name: "Diego Soto", photo: "https://i.pravatar.cc/64?img=68", bolt: true },
  { id: "tu", name: "Tú", photo: "https://i.pravatar.cc/64?img=8", you: true },
];

const MedalIcon = ({ color, crown }) => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill={color} aria-hidden="true">
    {crown ? (
      <path d="M2 8l4 4 6-7 6 7 4-4v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8z" />
    ) : (
      <>
        <circle cx="12" cy="15" r="5" />
        <path d="M8 3h3l1.5 5L14 3h3l-3.5 8h-4L8 3z" opacity="0.7" />
      </>
    )}
  </svg>
);

const Bolt = () => (
  <motion.span
    className="flex h-7 w-7 items-center justify-center rounded-full bg-limebrand text-limeink"
    animate={{ scale: [1, 1.12, 1] }}
    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    aria-hidden="true"
  >
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  </motion.span>
);

function LiveLadder() {
  const prefersReduced = useReducedMotion();
  const [zona, setZona] = useState(ZONA_INIT);
  const basePos = 9; // primera posición visible de "Tu zona"

  useEffect(() => {
    if (prefersReduced) return;
    const interval = setInterval(() => {
      setZona((prev) => {
        const idx = prev.findIndex((r) => r.you);
        if (idx <= 1) return ZONA_INIT; // reinicia el loop
        const next = [...prev];
        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [prefersReduced]);

  return (
    <div className="w-full rounded-[2rem] bg-nightcard p-4 shadow-2xl shadow-inkstrong/40 ring-1 ring-nightline">
      {/* Header de la sheet, como en la app */}
      <div className="flex items-center justify-between px-1">
        <div>
          <p className="eyebrow text-limebrand">Desafiar</p>
          <p className="text-base font-extrabold tracking-wide text-nightink italic uppercase">
            Club Cordillera
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-limebrand/10 px-2.5 py-1 text-[10px] font-semibold text-limebrand">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-limebrand opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-limebrand" />
          </span>
          EN VIVO
        </span>
      </div>

      {/* La Cima — top 3 con medallas */}
      <div className="mt-3 flex items-center justify-between px-1">
        <p className="font-mono text-[9px] font-semibold tracking-[0.18em] text-nightsecond uppercase">
          La cima
        </p>
        <p className="text-[10px] text-nightsecond">Top 3</p>
      </div>
      <div className="mt-1.5 divide-y divide-white/[0.06] rounded-2xl bg-white/[0.04] ring-1 ring-nightline">
        {CIMA.map((p, i) => (
          <div key={p.name} className="flex items-center gap-2.5 px-3 py-2">
            <span className="w-7 font-extrabold italic" style={{ color: p.medal }}>
              #{i + 1}
            </span>
            <img
              src={p.photo}
              alt=""
              loading="lazy"
              className="h-8 w-8 rounded-full object-cover ring-2 ring-white/80"
            />
            <span className="flex-1 truncate text-sm font-bold text-nightink">{p.name}</span>
            <MedalIcon color={p.medal} crown={p.crown} />
          </div>
        ))}
      </div>

      {/* Tu Zona — desafiables con rayo + tu fila destacada */}
      <p className="mt-3 px-1 font-mono text-[9px] font-semibold tracking-[0.18em] text-nightsecond uppercase">
        Tu zona
      </p>
      <ul className="mt-1.5 space-y-1">
        {zona.map((r, i) => (
          <motion.li
            key={r.id}
            layout
            transition={ladderSpring}
            className={`relative flex items-center gap-2.5 rounded-xl px-3 py-2 ${
              r.you ? "bg-limebrand/15 ring-1 ring-limebrand/50" : "bg-white/[0.03]"
            }`}
          >
            {(r.bolt || r.you) && (
              <span
                className={`absolute top-1/2 left-0 h-6 w-1 -translate-y-1/2 rounded-full ${
                  r.you ? "bg-tealbrand" : "bg-limebrand"
                }`}
                aria-hidden="true"
              />
            )}
            <motion.span
              layout="position"
              className={`w-9 font-extrabold italic ${r.you ? "text-limebrand" : r.bolt ? "text-limebrand/90" : "text-nightsecond"}`}
            >
              #{basePos + i}
            </motion.span>
            <img
              src={r.photo}
              alt=""
              loading="lazy"
              className="h-8 w-8 rounded-full object-cover ring-2 ring-white/80"
            />
            <span className={`flex-1 truncate text-sm font-bold ${r.you ? "text-limebrand" : "text-nightink"}`}>
              {r.name}
            </span>
            {r.you ? (
              <span className="rounded-full bg-limebrand px-2 py-0.5 font-mono text-[9px] font-bold text-limeink uppercase">
                Tú
              </span>
            ) : r.bolt ? (
              <Bolt />
            ) : (
              <span className="text-[11px] text-nightsecond">{r.level}</span>
            )}
          </motion.li>
        ))}
      </ul>

      <p className="mt-3 text-center text-[10px] text-nightsecond">
        Resultado registrado → la escalerilla se reordena sola
      </p>
    </div>
  );
}

/* ── Clima en vivo (open-meteo, sin API key ni permisos) ────── */
/* El clima decide si se juega — dato real, no decoración.      */

const WMO = (code) => {
  if (code === 0) return ["☀️", 0];
  if (code <= 3) return ["⛅", 1];
  if (code <= 48) return ["🌫️", 2];
  if (code <= 67) return ["🌧️", 3];
  if (code <= 77) return ["🌨️", 4];
  if (code <= 82) return ["🌦️", 5];
  return ["⛈️", 6];
};

function WeatherChip() {
  const { t } = useLang();
  const [w, setW] = useState({ temp: 24, code: 0, live: false });

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-33.45&longitude=-70.66&current=temperature_2m,weather_code",
    )
      .then((r) => r.json())
      .then((d) =>
        setW({
          temp: Math.round(d.current.temperature_2m),
          code: d.current.weather_code,
          live: true,
        }),
      )
      .catch(() => {}); // fallback estático
  }, []);

  const [icon, labelIdx] = WMO(w.code);
  const playable = w.code <= 3;

  return (
    <>
      <span aria-hidden="true">{icon}</span>
      <span>
        {w.temp}° · {t.hero.weather[labelIdx]}
      </span>
      {playable && (
        <span className="rounded-full bg-limebrand px-2 py-0.5 text-[10px] font-bold text-limeink uppercase">
          {t.hero.weatherIdeal}
        </span>
      )}
    </>
  );
}

/* ── Chips flotantes: momentos reales del producto ──────────── */

function FloatChip({ className = "", children, delay = false }) {
  return (
    <div
      className={`floaty ${delay ? "floaty-delay" : ""} absolute z-20 flex items-center gap-2 rounded-2xl border border-white/60 bg-white/90 px-3.5 py-2.5 text-sm font-semibold text-inkstrong shadow-xl shadow-inkstrong/10 backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}

/* ── Hero ───────────────────────────────────────────────────── */

export default function Hero() {
  const { t } = useLang();
  return (
    <section className="grain relative overflow-hidden bg-surface pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Blobs de marca en deriva lenta — mark / mint / teal */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="blob blob-a -top-32 -left-24 h-[28rem] w-[28rem] bg-mark/70" />
        <div className="blob blob-b top-10 right-[-8rem] h-[26rem] w-[26rem] bg-tealbrand/40" />
        <div className="blob blob-c bottom-[-10rem] left-1/3 h-[24rem] w-[24rem] bg-mint/50" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-5 lg:grid-cols-[1fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="relative z-10"
        >
          <p className="eyebrow text-limefg">{t.hero.eyebrow}</p>
          <h1 className="mt-4 max-w-xl text-4xl font-extrabold tracking-tight text-inkstrong text-balance sm:text-5xl lg:text-6xl">
            {t.hero.t1}{" "}
            <span className="relative inline-block">
              <span className="relative z-10 italic">{t.hero.hi}</span>
              <motion.span
                className="absolute inset-x-0 bottom-1 z-0 h-4 origin-left -rotate-1 rounded-sm bg-limebrand"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
                aria-hidden="true"
              />
            </span>
            .
          </h1>
          {/* ink (slate-700) sobre el mesh: nunca slate claro sobre color */}
          <p className="mt-5 max-w-lg text-lg leading-relaxed font-medium text-ink">
            {t.hero.sub}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <StoreBadges />
            <QrCard />
          </div>

          <p className="mt-5 text-sm font-semibold text-ink">{t.hero.micro}</p>
        </motion.div>

        {/* Composición con profundidad: app real + escalerilla viva + momentos flotantes */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          className="relative mx-auto h-[600px] w-full max-w-md sm:h-[660px]"
        >
          <PhoneFrame
            src="/app/home.webp"
            alt={t.hero.phoneAlt}
            eager
            className="absolute top-0 left-0 w-52 rotate-[-4deg] sm:w-56"
          />
          <div className="absolute right-0 bottom-0 w-[290px] sm:w-[320px]">
            <LiveLadder />
          </div>
          <FloatChip className="top-4 -right-1 sm:right-2">
            <span className="text-win">▲</span> {t.hero.chipUp}
          </FloatChip>
          <FloatChip delay className="top-[46%] left-0 sm:-left-4">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-limebrand text-[11px] text-limeink">
              ✓
            </span>
            {t.hero.chipChallenge}
          </FloatChip>
          <FloatChip className="-bottom-3 left-2 sm:left-0">
            <WeatherChip />
          </FloatChip>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Ticker de resultados — el deporte no se detiene ────────── */

export function Ticker() {
  const { t } = useLang();
  const items = [...t.ticker, ...t.ticker];
  return (
    <div className="marquee overflow-hidden border-y border-nightline bg-night py-3" aria-hidden="true">
      <div className="marquee-track flex w-max items-center gap-10">
        {items.map(([a, b], i) => (
          <span key={i} className="flex items-center gap-3 whitespace-nowrap">
            <span className="h-1.5 w-1.5 rounded-full bg-limebrand" />
            <span className="text-sm font-semibold text-nightink">{a}</span>
            <span className="font-mono text-xs text-nightsecond">{b}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
