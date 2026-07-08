/* ============================================================================
   Framework reference data — transcribed source-exact from:
     • UNESCO (2024). AI competency framework for teachers. UNESCO.
     • BALEAP (2024). TEAP Individual Accreditation Scheme Handbook (updated Jan 2026);
       underlying: BALEAP (2008). Competency Framework for Teachers of EAP.

   IMPORTANT — academic integrity:
   These are two SEPARATE frameworks. UNESCO's is a general AI-for-teachers
   framework (not EAP-specific); BALEAP's is a general EAP-teaching framework
   (not about AI). Any module→area mapping this resource draws between them is
   the resource's OWN interpretive crosswalk — presented as our scholarly claim,
   never as an official statement by either body.

   The framework NAMES and CODES below are authoritative (source-exact) and may
   be shown without a "draft" caveat. The crosswalk CELL ASSIGNMENTS (which
   module evidences which area) are ours and keep a lightweight "our mapping"
   note until reviewed.
   ============================================================================ */

export interface FrameworkMeta {
  id: 'UNESCO' | 'BALEAP';
  name: string;
  citation: string;
  note: string;
}

export const UNESCO_META: FrameworkMeta = {
  id: 'UNESCO',
  name: 'UNESCO AI Competency Framework for Teachers',
  citation: 'UNESCO (2024). AI competency framework for teachers. Paris: UNESCO. CC BY-SA 3.0 IGO.',
  note: 'A general framework of AI competencies for all teachers — not EAP-specific.',
};

export const BALEAP_META: FrameworkMeta = {
  id: 'BALEAP',
  name: 'BALEAP TEAP Competency Criteria',
  citation:
    'BALEAP (2024). TEAP Individual Accreditation Scheme Handbook (updated Jan 2026). Underlying: BALEAP (2008). Competency Framework for Teachers of EAP.',
  note: 'A general framework of EAP-teaching competencies — not about AI.',
};

/* ---- UNESCO AI CFT: 5 aspects × 3 progression levels = 15 blocks ---------- */

export const UNESCO_LEVELS = ['Acquire', 'Deepen', 'Create'] as const;
export type UnescoLevel = (typeof UNESCO_LEVELS)[number];

export interface UnescoAspect {
  n: number;
  aspect: string;
  /** competency-block name per progression level */
  blocks: Record<UnescoLevel, string>;
}

export const UNESCO_ASPECTS: UnescoAspect[] = [
  {
    n: 1,
    aspect: 'Human-centred mindset',
    blocks: {
      Acquire: 'Human agency',
      Deepen: 'Human accountability',
      Create: 'Social responsibility',
    },
  },
  {
    n: 2,
    aspect: 'Ethics of AI',
    blocks: {
      Acquire: 'Ethical principles',
      Deepen: 'Safe and responsible use',
      Create: 'Co-creating ethical rules',
    },
  },
  {
    n: 3,
    aspect: 'AI foundations and applications',
    blocks: {
      Acquire: 'Basic AI techniques and applications',
      Deepen: 'Application skills',
      Create: 'Creating with AI',
    },
  },
  {
    n: 4,
    aspect: 'AI pedagogy',
    blocks: {
      Acquire: 'AI-assisted teaching',
      Deepen: 'AI–pedagogy integration',
      Create: 'AI-enhanced pedagogical transformation',
    },
  },
  {
    n: 5,
    aspect: 'AI for professional development',
    blocks: {
      Acquire: 'AI enabling lifelong professional learning',
      Deepen: 'AI to enhance organizational learning',
      Create: 'AI to support professional transformation',
    },
  },
];

/* ---- BALEAP TEAP: four core values + four areas of practice --------------- */

export interface BaleapValue {
  code: string;
  short: string;
  statement: string;
}
export const BALEAP_VALUES: BaleapValue[] = [
  { code: 'V1', short: 'Professionalism', statement: 'You are committed to evidence-based practice within your professional context.' },
  { code: 'V2', short: 'Development', statement: 'You value research, scholarship, and selective use of resources (such as technology) to enhance developmental activities.' },
  { code: 'V3', short: 'Collaboration', statement: 'You value collaboration for learning and professional practice.' },
  { code: 'V4', short: 'Inclusivity', statement: 'You respect individual learners’ expectations and values, encourage participation in higher education, and promote equality of opportunity.' },
];

export interface BaleapArea {
  id: string;
  name: string;
}
export const BALEAP_AREAS: BaleapArea[] = [
  { id: 'planning', name: 'Planning & Design' },
  { id: 'teaching', name: 'Teaching & Learning' },
  { id: 'assessment', name: 'Assessment & Feedback' },
  { id: 'scholarship', name: 'Scholarship & Development' },
];

export const BALEAP_PATHWAYS = ['Associate Fellow', 'Fellow', 'Senior Fellow'] as const;
