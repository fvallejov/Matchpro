import { motion } from "framer-motion";
import { EASE } from "../motion";
import { Reveal, RevealItem, CountUp, SectionHeading } from "../ui";
import { useLang } from "../i18n";

/* ── 2 · Social proof (solo los números fuertes) ────────────── */

export function SocialProof() {
  const { t } = useLang();
  return (
    <section className="border-b border-line bg-white">
      <Reveal
        staggered
        className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-line px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
      >
        {t.stats.map(([label, to, prefix]) => (
          <RevealItem key={label} className="py-8 text-center">
            <p className="text-4xl font-extrabold tracking-tight text-inkstrong italic">
              <CountUp to={to} prefix={prefix} />
            </p>
            <p className="mt-1 text-sm font-medium text-second">{label}</p>
          </RevealItem>
        ))}
      </Reveal>
    </section>
  );
}

/* ── 3 · El problema (antes de la solución) ─────────────────── */

const PainIcons = {
  chat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 9h8M8 13h5" />
    </svg>
  ),
  level: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  ghost: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M3 3v18h18" />
      <path d="M7 15l4-6 4 3 5-8" strokeDasharray="3 3" />
    </svg>
  ),
  repeat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M17 1l4 4-4 4" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="M7 23l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  ),
};

const PAIN_ROT = ["-rotate-1", "rotate-1", "rotate-1", "-rotate-1"];

export function Problema() {
  const { t } = useLang();
  const c = t.problema;
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* Texto fantasma de fondo — la energía del caos actual */}
      <div
        className="pointer-events-none absolute inset-x-0 top-10 overflow-hidden select-none"
        aria-hidden="true"
      >
        <p className="text-center font-extrabold tracking-tight whitespace-nowrap text-line/60 italic uppercase [font-size:9rem] sm:[font-size:13rem]">
          {c.ghost}
        </p>
      </div>

      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} sub={c.sub} />
        <Reveal staggered className="mt-14 grid gap-5 sm:grid-cols-2">
          {c.pains.map((p, i) => (
            <RevealItem
              key={p.title}
              className={`${PAIN_ROT[i]} rounded-3xl border border-line bg-white p-7 shadow-lg shadow-inkstrong/[0.04] transition-all duration-200 hover:rotate-0 hover:shadow-xl hover:shadow-inkstrong/10`}
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-loss/15 text-[#D42A45]">
                {PainIcons[p.icon]}
              </span>
              <h3 className="mt-4 text-xl font-bold text-inkstrong">{p.title}</h3>
              <p className="mt-2 leading-relaxed text-ink">{p.body}</p>
            </RevealItem>
          ))}
        </Reveal>

        <Reveal className="mt-12 text-center">
          <p className="text-xl font-extrabold text-inkstrong italic sm:text-2xl">
            {c.punch1}{" "}
            <span className="rounded-lg bg-limebrand px-2 py-0.5 not-italic">{c.punch2}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 4 · Cómo funciona (timeline con línea animada) ─────────── */

const StepIcons = {
  download: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  swords: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
};

const STEP_TINT = ["bg-mark/60", "bg-mint/50", "bg-tealbrand/40"];

export function ComoFunciona() {
  const { t } = useLang();
  const c = t.como;
  return (
    <section id="como-funciona" className="border-y border-line bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} sub={c.sub} />

        <div className="relative mt-14">
          {/* Línea conectora que se dibuja con el scroll */}
          <motion.div
            className="absolute top-7 right-[12%] left-[12%] hidden h-0.5 origin-left bg-gradient-to-r from-mark via-mint to-tealbrand md:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: EASE }}
            aria-hidden="true"
          />
          <Reveal staggered className="grid gap-10 md:grid-cols-3 md:gap-5">
            {c.steps.map((s, i) => (
              <RevealItem key={s.title} className="group relative text-center md:px-4">
                <span
                  className={`relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${STEP_TINT[i]} text-limeink ring-4 ring-white transition-transform duration-200 group-hover:-translate-y-1 group-hover:rotate-3`}
                >
                  {StepIcons[s.icon]}
                </span>
                <p className="mt-4 font-mono text-xs font-semibold tracking-[0.18em] text-limefg">
                  {c.step} {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-xl font-bold text-inkstrong">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-xs leading-relaxed text-ink">{s.body}</p>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
