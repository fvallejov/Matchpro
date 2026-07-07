// Test de humo V1: portada, personalización, láminas nuevas,
// filtro de láminas y condición sin piloto.
import { JSDOM } from "jsdom";
import { readFileSync } from "fs";

async function run(nombre, query, hash, checks, ausentes = []) {
  const dom = new JSDOM(`<!doctype html><html><body><div id="root"></div></body></html>`, {
    url: `http://localhost/${query}${hash}`,
    pretendToBeVisual: true,
  });
  global.window = dom.window;
  global.document = dom.window.document;
  Object.defineProperty(global, "navigator", { value: dom.window.navigator, configurable: true });
  global.requestAnimationFrame = (cb) => setTimeout(cb, 16);
  global.cancelAnimationFrame = clearTimeout;
  window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
  window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  global.IntersectionObserver = window.IntersectionObserver;
  window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
  global.ResizeObserver = window.ResizeObserver;
  global.MutationObserver = dom.window.MutationObserver;
  global.HTMLElement = dom.window.HTMLElement;
  global.Element = dom.window.Element;
  global.Node = dom.window.Node;
  global.getComputedStyle = dom.window.getComputedStyle;
  global.SVGElement = dom.window.SVGElement;
  global.CustomEvent = dom.window.CustomEvent;
  global.location = dom.window.location;
  global.history = dom.window.history;
  global.localStorage = dom.window.localStorage;
  global.ResizeObserverEntry = class {};

  const html = readFileSync(process.env.DIST ?? "dist/index.html", "utf8");
  const m = html.match(/<script type="module"[^>]*>([\s\S]*?)<\/script>/);
  const dataUrl = "data:text/javascript;base64," + Buffer.from(m[1]).toString("base64") + "#" + encodeURIComponent(nombre);
  await import(dataUrl);
  await new Promise((r) => setTimeout(r, 900));
  const text = document.getElementById("root").textContent;
  const missing = checks.filter((c) => !text.includes(c));
  const leaked = ausentes.filter((c) => text.includes(c));
  const tabs = document.querySelectorAll('[role="tablist"][aria-label="Diapositivas"] [role="tab"]').length;
  console.log(`[${nombre}] tabs:${tabs}`,
    missing.length ? "FALTAN: " + missing.join(" | ") : "",
    leaked.length ? "NO DEBIAN ESTAR: " + leaked.join(" | ") : "",
    !missing.length && !leaked.length ? "OK" : "");
  return missing.length === 0 && leaked.length === 0;
}

