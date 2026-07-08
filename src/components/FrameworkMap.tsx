/** @jsxImportSource preact */
/* ============================================================================
   Framework map — the coverage matrix that every "Map it" tag feeds into.
   Fed by REAL kept-artefact evidence: M0 counts once a baseline exists; M2/M6/M8
   count once their artefact is kept. Framework rows are source-exact (BALEAP
   areas + UNESCO aspects); the cell assignments are the draft crosswalk.
   ============================================================================ */
import { useEffect, useState } from 'preact/hooks';
import {
  loadBaselineRatings,
  loadArtefacts,
  artefactKept,
} from '../lib/store';
import { buildMatrix, type CoverageMatrix } from '../lib/coverage';
import { MODULE_CONTENT } from '../lib/module-content';

function keptSet(): Set<string> {
  const kept = new Set<string>();
  if (Object.keys(loadBaselineRatings()).length > 0) kept.add('M0');
  const store = loadArtefacts();
  // Any content-bearing module (M1–M8) can carry evidence once its artefact is kept.
  for (const id of Object.keys(MODULE_CONTENT)) {
    const a = store[id];
    if (a && artefactKept(a)) kept.add(id);
  }
  return kept;
}

export default function FrameworkMap() {
  // SSR-safe: start empty (nothing kept), hydrate from storage on mount.
  const [matrix, setMatrix] = useState<CoverageMatrix>(() =>
    buildMatrix(new Set()),
  );
  const [touchedLabel, setTouchedLabel] = useState('none yet');

  useEffect(() => {
    const kept = keptSet();
    setMatrix(buildMatrix(kept));
    const nums = [...kept].map((n) => n.replace('M', '')).sort();
    setTouchedLabel(
      nums.length === 0
        ? 'none yet'
        : nums.length === 1
          ? `Module ${nums[0]}`
          : `Modules ${nums.slice(0, -1).join(', ')} & ${nums[nums.length - 1]}`,
    );
  }, []);

  return (
    <div class="fm-main">
      {/* ---- header ---- */}
      <section class="fm-header">
        <span class="eyebrow">The map</span>
        <h1>Where your work maps.</h1>
        <p>
          Every time you tap <strong>“Map it”</strong> on an artefact, it lands
          here. By the end you can see — at a glance, and in one place — which
          professional frameworks your portfolio already evidences, and which are
          still to come.
        </p>
      </section>

      {/* ---- coverage summary ---- */}
      <section class="fm-summary">
        <div class="fm-summary-row">
          <div class="fm-card-total">
            <span class="label">Evidenced so far</span>
            <div class="fm-count">
              <span class="big">{matrix.totalDone}</span>
              <span class="of">of {matrix.totalAll} framework areas</span>
            </div>
            <p class="note">From the artefacts you’ve kept ({touchedLabel}).</p>
          </div>
          {matrix.frameworks.map((f) => (
            <div class="fm-card-fw" key={f.name}>
              <span class="label">{f.name}</span>
              <div class="fm-count">
                <span class="big">{f.done}</span>
                <span class="of">of {f.total} areas</span>
              </div>
              <div class="fm-bar">
                <span style={{ width: `${f.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- matrix ---- */}
      <section class="fm-matrix-section">
        <div class="fm-scroll">
          <div class="fm-scroll-inner">
            {matrix.frameworks.map((f) => (
              <div class="fm-group" key={f.name}>
                <h2>{f.name}</h2>
                <div class="fm-table">
                  <div class="fm-grid fm-head-row">
                    <span class="fm-head-area">Framework area</span>
                    {matrix.moduleCols.map((c) => (
                      <span
                        key={c.label}
                        class={`fm-head-col${c.kept ? ' kept' : ''}`}
                      >
                        {c.label}
                      </span>
                    ))}
                  </div>
                  {f.areas.map((a) => {
                    const yes = matrix.moduleCols
                      .filter((c, i) => a.cells[i] === 'yes')
                      .map((c) => c.label);
                    const plan = matrix.moduleCols
                      .filter((c, i) => a.cells[i] === 'plan')
                      .map((c) => c.label);
                    const summary =
                      `${a.label}: ` +
                      (a.evidenced
                        ? `evidenced by ${yes.join(', ')}`
                        : 'not yet evidenced') +
                      (plan.length ? `; planned in ${plan.join(', ')}.` : '.');
                    return (
                      <div class="fm-grid fm-row" key={a.label}>
                        <span class="fm-area-label">
                          <span
                            class={`fm-tick${a.evidenced ? ' on' : ''}`}
                            aria-hidden="true"
                          >
                            {a.evidenced ? '✓' : ''}
                          </span>
                          {a.label}
                          <span class="sr-only">{summary}</span>
                        </span>
                        {a.cells.map((state, i) => (
                          <span class="fm-cell" key={i} aria-hidden="true">
                            <span
                              class={
                                state === 'yes'
                                  ? 'fm-dot-yes'
                                  : state === 'plan'
                                    ? 'fm-dot-plan'
                                    : 'fm-dot-na'
                              }
                            />
                          </span>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* legend + caveat */}
        <div class="fm-legend">
          <span><span class="lg-yes" /> Evidenced by a kept artefact</span>
          <span><span class="lg-plan" /> Comes in a later module</span>
        </div>
        <p class="fm-caveat">
          Framework area names are drawn source-exact from BALEAP (2024) and UNESCO
          (2024). Which module evidences which area is this resource’s own draft
          crosswalk — an interpretive mapping, not a claim about either framework’s
          official structure, and verified against source before publishing.
        </p>
      </section>

      <footer class="fm-footer">
        <a class="primary" href="/portfolio">See it in your portfolio →</a>
        <a href="/modules" style={{ fontSize: '14px' }}>Back to the modules</a>
      </footer>
    </div>
  );
}
