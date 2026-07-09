// ─────────────────────────────────────────────────────────────
// Grupo Jugadores — la app MatchPro como argumento de demanda:
// "no solo administramos tu club: le traemos jugadores".
// Capturas REALES de la app + marcador ScoreMatch vivo
// (heredado de matchpro-landing). Todo enmarcado en el impacto
// para el club, no como tour B2C.
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ladderSpring } from "../motion";
import { Reveal, RevealItem, SlideSplit } from "../ui";
import { useClub } from "../club";
import imgMatchmaking from "../assets/app/matchmaking.webp";
import imgEscalerilla from "../assets/app/escalerilla.webp";
import { Icon } from "../icons";

/* ── PhoneFrame con captura real de la app ──────────────────── */

function PhoneFrame({ src, alt, className = "" }) {
  return (
    <div
      className={`overflow-hidden rounded-[2.6rem] border-[6px] border-inkstrong bg-inkstrong shadow-2xl shadow-inkstrong/25 ${className}`}
    >
      <img src={src} alt={alt} className="block w-full rounded-[2.2rem]" />
    </div>
  );
}

/* ── Marcador ScoreMatch (réplica viva de scorematch.app) ───── */

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
    <span className="flex h-[60px] w-[7.5rem] items-center justify-end overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
      <motion.p
        key={value}
        initial={{ y: 30, opacity: 0, scale: 0.75 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -30, opacity: 0, scale: 0.75 }}
        transition={ladderSpring}
        className={`font-extrabold tracking-tight tabular-nums ${game ? "text-4xl" : "text-6xl"} ${
          lime ? "text-limebrand" : "text-[#B9C2CE]"
        }`}
      >
        {value}
      </motion.p>
      </AnimatePresence>
    </span>
  );
}

function ScoreWatch() {
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
        <span className="absolute top-12 -right-[13px] h-9 w-[5px] rounded-full bg-[#1c1f24]" aria-hidden="true" />
        <span className="absolute top-24 -right-[13px] h-12 w-[5px] rounded-full bg-[#1c1f24]" aria-hidden="true" />

        <div className="rounded-[2.1rem] px-5 pt-4 pb-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold text-limebrand">18:42</span>
            <span className="flex items-center gap-1.5 font-mono text-[9px] font-semibold tracking-[0.15em] text-mint uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-mint" /> En vivo
            </span>
          </div>

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

          <div className="relative flex items-center" aria-hidden="true">
            <span className="h-px flex-1 bg-white/15" />
            <span className="mx-auto h-4 w-2.5 rounded-full bg-mint" style={{ borderRadius: "50% / 60%" }} />
            <span className="h-px flex-1 bg-white/15" />
          </div>

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
      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-second">
        <span className="h-1.5 w-1.5 rounded-full bg-mint" aria-hidden="true" /> Cada punto vibra en la
        muñeca · el partido queda en getmatchpro.com
      </p>
    </div>
  );
}

/* ── Lámina: la app del jugador ─────────────────────────────── */

const APP_FEATURES = [
  ["Matchmaking por nivel", "encuentra rivales parejos cerca, con % de compatibilidad calculado por TrueRank"],
  ["Escalerillas públicas y privadas", "tus socios crean, entran y desafían desde el celular — incluida la de tu club"],
  ["Invitar amigos", "cada socio trae a su círculo: partidos amistosos, dobles y nuevos visitantes para el club"],
  ["Actividades del club, gratis", "tus socios participan de la vida del club con el plan Free — y pueden suscribirse a Competitivo para todo lo demás"],
];

