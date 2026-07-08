/** @jsxImportSource preact */
/* ============================================================================
   Self-audit flow (Module 0) — the ~2-minute entry check-in.
   State machine: intro → s1 → s2 → s3 → result (+ explore escape hatch).
   Persists to localStorage (eap_self_audit_v1) and resumes on reload.
   Copy + interaction transcribed from the design handoff.
   ============================================================================ */
import { useEffect, useRef, useState } from 'preact/hooks';
import {
  loadAudit,
  saveAudit,
  clearAudit,
  defaultAuditState,
  type AuditState,
  type Screen,
  type Remit,
  type Feeling,
  type PathKey,
  type Rating,
} from '../lib/store';
import {
  CONTEXTS,
  REMIT,
  FEELINGS,
  ITEMS,
  SCALE,
  PATHS,
  REASONS,
  RADAR_LABELS,
  recommendKey,
} from '../lib/audit-data';
import { radarGeometry } from '../lib/radar';

const STEP_LABELS: Partial<Record<Screen, string>> = {
  s1: 'Step 1 of 3',
  s2: 'Step 2 of 3',
  s3: 'Step 3 of 3',
};

export default function SelfAudit() {
  const [state, setState] = useState<AuditState>(defaultAuditState);
  const [toast, setToast] = useState('');
  const [ready, setReady] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Resume from localStorage on mount (client only).
  useEffect(() => {
    setState(loadAudit());
    setReady(true);
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  // Persist on every change (once we've loaded — don't clobber saved state).
  const patch = (partial: Partial<AuditState>) => {
    setState((prev) => {
      const next = { ...prev, ...partial };
      saveAudit(next);
      return next;
    });
  };

  const scrollTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      /* ignore */
    }
  };

  const go = (screen: Screen) => {
    patch({ screen });
    scrollTop();
  };

  const toggleContext = (label: string) => {
    const has = state.contexts.includes(label);
    patch({
      contexts: has
        ? state.contexts.filter((c) => c !== label)
        : [...state.contexts, label],
    });
  };
  const setRemit = (k: Remit) => patch({ remit: k });
  const setFeeling = (k: Feeling) => patch({ feeling: k });
  const setRating = (i: number, v: Rating) =>
    patch({ ratings: { ...state.ratings, [i]: v } });
  const toggleColleague = () => patch({ withColleague: !state.withColleague });

  const startPath = (k: PathKey) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    patch({ pathStarted: k });
    setToast(
      `Module 0 complete. Pathway ${k} would open here — and this audit becomes the first entry in your portfolio.`,
    );
    toastTimer.current = setTimeout(() => setToast(''), 4200);
  };

  const restart = () => {
    clearAudit();
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast('');
    setState({ ...defaultAuditState });
    saveAudit({ ...defaultAuditState });
    scrollTop();
  };

  const scr = state.screen;
  const isStep = scr === 's1' || scr === 's2' || scr === 's3';
  const recKey = recommendKey(state.remit, state.feeling);
  const ratedCount = Object.keys(state.ratings).filter(
    (k) => (state.ratings as Record<string, number>)[k] > 0,
  ).length;

  const rd = radarGeometry(state.ratings, { labels: RADAR_LABELS });

  // Avoid a flash of the intro before localStorage resolves.
  if (!ready) return <div style={{ minHeight: '100vh' }} aria-hidden="true" />;

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ---------------- minimal, state-aware header ---------------- */}
      <header class="audit-header" data-noprint>
        <div class="brand">
          <a href="/">AI for EAP Practitioners</a>
          <span class="kicker">Self-audit</span>
        </div>
        <div class="head-right">
          {isStep && <span class="step">{STEP_LABELS[scr]}</span>}
          {isStep && (
            <button class="head-link" onClick={() => go('explore')}>
              Skip and just explore
            </button>
          )}
          {scr === 'result' && (
            <button class="head-link" onClick={restart}>
              Start over
            </button>
          )}
          {scr === 'explore' && (
            <button class="head-link" onClick={() => go('s1')}>
              Back to the audit
            </button>
          )}
        </div>
      </header>

      <main class="audit-main">
        {/* ============================ INTRO ============================ */}
        {scr === 'intro' && (
          <section class="screen screen--intro">
            <span class="eyebrow">AI for EAP Practitioners · Module 0</span>
            <h1 class="audit-h1">Let’s find your starting point.</h1>
            <div class="rule" style={{ marginTop: '30px' }} />
            <p class="audit-lead intro-lead-lg">
              Two minutes, a few taps, no wrong answers. This just helps the
              resource meet you where you are — and becomes the first entry in a
              portfolio you build as you go, and can export to PDF.
            </p>
            <p class="intro-aside">
              You’ll retake it at the end and see how far you’ve moved.
            </p>
            <div class="intro-actions">
              <button class="btn btn-lg" onClick={() => go('s1')}>
                Begin<span class="trailing">· 2 min</span>
              </button>
              <button
                class="btn-text"
                style={{ fontSize: '16px' }}
                onClick={() => go('explore')}
              >
                Skip and just explore
              </button>
            </div>
            <div class="intro-reassure">
              <span class="dot" />
              <span>No sign-in. Everything you write stays in your browser.</span>
            </div>
          </section>
        )}

        {/* ============================ SCREEN 1 ============================ */}
        {scr === 's1' && (
          <section class="screen screen--s1">
            <span class="eyebrow">A little about you</span>
            <h1 class="audit-h1">Two quick things about you.</h1>
            <p class="audit-lead" style={{ maxWidth: '52ch' }}>
              No wrong answers — this just points you to a sensible place to start
              with AI in your teaching. You can change anything later.
            </p>

            <div class="field-group">
              <h2 class="field-h2">Where do you teach?</h2>
              <p class="field-hint">Tick all that apply.</p>
              <div class="chip-row">
                {CONTEXTS.map((label) => {
                  const sel = state.contexts.includes(label);
                  return (
                    <button
                      key={label}
                      class="chip"
                      aria-pressed={sel}
                      onClick={() => toggleContext(label)}
                    >
                      {sel ? `✓ ${label}` : label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div class="field-group">
              <h2 class="field-h2">Do colleagues look to you on AI?</h2>
              <p class="field-hint">Pick the closest.</p>
              <div class="opt-list">
                {REMIT.map((o) => {
                  const sel = state.remit === o.key;
                  return (
                    <button
                      key={o.key}
                      class="opt-row"
                      aria-pressed={sel}
                      onClick={() => setRemit(o.key)}
                    >
                      <span class="opt-label-wrap">
                        <span class="opt-label">{o.label}</span>
                        <span class="opt-desc">{o.desc}</span>
                      </span>
                      <span class="opt-check" aria-hidden="true">
                        {sel ? '✓' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div class="flow-nav">
              <button class="flow-back" onClick={() => go('intro')}>
                ← Back
              </button>
              <button class="btn" onClick={() => go('s2')}>
                Next →
              </button>
            </div>
          </section>
        )}

        {/* ============================ SCREEN 2 ============================ */}
        {scr === 's2' && (
          <section class="screen screen--s2">
            <span class="eyebrow">Where you’re coming from</span>
            <h1 class="audit-h1">How do you feel about AI in your teaching?</h1>
            <p class="audit-lead" style={{ maxWidth: '50ch' }}>
              One tap. There’s no wrong answer here — and nothing that means you’re
              “behind.”
            </p>

            <div class="opt-list opt-list--feeling">
              {FEELINGS.map((o) => {
                const sel = state.feeling === o.key;
                return (
                  <button
                    key={o.key}
                    class="opt-row"
                    aria-pressed={sel}
                    onClick={() => setFeeling(o.key)}
                  >
                    <span class="opt-label-wrap">
                      <span class="opt-label opt-label--feeling">{o.label}</span>
                      <span class="opt-desc opt-desc--feeling">{o.desc}</span>
                    </span>
                    <span class="opt-check" aria-hidden="true">
                      {sel ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>

            <div class="flow-nav">
              <button class="flow-back" onClick={() => go('s1')}>
                ← Back
              </button>
              <button
                class="btn"
                disabled={!state.feeling}
                onClick={() => go('s3')}
              >
                Continue →
              </button>
            </div>
          </section>
        )}

        {/* ============================ SCREEN 3 ============================ */}
        {scr === 's3' && (
          <section class="screen screen--s3">
            <span class="eyebrow">Your confidence right now</span>
            <h1 class="audit-h1">Your starting point.</h1>
            <p class="audit-lead" style={{ maxWidth: '56ch' }}>
              How confident do you feel about each of these today? Tap the point on
              the scale that fits — from “Not yet” through to “I could show a
              colleague.” Nobody sees this but you.
            </p>

            <div class="rating-list">
              {ITEMS.map((it, i) => (
                <div class="rating-row" key={i}>
                  <div class="rating-text">
                    <span class="rating-num">0{i + 1}</span>
                    <p>{it.text}</p>
                  </div>
                  <div class="scale-row" role="group" aria-label={it.short}>
                    {SCALE.map((label, j) => {
                      const v = (j + 1) as Rating;
                      const sel = state.ratings[i] === v;
                      return (
                        <button
                          key={j}
                          class="scale-btn"
                          aria-pressed={sel}
                          aria-label={`${it.short}: ${label}`}
                          title={label}
                          onClick={() => setRating(i, v)}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div class="flow-nav flow-nav--s3">
              <div class="s3-left">
                <button class="flow-back" onClick={() => go('s2')}>
                  ← Back
                </button>
                <span class="rated-count">
                  {ratedCount} of 8 rated — that’s plenty. The rest can stay blank.
                </span>
              </div>
              <button class="btn" onClick={() => go('result')}>
                See your result →
              </button>
            </div>
          </section>
        )}

        {/* ============================ RESULT ============================ */}
        {scr === 'result' && (
          <section class="screen screen--result">
            <span class="eyebrow">Your result</span>
            <h1 class="audit-h1">Here’s where we’d suggest starting.</h1>
            <p class="audit-lead" style={{ fontSize: '18px', maxWidth: '60ch' }}>
              Here’s where we’d suggest starting, and why. But you know your context
              better than any quiz does — pick whatever pulls you.
            </p>

            <div class="path-grid">
              {PATHS.map((p) => {
                const rec = p.key === recKey;
                return (
                  <div
                    key={p.key}
                    class={`path-card${rec ? ' path-card--rec' : ''}`}
                  >
                    {rec && (
                      <span class="path-ribbon">We’d suggest starting here</span>
                    )}
                    <div class="path-head">
                      <span class="path-key">{p.key}</span>
                      <h3 class="path-title">{p.label}</h3>
                    </div>
                    <p class="path-desc">{p.desc}</p>
                    {rec && <p class="path-reason">{REASONS[p.key]}</p>}
                    <div class="path-spacer" />
                    <button class="path-btn" onClick={() => startPath(p.key)}>
                      Start this path
                    </button>
                  </div>
                );
              })}
            </div>

            <p class="result-note">
              These are suggestions, not a verdict. Any path is fine, and you can
              switch whenever you like.
            </p>

            <div class="result-divider" />

            <div class="result-lower">
              <div class="result-radar">
                <h2>Your starting shape</h2>
                <p>
                  A shape to revisit, not a score. You’ll draw it again at the end
                  and lay the two over each other.
                </p>
                <svg
                  viewBox="0 0 420 400"
                  class="radar-svg"
                  role="img"
                  aria-label="Radar chart of your eight confidence ratings — one axis per can-do statement, further out means more confident."
                >
                  {rd.rings.map((ring, i) => (
                    <polygon
                      key={`ring${i}`}
                      points={ring.points}
                      fill="none"
                      stroke="rgba(43,38,32,0.13)"
                      stroke-width="1"
                    />
                  ))}
                  {rd.spokes.map((sp, i) => (
                    <line
                      key={`spoke${i}`}
                      x1={sp.x1}
                      y1={sp.y1}
                      x2={sp.x2}
                      y2={sp.y2}
                      stroke="rgba(43,38,32,0.13)"
                      stroke-width="1"
                    />
                  ))}
                  <polygon
                    points={rd.points}
                    fill="rgba(192,106,66,0.17)"
                    stroke="#C06A42"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                  {rd.vertices.map((v, i) => (
                    <circle
                      key={`vtx${i}`}
                      cx={v.cx}
                      cy={v.cy}
                      r="3.5"
                      fill="#C06A42"
                    />
                  ))}
                  {rd.labels.map((l, i) => (
                    <text
                      key={`lbl${i}`}
                      x={l.x}
                      y={l.y}
                      text-anchor={l.anchor}
                      fill="#6B6353"
                      style={{
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontSize: '11px',
                        fontWeight: 500,
                      }}
                    >
                      {l.short}
                    </text>
                  ))}
                </svg>
              </div>

              <div class="result-side">
                <div class="colleague-card">
                  <div style={{ flex: 1 }}>
                    <h3>Doing this with a colleague?</h3>
                    <p>
                      Some people work through this in a pair or a reading group.
                      We’ll adjust a few prompts if so.
                    </p>
                  </div>
                  <button
                    class="switch"
                    role="switch"
                    aria-checked={state.withColleague}
                    aria-label="Doing this with a colleague?"
                    onClick={toggleColleague}
                  >
                    <span class="knob" />
                  </button>
                </div>
                <div class="portfolio-nudge">
                  <p>
                    Whatever you pick, you’ve just made the first entry in your
                    portfolio — without quite noticing.
                  </p>
                  <p>
                    Everything stays in your browser, and exports to PDF whenever
                    you want it.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ============================ EXPLORE ============================ */}
        {scr === 'explore' && (
          <section class="screen screen--explore">
            <span class="eyebrow">No audit needed</span>
            <h1 class="audit-h1">Explore everything.</h1>
            <p class="audit-lead" style={{ marginTop: '26px', maxWidth: '48ch' }}>
              The full resource — every module, the toolkit, the peer-level
              exemplars — would open here. The self-audit stays one tap away
              whenever you’d like a starting point.
            </p>
            <div style={{ marginTop: '40px' }}>
              <button class="btn btn-lg" onClick={() => go('s1')}>
                Take the 2-minute audit →
              </button>
            </div>
          </section>
        )}
      </main>

      {toast && (
        <div class="toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  );
}
