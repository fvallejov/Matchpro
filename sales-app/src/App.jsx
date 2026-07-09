// ─────────────────────────────────────────────────────────────
// Sales App — shell de presentación.
//  · Lienzo FIJO 1280×720 escalado al viewport (la altura de la
//    presentación nunca varía; patrón Keynote).
//  · Navegación: ← →, G/Esc índice, E preparar reunión,
//    F pantalla completa, P exportar PDF.
//  · Personalización: panel de preparación (E) o URL.
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE } from "./motion";
import { ClubProvider, configDesdeURL, configDesdeQuery } from "./club";
import Prep from "./Prep";
import Resumen from "./Resumen";
import Bitacora from "./Bitacora";
import Contraprop from "./Contraprop";
import Playbook from "./Playbook";
import logoOficialBlanco from "./assets/logo-oficial-blanco.svg";
import logoOficialColor from "./assets/logo-oficial-color.svg";

import Portada from "./slides/Portada";
import Problema from "./slides/Problema";
import {
  SlidePanel,
  SlideReservas,
  SlidePagos,
  SlideSocios,
  SlideTorneos,
  SlideEscalerilla,
  SlideTV,
  SlideFinanzas,
} from "./slides/Modulos";
import { SlideApp, SlideClubEnApp, SlideScoreMatch, SlideEfecto } from "./slides/Jugadores";
import { SlideImplementacion, SlideRoadmap } from "./slides/CierreExtra";
import Ecosistema from "./slides/Ecosistema";
import { SlideTrueRank, SlideExplora } from "./slides/EcosistemaExtra";
import Proyeccion from "./slides/Proyeccion";
import Comparativa, { MercadoGrafico } from "./slides/Comparativa";
import Calculadora from "./slides/Calculadora";
import Propuesta from "./slides/Propuesta";

// `bg` = clase del fondo de la lámina (debe coincidir con el <section>
// de cada slide). La usa la capa a-sangre-completa para llenar todo el
// viewport; si cambias el fondo de una lámina, actualízalo aquí también.
const SLIDES = [
  { id: "portada", label: "Portada", grupo: "Inicio", Comp: Portada, dark: true, locked: true, bg: "hero-night-cm" },
  { id: "problema", label: "Diagnóstico", grupo: "Inicio", Comp: Problema, dark: true, bg: "hero-night-cm" },
  { id: "panel", label: "El panel", grupo: "Producto", Comp: SlidePanel, dark: true, bg: "hero-night-cm" },
  { id: "reservas", label: "Reservas", grupo: "Producto", Comp: SlideReservas, bg: "tint-teal" },
  { id: "pagos", label: "Pagos", grupo: "Producto", Comp: SlidePagos, bg: "bg-surface" },
  { id: "socios", label: "Socios y cuotas", grupo: "Producto", Comp: SlideSocios, bg: "bg-white" },
  { id: "torneos", label: "Torneos", grupo: "Producto", Comp: SlideTorneos, bg: "tint-lime" },
  { id: "escalerilla", label: "Escalerillas", grupo: "Producto", Comp: SlideEscalerilla, bg: "bg-white" },
  { id: "tv", label: "MatchPro TV", grupo: "Producto", Comp: SlideTV, dark: true, bg: "night-cm" },
  { id: "finanzas", label: "Finanzas", grupo: "Producto", Comp: SlideFinanzas, bg: "bg-surface" },
  { id: "app", label: "App MatchPro", grupo: "Jugadores", Comp: SlideApp, bg: "tint-lime" },
  { id: "clubapp", label: "Tu club en la app", grupo: "Jugadores", Comp: SlideClubEnApp, bg: "bg-surface" },
  { id: "scorematch", label: "ScoreMatch", grupo: "Jugadores", Comp: SlideScoreMatch, bg: "bg-white" },
  { id: "efecto", label: "Efecto en el club", grupo: "Jugadores", Comp: SlideEfecto, dark: true, bg: "hero-night-cm" },
  { id: "ecosistema", label: "Ecosistema", grupo: "Crecimiento", Comp: Ecosistema, dark: true, bg: "night-cm" },
  { id: "proyeccion", label: "Simulador", grupo: "Crecimiento", Comp: Proyeccion, dark: true, bg: "hero-night-cm" },
  { id: "truerank", label: "TrueRank", grupo: "Crecimiento", Comp: SlideTrueRank, dark: true, bg: "night-cm" },
  { id: "roadmap", label: "Lo que viene", grupo: "Crecimiento", Comp: SlideRoadmap, dark: true, bg: "night-cm" },
  { id: "implementacion", label: "Implementación", grupo: "Cierre", Comp: SlideImplementacion, bg: "tint-teal" },
  { id: "comparativa", label: "Mercado", grupo: "Cierre", Comp: Comparativa, bg: "tint-lime" },
  { id: "mercadograf", label: "Mercado · gráfico", grupo: "Cierre", Comp: MercadoGrafico, dark: true, bg: "night-cm" },
  { id: "precio", label: "Calculadora", grupo: "Cierre", Comp: Calculadora, bg: "tint-lime" },
  { id: "explora", label: "Explora · links", grupo: "Cierre", Comp: SlideExplora, dark: true, bg: "hero-night-cm" },
  { id: "propuesta", label: "Propuesta", grupo: "Cierre", Comp: Propuesta, dark: true, locked: true, bg: "hero-night-cm" },
];

