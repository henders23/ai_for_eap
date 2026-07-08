/* ============================================================================
   The nine modules (M0–M8) — the shared spine used by the Library home,
   the Module map, and later the Portfolio / Framework map.

   Copy transcribed verbatim from the design handoff. Where the Library home and
   Module map word a module's blurb differently, both are kept (homeBlurb / mapBlurb).

   `built` marks whether a module's own workspace page exists yet; unbuilt modules
   route to the Module map (the design's own graceful placeholder target).
   ============================================================================ */

export type ModuleKind = 'done' | 'baseline' | 'todo';
export type UnescoLevel = 'Acquire' | 'Deepen' | 'Create';

export interface MapLine {
  framework: string;
  detail: string;
}

/** The module→framework crosswalk. NAMES/CODES are source-exact; which module
 *  evidences which area is THIS RESOURCE'S OWN interpretive mapping — shown with
 *  a "draft — to be verified" caveat, never as an official statement. */
export interface ModuleMapping {
  /** Display lines for the "Map it" popover (verbatim from the design). */
  teap: MapLine;
  unesco: MapLine;
  /** Structured ids for the Framework-map coverage matrix (P6). */
  baleapAreas: string[]; // ids from BALEAP_AREAS
  unescoBlocks: { aspect: number; level: UnescoLevel }[];
}

export interface ModuleDef {
  num: string; // 'M0' … 'M8'
  slug: string;
  title: string;
  /** Library-home card blurb. */
  homeBlurb: string;
  /** Module-map spine blurb. */
  mapBlurb: string;
  /** Library-home card call-to-action verb. */
  cta: string;
  /** Module-map status pill text. */
  status: string;
  /** Dot / status styling category on the map spine. */
  kind: ModuleKind;
  /** Italic threading note on the map spine (optional). */
  note?: string;
  /** Whether this module has its own workspace page yet. */
  built: boolean;
  /** The route to use when built. */
  route: string;
  /** Short duration/shape line shown in the module header (built modules). */
  duration?: string;
  /** Framework crosswalk (built modules). */
  mapping?: ModuleMapping;
}

