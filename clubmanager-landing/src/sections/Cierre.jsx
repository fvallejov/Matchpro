import { useState } from "react";
import { Reveal, RevealItem, SectionHeading, CtaPair, Lockup, AccentTitle } from "../ui";
import { useLang } from "../i18n";
import { ECOSISTEMA, WHATSAPP_URL, DEMO_URL } from "../links";

/* ── 9 · Implementación ─────────────────────────────────────── */

export function Implementacion() {
  const { t } = useLang();
  return (
    <section className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow={t.implementacion.eyebrow}
          title={<AccentTitle parts={t.implementacion.title} />}
          sub={t.implementacion.sub} /* TODO: validar dato con implementaciones reales */
        />
        <Reveal staggered className="mt-12 grid gap-5 sm:grid-cols-3">
          {t.implementacion.pasos.map(([titulo, d], i) => (
            <RevealItem
              key={titulo}
              className="rounded-2xl border border-line bg-white p-6 transition-transform duration-150 hover:-translate-y-1"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-limebrand font-mono text-sm font-bold text-limeink">
                0{i + 1}
              </span>
              <h3 className="mt-4 text-lg font-bold text-inkstrong">{titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-second">{d}</p>
            </RevealItem>
          ))}
        </Reveal>

        {/* CTA en el momento de mayor intención */}
        <Reveal className="mt-12 flex flex-col items-center gap-3">
          <CtaPair />
          <p className="text-sm text-second">{t.implementacion.ctaLinea}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 10 · Confianza ─────────────────────────────────────────── */

export function Confianza() {
  const { t } = useLang();
  return (
    <section className="border-t border-line bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow={t.confianza.eyebrow}
          title={<AccentTitle parts={t.confianza.title} />}
          sub={t.confianza.sub}
        />
        <Reveal staggered className="mt-12 grid gap-5 sm:grid-cols-2">
          {t.confianza.items.map(([titulo, d]) => (
            <RevealItem key={titulo} className="flex gap-4 rounded-2xl border border-line bg-surface/50 p-6">
              <span
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-limetint text-limeink"
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </span>
              <div>
                <h3 className="font-bold text-inkstrong">{titulo}</h3>
                <p className="mt-1 text-sm leading-relaxed text-second">{d}</p>
              </div>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ── 11 · CTA final + FAQ con respuestas concretas ──────────────
   TODO(publicación): validar cada respuesta con datos reales de
   implementación y el modelo comercial vigente antes de publicar. */

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-nightline">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-semibold text-nightink">{q}</span>
        <span
          className={`shrink-0 text-nightsecond transition-transform duration-300 ${open ? "rotate-45" : ""}`}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      {open && <p className="pb-5 text-sm leading-relaxed text-nightsecond">{a}</p>}
    </div>
  );
}

export function CtaFaq() {
  const { t } = useLang();
  return (
    <section id="faq" className="hero-night-cm relative overflow-hidden py-20 sm:py-28">
      <div className="aurora-blob aurora-a top-[-12%] left-[-6%] h-80 w-80 bg-tealbrand/15" aria-hidden="true" />
      <div className="aurora-blob aurora-b right-[-8%] bottom-[-18%] h-72 w-72 bg-limebrand/10" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-limebrand">{t.cierre.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance text-nightink sm:text-5xl">
            <AccentTitle parts={t.cierre.title} />
          </h2>
          <p className="mt-4 text-lg text-nightsecond">{t.cierre.sub}</p>
          <div className="mt-8 flex justify-center">
            <CtaPair dark />
          </div>
        </Reveal>

        <Reveal className="mx-auto mt-20 max-w-2xl">
          <h3 className="eyebrow text-center text-nightsecond">{t.cierre.faqTitle}</h3>
          <div className="mt-6">
            {t.cierre.faqs.map(([q, a]) => (
              <FaqItem key={q} q={q} a={a} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 12 · Footer — de Club Manager ──────────────────────────── */

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-nightline bg-night pt-14 pb-24 md:pb-14">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Lockup dark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-nightsecond">{t.footer.desc}</p>
          </div>

          <nav aria-label={t.footer.producto}>
            <h3 className="eyebrow text-nightsecond">{t.footer.producto}</h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {t.footer.productoLinks.map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="text-nightink transition-colors hover:text-limebrand">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t.footer.ecosistema}>
            <h3 className="eyebrow text-nightsecond">{t.footer.ecosistema}</h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              <li>
                <a href={ECOSISTEMA.matchpro} className="text-nightink transition-colors hover:text-limebrand">
                  {t.footer.matchproJugadores}
                </a>
              </li>
              <li>
                <a href={ECOSISTEMA.scorematch} className="text-nightink transition-colors hover:text-limebrand">
                  ScoreMatch
                </a>
              </li>
              <li>
                <a href={ECOSISTEMA.tv} className="text-nightink transition-colors hover:text-limebrand">
                  MatchPro TV
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label={t.footer.contacto}>
            <h3 className="eyebrow text-nightsecond">{t.footer.contacto}</h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              <li>
                <a href={DEMO_URL} className="text-nightink transition-colors hover:text-limebrand">
                  {t.footer.agendar}
                </a>
              </li>
              <li>
                <a href={WHATSAPP_URL} className="text-nightink transition-colors hover:text-limebrand">
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/getmatchpro"
                  className="text-nightink transition-colors hover:text-limebrand"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-nightline pt-6 sm:flex-row">
          <p className="font-mono text-xs text-nightsecond">
            © {new Date().getFullYear()} MatchPro SpA · {t.footer.copyright}
          </p>
          <p className="font-mono text-xs text-nightsecond">{t.footer.transbank}</p>
        </div>
      </div>
    </footer>
  );
}
