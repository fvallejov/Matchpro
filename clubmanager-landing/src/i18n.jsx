import { createContext, useContext, useEffect, useState } from "react";
import { STRINGS } from "./strings";

/* i18n mínimo (patrón de matchpro-landing V5): Context + diccionario.
   Detecta el idioma del browser y persiste la elección. */

const LangCtx = createContext(null);

function detectLang() {
  try {
    const saved = localStorage.getItem("cm-lang");
    if (saved === "es" || saved === "en") return saved;
  } catch {
    /* localStorage bloqueado: cae a detección */
  }
  const nav = (navigator.language || "es").toLowerCase();
  return nav.startsWith("es") ? "es" : "en";
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(detectLang);

  useEffect(() => {
    try {
      localStorage.setItem("cm-lang", lang);
    } catch {
      /* no-op */
    }
    document.documentElement.lang = lang === "es" ? "es-CL" : "en";
  }, [lang]);

  return (
    <LangCtx.Provider value={{ lang, setLang, t: STRINGS[lang] }}>{children}</LangCtx.Provider>
  );
}

export function useLang() {
  return useContext(LangCtx);
}
