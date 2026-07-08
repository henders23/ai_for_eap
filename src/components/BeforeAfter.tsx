/** @jsxImportSource preact */
/* ============================================================================
   M8 before/after — the payoff. The M0 baseline (dashed ink-blue polygon) with
   a "now" polygon (solid terracotta) laid over it that grows live as the eight
   items are re-rated. Baseline is the ONE stored M0 shape; "now" persists to
   eap_self_audit_m8_v1. Nothing is asked twice.
   ============================================================================ */
import { useEffect, useState } from 'preact/hooks';
import {
  loadBaselineRatings,
  loadM8Ratings,
  saveM8Ratings,
  type Ratings,
  type Rating,
} from '../lib/store';
import { RADAR_LABELS, SCALE } from '../lib/audit-data';
import { radarGeometry } from '../lib/radar';

// Fallback baseline shape when the M0 audit hasn't been taken (design's SAMPLE).
const SAMPLE: Ratings = { 0: 2, 1: 1, 2: 3, 3: 2, 4: 2, 5: 1, 6: 1, 7: 2 };
const nonEmpty = (r: Ratings) => Object.keys(r).length > 0;

// Radar geometry (M8 uses a slightly higher centre than the M0 result screen).
const RADAR_OPTS = { cx: 200, cy: 190, R: 118 } as const;

export default function BeforeAfter() {
  const [base, setBase] = useState<Ratings>(SAMPLE);
  const [now, setNow] = useState<Ratings>({ ...SAMPLE });

  useEffect(() => {
    const b = loadBaselineRatings();
    const resolvedBase = nonEmpty(b) ? b : SAMPLE;
    setBase(resolvedBase);
    const storedNow = loadM8Ratings();
    setNow(nonEmpty(storedNow) ? storedNow : { ...resolvedBase });
  }, []);

  const setRating = (i: number, v: Rating) => {
    const next = { ...now, [i]: v };
    setNow(next);
    saveM8Ratings(next);
  };

  // Two polygons over shared rings/spokes/labels.
  const baseGeo = radarGeometry(base, RADAR_OPTS);
  const nowGeo = radarGeometry(now, { ...RADAR_OPTS, labels: RADAR_LABELS });

  // Movement summary.
  let moved = 0;
  let bestI = -1;
  let bestD = 0;
  for (let i = 0; i < 8; i++) {
    const d = (now[i] || 0) - (base[i] || 0);
    if (d > 0) moved++;
    if (d > bestD) {
      bestD = d;
      bestI = i;
    }
  }
  const anyRated = Object.values(now).some((v) => v > 0);
  const movedLine = !anyRated
    ? 'Rate them to see your movement.'
    : `You’ve moved on ${moved} of 8.`;
  const moverLine =
    bestI < 0
      ? 'Your baseline is the dashed line. Tap the dots to set where you are now.'
      : `Biggest shift: “${RADAR_LABELS[bestI]}.” The dashed line is where you began.`;

  return (
    <div class="m8-payoff-cols">
      {/* ---- overlay radar ---- */}
      <div class="m8-radar-col">
        <span class="kicker">Before &amp; after</span>
        <svg viewBox="0 0 400 380" class="m8-radar-svg">
          {nowGeo.rings.map((ring, i) => (
            <polygon
              key={`ring${i}`}
              points={ring.points}
              fill="none"
              stroke="rgba(43,38,32,0.13)"
              stroke-width="1"
            />
          ))}
          {nowGeo.spokes.map((sp, i) => (
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
          {/* baseline: dashed ink-blue, no fill */}
          <polygon
            points={baseGeo.points}
            fill="none"
            stroke="#4A6B78"
            stroke-width="1.5"
            stroke-dasharray="5 4"
            opacity="0.65"
          />
          {/* now: filled terracotta, grows live */}
          <polygon
            class="m8-now-poly"
            points={nowGeo.points}
            fill="rgba(192,106,66,0.18)"
            stroke="#C06A42"
            stroke-width="2"
            stroke-linejoin="round"
          />
          {nowGeo.vertices.map((v, i) => (
            <circle key={`v${i}`} cx={v.cx} cy={v.cy} r="3.5" fill="#C06A42" />
          ))}
          {nowGeo.labels.map((l, i) => (
            <text
              key={`l${i}`}
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
        <div class="m8-legend">
          <span><span class="swatch-base" /> M0 baseline</span>
          <span><span class="swatch-now" /> Now (M8)</span>
        </div>
      </div>

      {/* ---- retake + summary ---- */}
      <div class="m8-retake-col">
        <div class="m8-summary">
          <p class="moved">{movedLine}</p>
          <p class="mover">{moverLine}</p>
        </div>
        <p class="m8-retake-label">Rate the eight again</p>
        <div class="m8-retake-grid">
          {RADAR_LABELS.map((short, i) => (
            <div class="m8-retake-item" key={i}>
              <div class="head">
                <span class="num">0{i + 1}</span>
                <span class="short">{short}</span>
              </div>
              <div class="m8-dots" role="group" aria-label={`${short} — rate again`}>
                {SCALE.map((label, j) => {
                  const v = (j + 1) as Rating;
                  const on = (now[i] || 0) >= v;
                  return (
                    <button
                      key={j}
                      class={`m8-dot${on ? ' on' : ''}`}
                      aria-label={`${short}: ${label}`}
                      aria-pressed={(now[i] || 0) === v}
                      title={label}
                      onClick={() => setRating(i, v)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
