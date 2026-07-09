import { Reveal, RevealItem, Lockup } from "../ui";
import { useClub, fechaLegible } from "../club";
import logoOficialBlanco from "../assets/logo-oficial-blanco.svg";

const FECHA = new Date().toLocaleDateString("es-CL", { month: "long", year: "numeric" });

export default function Portada() {
  const club = useClub();
  const meta = [
    club.contacto && `Preparada para ${club.contacto}${club.cargo ? ` · ${club.cargo}` : ""}`,
    club.fecha && `Reunión: ${fechaLegible(club.fecha)}`,
  ]
    .filter(Boolean)
    .join("  ·  ");
  return (
    <section className="hero-night-cm relative flex h-full items-center overflow-hidden">
      <div className="aurora-blob aurora-a top-[-10%] right-[-5%] h-96 w-96 bg-tealbrand/20" aria-hidden="true" />
      <div className="aurora-blob aurora-b bottom-[-20%] left-[-8%] h-80 w-80 bg-limebrand/10" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-5xl px-8">
        <Reveal staggered>
          <RevealItem className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-base font-extrabold text-white ring-1 ring-white/20">
              {club.iniciales}
            </span>
            <div>
              <p className="eyebrow text-tealbrand">Propuesta comercial · {FECHA}</p>
              <p className="text-sm font-bold text-white">{club.nombre}</p>
              {meta && <p className="mt-0.5 font-mono text-[10.5px] text-nightsecond">{meta}</p>}
            </div>
          </RevealItem>
          <RevealItem>
            <h1 className="mt-10 max-w-3xl text-4xl leading-[1.06] font-extrabold tracking-tight text-balance text-white sm:text-5xl xl:text-6xl">
              El siguiente nivel de {club.corto} no es deportivo. <em className="text-limebrand">Es operativo.</em>
            </h1>
          </RevealItem>
          <RevealItem>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-nightsecond">
              Reservas, pagos, socios, torneos y ranking en una sola plataforma. Sin planillas. Sin
              desorden. Sin trabajo manual.
            </p>
          </RevealItem>
          <RevealItem>
            <p className="eyebrow mt-8 text-nightsecond">
              MatchPro TV incluido · Pagos con Transbank · Jugadores ilimitados
            </p>
          </RevealItem>
          <RevealItem>
            <div className="mt-12 flex items-center justify-between border-t border-nightline pt-5">
              <span className="flex items-center gap-3">
                <img src={logoOficialBlanco} alt="MatchPro" className="h-5 w-auto" />
                <span className="text-nightline">·</span>
                <Lockup dark className="h-5" />
              </span>
              <p className="no-print font-mono text-[11px] text-nightsecond">
                → avanzar · G índice{!club.cliente && " · E preparar"} · F pantalla completa
              </p>
            </div>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
