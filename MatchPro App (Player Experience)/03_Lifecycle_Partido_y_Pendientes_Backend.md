# Lifecycle del partido y pendientes de backend

Estados de la card "tu próximo paso" (Jugar) y reglas que faltan definir al conectar backend.

## Máquina de estados (card "tu próximo paso")

| Estado | Qué muestra | Acción del jugador |
|---|---|---|
| `newUser` | Sin escalerillas | Buscar escalerilla |
| `noMatch` | Posición en escalerilla, sin partido | Desafiar |
| `challengeReceived` | Te desafiaron | Aceptar / Rechazar |
| `challengeSent` | Desafío enviado | Cancelar (con confirmación) — **stand-by: esperando respuesta** |
| `upcoming` | Partido agendado | Ver detalle / Chat (coordinación) |
| `enterScore` | Partido jugado | Ingresar marcador |
| `resultPending` | Registraste el marcador | **stand-by: esperando confirmación del rival** |
| `resultByRival` | El rival registró | Revisar resultado → Confirmar / Disputar |
| `resultDisputed` | Disputaste | Ver disputa — **stand-by: esperando resolución** |

Principio: **todo estado en stand-by (esperando al otro lado) se refleja visiblemente** en la card; no se esconde dentro de un sheet.

## Decisiones de diseño tomadas

- **Confirmar/disputar resultado vive en una vista dedicada** (`ResultConfirmView`), NO en el chat. Es una transacción (impacta ranking/Elo) y no debe acoplarse al chat, que es efímero. Accesible desde la card de Jugar y, a futuro, desde notificaciones.
- **El chat es solo coordinación.** El card de resultado no aparece en un partido que aún no se juega.
- **Una sola fuente de verdad**: el partido (`MatchInfo`) define rival, chat y resultado.
- Entrada de marcador unificada en un componente reutilizable (`ScoreEntrySheet`) para registrar y disputar.

## Pendientes de backend (reglas de los stand-by)

1. **Caducidad de `challengeSent`**: ¿en cuántos días expira un desafío sin respuesta? ¿Se notifica al retador? ¿Vuelve a `noMatch`?
2. **Auto-confirmación de `resultByRival`**: si no respondo antes del deadline, ¿se auto-confirma el resultado del rival? ¿En cuántas horas?
3. **Resolución de `resultDisputed`**: ¿quién resuelve (club/admin)? ¿Plazo máximo? ¿Qué pasa si tampoco hay acuerdo (se anula el partido, lo decide el club, etc.)?
4. **Quién puede registrar primero** el resultado: ¿cualquiera de los dos o solo el ganador?
5. **Disputa con aviso en el chat**: al disputar, dejar un mensaje automático en el chat ("disputé el resultado · propuse X") para que la negociación quede ahí. (Decidido: SÍ, al conectar.)
6. **Impacto en ranking/Elo**: el delta (`eloDelta`, `rankFrom`→`rankTo`) hoy es mock; viene del backend al confirmar, y dispara la salida del partido de "próximo" hacia historial.

## Datos hoy hardcodeados (deben derivarse de fuente real)

- **Ubicación del pronóstico (Clima)**: el H1 dice `"ARICA, CHILE"` como placeholder. Debe derivarse de la ubicación real vía reverse geocoding (`CLGeocoder` → `placemark.locality` + `placemark.country`, locale ES). Casos borde: sin `locality` caer a `administrativeArea`; nombres largos no deben romper el H1 a 2 líneas. No concatenar un string fijo.
- **Nombre de escalerilla / posición / integrantes**: hoy mock en las vistas de escalerilla; vienen del backend.
- **Stats del rival (Detalle)**: `allMatches` (historial cara a cara) es mock; de ahí derivan win rate, set rate, récord y línea de tiempo. Todo debe venir de la misma fuente de marcadores reales para que nunca se contradigan.
