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
import { ClubProvider, configDesdeURL } from "./club";
import Prep from "./Prep";
import Resumen from "./Resumen";
import Bitacora from "./Bitacora";
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

const SLIDES = [
  { id: "portada", label: "Portada", grupo: "Inicio", Comp: Portada, dark: true, locked: true },
  { id: "problema", label: "Diagnóstico", grupo: "Inicio", Comp: Problema, dark: true },
  { id: "panel", label: "El panel", grupo: "Producto", Comp: SlidePanel, dark: true },
  { id: "reservas", label: "Reservas", grupo: "Producto", Comp: SlideReservas },
  { id: "pagos", label: "Pagos", grupo: "Producto", Comp: SlidePagos },
  { id: "socios", label: "Socios y cuotas", grupo: "Producto", Comp: SlideSocios },
  { id: "torneos", label: "Torneos", grupo: "Producto", Comp: SlideTorneos },
  { id: "escalerilla", label: "Escalerillas", grupo: "Producto", Comp: SlideEscalerilla },
  { id: "tv", label: "MatchPro TV", grupo: "Producto", Comp: SlideTV, dark: true },
  { id: "finanzas", label: "Finanzas", grupo: "Producto", Comp: SlideFinanzas },
  { id: "app", label: "App MatchPro", grupo: "Jugadores", Comp: SlideApp },
  { id: "clubapp", label: "Tu club en la app", grupo: "Jugadores", Comp: SlideClubEnApp },
  { id: "scorematch", label: "ScoreMatch", grupo: "Jugadores", Comp: SlideScoreMatch },
  { id: "efecto", label: "Efecto en el club", grupo: "Jugadores", Comp: SlideEfecto, dark: true },
  { id: "ecosistema", label: "Ecosistema", grupo: "Crecimiento", Comp: Ecosistema, dark: true },
  { id: "proyeccion", label: "Simulador", grupo: "Crecimiento", Comp: Proyeccion, dark: true },
  { id: "truerank", label: "TrueRank", grupo: "Crecimiento", Comp: SlideTrueRank, dark: true },
  { id: "roadmap", label: "Lo que viene", grupo: "Crecimiento", Comp: SlideRoadmap, dark: true },
  { id: "implementacion", label: "Implementación", grupo: "Cierre", Comp: SlideImplementacion },
  { id: "comparativa", label: "Mercado", grupo: "Cierre", Comp: Comparativa },
  { id: "mercadograf", label: "Mercado · gráfico", grupo: "Cierre", Comp: MercadoGrafico, dark: true },
  { id: "precio", label: "Calculadora", grupo: "Cierre", Comp: Calculadora },
  { id: "explora", label: "Explora · links", grupo: "Cierre", Comp: SlideExplora, dark: true },
  { id: "propuesta", label: "Propuesta", grupo: "Cierre", Comp: Propuesta, dark: true, locked: true },
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
        className="absolute top-1/2 left-1/2 overflow-hidden"
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
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [showIndex, setShowIndex] = useState(false);
  const [showPrep, setShowPrep] = useState(false);
  const [showBitacora, setShowBitacora] = useState(false);
  const [printMode, setPrintMode] = useState(false);

  const visibles = SLIDES.filter((s) => s.locked || !config.laminas || config.laminas.includes(s.id));
  const safeIdx = Math.min(idx, visibles.length - 1);

  /* Lámina inicial por hash (#precio) */
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const i = visibles.findIndex((s) => s.id === hash);
    if (i >= 0) setIdx(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = (next) => {
    const clamped = Math.max(0, Math.min(visibles.length - 1, next));
    setDir(clamped >= safeIdx ? 1 : -1);
    setIdx(clamped);
    setShowIndex(false);
    history.replaceState(null, "", `#${visibles[clamped].id}`);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT") return;
      if (showPrep || showBitacora) {
        if (e.key === "Escape") {
          setShowPrep(false);
          setShowBitacora(false);
        }
        return;
      }
      if (e.key === "ArrowRight" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) {
        e.preventDefault();
        go(safeIdx + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp" || (e.key === " " && e.shiftKey)) {
        e.preventDefault();
        go(safeIdx - 1);
      } else if (e.key === "Home") go(0);
      else if (e.key === "End") go(visibles.length - 1);
      else if (e.key.toLowerCase() === "g") setShowIndex((v) => !v);
      else if (e.key.toLowerCase() === "e") setShowPrep(true);
      else if (e.key.toLowerCase() === "r") setShowBitacora(true);
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
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 400);
  };

  const { Comp, dark } = visibles[safeIdx];

  if (modoResumen) {
    return (
      <ClubProvider value={config}>
        <Resumen />
      </ClubProvider>
    );
  }

  if (printMode) {
    return (
      <ClubProvider value={config}>
        <div>
          {visibles.map(({ id, Comp: C }) => (
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
        {/* Escenario de lienzo fijo */}
        <div className="relative min-h-0 flex-1">
          <Stage>
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              <motion.div
                key={visibles[safeIdx].id + config.nombre}
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
            {visibles[safeIdx].id !== "portada" && (
              <img
                src={dark ? logoOficialBlanco : logoOficialColor}
                alt="MatchPro"
                className="pointer-events-none absolute top-7 right-10 h-4.5 w-auto"
              />
            )}
          </Stage>

          {safeIdx > 0 && <NavArrow side="left" dark={dark} onClick={() => go(safeIdx - 1)} label="Anterior" />}
          {safeIdx < visibles.length - 1 && (
            <NavArrow side="right" dark={dark} onClick={() => go(safeIdx + 1)} label="Siguiente" />
          )}
        </div>

        {/* Barra inferior */}
        <div className="no-print flex h-12 shrink-0 items-center justify-between border-t border-nightline bg-night px-4">
          <button
            type="button"
            onClick={() => setShowPrep(true)}
            title="Preparar reunión (E)"
            className="flex items-center gap-2 rounded-full px-2 py-1 text-left transition-colors hover:bg-white/5"
          >
            <img src={logoOficialBlanco} alt="MatchPro" className="h-3.5 w-auto" />
            <span className="hidden font-mono text-[10px] text-nightsecond sm:inline">· {config.nombre} ⚙</span>
          </button>

          <div className="flex items-center gap-1.5" role="tablist" aria-label="Diapositivas">
            {visibles.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === safeIdx}
                aria-label={s.label}
                title={s.label}
                onClick={() => go(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === safeIdx ? "w-6 bg-limebrand" : "w-1.5 bg-white/25 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1">
            <BarButton onClick={() => setShowPrep(true)} title="Preparar reunión (E)">
              ⚙ <span className="hidden sm:inline">Preparar</span>
            </BarButton>
            <BarButton onClick={() => setShowBitacora(true)} title="Bitácora de reuniones (R)">
              ☰ <span className="hidden sm:inline">Reuniones</span>
            </BarButton>
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
                {["Inicio", "Producto", "Jugadores", "Crecimiento", "Cierre"].map((grupo) => (
                  <div key={grupo} className="mt-4">
                    <p className="font-mono text-[10px] tracking-[0.18em] text-nightsecond uppercase">{grupo}</p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-4">
                      {visibles.map(
                        (s, i) =>
                          s.grupo === grupo && (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => go(i)}
                              className={`rounded-xl border p-3 text-left transition-colors ${
                                i === safeIdx
                                  ? "border-limebrand bg-limebrand/10"
                                  : "border-nightline bg-nightcard hover:border-nightsecond"
                              }`}
                            >
                              <span className="font-mono text-[10px] text-nightsecond">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span className="block text-sm font-bold text-white">{s.label}</span>
                            </button>
                          ),
                      )}
                    </div>
                  </div>
                ))}
                <p className="mt-6 font-mono text-[10px] text-nightsecond">
                  ← → navegar · E preparar · G o Esc cerrar · F pantalla completa · P exportar PDF
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
          {showBitacora && <Bitacora onClose={() => setShowBitacora(false)} />}
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
