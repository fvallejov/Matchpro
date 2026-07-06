import { JSDOM } from "jsdom";
import { readFileSync } from "fs";

const CHECKS = {
  es: ["Es operativo", "Agendar demo", "Estado de Pagos", "Reservas públicas", "Plan todo incluido",
       "Encendiste una liga", "MatchPro TV incluido", "Preguntas", "estás perdiendo dinero", "Dashboard de Arriendos"],
  en: ["It's operational", "Book a demo", "Payment Status", "Public bookings", "All-inclusive plan",
       "You switched on a league", "MatchPro TV included", "FAQ", "you're losing money", "Rentals Dashboard"],
};

async function run(lang) {
  const dom = new JSDOM(`<!doctype html><html><body><div id="root"></div></body></html>`, {
    url: "http://localhost/", pretendToBeVisual: true,
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
  global.fetch = async () => ({ ok: true });
  global.localStorage = dom.window.localStorage;
  window.localStorage.setItem("cm-lang", lang);

  const html = readFileSync("dist/index.html", "utf8");
  const m = html.match(/<script type="module"[^>]*>([\s\S]*?)<\/script>/);
  const dataUrl = "data:text/javascript;base64," + Buffer.from(m[1]).toString("base64") + "#" + lang;
  await import(dataUrl);
  await new Promise((r) => setTimeout(r, 1200));
  const text = document.getElementById("root").textContent;
  const missing = CHECKS[lang].filter((c) => !text.includes(c));
  console.log(`[${lang}] secciones:`, document.querySelectorAll("section").length,
    missing.length ? "FALTAN: " + missing.join(" | ") : "OK");
  return missing.length === 0;
}

const okEs = await run("es");
const okEn = await run("en");
process.exit(okEs && okEn ? 0 : 1);
