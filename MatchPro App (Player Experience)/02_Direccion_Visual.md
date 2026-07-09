# MatchPro — App de Jugadores
## Entregable 2: Dirección Visual

> Estado: dirección fijada para la fase de diseño. Evoluciona la marca existente (app antigua, landing nuevo, dashboard web) y destila las referencias aprobadas. No reinventa la identidad.
> Convención: 💡 decisión de este documento · ⚠️ regla dura (no romper).

---

## 0. Tensión de partida (la decisión que ordena todo)

Las referencias que te gustan viven en **dos campos opuestos**: uno **rico/maximalista** (glassmorphism sobre gradientes, arte 3D granulado, fotos grandes) y uno **limpio/minimal** (el neobank blanco con lime y negro). Tu principio declarado es *no saturación, limpio*.

💡 **Resolución:** tomamos la **sofisticación** del campo rico (materiales premium, jerarquía con un héroe claro, movimiento) **sin su desorden**. La base es limpia (neobank); la riqueza aparece en **momentos**, no en todas las pantallas. Si una pantalla compite por atención en dos focos, perdió.

---

## 1. Sistema de superficies por zona (zonificación)

💡 **Decisión fijada:** el maximalismo (glass + gradiente saturado) se aplica **por zona, no parejo**. Dos familias de superficie según lo que el jugador está haciendo:

**Superficies "vivas" — glass + gradiente (maximalista).** Momentos hero, emocionales y de poco dato, con el usuario quieto y enganchado. Preferentemente en temperamento **oscuro**, que es donde el glass resulta a la vez lujoso y legible afuera.

**Superficies "de trabajo" — limpias, alto contraste.** Donde hay datos y se usa al sol, con una mano. Base clara tipo neobank, lime con significado.

| Zona | Pantallas | Superficie |
|---|---|---|
| **Viva** | Onboarding · estados vacíos · partido en vivo · victoria · share cards · header de perfil | Glass + gradiente (oscuro preferente) |
| **Trabajo** | Jugar (formas de jugar / listas) · Progreso · reserva · Mi club · ajustes | Limpia / alto contraste |

⚠️ **Regla de oro:** el dato competitivo crítico (countdown, marcador, posición) **nunca** vive sobre glass claro bajo gradiente brillante. Si es dato y se lee al sol, va en superficie de trabajo.

> Validado visualmente: el glass oscuro en vivo rinde (lujoso y legible); el glass claro al sol se cae; los datos densos en glass se vuelven mush. Coincide además con el dark mode obligatorio del ecosistema. El cambio a oscuro es en sí una señal: *cuando se pone oscuro, es porque estás compitiendo.*

💡 **Las zonas pueden convivir como bandas dentro de una misma pantalla**, no solo como pantallas separadas: una **banda hero "viva"** (p. ej. gradiente lime con la fecha / el próximo partido / el live) sobre un **cuerpo de tarjetas limpias** con los datos. Referencia canónica del balance: Apple Sports — banda de gradiente arriba + cards blancas abajo + nav cápsula flotante. La riqueza se contiene en la banda; el dato vive en superficie de trabajo.

---

## 2. Color

### Marca
| Rol | Token | Hex |
|---|---|---|
| Lime de marca (acción / positivo) | `lime` | `#CBFD80` |
| Verde claro de marca | `mint` | `#82E896` |
| Teal / intersección ("match") | `teal` | `#34D399` |
| Tinta sobre lime | `on-lime` | `#1A2E05` |
| Charcoal (display, texto, botón transaccional) | `ink` | `#232E33` |

> Colores tomados del **logo oficial** (`Brand_MP_logo_color.svg`). Reemplazan los valores tentativos del documento maestro (`#A3E635` / `#2BB6A3`). Si un botón lime necesita más "pop" sobre fondo claro, se evalúa una variante levemente más saturada solo para acción, manteniendo `#CBFD80` como color de marca.

