// Ecosistema — el diferenciador que ningún software de reservas
// puede copiar. Solo productos que existen hoy.

import { Reveal, RevealItem } from "../ui";
import { useClub } from "../club";

const MOMENTOS = [
  {
    producto: "App MatchPro",
    hora: "18:02",
    t: "La app le recomienda tu club",
    d: "Martín busca cancha. La app le sugiere las de tu club y reserva, pagado, en dos toques. Tu club aparece donde ya están los jugadores.",
  },
  {
    producto: "ScoreMatch · Apple Watch",
    hora: "19:15",
    t: "Marca cada punto desde la muñeca",
    d: "El marcador vive en su Apple Watch. Resultados validados punto a punto, no dictados de memoria al llegar al bar.",
  },
  {
    producto: "MatchPro TV",
    hora: "20:40",
    t: "Su nombre aparece en la TV del lobby",
    d: "Ranking, canchas y marcadores en vivo en cualquier televisor del club. El lobby se vuelve broadcast.",
    badge: "Incluido en tu plan",
  },
  {
    producto: "TrueRank",
    hora: "20:41",
    t: "Su ranking se recalcula solo",
    d: "El nivel no se declara: se juega. Cada resultado confirmado mueve un ranking que nadie puede discutir.",
  },
];

export default function Ecosistema() {
  const club = useClub();
  return (
    <section className="night-cm flex h-full items-center">
      <div className="mx-auto w-full max-w-6xl px-10">
        <Reveal>
          <p className="eyebrow text-tealbrand">El ecosistema MatchPro</p>
          <h2 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-balance text-white">
            {club.corto} no compra un software. <em className="text-limebrand">Enciende una liga.</em>
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] text-nightsecond">
            Esto no lo tiene ningún sistema de reservas: sigue el martes por la noche de Martín, socio
            de tu club.
          </p>
        </Reveal>

        <Reveal staggered className="mt-8 grid gap-3 lg:grid-cols-4">
          {MOMENTOS.map(({ producto, hora, t, d, badge }, i) => (
            <RevealItem key={producto} className="relative flex flex-col rounded-2xl bg-nightcard p-5 ring-1 ring-nightline">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-tealbrand uppercase">
                  {producto}
                </p>
                <span className="font-mono text-[10px] text-nightsecond">{hora}</span>
              </div>
              <h3 className="mt-3 text-[15px] leading-snug font-bold text-white">{t}</h3>
              <p className="mt-2 flex-1 text-[12.5px] leading-relaxed text-nightsecond">{d}</p>
              {badge && (
                <p className="mt-3 inline-block w-fit rounded-full bg-limebrand/15 px-2.5 py-1 text-[10px] font-bold text-limebrand">
                  {badge}
                </p>
              )}
              {i < MOMENTOS.length - 1 && (
                <span
                  className="absolute top-1/2 -right-3 hidden -translate-y-1/2 font-mono text-nightsecond lg:block"
                  aria-hidden="true"
                >
                  →
                </span>
              )}
            </RevealItem>
          ))}
        </Reveal>

        <Reveal>
          <p className="mt-8 text-center font-mono text-[12px] text-nightsecond">
            Actividades del club en la app: <span className="font-bold text-white">gratis para tus socios (plan Free)</span> ·
            MatchPro TV: <span className="font-bold text-white">incluido en tu plan</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
