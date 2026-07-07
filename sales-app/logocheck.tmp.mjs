import { JSDOM } from "jsdom";
import { readFileSync } from "fs";
const dom = new JSDOM(`<!doctype html><html><body><div id="root"></div></body></html>`, { url: "http://localhost/", pretendToBeVisual: true });
global.window = dom.window; global.document = dom.window.document;
Object.defineProperty(global, "navigator", { value: dom.window.navigator, configurable: true });
global.requestAnimationFrame = (cb) => setTimeout(cb, 16); global.cancelAnimationFrame = clearTimeout;
window.matchMedia = () => ({ matches: false, addEventListener(){}, removeEventListener(){}, addListener(){}, removeListener(){} });
window.IntersectionObserver = class { observe(){} unobserve(){} disconnect(){} }; global.IntersectionObserver = window.IntersectionObserver;
window.ResizeObserver = class { observe(){} unobserve(){} disconnect(){} }; global.ResizeObserver = window.ResizeObserver;
global.MutationObserver = dom.window.MutationObserver; global.HTMLElement = dom.window.HTMLElement; global.Element = dom.window.Element;
global.Node = dom.window.Node; global.getComputedStyle = dom.window.getComputedStyle; global.SVGElement = dom.window.SVGElement;
global.CustomEvent = dom.window.CustomEvent; global.location = dom.window.location; global.history = dom.window.history; global.localStorage = dom.window.localStorage;
const html = readFileSync("dist18/index.html", "utf8");
const m = html.match(/<script type="module"[^>]*>([\s\S]*?)<\/script>/);
await import("data:text/javascript;base64," + Buffer.from(m[1]).toString("base64"));
await new Promise(r => setTimeout(r, 900));
for (const img of document.querySelectorAll('img[alt="Club Manager"]')) {
  const src = decodeURIComponent(img.src);
  console.log("CM logo →", src.includes("0f172b") ? "LETRAS OSCURAS" : "letras blancas", "| en:", img.closest("section") ? "sección" : "otro");
}
