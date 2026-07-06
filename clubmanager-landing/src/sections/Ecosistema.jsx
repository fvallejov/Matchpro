import { Reveal, RevealItem, SectionHeading, AccentTitle } from "../ui";
import { useLang } from "../i18n";
import { ECOSISTEMA } from "../links";

/* ─────────────────────────────────────────────────────────────
   8 · Ecosistema — la sección que ningún competidor puede
   copiar, contada como la historia de UN socio. Los productos
   son momentos, no cajas. El producto tiene modo inglés →
   los visuales también se traducen (MK).
   ───────────────────────────────────────────────────────────── */

const MK = {
  es: {
    cerca: "🎾 Canchas cerca de ti",
    reservar: "Reservar",
    recomendado: "★ Recomendado · a 1,2 km · 2 canchas libres hoy",
    otro: "a 4,8 km · sin cupos hoy",
    enVivo: "EN VIVO",
    tu: "Tú",
    break: "PUNTO DE BREAK · JUAN",
    ranking: "RANKING",
    marcador: "MARCADOR · C2",
    set: "SET 2 · EN JUEGO",
    qr: "📱 QR · SIGUE EN VIVO",
    truerank: "TRUERANK",
    pts: "▲ +12 pts",
  },
  en: {
    cerca: "🎾 Courts near you",
    reservar: "Book",
    recomendado: "★ Recommended · 1.2 km away · 2 courts free today",
    otro: "4.8 km away · no slots today",
    enVivo: "LIVE",
    tu: "You",
    break: "BREAK POINT · JUAN",
    ranking: "RANKING",
    marcador: "SCORE · C2",
    set: "SET 2 · IN PLAY",
    qr: "📱 QR · FOLLOW LIVE",
    truerank: "TRUERANK",
    pts: "▲ +12 pts",
  },
};

function VisualApp({ m }) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-nightline bg-night p-2.5">
      <p className="text-[9px] font-bold text-nightink">{m.cerca}</p>
      <div className="mt-1.5 flex flex-1 flex-col gap-1">
        <div className="rounded-lg bg-limebrand/10 px-2 py-1.5 ring-1 ring-limebrand/50">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold text-limebrand">Club Los Aromos</p>
            <span className="rounded-full bg-limebrand px-1.5 py-px text-[7px] font-bold text-limeink">
              {m.reservar}
            </span>
          </div>
          <p className="mt-0.5 text-[8px] text-nightsecond">{m.recomendado}</p>
        </div>
        <div className="rounded-lg bg-nightcard px-2 py-1.5 opacity-55">
          <p className="text-[9px] font-semibold text-nightink">Pádel Norte</p>
          <p className="text-[8px] text-nightsecond">{m.otro}</p>
        </div>
      </div>
    </div>
  );
}

function VisualWatch({ m }) {
  return (
    /* Réplica del marcador real de scorematch.app */
    <div className="flex h-full items-center justify-center rounded-xl border border-nightline bg-[#07090a] p-2">
      <div className="relative">
        <span className="haptic-ring absolute -inset-1 rounded-[1.6rem] ring-2 ring-limebrand/40" aria-hidden="true" />
        <div className="relative w-28 rounded-[1.4rem] border-[3px] border-[#26262b] bg-black px-2.5 pt-1.5 pb-2 shadow-xl">
          <span className="absolute top-4 -right-[5px] h-4 w-[3px] rounded-sm bg-[#3a3a3f]" aria-hidden="true" />
          <span className="absolute top-10 -right-[4px] h-2.5 w-[2px] rounded-sm bg-[#3a3a3f]" aria-hidden="true" />
          <div className="flex items-center justify-between font-mono text-[6px]">
            <span className="font-bold text-limebrand">18:42</span>
            <span className="flex items-center gap-0.5 tracking-widest text-mint">
              <span className="h-1 w-1 rounded-full bg-mint" /> {m.enVivo}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <div>
              <p className="text-[7.5px] font-bold text-white">
                <span className="text-limebrand">●</span> {m.tu}
              </p>
              <p className="font-mono text-[7px] text-white/50">
                6 4 <span className="font-bold text-limebrand">4</span>
              </p>
            </div>
            <span className="text-[24px] leading-none font-extrabold text-limebrand">40</span>
          </div>
          <div className="relative my-1.5 h-px bg-white/15">
            <span
              className="absolute top-1/2 left-1/2 h-1.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-tealbrand"
              aria-hidden="true"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[7.5px] font-bold text-white/70">○ Juan</p>
              <p className="font-mono text-[7px] text-white/50">
                4 6 <span className="font-bold text-white/85">3</span>
              </p>
            </div>
            <span className="text-[24px] leading-none font-extrabold text-white/55">Ad</span>
          </div>
          <p className="mt-1.5 rounded-full bg-white/85 px-1.5 py-[2px] text-center text-[5px] font-bold tracking-[0.12em] text-black">
            {m.break}
          </p>
        </div>
      </div>
    </div>
  );
}

