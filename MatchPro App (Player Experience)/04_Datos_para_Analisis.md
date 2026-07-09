# 04 · Datos para el análisis (Progreso, Perfil) y de dónde salen

Mapa de qué necesitamos capturar para alimentar las vistas analíticas, con su **fuente** y el **momento de captura**. Pensado para conectar el backend y diseñar los flujos de recolección (post-partido, ScoreMatch, reserva, onboarding).

## Fuentes

| Fuente | Cómo/cuándo | Qué entrega |
|---|---|---|
| **Resultado validado** | Al cerrar el partido, ambos confirman el marcador (o lo valida ScoreMatch) | Ganador, marcador por set, rival, fecha, tipo (escalerilla/matchmaking/amistoso) |
| **ScoreMatch** (Apple Watch) | Durante el partido, punto a punto | % 1er saque, puntos ganados, break points convertidos/salvados, duración del punto, momentum, detalle de tiebreak, sets decisivos |
| **Reserva de cancha** (Club Manager) | Al arrendar/agendar | Superficie (arcilla/dura/césped), cancha, club, fecha y hora |
| **TrueRank** | Continuo (análisis de video + resultados) | Rating actual e histórico, etiqueta de nivel (Principiante…Avanzado) |
| **Ranking de escalerilla** | Sistema de ladders | Tu posición e histórico por escalerilla; ranking del rival al momento del partido |
| **Perfil / onboarding** | Input del usuario (editable) | Estilo de juego, raqueta, superficie preferida, disponibilidad (días + horario), mano, edad, altura |
| **Derivado** | Computado por la app | Win rate, rachas, puntos de temporada/tier, agregaciones de patrones, comparativa actual vs histórico, proyección/ETA |

## Tabla maestra por análisis

| Vista / Análisis | Datos necesarios | Fuente | Captura |
|---|---|---|---|
| Evolución de nivel + proyección | Rating TrueRank en el tiempo | TrueRank | Continuo |
| → fecha estimada de meta (ETA) | Velocidad de rating (pts/semana), meta del usuario | Derivado + Perfil | Continuo / al fijar meta |
| Evolución de victorias | Serie de win rate por periodo | Derivado de Resultado validado | Por partido |
| Evolución de juego (actual vs histórico) | Win rate/forma reciente vs media histórica | Derivado de Resultado validado (y ScoreMatch si hay) | Por partido |
| Cómo mejorar (consejos) | Reglas sobre tiebreaks, retos hacia arriba, racha, presión | Derivado (sobre todas las fuentes) | Continuo |
| Patrón · Superficie | Resultado + superficie de cada partido | Resultado validado + **Reserva de cancha** | Por partido |
| Patrón · Horario | Resultado + fecha/hora de cada partido | Resultado validado + **Reserva de cancha** | Por partido |
| Patrón · Tipo de rival | Resultado + ranking del rival vs el tuyo al jugar | Resultado validado + Ranking/TrueRank | Por partido |
| Principales rivales (cara a cara) | Resultados etiquetados por rival + tendencia | Resultado validado + Derivado | Por partido |
| Rendimiento (win rate, récord) | Conteo de victorias/derrotas y sets | Resultado validado | Por partido |
| Forma (últimos 5) + último marcador | Resultados recientes con marcador por set | Resultado validado | Por partido |
| Desglose (partidos/sets/juegos/tiebreaks) | Marcador detallado por set y juego | Resultado validado (marcador completo) **o** ScoreMatch | Por partido |
| Resiliencia (cómo cierras) | Win% ganando el 1er set vs remontando | Resultado validado (marcador por set) | Por partido — sin reloj |
| Bajo presión (BP conv./salvados, tiebreaks, sets decisivos) | Datos punto a punto | **ScoreMatch** (sin reloj no es medible fino) | Durante el partido |
| Saque vs devolución | Juegos de saque ganados, 1er saque dentro, pts al resto, break points | **ScoreMatch** | Durante el partido |
| Tu juego — privado (1er saque, puntos, momentum, duración) | Datos punto a punto | **ScoreMatch** | Durante el partido |
| Temporada (puntos, tier, racha, liga) | Partidos validados + actividad + reglas de puntaje | Derivado | Continuo |
| Standing de escalerilla (#pos por liga) | Posición por escalerilla | Ranking de escalerilla | Continuo |
| Mi juego (estilo, raqueta, superficie) | Preferencias declaradas | Perfil / onboarding | Una vez / editable |
| Disponibilidad (días + horario) | Días y franjas | Perfil / onboarding | Editable |

## Lo que hay que capturar y NO tenemos automático

La mayoría sale de **resultado validado + reserva + ScoreMatch**. El gap son los partidos **sin reserva en el sistema** (canchas externas) y **sin ScoreMatch**. Para esos, conviene un **prompt corto post-partido**:

1. **Marcador por set** (incl. tiebreaks) — habilita desglose, forma, y parte de "bajo presión" (tiebreaks, sets decisivos) sin reloj.
2. **Superficie** (si no vino de la reserva) — habilita el patrón de superficie.
3. **Rival** (si no estaba agendado) — habilita cara a cara y patrón de tipo de rival.
4. Confirmación del **ganador** — valida el resultado.

Hora/fecha se infieren del momento de registro o de la reserva.

## Jerarquía de profundidad (qué se desbloquea según lo que el jugador use)

- **Solo resultado validado** → win rate, récord, forma, evolución de victorias, rivales, desglose básico, patrón de superficie/horario/rival (si hay reserva).
- **+ Reserva (Club Manager)** → superficie y horario automáticos, sin preguntar.
- **+ ScoreMatch** → bajo presión fino, momentum, saque, puntos, duración (la capa "pro").
- **+ TrueRank** → evolución de nivel, proyección y meta.

Diseñar para que **funcione bien solo con resultado validado** y mejore al sumar reserva / ScoreMatch / TrueRank — no asumir que todos tienen reloj.
