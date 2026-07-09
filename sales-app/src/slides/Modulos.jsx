// ─────────────────────────────────────────────────────────────
// Diapositivas de producto — cada módulo con su mock vivo.
// Copy heredado de clubmanager-landing (validado contra el
// producto real). Una idea por diapositiva.
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { EASE } from "../motion";
import { SlideSplit, Reveal } from "../ui";
import { useClub } from "../club";
import { MockReservas, MockPagos, MockFinanzas, MockTorneos, MockCuotas, EscalerillaViva } from "../mocks/PanelMocks";
import { MockTV } from "../mocks/TvMock";
import { DashboardVivo, MockCuadro } from "../mocks/DashboardVivo";

/* ── El panel: visión general ───────────────────────────────── */

export function SlidePanel() {
  const club = useClub();
  return (
    <section className="hero-night-cm relative h-full overflow-hidden">
      <div className="aurora-blob aurora-a top-[-10%] right-[-5%] h-96 w-96 bg-tealbrand/20" aria-hidden="true" />
      <div className="mx-auto grid h-full w-full max-w-6xl items-center gap-10 px-8 py-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <Reveal>
          <p className="eyebrow text-tealbrand">La plataforma</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance text-white xl:text-4xl">
            Todo {club.corto}, en un solo panel.
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-nightsecond xl:text-base">
            Dashboard, calendario de reservas y torneos en vivo. Lo que estás viendo es una réplica del
            panel real de Club Manager — así se vería {club.nombre} operando.
          </p>
          <p className="mt-5 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-limebrand ring-1 ring-white/15">
            Operativo el mismo día de la configuración.
          </p>
        </Reveal>
        <Reveal className="min-w-0 mock">
          <DashboardVivo />
        </Reveal>
      </div>
    </section>
  );
}

/* ── Módulos claros (SlideSplit) ────────────────────────────── */

export function SlideReservas() {
  return (
    <section className="tint-teal h-full">
      <SlideSplit
        eyebrow="Reservas"
        title="Cada hora de cancha, visible y cobrada."
        desc="Calendario en tiempo real, precios por franja horaria y reservas públicas por link o QR: los externos reservan y pagan sin crear cuenta. Las horas muertas dejan de ser invisibles."
        pill="Mayor ocupación, cero dobles reservas."
        mock={<MockReservas />}
      />
    </section>
  );
}

export function SlidePagos() {
  return (
    <section className="h-full bg-surface">
      <SlideSplit
        eyebrow="Pagos"
        title="Los ingresos entran por un solo lugar."
        desc="Cobros integrados con Transbank: reservas, cuotas de socios e inscripciones a torneos quedan pagados y registrados en el momento, con estado visible — pagado, pendiente o fallido."
        pill="Transparencia total, conciliación automática."
        mock={<MockPagos />}
      />
    </section>
  );
}

export function SlideSocios() {
  return (
    <section className="h-full bg-white">
      <SlideSplit
        eyebrow="Socios y cuotas"
        title="Las cuotas se cobran solas."
        desc="Cobro automático mensual por tipo de socio, reintentos de pagos fallidos, multas por atraso y congelamiento configurables. Avisos por WhatsApp y email antes de que la deuda exista — y registro de pagos manuales para quien paga en efectivo."
        pill="Fin de la morosidad invisible."
        mock={<MockCuotas />}
      />
    </section>
  );
}

/* Torneos por fuera (wizard) Y por dentro (cuadro en vivo):
   el mock alterna entre ambas vistas. */
function MockTorneosDoble() {
  const prefersReduced = useReducedMotion();
  const [vista, setVista] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => setVista((v) => (v + 1) % 2), 8000);
    return () => clearInterval(id);
  }, [prefersReduced]);

  return (
    <div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={vista}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          {vista === 0 ? <MockTorneos /> : <MockCuadro />}
        </motion.div>
      </AnimatePresence>
      <div className="mx-auto mt-3 flex w-fit items-center gap-1.5" role="tablist">
        {["Crear en 7 pasos", "El torneo por dentro"].map((chip, i) => (
          <span
            key={chip}
            role="tab"
            aria-selected={i === vista}
            className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] whitespace-nowrap transition-colors duration-300 ${
              i === vista ? "bg-inkstrong/8 font-bold text-inkstrong ring-1 ring-line" : "text-mutedink"
            }`}
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SlideTorneos() {
  return (
    <section className="tint-lime h-full">
      <SlideSplit
        eyebrow="Competencias"
        title="Torneos en minutos, no en tardes."
        desc="Un asistente de 7 pasos arma el torneo completo — formato, cupos, puntuación y fixture optimizado para tus canchas. Y por dentro: el cuadro avanza solo con cada resultado, proyectado en la TV del club."
        pill="De la pizarra al fixture automático."
        mock={<MockTorneosDoble />}
      />
    </section>
  );
}

export function SlideEscalerilla() {
  return (
    <section className="h-full bg-white">
      <SlideSplit
        eyebrow="Competencia permanente"
        title="Socios que compiten, socios que se quedan."
        desc="Tus socios se desafían entre ellos con reglas que tú defines; el ranking se reordena solo con cada resultado confirmado. El nivel no se declara: se calcula con TrueRank a partir de partidos jugados."
        pill="Competencia organizada = retención de socios."
        mock={<EscalerillaViva />}
        extra={
          <div className="font-product mt-6 grid max-w-md gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface/50 p-4">
              <p className="text-[9px] font-medium text-second">Gestión de Desafíos</p>
              <p className="mt-1 text-2xl font-bold text-pmgreen">97%</p>
              <p className="text-[11px] font-semibold text-inkstrong">tasa de aceptación</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface/50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-medium text-second">Torneo en curso</p>
                <span className="rounded-full bg-pmgreen/10 px-2 py-0.5 text-[9px] font-bold text-pmgreen">
                  ● En vivo
                </span>
              </div>
              <p className="mt-1 text-sm font-bold text-inkstrong">Americano del Sábado</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white ring-1 ring-line">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "67%" }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                  className="h-full rounded-full bg-pmgreen"
                />
              </div>
            </div>
          </div>
        }
      />
    </section>
  );
}

export function SlideTV() {
  const club = useClub();
  return (
    <section className="night-cm h-full">
      <div className="mx-auto grid h-full w-full max-w-6xl items-center gap-10 px-8 py-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <Reveal>
          <p className="eyebrow text-tealbrand">Pantallas del club</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance text-white xl:text-4xl">
            {club.corto} en vivo, en todas sus pantallas.
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-nightsecond xl:text-base">
            MatchPro TV convierte cualquier televisor en el dashboard del club: estado de canchas al
            segundo, ranking, brackets que se redibujan solos, sponsors por tier y reservas por QR. Se
            activa con un código — la TV no se toca.
          </p>
          <p className="mt-5 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-limebrand ring-1 ring-white/15">
            Incluido en todos los planes. Sin costo extra.
          </p>
        </Reveal>
        <Reveal className="min-w-0 mock">
          <MockTV />
        </Reveal>
      </div>
    </section>
  );
}

export function SlideFinanzas() {
  return (
    <section className="h-full bg-surface">
      <SlideSplit
        eyebrow="Finanzas"
        title="Decisiones con números, no con intuición."
        desc="Ingresos por día, semana, mes y año; rendimiento por cancha; tendencia de los últimos 12 meses. Reportes exportables en PDF y CSV que el directorio entiende en una pantalla."
        pill="El fin de mes deja de ser arqueología."
        mock={<MockFinanzas />}
      />
    </section>
  );
}
