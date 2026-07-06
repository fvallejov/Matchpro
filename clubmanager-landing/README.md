# Club Manager Landing — V1

Landing de MatchPro Club Manager construida según `diagnostico-club-manager.md`
(las 22 secciones del diagnóstico estratégico). Hermana de `matchpro-landing` V5:
mismo stack, mismos tokens, mismo motion system.

## Correr

```bash
npm install
npm run dev      # desarrollo → http://localhost:5173
npm run build    # producción → dist/
npm run smoke    # build + test de humo (jsdom): contenido clave presente
```

## Stack

Vite · React 19 · Tailwind CSS 4 · Framer Motion 12

## Decisiones clave (trazables al diagnóstico)

- **Identidad diferenciada del jugador (V2)**: hero NIGHT con aurora teal — el centro de
  control del club, frente al hero claro de matchpro-landing. Tokens compartidos del
  ecosistema; teal como acento estructural de CM; lime solo para CTAs y momentos MatchPro.
- **Paleta y tipografía del producto viven SOLO dentro de los mocks** (`--color-pm*`,
  `--font-product` Poppins): banda azul con clima, KPIs de colores, botones verdes.
  El marketing de la página nunca usa el azul del producto.
- **Dinámica V2**: dashboard del hero se enciende módulo a módulo + parallax al mouse;
  ticker de actividad bajo el hero; Operación como scroll-telling con panel sticky en
  desktop (patrón Stripe) y apilado simple en mobile.
- **Arquitectura de 12 secciones** (§14): Hero → Clientes → Problema → Video → Operación
  → Competencia → Caso → Ecosistema → Implementación → Confianza → CTA+FAQ → Footer.
- **Animación insignia: el dashboard vivo** (§20): réplica fiel del Dashboard real
  (KPIs de socios/partidos/desafíos, ingresos del mes, crecimiento de socios, actividad
  reciente entrando). Loop cada 8 s. Sin 3D en ángulo: todos los mocks son HTML plano.
- **Mocks = réplicas del producto real** (validados contra 22 screencasts del panel):
  Reservas de Canchas con fila entrando + reservas públicas por QR, Estado de Pagos
  (pagados/pendientes/fallidos, Webpay), Dashboard de Arriendos (KPIs, ingresos por
  cancha, tendencia 12 meses), escalerilla con badges Top 1-3 y % victoria, gestión de
  desafíos (97% aceptación), torneo en curso con fixture, y modo TV dark en el
  ecosistema. Club y nombres FICTICIOS: "Club Los Aromos".
- **Copy comercial alineado al modelo real**: nada de "sin costo por socio" (el modelo
  es fee base + jugadores adicionales + comisión en torneos). El hero dice
  "Plan todo incluido"; el FAQ describe el modelo sin cifras.
- **Ecosistema como historia, no catálogo** (§16-19): timeline de 4 momentos de un socio
  (app → ScoreMatch → TV → TrueRank). TrueRank es ingredient brand: "Powered by TrueRank",
  sin card de producto ni CTA propio.
- **Conversión** (§10): Demo + WhatsApp como par único de CTAs, sticky mobile,
  captura de correo en el video (conversión secundaria), FAQ con respuestas concretas.
- **Claim maestro** (§13): "El siguiente nivel de tu club no es deportivo. Es operativo."
- **Footer propio de Club Manager** (§9): lockup CLUB*MANAGER*, descripción del producto
  correcto, columna Ecosistema. Sin links muertos.
- **Bilingüe ES/EN** (patrón i18n de V5): detección de idioma del browser,
  persistencia en localStorage (`cm-lang`) y toggle en el header. El copy de
  marketing vive en `src/strings.js`; los textos internos de los mocks (que
  replican el producto, que tiene modo inglés) viven en diccionarios `MK`
  colocados en cada archivo de sección. `npm run smoke` valida ambos idiomas.
  Nota SEO: el `<title>`/meta de index.html quedan en ES; para indexar EN
  se necesitarían rutas/hreflang (fuera de alcance actual).

## Pendientes antes de publicar (TODOs en el código)

1. **Prueba social (`src/sections/Core.jsx` + `Producto.jsx` → Caso):** los 4 nombres de
   clubes, el testimonio, la persona y la métrica "+18%" son PLACEHOLDERS. Reemplazar por
   clientes reales con autorización escrita. Un placeholder publicado destruye confianza.
   Las cifras del strip (+14.000 partidos / 40 canchas) deben validarse con datos reales.
2. **Links de conversión (`src/links.js`):** confirmar URL definitiva de agenda
   (hoy `meet.getmatchpro.com`) y reemplazar el número de WhatsApp placeholder.
3. **Video (`src/sections/Core.jsx`):** montado el video real de YouTube (PYDsLlWsREs)
   como lite-embed (youtube-nocookie, carga al clic). El formulario de correo solo
   guarda estado local — conectarlo al backend/herramienta de email.
4. **FAQ e Implementación (`src/sections/Cierre.jsx`):** las respuestas (tiempos de
   implementación, migración, modelo de cobro, medios de pago) son redacción conservadora
   por validar contra la operación real. Revisar cada una antes de publicar.
5. **QA visual en dispositivos reales** (el sandbox de build no renderiza): revisar
   especialmente el dashboard del hero a 390 px y el grid del ecosistema en iPad.

## Estructura

```
src/
  links.js           → destinos de conversión (un solo lugar)
  motion.js          → tokens de movimiento (heredado V5)
  ui.jsx             → Reveal, CountUp, SectionHeading, Lockup, CtaPair,
                       BrowserChrome, Sparkline
  sections/
    Header.jsx       → header con anclas + menú mobile + CTA sticky
    Hero.jsx         → claim + dashboard vivo (animación insignia)
    Core.jsx         → Clientes (logos), Problema (5 dolores), Video + captura
    Producto.jsx     → Operación (3 mocks planos), Competencia (escalerilla viva), Caso
    Ecosistema.jsx   → timeline 4 momentos (app/ScoreMatch/TV/TrueRank)
    Cierre.jsx       → Implementación, Confianza, CTA+FAQ, Footer
public/
  isotipo.svg, logo-*.svg  → compartidos con matchpro-landing
smoke.mjs            → test de humo del bundle (jsdom)
```
