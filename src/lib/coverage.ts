/* ============================================================================
   Framework coverage — the module→framework-area crosswalk that drives the
   Framework map, plus the matrix builder.

   Rows use SOURCE-EXACT framework structure:
     • BALEAP TEAP: the four areas of practice (frameworks.ts BALEAP_AREAS).
     • UNESCO AI CFT: the five aspects (frameworks.ts UNESCO_ASPECTS).

   The CELL ASSIGNMENTS below (which module evidences which area) are THIS
   RESOURCE'S OWN interpretive crosswalk — draft, and labelled as such in the UI.
   They are the single structured source; the "Map it" popover display lines in
   modules.ts are just the human-readable summary of the same intent.
   ============================================================================ */
import { BALEAP_AREAS, UNESCO_ASPECTS } from './frameworks';

export interface ModuleCoverage {
  /** BALEAP area ids (see BALEAP_AREAS). */
  baleap: string[];
  /** UNESCO aspect numbers 1–5 (see UNESCO_ASPECTS). */
  unesco: number[];
}

/** Draft crosswalk for all nine modules (M0–M8). */
export const MODULE_COVERAGE: Record<string, ModuleCoverage> = {
  M0: { baleap: ['scholarship'], unesco: [5] },
  M1: { baleap: [], unesco: [3] },
  M2: { baleap: ['planning', 'teaching'], unesco: [1, 3] },
  M3: { baleap: ['scholarship'], unesco: [5] },
  M4: { baleap: ['teaching'], unesco: [4] },
  M5: { baleap: ['assessment'], unesco: [1, 2] },
  M6: { baleap: ['planning', 'assessment'], unesco: [4] },
  M7: { baleap: ['assessment'], unesco: [1, 2] },
  M8: { baleap: ['scholarship', 'teaching'], unesco: [4, 5] },
};

export const MODULE_COLS = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8'];

export type CellState = 'yes' | 'plan' | 'na';

export interface MatrixArea {
  label: string;
  cells: CellState[]; // one per module column
  evidenced: boolean;
}
export interface MatrixFramework {
  name: string;
  areas: MatrixArea[];
  done: number;
  total: number;
  pct: number;
}
export interface CoverageMatrix {
  frameworks: MatrixFramework[];
  moduleCols: { label: string; kept: boolean }[];
  totalDone: number;
  totalAll: number;
}

function areaRow(
  frameworkKey: 'baleap' | 'unesco',
  areaKey: string | number,
  label: string,
  kept: Set<string>,
): MatrixArea {
  const cells = MODULE_COLS.map((num): CellState => {
    const cov = MODULE_COVERAGE[num];
    const mapped =
      frameworkKey === 'baleap'
        ? cov.baleap.includes(areaKey as string)
        : cov.unesco.includes(areaKey as number);
    if (!mapped) return 'na';
    return kept.has(num) ? 'yes' : 'plan';
  });
  return { label, cells, evidenced: cells.includes('yes') };
}

/** Build the coverage matrix given the set of kept module numbers (e.g. {"M0","M2"}). */
export function buildMatrix(kept: Set<string>): CoverageMatrix {
  const baleapAreas = BALEAP_AREAS.map((a) =>
    areaRow('baleap', a.id, a.name, kept),
  );
  const unescoAreas = UNESCO_ASPECTS.map((a) =>
    areaRow('unesco', a.n, a.aspect, kept),
  );

  const mk = (name: string, areas: MatrixArea[]): MatrixFramework => {
    const done = areas.filter((a) => a.evidenced).length;
    return {
      name,
      areas,
      done,
      total: areas.length,
      pct: areas.length ? Math.round((100 * done) / areas.length) : 0,
    };
  };

  const frameworks = [
    mk('BALEAP TEAP competencies', baleapAreas),
    mk('UNESCO AI competency framework', unescoAreas),
  ];

  return {
    frameworks,
    moduleCols: MODULE_COLS.map((label) => ({ label, kept: kept.has(label) })),
    totalDone: frameworks.reduce((s, f) => s + f.done, 0),
    totalAll: frameworks.reduce((s, f) => s + f.total, 0),
  };
}