const r = [];
// Overlays: abrirlos con teclado detecta ReferenceErrors que el render base no ejercita
async function overlays() {
  const ok1 = await run("(pre-overlay portada)", "", "", ["Es operativo"]);
  window.dispatchEvent(new window.KeyboardEvent("keydown", { key: "e", bubbles: true }));
  await new Promise((s) => setTimeout(s, 400));
  let text = document.getElementById("root").textContent;
  const prepOk = text.includes("Preparar la reunión") && text.includes("Comisión variable");
  console.log("[overlay preparar]", prepOk ? "OK" : "FALTA CONTENIDO O CRASHEÓ");
  window.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  await new Promise((s) => setTimeout(s, 200));
  window.dispatchEvent(new window.KeyboardEvent("keydown", { key: "r", bubbles: true }));
  await new Promise((s) => setTimeout(s, 400));
  text = document.getElementById("root").textContent;
  const bitOk = text.includes("Bitácora de reuniones");
  console.log("[overlay bitacora]", bitOk ? "OK" : "FALTA CONTENIDO O CRASHEÓ");
  return ok1 && prepOk && bitOk;
}
r.push(await overlays());
r.push(await run("portada demo", "", "", ["Club Los Aromos", "Es operativo", "Jugadores ilimitados", "E preparar"]));
r.push(await run("portada con contacto", "?nombre=Club Andes&cto=Juan Pérez&cargo=Gerente&fecha=2026-08-14", "", ["Preparada para Juan Pérez", "Gerente", "14 de agosto"]));
r.push(await run("diagnostico planillas", "", "#problema", ["Cómo opera", "Doble arriendo de canchas", "Pagos no anotados", "Personas y planillas"]));
r.push(await run("ecosistema", "?nombre=Club San Carlos", "#ecosistema", ["Enciende una liga", "ScoreMatch", "TrueRank", "San Carlos"]));
r.push(await run("simulador", "?club=ossandon&horas=10&tarifa=20000", "#proyeccion", ["Simulemos Ossandón", "NETO", "comisión descontada", "lo único de tu bolsillo"]));
r.push(await run("comparativa", "", "#comparativa", ["EasyCancha", "PlayByPoint", "Escalerillas + desafíos", "$750 + 4% solo online"]));
r.push(await run("calculadora", "?club=ossandon", "#precio", ["De tu bolsillo", "te transferimos", "nunca es una factura aparte"]));
r.push(await run("calculadora comision editada", "?club=ossandon&cfijo=500&cpct=3", "#precio", ["$500 + 3%"]));
r.push(await run("comision bajo piso se clampa", "?club=ossandon&cfijo=0&cpct=1", "#precio", ["+ 3%"], ["+ 1%"]));
r.push(await run("propuesta sin concesiones", "?club=ossandon", "#propuesta", ["Partamos este mes", "Sin permanencia", "$750 + 4%", "válida hasta el"]));
r.push(await run("validez editada", "?club=ossandon&em=2026-07-01&val=10", "#propuesta", ["válida hasta el 11 de julio"]));
r.push(await run("propuesta meses gratis", "?club=ossandon&mg=2", "#propuesta", ["Parte con 2 meses gratis", "meses gratis al partir"]));
r.push(await run("propuesta con descuento", "?club=ossandon&dcto=20&dm=6", "#propuesta", ["Condiciones preferentes", "por 6 meses"]));
r.push(await run("app jugadores", "?nombre=Club Andes", "#app", ["la app que le trae jugadores", "Matchmaking por nivel", "Escalerillas públicas y privadas", "Invitar amigos", "Andes"]));
r.push(await run("scorematch", "", "#scorematch", ["se mide, se juega más", "Resultados validados", "Incentivo a jugar"]));
r.push(await run("efecto club", "?nombre=Club Andes", "#efecto", ["circuito que gira solo", "Andes", "gratis para tus socios"]));
r.push(await run("socios y cuotas", "", "#socios", ["cuotas se cobran solas", "Reintento auto", "Multas configurables"]));
r.push(await run("club en la app", "?nombre=Club Andes", "#clubapp", ["Andes aparece primero", "¿Dónde juegan?", "Tu club", "Precio socio", "vía MatchPro", "Coordino la cancha por mi cuenta", "Joaquín Rivas"]));
r.push(await run("perfil software", "?perfil=software", "#problema", ["Paga caro por solo reservas", "Ya usa un software"]));
r.push(await run("implementacion", "?nombre=Club Andes", "#implementacion", ["se desliga de la administración", "Soporte humano", "Migramos tus planillas"]));
r.push(await run("roadmap", "", "#roadmap", ["La plataforma sigue creciendo", "Lanzamiento próximo", "CoachPro", "no promesa con fecha"]));
r.push(await run("contrapropuesta feex", "?club=ossandon&feex=95000", "#propuesta", ["Condición especial: fee $95.000/mes", "excepción a la política"]));
r.push(await run("mercado grafico", "", "#mercadograf", ["Menos precio", "Benchmark interno", "PlayByPoint"]));
r.push(await run("resumen contrapropuesta", "?club=ossandon&feex=95000&modo=resumen", "", ["Propuesta comercial", "Club Ossandón", "% vs lista)", "excepción aprobada por dirección", "Agendar activación"]));
r.push(await run("truerank", "?nombre=Club Andes", "#truerank", ["Se juega", "Nadie declara su nivel", "provisional a VALIDADO", "no promesa con fecha", "Andes"]));
r.push(await run("explora links", "", "#explora", ["Cuatro formas de vivirlo", "Convierte cada partido", "Es operativo", "Siente el partido", "matchpro.tv", "scorematch.app"]));
r.push(await run("filtro laminas", "?laminas=panel,precio", "#precio", ["Plan sugerido"], []));

process.exit(r.every(Boolean) ? 0 : 1);
