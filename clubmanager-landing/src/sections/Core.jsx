import { useState } from "react";
import { Reveal, RevealItem, SectionHeading, CountUp, AccentTitle } from "../ui";
import { useLang } from "../i18n";

/* ── 2 · Clientes — prueba social ───────────────────────────────
   TODO(publicación): reemplazar por logos y nombres REALES con
   autorización. La métrica agregada también debe validarse.    */

const CLUBES = ["Club Los Aromos", "Pádel Norte", "Rackets Club", "Club del Valle"];

export function Clientes() {
  const { t } = useLang();
  return (
    <section id="clientes" className="border-y border-line bg-white py-12">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal staggered className="flex flex-col items-center gap-6">
          <RevealItem>
            <p className="eyebrow text-center text-second">{t.clientes.eyebrow}</p>
          </RevealItem>
          <RevealItem className="w-full">
            <div className="snap-row flex gap-8 overflow-x-auto px-2 sm:justify-center sm:overflow-visible">
              {CLUBES.map((name) => (
                <span
                  key={name}
                  className="snap-item shrink-0 text-lg font-extrabold tracking-tight whitespace-nowrap text-mutedink transition-colors hover:text-inkstrong"
                >
                  {name}
                </span>
              ))}
            </div>
          </RevealItem>
          <RevealItem>
            <p className="text-center text-sm text-second">
              <CountUp to={14000} prefix="+" className="font-mono font-semibold text-inkstrong" />{" "}
              {t.clientes.stat1} ·{" "}
              <CountUp to={40} className="font-mono font-semibold text-inkstrong" />{" "}
              {t.clientes.stat2}
            </p>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 3 · Problema — antes de cualquier solución ─────────────── */

export function Problema() {
  const { t } = useLang();
  return (
    <section className="night-cm py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          dark
          eyebrow={t.problema.eyebrow}
          title={<AccentTitle parts={t.problema.title} />}
          sub={t.problema.sub}
        />
        <Reveal
          staggered
          className="snap-row mt-12 flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-5 lg:overflow-visible"
        >
          {t.problema.dolores.map(([icon, titulo, d]) => (
            <RevealItem
              key={titulo}
              className="snap-item w-[75%] shrink-0 rounded-2xl border border-nightline bg-nightcard p-5 transition-transform duration-150 hover:-translate-y-1 sm:w-[45%] lg:w-auto"
            >
              <span className="text-2xl" aria-hidden="true">
                {icon}
              </span>
              <h3 className="mt-3 text-base font-bold text-nightink">{titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-nightsecond">{d}</p>
            </RevealItem>
          ))}
        </Reveal>
        <Reveal className="mt-10 text-center">
          <p className="inline-block rounded-full bg-loss/10 px-5 py-2 text-sm font-semibold text-loss">
            {t.problema.pill}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 4 · Video — cómo se ve por dentro + conversión secundaria ──
   Lite embed de YouTube (youtube-nocookie, carga al clic).
   TODO(publicación): conectar el formulario de correo a la
   herramienta de email (hoy solo guarda estado local).         */

const YT_ID = "PYDsLlWsREs";

function LiteYouTube() {
  const { t } = useLang();
  const [play, setPlay] = useState(false);

  if (play) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-2xl border border-nightline shadow-2xl shadow-black/40">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${YT_ID}?autoplay=1&rel=0`}
          title="Club Manager: El salto tecnológico para la gestión de tu club deportivo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlay(true)}
      className="group relative block aspect-video w-full overflow-hidden rounded-2xl border border-nightline bg-nightcard shadow-2xl shadow-black/40"
      aria-label={t.video.playAria}
    >
      <img
        src={`https://i.ytimg.com/vi/${YT_ID}/maxresdefault.jpg`}
        onError={(e) => {
          e.currentTarget.src = `https://i.ytimg.com/vi/${YT_ID}/hqdefault.jpg`;
        }}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
      />
      <span className="absolute inset-0 bg-night/20 transition-colors duration-150 group-hover:bg-night/10" aria-hidden="true" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-limebrand text-limeink shadow-lg shadow-limebrand/30 transition-transform duration-150 group-hover:scale-105">
          <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  );
}

export function Video() {
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section className="bg-night pb-20 sm:pb-28">
      <div className="mx-auto max-w-4xl px-5">
        <SectionHeading
          dark
          eyebrow={t.video.eyebrow}
          title={<AccentTitle parts={t.video.title} />}
          sub={t.video.sub}
        />
        <Reveal className="mt-10">
          <LiteYouTube />
        </Reveal>

        <Reveal className="mt-8">
          {sent ? (
            <p className="text-center text-sm font-semibold text-limebrand">
              {t.video.sent} {email}.
            </p>
          ) : (
            <form
              className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                if (email.includes("@")) setSent(true);
              }}
            >
              <label htmlFor="demo-email" className="sr-only">
                {t.video.emailLabel}
              </label>
              <input
                id="demo-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.video.placeholder}
                className="w-full rounded-full border border-nightline bg-nightcard px-5 py-3 text-sm text-nightink placeholder:text-nightsecond focus:border-tealbrand focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full border border-nightline px-6 py-3 text-sm font-semibold text-nightink transition-colors hover:border-tealbrand hover:text-tealbrand"
              >
                {t.video.enviar}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
