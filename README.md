# AI for EAP Practitioners

An **open, self-paced professional-development resource** that helps university
English for Academic Purposes (EAP) teachers use AI thoughtfully in their teaching.

It is deliberately **static and server-less**: no accounts, no login, no backend.
Everything a user writes stays in their own browser (`localStorage`) and exports to
PDF. Free and openly licensed (CC BY 4.0).

The design intent is *considered, editorial, humane* — closer to a well-made
university-press digital object than to edtech. Warm paper + ink, one warm accent
(terracotta), one calm secondary (ink-blue). No AI clichés.

## Tech

- **[Astro](https://astro.build)** — static output, deployable anywhere (GitHub Pages).
- **[Preact](https://preactjs.com)** islands for the few interactive pieces; the rest is
  zero-JS editorial HTML/CSS.
- Fonts: **Fraunces** (display) + **Source Sans 3** (UI/body) via Google Fonts.

## Develop

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # -> dist/ (static)
npm run preview   # serve the built site
```

## Project structure

```
src/
  styles/
    tokens.css        design tokens (colour, type, radius, shadow, spacing)
    base.css          reset, typography, focus, print, keyframes
    components.css     shared component kit (buttons, chips, opt-rows, switch, card…)
    self-audit.css     layout for the self-audit flow
  lib/
    store.ts          localStorage data model — the SINGLE SOURCE OF TRUTH
    radar.ts          radar/spider-chart geometry (shared by M0, M8, Portfolio)
    audit-data.ts     verbatim self-audit content + recommendation logic
    frameworks.ts      source-exact UNESCO + BALEAP framework data
  layouts/Base.astro   page shell + header variants + fonts/meta
  components/
    Header.astro       full-nav header
    SelfAudit.tsx      the self-audit flow island (Module 0)
  pages/
    index.astro        landing (placeholder; full Library Home is a later milestone)
    self-audit.astro   hosts the self-audit island
docs/
  frameworks-reference.md   full extracted UNESCO + BALEAP structure & citations
```

## Data-model threading (important)

Two rules keep the resource from ever asking the same thing twice:

1. **M0 baseline ratings → M8 (before/after) and the Portfolio radar** share one
   stored ratings object.
2. **Per-artefact "Map it" grids → the Framework Map / Portfolio coverage index.**

Both live in `src/lib/store.ts` and are read everywhere, never re-collected.

## Frameworks & academic integrity

Two **separate** frameworks are referenced (source-exact — see
`docs/frameworks-reference.md`):

- **UNESCO (2024). AI competency framework for teachers.** — 5 aspects × 3 levels = 15
  competency blocks. A *general* AI-for-teachers framework (not EAP-specific).
- **BALEAP TEAP competency criteria** (2024 handbook; 2008 framework) — four core
  values + four areas of practice, across three fellowship pathways. A *general*
  EAP-teaching framework (not about AI).

Framework **names and codes are authoritative** and shown as such. The
module→competency **crosswalk is the resource's own interpretive mapping** — neither
body endorses it, and it is always labelled that way, never as "BALEAP/UNESCO say so."

## Build status (roadmap)

- [x] **P0 — Foundation:** design tokens, fonts, layout, header, component kit,
  `localStorage` data model, radar util, print CSS.
- [x] **P1 — Self-audit flow (Module 0):** 5-screen state machine (intro → s1 → s2 → s3
  → result) + explore, recommendation logic (`formal → C`, else `keen → B`, else `A`),
  radar chart, transitions, toast, persistence.
- [ ] P2 — Library home + Module map (nine-module shell).
- [ ] P3 — Module workspace templates (M2 analysis, M6 task-redesign) + artefact/journal store.
- [ ] P4 — M8 before/after inquiry (reuses M0 ratings; overlay radar).
- [ ] P5 — Portfolio + PDF export.
- [ ] P6 — Framework map (coverage matrix fed by "Map it" evidence).
- [ ] P7 — Author the remaining modules (M1, M3–M5, M7).
- [ ] P8 — Citation pass: finalise the crosswalk cell assignments against source.
- [ ] P9 — Accessibility + responsive audit + deploy.

## Licence

Content and code: **CC BY 4.0**.
