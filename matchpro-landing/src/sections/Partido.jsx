import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ladderSpring, EASE } from "../motion";
import { Reveal, SectionHeading, PhoneFrame } from "../ui";
import { useLang } from "../i18n";

/* ─────────────────────────────────────────────────────────────
   5 · El partido completo — un partido de martes viajando por
   ScoreMatch (captura) → MatchPro (resultado) → escalerilla.
   Cada beat vive en un panel con gradiente vivo (blobs en
   deriva), el dispositivo flota y hay chips de producto.
   ───────────────────────────────────────────────────────────── */

/* El marcador de scorematch.app, fiel al diseño real:
   pantalla dividida en dos mitades (tocas tu lado y suma),
   cifra gigante, sets a la izquierda, pelota en el divisor.
   Un rally completo en loop: 15/15 → 30/15 → 30/30 → 40/30
   → GAME (y el set sube de 4 a 5).                            */

const SEQ = [
  { tu: "15", ju: "15", scorer: null, setTu: "4" },
  { tu: "30", ju: "15", scorer: "tu", setTu: "4" },
  { tu: "30", ju: "30", scorer: "ju", setTu: "4" },
  { tu: "40", ju: "30", scorer: "tu", setTu: "4" },
  { tu: "GAME", ju: "30", scorer: "tu", setTu: "4", game: true },
  { tu: "0", ju: "0", scorer: null, setTu: "5" },
];

function BigScore({ value, lime, game }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.p
        key={value}
        initial={{ y: 30, opacity: 0, scale: 0.75 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -30, opacity: 0, scale: 0.75 }}
        transition={ladderSpring}
        className={`font-extrabold tracking-tight tabular-nums ${
          game ? "text-4xl" : "text-6xl"
        } ${lime ? "text-limebrand" : "text-[#B9C2CE]"}`}
      >
        {value}
      </motion.p>
    </AnimatePresence>
  );
}

function ScoreWatch() {
  const { t } = useLang();
  const prefersReduced = useReducedMotion();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (prefersReduced) {
      setIdx(1);
      return;
    }
    const interval = setInterval(() => setIdx((i) => (i + 1) % SEQ.length), 1900);
    return () => clearInterval(interval);
  }, [prefersReduced]);

  const s = SEQ[idx];

  return (
    <div className="mx-auto w-64">
      <div className="relative rounded-[2.6rem] border-[8px] border-[#1c1f24] bg-black shadow-2xl shadow-black/50">
        {/* Corona y botón */}
        <span className="absolute top-12 -right-[13px] h-9 w-[5px] rounded-full bg-[#1c1f24]" aria-hidden="true" />
        <span className="absolute top-24 -right-[13px] h-12 w-[5px] rounded-full bg-[#1c1f24]" aria-hidden="true" />

        <div className="rounded-[2.1rem] px-5 pt-4 pb-5">
          {/* Status bar */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold text-limebrand">18:42</span>
            <span className="flex items-center gap-1.5 font-mono text-[9px] font-semibold tracking-[0.15em] text-mint uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-mint" /> En vivo
            </span>
          </div>

          {/* Tu mitad */}
          <div className="relative mt-3 flex items-center justify-between overflow-hidden py-2">
            <AnimatePresence>
              {s.scorer === "tu" && (
                <motion.span
                  key={idx}
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ scale: 4, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute top-1/2 right-8 h-14 w-14 -translate-y-1/2 rounded-full bg-limebrand/50"
                  aria-hidden="true"
                />
              )}
            </AnimatePresence>
            <div>
              <p className="flex items-center gap-1.5 text-sm font-bold text-white">
                <span className="h-2 w-2 rounded-full bg-limebrand" aria-hidden="true" /> Tú
              </p>
              <p className="mt-1.5 font-mono text-sm text-[#8b93a0]">
                6 4 <span className="font-bold text-limebrand">{s.setTu}</span>
              </p>
            </div>
            <BigScore value={s.tu} lime game={s.game} />
          </div>

          {/* Divisor con la pelota */}
          <div className="relative flex items-center" aria-hidden="true">
            <span className="h-px flex-1 bg-white/15" />
            <span className="mx-auto h-4 w-2.5 rounded-full bg-mint" style={{ borderRadius: "50% / 60%" }} />
            <span className="h-px flex-1 bg-white/15" />
          </div>

          {/* Mitad del rival */}
          <div className="relative flex items-center justify-between overflow-hidden py-2">
            <AnimatePresence>
              {s.scorer === "ju" && (
                <motion.span
                  key={idx}
                  initial={{ scale: 0, opacity: 0.4 }}
                  animate={{ scale: 4, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute top-1/2 right-8 h-14 w-14 -translate-y-1/2 rounded-full bg-white/30"
                  aria-hidden="true"
                />
              )}
            </AnimatePresence>
            <div>
              <p className="flex items-center gap-1.5 text-sm font-bold text-white">
                <span className="h-2 w-2 rounded-full border border-[#8b93a0]" aria-hidden="true" /> Juan
              </p>
              <p className="mt-1.5 font-mono text-sm text-[#8b93a0]">
                4 6 <span className="font-bold text-[#B9C2CE]">3</span>
              </p>
            </div>
            <BigScore value={s.ju} />
          </div>
        </div>
      </div>
      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-second">
        <span className="h-1.5 w-1.5 rounded-full bg-mint" aria-hidden="true" /> {t.partido.watchLive}
      </p>
    </div>
  );
}

/* Mini chat del desafío — la coordinación tal como se ve en la app:
   burbujas que van llegando (la propia en lime, como en la app). */
function MiniChat() {
  const { t } = useLang();
  const c = t.partido.chat;
  const bubble = (delay) => ({
    initial: { opacity: 0, y: 10, scale: 0.95 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, margin: "-40px" },
    transition: { delay, duration: 0.35, ease: EASE },
  });

  return (
    <div className="absolute bottom-6 left-4 z-20 w-60 rounded-2xl border border-white/60 bg-white/95 p-3 text-left shadow-xl shadow-inkstrong/15 backdrop-blur sm:left-8">
      <motion.div {...bubble(0.4)} className="flex items-end gap-1.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-mint to-tealbrand text-[9px] font-bold text-night">
          DR
        </span>
        <p className="rounded-2xl rounded-bl-sm bg-surface px-3 py-1.5 text-xs leading-snug text-ink">
          {c.rival}
        </p>
      </motion.div>
      <motion.div {...bubble(1.1)} className="mt-1.5 flex justify-end">
        <p className="rounded-2xl rounded-br-sm bg-limebrand px-3 py-1.5 text-xs font-semibold text-limeink">
          {c.me}
        </p>
      </motion.div>
      <motion.p
        {...bubble(1.8)}
        className="mt-2 rounded-full bg-win/10 px-2.5 py-1 text-center font-mono text-[9px] font-bold tracking-wide text-win uppercase"
      >
        {c.status}
      </motion.p>
    </div>
  );
}

/** Panel con gradiente vivo: blobs en deriva + parallax + dispositivo flotando. */
function BeatVisual({ blobs, children, chip, custom }) {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], prefersReduced ? [0, 0] : [36, -36]);

  return (
    <div
      ref={ref}
      className="grain relative flex items-center justify-center overflow-hidden rounded-[2.5rem] bg-surface px-8 py-14 ring-1 ring-line sm:py-16"
    >
      <div className="absolute inset-0" aria-hidden="true">
        {blobs.map((b, i) => (
          <div key={i} className={`blob ${b}`} />
        ))}
      </div>
      <motion.div style={{ y }} className="floaty relative z-10">
        {children}
      </motion.div>
      {chip && (
        <div className="floaty floaty-delay absolute right-6 bottom-6 z-20 flex items-center gap-2 rounded-2xl border border-white/60 bg-white/90 px-3.5 py-2.5 text-sm font-semibold text-inkstrong shadow-xl shadow-inkstrong/10 backdrop-blur">
          {chip}
        </div>
      )}
      {custom}
    </div>
  );
}

