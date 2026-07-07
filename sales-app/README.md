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

## Uso en reunión

- Lienzo fijo 1280×720 escalado al viewport: la altura de la presentación nunca varía.
- `←` `→` navegar · `G` índice (salto no lineal según la conversación) · `E` preparar
  reunión · `F` pantalla completa · `P` exporta PDF (apila las láminas e imprime).
- Los puntos de la barra inferior también navegan; la URL guarda la lámina (`#precio`).

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
