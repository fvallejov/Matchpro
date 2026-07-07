// ─────────────────────────────────────────────────────────────
// Shim de i18n: la Sales App es SOLO español (venta en Chile).
// Mantiene la interfaz `useLang()` para que los mocks heredados
// de clubmanager-landing funcionen sin cambios estructurales.
// ─────────────────────────────────────────────────────────────

const T = {
  cta: { demo: "Agendar demo", whatsapp: "WhatsApp" },
  hero: {
    vistas: ["Dashboard", "Calendario", "Cuadro del torneo"],
    vistasAria: "Vistas del panel",
    unPanel: "un solo panel",
  },
  operacion: {
    tvModos: ["Grid editable", "Rotación automática", "Código de 6 dígitos"],
    tvAria: "Modos de MatchPro TV",
  },
};

export const useLang = () => ({ lang: "es", t: T });