### Neutrales — temperamento claro
Base `#EEF1F2` · tarjeta `#FFFFFF` · borde `#E3E7E9` · texto primario `#232E33` · secundario `#67737A` · terciario `#9AA4AA`.

### Neutrales — temperamento oscuro
Base `#14191B` · tarjeta `#1E2528` · elevado `#283034` · borde `#313A3E` · texto primario `#F2F5F4` · secundario `#A7B2B5`.

### Semánticos
Victoria/positivo: lime (o verde `#57C04A` en gráficos donde el lime ya está en uso). Derrota/destructivo: `#E5564D`. **En vivo:** punto rojo `#FF4848`. Info/neutro: gris.

### ⚠️ Reglas de color (no romper)
1. **Lime tiene un significado: competir y ganar.** Es para la acción competitiva primaria y los estados positivos. **No** para acciones destructivas (el "Rechazar/Cancelar" en lime de la app antigua era un error semántico).
2. **Charcoal `#232E33`, nunca negro puro.**
3. **Lime nunca como texto sobre blanco** (contraste insuficiente). Sobre lime, tinta `#1A2E05`.
4. **Un solo lime por pantalla** en su rol de acción. Si todo es lime, nada es lime.
5. **Identidad vs valencia — no mezclar en una misma vista.**
   - En vistas **cara a cara** (Detalle del partido), usar **identidad**: `emerald #2FD08A` = tú · `violet #8B5CF6` = el rival. Tus derrotas son las victorias de él → **violeta, no rojo**. Aplica a todo: récord (Victorias/Derrotas), anillo (relleno emerald = tú, resto violeta = él), comparativas y línea de tiempo (ganado emerald / perdido violeta).
   - El **rojo/derrota** (`#E5564D`) se reserva para **valencia pura** fuera del head-to-head (ej. un estado negativo global, una acción destructiva).
   - Razón extra: emerald/violeta es mucho más distinguible que verde/rojo para daltonismo (verde/rojo es el peor par).

### Badges de tipo de escalerilla
Pública: fondo `#EAF2D9` / texto `#5E7D12`. Club: fondo `#DDEBF5` / texto `#2A6DA0`. Privada: fondo `#EFE6F7` / texto `#7A4FA0`.

---

## 3. Tipografía

- **Display (titulares y números héroe):** Inter **Black itálica**. Es el gesto deportivo de tu marca (lo viste en "Mi panel", "Compite con jugadores de tu nivel", "Juega. Gana."). Reservado a titulares y a cifras grandes (nivel, posición, contador).
- **UI / cuerpo:** Inter (Regular / Medium / Semibold). Self-hosted (no Google CDN, por GDPR), como ya define el ecosistema.
- **Marcador / dato técnico:** numerales **mono o tipo dot-matrix** para el marcador en vivo (lo viste en las apps de scores). Da carácter de "pizarra deportiva" al score sin contaminar el resto.

Jerarquía por **tamaño y peso antes que por líneas y cajas** — así se baja la densidad heredada del dashboard web.

---

## 4. Botones — un sistema con significado

💡 El color del botón comunica *qué tipo* de acción es:

- **Lime sólido** = acción **competitiva** primaria (Desafiar, Marcar, Jugar ahora) y confirmaciones positivas. Máximo uno por pantalla.
- **Charcoal sólido `#232E33`** = acción **transaccional** primaria (Reservar, Confirmar, Pagar). Es el "Add money"/"Book now" del neobank y la reserva de tenis.
- **Outline** = secundaria.
- **Texto/ghost** = terciaria.

Todos en forma de **píldora** (radio completo), con target ≥ 44px.

---

## 5. Componentes clave (los que definen el producto)