export function SlideApp() {
  const club = useClub();
  /* TODO(datos): cuando la cifra de jugadores esté verificada contra
     producción, usarla como prueba social en el pill ("+X jugadores ya
     compiten"). Mientras tanto, ningún número inventado. */
  return (
    <section className="tint-lime h-full">
      <SlideSplit
        eyebrow="La app del jugador · lanzamiento próximo"
        title="MatchPro: la app que trae jugadores a tu club."
        desc={
          <>
            Mientras Club Manager ordena la operación, la app MatchPro mueve la demanda: jugadores
            buscando dónde y con quién jugar.{" "}
            <span className="font-semibold text-inkstrong">
              Cada partido que la app arma necesita una cancha — la de {club.corto}.
            </span>
          </>
        }
        pill="iOS + Apple Watch · los clubes que entran hoy parten con ventaja"
        mock={
          <div className="flex items-end justify-center gap-6">
            <PhoneFrame src={imgMatchmaking} alt="Matchmaking en la app MatchPro" className="w-52" />
            <PhoneFrame
              src={imgEscalerilla}
              alt="Escalerilla en la app MatchPro"
              className="hidden w-44 translate-y-4 opacity-90 sm:block"
            />
          </div>
        }
        extra={
          <ul className="mt-5 flex max-w-md flex-col gap-2.5">
            {APP_FEATURES.map(([t, d]) => (
              <li key={t} className="flex gap-2.5 text-[13px] leading-snug">
                <span className="mt-0.5 text-limefg" aria-hidden="true">
                  ✓
                </span>
                <span className="text-second">
                  <span className="font-bold text-inkstrong">{t}:</span> {d}
                </span>
              </li>
            ))}
          </ul>
        }
      />
    </section>
  );
}

/* ── Lámina: ScoreMatch ─────────────────────────────────────── */

export function SlideScoreMatch() {
  return (
    <section className="h-full bg-white">
      <SlideSplit
        eyebrow="ScoreMatch · Apple Watch"
        title="Cada punto cuenta. Literalmente."
        desc="Cada punto se registra en el Apple Watch en el momento en que ocurre: estadísticas, momentum y primer saque, sin digitar nada. Y lo que se mide, se repite: el jugador que ve su progreso quiere el próximo partido — desafía, reserva y vuelve."
        pill="Más partidos medidos = más canchas ocupadas."
        mock={<ScoreWatch />}
        extra={
          <ul className="mt-5 flex max-w-md flex-col gap-2.5">
            {[
              ["Resultados validados", "punto a punto, no dictados de memoria — rankings que nadie discute"],
              ["Cero administración", "el resultado alimenta solo la escalerilla, TrueRank y la TV del club"],
              ["Incentivo a jugar", "el historial y las estadísticas convierten cada partido en el motivo del siguiente"],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-2.5 text-[13px] leading-snug">
                <span className="mt-0.5 text-limefg" aria-hidden="true">
                  ✓
                </span>
                <span className="text-second">
                  <span className="font-bold text-inkstrong">{t}:</span> {d}
                </span>
              </li>
            ))}
          </ul>
        }
      />
    </section>
  );
}

/* ── Lámina: tu club dentro de la app ───────────────────────── */

/* Réplica de la vista REAL de la app: coordinar un desafío,
   paso "¿Dónde juegan?" — el club del socio aparece primero y
   destacado, con precio socio; otros clubes con ofertas vía
   MatchPro y arriendo pagado por la app. */
