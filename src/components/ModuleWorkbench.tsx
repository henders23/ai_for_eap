/** @jsxImportSource preact */
/* ============================================================================
   Module workbench — the reusable per-module workbench rail.
   Config-driven so every module (M2 analysis, M6 task-redesign, and the rest
   later) shares one interactive shell. Everything the user types persists to the
   per-module artefact store; the "Include in portfolio?" toggle defaults OFF.

   The reading column stays static Astro (authored per module); this island is
   only the interactive rail.
   ============================================================================ */
import { useEffect, useRef, useState } from 'preact/hooks';
import {
  loadArtefact,
  loadArtefacts,
  saveArtefact,
  emptyArtefact,
  type ModuleArtefact,
} from '../lib/store';

export interface MapLine {
  framework: string;
  detail: string;
}
export interface MapItConfig {
  teap: MapLine;
  unesco: MapLine;
}
export interface AnalysisField {
  id: string;
  label: string;
  placeholder: string;
  dashed?: boolean;
}
export interface AnalysisArtefact {
  kind: 'analysis';
  /** Optional artefact heading (e.g. "Analyse the specimen"); omit for none. */
  heading?: string;
  /** Optional eyebrow override (e.g. "Artefact · your inquiry"); when set, the
   *  "goes to portfolio" note is suppressed. */
  label?: string;
  fields: AnalysisField[];
  hasDialogue?: boolean;
  dialogueHint?: string;
  dialoguePlaceholder?: string;
}
export interface TaskItem {
  placeholder: string;
  tag: string;
  note: string;
}
export interface TaskArtefact {
  kind: 'task-redesign';
  before: TaskItem;
  after: TaskItem;
  checklist: string[];
  defaultChecked?: number[];
}
export interface WorkbenchConfig {
  moduleId: string;
  mapIt: MapItConfig;
  artefact: AnalysisArtefact | TaskArtefact;
  journalPlaceholder: string;
  exportTitle: string;
  exportBody: string;
  /** Export-nudge link label (default "Open portfolio →"). */
  exportLinkLabel?: string;
}

