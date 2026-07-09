# MatchPro — Propuesta de Pricing y Kit Comercial Unificado

> Julio 2026 · Basado en: material de ventas actual (deck escalerillas, PDF Club Manager, comparativa de mercado, lámina Ossandón), landings V5/V1 y contexto del ecosistema.

---

## Parte 1 · Diagnóstico del kit actual (resumen)

| # | Hallazgo | Gravedad |
|---|----------|----------|
| 1 | Dos propuestas de valor incompatibles circulando: PPTX vende "escalerilla por jugador activo"; PDF vende "Club Manager todo incluido 2,5 UF" | Crítica |
| 2 | Comparativa de precio indefendible: "UF 2,5 el más bajo" compara el fee base contra tarifas planas. Costo real de un club de 100 jugadores: $519k–999k/mes (2–4× EasyCancha) | Crítica |
| 3 | "Descuento 50% válido solo hoy" — quema el precio de lista, entrena al mercado a no pagarlo, y no funciona con decisores colegiados (directorios) | Alta |
| 4 | Identidad visual antigua (azul/Poppins) en todo el material de venta vs. sistema nuevo de las landings | Media |
| 5 | Ya existen (artesanalmente) la propuesta personalizada y el club demo — falta sistematizarlos, no inventarlos | Oportunidad |

**Conclusión:** el problema no es la falta de una herramienta; es la incoherencia de modelo, precio y marca. El orden es: (1) decidir pricing, (2) unificar contenido, (3) construir la Sales App que lo contiene.

---

## Parte 2 · Propuesta de pricing

### 2.1 Por qué el modelo per-player debe morir

- **Castiga lo que prometes.** El pitch es "más jugadores activos, más competencia". Con cobro por jugador, cada socio nuevo es un costo para el club → el administrador desactiva jugadores para ahorrar → mueren las escalerillas, los datos y TrueRank. El pricing trabaja contra el producto.
- **Castiga tu propio flywheel B2C.** Cada jugador dentro de un club es un usuario potencial de la app MatchPro. Ponerle un impuesto a su existencia frena tu adquisición más barata.
- **Es impredecible para el club.** Un directorio no aprueba un gasto que varía con la participación. La UF base + variable por jugador es imposible de presupuestar.
- **Te obliga al descuento del 50%.** El precio de lista per-player ($813k/mes lista para 100 jugadores) es tan alto que solo cierra con descuento agresivo. Eso no es una táctica: es el síntoma de que el precio está mal construido.

### 2.2 Modelo propuesto: fee plano por tamaño de club + comisión por transacción

La unidad de cobro correcta es **la cancha** (proxy estable del tamaño e ingresos del club, verificable, presupuestable), más una **comisión sobre pagos online** (el componente que escala con el valor que generas). Jugadores: **ilimitados, siempre**.

| Plan | Para quién | Precio mensual | Incluye |
|------|-----------|----------------|---------|
| **Competencia** | Clubes que solo quieren escalerillas/torneos (reemplaza el producto del PPTX) | **UF 1,5** (~$60.000) | Escalerillas, desafíos, torneos, MatchPro TV, jugadores ilimitados |
| **Club** | Club estándar, hasta 6 canchas | **UF 3** (~$120.000) | Todo: reservas, arriendos, cobros, socios, finanzas, torneos, escalerillas, TV, comunicación |
| **Club Pro** | 7+ canchas o multi-sede | **UF 5** (~$200.000) | Todo lo anterior + soporte prioritario + onboarding asistido |

**Componentes transversales:**

- **Comisión por transacción online: 4,9% + IVA** sobre reservas, inscripciones y cuotas procesadas (validar contra el costo real de Transbank; el número final debe dejar margen ≥2 pts). Referencia competitiva: Playtomic cobra 5–15%. Sin pago online → sin comisión (como hoy).
- **Anual: −15%** (2 meses gratis aprox.). Es el único descuento estructural.
- **Jugadores ilimitados en todos los planes.** El jugador dentro del contexto del club usa la app gratis (contexto club). El plan Competitivo B2C ($9.990) sigue siendo individual y global — no se toca.

### 2.3 Qué se elimina

- ❌ Cobro por jugador extra ($4.995–8.490).
- ❌ Escalerilla Privada standalone a $9.990/jugador (la reemplaza el plan Competencia).
- ❌ Descuento "50% solo hoy". Se reemplaza por: **piloto de 60 días con fee base al 50%** (precio de lista intacto, urgencia legítima: "el piloto parte este mes o el próximo trimestre").

### 2.4 Impacto y honestidad sobre el trade-off

Club tipo Ossandón (100 jugadores, ~6 canchas):

| | Hoy (lista) | Hoy (con 50%) | Propuesto |
|---|---|---|---|
| Fee fijo | $813.000 | $519.580 | $120.000 (UF 3) |
| Comisión online (GMV $3M/mes al 4,9%) | ? | ? | ~$147.000 |
| **Total** | **$813.000** | **$519.580** | **~$267.000** |

Sí: **baja el ingreso contratado por club (~50%)**. La apuesta es explícita: (a) tasa de cierre mucho mayor sin el circo del descuento, (b) cero incentivo del club a desactivar jugadores → más GMV → más comisión, (c) precio defendible en la comparativa sin trucos: "UF 3 plano, todo incluido, jugadores ilimitados" es real y le gana a EasyCancha (UF 5) sin letra chica. Si tus unit economics actuales dependen del per-player, esta decisión requiere modelar tu cartera actual antes de migrar — pero el modelo actual no escala comercialmente: escala el descuento.