function VisualTV({ m, lang }) {
  return (
    /* Réplica del modo TV real */
    <div className="flex h-full flex-col items-center justify-center rounded-xl border border-nightline bg-night p-2">
      <div className="w-full max-w-[170px]">
        <div className="rounded-md border border-[#2c2c31] bg-[#05070a] p-1.5 shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-[7px] font-bold text-nightink">CLUB LOS AROMOS</p>
            <p className="flex items-center gap-1 font-mono text-[6.5px] text-loss">
              <span className="h-1 w-1 animate-pulse rounded-full bg-loss" /> {m.enVivo}
            </p>
          </div>
          <div className="mt-1 grid grid-cols-2 gap-1">
            <div className="rounded-sm bg-nightcard p-1">
              <p className="font-mono text-[5.5px] text-nightsecond">{m.ranking}</p>
              {[
                ["1", "V. Contreras"],
                ["2", lang === "es" ? "Martín R. ←" : "Martín R. ←"],
              ].map(([p, n]) => (
                <p key={p} className="mt-0.5 flex items-center gap-1 font-mono text-[6.5px] text-nightink">
                  <span
                    className={`flex h-2.5 w-2.5 items-center justify-center rounded-full text-[5.5px] font-bold ${
                      p === "1" ? "bg-limebrand text-limeink" : "bg-nightline"
                    }`}
                  >
                    {p}
                  </span>
                  {n}
                </p>
              ))}
            </div>
            <div className="rounded-sm bg-nightcard p-1">
              <p className="font-mono text-[5.5px] text-nightsecond">{m.marcador}</p>
              <p className="mt-0.5 font-mono text-[9px] font-bold text-nightink">
                6–4 <span className="text-limebrand">40–30</span>
              </p>
              <p className="font-mono text-[5.5px] text-nightsecond">{m.set}</p>
            </div>
          </div>
          <div className="mt-1 flex items-center justify-between border-t border-nightline/60 pt-1">
            <p className="font-mono text-[5.5px] text-nightsecond">{m.qr}</p>
            <p className="font-mono text-[5.5px] text-nightsecond">MATCHPRO tv</p>
          </div>
        </div>
        <div className="mx-auto h-1.5 w-6 rounded-b-sm bg-[#2c2c31]" aria-hidden="true" />
        <div className="mx-auto h-0.5 w-12 rounded-full bg-[#2c2c31]" aria-hidden="true" />
      </div>
    </div>
  );
}

function VisualTrueRank({ m }) {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-xl border border-nightline bg-night p-3">
      <p className="font-mono text-[9px] text-nightsecond">{m.truerank}</p>
      <p className="mt-1 font-mono text-2xl font-bold text-nightink">1.475</p>
      <p className="mt-1 font-mono text-[9px] font-semibold text-win">{m.pts}</p>
    </div>
  );
}

export default function Ecosistema() {
  const { t, lang } = useLang();
  const m = MK[lang];
  const links = [ECOSISTEMA.matchpro, ECOSISTEMA.scorematch, ECOSISTEMA.tv, null];
  const visuales = [
    <VisualApp key="app" m={m} />,
    <VisualWatch key="watch" m={m} />,
    <VisualTV key="tv" m={m} lang={lang} />,
    <VisualTrueRank key="tr" m={m} />,
  ];

  return (
    <section id="ecosistema" className="night-cm relative overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          dark
          eyebrow={t.ecosistema.eyebrow}
          title={<AccentTitle parts={t.ecosistema.title} />}
          sub={t.ecosistema.sub}
        />

        <Reveal staggered className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.ecosistema.momentos.map(({ producto, badge, t: titulo, d }, i) => (
            <RevealItem
              key={producto}
              className="flex flex-col rounded-2xl border border-nightline bg-nightcard/60 p-5 transition-transform duration-150 hover:-translate-y-1"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-sm font-semibold text-tealbrand">
                  0{i + 1}
                </span>
                <span className="eyebrow text-nightsecond">{producto}</span>
              </div>
              <div className="mt-4 h-36">{visuales[i]}</div>
              <h3 className="mt-4 flex flex-wrap items-center gap-2 text-base font-bold text-nightink">
                {titulo}
                {badge && (
                  <span className="rounded-full bg-limebrand px-2 py-0.5 text-[10px] font-bold text-limeink">
                    {badge}
                  </span>
                )}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-nightsecond">{d}</p>
              {links[i] && (
                <a
                  href={links[i]}
                  className="mt-4 text-sm font-semibold text-tealbrand transition-colors hover:text-mint"
                >
                  {t.ecosistema.conocer}
                </a>
              )}
            </RevealItem>
          ))}
        </Reveal>

        <Reveal className="mt-12 text-center">
          <p className="mx-auto max-w-2xl text-lg font-semibold text-balance text-nightink">
            {t.ecosistema.cierre1}{" "}
            <span className="text-nightsecond">{t.ecosistema.cierre2}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
