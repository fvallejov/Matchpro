// ─────────────────────────────────────────────────────────────
// Motion system — un solo patrón de reveal para todo el sitio.
// Presupuesto: nada > 1.2 s · solo transform/opacity ·
// prefers-reduced-motion degrada a fades (ver <Reveal/>).
// ─────────────────────────────────────────────────────────────

export const EASE = [0.21, 0.47, 0.32, 0.98];

export const DUR = { fast: 0.15, base: 0.3, slow: 0.5 };

/** Reveal estándar: fade + 16 px hacia arriba. */
export const reveal = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.slow, ease: EASE },
  },
};

/** Contenedor con stagger de 80 ms entre hijos. */
export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

/** Spring físico de la escalerilla (reorder). */
export const ladderSpring = { type: "spring", stiffness: 350, damping: 30 };
