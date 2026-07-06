# Auditoría de diseño — MatchPro Landing (V4)

**Material analizado:** Frame "V4 Matchpro Landing" (Figma, 1512 × 11.227 px, 17 secciones), scorematch.app, matchpro.tv, contexto maestro del ecosistema.
**Rol asumido:** Director de Diseño presentando al equipo fundador.
**Fecha:** Julio 2026

---

## 1. Resumen ejecutivo

El diseño es competente a nivel de ejecución visual, pero falla en las tres cosas que el brief declara como prioritarias.

1. **El objetivo #1 del sitio (descargas de la app) no existe en el diseño.** No hay un solo badge de App Store o Google Play, ni QR, ni mención a "descargar" en las 11.000 px de página. Todos los CTAs ("¡Comenzar a competir!") apuntan a un registro web. O el objetivo declarado está mal, o el landing está mal. Hoy están en contradicción directa.

2. **ScoreMatch no aparece en la página. Cero menciones.** El brief pide que la relación MatchPro–ScoreMatch quede clara; hoy la relación es inexistente. Peor: ScoreMatch (marcador en Apple Watch con estadísticas en vivo) es probablemente el diferenciador más defendible frente a Playtomic/UTR, y el landing lo desperdicia por completo.

3. **El "ecosistema coherente" no existe a nivel de sistema visual.** El landing es candy-light multicolor (azul, lima, púrpura, navy), scorematch.app es dark premium estilo Apple, matchpro.tv es dark editorial con tipografía mono. Tres productos, tres lenguajes visuales, tres personalidades. Un visitante que navegue entre los tres sitios no percibe una empresa: percibe tres.

A esto se suman una narrativa invertida (la solución aparece antes que el problema), un hero anclado en un término que requiere educación previa ("escalerilla" — el propio FAQ necesita definirla), un pricing que contradice el relato del sitio (el plan de entrada excluye escalerillas y rankings, exactamente lo que vende toda la página), y errores de copy que destruyen la percepción premium ("se adappta" en el footer, un FAQ de jugadores subtitulado "para gestionar tu club").

Nada de esto es fatal. La base de ejecución (grillas, componentes, calidad de mockups) es sólida. Pero tal como está, el sitio no cumple su función comercial y no cuenta la historia del ecosistema.

---

## 2. Diagnóstico general

**Qué funciona:**

- La estructura general de página es reconocible y navegable: hero → entrada → problema → features → TrueRank → clubes → deportes → pricing → FAQ → footer. Hay oficio.
- La sección de clubes (dos cards: Club Manager + MatchPro TV) resuelve bien la jerarquía B2B/B2C: presencia sin competir con el mensaje principal. Es de lo mejor de la página.
- TrueRank con sección propia en dark es una decisión correcta de jerarquía (la ejecución del mensaje, no — ver sección 11).
- Los mockups de producto son abundantes y muestran producto real, no ilustraciones abstractas. Eso genera confianza.
- La sección problema ("Si la competencia funciona así, es difícil mejorar") con los 5 dolores es el mejor copy de la página: concreto, empático, reconocible ("Resultados perdidos en WhatsApp").

**Qué falla estructuralmente:**

- El sitio está diseñado como landing de un producto SaaS web, no como landing de una app cuyo objetivo #1 es la descarga.
- Es una colección de secciones bien hechas, no una narrativa. Cada sección funciona aislada; la secuencia no acumula.
- El sistema visual no escala al ecosistema: no hay tokens compartidos con los otros sitios, ni un patrón de "sub-marca" (cómo se ve un producto hijo de MatchPro).

---

## 3. Principales problemas detectados

Ordenados por impacto en negocio:

| # | Problema | Impacto | Evidencia |
|---|----------|---------|-----------|
| 1 | Cero soporte a descarga de app (objetivo #1) | Conversión | Ningún badge de store, ningún QR, CTAs solo a registro web |
| 2 | ScoreMatch ausente del landing | Ecosistema / diferenciación | 0 menciones en 17 secciones |
| 3 | Plan de entrada excluye el core value | Conversión / pricing | "Plan Juega: No incluye rankings ni escalerillas" — el sitio entero vende escalerillas |
| 4 | Sin free tier visible | Adopción / liquidez de red | Competidores (Playtomic, UTR base) son gratis para jugadores; un marketplace de rivales sin masa crítica gratuita no escala |
| 5 | Narrativa invertida | Storytelling | "Empieza a competir en segundos" (solución) precede a "Si la competencia funciona así..." (problema) |
| 6 | Hero anclado en jerga no universal | Claridad 5 s | "Sube en la escalerilla" como headline; el FAQ debe definir qué es una escalerilla |
| 7 | Fragmentación visual del ecosistema | Marca | Landing light-candy vs. ScoreMatch dark-Apple vs. MatchPro TV dark-editorial |
| 8 | Trust bar B2B en landing B2C | Claridad | "100% Configurable · Certificado por Transbank" no significa nada para un jugador en el primer pixel de la página |
| 9 | Redundancia: sección "3 formas de entrar" duplica los features posteriores | Carga cognitiva | "Unirse a escalerilla / Crear escalerilla / Encontrar rivales" se repiten como secciones completas más abajo |
| 10 | TrueRank comunicado como estándar ya operativo | Confianza / vaporware | "El nuevo estándar de clasificación deportiva" para un producto en desarrollo |
| 11 | Errores de copy | Calidad percibida | "se adappta" (footer), FAQ "gestionar tu club con MatchPro" (página de jugadores), "Matchpro Truerank™" vs "TrueRank" |
| 12 | Social proof débil mostrada como fortaleza | Credibilidad | "+120 escalerillas activas" — un número pequeño expuesto en grande puede restar |
| 13 | Monotonía tipográfica | UI | Todos los titulares en bold italic; sin contraste de ritmo |
| 14 | Mockups 3D flotantes en ángulo | Modernidad | Estética 2018–2020; Stripe/Linear/Vercel abandonaron ese recurso hace años |

---

## 4. Evaluación estratégica

### Test de los 5 / 30 segundos / scroll completo

**Primeros 5 segundos (above the fold):** el usuario ve un gradiente azul, tres dispositivos flotando en ángulo y "Compite a tu nivel. Sube en la escalerilla." Entiende que es algo de deporte y competencia. **No entiende:** que es una app, para qué deportes (el chip es pequeño), qué es una escalerilla, ni qué debe hacer (el CTA "¡Comenzar a competir!" no dice si va a descargar, registrarse o pagar). El laptop como dispositivo protagonista comunica "software de escritorio", contradiciendo el objetivo de descarga móvil.

**A los 30 segundos:** entiende que puede unirse o crear escalerillas y buscar rivales, y que hay miles de jugadores. La secuencia le pidió actuar ("Empieza a competir en segundos") antes de explicarle por qué debería importarle.

**Al final del scroll:** entiende que hay planes pagos, que existe algo llamado TrueRank, que hay soluciones para clubes. **Nunca se enteró de que existe ScoreMatch, ni de que puede marcar puntos desde un Apple Watch, ni de que hay una app que descargar.** El FAQ le habló de "gestionar tu club" aunque él es un jugador.

**Qué genera confusión:** la trust bar B2B inicial; el término escalerilla sin definir; la relación entre "¡Comenzar a competir!" y el pricing (¿es gratis empezar?); el salto cromático azul → blanco → navy → candy sin lógica narrativa.

**Qué falta:** descarga de app, ScoreMatch, un "cómo funciona" real (el flujo descargar → unirse → jugar → subir), testimonios/casos con nombre y club real, y una respuesta a "¿cuánto cuesta empezar?" antes del pricing.

**Qué eliminaría:** la trust bar superior (o reemplazarla por social proof de jugadores), la sección "3 formas de entrar" (fusionarla con un "cómo funciona"), la franja decorativa de canchas isométricas antes del FAQ (270 px de nada que rompe el ritmo hacia la conversión final).

### Posicionamiento

El sitio compite implícitamente contra "organizar partidos por WhatsApp" — correcto para el dolor, pero el posicionamiento resultante es "otra app de deporte amateur". El activo defendible del ecosistema (captura de datos en tiempo real vía Apple Watch + ranking objetivo TrueRank + pantallas del club) no se articula. La historia que nadie más puede contar hoy es: **"cada punto que juegas se convierte en datos, ranking y visibilidad — automáticamente"**. Esa historia requiere a ScoreMatch y a TrueRank como capítulos, no como productos ausentes o cajas sueltas.

---

## 5. Evaluación UX

**Flujo y escaneabilidad:**

- La página tiene 15+ secciones y ~11.200 px de alto. Es larga incluso para estándares de landing; con la redundancia eliminada baja un 20–25 % sin perder contenido.
- El patrón de sección es repetitivo: logo-isotipo centrado + titular italic + subtítulo + contenido. Al quinto uso, el ojo deja de registrar jerarquía. Los mejores landings alternan patrones (full-bleed, split, bento, testimonial) para mantener el ritmo.
- Los CTAs intermedios son casi todos negros con el mismo peso ("Explorar escalerillas activas", "Buscar rivales", "Ver ejemplo de perfil competitivo", "Conocer Club Manager"...). Siete CTAs primarios de igual jerarquía = ninguno es primario. Se necesita una jerarquía de dos niveles: un CTA de conversión (descargar/empezar) repetido de forma consistente y CTAs secundarios visualmente subordinados (ghost/link).

**Carga cognitiva:**

- La sección de entrada temprana pide una decisión de tres vías ("unirse / crear / encontrar") a un usuario que aún no sabe qué es el producto. Decisión antes que comprensión.
- El pricing pide otra decisión binaria (Juega vs. Competitivo) con 9 y 13 bullets respectivamente. Las listas largas de features en pricing convierten peor que 4–5 diferencias claras.

**Navegación:**

- Header correcto y sobrio (Escalerillas, Cómo funciona, Precios, Clubes). Pero "Cómo funciona" ancla a una sección que en realidad no explica el funcionamiento, y no hay entrada al ecosistema (ScoreMatch, TV) ni en header ni en footer. El footer enlaza "Blog, Tutoriales, API Docs, Casos de Éxito" — si esas páginas no existen aún, son links muertos que erosionan confianza.

**Accesibilidad:**

- Texto blanco sobre gradiente azul claro en el hero: el contraste en la zona clara del gradiente es dudoso (probable < 4.5:1 en "Escalerillas dinámicas...").
- Texto lima (#C6F24E aprox.) sobre navy en TrueRank funciona; lima sobre blanco (badges "+2.800") probablemente no cumple AA para el texto interior negro-sobre-lima si se reduce en mobile.
- Botones con texto en italic bold pequeño ("¡Comenzar a competir!") + ícono: razonable, pero los signos de exclamación duplicados agregan ruido visual sin función.

**Conversión (resumen — detalle en sección 8):** el funnel visual no tiene un final claro: el CTA final ("La competencia amateur está cambiando") repite el mismo botón genérico del hero sin refuerzo de valor ni fricción reducida (sin "gratis", sin "en 2 minutos", sin badge de store).

---

## 6. Evaluación UI

**Sistema visual:**

- **Color:** conviven cinco familias — gradiente azul (hero), lima/verde (marca), púrpura (chips, Plan Juega, notificaciones), navy (TrueRank, FAQ, footer), y las cards candy (lila, azul, lima) de la sección de perfil. No hay una regla perceptible de cuándo se usa cada una. Resultado: la página se siente como un template multi-tema, no como una marca. La paleta de la marca (lima + verde del isotipo) es la menos protagonista de todas en el hero, que es azul.
- **Tipografía:** un solo recurso para todos los titulares (extrabold italic, aparentemente Poppins/afín). El italic universal comunica "energía deportiva" pero elimina la posibilidad de contraste: cuando todo grita, nada enfatiza. Los productos hermanos ya usan otra cosa (matchpro.tv usa serif/editorial + mono-labels), así que ni siquiera es una decisión de ecosistema.
- **Espaciado:** consistente en general (secciones ~120–160 px), correcto.
- **Componentes:** cards con radios y sombras coherentes; badges pill consistentes. Bien. Pero los íconos mezclan estilos (línea, sólido, duotono con lima) sin sistema.
- **Calidad percibida:** los errores de copy y las inconsistencias de naming (Matchpro Truerank™ / TrueRank™ / pickleball / Pickleball) importan más que cualquier decisión estética. En un producto que vende "medición precisa y confiable", un typo en el footer es una contradicción de marca.

**¿Transmite tecnología, profesionalismo, innovación, confianza, escalabilidad?** Transmite energía y accesibilidad (correcto para amateur), pero se queda en "app deportiva simpática". La capa de "infraestructura seria de datos deportivos" — que es la visión declarada — no está en el lenguaje visual. TrueRank en navy con el esqueleto de pose-tracking es la única sección que la insinúa.

---

## 7. Evaluación de comunicación

- **Tono:** correcto y cercano, en español chileno-neutro. Bien.
- **Jerarquía de mensajes:** el mensaje maestro no existe como frase. "Compite a tu nivel" (hero) compite con "MatchPro convierte cada partido en competencia real" (sección problema, mejor frase de la página) y con "La competencia amateur está cambiando" (cierre). Tres candidatos a claim, ninguno consagrado. Recomendación: "MatchPro convierte cada partido en competencia real" es el claim — es concreto, diferencial y no depende de jerga.
- **Educación de conceptos:** "escalerilla" es un activo (término local, apropiable) y un riesgo (nadie fuera de Chile lo usa; en México/España se dice "escalera/ladder"). Si la ambición es regional, el hero no puede depender del término; úsalo como marca de feature ("Escalerillas™" si se quiere) después de explicar el valor en lenguaje llano.
- **Errores concretos a corregir:** "se adappta" (footer); subtítulo del FAQ ("...gestionar tu club con MatchPro" en la página de jugadores); unificar "TrueRank™"; unificar "pickleball/Pickleball"; revisar "¡...!" en botones (los signos de exclamación en CTAs restan sofisticación — ningún referente premium los usa).

---

## 8. Evaluación de conversión

1. **No hay ruta de descarga.** Si el objetivo #1 es descarga de app: badges de App Store/Google Play en hero, en el cierre y en el footer; QR en desktop (el usuario está en su laptop, el teléfono en la mano); smart app banner en mobile. Nada de esto existe. Si en cambio el producto es web-first (los mockups sugieren webapp), entonces el objetivo declarado del brief está desactualizado y hay que corregir el brief, no solo el sitio. **Esta ambigüedad es la decisión más urgente de todas.**
2. **El primer paso no dice su costo.** "¡Comenzar a competir!" sin "gratis" al lado de un pricing de $4.990/mes genera la duda exacta que mata conversión: "¿me van a cobrar por probar?". Si existe free tier, decirlo en el hero. Si no existe, crearlo es más importante que cualquier decisión de diseño de esta auditoría: un marketplace de rivales cobra por acceso a una red que aún no tiene masa crítica (+2.800 jugadores). La lógica de red dice: jugadores gratis (liquidez) → clubes pagan (Club Manager ya tiene clientes) → jugadores premium pagan por stats/TrueRank avanzado. El pricing actual invierte esa lógica.
3. **Plan Juega excluye escalerillas y rankings.** Todo el sitio vende escalerillas; el plan barato no las incluye. El usuario que baja al pricing tras convencerse descubre que lo que le vendieron cuesta el doble. Es un bait-and-switch involuntario.
4. **Social proof:** los números (+2.800 / +120 / +14.000 / +300) están bien diseñados pero mal curados. +14.000 partidos es fuerte; +120 escalerillas es débil. Mostrar solo los números que impresionan, y agregar la prueba que falta: testimonios con nombre, foto, club y deporte. Cero testimonios en toda la página es una ausencia grave para un producto social.
5. **CTAs:** unificar el primario en un solo verbo y repetirlo (p. ej. "Empieza gratis"). Los secundarios ("Ver ejemplo de perfil", "Explorar escalerillas") deben ser links/ghost, no botones negros idénticos al primario.

---

## 9. Evaluación mobile (y por formato)

No hay frames mobile en el nodo auditado, así que esto es prescriptivo:

- **iPhone (prioritario si el objetivo es descarga):** hero reordenado — titular, badge de store + botón, y un solo teléfono con la escalerilla en pantalla (no tres dispositivos: en 390 px los mockups en ángulo se vuelven ruido ilegible). CTA sticky inferior ("Empieza gratis") tras el primer scroll. Las cards de 3 y 5 columnas pasan a carrusel con scroll-snap, no a columnas apiladas infinitas (la sección de 5 dolores apilada mide dos pantallas). Pricing: cards apiladas con el plan recomendado primero y el toggle mensual/anual sticky. Smart App Banner de iOS activado.
- **iPad:** el punto ciego típico — evitar el estiramiento del layout desktop a 2 columnas flotantes. Grillas de 3 → 2+1 balanceado, hero con dispositivo horizontal.
- **MacBook (1280–1512):** el diseño actual está pensado aquí; principal ajuste es contener los anchos de línea de subtítulos (hoy ~90 caracteres en algunos bloques; ideal 60–70).
- **iMac (1920+):** definir max-width del contenido (1200–1280 px) y dejar respirar; los gradientes full-bleed actuales escalan bien, los mockups en ángulo no (se pixelan o dominan). Aprovechar el espacio para el demo vivo de escalerilla (ver sección 16), no para agrandar tipografía.

---

## 10. Relación MatchPro + ScoreMatch

**Estado actual: la relación no existe en el landing.** ScoreMatch tiene su propio sitio (bien ejecutado, dark premium, "Marca el punto. Siente el partido.") que sí enlaza de vuelta a getmatchpro.com. La flecha apunta en una sola dirección: quien llega a ScoreMatch descubre MatchPro; quien llega a MatchPro jamás descubre ScoreMatch.

**Por qué es grave:** ScoreMatch es el único pedazo del ecosistema que un competidor no puede copiar en un trimestre. "Registra resultados" (lo que dice el landing) es commodity; "marca cada punto desde tu Apple Watch sin sacar el teléfono, y el partido completo se convierte en estadísticas en tu perfil" es una demo que vende sola. Además resuelve la objeción implícita de todo sistema de resultados: la fricción de registrar.

**Cómo integrarlo (sin convertirlo en "otra empresa"):**

1. **No como sección de producto, sino dentro del flujo del jugador.** En la sección "Cada partido mejora tu perfil competitivo", el primer paso del relato debe ser la captura: muñeca → estadística → escalerilla. Un visual de Apple Watch con el marcador gigante + la línea "Marca cada punto desde tu muñeca con ScoreMatch, y el partido entero se vuelve historia en tu perfil".
2. **Naming subordinado:** siempre "ScoreMatch — de MatchPro" o "MatchPro ScoreMatch". En su propio sitio ya usa el isotipo MatchPro; el landing debe devolver el gesto.
3. **Badge "Apple Watch" en el hero o en la franja de features.** Es un símbolo de estatus tecnológico que eleva la percepción de toda la plataforma, exactamente lo que la marca necesita para salir de "app simpática".
4. **Footer:** columna "Ecosistema" con ScoreMatch, Club Manager, MatchPro TV (matchpro.tv ya la tiene; el landing principal, no — la asimetría es reveladora).

---

## 11. Cómo comunicar TrueRank (sin vaporware)

**Problema actual:** "El nuevo estándar de clasificación deportiva" en presente + "™" comunica un producto terminado y consagrado. Para un sistema en desarrollo, esto genera dos riesgos: frustración (el usuario lo busca y no lo encuentra completo) y escepticismo (un "estándar" que nadie conoce suena a humo). Además el pricing lo menciona como feature activa ("Verificación de nivel con Matchpro Truerank™") con naming inconsistente.

**Estrategia recomendada — comunicar el principio, no el producto:**

1. **El principio ya es verdadero hoy:** "No preguntamos tu nivel. Lo calculamos." es la mejor frase de esa sección y es defendible ya (el ranking actual ya calcula por resultados). Que el titular sea el principio, no el estándar: *"Tu nivel no es lo que dices. Es lo que juegas."*
2. **Presentarlo como sistema en evolución con honestidad explícita:** una línea tipo "TrueRank mejora con cada partido registrado en MatchPro. Hoy ordena tu escalerilla; pronto calibrará tu nivel entre clubes, ciudades y deportes." Esto convierte el estado incompleto en narrativa de momentum (patrón Linear: roadmap público como feature).
3. **Anclarlo en evidencia visible:** mostrar el número TrueRank real en los mockups del perfil (ya aparece "TrueRank™ 1475" en la app) — "esto ya existe en tu perfil" — y dejar lo aspiracional (matchmaking inteligente, calibración cruzada) en una franja "En el roadmap" visualmente diferenciada (outline, no filled).
4. **Nunca en el pricing como feature vendible** hasta que esté operativo como se promete. Hoy es un argumento de por qué los rankings son confiables, no un ítem de checkout.
5. **Naming:** una sola forma — "TrueRank" — en todo el ecosistema (matchpro.tv ya dice "Tu TrueRank"; el pricing del landing dice "Matchpro Truerank™"; escoger y ejecutar).

---

## 12. Integración correcta de Club Manager

La sección actual ("MatchPro también impulsa a los clubes", card "Digitaliza tu club") está **bien resuelta en jerarquía**: una sección, dos cards, CTAs de salida hacia su funnel propio. Mantener ese patrón. Ajustes:

1. **Puente narrativo, no cambio de tema.** Hoy la sección aparece como paréntesis B2B. La transición correcta es a través del jugador: *"¿Juegas en un club? MatchPro también trabaja para él."* — y mejor aún, el argumento cruzado: *"Los clubes con MatchPro te dan reservas, torneos y tu ranking en la pantalla del lobby."* El jugador se vuelve el canal de venta hacia su club (el QR de matchpro.tv ya explota esta idea en dirección inversa).
2. **Mover la trust bar B2B aquí.** "Certificado por Transbank · Infraestructura segura · Hecho en Chile" pertenece a esta sección (y a la página /clubes), no al primer pixel del landing de jugadores.
3. **Una prueba, no una lista.** Club Manager ya tiene clientes pagando: un logo-strip de 4–6 clubes reales o un dato ("X clubes en Chile operan con MatchPro") vale más que los cuatro bullets actuales de features.
4. **CTA correcto:** "Conocer Club Manager →" está bien; agregar el micro-CTA "Agenda una demo" que ya existe en su landing propio, porque el decisor de club que llegó hasta aquí no necesita otro paso intermedio.

---

## 13. Integración correcta de MatchPro TV

matchpro.tv es, irónicamente, el mejor sitio del ecosistema (narrativa numerada 01–06, demo del dashboard como hero, honestidad de plataforma "Apple TV hoy, Android TV pronto", posicionamiento nítido "incluido en Club Manager, sin costo extra"). El landing principal debe:

1. **Mantenerlo como card secundaria dentro de la sección de clubes** (como hoy) pero con su ángulo ganador: **"incluido gratis con Club Manager"** — que es su mejor argumento y hoy no aparece en el landing principal.
2. **Explotar su cara B2C que ya existe:** matchpro.tv tiene "Modo Jugador" (tu ranking en la TV del living). Esa es la conexión emocional con el jugador — "Como ESPN, pero de ti" — y merece una mención de una línea en la sección de perfil competitivo del landing: *"Y si quieres, en la TV de tu casa con MatchPro TV."* Es el tipo de detalle aspiracional que hace sentir el ecosistema sin agregar una sección.
3. **Rol narrativo:** MatchPro TV es la capa de **visibilidad** del ecosistema (el partido se ve), igual que ScoreMatch es la capa de **captura** (el partido se registra) y TrueRank la capa de **medición** (el partido cuenta). Esa tríada es el storytelling del ecosistema — ver sección 15.

---

## 14. Propuesta de arquitectura ideal

Regla de oro: **una idea por sección, cada sección responde una pregunta que el usuario se hace en ese orden.**

| # | Sección | Pregunta que responde | Contenido |
|---|---------|----------------------|-----------|
| 0 | Header | — | Logo, Cómo funciona, Escalerillas, Precios, Clubes, [Empieza gratis] |
| 1 | **Hero** | ¿Qué es esto y qué gano? | Claim: "Convierte cada partido en competencia real." Sub: rivales a tu nivel, escalerillas vivas y estadísticas automáticas para tenis, pádel, squash y pickleball. CTA: Empieza gratis + badges de store/QR. Visual: UNA escalerilla viva reordenándose (producto real, plano, sin ángulos 3D) |
| 2 | Social proof strip | ¿Alguien más lo usa? | Solo los números fuertes (+14.000 partidos, +2.800 jugadores) + 2 logos de clubes |
| 3 | **Problema** | ¿Por qué me duele lo actual? | La sección de 5 dolores actual, casi intacta — pero ANTES de cualquier solución |
| 4 | **Cómo funciona** | ¿Qué hago yo, en orden? | 3 pasos: Descarga y crea tu perfil → Únete a una escalerilla o desafía rivales → Juega; el resultado actualiza tu ranking solo. (Absorbe y elimina la actual "3 formas de entrar") |
| 5 | **El partido completo** (feature principal) | ¿Qué lo hace distinto? | El loop: ScoreMatch captura desde la muñeca → estadísticas automáticas → la escalerilla se reordena → tu perfil crece. Aquí vive la integración ScoreMatch + perfil competitivo (fusiona 3 secciones actuales) |
| 6 | **TrueRank** | ¿Por qué confiar en el ranking? | "Tu nivel no es lo que dices. Es lo que juegas." + roadmap honesto |
| 7 | Deportes | ¿Sirve para mi deporte? | Las 4 cards actuales, compactadas |
| 8 | **Para tu club** | ¿Y mi club? | Club Manager + MatchPro TV ("incluido gratis"), trust B2B (Transbank, hecho en Chile), 1 caso real |
| 9 | **Pricing** | ¿Cuánto cuesta? | Free tier explícito + 1–2 planes pagos con 4–5 diferencias claras |
| 10 | Testimonios | ¿Le funciona a gente como yo? | 2–3 jugadores reales con nombre, club y deporte (NUEVO — hoy no existe) |
| 11 | FAQ | Objeciones finales | 4–6 preguntas, en light (no navy), copy corregido |
| 12 | CTA final | Última oportunidad | "La competencia amateur está cambiando" + Empieza gratis + badges |
| 13 | Footer | — | Con columna Ecosistema: ScoreMatch · Club Manager · MatchPro TV |

Cambios netos: de ~15 secciones a 12, dos secciones nuevas (Cómo funciona real, Testimonios), tres fusionadas, dos eliminadas (3-formas-de-entrar, franja decorativa), y el problema movido antes de la solución.

---

## 15. Propuesta de storytelling ideal

**El dispositivo narrativo: seguir un solo partido a través del ecosistema.**

La historia que une todo no es una lista de productos, es el viaje de un partido de martes por la noche:

1. **Antes** — "Encontraste rival de tu nivel sin rogar en el grupo de WhatsApp." (MatchPro, matchmaking)
2. **Durante** — "Marcaste cada punto desde la muñeca, sin tocar el teléfono." (ScoreMatch)
3. **Después** — "El resultado subió solo. La escalerilla se reordenó. Tus estadísticas crecieron." (MatchPro + TrueRank)
4. **Siempre** — "Y tu nombre quedó en la pantalla del club." (MatchPro TV / Club Manager)

Este arco resuelve de un golpe los tres problemas del brief: los productos dejan de ser cajas y se vuelven momentos de una misma experiencia; ScoreMatch queda subordinado naturalmente (es el "durante" de MatchPro, no una empresa aparte); y Club Manager/TV quedan como el escenario donde la historia se exhibe, sin competir con el protagonista.

**Jerarquía de mensajes resultante:**
- Claim maestro: *"Convierte cada partido en competencia real."*
- Soporte 1 (red): rivales y escalerillas a tu nivel.
- Soporte 2 (tecnología): captura y estadísticas automáticas (ScoreMatch).
- Soporte 3 (confianza): nivel calculado, no declarado (TrueRank).
- Mensaje B2B subordinado: "y todo esto, tu club lo puede operar" (Club Manager + TV).

---

## 16. Propuesta de animaciones premium (React + Tailwind + Framer Motion)

Principio rector: **el producto es la animación**. Nada de partículas ni parallax decorativo; cada movimiento debe demostrar una promesa del producto.

1. **Hero — la escalerilla viva (la animación insignia).** Una tabla de escalerilla real donde, 1.5 s después del load, entra un resultado y la fila del jugador sube una posición con spring físico (`layout` animation de Framer Motion, `type: "spring", stiffness: 350, damping: 30`), badge "+1 posición" con fade-up. Se repite en loop lento (cada 8 s). Esto ES el pitch del producto sin leer una palabra. Costo: bajo (es un `<motion.li layout>` con reorder de array).
2. **Contadores de social proof:** count-up al entrar en viewport (`useInView` + spring sobre el valor), 0.8 s, una sola vez. Nada de counters que reinician.
3. **Reveals de sección:** un solo patrón global — `opacity 0→1` + `y: 16→0`, `duration: 0.5`, `ease: [0.21, 0.47, 0.32, 0.98]`, stagger de 80 ms entre hijos. Prohibido mezclar direcciones de entrada por sección (hoy la tentación con tanto layout alternado será animar izquierda/derecha; resistirla).
4. **Sección "El partido completo":** scroll-driven en 3 beats con `useScroll` + `useTransform`: el Watch marca un punto → el número viaja al card de estadística → la fila de escalerilla sube. Es la versión animada del storytelling de la sección 15. Es la única sección que merece scroll-telling; más de una y se vuelve feria.
5. **Hovers:** cards `y: -4` + sombra de token (150 ms); botones primarios con brillo sutil del ícono flecha (`x: 0→3` en hover); filas de escalerilla con highlight lima al 8 %. Nada de scale > 1.03.
6. **Header:** compactación on-scroll (69 → 56 px, fondo `backdrop-blur` + borde 1 px) — patrón Linear/Vercel.
7. **TrueRank:** el esqueleto de pose-tracking se dibuja con `pathLength` 0→1 al entrar en viewport (1.2 s). Único momento "wow" técnico permitido, coherente con el mensaje de visión computacional.
8. **Sistema:** todas las duraciones/easings como tokens (`--motion-fast: 150ms`, `--motion-base: 300ms`, `--motion-slow: 500ms`, un solo cubic-bezier de marca). `prefers-reduced-motion` degrada todo a fades de 200 ms. Presupuesto: ninguna animación > 1.2 s, nada anima `width/height/top` (solo transform/opacity).

---

## 17. Roadmap priorizado de mejoras

**P0 — Antes de publicar (días, no semanas; sin rediseño):**
1. Resolver la ambigüedad estratégica: ¿descarga de app o registro web? Todo lo demás depende de esto.
2. Corregir copy: "se adappta", subtítulo del FAQ, naming TrueRank, exclamaciones en CTAs.
3. Añadir badges de store (o el CTA correcto según decisión 1) en hero, cierre y footer.
4. Mención mínima de ScoreMatch en la sección de perfil + columna Ecosistema en footer.
5. Quitar la trust bar B2B del top; moverla a la sección clubes.
6. Curar social proof (eliminar +120; considerar eliminar +300).

**P1 — Estructura (1–2 sprints):**
7. Reordenar narrativa: problema antes que solución; fusionar "3 formas" en "Cómo funciona".
8. Rediseñar pricing: free tier explícito, diferencias reducidas a 4–5, escalerillas incluidas en el plan de entrada (decisión de negocio, no de diseño — pero el diseño la expone).
9. Jerarquía de CTAs a dos niveles con un solo verbo primario.
10. Sección de testimonios reales.
11. Integración completa ScoreMatch en el flujo (sección "El partido completo").
12. Reencuadre TrueRank (principio + roadmap honesto).

**P2 — Sistema (siguiente ciclo):**
13. Unificación cromática del landing (una familia dominante + lima de marca; eliminar el hero azul o convertir el azul en color de marca real en todo el ecosistema — decisión, no promedio).
14. Motion system completo (sección 16).
15. Design tokens compartidos entre getmatchpro.com, scorematch.app y matchpro.tv (tipografía, radios, sombras, motion) + patrón de sub-marca para productos hijos.
16. Mockups planos de producto real reemplazando los 3D en ángulo.
17. Versiones mobile/tablet diseñadas en Figma, no derivadas en código.

---

## 18. Cómo se vería la mejor versión posible de este sitio

Abres getmatchpro.com y en el primer segundo hay una sola cosa en pantalla: una escalerilla real con nombres reales, y ves —sin tocar nada— cómo un resultado entra y un jugador sube una posición con un movimiento físico y satisfactorio. Arriba, seis palabras: **"Convierte cada partido en competencia real."** Un botón: **Empieza gratis**. Al lado, el badge de la App Store y un QR. Ya entendiste qué es, qué hace y qué te cuesta probarlo: nada.

Bajas y la página te reconoce: "siempre los mismos rivales, niveles inventados, resultados perdidos en WhatsApp". Te ríes porque es tu grupo de pádel. Tres pasos te muestran qué tan corto es el camino. Luego la página te muestra el martes por la noche perfecto: un Apple Watch marca un punto, el punto se vuelve estadística, la estadística mueve tu nombre hacia arriba, y tu nombre aparece en la pantalla del lobby de tu club. Cuatro productos acaban de pasar frente a ti y no notaste ninguna frontera entre ellos — solo notaste que tu partido de los martes merece esa producción.

Una sección oscura y sobria te dice algo que ningún competidor te dice: *"Tu nivel no es lo que dices. Es lo que juegas."* — y tiene la honestidad de mostrarte lo que ya hace y lo que viene. El pricing no te castiga por entrar: juegas gratis, pagas cuando quieras competir en serio. Tres jugadores con nombre y club cuentan que subieron. Y si administras un club, hay una puerta clara con tu nombre, certificada por Transbank, con una TV que trabaja gratis para ti.

Cierras la pestaña y te quedó una frase, un gesto (la fila subiendo) y una acción pendiente en el teléfono. Eso es un ecosistema coherente: no una página que lista productos, sino una historia donde cada producto es un momento — y el jugador es el protagonista de todos.

---

*Auditoría basada en: Figma "V2 MatchPro" frame 2623-18638 (V4 Matchpro Landing, 17 secciones capturadas y revisadas), scorematch.app, matchpro.tv y el contexto maestro del proyecto MatchPro.*