- **Card de partido (la capa persistente):** el héroe del producto. En claro, acento lime; en oscuro (en vivo), fondo charcoal con marcador dot-matrix. Estados: confirmado (countdown) → hora de jugar → ingresar resultado → validando.
- **Número héroe:** una cifra grande (nivel, posición) como protagonista de la pantalla, al estilo del índice "31" del air quality y el balance del neobank.
- **Barra-escala de nivel:** una barra de gradiente que muestra *dónde caes* en el espectro de nivel (inspirada en la escala del air quality). Ideal para nivel de juego y, en Fase 2, para TrueRank.
- **Tarjeta de resultado / marcador:** banderas + sets, numerales dot-matrix, pill de estado (Completado / En vivo). Sirve para historial y para el marcado de ScoreMatch.
- **Grilla de cancha + pickers de fecha/hora:** casi directos desde tu referencia de reserva de tenis.
- **Pills de estado con color:** ganado (lime), perdido (`#E5564D`), en vivo (punto rojo), info (gris).
- **Nav:** cápsula flotante persistente (tu "protagonismo"). ⚠️ **Nunca** con mega-botón central que abra un menú — eso revive el cajón "+" que descartamos.

---

## 6. Materiales y profundidad

- **Por defecto, superficies planas** (sin gradientes ni texturas decorativas), salvo los acentos definidos.
- ⚠️ **Glassmorphism solo en superficies "vivas" (§1), de preferencia oscuras.** El jugador usa la app **al sol, junto a la cancha**: el glass claro sobre gradiente brillante mata el contraste. Nunca para el dato competitivo crítico ni en pantallas densas.
- **Gradientes granulados suaves** (los washes de tu landing, el arte tipo "montaña" del banco): para fondos hero/vacío y para convertir un gráfico frío en algo bello (tu evolución de nivel como una montaña suave). Sutiles.
- **Elevación leve**: sombras suaves, bordes finos. Nada de drop-shadows duras.

---

## 7. Imagen e iconografía

- **Fotografía deportiva** para momentos de **aspiración** (entrada, estados vacíos, header de perfil): encarna "de profesional amateur a amateur profesional". No en pantallas de datos.
- **Isotipo** (tres círculos que se intersectan = dos jugadores que coinciden) como patrón decorativo geométrico al 5–8% de opacidad. Geométrico, no blobs.
- **Iconografía** lineal, consistente, redondeada, alineada a Inter.

---

## 8. Movimiento

- **Funcional, no decorativo.** Hover/focus 150–200ms; enter/exit 250–350ms; layout 400–500ms. `ease-out` al entrar, `ease-in` al salir.
- La **capa persistente** del partido es el escenario estrella del movimiento: su aparición, su countdown y su transformación a "ingresar resultado" deben sentirse vivas (y proyectarse a **Live Activity** en iOS).
- **Confetti solo en hitos** (primera victoria, torneo ganado). Nunca en uso normal.
- Respetar `prefers-reduced-motion`.

---

## 9. Accesibilidad

WCAG 2.2 AA mínimo. Contraste 4.5:1 (texto) / 3:1 (UI). Foco visible (ring lime). Targets ≥ 44px. Paridad claro/oscuro. Lime nunca como texto sobre claro.

---

## 10. Do / Don't (resumen accionable)

**Do:** base limpia tipo neobank; lime con significado (competir/ganar); un héroe por pantalla; display itálico para titulares y cifras; foto para aspirar, datos para informar; oscuro para el momento en vivo; cápsula flotante persistente.

**Don't:** lime en acciones destructivas; lime como texto sobre blanco; glass al sol sobre datos críticos; serif (no es deportivo); pasteles como base (bajan la energía); morado u otros colores fuera de paleta; foto lavando pantallas de analítica; mega-botón central que abra menú.

---

## 11. Jerarquía de títulos y botones (sistema)

**Títulos — 4 niveles:**

