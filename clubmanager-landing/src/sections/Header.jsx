import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { Lockup } from "../ui";
import { useLang } from "../i18n";
import { DEMO_URL } from "../links";

export default function Header() {
  const { t, lang, setLang } = useLang();
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Arriba del todo el header flota sobre el hero night → texto claro.
     Al hacer scroll se compacta a barra blanca con blur. */
  const dark = !compact && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        compact || open
          ? "border-b border-line/70 bg-white/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-5 transition-all duration-300 ${
          compact ? "h-14" : "h-[68px]"
        }`}
      >
        <a href="#" aria-label="MatchPro Club Manager">
          <Lockup dark={dark} />
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Principal">
          {t.header.links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className={`text-sm font-semibold transition-colors ${
                dark ? "text-nightink hover:text-white" : "text-ink hover:text-inkstrong"
              }`}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Toggle de idioma (patrón V5) */}
          <div
            className={`flex items-center gap-0.5 rounded-full border p-0.5 text-xs font-bold ${
              dark ? "border-nightline bg-white/5" : "border-line bg-white/70"
            }`}
          >
            {["es", "en"].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`rounded-full px-2 py-1 uppercase transition-colors ${
                  lang === l
                    ? "bg-limebrand text-limeink"
                    : dark
                      ? "text-nightsecond hover:text-white"
                      : "text-second hover:text-inkstrong"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <a
            href={DEMO_URL}
            className="hidden rounded-full bg-limebrand px-4 py-2 text-sm font-bold whitespace-nowrap text-limeink shadow-sm shadow-limebrand/30 transition-transform hover:-translate-y-0.5 sm:block"
          >
            {t.header.demo}
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={t.header.menuAria}
            className={`flex h-10 w-10 items-center justify-center rounded-full md:hidden ${
              dark ? "text-white" : "text-inkstrong"
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Barra de progreso de lectura */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-limebrand"
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />

      {/* Menú mobile con anclas */}
      {open && (
        <nav className="border-t border-line/70 bg-white/95 px-5 py-4 backdrop-blur-md md:hidden" aria-label="Menú móvil">
          <ul className="flex flex-col gap-1">
            {t.header.links.map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-base font-semibold text-inkstrong hover:bg-surface"
                >
                  {label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={DEMO_URL}
                className="mt-2 block rounded-full bg-limebrand px-3 py-3 text-center text-base font-bold text-limeink"
              >
                {t.header.demo}
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

/** CTA sticky inferior — solo mobile, tras el primer scroll. */
export function MobileStickyCta() {
  const { t } = useLang();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-300 md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <a
        href={DEMO_URL}
        className="block rounded-full bg-limebrand py-3.5 text-center text-base font-bold text-limeink shadow-lg shadow-inkstrong/30"
      >
        {t.header.demoSticky}
      </a>
    </div>
  );
}
