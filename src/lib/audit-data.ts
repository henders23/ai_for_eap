/* ============================================================================
   Self-audit content — verbatim from the design handoff.
   Copy is high-fidelity and final; do not paraphrase.
   ============================================================================ */

import type { Remit, Feeling, PathKey } from './store';

export const CONTEXTS: string[] = [
  'Pre-sessional',
  'In-sessional',
  'Foundation',
  'EGAP',
  'ESAP',
  'Writing centre',
  'Teacher educator',
  'Other',
];

export interface RemitOption {
  key: Remit;
  label: string;
  desc: string;
}
export const REMIT: RemitOption[] = [
  { key: 'formal', label: 'Yes, formally', desc: 'Guiding others on AI is part of my role.' },
  { key: 'informal', label: 'Sort of, informally', desc: 'Colleagues ask me about AI, unofficially.' },
  { key: 'own', label: 'No — just my own practice', desc: 'I’m here for my own teaching.' },
];

export interface FeelingOption {
  key: Feeling;
  label: string;
  desc: string;
}
export const FEELINGS: FeelingOption[] = [
  { key: 'wary', label: 'Wary', desc: 'I want solid reasons before I let AI near my teaching.' },
  { key: 'curious', label: 'Curious', desc: 'Interested in AI, not sure where to start.' },
  { key: 'keen', label: 'Keen', desc: 'Already using AI in my teaching — I want to sharpen it.' },
];

export interface AuditItem {
  text: string;
  short: string;
}
/** The eight can-do confidence statements (numbered 01–08 in the UI). */
export const ITEMS: AuditItem[] = [
  { text: 'Explaining plainly how AI generates text — and why it confidently invents sources', short: 'How AI generates text' },
  { text: 'Seeing where AI fits in my professional development (in terms like TEAP or UNESCO)', short: 'Where AI fits in my PD' },
  { text: 'Analysing AI-written academic text the way I already analyse genre and discourse', short: 'Analysing AI text' },
  { text: 'Judging, from how learning works, when AI helps and when it quietly removes the learning', short: 'When AI helps or hinders' },
  { text: 'Talking to students about AI, authorship and integrity from a clear position of my own', short: 'Authorship & integrity' },
  { text: 'Designing a teaching task or assessment that takes AI into account without panic', short: 'Designing tasks' },
  { text: 'Making an evidence-based case about detection, bias and equity to colleagues or managers', short: 'Detection, bias & equity' },
  { text: 'Running a small classroom inquiry into AI and sharing what I learn', short: 'Classroom inquiry' },
];

export const SCALE: string[] = [
  'Not yet',
  'Getting there',
  'Fairly confident',
  'I could show a colleague',
];

export interface PathCard {
  key: PathKey;
  label: string;
  desc: string;
}
export const PATHS: PathCard[] = [
  { key: 'A', label: 'Find your footing', desc: 'Understand how AI works and think it through critically first, so any change to your teaching rests on solid ground.' },
  { key: 'B', label: 'Start making', desc: 'Start designing AI-aware tasks and assessments early, then backfill the theory so your instincts have reasons behind them.' },
  { key: 'C', label: 'Lead the conversation', desc: 'Start with the frameworks and the evidence on bias and equity, so you can guide colleagues and shape AI policy.' },
];

export const REASONS: Record<PathKey, string> = {
  A: 'You want solid reasons before bringing AI into your teaching — this starts there.',
  B: 'You’re already using AI in your teaching — this channels that, then backfills the why.',
  C: 'You have a remit to guide others on AI — this leads with the frameworks and the evidence.',
};

/** Short axis labels for the radar (one per item, in order). */
export const RADAR_LABELS: string[] = ITEMS.map((i) => i.short);

/**
 * Recommendation logic (verbatim from the prototype):
 *   remit === 'formal'  -> C
 *   else feeling === 'keen' -> B
 *   else                -> A
 */
export function recommendKey(
  remit: Remit | null,
  feeling: Feeling | null,
): PathKey {
  if (remit === 'formal') return 'C';
  if (feeling === 'keen') return 'B';
  return 'A';
}