| Nivel | Uso | Estilo | Ejemplo |
|---|---|---|---|
| Display / Hero | Cifras y nombres protagonistas | `Typo.display` 28–68 (Poppins Bold Italic) | 22° · LUIS OLIVA · 63% |
| H1 · Título de pantalla | Título del contenedor/sheet (uno por pantalla) | `Typo.display(18)`, **MAYÚSCULAS**, Bold Italic. Color: **lime-950 sobre color** · blanco sobre imagen · ink sobre blanco | DETALLE DEL PARTIDO · ARICA |
| H2 · Eyebrow de sección | Encabezado de bloques dentro de cards | `Typo.label(11)`, MAYÚSCULAS, tracking 1.5, textMuted | CONDICIONES · LA RIVALIDAD |
| Body / valores | Texto de apoyo y datos | `Typo.medium(13–15)`, valores en `Typo.bold(14–16)` | Humedad 54% |

**Encabezado de pantalla — patrón único (eyebrow + H1):**
Toda sheet/pantalla lleva **eyebrow** (línea corta de contexto, `Typo.label(11)`, tracking 1.5) **sobre** un **H1** (`Typo.display(18)`, MAYÚSCULAS, Bold Italic). El cierre (Liquid Glass) va arriba a la derecha. El eyebrow nombra la **acción/tipo/contexto**; el H1 nombra la **entidad/lugar/tema**.

| Pantalla | Eyebrow | H1 |
|---|---|---|
| Detalle del partido (head-to-head) | `CARA A CARA` | `DETALLE DEL PARTIDO` |
| Pronóstico | `PRONÓSTICO` | `ARICA` (ubicación) |
| Desafiar escalerilla | `DESAFIAR` | `ESCALERILLA ARICA` |
| Invitar a escalerilla | `INVITAR` | `ESCALERILLA ARICA` |

**Padding estándar del header:** `horizontal 20 · top 16 · bottom 12` en todas las sheets. Arquitectura única: barra fija arriba (en un VStack sobre el ScrollView, no como overlay) sobre el `detailBackground` (off-white + resplandor lime). Sin headers frosted/blur por vista — todas iguales.

**Color del encabezado — REGLA (no romper):**
- El header lleva un **resplandor lime sutil** en el top (lineal, lime-300 al 50% → transparente, ~64 pt, solo arriba).
- **El texto NUNCA va en slate sobre un fondo de color** — el gris frío se ensucia sobre el lima. Se usa la **familia del propio color**: eyebrow = **lime-600** (`Brand.eyebrowOnColor`), H1 = **lime-950** (`Brand.titleOnColor`, un casi-negro verde que se lee crujiente pero pertenece a la familia).
- **Excepción — sobre imagen/foto** (Clima, hero con foto): el texto va en **blanco** (con scrim superior si hace falta), no en lime.
- Aplica a todas las vistas a este nivel (Detalle, Desafiar, Invitar, Resultado). Clima usa la misma estructura pero en blanco por su fondo de cielo.

**Criterio de mayúsculas en líneas secundarias** (la línea bajo el título de la card):
- **MAYÚSCULAS + tracking** si es **dato/etiqueta corto** (≤2 palabras, sin verbo ni cifra-en-frase): fecha/hora, lugar, estado breve. Ej: `MAÑANA 18:30`, `ESPERANDO RESPUESTA`.
- **sentence case (sin tracking)** si es **frase descriptiva** (cifras, nombres, sujeto+verbo). Ej: `Enviaste 6-4 6-3 · esperando confirmación`, `Luis Oliva reportó 6-1 6-3`. En mayúsculas, una frase con marcador se vuelve gritada e ilegible.

**Botones — 3 niveles.** Texto siempre **MAYÚSCULAS + Poppins Medium 13** (chico, como en Ver detalle), con leve tracking. La prominencia la da el relleno/tamaño del botón, no el texto.

| Nivel | Estilo | Color |
|---|---|---|
| Primaria | Capsule rellena, `medium(13)` MAYÚS, alto 50–54 | lime (competitiva) · ink (transaccional) · blanca (sobre glass) |
| Secundaria | Outline o slate-200, mismo texto en su color, alto 46–48 | slate / contorno |
| Terciaria | Texto plano `medium(13)` Title Case, sin fondo | textSecond (baja prioridad o destructiva con confirmación) |

Énfasis, no valencia: blanco/relleno = primaria; transparente/outline = secundaria.
