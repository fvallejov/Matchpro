# MatchPro Sales App — Kit comercial unificado (MVP)

Presentación interactiva para reuniones de venta con clubes. Reemplaza el PPTX de
escalerillas, el PDF de Club Manager y la lámina de propuesta: **un solo artefacto,
personalizable por club, con los mocks vivos del producto real**. Hermana de
`clubmanager-landing` (mismo stack, tokens y motion system).

## Correr

```bash
npm install
npm run dev      # desarrollo → http://localhost:5173
npm run build    # producción → dist/index.html (UN solo archivo autocontenido)
npm run smoke    # build + test de humo (jsdom)
```

El build es **un único HTML** (`vite-plugin-singlefile`): se abre con doble clic,
funciona sin internet en la reunión (solo las fuentes de Google requieren red; con
caché del browser funciona offline) y se puede enviar por WhatsApp/email como
leave-behind. También se puede publicar en `sales.getmatchpro.com` (está `noindex`).

## Personalización por club (sin tocar código)

La app lee la URL:

```
index.html?club=ossandon                     → preset definido en src/club.jsx
index.html?nombre=Club San Carlos&canchas=9  → personalización al vuelo
index.html?nombre=Andes Pádel&canchas=4&gmv=2500000&deportes=Pádel
```

Parámetros: `club` (slug de preset) · `nombre` · `canchas` · `gmv` (pagos online
mensuales estimados, CLP) · `deportes`. El nombre del club aparece en la portada,
en la banda del panel (mocks), en los torneos ("Copa X"), en MatchPro TV, en la
calculadora y en la propuesta.

Para agregar un preset permanente: editar `CLUBES` en `src/club.jsx`.

## Preparar la reunión (tecla `E` o ⚙ en la barra)

Panel interno del vendedor: edita club (nombre, canchas, GMV, deportes), supuestos del
simulador de proyección, condiciones comerciales sancionadas (piloto sí/no) y qué
láminas mostrar en esta reunión. Genera el **link personalizado** para enviar o abrir
el día de la demo. Portada y Propuesta siempre visibles.

**Negociación con barandas** (las realidades de los clubes son diversas, la política es
una sola): el vendedor puede conceder **meses gratis (0–3)** y **descuento sobre el fee
(10/20/30%) por tiempo limitado (3/6/12 meses)**. La propuesta siempre muestra el precio
de lista y la duración de la concesión. Lo que NO se negocia en la reunión: las
comisiones ($750 + 4%, cubren el costo Transbank), descuentos permanentes y precios de
lista — eso vive en `src/pricing.js` y es decisión de negocio. Ampliar el menú de
concesiones = editar `NEGOCIACION` en pricing.js.

## Primera reunión (descubrimiento, sin datos del club)

Cuando no hay antecedentes del club, la primera reunión es **descubrimiento, no
presentación**: el objetivo es calificar y ganar la segunda reunión, no cerrar ni
cotizar. En Preparar hay dos botones de receta:

- **◇ Primera reunión**: arma en un clic el set mínimo de descubrimiento —
  **Diagnóstico → El panel → Mercado → Implementación** (Portada y Propuesta van fijas).
  La **Calculadora queda fuera** y el precio se difiere: se arma con los números reales
  del club para la segunda reunión. No aplica concesiones y **no preselecciona perfil**:
  el perfil del Diagnóstico se elige en vivo según lo que va contando el club. Como no se
  sabe qué van a preguntar, no se precura: el índice (`G`) permite saltar a cualquier
  lámina que pidan.
- **✦ Sugerir configuración**: para cuando SÍ hay contexto — cura láminas y concesiones
  según el perfil de diagnóstico y el tamaño del club (canchas).

Después de una reunión de descubrimiento, registrar en la Bitácora (`R`) lo averiguado
(canchas, perfil, herramientas actuales, GMV estimado): queda listo para preparar la
segunda reunión ya personalizada, con la Calculadora y la Propuesta.

## Uso en reunión

