/* ============================================================================
   Per-module artefact content — the SINGLE SOURCE for both the module workbench
   pages and the Portfolio. Field ids/labels live here once, so a stored value
   always renders under the same label wherever it's shown.
   ============================================================================ */
import type {
  WorkbenchConfig,
  AnalysisArtefact,
  TaskArtefact,
} from '../components/ModuleWorkbench';
import { MODULES } from './modules';

export interface ModuleContent {
  /** Everything the workbench needs except moduleId + mapIt (added at build). */
  workbench: Omit<WorkbenchConfig, 'moduleId' | 'mapIt'>;
  /** Heading used for this module's entry in the Portfolio. */
  portfolioTitle: string;
  /** Italic standfirst above the artefact in the Portfolio (optional). */
  portfolioStandfirst?: string;
}

const M2: ModuleContent = {
  portfolioTitle: 'Analysing an AI-written abstract',
  portfolioStandfirst:
    'Specimen: an AI-written abstract on translanguaging, read for register then for substance.',
  workbench: {
    artefact: {
      kind: 'analysis',
      heading: 'Analyse the specimen',
      fields: [
        {
          id: 'genre-moves',
          label: 'Genre moves you can name',
          placeholder:
            'e.g. Topic → gap → method → over-claimed significance. Textbook CARS, but bloodless.',
        },
        {
          id: 'hollow',
          label: 'Fluent, but hollow',
          placeholder:
            'e.g. “Robust framework”, “transformative potential” — confident register, no findings.',
        },
        {
          id: 'verdict',
          label: 'Your one-line verdict',
          placeholder: 'A competent abstract of a study that was never done…',
          dashed: true,
        },
      ],
      hasDialogue: true,
      dialogueHint: 'An exchange with a model, or a colleague, worth thinking about later.',
      dialoguePlaceholder:
        'You — Rewrite this so it actually reports findings.\nModel — Here is a revised version… (and it invents three numbers)',
    } as AnalysisArtefact,
    journalPlaceholder:
      'What did naming the moves change for you? (e.g. how you’ll give feedback — and how fair it is.)',
    exportTitle: 'That’s your first M2 artefact.',
    exportBody: 'It stays in your browser. Export the portfolio to PDF whenever you like.',
  },
};

const M6: ModuleContent = {
  portfolioTitle: 'Designing an AI-aware task',
  portfolioStandfirst: 'A task you already set, redesigned so the thinking stays the student’s.',
  workbench: {
    artefact: {
      kind: 'task-redesign',
      before: {
        placeholder: '“Write a 1,000-word summary of a journal article of your choice.”',
        tag: 'AI walks through',
        note:
          'A model returns a competent summary in seconds. The reading and condensing — the actual learning — is the part that gets skipped.',
      },
      after: {
        placeholder:
          '“Bring the article and an AI-written summary of it. In class, mark where the summary is thin, wrong, or misses the argument — then write a 300-word corrective only someone who read the article could write.”',
        tag: 'Now the reading is the shortcut',
        note: 'An AI-only answer has nothing to correct. The thinking is visible, and it’s theirs.',
      },
      checklist: [
        'Does the task still make the thinking visible?',
        'Would an AI-only answer be obviously thin?',
        'Is the process assessed, not just the product?',
        'Does it treat AI as something to study, not a shortcut?',
        'Is it honest about where AI is allowed?',
        'Is a student’s own reading the easier route through?',
      ],
      defaultChecked: [0, 1, 2],
    } as TaskArtefact,
    journalPlaceholder:
      'What did redesigning one task teach you? (e.g. more than any detection tool — and what you’ll redesign next.)',
    exportTitle: 'A redesigned task, ready to teach.',
    exportBody: 'Kept in your browser; export the portfolio to PDF whenever you like.',
  },
};

const M8: ModuleContent = {
  portfolioTitle: 'A small classroom inquiry',
  portfolioStandfirst: 'One question, one class, one honest look at what happened.',
  workbench: {
    artefact: {
      kind: 'analysis',
      label: 'Artefact · your inquiry',
      fields: [
        {
          id: 'question',
          label: 'My one question',
          placeholder:
            'Does drafting with AI before class change how my students revise afterwards?',
        },
        {
          id: 'noticed',
          label: 'What I noticed',
          placeholder:
            'Weaker students leant on it whole; stronger ones argued with it. Revision talk got sharper for the second group.',
        },
        {
          id: 'change',
          label: 'What I’ll change next',
          placeholder: 'Teach the “argue with it” move explicitly, before anyone drafts…',
          dashed: true,
        },
      ],
    } as AnalysisArtefact,
    journalPlaceholder:
      'Eight modules ago I’d have called this cheating. Now I can say exactly when it is and when it isn’t.',
    exportTitle: 'You’ve finished the resource.',
    exportBody:
      'Baseline, artefacts, inquiry, and your before-and-after shape — all in your portfolio.',
    exportLinkLabel: 'See your portfolio →',
  },
};

const M1: ModuleContent = {
  portfolioTitle: 'How AI generates text, in my own words',
  portfolioStandfirst: 'A plain explanation of next-word prediction — and why fluent isn’t true.',
  workbench: {
    artefact: {
      kind: 'analysis',
      heading: 'Put it in your own words',
      fields: [
        {
          id: 'explain',
          label: 'How I’d explain it to a colleague, in two sentences',
          placeholder:
            'It predicts the next word from everything it has read; fluency isn’t the same as being right…',
        },
        {
          id: 'invents',
          label: 'Why it invents sources so confidently',
          placeholder:
            'The same next-word prediction that makes it fluent also makes a plausible-looking citation…',
        },
        {
          id: 'stop-assuming',
          label: 'One thing I’ll stop assuming',
          placeholder: 'That a confident, well-formatted answer has already been checked…',
          dashed: true,
        },
      ],
    } as AnalysisArtefact,
    journalPlaceholder:
      'What will you do differently now you can explain how it actually works?',
    exportTitle: 'That’s your M1 artefact.',
    exportBody: 'It stays in your browser. Export the portfolio to PDF whenever you like.',
  },
};

