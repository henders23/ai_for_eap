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
- [x] **P2 — Library home + Module map:** the nine-module shell (hero, module grid,
  toolkit, exemplars; the vertical spine, progress card, suggested routes) plus
  progressive-enhancement that reflects real Module-0 completion. Placeholder
  pages for `/map` and `/portfolio` keep the nav whole.
- [x] **P3 — Module workspace templates:** a reusable, config-driven workbench
  island (editable + persisted artefact fields, journal with include-in-portfolio
  toggle defaulting off, a "Map it" popover carrying the draft-crosswalk caveat,
  export nudge). Worked as **M2** (analysis: three fields + optional dialogue) and
  **M6** (task-redesign: segmented before/after + six-question checklist). Reading
  columns stay static Astro so the remaining modules are easy to author.
- [x] **P4 — M8 before/after inquiry:** the payoff. An overlay radar (dashed M0
  baseline + a solid "now" polygon that grows live as you re-rate the eight items),
  a running summary (moved X of 8 + biggest shift), and the inquiry workbench
  (reuses the P3 template). M0→M8 threading is real: one stored ratings object.
- [x] **P5 — Portfolio + PDF export:** the first read-across of every store. The
  M0 baseline radar (+ dashed M8 "after" overlay once retaken), dynamic artefact +
  journal entries with a per-journal "Kept in portfolio" toggle (off → a private
  placeholder that never prints), a "Where it maps" index derived from kept
  artefacts, and "Export to PDF" (`window.print()` with an `@media print` sheet
  that hides nav/controls). Per-module artefact content is now centralized in
  `lib/module-content.ts` — one source for the workbench pages and the portfolio.
- [x] **P6 — Framework map:** the TEAP × UNESCO coverage matrix every "Map it"
  feeds. Rows are source-exact (BALEAP's four areas + UNESCO's five aspects); cells
  are solid (evidenced by a kept artefact), dashed (comes in a later module) or
  faint (n/a), driven by the same kept-artefact evidence as the portfolio. Coverage
  summary + per-framework bars + the honest draft-crosswalk caveat. The structured
  module→area crosswalk lives once in `lib/coverage.ts`.
- [x] **P7 — Remaining modules (draft):** M1 (how AI generates text), M3 (where AI
  fits), M4 (help or hindrance), M5 (authorship & integrity), M7 (detection, bias &
  equity) — reading columns + artefact prompts authored on the existing template.
  All nine modules are now live and deep-linked. Exposed and fixed a gap: the
  portfolio and framework map now count evidence from *every* content module, not
  just M2/M6/M8. **Prose is draft — subject-expert review welcome.**
- [x] **Academic apparatus:** real, canonical references woven through every module
  (inline citations + a per-module working bibliography via `lib/references.ts` +
  `References.astro`), plus a portfolio-throughline orientation on the home page and
  self-audit intro so users grasp the arc early. **Bibliography is a working list —
  verify editions/pages against source.**
- [x] **P9 — Accessibility + responsive:** WCAG AA contrast (darkened the muted /
  numeral tokens that failed on paper — documented in `tokens.css`), skip-to-content
  link, `role="img"` + labels on the radar charts, screen-reader summaries for the
  coverage matrix (decorative cells `aria-hidden`), heading order, larger nav tap
  targets. Verified no horizontal overflow at 375/768/1280 and that the matrix
  scrolls inside its own container (23/23 automated checks).
- [x] **Deployed to Vercel** (static output; no adapter needed).
- [ ] P8 — Citation pass: finalise the *crosswalk cell assignments* against source
  (framework names already source-exact; references now added — this is the mapping
  verification the subject expert drives).

## Licence

Content and code: **CC BY 4.0**.
