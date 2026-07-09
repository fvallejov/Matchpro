// ─────────────────────────────────────────────────────────────
// Acortador de links para la Sales App — Cloudflare Worker + KV.
// Despliegue (cuando la app viva en sales.getmatchpro.com):
//   1. wrangler kv:namespace create LINKS
//   2. wrangler deploy  (con el binding LINKS en wrangler.toml)
//   3. En Preparar, apuntar el "Copiar link" a POST /api/corto.
//
// Qué gana esto sobre el link empacado:
//   · Corto de verdad: sales.getmatchpro.com/p/x7k2
//   · Ineditable de verdad: el cliente nunca ve los parámetros
//   · Revocable: borra la clave y el link muere
//   · Tracking de apertura: sabes CUÁNDO el club miró la
//     propuesta — la mejor señal de compra que existe.
// ─────────────────────────────────────────────────────────────

const APP_URL = "https://sales.getmatchpro.com/"; // donde vive la Sales App
const TOKEN = "CAMBIAME"; // token simple para crear links (solo tu equipo)

const id = () => Math.random().toString(36).slice(2, 8);

export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    // Crear link corto: POST /api/corto  { "d": "<payload empacado>" }
    if (req.method === "POST" && url.pathname === "/api/corto") {
      if (req.headers.get("authorization") !== `Bearer ${TOKEN}`)
        return new Response("no autorizado", { status: 401 });
      const { d } = await req.json();
      if (!d) return new Response("falta d", { status: 400 });
      const clave = id();
      await env.LINKS.put(clave, JSON.stringify({ d, creado: Date.now(), aperturas: [] }));
      return Response.json({ corto: `${url.origin}/p/${clave}` });
    }

    // Abrir link corto: GET /p/:id  → redirige a la app con el payload
    const m = url.pathname.match(/^\/p\/([a-z0-9]+)$/);
    if (m) {
      const raw = await env.LINKS.get(m[1]);
      if (!raw) return new Response("Propuesta no encontrada o revocada.", { status: 404 });
      const reg = JSON.parse(raw);
      reg.aperturas.push({ t: Date.now(), ua: req.headers.get("user-agent") ?? "" });
      await env.LINKS.put(m[1], JSON.stringify(reg)); // tracking de apertura
      return Response.redirect(`${APP_URL}?d=${encodeURIComponent(reg.d)}`, 302);
    }

    // Consultar aperturas: GET /api/corto/:id (con token)
    const q = url.pathname.match(/^\/api\/corto\/([a-z0-9]+)$/);
    if (q && req.headers.get("authorization") === `Bearer ${TOKEN}`) {
      const raw = await env.LINKS.get(q[1]);
      return raw ? new Response(raw, { headers: { "content-type": "application/json" } }) : new Response("?", { status: 404 });
    }

    return new Response("MatchPro Sales · acortador", { status: 200 });
  },
};
