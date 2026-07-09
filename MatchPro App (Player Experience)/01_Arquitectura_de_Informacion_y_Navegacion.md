# MatchPro — App de Jugadores
## Entregable 1: Arquitectura de Información y Navegación

> Estado: borrador para validación. Primer eslabón de la cadena AI → Flujos UX → Wireframes → PRD.
> Convención: 💡 decisión de diseño de este documento · ⚠️ punto que requiere tu validación · ✅ backend existente · 📋 backend planificado/inexistente.

---

## 0. Decisiones de partida (cerradas contigo)

| Decisión | Resolución |
|---|---|
| Tecnología del cliente | **Nativa iOS/Android** |
| Verdad de nivel | MVP usa **rating de juego del núcleo (Elo extendido)** como dato absoluto provisional. **TrueRank entra en Fase 2 como certificación (badge)**, no como número competidor. |
| Perfil/alcance | **Ambos perfiles (con y sin club) desde el inicio**, resueltos con **una sola app + selector de contexto**. Prohibido bifurcar en "versión club / versión sin club". |
| Cadena de entregables | AI/navegación → flujos UX → wireframes → PRD (contenedor). |

Estas decisiones son el marco de todo lo que sigue. Si una cambia, esta arquitectura se revisa.

---

## 1. Principios de arquitectura de información

Cinco reglas que gobiernan todas las decisiones de estructura. Cuando dos entren en conflicto, el orden de esta lista es el orden de prioridad.

1. **El contexto manda y nunca se mezcla.** Todo lo que el jugador ve —escalerillas, partidos, estadísticas, ranking— está filtrado por el contexto activo (club X, ladder privado Y). El usuario debe poder responder "¿en qué contexto estoy?" sin pensar. Nunca se muestran datos cruzados de dos contextos en la misma vista.

2. **Revelación progresiva.** Un módulo no existe en la navegación hasta que el jugador tiene contexto para usarlo. La app de un jugador nuevo sin club es deliberadamente más pequeña que la de un socio competitivo. La complejidad se gana, no se impone.

3. **Una acción, un hogar.** Cada acción del jugador tiene un lugar predecible y único. No duplicamos puntos de entrada "por si acaso": eso es lo que convierte una app limpia en un laberinto.

4. **Time-to-value sobre completitud.** La estructura prioriza llegar rápido al primer acto de valor (marcar/competir) por encima de exponer todo lo que la app puede hacer.

5. **Mobile-first nativo, una mano, junto a la cancha.** El destino primario es un teléfono al sol, con una mano ocupada. Destinos de navegación en el pulgar, no en la parte superior de la pantalla.

---

## 2. Modelo de navegación

### 2.1 Análisis crítico: el botón "+" central no debe heredarse tal cual ⚠️

El documento maestro (§5.1) propone una tab bar de 5 con un botón **＋ central** que abre un menú de creación: *crear desafío · reserva · partido amistoso · marcar partido*.

**Esto es un problema de arquitectura, no una mejora.** El patrón "+" central viene de apps de creación de contenido (Instagram, X, TikTok), donde existe **un** acto dominante e inequívoco: publicar. Aquí el "+" agrupa **cuatro acciones distintas que pertenecen a dos secciones diferentes**:

- *Crear desafío* → pertenece a **Competir**.
- *Reservar cancha* → pertenece a **Jugar**.
- *Partido amistoso* y *marcar partido* → registro de resultado.

Un botón que es un *menú de cuatro* es la señal clásica de que no sabemos cuál es la acción primaria. Y funcionalmente **agrega** un paso (tocar + → elegir de una lista → ir al flujo) en lugar de quitarlo. Contradice los principios 3 (una acción, un hogar) y 4 (reducir fricción).

**💡 Recomendación: tab bar de 4 destinos, sin botón-menú central.** Cada acción de creación vive en su hogar natural, accesible con un CTA primario claro dentro de su sección:

- *Desafiar* → CTA primario dentro de **Competir**.
- *Reservar* → CTA primario dentro de **Jugar**.

La única acción que **no tiene hogar natural** es marcar un partido espontáneo (jugué en la calle, sin agendar) — y resulta ser la acción PLG de mayor frecuencia y el gancho del producto. Esa sí merece un atajo global:

**💡 "Marcar partido" como acción primaria global**, presente como CTA destacado en **Inicio** (el lugar al que el jugador vuelve tras jugar) y disparable desde el handoff con ScoreMatch. No como quinto tab —porque un tab es un *destino*, y marcar es una *acción*— sino como botón de acción primaria en el feed.

Resultado: 4 destinos limpios, cada acción con un hogar, y el acto PLG con un atajo de un toque. Menos navegación, no más.

> ⚠️ **Tu validación:** ¿aceptas pasar de 5-con-menú a **4 tabs + acción "Marcar" global**? Es la divergencia principal frente al documento maestro y condiciona los wireframes.