function MockClubEnApp() {
  const club = useClub();
  return (
    <div className="mx-auto w-72 overflow-hidden rounded-[2.2rem] border-[6px] border-[#1c1f24] bg-night font-sans shadow-2xl shadow-black/50">
      <div className="px-4 pt-4 pb-3">
        {/* Paso 1 de 2 */}
        <div className="flex items-center justify-between">
          <p className="font-mono text-[8px] tracking-[0.2em] text-nightsecond uppercase">Paso 1 de 2</p>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[9px] text-white">
            ✕
          </span>
        </div>
        <div className="mt-1.5 flex gap-1.5" aria-hidden="true">
          <span className="h-1 flex-1 rounded-full bg-limebrand" />
          <span className="h-1 flex-1 rounded-full bg-white/15" />
        </div>
        <div className="flex justify-between pt-1 font-mono text-[7.5px] text-nightsecond">
          <span className="font-bold text-white">Club</span>
          <span>Cuándo</span>
        </div>

        {/* Desafío */}
        <div className="mt-3 flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-mint to-limebrand p-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-night/70 text-[10px] font-extrabold text-white ring-2 ring-white/60">
            JR
          </span>
          <div>
            <p className="font-mono text-[6.5px] tracking-[0.18em] text-limeink/80 uppercase">Desafías a</p>
            <p className="text-[14px] leading-tight font-extrabold text-night italic">Joaquín Rivas</p>
            <p className="text-[8px] font-semibold text-limeink/90">#22 · Escalerilla {club.corto}</p>
          </div>
        </div>

        {/* ¿Dónde juegan? */}
        <p className="mt-3 text-[16px] font-extrabold tracking-tight text-white italic">¿Dónde juegan?</p>
        <p className="text-[9px] text-nightsecond">Clubes que administramos cerca de ti.</p>

        {/* Tu club, primero y destacado */}
        <div className="mt-2 flex items-center gap-2.5 rounded-2xl border border-limebrand bg-limebrand/5 p-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-limebrand/15 text-limebrand" aria-hidden="true">
            <Icon name="building" className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[6.5px] tracking-[0.18em] text-limebrand uppercase">Tu club</p>
            <p className="text-[12px] leading-tight font-bold text-white">{club.nombre}</p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-[8px] text-nightsecond">◈ a 2,1 km</span>
              <span className="rounded-full bg-tealbrand/20 px-1.5 py-0.5 text-[7px] font-bold text-tealbrand">
                Precio socio · −15%
              </span>
            </div>
          </div>
          <span className="text-nightsecond" aria-hidden="true">
            ›
          </span>
        </div>

        {/* Otros clubes + filtros */}
        <p className="mt-2.5 font-mono text-[7px] tracking-[0.2em] text-nightsecond uppercase">Otros clubes</p>
        <div className="mt-1.5 flex gap-1.5">
          {["Cercanía", "Precio", "Descuento"].map((f, i) => (
            <span
              key={f}
              className={`rounded-full px-2.5 py-1 text-[8px] font-bold ${
                i === 0 ? "bg-limebrand text-limeink" : "bg-white/10 text-nightsecond"
              }`}
            >
              {f}
            </span>
          ))}
        </div>
        <div className="mt-2 flex flex-col gap-1.5">
          {[
            ["Club Las Lomas", "Las Condes · 4,3 km", null, "$22.000"],
            ["Club Miramar", "Las Condes · 5,0 km", "−10% vía MatchPro", "$16.000"],
          ].map(([n, d, oferta, precio]) => (
            <div key={n} className="flex items-center gap-2.5 rounded-2xl bg-nightcard p-2.5 ring-1 ring-nightline">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-nightsecond" aria-hidden="true">
                <Icon name="building" className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] leading-tight font-bold text-white">{n}</p>
                <p className="text-[8px] text-nightsecond">◈ {d}</p>
                {oferta && (
                  <span className="mt-0.5 inline-block rounded-full bg-tealbrand/20 px-1.5 py-0.5 text-[7px] font-bold text-tealbrand">
                    {oferta}
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className="font-mono text-[6.5px] text-nightsecond uppercase">Desde</p>
                <p className="text-[11px] font-extrabold text-white">{precio}</p>
              </div>
            </div>
          ))}
        </div>

        <span className="mt-2.5 block rounded-full bg-white/10 py-2 text-center text-[10px] font-bold text-white ring-1 ring-white/15">
          Coordino la cancha por mi cuenta
        </span>
        <p className="mt-2 text-center font-mono text-[7px] text-nightsecond/70">
          Vista real de la app MatchPro · datos de demostración
        </p>
      </div>
    </div>
  );
}

export function SlideClubEnApp() {
  const club = useClub();
  return (
    <section className="h-full bg-surface">
      <SlideSplit
        eyebrow="Tu club, dentro de la app"
        title={`Cada desafío busca cancha. ${club.corto} aparece primero.`}
        desc="Cuando dos jugadores coordinan un partido, la app propone dónde jugar: tu club destacado y con precio de socio para los tuyos, y visible con tus ofertas para todos los demás — que reservan y pagan por la app."
        pill="Un canal de marketing que además opera."
        mock={<MockClubEnApp />}
        extra={
          <ul className="mt-5 flex max-w-md flex-col gap-2.5">
            {[
              ["Tu club primero", "en cada desafío o partido que la app coordina, tus socios ven su club destacado y con precio de socio"],
              ["Ofertas vía MatchPro", "publica promociones y horas valle que los jugadores ven al elegir cancha"],
              ["Arriendo pagado por la app", "jugadores nuevos llegan con la cancha pagada — sin llamadas ni WhatsApp"],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-2.5 text-[13px] leading-snug">
                <span className="mt-0.5 text-limefg" aria-hidden="true">
                  ✓
                </span>
                <span className="text-second">
                  <span className="font-bold text-inkstrong">{t}:</span> {d}
                </span>
              </li>
            ))}
          </ul>
        }
      />
    </section>
  );
}