**Migración de clientes actuales:** grandfathering 6 meses; a todos les conviene el plan nuevo salvo clubes muy chicos con muchos jugadores (raro). Comunicarlo como upgrade, no como cambio de tarifa.

### 2.5 La comparativa corregida

Nueva línea de precio en la tabla: "**UF 3 plano, jugadores ilimitados, sin costo por socio**" vs. EasyCancha UF 5 / CourtReserve US$329 / PlayByPoint US$400 / Playtomic US$132 + 5–15%. Ahora el claim "más capacidades al precio más bajo" (vs. actores comparables full-suite) es defendible sin que el cliente descubra otra cosa en la factura.

---

## Parte 3 · Kit comercial unificado: la Sales App

### 3.1 Concepto

Una sola aplicación web (`sales.getmatchpro.com`) estilo presentación, que reemplaza **PPTX + PDF + lámina + comparativa** y sirve en tres modos:

1. **Modo presentación** — pantalla completa, navegación por teclado, en la reunión (presencial o remota). No lineal: un índice de módulos permite saltar según la conversación ("¿y los torneos?" → módulo torneos con el mock vivo).
2. **Modo propuesta** — la misma app con configuración por club (`?club=ossandon` o panel simple): nombre, logo, n° canchas, deportes, dolores detectados → genera la propuesta personalizada con su precio calculado. Es la lámina Ossandón, pero viva, actualizada y sin rehacerla a mano.
3. **Modo leave-behind** — el link se envía después de la reunión para el directorio; incluye export a PDF (print stylesheet) para el que exige papel.

### 3.2 Por qué esto NO es overengineering (a diferencia del "Club del Futuro")

- Reutiliza el stack y los tokens de `clubmanager-landing` (Vite + React + Tailwind 4 + Framer Motion, sistema lime/slate).
- Los mocks vivos ya existen y están validados contra 22 screencasts del producto real: dashboard animado, reservas, pagos, escalerilla, torneo con fixture, modo TV. El contenido más caro del deck ya está pagado.
- Cero backend: configuración por URL/JSON, deploy estático. Sin cuentas, sin base de datos, sin mantenimiento de plataforma.
- Un solo artefacto que mantener cuando cambie el pricing o un módulo — hoy son 4 archivos desincronizados.

### 3.3 Módulos (índice de la app)

1. **Portada personalizada** — logo del club + claim ("El siguiente nivel de {Club} no es deportivo. Es operativo.")
2. **El problema** — los 4 dolores (reutiliza sección de la landing)
3. **La plataforma** — mocks vivos por módulo: canchas/reservas → cobros → torneos → escalerillas → socios → finanzas → TV. Cada uno saltable de forma independiente.
4. **Demo real** — botón "verlo funcionando" → deep link al Club Demo sembrado (idealmente con el branding del prospecto). La Sales App nunca sustituye la demo del producto: la enmarca.
5. **Comparativa de mercado** — la tabla corregida, interactiva.
6. **Ecosistema** — timeline del socio (app → ScoreMatch → TV → TrueRank), reutiliza `Ecosistema.jsx`. Solo lo que existe hoy; roadmap marcado como roadmap.
7. **Caso / prueba social** — cuando haya casos reales autorizados (mismo P0 de las landings).
8. **Calculadora de precio** — inputs: canchas, GMV online estimado → plan sugerido + mensualidad + comparación honesta con lo que paga hoy (EasyCancha/planillas). Reemplaza la lámina de brackets del PPTX.
9. **Propuesta y cierre** — resumen personalizado, condiciones del piloto 60 días, CTA agendar/WhatsApp.

### 3.4 Esfuerzo y roadmap

| Fase | Alcance | Esfuerzo estimado |
|------|---------|-------------------|
| **MVP (validar)** | Módulos 1, 3 (4 mocks), 8 y 9. Personalización por JSON manual. Usar en las próximas 5 reuniones reales | 1–2 semanas reutilizando secciones existentes |
| **V1** | Índice completo, modo propuesta por URL, export PDF, comparativa interactiva | +2 semanas |
| **V2 (solo si el volumen lo justifica)** | Panel de configuración para el vendedor, analytics de visualización del link (quién abrió qué módulo) | Evaluar con datos |

**Validación del MVP:** medir en 5–10 reuniones: tasa de cierre y tiempo de ciclo vs. histórico con PPTX; preguntar al final de cada reunión qué faltó ver. Si no mueve la aguja, el problema está en otra parte (precio, timing, decisor) y se detecta barato.

### 3.5 Qué NO hacer

- No construir backend, cuentas ni CMS para esto.
- No meter funcionalidades no lanzadas como si existieran (TrueRank video, CoachPro, Academy) — roadmap explícitamente rotulado o fuera.
- No duplicar la landing pública: la Sales App es herramienta del vendedor, no marketing. Si un módulo sirve a ambos, vive en un paquete compartido de componentes, no copiado.
- No publicarla indexable (noindex; los links por club pueden llevar slug no adivinable).

---

## Parte 4 · Orden de ejecución recomendado

1. **Decidir pricing** (esta semana — decisión de negocio, bloquea todo lo demás).
2. **Corregir la comparativa** con el precio nuevo (1 día).
3. **Publicar clubmanager-landing** resolviendo sus P0 (una tarde según tu propia auditoría) — es el destino de todo el funnel.
4. **Sales App MVP** (1–2 semanas) y retirar PPTX/PDF de circulación.
5. **Medir 5–10 reuniones** antes de invertir en V1/V2.
