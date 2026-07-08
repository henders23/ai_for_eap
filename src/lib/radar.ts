/* ============================================================================
   Radar / spider chart geometry — a pure function shared by M0 (result),
   M8 (before/after overlay) and the Portfolio.

   8 axes at (-90° + i·45°); a value 1–4 maps to radius R·(v/4). Four concentric
   octagon grid rings + spokes. Short axis labels around the outside.

   Ported from the design prototype's radar() so the geometry matches exactly.
   ============================================================================ */

export interface RadarRing {
  points: string;
}
export interface RadarSpoke {
  x1: number;
  y1: number;
  x2: string;
  y2: string;
}
export interface RadarVertex {
  cx: string;
  cy: string;
}
export interface RadarLabel {
  short: string;
  x: string;
  y: string;
  anchor: 'start' | 'middle' | 'end';
}

export interface RadarGeometry {
  rings: RadarRing[];
  spokes: RadarSpoke[];
  vertices: RadarVertex[];
  points: string;
  labels: RadarLabel[];
}

export interface RadarOptions {
  cx?: number;
  cy?: number;
  R?: number;
  labels?: string[];
}

/**
 * Build radar geometry for a set of 0..7 ratings (values 1–4, or 0/absent).
 * `labels` supplies the short axis captions; pass [] to omit labels.
 */
export function radarGeometry(
  ratings: Record<number, number>,
  opts: RadarOptions = {},
): RadarGeometry {
  const cx = opts.cx ?? 205;
  const cy = opts.cy ?? 195;
  const R = opts.R ?? 118;
  const N = 8;
  const labelText = opts.labels ?? [];

  const ang = (i: number) => ((-90 + i * 45) * Math.PI) / 180;
  const pt = (i: number, rr: number): [number, number] => [
    cx + rr * Math.cos(ang(i)),
    cy + rr * Math.sin(ang(i)),
  ];

  const rings: RadarRing[] = [1, 2, 3, 4].map((k) => {
    const s: string[] = [];
    for (let i = 0; i < N; i++) {
      const [x, y] = pt(i, (R * k) / 4);
      s.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return { points: s.join(' ') };
  });

  const spokes: RadarSpoke[] = [];
  const vertices: RadarVertex[] = [];
  const valPts: string[] = [];
  const labels: RadarLabel[] = [];

  for (let i = 0; i < N; i++) {
    const [ex, ey] = pt(i, R);
    spokes.push({ x1: cx, y1: cy, x2: ex.toFixed(1), y2: ey.toFixed(1) });

    const v = ratings[i] || 0;
    const [vx, vy] = pt(i, (R * v) / 4);
    valPts.push(`${vx.toFixed(1)},${vy.toFixed(1)}`);
    if (v > 0) vertices.push({ cx: vx.toFixed(1), cy: vy.toFixed(1) });

    if (labelText.length) {
      const [lx, ly] = pt(i, R + 20);
      const c = Math.cos(ang(i));
      const s = Math.sin(ang(i));
      const anchor: RadarLabel['anchor'] =
        c > 0.25 ? 'start' : c < -0.25 ? 'end' : 'middle';
      const dy = s > 0.4 ? 12 : s < -0.4 ? -4 : 4;
      labels.push({
        short: labelText[i] ?? '',
        x: lx.toFixed(1),
        y: (ly + dy).toFixed(1),
        anchor,
      });
    }
  }

  return { rings, spokes, vertices, points: valPts.join(' '), labels };
}

/** Baseline overlay polygon points only (M8 / Portfolio dashed ink-blue shape). */
export function radarPolygonPoints(
  ratings: Record<number, number>,
  opts: RadarOptions = {},
): string {
  return radarGeometry(ratings, opts).points;
}