/* ── Lámina: el efecto en el club (flywheel) ────────────────── */

const LOOP = [
  {
    n: "01",
    t: "Jugadores encuentran tu club",
    d: "El matchmaking y las canchas publicadas ponen a tu club frente a jugadores que ya quieren jugar.",
  },
  {
    n: "02",
    t: "Juegan y marcan",
    d: "Reservan pagado por la app, juegan, y ScoreMatch valida el resultado sin digitación.",
  },
  {
    n: "03",
    t: "La competencia vive sola",
    d: "Escalerillas, desafíos y TrueRank se actualizan solos; la TV del club lo muestra en vivo.",
  },
  {
    n: "04",
    t: "Vuelven — y traen amigos",
    d: "Más partidos, más arriendos, más inscripciones. La competencia organizada retiene socios.",
  },
];

export function SlideEfecto() {
  const club = useClub();
  return (
    <section className="hero-night-cm relative flex h-full items-center overflow-hidden">
      <div className="aurora-blob aurora-a top-[-10%] right-[-5%] h-96 w-96 bg-tealbrand/20" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-6xl px-10">
        <Reveal>
          <p className="eyebrow text-tealbrand">El efecto en el club</p>
          <h2 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-balance text-white">
            Un circuito que gira solo — y {club.corto} está en el centro.
          </h2>
        </Reveal>

        <Reveal staggered className="mt-9 grid gap-3 lg:grid-cols-4">
          {LOOP.map(({ n, t, d }, i) => (
            <RevealItem key={n} className="relative rounded-2xl bg-nightcard p-5 ring-1 ring-nightline">
              <p className="font-mono text-[22px] font-bold text-limebrand">{n}</p>
              <h3 className="mt-2 text-[15px] leading-snug font-bold text-white">{t}</h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-nightsecond">{d}</p>
              {/* Nodo conector: el circuito se ve, no se insinúa */}
              <span
                className="absolute top-1/2 -right-[26px] z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-night ring-1 ring-limebrand/40 lg:flex"
                aria-hidden="true"
              >
                <Icon
                  name={i < LOOP.length - 1 ? "arrowRight" : "loop"}
                  className={`h-3.5 w-3.5 ${i < LOOP.length - 1 ? "text-limebrand" : "text-tealbrand"}`}
                />
              </span>
            </RevealItem>
          ))}
        </Reveal>

        <Reveal>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 border-t border-nightline pt-5 font-mono text-[12px] text-nightsecond">
            <span>
              Actividades del club: <span className="font-bold text-white">gratis para tus socios en la app</span>
            </span>
            <span>
              Ningún software de reservas puede <span className="font-bold text-white">traerte demanda</span>
            </span>
            <span>
              Cada partido nuevo = <span className="font-bold text-limebrand">una cancha arrendada</span>
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
