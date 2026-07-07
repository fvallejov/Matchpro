# MatchPro Landing — Documento de contexto

> Documento autocontenido para dar contexto de este proyecto a otras conversaciones o proyectos.
> Última actualización: julio 2026.

## Qué es

Landing de marketing de **getmatchpro.com** (jugadores de tenis, pádel, squash y pickleball en Chile).
Objetivo #1: descarga de la app iOS. Nació de una auditoría de diseño al Figma "V4 Matchpro Landing"
(ver `AUDITORIA.md`) que detectó: sin ruta de descarga, ScoreMatch ausente, pricing contradictorio,
narrativa invertida y fragmentación visual del ecosistema. Esta landing es la respuesta a esa auditoría.
Estado actual auditado en `AUDITORIA-V2.md` (6 bloqueantes P0 antes de publicar).

## Stack

- Vite 8 + React 19 + Tailwind CSS 4 (`@theme` en `src/index.css`) + Framer Motion 12
- i18n propio sin librerías: `src/i18n.jsx` (Context) + `src/strings.js` (diccionario ES/EN completo).
  Detecta `navigator.language`, persiste en localStorage, toggle ES|EN en header.
- Sin backend. Única API externa: open-meteo (clima del hero, Santiago por defecto, con fallback).
- `npm run dev` para desarrollo · `npm run build` → `dist/` estático (deploy pensado para Vercel/Cloudflare Pages).

## Design tokens (espejo de BrandKit.swift de la app iOS)

- Marca (logo): mark `#CBFD80` · mint `#82E896` · teal `#34D399`
- Acción: lime `#BBF451` (lime-300) · tinta sobre lime `#35530E` · acento sobre claro `#4D7C0F`
- Neutros: escala slate de Tailwind EXACTA (700 texto, 500 secundario, 400 muted, 100 fondo, 200 bordes)
- Dark ("night", espejo del dark de la app): bg `#0E141B` · card `#1A222E` · borde `#2A3543`
- Semánticos: win emerald `#10B981` · loss rose `#FB7185`
- Tipos: Inter (sans) + JetBrains Mono (eyebrows uppercase, gesto compartido con matchpro.tv)
- Regla heredada de la app: **nunca slate claro sobre fondos de color**; itálica extrabold solo como acento

## Motion system (`src/motion.js`)

Un solo reveal global (fade + 16px, 0.5s, ease `[0.21,0.47,0.32,0.98]`), stagger 80ms,
spring físico 350/30 para la escalerilla. `prefers-reduced-motion` degrada todo a fades.
Presupuesto: nada >1.2s, solo transform/opacity.

## Estructura narrativa (App.jsx)

1. **Hero** — claim "Convierte cada partido en competencia real" + blobs animados de marca +
   escalerilla viva (réplica de la pantalla real "Club Cordillera": La Cima con medallas + Tu Zona,
   "Tú" sube posiciones con spring) + badges App Store/QR + chip de clima en vivo
2. **Ticker** — marquee dark de resultados
3. **Social proof** — contadores (+14.000 partidos, +2.800 jugadores — SIN VERIFICAR)
4. **Problema** — 4 dolores (WhatsApp, niveles inventados, resultados perdidos, mismos rivales)
5. **Cómo funciona** — 3 pasos con timeline animada (Apple/Google sign-in, sin tarjeta)
6. **El partido completo** — 4 beats: Antes·Matchmaking (mapa 96% match) → Durante·ScoreMatch
   (marcador Apple Watch animado, réplica de scorematch.app) → Después·stats → Siempre·escalerilla
7. **Progreso** — "De profesional amateur a amateur profesional" + gráfico de evolución animado
8. **TrueRank** (dark) — "Tu nivel no es lo que dices. Es lo que juegas." + radar animado +
   provisional→validado + columnas Hoy/Roadmap (honestidad anti-vaporware)
9. **Deportes** — 4 cards fotográficas (ilustraciones de la app; tenis usa arcilla)
10. **Clubes** — franja "Tu club en tu bolsillo" (canchas/clases/torneos/arriendos + recibo de
    pago dividido ÷4 animado) + cards aurora: Club Manager (mock browser HTML con dashboard) y
    MatchPro TV (mock TV HTML con el dashboard real de matchpro.tv) + trust B2B (Transbank, Hecho en Chile)
11. **Pricing** — Free $0 / Competitivo $9.990 CLP (toggle anual −20%), trial "2 partidos
    competitivos gratis", franja club-paga (modelo del onboarding oficial)
12. **Testimonios** — PLACEHOLDERS (citas y fotos pravatar — reemplazar antes de publicar)
13. **FAQ** — 6 preguntas acordeón
14. **CTA final** (dark night-app) + **Footer** con columna Ecosistema (ScoreMatch, Club Manager, MatchPro TV)

## Ecosistema (contexto de negocio)

- **MatchPro app** (jugadores, iOS + watchOS): matchmaking, escalerillas públicas/privadas/club,
  desafíos, stats, TrueRank. Onboarding sin paywall inicial (Apple/Google, quiz de nivel provisional).
- **ScoreMatch** (scorematch.app): marcador Apple Watch — es el "durante" del partido, no marca aparte.
- **TrueRank**: nivel calculado, no declarado. Provisional → validado con partidos. En desarrollo:
  comunicarlo como principio + roadmap, nunca como "estándar" ya operativo ni feature de checkout.
- **Club Manager** (B2B SaaS, clientes pagando): reservas, torneos, socios, facturación.
- **MatchPro TV** (matchpro.tv): dashboard para TVs del club, incluido gratis con Club Manager.
- Modelo: club paga (B2B) + freemium jugador; el club puede patrocinar competencias (club-paga).

## Decisiones que NO deben revertirse sin discusión

- CTA único "Descargar gratis" repetido; secundarios subordinados (nada de 7 botones negros iguales)
- Problema SIEMPRE antes que solución; una idea por sección (un bento de features fue construido
  y revertido: el contenido pertenecía al arco del partido y a Clubes)
- Trust B2B vive en Clubes, jamás en el hero de jugadores
- Mockups de producto en español aunque la página esté en EN (son la app real)
- Los tokens vienen de BrandKit.swift; cualquier cambio de color se hace allá primero

## Pendientes P0 (bloqueantes, ver AUDITORIA-V2.md)

1. URL real de descarga (hoy placeholder `getmatchpro.com/app` en 5 refs + QR)
2. Reemplazar avatares pravatar del hero por assets propios
3. Testimonios reales o despublicar la sección
4. Términos/Privacidad/login: rutas reales
5. Verificar cifras de social proof
6. OG image 1200×630 + og:url + apple-touch-icon

## Archivos clave

`src/strings.js` (todo el copy ES/EN) · `src/index.css` (tokens) · `src/motion.js` ·
`src/ui.jsx` (Reveal, CountUp, PhoneFrame, StoreBadges, QrCard) · `src/sections/*` (una por bloque) ·
`AUDITORIA.md` (diagnóstico original del Figma) · `AUDITORIA-V2.md` (estado actual) · `README.md`