export const MODULES: ModuleDef[] = [
  {
    num: 'M0',
    slug: 'starting-point',
    title: 'Your starting point',
    homeBlurb:
      'A two-minute self-audit that sets your baseline confidence — the shape you’ll revisit at the end.',
    mapBlurb:
      'A two-minute self-audit sets your baseline confidence across eight can-dos.',
    cta: 'Revisit',
    // Default (fresh / no-JS): the terracotta-ring "baseline" dot, like M8 —
    // the two audits are the paired bookends. A progressive-enhancement script
    // fills the dot and flips the pill to "Done" once the audit is completed.
    status: 'Not started',
    kind: 'baseline',
    note: 'Your baseline shape — you’ll lay the end-of-course one over it in M8.',
    built: true,
    route: '/self-audit',
  },
  {
    num: 'M1',
    slug: 'how-ai-generates-text',
    title: 'How AI generates text',
    homeBlurb:
      'Explain plainly how models predict text — and why they invent sources with such confidence.',
    mapBlurb:
      'Explain plainly how models predict text — and why they invent sources with confidence.',
    cta: 'Open module',
    status: 'Not started',
    kind: 'todo',
    built: false,
    route: '/modules/how-ai-generates-text',
  },
  {
    num: 'M2',
    slug: 'analysing-ai-text',
    title: 'Analysing AI-written text',
    homeBlurb:
      'Read AI-written academic prose the way you already read genre and discourse.',
    mapBlurb:
      'Read AI-written academic prose the way you already read genre and discourse.',
    cta: 'Open module',
    status: 'Ready',
    kind: 'todo',
    note: 'Your analyses here build the grid that becomes the M8 index.',
    built: true,
    route: '/modules/analysing-ai-text',
    duration: '~25 min · reading + one artefact',
    mapping: {
      teap: { framework: 'TEAP', detail: 'analysing texts & selecting materials' },
      unesco: { framework: 'UNESCO AI competency', detail: 'critical understanding of AI' },
      baleapAreas: ['planning', 'teaching'],
      unescoBlocks: [
        { aspect: 1, level: 'Acquire' }, // Human agency (critical understanding)
        { aspect: 3, level: 'Acquire' }, // Basic AI techniques and applications
      ],
    },
  },
  {
    num: 'M3',
    slug: 'where-ai-fits',
    title: 'Where AI fits',
    homeBlurb:
      'Locate AI in your professional development — through TEAP, UNESCO and other frameworks.',
    mapBlurb:
      'Locate AI in your professional development — through TEAP, UNESCO and other frameworks.',
    cta: 'Open module',
    status: 'Not started',
    kind: 'todo',
    built: false,
    route: '/modules/where-ai-fits',
  },
  {
    num: 'M4',
    slug: 'help-or-hindrance',
    title: 'Help, or hindrance?',
    homeBlurb:
      'Judge, from how learning works, when AI supports learning and when it quietly removes it.',
    mapBlurb:
      'Judge, from how learning works, when AI supports learning and when it quietly removes it.',
    cta: 'Open module',
    status: 'Not started',
    kind: 'todo',
    built: false,
    route: '/modules/help-or-hindrance',
  },
  {
    num: 'M5',
    slug: 'authorship-integrity',
    title: 'Authorship & integrity',
    homeBlurb:
      'Find a clear position of your own for talking with students about AI and authorship.',
    mapBlurb:
      'Find a clear position of your own for talking with students about AI and authorship.',
    cta: 'Open module',
    status: 'Not started',
    kind: 'todo',
    built: false,
    route: '/modules/authorship-integrity',
  },
  {
    num: 'M6',
    slug: 'designing-ai-aware-tasks',
    title: 'Designing AI-aware tasks',
    homeBlurb:
      'Design a teaching task or assessment that takes AI into account — without panic.',
    mapBlurb:
      'Design a teaching task or assessment that takes AI into account — without panic.',
    cta: 'Open module',
    status: 'Not started',
    kind: 'todo',
    built: true,
    route: '/modules/designing-ai-aware-tasks',
    duration: '~30 min · redesign one task',
    mapping: {
      teap: { framework: 'TEAP', detail: 'course & task design; assessment' },
      unesco: { framework: 'UNESCO AI competency', detail: 'AI pedagogy' },
      baleapAreas: ['planning', 'assessment'],
      unescoBlocks: [
        { aspect: 4, level: 'Deepen' }, // AI–pedagogy integration
      ],
    },
  },
  {
    num: 'M7',
    slug: 'detection-bias-equity',
    title: 'Detection, bias & equity',
    homeBlurb:
      'Build an evidence-based case on detection, bias and equity for colleagues and managers.',
    mapBlurb:
      'Build an evidence-based case on detection, bias and equity for colleagues and managers.',
    cta: 'Open module',
    status: 'Not started',
    kind: 'todo',
    built: false,
    route: '/modules/detection-bias-equity',
  },
  {
    num: 'M8',
    slug: 'inquiry',
    title: 'A small inquiry',
    homeBlurb:
      'Run a small classroom inquiry, retake your audit, and see how far you’ve moved.',
    mapBlurb:
      'Run a small classroom inquiry, retake your audit, and see how far you’ve moved.',
    cta: 'Open module',
    status: 'Retake',
    kind: 'baseline',
    note: 'Retake the audit here — before and after, side by side.',
    built: false,
    route: '/modules/inquiry',
  },
];

/** Where a module card/spine link should point given what's built. */
export function moduleHref(m: ModuleDef): string {
  return m.built ? m.route : '/modules';
}

export interface ToolkitItem {
  title: string;
  blurb: string;
}
export const TOOLKIT: ToolkitItem[] = [
  { title: 'Prompt patterns for EAP', blurb: 'A small, honest set of prompts that respect the learning rather than shortcut it.' },
  { title: 'Task redesign checklist', blurb: 'Nine questions to ask before an AI-aware rewrite of a task.' },
  { title: 'Talking-to-students scripts', blurb: 'Openers for integrity conversations that aren’t a telling-off.' },
  { title: 'Policy one-pager template', blurb: 'A calm, evidence-first note to bring to a programme meeting.' },
];

export interface Exemplar {
  title: string;
  blurb: string;
  by: string;
}
export const EXEMPLARS: Exemplar[] = [
  {
    title: '“I stopped policing and started designing.”',
    blurb: 'A pre-sessional tutor rewrites a summary task so AI becomes part of the thinking, not a threat to it.',
    by: 'Pre-sessional tutor · 4 years in',
  },
  {
    title: 'A reading group’s six-week log',
    blurb: 'An in-sessional team works through M1–M4 together, one lunchtime a week, and keeps the notes.',
    by: 'In-sessional team of five',
  },
  {
    title: 'One integrity conversation, rewritten',
    blurb: 'A writing-centre adviser shares a before-and-after of the same difficult chat with a student.',
    by: 'Writing-centre adviser',
  },
];

export interface RouteSuggestion {
  key: string;
  label: string;
  order: string;
}
export const ROUTES: RouteSuggestion[] = [
  { key: 'A', label: 'A · Find your footing', order: 'M1 → M4 → M2 → M5' },
  { key: 'B', label: 'B · Start making', order: 'M6 → M2 → M1 → M5' },
  { key: 'C', label: 'C · Lead the conversation', order: 'M3 → M7 → M5 → M6' },
];