const M3: ModuleContent = {
  portfolioTitle: 'Where AI fits in my professional development',
  portfolioStandfirst: 'Locating AI inside the BALEAP TEAP and UNESCO frameworks.',
  workbench: {
    artefact: {
      kind: 'analysis',
      heading: 'Place yourself',
      fields: [
        {
          id: 'already',
          label: 'Where AI already touches my practice',
          placeholder: 'Planning, feedback, materials, the integrity conversation…',
        },
        {
          id: 'evidences',
          label: 'Which framework area that evidences',
          placeholder:
            'e.g. TEAP Teaching & Learning; UNESCO AI pedagogy — use “Map it” to check…',
        },
        {
          id: 'grow',
          label: 'Where I’d like to grow next',
          placeholder: 'The area that feels least settled, and a first step toward it…',
          dashed: true,
        },
      ],
    } as AnalysisArtefact,
    journalPlaceholder:
      'Which framework gave you the more useful language for your own practice — and why?',
    exportTitle: 'That’s your M3 artefact.',
    exportBody: 'It stays in your browser. Export the portfolio to PDF whenever you like.',
  },
};

const M4: ModuleContent = {
  portfolioTitle: 'When AI helps, and when it hollows',
  portfolioStandfirst: 'A learning-first judgement about one activity I already set.',
  workbench: {
    artefact: {
      kind: 'analysis',
      heading: 'Weigh one activity',
      fields: [
        {
          id: 'activity',
          label: 'The activity — and what the learning really is',
          placeholder:
            'Name the task, then the capability it’s meant to build (not the output it produces)…',
        },
        {
          id: 'helps',
          label: 'Where AI genuinely helps here',
          placeholder: 'The incidental friction it clears so the real thinking can happen…',
        },
        {
          id: 'hollows',
          label: 'Where it quietly removes the learning',
          placeholder: 'The effort that WAS the learning — and shouldn’t be outsourced…',
          dashed: true,
        },
      ],
    } as AnalysisArtefact,
    journalPlaceholder:
      'What surprised you when you named what the learning in this task actually was?',
    exportTitle: 'That’s your M4 artefact.',
    exportBody: 'It stays in your browser. Export the portfolio to PDF whenever you like.',
  },
};

const M5: ModuleContent = {
  portfolioTitle: 'My position on AI, authorship & integrity',
  portfolioStandfirst: 'A clear, defensible line — drawn for myself first.',
  workbench: {
    artefact: {
      kind: 'analysis',
      heading: 'Your position, in your words',
      fields: [
        {
          id: 'fine',
          label: 'What’s fine — and why',
          placeholder: 'The uses you can defend, and the reason they keep authorship with the student…',
        },
        {
          id: 'not',
          label: 'What’s not — and why',
          placeholder: 'The line, and what it protects — ownership of the thinking, not tool-use as such…',
        },
        {
          id: 'say',
          label: 'How I’d say it to a class, in one or two sentences',
          placeholder: 'Something you could actually say aloud, and stand behind…',
          dashed: true,
        },
      ],
    } as AnalysisArtefact,
    journalPlaceholder:
      'Where did your own line turn out to be less clear than you expected?',
    exportTitle: 'That’s your M5 artefact.',
    exportBody: 'It stays in your browser. Export the portfolio to PDF whenever you like.',
  },
};

const M7: ModuleContent = {
  portfolioTitle: 'Detection, bias & equity — an evidence-based case',
  portfolioStandfirst: 'A calm, sourced case for a colleague or a manager.',
  workbench: {
    artefact: {
      kind: 'analysis',
      heading: 'Build the case',
      fields: [
        {
          id: 'claim',
          label: 'The claim I’d make',
          placeholder: 'e.g. Detection scores can’t safely be used against our students…',
        },
        {
          id: 'evidence',
          label: 'The evidence behind it',
          placeholder:
            'False-positive rates; the bias against second-language writers; the appeal problem…',
        },
        {
          id: 'caveat',
          label: 'The honest caveat',
          placeholder: 'What your case does NOT claim — kept, so it stays credible…',
          dashed: true,
        },
      ],
    } as AnalysisArtefact,
    journalPlaceholder:
      'What’s the strongest objection to your case — and your answer to it?',
    exportTitle: 'That’s your M7 artefact.',
    exportBody: 'It stays in your browser. Export the portfolio to PDF whenever you like.',
  },
};

export const MODULE_CONTENT: Record<string, ModuleContent> = {
  M1,
  M2,
  M3,
  M4,
  M5,
  M6,
  M7,
  M8,
};

/** Assemble the full workbench config for a module (content + framework mapping). */
export function buildWorkbenchConfig(moduleId: string): WorkbenchConfig {
  const content = MODULE_CONTENT[moduleId];
  const m = MODULES.find((x) => x.num === moduleId);
  if (!content || !m?.mapping) {
    throw new Error(`No workbench content/mapping for module ${moduleId}`);
  }
  return {
    moduleId,
    mapIt: { teap: m.mapping.teap, unesco: m.mapping.unesco },
    ...content.workbench,
  };
}

/** Ordered field id→label pairs for a module's analysis artefact (for the Portfolio). */
export function analysisFieldDefs(
  moduleId: string,
): { id: string; label: string }[] {
  const a = MODULE_CONTENT[moduleId]?.workbench.artefact;
  if (a?.kind !== 'analysis') return [];
  return a.fields.map((f) => ({ id: f.id, label: f.label }));
}
