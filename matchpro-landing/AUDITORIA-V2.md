# Auditoría exhaustiva — Landing MatchPro (build actual)

**Objeto:** proyecto `matchpro-landing` (React 19 + Tailwind 4 + Framer Motion 12, i18n ES/EN).
**Método:** revisión completa de código fuente, contenido, arquitectura, build de producción y contraste contra la auditoría original del Figma V4.
**Fuera de alcance declarado:** QA visual renderizado (el entorno no puede ejecutar un browser y la extensión de Chrome no respondió). Todo hallazgo de layout responsive queda como riesgo abierto a verificar en dispositivo.
**Fecha:** Julio 2026

---

## 1. Resumen ejecutivo

El sitio resolvió los 14 problemas de la auditoría original y la narrativa quedó correcta: problema → cómo funciona → el partido completo (antes/durante/después/siempre) → progreso → TrueRank → deportes → clubes → precios → prueba social → FAQ → cierre. El sistema visual es coherente con el BrandKit de la app, el motion system tiene tokens y disciplina, y el i18n es funcional.

**Veredicto: no publicable todavía.** Hay 6 bloqueantes (P0), todos de contenido/confianza, no de diseño: URLs placeholder, testimonios y fotos inventadas (incluidas 8 caras de pravatar en el hero), links legales muertos, cifras de social proof sin verificar y SEO/OG inexistente para compartir. Ninguno toma más de una tarde en conjunto, pero publicar con cualquiera de ellos daña exactamente lo que el sitio vende: confianza y medición seria.

---

## 2. Cumplimiento contra la auditoría original

| # | Problema original (Figma V4) | Estado |
|---|------------------------------|--------|
| 1 | Cero soporte a descarga de app | ✅ Badges App Store + QR en hero/cierre, sticky CTA mobile, "pronto" en Play |
| 2 | ScoreMatch ausente | ✅ Beat "Durante" con el marcador real de scorematch.app animado, naming subordinado |
| 3 | Plan de entrada excluía el core | ✅ Pricing del onboarding: Free real + Competitivo |
| 4 | Sin free tier | ✅ "$0 para siempre" + trial de 2 partidos |
| 5 | Narrativa invertida | ✅ Problema antes que solución |
| 6 | Hero anclado en jerga | ✅ Claim en lenguaje llano + escalerilla demostrada visualmente (demo viva) |
| 7 | Fragmentación visual del ecosistema | ✅ Tokens espejo de BrandKit.swift; slate exacto de Tailwind |
| 8 | Trust bar B2B en landing B2C | ✅ Movida a sección Clubes |
| 9 | Redundancia "3 formas de entrar" | ✅ Absorbida en "Cómo funciona"; el intento de bento fue detectado y revertido |
| 10 | TrueRank como vaporware | ✅ "Hoy vs roadmap" + provisional→validado del onboarding |
| 11 | Errores de copy | ✅ Sin typos detectados en revisión completa de strings.js |
| 12 | Social proof débil expuesta | ⚠️ Curada (+14.000/+2.800), pero **sin verificar contra datos reales** |
| 13 | Monotonía tipográfica | ✅ Itálica solo como acento; mono para eyebrows |
| 14 | Mockups 3D en ángulo | ✅ Producto real plano + recreaciones HTML nítidas |

Adiciones posteriores bien integradas: Progreso (retención), beat "Antes · Matchmaking", pago dividido en Clubes, clima en vivo, i18n ES/EN.

---

## 3. Hallazgos P0 — bloqueantes de publicación

**P0-1 · URL de descarga placeholder.** `https://getmatchpro.com/app` aparece en 5 puntos de `src/` (header, sticky, badges, 2 CTAs de pricing) y el QR (`public/qr-app.svg`) codifica esa misma URL. Si la ruta no existe al publicar, el CTA principal del sitio es un 404. Acción: definir la URL real (App Store directo o redirect propio — recomiendo redirect propio `getmatchpro.com/app` con tracking), y regenerar el QR.

