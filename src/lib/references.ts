/* ============================================================================
   Working bibliography — real, canonical sources cited across the modules.
   Rendered by References.astro. Titles/venues in <em>.

   NOTE (academic honesty): this is a working bibliography assembled to give the
   resource scholarly grounding. Editions, volume/issue and page references should
   be checked against source before any formal/print use — see the note rendered
   under each list.
   ============================================================================ */

export interface Reference {
  /** Full formatted reference, HTML (allows <em> for titles/venues). */
  html: string;
}

export const REFERENCES: Record<string, Reference> = {
  swales1990: {
    html: 'Swales, J. M. (1990). <em>Genre Analysis: English in Academic and Research Settings.</em> Cambridge University Press.',
  },
  hyland2006: {
    html: 'Hyland, K. (2006). <em>English for Academic Purposes: An Advanced Resource Book.</em> Routledge.',
  },
  leastreet1998: {
    html: 'Lea, M. R., &amp; Street, B. V. (1998). Student writing in higher education: An academic literacies approach. <em>Studies in Higher Education, 23</em>(2), 157–172.',
  },
  bender2021: {
    html: 'Bender, E. M., Gebru, T., McMillan-Major, A., &amp; Shmitchell, S. (2021). On the dangers of stochastic parrots: Can language models be too big? <em>Proceedings of the 2021 ACM Conference on Fairness, Accountability, and Transparency (FAccT ’21),</em> 610–623.',
  },
  ji2023: {
    html: 'Ji, Z., Lee, N., Frieske, R., et al. (2023). Survey of hallucination in natural language generation. <em>ACM Computing Surveys, 55</em>(12), 1–38.',
  },
  liang2023: {
    html: 'Liang, W., Yuksekgonul, M., Mao, Y., Wu, E., &amp; Zou, J. (2023). GPT detectors are biased against non-native English writers. <em>Patterns, 4</em>(7), 100779.',
  },
  bjork2011: {
    html: 'Bjork, E. L., &amp; Bjork, R. A. (2011). Making things hard on yourself, but in a good way: Creating desirable difficulties to enhance learning. In M. A. Gernsbacher et al. (Eds.), <em>Psychology and the Real World</em> (pp. 56–64). Worth Publishers.',
  },
  biggs2011: {
    html: 'Biggs, J., &amp; Tang, C. (2011). <em>Teaching for Quality Learning at University</em> (4th ed.). Open University Press.',
  },
  schon1983: {
    html: 'Schön, D. A. (1983). <em>The Reflective Practitioner: How Professionals Think in Action.</em> Basic Books.',
  },
  eaton2023: {
    html: 'Eaton, S. E. (2023). Postplagiarism: Transdisciplinary ethics and integrity in the age of artificial intelligence and neurotechnology. <em>International Journal for Educational Integrity, 19,</em> 23.',
  },
  unesco2024: {
    html: 'UNESCO. (2024). <em>AI competency framework for teachers.</em> UNESCO.',
  },
  unesco2023: {
    html: 'UNESCO. (2023). <em>Guidance for generative AI in education and research.</em> UNESCO.',
  },
  baleap2008: {
    html: 'BALEAP. (2008). <em>Competency framework for teachers of English for academic purposes.</em> BALEAP.',
  },
  baleap2024: {
    html: 'BALEAP. (2024). <em>TEAP Individual Accreditation Scheme Handbook.</em> BALEAP.',
  },
};

/** Which references each module cites (ordered as they should appear). */
export const MODULE_REFERENCES: Record<string, string[]> = {
  M0: ['schon1983'],
  M1: ['bender2021', 'ji2023'],
  M2: ['swales1990', 'hyland2006', 'bender2021'],
  M3: ['unesco2024', 'baleap2008', 'baleap2024', 'unesco2023'],
  M4: ['bjork2011', 'biggs2011'],
  M5: ['eaton2023', 'leastreet1998'],
  M6: ['biggs2011', 'unesco2023'],
  M7: ['liang2023', 'bender2021'],
  M8: ['schon1983', 'hyland2006'],
};

export function referencesFor(moduleId: string): Reference[] {
  return (MODULE_REFERENCES[moduleId] ?? [])
    .map((k) => REFERENCES[k])
    .filter(Boolean);
}