### 2.2 Estructura propuesta

```
┌─────────────────────────────────────────────┐
│  [Contexto ▾]          MatchPro        [🔔]  │  ← header global
├─────────────────────────────────────────────┤
│                                             │
│              (contenido del tab)            │
│                                             │
│                                             │
├─────────────────────────────────────────────┤
│   Inicio      Competir      Jugar    Perfil │  ← tab bar (4 destinos)
└─────────────────────────────────────────────┘
```

- **Header global**: selector de contexto (izquierda) + campana de notificaciones (derecha). Persistente en los 4 tabs.
- **Tab bar (pulgar)**: Inicio · Competir · Jugar · Perfil.
- La acción **Marcar partido** vive como CTA primario en Inicio, no en la tab bar.

### 2.3 Rol de cada destino

| Destino | Pregunta que responde | Contenido |
|---|---|---|
| **Inicio** | "¿Qué tengo que hacer hoy?" | Feed contextual: próximo partido, desafíos por responder, tu posición, CTA "Marcar partido". |
| **Competir** | "¿Cómo voy y contra quién?" | Escalerillas, desafíos, ranking, torneos (revelados según contexto). |
| **Jugar** | "¿Dónde y con quién juego?" | Reservar canchas, encontrar rivales, descubrir clubes. |
| **Perfil** | "¿Quién soy como jugador?" | Identidad, nivel/estadísticas, historial, equipamiento, configuración. |

---

## 3. El selector de contexto

Es el mecanismo que permite "ambos perfiles en una sola app" sin bifurcarla. Ciudadano de primera clase en el header.

- **Qué es:** un conmutador que define el "mundo" activo del jugador. Valores posibles: cada **club** al que pertenece + cada **ladder privado** + (Fase 4) contexto `coaching`.
- **Qué filtra:** absolutamente todo el contenido competitivo y de actividad (escalerillas, desafíos, partidos, ranking, estadísticas, torneos). Cambiar de contexto recarga esas vistas. Técnicamente, la key de caché incluye `active_context_id` (ya modelado en el núcleo).
- **Qué NO filtra:** la identidad del jugador, su nivel de juego absoluto, su equipamiento y su configuración — esos viven en el `User` y son transversales (ver §6).
- **Estado por defecto:**
  - Jugador **sin club**: el contexto es su ladder privado (o "Personal" si aún no tiene ninguno). El selector no se siente como una imposición de club.
  - Jugador **de club**: contexto por defecto = su club principal.
- **💡 Decisión:** el selector siempre muestra el nombre del contexto activo en texto, nunca solo un ícono. La regla de oro es que el jugador jamás dude de en qué mundo está.

> Por qué esto resuelve "ambos desde el inicio": no diseñamos dos apps. Diseñamos una app cuyo contenido es función del contexto. El jugador sin club y el de club usan exactamente la misma estructura; lo que cambia es qué hay dentro y qué módulos se revelan.

---

## 4. Árbol de navegación completo (MVP)

```
App
│
├── [Header] Selector de contexto ▾
│     └── Lista de contextos · "Personal" · (unirse/crear escalerilla)
├── [Header] Notificaciones 🔔
│     └── Centro de notificaciones (multicanal, in-app)
│
├── INICIO
│     ├── Próximo partido (card) → detalle de partido
│     ├── Desafíos por responder (cards) → detalle de desafío
│     ├── Tu posición en el contexto (card) → Competir › Escalerilla
│     └── ⚡ CTA "Marcar partido" → flujo de marcar (handoff ScoreMatch)
│
├── COMPETIR                         (contenido según contexto)
│     ├── Escalerilla
│     │     ├── Ranking / posiciones
│     │     ├── Participantes
│     │     └── Mis desafíos en esta escalerilla
│     ├── Desafío (detalle)
│     │     ├── Chat en tiempo real
│     │     ├── Agendar (fecha + cancha + split de pago)
│     │     ├── Resultado
│     │     └── Validar / disputar
│     ├── Ranking enriquecido + logros        [Fase 2 — oculto en MVP]
│     └── Torneos del jugador                 [Fase 2 — visible solo si hay torneos]
│
├── JUGAR
│     ├── Reservar cancha
│     │     ├── Buscar (deporte · fecha · club)
│     │     ├── Disponibilidad / slots
│     │     ├── Pago (propio · split · invitado por token)
│     │     └── Voucher PDF
│     ├── Encontrar rivales (por nivel · cercanía)
│     │     └── Perfil del rival → invitar a amistoso / desafío
│     └── Descubrir clubes                     [Fase 3 — oculto en MVP]
│
└── PERFIL
      ├── Identidad (nombre · deporte · mano hábil · avatar)
      ├── Nivel de juego + estadísticas + historial
      │     └── "Verifica tu nivel" (TrueRank)   [Fase 2 — oculto en MVP]
      ├── Equipamiento (raqueta · cuerdas)
      └── Configuración
            ├── Cuenta
            ├── Preferencias de notificación (6 tipos × canales)
            ├── Contexto activo / mis escalerillas y clubes
            └── Cuenta: desactivar (anonimización GDPR / Ley 19.628)
```