**P0-2 · Caras de pravatar en el hero.** La escalerilla viva (La Cima + Tu Zona) usa 7 fotos de `i.pravatar.cc` — personas reales de un servicio de placeholders, sin licencia clara para uso comercial, en el elemento más visible del sitio, con dependencia de un tercero en runtime (si pravatar cae, el hero muestra imágenes rotas). Acción: exportar los avatares demo de la app (los mismos de tus screenshots) a `public/avatars/` o usar iniciales con gradiente de marca.

**P0-3 · Testimonios inventados.** Las 3 citas, nombres y fotos de la sección Jugadores son ficción. Publicar testimonios falsos es el riesgo reputacional más barato de evitar que existe. Acción: conseguir 3 reales con autorización, o despublicar la sección hasta tenerlos (está aislada; quitarla es una línea en App.jsx).

**P0-4 · Links muertos.** `getmatchpro.com/terminos`, `/privacidad` y `/login` no están confirmados. Términos y Privacidad además son legalmente necesarios si cobras suscripciones. Acción: crear las páginas o apuntar a las existentes; confirmar la ruta real de login.

**P0-5 · Social proof sin verificar.** "+14.000 partidos, +2.800 jugadores" vienen del Figma original, no de tu base de datos. Si un periodista o inversionista pregunta, necesitas respaldarlos. Acción: verificar contra producción y ajustar.

**P0-6 · SEO y compartir en redes.** `index.html` tiene título/description solo en ES (correcto como default) pero: sin `og:image` (compartir el link en WhatsApp/Instagram — tu canal natural — se ve como texto plano), sin `og:url`, sin apple-touch-icon, sin robots.txt/sitemap. El i18n es client-side, así que la versión EN es invisible para buscadores (aceptable hoy, decidido conscientemente — pero el OG image no es negociable). Acción: OG image 1200×630 con el hero, meta og:url, apple-touch-icon 180×180.

---

## 4. Hallazgos P1 — calidad y percepción

**P1-1 · ~600 KB de assets muertos embarcados.** El build incluye imágenes que ya no se usan tras las iteraciones: `courts/tenis.webp` (128K, Deportes usa arcilla), `app/perfil.webp` (52K), `app/truerank-phones.webp` (32K), `app/matchprotv-tv.webp` y `app/clubmanager-laptop.webp` (176K, reemplazadas por mocks HTML), y los 4 `racket-*.svg` (Deportes usa `sport-*.svg`). Vite copia todo `public/` al build. Acción: borrar o mover a un directorio `_unused/` fuera de public.

**P1-2 · `courts/pickleball.webp` pesa 256 KB** — el doble que sus pares por su altura. Recomprimir a ~120 KB (quality 75 o recorte).

**P1-3 · Animaciones corriendo fuera de viewport.** `LiveLadder` (interval 4 s) y `ScoreWatch` (1.9 s) siguen ejecutándose aunque la sección no esté visible; los blobs (blur 70 px) y auroras animan siempre. En un móvil de gama media esto es batería y jank gratis. Acción: gatear los intervals con `useInView` y considerar reducir blobs simultáneos bajo `sm:`.

**P1-4 · Sin navegación mobile.** Los links del header se ocultan bajo `md:` y no hay menú alternativo. La conversión está cubierta (sticky CTA), pero un usuario mobile no puede saltar a Precios o Clubes. Acción mínima: menú hamburguesa simple o al menos anclar el logo a top y confiar en el scroll; recomendado: sheet con los 5 links.

**P1-5 · Formato numérico fijo es-CL en la versión EN.** `CountUp` y `RankCard` usan `toLocaleString("es-CL")` siempre: un usuario EN ve "14.000" donde espera "14,000". Los precios en CLP con punto chileno son defendibles (es la moneda), los contadores no. Acción: derivar el locale del idioma activo.

**P1-6 · Contraste bajo en microtextos.** `text-mutedink` (slate-400, ~3:1 sobre blanco) se usa en textos informativos pequeños ("Pronto en Google Play", captions de mocks). Bajo AA para texto normal. Acción: subir a slate-500 donde el texto comunique información; slate-400 solo para decorativo.

