# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

MatchPro Sales App — an interactive sales deck (not a website) used in live meetings to pitch Club Manager to sports clubs in Chile. It replaces a PPTX + PDF + proposal sheet with one self-contained artifact that the salesperson personalizes per club. Sibling project to `clubmanager-landing`: same stack, design tokens, and motion system are inherited 1:1.

The README (Spanish) is the product/commercial spec and is authoritative on sales logic, negotiation rules, and the "pendientes antes de usar" list. Read it before changing anything commercial. UI copy and comments are Spanish (ES-only, `noindex` — internal sales tool).

## Commands

```bash
npm run dev      # Vite dev server → http://localhost:5173
npm run build    # → dist/index.html, a SINGLE self-contained HTML file
npm run preview  # serve the production build
npm run smoke    # vite build + jsdom smoke test (smoke.mjs → smoke-v1.mjs)
```

There is no linter and no unit-test runner. `smoke-v1.mjs` is the only test: it builds, boots the bundle in jsdom under various URLs, and asserts text is present/absent per slide.

- Run a subset (the CI sandbox times out ~45s): `SOLO=<substring> npm run smoke` runs only cases whose name contains the substring.
- Test an already-built snapshot without rebuilding: `DIST=dist17/index.html node smoke-v1.mjs`.

`dist*/` are gitignored build snapshots (dist, dist2, … dist39). They are throwaway — do not treat them as source or edit them.

## Build model — why it's one HTML file

`vite.config.js` uses `vite-plugin-singlefile` with `assetsInlineLimit: 100_000_000`, so JS, CSS, and all imported assets (product screenshots included) are inlined into `dist/index.html`. This is deliberate: the deck opens by double-click over `file://`, works offline in the meeting, and can be sent over WhatsApp/email as one attachment. Any new asset must be `import`ed (so it gets inlined) — do not reference files by runtime path.

## Architecture

**Fixed-canvas presentation shell** — `src/App.jsx` is the whole shell. The deck is a Keynote-style fixed `1280×720` stage (`Stage` component) scaled to the viewport, so slide height never changes across screens. Slides cross-fade with framer-motion. Keyboard: `←/→` navigate, `G` index, `E` Prep panel, `R` Bitácora, `B` Playbook, `F` fullscreen, `P` export PDF (stacks slides and prints). Current slide id is mirrored to the URL hash (`#precio`).

**`SLIDES` array in `App.jsx` is the source of truth for the deck** — order, grouping (`Inicio/Producto/Jugadores/Crecimiento/Cierre`), dark-vs-light styling, and which slides are `locked` (always shown: Portada + Propuesta). To add/reorder/rename a slide, edit this array. Slide components live in `src/slides/`; live product replicas (panel, TV, dashboard, escalerilla) live in `src/mocks/`.

**Personalization without a backend — three layers, all funneled through `src/club.jsx`:**
1. Presets: the `CLUBES` object → `?club=<slug>`.
2. URL overrides → `?nombre=...&canchas=5&gmv=2500000&deportes=...`.
3. The **Prep panel** (`src/Prep.jsx`, key `E`): edits everything and generates the shareable link.

`configDesdeQuery()` parses either a plain query or an opaque packed payload into the config object provided via `ClubProvider`. Read config in any component with `useClub()`.

**Opaque signed links.** Prep serializes config into one base64url `?d=…` parameter with a djb2 integrity hash (`empacar`/`desempacar`/`firmar` in `club.jsx`). If the payload doesn't match its hash, `config.alterado` is set and the app shows a "link modificado" banner. This is honest obfuscation, not crypto — the salt lives in the bundle. Real short/revocable links with open-tracking come from `shortener-worker.js` (a Cloudflare Worker) once the app is hosted.

**`src/pricing.js` is the single source of truth for all money.** Plans, UF value, commission, annual discount, market comparison, and the `cotizar()` / `comisionMensual()` math all live here. Prices are a *business* decision and are intentionally NOT editable from the URL or the Prep panel. What the salesperson *can* concede is bounded by `NEGOCIACION` (free months, time-limited % discounts) and hard-floored by `COMISION_PISO` (Transbank cost is untouchable; the floor is clamped in code so a hand-edited URL can't undercut it). The Prep panel edits `REUNION` defaults (assumptions, concessions, contact), never `PLANES`.

**Config modes** carried in the config object: `modo=cliente` hides all internal panels (link sent to a club), `modo=resumen` renders `Resumen.jsx` instead of the deck.

**Internal-only surfaces**, never shown in `modoCliente`: `Prep.jsx` (prepare meeting), `Bitacora.jsx` (localStorage-only meeting log with CSV/TSV export — deliberately not a CRM), `Contraprop.jsx` (out-of-bands counter-proposal, always labeled and traced), `Playbook.jsx` (internal pricing reference).

**Inherited from `clubmanager-landing`, keep the seams intact:**
- `src/i18n.jsx` is a shim: this app is Spanish-only, but `useLang()` exists so mocks copied from the landing keep working. Don't build out real i18n.
- `src/motion.js` — one shared reveal pattern (`EASE`, `reveal`, `stagger`). Budget: nothing over ~1.2s, transform/opacity only.
- `src/index.css` — Tailwind v4 `@theme` design tokens, mirror of the landing / `BrandKit.swift`. `--color-pm*` and `--font-product` are for use *inside the product mocks only*; the product blue must never appear in the deck's own chrome.

## Known placeholders (see README "Pendientes")

`src/links.js` (agenda URL + WhatsApp number), `pricing.js` (`UF_CLP`, confirm `COMISION` vs Transbank), and `CLUBES.ossandon.canchas` in `club.jsx` still carry placeholder/`TODO` values inherited from the landing. Don't assume they're production-real.
