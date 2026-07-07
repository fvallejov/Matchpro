import { useEffect, useState } from "react";
import { useLang } from "../i18n";

export default function Header() {
  const { t, lang, setLang } = useLang();
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        compact
          ? "border-b border-line/70 bg-white/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-5 transition-all duration-300 ${
          compact ? "h-14" : "h-[68px]"
        }`}
      >
        <a href="#" aria-label="MatchPro">
          <img src="/logo-color-h.svg" alt="MatchPro" className="h-6 w-auto" />
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Principal">
          {t.header.links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="text-sm font-semibold text-ink transition-colors hover:text-inkstrong"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Toggle de idioma — discreto: el protagonista es el CTA */}
          <div className="flex items-center gap-1 font-mono text-[11px] font-semibold tracking-wide">
            {["es", "en"].map((l, i) => (
              <span key={l} className="flex items-center gap-1">
                {i > 0 && (
                  <span className="text-mutedink" aria-hidden="true">
                    /
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  className={`uppercase transition-colors ${
                    lang === l
                      ? "text-inkstrong underline decoration-limebrand decoration-2 underline-offset-4"
                      : "text-mutedink hover:text-inkstrong"
                  }`}
                >
                  {l}
                </button>
              </span>
            ))}
          </div>
          <a
            href="https://getmatchpro.com/login"
            className="hidden text-sm font-semibold text-ink transition-colors hover:text-inkstrong sm:block"
          >
            {t.header.login}
          </a>
          <a
            href="https://getmatchpro.com/app"
            className="rounded-full bg-limebrand px-4 py-2 text-sm font-semibold whitespace-nowrap text-limeink shadow-sm shadow-limebrand/40 transition-transform hover:-translate-y-0.5"
          >
            {t.header.download}
          </a>
        </div>
      </div>
    </header>
  );
}

/** CTA sticky inferior — solo mobile, aparece tras el primer scroll. */
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
      className={`fixed inset-x-0 bottom-0 z-50 p-3 transition-transform duration-300 md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <a
        href="https://getmatchpro.com/app"
        className="block rounded-full bg-limebrand py-3.5 text-center text-base font-bold text-limeink shadow-lg shadow-inkstrong/20"
      >
        {t.header.download}
      </a>
    </div>
  );
}