/* Metadata visual por beat; el copy vive en strings.js */
const BEAT_META = [
  {
    blobs: [
      "blob-b -top-16 -left-16 h-72 w-72 bg-limebrand/40",
      "blob-a -right-16 -bottom-16 h-72 w-72 bg-tealbrand/40",
    ],
    visual: "/app/matchmaking.webp",
    custom: <MiniChat />,
  },
  {
    blobs: [
      "blob-a -top-20 -left-16 h-72 w-72 bg-tealbrand/50",
      "blob-b -right-20 bottom-0 h-72 w-72 bg-mint/60",
    ],
    visual: "watch",
    chipIcon: <span className="h-2 w-2 rounded-full bg-win" />,
  },
  {
    blobs: [
      "blob-b -top-16 -right-16 h-72 w-72 bg-mint/70",
      "blob-c -bottom-20 -left-10 h-72 w-72 bg-tealbrand/40",
    ],
    visual: "/app/stats-partido.webp",
    chipIcon: <span className="font-mono text-win">68%</span>,
  },
  {
    blobs: [
      "blob-a -top-20 -left-12 h-72 w-72 bg-mark/80",
      "blob-c -right-16 -bottom-16 h-72 w-72 bg-limebrand/50",
    ],
    visual: "/app/escalerilla.webp",
    chipIcon: <span className="text-win">▲</span>,
  },
];

export default function Partido() {
  const { t } = useLang();
  const c = t.partido;
  return (
    <section id="el-partido" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} sub={c.sub} />

        <div className="mt-16 space-y-16">
          {c.beats.map((b, i) => {
            const m = BEAT_META[i];
            return (
              <Reveal
                key={b.tag}
                className={`grid items-center gap-10 lg:grid-cols-2 ${
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div>
                  <p className="eyebrow text-limefg">{b.tag}</p>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight text-inkstrong text-balance sm:text-3xl">
                    {b.title}
                  </h3>
                  <p className="mt-4 max-w-md text-lg leading-relaxed text-ink">{b.body}</p>
                  {b.note && <p className="mt-3 text-sm text-second">{b.note}</p>}
                  {b.linkLabel && (
                    <a
                      href="https://scorematch.app"
                      className="mt-3 inline-block text-sm font-semibold text-limefg transition-colors hover:text-inkstrong"
                    >
                      {b.linkLabel}
                    </a>
                  )}
                </div>
                <BeatVisual
                  blobs={m.blobs}
                  custom={m.custom}
                  chip={
                    b.chip ? (
                      <>
                        {m.chipIcon} {b.chip}
                      </>
                    ) : null
                  }
                >
                  {m.visual === "watch" ? (
                    <ScoreWatch />
                  ) : (
                    <PhoneFrame src={m.visual} alt={b.alt} className="w-60 sm:w-64" />
                  )}
                </BeatVisual>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