Todos los nodos sin etiqueta de fase tienen **backend existente (✅)** en la API v1.

---

## 5. Reglas de revelación progresiva

Qué se muestra, y bajo qué condición exacta aparece. Esto es lo que mantiene la app pequeña para un novato y completa para un competitivo, sin dos diseños.

| Módulo / elemento | Condición de aparición | Estado por defecto |
|---|---|---|
| Selector de contexto (multi) | El jugador pertenece a ≥2 contextos | Con 1 contexto, se muestra el nombre pero sin menú desplegable |
| Escalerilla en Competir | El jugador está en ≥1 escalerilla | Estado vacío con CTA "unirse por código / crear" |
| Torneos | Hay torneos abiertos en su club o cercanía | Oculto si no hay oferta |
| Descubrir clubes (Jugar) | Siempre disponible, pero despriorizado si ya tiene club | Visible Fase 3 |
| "Verifica tu nivel" (TrueRank) | Tras los primeros N partidos registrados | Oculto hasta Fase 2 |
| Pagos / cuotas de socio | El jugador tiene membresía de club | Oculto para jugador sin club |
| Dobles / equipos | Al unirse a una escalerilla de dobles | Oculto en escalerillas singles |
| Split de pago en reserva | Reserva con ≥2 jugadores | Oculto en reserva individual |

**Principio operativo:** la ausencia de un módulo nunca deja un hueco visual. Donde un módulo no aplica, no hay tab vacío ni sección en blanco: simplemente no está. Donde un módulo aplica pero está vacío, hay un estado vacío que enseña y propone (ver entregable de flujos UX).

---

## 6. Qué dato pertenece a quién (resumen de navegación)

Define qué sobrevive al cambio de contexto y qué no. Es la base de por qué el selector filtra unas cosas y otras no.

- **Transversal al jugador (NO cambia con el contexto):** identidad, mano hábil, equipamiento, nivel de juego absoluto, preferencias de notificación, datos de salud (privados), suscripción B2C. → viven en **Perfil**.
- **Dependiente del contexto (SÍ cambia con el selector):** escalerillas, posición/ranking, desafíos, partidos, estadísticas de ese contexto, torneos. → viven en **Competir** e **Inicio**.
- **Acto puntual (transaccional):** reservas. → viven en **Jugar**, asociadas a un club concreto.

---

## 7. Nomenclatura de etiquetas

Consistente con el copy real del producto (segunda persona, español de Chile, sin voseo). Tab bar:

- **Inicio** — no "Home" ni "Feed". Directo, en español.
- **Competir** — verbo, no sustantivo ("Escalerillas" sería demasiado estrecho; Competir abarca ranking, desafíos y torneos).
- **Jugar** — verbo. Abarca reservar y encontrar rivales.
- **Perfil** — sustantivo, convención universal; "Tú" se evaluó pero es ambiguo.

Acción global: **Marcar partido** (no "Registrar resultado" — "marcar" es el verbo del jugador y conecta con ScoreMatch).

> ⚠️ Nomenclatura a validar contigo: "Competir" vs. mantener "Escalerillas" visible como etiqueta. Mi recomendación es "Competir" por extensibilidad (Fase 2 mete torneos y ranking ahí sin renombrar).

---

## 8. Fuera del MVP (y por qué)

- **CoachPro / contexto `coaching`** — 📋 no existe backend. Fase 4. No se diseña ahora, pero el selector de contexto se construye **preparado** para un tercer tipo de contexto.
- **MatchPro TV — Modo Jugador** — 📋 solo marketing hoy. Fase 3.
- **TrueRank (verificación por video)** — ✅ existe como repo pero ⚠️ incompleto (falta Glicko-2 por partido). Entra como badge en Fase 2 según lo cerrado contigo.
- **ScoreMatch embebido (marcar desde el teléfono sin reloj)** — depende de estrategia; el handoff Watch↔app sí está en MVP.

---

## 9. Decisiones que necesito que valides

1. ⚠️ **4 tabs + acción "Marcar" global** en lugar de 5 tabs con menú "+" (§2.1). Es la divergencia estructural principal.
2. ⚠️ Etiqueta **"Competir"** vs. "Escalerillas" (§7).
3. ⚠️ Confirmar que **"Descubrir clubes"** puede esperar a Fase 3 (no es crítico para activar al jugador sin club, que entra por escalerilla privada).

Con estas tres validadas, paso a los flujos UX (entregable 2) sin riesgo de retrabajo.