**P1-7 · Inconsistencia menor de copy.** "Cómo funciona" dice "Tus primeros partidos competitivos son gratis"; pricing y FAQ dicen "2 partidos". Unificar en "2" (la especificidad vende y evita discusiones de soporte).

**P1-8 · Clima hardcodeado a Santiago.** Correcto como default sin fricción, pero un usuario de Arica ve el clima de Santiago sin etiqueta de ciudad. Acción barata: añadir "Santiago" al chip; acción buena en prod: geolocalizar por IP en el edge (header de Cloudflare/Vercel) sin pedir permisos.

**P1-9 · Riesgos responsive no verificados** (por falta de render): la composición del hero (teléfono + escalerilla superpuestos) bajo 360 px; la franja jugador de Clubes con el recibo en pantallas medianas; el fade del teléfono de matchmaking en el beat "Antes"; el ghost text de Problema (9rem) en mobile. Requieren QA en dispositivo antes de publicar.

---

## 5. Hallazgos P2 — optimización y deuda controlada

- **JS 129 KB gzip.** Razonable; si quieres bajar ~25-30 KB, migrar a `LazyMotion` + `m.` de framer-motion. No urgente.
- **LCP**: el H1 es el candidato LCP y las fonts van con `display=swap` ✓; `home.webp` ya es eager. Mejora fina: `<link rel="preload">` del CSS de fonts y `fetchpriority="high"` en la imagen del hero.
- **strings.js (~650 líneas)** funciona; si el sitio crece a más páginas, dividir por namespace. Hoy, dejarlo.
- **Analytics** ausente (decisión pendiente: Plausible/GA4) — necesario para medir el funnel de descarga que todo el diseño optimiza.
- **Prerender /en** con hreflang: solo cuando el mercado EN sea objetivo real.
- **Accesibilidad — estado general bueno**: aria-expanded en FAQ, aria-pressed en toggle de idioma, aria-hidden en decorativos, `prefers-reduced-motion` degradando blobs/marquee/ladder/radar, alt texts localizados. Deuda menor: el marquee no tiene equivalente textual (aceptable, es decorativo) y los mocks HTML son aria-hidden parcialmente (BrowserMock expone texto — inocuo).
- **Repo**: commit inicial limpio; falta remote y CI de deploy (decisión Vercel/Cloudflare pendiente de tu respuesta).

---

## 6. Lo que está bien y no hay que tocar

La escalerilla viva del hero replicando la pantalla real; el arco de 4 beats del partido (es la sección más diferenciadora del sitio); TrueRank con honestidad hoy/roadmap + radar animado; el pricing con free tier y club-paga transparente; los tokens espejo del BrandKit con slate exacto; el motion system con presupuesto y reduced-motion; las recreaciones HTML de Club Manager/TV (nítidas y animadas donde una foto sería estática); la disciplina de una idea por sección tras revertir el bento.

---

## 7. Checklist priorizada de salida a producción

**Bloqueante (P0):**
1. URL real de descarga + regenerar QR
2. Avatares del hero: reemplazar pravatar por assets propios
3. Testimonios reales o despublicar sección
4. Términos/Privacidad/login: rutas reales
5. Verificar cifras de social proof
6. OG image + og:url + apple-touch-icon

**Antes de la primera campaña (P1):**
7. Limpiar ~600 KB de assets muertos + recomprimir pickleball
8. Gatear intervals con useInView
9. Menú mobile
10. Locale de números por idioma
11. Contraste de microtextos a slate-500
12. Unificar "2 partidos" en todo el copy
13. QA visual en iPhone real (hero, Clubes, beat Antes, ghost text)

**Cuando haya tracción (P2):**
14. Analytics · LazyMotion · preload LCP · robots/sitemap · geolocalización del clima · prerender /en

---

*Auditoría basada en revisión línea a línea de src/, public/, dist/ y strings.js del build actual, contrastada contra `AUDITORIA.md` (auditoría original del Figma V4). QA visual renderizado: pendiente, declarado fuera de alcance.*