- Lienzo fijo 1280×720 escalado al viewport: la altura de la presentación nunca varía.
- `←` `→` navegar · `G` índice (salto no lineal según la conversación) · `E` preparar
  reunión · `F` pantalla completa · `P` exporta PDF (apila las láminas e imprime).
- **Índice (`G`)**: en la sesión del vendedor muestra **todas** las láminas —
  numeradas las de la selección, atenuadas (`+`) las de fuera— y permite saltar a
  cualquiera durante la reunión. Las flechas y los puntos recorren solo la selección; el
  índice es el atajo para lo no previsto. En el link del cliente (`modo=cliente`) el
  índice muestra **solo** las láminas seleccionadas.
- Los puntos de la barra inferior también navegan; la URL guarda la lámina (`#precio`).
- **Fondo a sangre completa**: el fondo de cada lámina llena todo el viewport (el
  contenido vive en el lienzo 1280×720). Si agregas o cambias el fondo de una lámina,
  actualiza también su `bg` en el arreglo `SLIDES` de `src/App.jsx`.

## Exportar a PDF (tecla `P`)

`P` apila las láminas de la selección e imprime — pensado como **documento para imprimir
o dejar**, no como captura del deck en pantalla. Todo el tema de impresión vive en el
bloque `@media print` de `src/index.css`:

- **El deck se imprime en claro**: las láminas oscuras van a fondo blanco con tinta
  oscura (ahorra tinta y se lee en papel). Basta con dejar **«Gráficos de fondo»
  desactivado** (el default) en el diálogo.
- **No es todo blanco — jerarquía por bloques de color**: las tarjetas oscuras pasan a
  bloque gris claro con borde, y los acentos (pills lime/teal, `bg-inkstrong`) conservan
  su color.
- **Los gráficos se imprimen como figura oscura**: el gráfico del benchmark va envuelto
  en `.print-figure`, que en el PDF se pinta como bloque oscuro para que las barras y la
  curva se vean (en papel blanco quedarían invisibles). Marca con `.print-figure`
  cualquier data-viz que dependa de fondos/gradientes de color.
- **Los mockups del producto se conservan tal cual**: los mocks de Club Manager (panel,
  reservas, pagos, torneos, TV, dashboard…) llevan la clase `.mock` y se imprimen con su
  diseño y colores originales. Al agregar un mock nuevo, márcalo con `.mock` (o pásalo
  por `SlideSplit`, que ya lo hace) para que se preserve.
- **Sin sliders ni adornos que no funcionan en papel**: los sliders (`.range-pro`) se
  ocultan y queda el valor configurado (va en la etiqueta del control); las auroras y las
  sombras (drop-shadow) también se quitan, conservando los bordes/aros que dan definición.
- Entran solo las láminas de la selección (las mismas del flujo), no las 24.

> Como el sandbox no renderiza PDF, conviene una impresión de prueba real antes de un
> ciclo de ventas: revisar que los bloques de figura no se corten entre páginas y que
> ningún texto claro se escape del volteo a tinta oscura.

## Láminas (21)

Inicio: Portada · Diagnóstico (interactivo: 3 perfiles de club — planillas / software
actual / automatización parcial — seleccionables en vivo o preconfigurados) — Producto:
Panel · Reservas · Pagos · Socios y cuotas · Torneos · Escalerillas · MatchPro TV ·
Finanzas — Jugadores: App MatchPro · Tu club en la app (promoción, escalerilla exclusiva,
beneficios de socios) · ScoreMatch · Efecto en el club — Crecimiento: Ecosistema ·
Simulador · Lo que viene (roadmap rotulado "en desarrollo", sin fechas) — Cierre:
Implementación y soporte · Comparativa · Calculadora · Propuesta.

Con 21 láminas el deck completo es LARGO para una reunión: la práctica recomendada es
curar 10–12 en Preparar (`E`) según el perfil del club, no presentarlas todas.

## Reuniones y tracking (teclas E y R)

- **Contacto y fecha** (Preparar → sección 1): viajan en el link y aparecen en la
  portada ("Preparada para Juan Pérez · Gerente · 14 de agosto") y en el resumen.