const W = 1280;
const H = 720;

/* Lienzo fijo escalado — la diapositiva SIEMPRE mide 1280×720 */
function Stage({ children }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      if (r.width && r.height) setScale(Math.min(r.width / W, r.height / H));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden">
      <div
        className="deck-canvas absolute top-1/2 left-1/2 overflow-hidden"
        style={{ width: W, height: H, transform: `translate(-50%,-50%) scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const [config, setConfig] = useState(configDesdeURL);
  const modoResumen = new URLSearchParams(window.location.search).get("modo") === "resumen";
  const [curId, setCurId] = useState(() => SLIDES[0].id);
  const [dir, setDir] = useState(1);
  const [showIndex, setShowIndex] = useState(false);
  const [showPrep, setShowPrep] = useState(
    () => new URLSearchParams(window.location.search).get("panel") === "prep",
  );
  const [showContra, setShowContra] = useState(
    () => new URLSearchParams(window.location.search).get("panel") === "contra",
  );
  const [showBitacora, setShowBitacora] = useState(false);
  const [showPlaybook, setShowPlaybook] = useState(false);
  const [printMode, setPrintMode] = useState(false);

  const modoCliente = config.cliente;
  const presentables = SLIDES.filter((s) => s.locked || !config.laminas || config.laminas.includes(s.id));
  const presentableIds = new Set(presentables.map((s) => s.id));
  /* Índice: el vendedor ve TODAS las láminas (numeradas las de su
     selección, marcadas «fuera» el resto — y puede saltar a ellas);
     el cliente solo ve, y solo alcanza, las seleccionadas. */
  const slidesIndice = modoCliente ? presentables : SLIDES;
  const ordenFlujo = {};
  presentables.forEach((s, i) => (ordenFlujo[s.id] = i + 1));

  const cur = SLIDES.find((s) => s.id === curId) ?? SLIDES[0];
  const orden = SLIDES.map((s) => s.id);
  const pos = orden.indexOf(cur.id);
  const hayPrev = orden.slice(0, pos).some((id) => presentableIds.has(id));
  const hayNext = orden.slice(pos + 1).some((id) => presentableIds.has(id));

  /* Lámina inicial por hash (#precio) */
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (SLIDES.some((s) => s.id === hash) && (!modoCliente || presentableIds.has(hash))) setCurId(hash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Navegación por id. El FLUJO (flechas y puntos) recorre solo las
     láminas de la selección; el índice permite saltar a cualquiera,
     incluidas las que quedaron fuera. Desde una lámina «fuera», las
     flechas retoman la presentable más cercana en esa dirección. */
  const irA = (id) => {
    setDir(orden.indexOf(id) >= pos ? 1 : -1);
    setCurId(id);
    setShowIndex(false);
    history.replaceState(null, "", `#${id}`);
  };
  const paso = (delta) => {
    for (let i = pos + delta; i >= 0 && i < orden.length; i += delta) {
      if (presentableIds.has(orden[i])) return irA(orden[i]);
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT") return;
      if (showPrep || showBitacora || showContra || showPlaybook) {
        if (e.key === "Escape") {
          setShowPrep(false);
          setShowBitacora(false);
          setShowContra(false);
          setShowPlaybook(false);
        }
        return;
      }
      if (e.key === "ArrowRight" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) {
        e.preventDefault();
        paso(1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp" || (e.key === " " && e.shiftKey)) {
        e.preventDefault();
        paso(-1);
      } else if (e.key === "Home") irA(presentables[0].id);
      else if (e.key === "End") irA(presentables[presentables.length - 1].id);
      else if (e.key.toLowerCase() === "g") setShowIndex((v) => !v);
      else if (e.key.toLowerCase() === "e" && !modoCliente) setShowPrep(true);
      else if (e.key.toLowerCase() === "r" && !modoCliente) setShowBitacora(true);
      else if (e.key.toLowerCase() === "b" && !modoCliente) setShowPlaybook(true);
      else if (e.key === "Escape") setShowIndex(false);
      else if (e.key.toLowerCase() === "f") {
        document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
      } else if (e.key.toLowerCase() === "p") imprimir();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const imprimir = () => {
    setPrintMode(true);
    /* Espera a que las animaciones de entrada terminen ANTES de
       imprimir: al apilar todas las láminas, los motion con delay
       largo (líneas de gráfico, paso 3 del timeline) y los CountUp
       quedaban a medio dibujar en el PDF. */
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 1900);
  };

  const { Comp, dark } = cur;

  if (config.modoResumen || modoResumen) {
    return (
      <ClubProvider value={config}>
        <Resumen />
      </ClubProvider>
    );
  }

  const bannerAlterado = config.alterado && (
    <div className="no-print fixed inset-x-0 top-0 z-[70] bg-loss py-1.5 text-center font-mono text-[11px] font-bold text-white">
      Este link fue modificado y no es válido — solicita el link original de tu propuesta.
    </div>
  );

  if (printMode) {
    return (
      <ClubProvider value={config}>
        <div>
          {presentables.map(({ id, Comp: C }) => (
            <div key={id} className="print-slide h-[100vh] overflow-hidden">
              <C />
            </div>
          ))}
        </div>
      </ClubProvider>
    );
  }

  return (
    <ClubProvider value={config}>
      <div className="flex h-dvh flex-col overflow-hidden bg-night">
        {bannerAlterado}
        {/* Escenario de lienzo fijo */}
        <div className="relative min-h-0 flex-1">
          {/* Fondo a sangre completa: llena TODO el viewport con el fondo
              de la lámina; el contenido sigue viviendo en el lienzo
              1280×720. Se cruza por `bg`, no por lámina, así no parpadea
              entre láminas que comparten fondo. */}
          <AnimatePresence initial={false}>
            <motion.div
              key={cur.bg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className={`pointer-events-none absolute inset-0 ${cur.bg}`}
              aria-hidden="true"
            />
          </AnimatePresence>
          <Stage>
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              <motion.div
                key={cur.id + config.nombre}
                custom={dir}
                initial={{ opacity: 0, x: dir * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -40 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="absolute inset-0"
              >
                <Comp />
              </motion.div>
            </AnimatePresence>
            {/* Marca oficial: logotipo blanco en fondos oscuros, color en claros */}
            {cur.id !== "portada" && (
              <img
                src={dark ? logoOficialBlanco : logoOficialColor}
                alt="MatchPro"
                className="pointer-events-none absolute top-7 right-10 h-4.5 w-auto"
              />
            )}
          </Stage>

          {hayPrev && <NavArrow side="left" dark={dark} onClick={() => paso(-1)} label="Anterior" />}
          {hayNext && <NavArrow side="right" dark={dark} onClick={() => paso(1)} label="Siguiente" />}
        </div>

        {/* Barra inferior */}
        <div className="no-print flex h-12 shrink-0 items-center justify-between border-t border-nightline bg-night px-4">
          {/* Identidad de la presentación — NO es un botón: un clic
              accidental aquí abría Preparar frente al cliente. */}
          <div className="flex items-center gap-2 px-2 py-1">
            <img src={logoOficialBlanco} alt="MatchPro" className="h-3.5 w-auto" />
            <span className="hidden font-mono text-[10px] text-nightsecond sm:inline">· {config.nombre}</span>
          </div>

          <div className="flex items-center gap-1.5" role="tablist" aria-label="Diapositivas">
            {presentables.map((s) => {
              const activo = s.id === cur.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={activo}
                  aria-label={s.label}
                  title={s.label}
                  onClick={() => irA(s.id)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activo ? "w-6 bg-limebrand" : "w-1.5 bg-white/25 hover:bg-white/50"
                  }`}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-1">
            {!modoCliente && (
              <>
                <BarButton onClick={() => setShowPrep(true)} title="Preparar reunión (E)">
                  ⚙ <span className="hidden sm:inline">Preparar</span>
                </BarButton>
                <BarButton onClick={() => setShowBitacora(true)} title="Bitácora de reuniones (R)">
                  ☰ <span className="hidden sm:inline">Reuniones</span>
                </BarButton>
                <BarButton onClick={() => setShowPlaybook(true)} title="Playbook de precios — solo interno (B)">
                  $ <span className="hidden sm:inline">Playbook</span>
                </BarButton>
              </>
            )}
            <BarButton onClick={() => setShowIndex(true)} title="Índice (G)">
              ⌗ <span className="hidden sm:inline">Índice</span>
            </BarButton>
            <BarButton onClick={imprimir} title="Exportar PDF (P)">
              ↓ <span className="hidden sm:inline">PDF</span>
            </BarButton>
            <BarButton
              onClick={() =>
                document.fullscreenElement
                  ? document.exitFullscreen()
                  : document.documentElement.requestFullscreen()
              }
              title="Pantalla completa (F)"
            >
              ⛶
            </BarButton>
          </div>
        </div>

        {/* Índice */}
        <AnimatePresence>
          {showIndex && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="no-print fixed inset-0 z-50 flex items-center justify-center bg-night/95 p-8 backdrop-blur-sm"
              onClick={() => setShowIndex(false)}
            >
              <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
                <p className="eyebrow text-tealbrand">Índice · salta a lo que pida la conversación</p>
                {!modoCliente && config.laminas && (
                  <p className="mt-1 font-mono text-[10px] text-nightsecond">
                    Numeradas = en tu presentación · atenuadas (+) = fuera de la selección, las puedes
                    mostrar igual
                  </p>
                )}
                {["Inicio", "Producto", "Jugadores", "Crecimiento", "Cierre"].map((grupo) => {
                  const delGrupo = slidesIndice.filter((s) => s.grupo === grupo);
                  if (delGrupo.length === 0) return null;
                  return (
                    <div key={grupo} className="mt-4">
                      <p className="font-mono text-[10px] tracking-[0.18em] text-nightsecond uppercase">{grupo}</p>
                      <div className="mt-2 grid gap-2 sm:grid-cols-4">
                        {delGrupo.map((s) => {
                          const activo = s.id === cur.id;
                          const enFlujo = presentableIds.has(s.id);
                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => irA(s.id)}
                              className={`rounded-xl border p-3 text-left transition-colors ${
                                activo
                                  ? "border-limebrand bg-limebrand/10"
                                  : enFlujo
                                    ? "border-nightline bg-nightcard hover:border-nightsecond"
                                    : "border-dashed border-nightline/70 bg-nightcard/40 opacity-60 hover:border-nightsecond hover:opacity-100"
                              }`}
                            >
                              <span className="flex items-center justify-between">
                                <span className="font-mono text-[10px] text-nightsecond">
                                  {enFlujo ? String(ordenFlujo[s.id]).padStart(2, "0") : "+"}
                                </span>
                                {!enFlujo && (
                                  <span className="font-mono text-[8.5px] tracking-[0.12em] text-nightsecond/70 uppercase">
                                    fuera
                                  </span>
                                )}
                              </span>
                              <span className="mt-0.5 block text-sm font-bold text-white">{s.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                <p className="mt-6 font-mono text-[10px] text-nightsecond">
                  ← → navegar{!modoCliente && " · E preparar"} · G o Esc cerrar · F pantalla completa · P
                  exportar PDF
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preparación de la reunión */}
        <AnimatePresence>
          {showPrep && (
            <Prep config={config} setConfig={setConfig} slides={SLIDES} onClose={() => setShowPrep(false)} />
          )}
        </AnimatePresence>

        {/* Bitácora de reuniones */}
        <AnimatePresence>
          {showBitacora && (
            <Bitacora
              onClose={() => setShowBitacora(false)}
              abrir={(query, panel) => {
                /* Sin recargar el documento: la config se aplica en memoria
                   (recargar 1 MB producía un pestañeo que parecía error). */
                const nuevo = configDesdeQuery(query);
                setConfig(nuevo);
                const pres = SLIDES.filter((s) => s.locked || !nuevo.laminas || nuevo.laminas.includes(s.id));
                setCurId(pres[0]?.id ?? SLIDES[0].id);
                setShowBitacora(false);
                setShowPrep(panel === "prep");
                setShowContra(panel === "contra");
              }}
            />
          )}
        </AnimatePresence>

        {/* Contrapropuesta — módulo negociador, separado de Preparar */}
        <AnimatePresence>
          {showContra && !modoCliente && (
            <Contraprop config={config} setConfig={setConfig} onClose={() => setShowContra(false)} />
          )}
        </AnimatePresence>

        {/* Playbook de precios — SOLO interno, jamás en modo cliente */}
        <AnimatePresence>
          {showPlaybook && !modoCliente && <Playbook onClose={() => setShowPlaybook(false)} />}
        </AnimatePresence>
      </div>
    </ClubProvider>
  );
}

function NavArrow({ side, dark, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`no-print absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-xl font-bold shadow-lg backdrop-blur transition-all outline-none hover:scale-110 focus-visible:ring-2 focus-visible:ring-limebrand ${
        side === "left" ? "left-3" : "right-3"
      } ${
        dark
          ? "bg-white/15 text-white ring-1 ring-white/30 hover:bg-white/25"
          : "bg-white text-inkstrong ring-1 ring-line hover:bg-surface"
      }`}
    >
      {side === "left" ? "←" : "→"}
    </button>
  );
}

function BarButton({ children, onClick, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="rounded-full px-2.5 py-1 font-mono text-[11px] text-nightsecond transition-colors hover:bg-white/5 hover:text-white"
    >
      {children}
    </button>
  );
}
