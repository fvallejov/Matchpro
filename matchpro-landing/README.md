# MatchPro Landing — V5

Landing construida según la auditoría de diseño (`auditoria-matchpro-landing.md`) y el modelo
de negocio del onboarding (free tier + Competitivo + club-paga).

## Correr

```bash
npm install
npm run dev      # desarrollo → http://localhost:5173
npm run build    # producción → dist/
```

También puedes abrir `dist/index.html` directo en el navegador (build con rutas relativas).

## Stack

Vite · React 19 · Tailwind CSS 4 · Framer Motion 12

## Decisiones clave (trazables a la auditoría)

- **CTA único**: "Descargar gratis" → App Store + QR en desktop + sticky bottom en mobile.
  Google Play marcado "pronto".
- **Narrativa**: problema antes que solución; "3 formas de entrar" fusionada en "Cómo funciona".
- **ScoreMatch** integrado como el "durante" del partido (sección El partido completo),
  subordinado: "ScoreMatch · de MatchPro".
- **TrueRank**: principio ("Tu nivel no es lo que dices"), con "Hoy" vs "En el roadmap" —
  sin vaporware, fuera del checkout.
- **Pricing del onboarding**: Gratis $0 / Competitivo $9.990 (toggle anual −20%) +
  franja club-paga + trial "2 partidos competitivos gratis".
- **Trust B2B** (Transbank · Hecho en Chile) vive en la sección Clubes, no en el hero.
- **Tokens** espejo de `BrandKit.swift` de la app iOS (lime #BBF451, slate, night #0E141B,
  emerald/rose). Eyebrows en mono = gesto compartido con matchpro.tv.
- **Motion system** en `src/motion.js`: un solo reveal (16 px, 0.5 s, ease de marca),
  stagger 80 ms, spring 350/30 para la escalerilla viva, `prefers-reduced-motion` degradado a fades.

## Pendientes antes de publicar

1. **URL real de descarga**: reemplazar `https://getmatchpro.com/app` (grep global) por el
   link definitivo del App Store, y regenerar `public/qr-app.svg` apuntando ahí.
2. **Testimonios** (`src/sections/Cierre.jsx`): citas Y FOTOS son PLACEHOLDERS (fotos de
   pravatar.cc). Reemplazar por testimonios reales con autorización — uno inventado detectado
   destruye confianza.
3. **Cifras de social proof** (`src/sections/Core.jsx`): validar +14.000 / +2.800 con datos reales.
4. **Links legales** del footer: crear las páginas o quitar los links (nada de links muertos).
5. QA visual en dispositivos reales (el sandbox de build no puede renderizar).

## Estructura

```
src/
  motion.js          → tokens de movimiento
  ui.jsx             → Reveal, CountUp, PhoneFrame, StoreBadges, QrCard, SectionHeading
  sections/
    Header.jsx       → header con shrink on-scroll + CTA sticky mobile
    Hero.jsx         → claim + escalerilla viva (animación insignia)
    Core.jsx         → social proof, problema, cómo funciona
    Partido.jsx      → el partido completo (ScoreMatch → stats → escalerilla)
    TrueRank.jsx     → sección dark, hoy vs roadmap
    Negocio.jsx      → deportes, clubes (Club Manager + TV), pricing
    Cierre.jsx       → testimonios, FAQ, CTA final, footer
public/
  app/*.webp         → screenshots reales del simulador
  logo-*.svg, isotipo.svg, qr-app.svg, racket-*.svg
```
