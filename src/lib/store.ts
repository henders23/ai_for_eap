/* ============================================================================
   Client-side data model — the single source of truth.

   Everything the user produces lives in their own browser (localStorage).
   No accounts, no server, no tracking. Two threading rules from the design:

     1. M0 baseline ratings  ->  reused by M8 (before/after) and the Portfolio radar.
     2. Per-artefact "Map it" grids  ->  aggregate into the M8 / Portfolio / Framework
        Map coverage index.

   So ratings and framework-evidence are stored ONCE here and read everywhere,
   never re-collected. All access is SSR-safe (guarded on `window`).
   ============================================================================ */

export const AUDIT_KEY = 'eap_self_audit_v1';
export const M8_KEY = 'eap_self_audit_m8_v1';
export const ARTEFACTS_KEY = 'eap_artefacts_v1';
export const EVIDENCE_KEY = 'eap_evidence_v1';

export type Screen = 'intro' | 's1' | 's2' | 's3' | 'result' | 'explore';
export type Remit = 'formal' | 'informal' | 'own';
export type Feeling = 'wary' | 'curious' | 'keen';
export type PathKey = 'A' | 'B' | 'C';
/** 1 = Not yet … 4 = I could show a colleague. 0 / absent = unrated. */
export type Rating = 1 | 2 | 3 | 4;
export type Ratings = Record<number, Rating>;

export interface AuditState {
  screen: Screen;
  contexts: string[];
  remit: Remit | null;
  feeling: Feeling | null;
  ratings: Ratings;
  withColleague: boolean;
  pathStarted: PathKey | null;
}

export const defaultAuditState: AuditState = {
  screen: 'intro',
  contexts: [],
  remit: null,
  feeling: null,
  ratings: {},
  withColleague: false,
  pathStarted: null,
};

const hasStorage = (): boolean => {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
};

function readJSON<T>(key: string, fallback: T): T {
  if (!hasStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...(JSON.parse(raw) as object) } as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode / quota — fail silently, the resource still works in-session */
  }
}

/* ---- Self-audit (Module 0) ------------------------------------------------ */

export function loadAudit(): AuditState {
  const s = readJSON<AuditState>(AUDIT_KEY, defaultAuditState);
  // never resume onto a transient value
  return { ...defaultAuditState, ...s };
}

/** Persist audit state, minus any transient UI fields the caller strips. */
export function saveAudit(state: AuditState): void {
  writeJSON(AUDIT_KEY, state);
}

export function clearAudit(): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.removeItem(AUDIT_KEY);
  } catch {
    /* ignore */
  }
}

/** The M0 baseline shape — the one source M8 and the Portfolio read from. */
export function loadBaselineRatings(): Ratings {
  return loadAudit().ratings ?? {};
}

/** Has the user put ANY input into the self-audit (contexts/remit/feeling/ratings)? */
export function auditStarted(s: AuditState = loadAudit()): boolean {
  return (
    s.contexts.length > 0 ||
    s.remit !== null ||
    s.feeling !== null ||
    Object.keys(s.ratings).length > 0
  );
}

/** Has the user reached the self-audit result (Module 0 "done")? */
export function auditCompleted(s: AuditState = loadAudit()): boolean {
  return s.screen === 'result' || s.pathStarted !== null;
}

/* ---- M8 retake ("now") ---------------------------------------------------- */

/** M8 "now" ratings; defaults to a copy of the M0 baseline so the overlay
 *  starts aligned and grows as the user re-rates. */
export function loadM8Ratings(): Ratings {
  const baseline = loadBaselineRatings();
  return readJSON<Ratings>(M8_KEY, { ...baseline });
}

export function saveM8Ratings(ratings: Ratings): void {
  writeJSON(M8_KEY, ratings);
}

/** Has the user actually retaken the audit at M8 (so an "after" shape exists)? */
export function hasM8Ratings(): boolean {
  if (!hasStorage()) return false;
  try {
    const raw = window.localStorage.getItem(M8_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as Ratings;
    return Object.keys(parsed).length > 0;
  } catch {
    return false;
  }
}

/* ---- Module artefacts / journals ----------------------------------------- */

export interface JournalEntry {
  text: string;
  /** README: the per-journal-entry "include in portfolio" toggle defaults OFF. */
  includeInPortfolio: boolean;
}

export interface ModuleArtefact {
  moduleId: string;
  /** Free-form text field values keyed by the module template's field id
   *  (analysis fields, task before/after, pasted dialogue, …). */
  fields: Record<string, string>;
  /** Tap-to-tick checklist state (e.g. M6 redesign checklist). */
  checklist: Record<number, boolean>;
  /** Segmented view state (e.g. M6 'before' | 'after'). */
  view: string;
  /** Whether the optional dialogue affordance is expanded. */
  dialogueOpen: boolean;
  journal: JournalEntry;
  updatedAt: number | null;
}

export function emptyArtefact(moduleId: string): ModuleArtefact {
  return {
    moduleId,
    fields: {},
    checklist: {},
    view: 'before',
    dialogueOpen: false,
    // README: the per-journal-entry "include in portfolio" toggle defaults OFF.
    journal: { text: '', includeInPortfolio: false },
    updatedAt: null,
  };
}

export type ArtefactStore = Record<string, ModuleArtefact>;

export function loadArtefacts(): ArtefactStore {
  return readJSON<ArtefactStore>(ARTEFACTS_KEY, {});
}

/** Load one module's artefact, merged over sensible defaults. */
export function loadArtefact(moduleId: string): ModuleArtefact {
  const stored = loadArtefacts()[moduleId];
  return { ...emptyArtefact(moduleId), ...(stored ?? {}) };
}

export function saveArtefact(artefact: ModuleArtefact): void {
  const all = loadArtefacts();
  all[artefact.moduleId] = artefact;
  writeJSON(ARTEFACTS_KEY, all);
}

/** Is this module's artefact "kept" — i.e. it should appear in the portfolio /
 *  count as framework evidence? True when the journal is kept, or any artefact
 *  field / checklist tick carries content. */
export function artefactKept(a: ModuleArtefact): boolean {
  if (a.journal.includeInPortfolio && a.journal.text.trim()) return true;
  if (Object.values(a.fields).some((v) => v.trim())) return true;
  if (Object.values(a.checklist).some(Boolean)) return true;
  return false;
}

/* ---- Framework evidence (fed by "Map it") --------------------------------- */

/** A record that a kept artefact evidences a framework area. The Framework Map
 *  and Portfolio index read these; nothing is asked twice. */
export interface EvidenceRecord {
  moduleId: string;
  framework: 'UNESCO' | 'BALEAP';
  /** Area / competency-block id within that framework (see lib/frameworks.ts). */
  areaId: string;
}

export type EvidenceStore = EvidenceRecord[];

export function loadEvidence(): EvidenceStore {
  if (!hasStorage()) return [];
  try {
    const raw = window.localStorage.getItem(EVIDENCE_KEY);
    return raw ? (JSON.parse(raw) as EvidenceStore) : [];
  } catch {
    return [];
  }
}

export function saveEvidence(records: EvidenceStore): void {
  writeJSON(EVIDENCE_KEY, records);
}