export default function ModuleWorkbench({ config }: { config: WorkbenchConfig }) {
  const { moduleId, mapIt, artefact } = config;

  const seed = (): ModuleArtefact => {
    const a = emptyArtefact(moduleId);
    if (artefact.kind === 'task-redesign' && artefact.defaultChecked) {
      for (const i of artefact.defaultChecked) a.checklist[i] = true;
    }
    return a;
  };

  const [state, setState] = useState<ModuleArtefact>(seed);
  const [mapOpen, setMapOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mapWrap = useRef<HTMLDivElement | null>(null);

  // Hydrate from storage on mount (only if this module has a stored artefact).
  useEffect(() => {
    if (loadArtefacts()[moduleId]) setState(loadArtefact(moduleId));
    return () => {
      if (savedTimer.current) clearTimeout(savedTimer.current);
    };
  }, [moduleId]);

  // Close the Map-it popover on outside click / Escape.
  useEffect(() => {
    if (!mapOpen) return;
    const onDown = (e: MouseEvent) => {
      if (mapWrap.current && !mapWrap.current.contains(e.target as Node)) {
        setMapOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMapOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [mapOpen]);

  const persist = (next: ModuleArtefact) => {
    next.updatedAt = Date.now();
    saveArtefact(next);
    setState(next);
    setSaved(true);
    if (savedTimer.current) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaved(false), 1400);
  };

  const setField = (id: string, value: string) =>
    persist({ ...state, fields: { ...state.fields, [id]: value } });
  const setJournal = (text: string) =>
    persist({ ...state, journal: { ...state.journal, text } });
  const toggleInclude = () =>
    persist({
      ...state,
      journal: { ...state.journal, includeInPortfolio: !state.journal.includeInPortfolio },
    });
  const toggleCheck = (i: number) =>
    persist({ ...state, checklist: { ...state.checklist, [i]: !state.checklist[i] } });
  const setView = (view: string) => persist({ ...state, view });
  const toggleDialogue = () => persist({ ...state, dialogueOpen: !state.dialogueOpen });

  const checkedCount = Object.values(state.checklist).filter(Boolean).length;

  const MapIt = () => (
    <div class="mapit-wrap" ref={mapWrap}>
      <button
        class="mapit-btn"
        aria-expanded={mapOpen}
        onClick={() => setMapOpen((v) => !v)}
      >
        Map it ↗
      </button>
      {mapOpen && (
        <div class="mapit-pop" role="dialog" aria-label="Framework mapping">
          <p class="maps-to">Maps to</p>
          <p class="map-line">
            <strong>{mapIt.teap.framework}</strong> — {mapIt.teap.detail}
          </p>
          <p class="map-line">
            <strong>{mapIt.unesco.framework}</strong> — {mapIt.unesco.detail}
          </p>
          <p class="caveat">
            Draft mapping — this resource’s own crosswalk; framework wording to be
            verified against source before publishing.
          </p>
          <a class="see-map" href="/map">See the full map →</a>
        </div>
      )}
    </div>
  );

  return (
    <div class="ws-rail">
      {/* ---- Artefact ---- */}
      <div class="card-artefact">
        <div class="artefact-top">
          <span class="lead">
            <span class="rail-eyebrow rail-eyebrow--terra">
              {artefact.kind === 'task-redesign'
                ? 'Artefact · redesign a task'
                : artefact.label ?? 'Artefact'}
            </span>
            {artefact.kind === 'analysis' && !artefact.label && (
              <span class="to-portfolio">goes to portfolio</span>
            )}
          </span>
          <MapIt />
        </div>

        {artefact.kind === 'analysis' && (
          <>
            {artefact.heading && <h2 class="artefact-h2">{artefact.heading}</h2>}
            <div class="fields">
              {artefact.fields.map((f) => (
                <div class={`field${f.dashed ? ' dashed' : ''}`} key={f.id}>
                  <label for={`f-${moduleId}-${f.id}`}>{f.label}</label>
                  <textarea
                    id={`f-${moduleId}-${f.id}`}
                    rows={2}
                    placeholder={f.placeholder}
                    value={state.fields[f.id] ?? ''}
                    onInput={(e) =>
                      setField(f.id, (e.target as HTMLTextAreaElement).value)
                    }
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {artefact.kind === 'task-redesign' && (
          <>
            <div class="ws-segmented" role="group" aria-label="Task version">
              <button
                aria-pressed={state.view === 'before'}
                onClick={() => setView('before')}
              >
                As it stands
              </button>
              <button
                aria-pressed={state.view === 'after'}
                onClick={() => setView('after')}
              >
                Redesigned
              </button>
            </div>
            {(() => {
              const isAfter = state.view === 'after';
              const item = isAfter ? artefact.after : artefact.before;
              const fieldId = isAfter ? 'task-after' : 'task-before';
              return (
                <div class="task-panel">
                  <div class={`task-box${isAfter ? ' task-box--after' : ''}`}>
                    <textarea
                      rows={4}
                      aria-label={isAfter ? 'Redesigned task' : 'Task as it stands'}
                      placeholder={item.placeholder}
                      value={state.fields[fieldId] ?? ''}
                      onInput={(e) =>
                        setField(fieldId, (e.target as HTMLTextAreaElement).value)
                      }
                    />
                  </div>
                  <span class={`task-tag task-tag--${isAfter ? 'after' : 'before'}`}>
                    {item.tag}
                  </span>
                  <p class="task-note">{item.note}</p>
                </div>
              );
            })()}
          </>
        )}
      </div>

      {/* ---- Redesign checklist (task-redesign only) ---- */}
      {artefact.kind === 'task-redesign' && (
        <div class="card-plain">
          <div class="checklist-head">
            <span class="rail-eyebrow rail-eyebrow--blue">Redesign checklist</span>
            <span class="checklist-count">{checkedCount} of {artefact.checklist.length}</span>
          </div>
          <div class="checklist">
            {artefact.checklist.map((label, i) => {
              const on = !!state.checklist[i];
              return (
                <button
                  key={i}
                  class="check-row"
                  aria-pressed={on}
                  onClick={() => toggleCheck(i)}
                >
                  <span class="check-box" aria-hidden="true">{on ? '✓' : ''}</span>
                  <span class="check-label">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ---- Journal ---- */}
      <div class="card-plain">
        <span class="rail-eyebrow rail-eyebrow--blue">Journal</span>
        <div class="journal-prompt">
          <textarea
            rows={3}
            aria-label="Journal note"
            placeholder={config.journalPlaceholder}
            value={state.journal.text}
            onInput={(e) => setJournal((e.target as HTMLTextAreaElement).value)}
          />
        </div>
        <div class="journal-foot">
          <span>Include in portfolio?</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span class={`saved-hint${saved ? ' show' : ''}`} aria-hidden="true">
              Saved
            </span>
            <button
              class="switch switch-sm"
              role="switch"
              aria-checked={state.journal.includeInPortfolio}
              aria-label="Include this journal note in your portfolio"
              onClick={toggleInclude}
            >
              <span class="knob" />
            </button>
          </span>
        </div>
      </div>

      {/* ---- Optional dialogue (analysis only) ---- */}
      {artefact.kind === 'analysis' && artefact.hasDialogue && (
        state.dialogueOpen ? (
          <div class="card-warm">
            <div class="dialogue-open">
              <span class="rail-eyebrow rail-eyebrow--muted">Dialogue · optional</span>
              <button class="dialogue-remove" onClick={toggleDialogue}>Remove</button>
            </div>
            <p class="dialogue-hint">
              {artefact.dialogueHint ??
                'An exchange with a model, or a colleague, worth thinking about later.'}
            </p>
            <div class="field" style={{ marginTop: '12px' }}>
              <textarea
                rows={4}
                aria-label="Pasted dialogue"
                placeholder={
                  artefact.dialoguePlaceholder ??
                  'Paste an exchange worth keeping…'
                }
                value={state.fields.dialogue ?? ''}
                onInput={(e) =>
                  setField('dialogue', (e.target as HTMLTextAreaElement).value)
                }
              />
            </div>
          </div>
        ) : (
          <button class="dialogue-add" onClick={toggleDialogue}>
            + Add a dialogue &nbsp;<span class="opt">(optional)</span>
          </button>
        )
      )}

      {/* ---- Export nudge ---- */}
      <div class="export-nudge">
        <p>{config.exportTitle}</p>
        <p class="sub">{config.exportBody}</p>
        <a href="/portfolio">{config.exportLinkLabel ?? 'Open portfolio →'}</a>
      </div>
    </div>
  );
}
