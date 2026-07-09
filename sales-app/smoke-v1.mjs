// Test de humo V1: portada, personalización, láminas nuevas,
// filtro de láminas y condición sin piloto.
import { JSDOM } from "jsdom";
import { readFileSync } from "fs";

async function run(nombre, query, hash, checks, ausentes = []) {
  /* SOLO=texto corre únicamente los casos cuyo nombre lo contenga
     (el sandbox de CI corta a los 45s; permite correr por partes). */
  if (process.env.SOLO && !nombre.includes(process.env.SOLO)) return true;
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

const SAL = "mp·sales·2026";
function firmar(t) { let h = 5381; for (const c of t + SAL) h = ((h * 33) ^ c.charCodeAt(0)) >>> 0; return h.toString(36); }
function empacar(q) {
  const payload = `${q}&h=${firmar(q)}`;
  return Buffer.from(payload, "utf8").toString("base64").replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}
const r = [];
// Overlays: abrirlos con teclado detecta ReferenceErrors que el render base no ejercita
async function overlays() {
  if (process.env.SOLO && process.env.SOLO !== "overlays") return true;
  const ok1 = await run("(overlays · pre portada)", "", "", ["Es operativo"]);
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
r.push(await run("escalerilla copy", "", "#escalerilla", ["Socios que compiten, socios que se quedan"]));
r.push(await run("ecosistema", "?nombre=Club San Carlos", "#ecosistema", ["Organiza la competencia", "ScoreMatch", "TrueRank", "San Carlos"]));
r.push(await run("simulador", "?club=ossandon&horas=10&tarifa=20000", "#proyeccion", ["Simulemos Ossandón", "NETO", "comisión descontada", "lo único de tu bolsillo"]));
r.push(await run("comparativa", "", "#comparativa", ["cualquier actor del rubro", "EasyCancha", "$750 + 4% solo online", "El precio plano más bajo"]));
r.push(await run("calculadora", "?club=ossandon", "#precio", ["De tu bolsillo", "te transferimos", "nunca es una factura aparte"]));
r.push(await run("calculadora comision editada", "?club=ossandon&cfijo=500&cpct=3", "#precio", ["$500 + 3%"]));
r.push(await run("comision bajo piso se clampa", "?club=ossandon&cfijo=0&cpct=1", "#precio", ["+ 3%"], ["+ 1%"]));
r.push(await run("propuesta sin concesiones", "?club=ossandon", "#propuesta", ["Partamos este mes", "Sin permanencia", "$750 + 4%", "válida hasta el"]));
r.push(await run("validez editada", "?club=ossandon&em=2026-07-01&val=10", "#propuesta", ["válida hasta el 11 de julio"]));
r.push(await run("propuesta meses gratis", "?club=ossandon&mg=2", "#propuesta", ["Parte con 2 meses gratis", "meses gratis al partir"]));
r.push(await run("propuesta con descuento", "?club=ossandon&dcto=20&dm=6", "#propuesta", ["Condiciones preferentes", "por 6 meses"]));
r.push(await run("app jugadores", "?nombre=Club Andes", "#app", ["la app que trae jugadores", "Matchmaking por nivel", "Invitar amigos", "Andes"]));
r.push(await run("scorematch", "", "#scorematch", ["Cada punto cuenta", "Resultados validados", "Incentivo a jugar"]));
r.push(await run("efecto club", "?nombre=Club Andes", "#efecto", ["circuito que gira solo", "Andes", "gratis para tus socios"]));
r.push(await run("socios y cuotas", "", "#socios", ["cuotas se cobran solas", "Reintento auto", "Multas configurables"]));
r.push(await run("club en la app", "?nombre=Club Andes", "#clubapp", ["Andes aparece primero", "¿Dónde juegan?", "Tu club", "Precio socio", "vía MatchPro", "Coordino la cancha por mi cuenta", "Joaquín Rivas"]));
r.push(await run("perfil software", "?perfil=software", "#problema", ["Paga caro por solo reservas", "Ya usa un software"]));
r.push(await run("implementacion", "?nombre=Club Andes", "#implementacion", ["se desliga de la administración", "Soporte humano", "Migramos tus planillas"]));
r.push(await run("roadmap", "", "#roadmap", ["La plataforma sigue creciendo", "Lanzamiento próximo", "CoachingPro", "no promesa con fecha"]));
r.push(await run("deck ignora excepcion", "?club=ossandon&feex=95000", "#propuesta", ["Partamos este mes"], ["Condición especial"]));
r.push(await run("mercado grafico", "", "#mercadograf", ["Menos precio", "Benchmark interno", "PlayByPoint"]));
r.push(await run("resumen contrapropuesta", "?club=ossandon&feex=95000&vnd=Feña&modo=resumen", "", ["Contrapropuesta comercial", "Club Ossandón", "% vs precio de lista", "excepción aprobada por dirección", "Aceptar contrapropuesta", "Preparada por Feña"]));
r.push(await run("resumen propuesta normal", "?club=ossandon&mg=1&modo=resumen", "", ["Propuesta comercial", "Te transferimos el", "Aceptar propuesta", "mes gratis al partir"]));
// La condición caduca, el link NO: lista intacta + CTA de re-enganche
r.push(await run("resumen condicion vencida", "?club=ossandon&mg=1&em=2026-01-01&val=30&modo=resumen", "", ["Vencida el 31 de enero", "precio de lista sigue vigente", "Retomar la conversación"], ["Aceptar propuesta", "gratis al partir"]));
r.push(await run("deck condicion vencida", "?club=ossandon&mg=1&em=2026-01-01&val=30", "#propuesta", ["venció el 31 de enero", "Partamos este mes"], ["gratis al partir"]));
r.push(await run("truerank", "?nombre=Club Andes", "#truerank", ["Se juega", "Nadie declara su nivel", "provisional a VALIDADO", "no promesa con fecha", "Andes"]));
r.push(await run("explora links", "", "#explora", ["Todo juega junto", "Convierte cada partido", "Visitar sitio", "TrueRank", "CoachingPro"]));
r.push(await run("modo cliente oculta paneles", "?nombre=Club Andes&modo=cliente", "", ["Índice", "Es operativo"], ["Preparar", "Reuniones", "Playbook", "E preparar"]));
async function playbookInterno() {
  if (process.env.SOLO && process.env.SOLO !== "playbook") return true;
  const ok = await run("(pre-playbook)", "", "", ["Es operativo"]);
  window.dispatchEvent(new window.KeyboardEvent("keydown", { key: "b", bubbles: true }));
  await new Promise((s) => setTimeout(s, 400));
  const text = document.getElementById("root").textContent;
  const checks = ["Solo uso interno", "Cómo cobramos", "Piso Transbank", "margen MatchPro", "Todo lo demás = excepción", "re-sella la emisión"];
  const missing = checks.filter((c) => !text.includes(c));
  console.log("[playbook interno]", missing.length ? "FALTAN: " + missing.join(" | ") : "OK");
  return ok && !missing.length;
}
r.push(await playbookInterno());
r.push(await run("explora con video", "", "#explora", ["Club Manager por dentro", "video de 2 minutos"]));
async function clubEnBarraNoEsBoton() {
  if (process.env.SOLO && process.env.SOLO !== "clubbarra") return true;
  /* Ni siquiera en la vista del vendedor: un clic accidental ahí
     abría Preparar (con descuentos) frente al cliente en una presencial. */
  const ok = await run("(clubbarra · pre)", "?nombre=Club Andes", "", ["Es operativo"]);
  const btn = [...document.querySelectorAll("button")].find((b) => b.textContent.includes("· Club Andes"));
  const el = [...document.querySelectorAll("span")].find((s) => s.textContent.includes("· Club Andes"));
  el?.click();
  await new Promise((s) => setTimeout(s, 400));
  const abierto = document.getElementById("root").textContent.includes("Preparar la reunión");
  console.log("[club en barra no es botón]", btn ? "ES BOTÓN (BUG)" : abierto ? "ABRIÓ PREPARAR (BUG)" : "OK");
  return ok && !btn && !abierto;
}
r.push(await clubEnBarraNoEsBoton());
r.push(await run("link empacado cliente", "?d=" + empacar("nombre=Club Andes&canchas=9&gmv=3000000&em=2026-07-01&horas=6&tarifa=18000&torneos=200000&modo=cliente"), "", ["Andes", "Es operativo", "Índice"], ["Preparar", "E preparar"]));
r.push(await run("link empacado resumen", "?d=" + empacar("nombre=Club Andes&canchas=9&gmv=3000000&mg=1&em=2026-07-01&horas=6&tarifa=18000&torneos=200000&modo=resumen"), "", ["Propuesta comercial", "Aceptar propuesta"]));
r.push(await run("link manipulado avisa", "?d=" + empacar("nombre=Club Andes&canchas=9&gmv=3000000&em=2026-07-01&horas=6&tarifa=18000&torneos=200000&modo=cliente").slice(0, -4) + "XXXX", "", ["fue modificado y no es válido"]));
async function bitacoraAbreSinRecarga() {
  if (process.env.SOLO && process.env.SOLO !== "bitacora-flujo") return true;
  /* Editar desde la bitácora aplica la config EN MEMORIA (sin
     window.location): en jsdom una navegación fallaría, así que
     ver el Prep del club sembrado prueba el flujo nuevo. */
  const ok = await run("(bitacora-flujo · pre)", "", "", ["Es operativo"]);
  localStorage.setItem(
    "mp-sales-bitacora",
    JSON.stringify([{ id: "Club Nogales|2026-07-10", club: "Club Nogales", contacto: "Ana", vendedor: "Feña", cargo: "", fono: "", fecha: "2026-07-10", estado: "Realizada", notas: "", query: "nombre=Club Nogales&canchas=7&cto=Ana", ts: Date.now() }]),
  );
  window.dispatchEvent(new window.KeyboardEvent("keydown", { key: "r", bubbles: true }));
  await new Promise((s) => setTimeout(s, 400));
  const btn = [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Editar"));
  btn?.click();
  await new Promise((s) => setTimeout(s, 500));
  const text = document.getElementById("root").textContent;
  const abierto = text.includes("Preparar la reunión") && text.includes("Club Nogales");
  console.log("[bitacora abre sin recarga]", abierto ? "OK" : "NO APLICÓ LA CONFIG O NO ABRIÓ PREP");
  return ok && abierto;
}
r.push(await bitacoraAbreSinRecarga());
async function moduloContra() {
  if (process.env.SOLO && process.env.SOLO !== "modulocontra") return true;
  const ok = await run("(modulocontra · pre)", "?club=ossandon&panel=contra", "", ["Contrapropuesta · Club Ossandón", "Lo propuesto en la reunión", "Comisión variable", "Copiar link de la contrapropuesta"]);
  return ok;
}
r.push(await moduloContra());
r.push(await run("filtro laminas", "?laminas=panel,precio", "#precio", ["Plan sugerido"], []));

process.exit(r.every(Boolean) ? 0 : 1);