- **Bitácora (`R`)**: registro local de reuniones con estado (agendada → realizada →
  propuesta enviada → ganada/perdida), notas, "Abrir" (recarga la configuración de esa
  reunión) y export CSV / fila TSV para la planilla.
- **Límite deliberado**: la bitácora vive en localStorage — SOLO ese navegador, sin
  sincronización. La medición de efectividad (tasa de cierre por perfil, concesiones
  que funcionan, ciclo de venta) se hace en una planilla/CRM compartido alimentado por
  el export. No construir un CRM dentro del deck.

## Contrapropuesta (excepción fuera de bandas)

En Preparar existe "Fee mensual excepcional": permite una contrapropuesta negociada
fuera del menú sancionado. La propuesta la rotula "condición especial · excepción a la
política", mantiene visible el precio de lista y queda registrada en el link. Es la
válvula de escape para negociaciones reales — con huella, no silenciosa.

## Estructura

```
src/
  club.jsx        → presets + overrides por URL (contexto de personalización)
  pricing.js      → FUENTE ÚNICA del modelo de pricing (planes, UF, comisión, piloto)
  links.js        → destinos de conversión (heredado; ver TODOs)
  ui.jsx          → Reveal, CountUp, PanelChrome (personalizado), SlideSplit…
  mocks/          → réplicas vivas del producto (panel, TV, escalerilla, dashboard)
  slides/         → Portada · Problema · Módulos (7) · Calculadora · Propuesta
  App.jsx         → shell de presentación (teclado, índice, impresión)
```

## Decisiones

- **Pricing plano + comisión real del producto** (Competencia UF 1,5 · Club UF 3 ·
  Club Pro UF 5, jugadores ilimitados, comisión $750 + 4% por transacción online según
  el panel real de Club Manager; torneos 4% + tarifa por participante). Toda la
  matemática vive en `src/pricing.js` — un solo lugar para cambiar números.
- **Sin "descuento solo hoy"**: las concesiones son del menú sancionado, por tiempo
  limitado y con precio de lista visible en la propuesta.
- **Solo lo que existe**: ningún mock muestra funcionalidades no lanzadas. TrueRank
  aparece como ingredient brand en la escalerilla, sin promesas de roadmap.
- ES-only (venta en Chile). `noindex` — es herramienta del vendedor, no marketing.

## Pendientes antes de usar en una reunión real

1. **`src/links.js`**: URL de agenda definitiva y número de WhatsApp real (heredó los
   placeholders de clubmanager-landing).
2. **`src/pricing.js`**: confirmar `UF_CLP` y validar `COMISION_ONLINE` (4,9%) contra
   el costo real de Transbank; confirmar condiciones del piloto (60 días / −50%).
3. **`src/club.jsx`**: confirmar canchas reales de Club Ossandón; agregar presets de
   los prospectos activos.
4. **Deep link al Club Demo real** (botón "verlo funcionando"): pendiente de URL del
   entorno demo — agregar en la lámina "El panel" cuando exista.
5. QA visual en el proyector/notebook real de la reunión (el sandbox no renderiza):
   revisar en especial que Calculadora y Propuesta quepan en el lienzo 1280×720.
6. Verificar los datos de la lámina Comparativa contra el benchmark vigente antes de
   cada ciclo de ventas (precios de competidores cambian).

## Links: opacos hoy, cortos mañana

- **Hoy (sin backend)**: los links de Preparar viajan en UN parámetro codificado y
  firmado (`?d=…`). Sin campos legibles ni editables a mano; si alguien altera el
  payload, la app muestra "link modificado — no es válido". Honestidad técnica: la sal
  vive en el bundle → detiene la edición casual, no a un programador motivado.
- **Cuando la app esté hosteada** (`sales.getmatchpro.com` — necesario de todos modos
  para ENVIAR links, porque `file://` no viaja): desplegar `shortener-worker.js`
  (Cloudflare Worker + KV, gratis). Da links cortos reales (`/p/x7k2`), ineditables,
  revocables y con **tracking de apertura** — sabrás cuándo el club miró la propuesta.
