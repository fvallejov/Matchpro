import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE } from "../motion";
import { Reveal, RevealItem, SectionHeading, StoreBadges, QrCard } from "../ui";
import { useLang } from "../i18n";

/* ── 10 · Testimonios ───────────────────────────────────────── */
/*  ⚠️ PLACEHOLDERS: reemplazar citas Y FOTOS por testimonios
    reales con autorización antes de publicar. Las fotos usan
    pravatar.cc solo como maqueta.                              */

const QUOTE_META = [
  { photo: "https://i.pravatar.cc/96?img=12", rotate: "md:-rotate-2" },
  { photo: "https://i.pravatar.cc/96?img=47", rotate: "md:translate-y-3" },
  { photo: "https://i.pravatar.cc/96?img=59", rotate: "md:rotate-2" },
];

export function Testimonios() {
  const { t } = useLang();
  const c = t.testimonios;
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="blob blob-a top-[-6rem] left-1/2 h-80 w-80 -translate-x-1/2 bg-mark/30" />
      </div>
      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} />
        <Reveal staggered className="mt-14 grid gap-6 md:grid-cols-3">
          {c.quotes.map((q, i) => (
            <RevealItem
              key={q.name}
              className={`${QUOTE_META[i].rotate} group relative flex flex-col rounded-3xl border border-line bg-white p-7 shadow-lg shadow-inkstrong/[0.05] transition-all duration-200 hover:translate-y-0 hover:rotate-0 hover:shadow-xl hover:shadow-inkstrong/10`}
            >
              <span
                className="absolute -top-4 left-6 font-serif text-7xl leading-none text-limebrand select-none"
                aria-hidden="true"
              >
                “
              </span>
              <p className="mt-4 flex-1 leading-relaxed font-medium text-ink">{q.q}</p>
              <div className="mt-6 flex items-center gap-3">
                <span className="relative">
                  <img
                    src={QUOTE_META[i].photo}
                    alt={q.name}
                    loading="lazy"
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-limebrand"
                  />
                  <span
                    className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-limebrand text-[10px] text-limeink ring-2 ring-white"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-inkstrong">{q.name}</p>
                  <p className="truncate text-xs text-second">{q.meta}</p>
                </div>
                <span className="rounded-full bg-limetint px-2.5 py-1 font-mono text-[10px] font-semibold whitespace-nowrap text-limefg">
                  {q.stat}
                </span>
              </div>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ── 11 · FAQ ───────────────────────────────────────────────── */

function FaqItem({ item, open, onToggle }) {
  return (
    <div className="rounded-2xl border border-line bg-white">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-semibold text-inkstrong">{item.q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2, ease: EASE }}
          className="text-xl leading-none text-limefg"
          aria-hidden="true"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 leading-relaxed text-second">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  const { t } = useLang();
  const [open, setOpen] = useState(0);
  return (
    <section className="border-y border-line bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5">
        <SectionHeading eyebrow={t.faq.eyebrow} title={t.faq.title} />
        <Reveal className="mt-10 space-y-3">
          {t.faq.items.map((f, i) => (
            <FaqItem key={f.q} item={f} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ── 12 · CTA final ─────────────────────────────────────────── */

export function CtaFinal() {
  const { t } = useLang();
  return (
    <section className="px-5 py-20 sm:py-28">
      <Reveal className="grain relative mx-auto max-w-6xl overflow-hidden rounded-[3rem] bg-night px-6 py-20 text-center sm:py-24">
        {/* Auroras de marca, tenues sobre el night profundo */}
        <div
          className="aurora bg-[radial-gradient(closest-side,rgba(187,244,81,0.12),transparent)]"
          aria-hidden="true"
        />
        <div
          className="aurora bg-[radial-gradient(closest-side,rgba(52,211,153,0.10),transparent)]"
          style={{ animationDelay: "-8s" }}
          aria-hidden="true"
        />

        <div className="relative">
          <motion.img
            src="/isotipo.svg"
            alt=""
            className="mx-auto h-10"
            aria-hidden="true"
            initial={{ scale: 0, rotate: -12 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          />
          <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-extrabold tracking-tight text-nightink text-balance sm:text-5xl">
            {t.cta.t1}{" "}
            <span className="relative inline-block text-limebrand italic">
              {t.cta.hi}
              <motion.span
                className="absolute inset-x-0 -bottom-1.5 h-1 origin-left rounded-full bg-limebrand"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.4 }}
                aria-hidden="true"
              />
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-nightsecond">{t.cta.sub}</p>
          <div className="mt-9 flex flex-col items-center gap-5">
            <StoreBadges className="justify-center" light />
            <QrCard />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ── 13 · Footer (con el ecosistema completo) ───────────────── */

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="bg-night pb-24 md:pb-10">
      <div className="mx-auto max-w-6xl px-5 pt-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <img src="/logo-blanco-h.svg" alt="MatchPro" className="h-6 w-auto" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-nightsecond">
              {t.footer.tagline}
            </p>
            <div className="mt-5 flex gap-4 text-sm text-nightsecond">
              <a href="https://instagram.com/getmatchpro" className="transition-colors hover:text-nightink">
                Instagram
              </a>
              <a href="https://youtube.com/@getmatchpro" className="transition-colors hover:text-nightink">
                YouTube
              </a>
            </div>
          </div>

          {t.footer.cols.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="eyebrow text-nightsecond">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map(([href, label]) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="text-sm text-nightsecond transition-colors hover:text-nightink"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-nightline pt-6 text-xs text-nightsecond sm:flex-row">
          <p>{t.footer.bottom}</p>
          <p className="font-semibold">{t.footer.motto}</p>
        </div>
      </div>
    </footer>
  );
}
