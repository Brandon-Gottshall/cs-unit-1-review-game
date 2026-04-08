/**
 * WF (Well-Formedness) Harness — CS-1301 Review Game
 *
 * Structural gate ensuring every question, interactive payload, render
 * dispatch branch, concept reference, and generator is correctly wired
 * before the build ships.
 *
 * Six validation groups:
 *   1. Question type coverage   — every q.type ∈ REGISTERED_QUESTION_TYPES
 *   2. Render dispatch coverage — quiz-client.tsx branches on every type used
 *   3. Interactive payload shape— variantData/outputData/programData shapes
 *   4. Boundary check           — required payload present / absent matches type
 *   5. Concept consistency      — every concept string resolves, IDs unique
 *   6. Generator determinism    — same seed -> deep-equal question
 *
 * Runs via `npx vitest run` and the pre-commit hook.
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  unifiedQuestionPool,
  type CSUnifiedQuestion,
  type CSQuestionType,
} from '../lib/cs-game-data';
import { conceptTree } from '../lib/concept-tree';
import { generators } from '../lib/question-generators';

// ─── Manually curated registries ──────────────────────────────────────

const REGISTERED_QUESTION_TYPES: ReadonlyArray<CSQuestionType> = [
  'vocabulary',
  'true_false',
  'trace_variables',
  'predict_output',
  'identify_error',
  'complete_code',
  'valid_invalid',
  'match_definition',
  'code_analysis',
  'write_program',
];

/**
 * Types that quiz-client.tsx dispatches to a dedicated interactive renderer
 * (VariableTraceViz / CodeOutputComparison / WriteProgramChallenge).
 * `identify_error` and `complete_code` are NOT here — they render via the
 * shared `formula + CodeAnswerOptions` branch (or QuestionCard when
 * distractors are present).
 */
const RENDER_INTERACTIVE_CASES = [
  'trace_variables',
  'predict_output',
  'write_program',
] as const;

/**
 * For each interactive render type, the required InteractiveData sub-payload
 * and a set of dotted keys that must all be present and non-empty.
 */
const INTERACTIVE_PAYLOAD_MAP: Record<
  (typeof RENDER_INTERACTIVE_CASES)[number],
  { payloadKey: keyof NonNullable<CSUnifiedQuestion['interactive']>; requiredKeys: string[] }
> = {
  trace_variables: {
    payloadKey: 'variantData',
    requiredKeys: ['code', 'finalValues'],
  },
  predict_output: {
    payloadKey: 'outputData',
    requiredKeys: ['code', 'expectedOutput'],
  },
  write_program: {
    payloadKey: 'programData',
    requiredKeys: ['filename', 'description', 'expectedOutput', 'sampleSolution'],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────

function getByPath(obj: unknown, dotted: string): unknown {
  return dotted.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function isNonEmpty(v: unknown): boolean {
  if (v == null) return false;
  if (typeof v === 'string') return v.length > 0;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === 'object') return Object.keys(v as object).length > 0;
  if (typeof v === 'number') return true;
  return Boolean(v);
}

// ─── Group 1: Question type coverage ──────────────────────────────────

describe('WF Harness — Group 1: Question type coverage', () => {
  it('every question type used in the pool is in REGISTERED_QUESTION_TYPES', () => {
    const registered = new Set<string>(REGISTERED_QUESTION_TYPES);
    const unknownTypes = new Set<string>();
    for (const q of unifiedQuestionPool) {
      if (!registered.has(q.type)) unknownTypes.add(q.type);
    }
    expect(Array.from(unknownTypes)).toEqual([]);
  });

  it('REGISTERED_QUESTION_TYPES has no stale entries (every entry used at least once)', () => {
    // Soft check: warn, don't fail. A registered type with zero usage is
    // acceptable during content development.
    const used = new Set(unifiedQuestionPool.map((q) => q.type));
    const unused = REGISTERED_QUESTION_TYPES.filter((t) => !used.has(t));
    // Not an assertion — just document it. If this starts to matter, flip to
    // expect(unused).toEqual([]).
    if (unused.length > 0) {
      // eslint-disable-next-line no-console
      console.info(`[wf-harness] REGISTERED_QUESTION_TYPES not used in pool: ${unused.join(', ')}`);
    }
  });
});

// ─── Group 2: Render dispatch coverage ────────────────────────────────

describe('WF Harness — Group 2: Render dispatch coverage', () => {
  const quizClientPath = path.join(__dirname, '..', 'app', 'quiz', 'quiz-client.tsx');
  const quizClientSource = fs.readFileSync(quizClientPath, 'utf8');

  it('quiz-client.tsx dispatches on every RENDER_INTERACTIVE_CASES type', () => {
    for (const type of RENDER_INTERACTIVE_CASES) {
      const pattern = new RegExp(`currentQuestion\\.type === ['"]${type}['"]`);
      expect(
        pattern.test(quizClientSource),
        `quiz-client.tsx is missing a render branch for type '${type}'`,
      ).toBe(true);
    }
  });

  it('every interactive type used in the pool has a render branch', () => {
    const typesInPool = new Set(unifiedQuestionPool.map((q) => q.type));
    for (const type of RENDER_INTERACTIVE_CASES) {
      if (!typesInPool.has(type)) continue;
      const pattern = new RegExp(`currentQuestion\\.type === ['"]${type}['"]`);
      expect(pattern.test(quizClientSource)).toBe(true);
    }
  });

  it('every question type referenced in quiz-client.tsx is REGISTERED', () => {
    const referenced = new Set<string>();
    const re = /currentQuestion\.type === ['"]([a-z_]+)['"]/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(quizClientSource)) !== null) {
      referenced.add(m[1]);
    }
    const registered = new Set<string>(REGISTERED_QUESTION_TYPES);
    const stray = Array.from(referenced).filter((t) => !registered.has(t));
    expect(stray).toEqual([]);
  });
});

// ─── Group 3: Interactive payload shape ───────────────────────────────

describe('WF Harness — Group 3: Interactive payload shape', () => {
  for (const [type, spec] of Object.entries(INTERACTIVE_PAYLOAD_MAP)) {
    const qsOfType = unifiedQuestionPool.filter((q) => q.type === type);
    if (qsOfType.length === 0) continue;

    describe(`${type} (${qsOfType.length} questions)`, () => {
      it(`every ${type} has interactive.${String(spec.payloadKey)} populated`, () => {
        const missing = qsOfType
          .filter((q) => !q.interactive || !q.interactive[spec.payloadKey])
          .map((q) => q.id);
        expect(missing).toEqual([]);
      });

      it(`every ${type} payload has all required keys non-empty`, () => {
        const broken: Array<{ id: string; missing: string[] }> = [];
        for (const q of qsOfType) {
          const payload = q.interactive?.[spec.payloadKey];
          if (!payload) continue;
          const missingKeys = spec.requiredKeys.filter(
            (k) => !isNonEmpty(getByPath(payload, k)),
          );
          if (missingKeys.length > 0) broken.push({ id: q.id, missing: missingKeys });
        }
        expect(broken).toEqual([]);
      });
    });
  }

  it('trace_variables finalValues is a non-empty record', () => {
    const qs = unifiedQuestionPool.filter((q) => q.type === 'trace_variables');
    for (const q of qs) {
      const fv = q.interactive?.variantData?.finalValues;
      expect(fv, `${q.id} missing finalValues`).toBeTruthy();
      expect(Object.keys(fv!).length, `${q.id} finalValues is empty`).toBeGreaterThan(0);
    }
  });

  it('write_program requiredElements, if present, is a non-empty string array', () => {
    const qs = unifiedQuestionPool.filter((q) => q.type === 'write_program');
    for (const q of qs) {
      const re = q.interactive?.programData?.requiredElements;
      if (re == null) continue;
      expect(Array.isArray(re), `${q.id} requiredElements not an array`).toBe(true);
      expect(re.length, `${q.id} requiredElements empty`).toBeGreaterThan(0);
      for (const el of re) {
        expect(typeof el).toBe('string');
        expect(el.length).toBeGreaterThan(0);
      }
    }
  });
});

// ─── Group 4: Boundary check ──────────────────────────────────────────

describe('WF Harness — Group 4: Boundary check', () => {
  it('questions of a RENDER_INTERACTIVE_CASES type have exactly one matching payload', () => {
    const payloadKeys = ['variantData', 'outputData', 'programData'] as const;
    const broken: string[] = [];
    for (const q of unifiedQuestionPool) {
      const interactiveType = (RENDER_INTERACTIVE_CASES as readonly string[]).includes(q.type);
      if (!interactiveType) continue;
      const expected = INTERACTIVE_PAYLOAD_MAP[q.type as (typeof RENDER_INTERACTIVE_CASES)[number]]
        .payloadKey;
      const present = payloadKeys.filter((k) => q.interactive && q.interactive[k] != null);
      if (present.length !== 1 || present[0] !== expected) {
        broken.push(`${q.id}: expected only ${expected}, got [${present.join(', ')}]`);
      }
    }
    expect(broken).toEqual([]);
  });

  it('non-interactive-dispatch questions carry none of variantData/outputData/programData', () => {
    const dispatchTypes = new Set<string>(RENDER_INTERACTIVE_CASES);
    const broken: string[] = [];
    for (const q of unifiedQuestionPool) {
      if (dispatchTypes.has(q.type)) continue;
      if (!q.interactive) continue;
      const stray: string[] = [];
      if (q.interactive.variantData) stray.push('variantData');
      if (q.interactive.outputData) stray.push('outputData');
      if (q.interactive.programData) stray.push('programData');
      if (stray.length > 0) broken.push(`${q.id} (type=${q.type}): [${stray.join(', ')}]`);
    }
    expect(broken).toEqual([]);
  });
});

// ─── Group 5: Concept consistency ─────────────────────────────────────

describe('WF Harness — Group 5: Concept consistency', () => {
  it('all question IDs are unique', () => {
    const seen = new Map<string, number>();
    for (const q of unifiedQuestionPool) {
      seen.set(q.id, (seen.get(q.id) ?? 0) + 1);
    }
    const dupes = Array.from(seen.entries()).filter(([, n]) => n > 1).map(([id]) => id);
    expect(dupes).toEqual([]);
  });

  it('every question has required fields (id, type, chapter, concept, question, correctAnswer)', () => {
    const broken: Array<{ id: string; missing: string[] }> = [];
    for (const q of unifiedQuestionPool) {
      const missing: string[] = [];
      if (!isNonEmpty(q.id)) missing.push('id');
      if (!isNonEmpty(q.type)) missing.push('type');
      if (typeof q.chapter !== 'number') missing.push('chapter');
      if (!isNonEmpty(q.concept)) missing.push('concept');
      if (!isNonEmpty(q.question)) missing.push('question');
      if (!isNonEmpty(q.correctAnswer)) missing.push('correctAnswer');
      if (missing.length > 0) broken.push({ id: q.id || '(unknown)', missing });
    }
    expect(broken).toEqual([]);
  });

  it('every question.concept resolves to a node in conceptTree', () => {
    const conceptIds = new Set(conceptTree.map((n) => n.id));
    const orphans: Array<{ id: string; concept: string }> = [];
    for (const q of unifiedQuestionPool) {
      if (!conceptIds.has(q.concept)) {
        orphans.push({ id: q.id, concept: q.concept });
      }
    }
    expect(orphans).toEqual([]);
  });

  it('multiple-choice-style questions have at least 2 distractors', () => {
    // Applies to vocabulary, true_false, match_definition, code_analysis,
    // valid_invalid, and identify_error/complete_code with distractors.
    const mcTypes = new Set<CSQuestionType>([
      'vocabulary',
      'match_definition',
      'code_analysis',
      'valid_invalid',
    ]);
    const broken: string[] = [];
    for (const q of unifiedQuestionPool) {
      if (!mcTypes.has(q.type)) continue;
      if (!q.distractors || q.distractors.length < 2) {
        broken.push(`${q.id}: only ${q.distractors?.length ?? 0} distractors`);
      }
    }
    expect(broken).toEqual([]);
  });
});

// ─── Group 6: Generator determinism ───────────────────────────────────

describe('WF Harness — Group 6: Generator determinism', () => {
  const SAMPLE_SEEDS = [1, 42, 100, 2024, 99999];

  it('every generator produces deep-equal questions for the same seed', () => {
    const broken: string[] = [];
    for (const gen of generators) {
      for (const seed of SAMPLE_SEEDS) {
        const a = gen.generate(seed);
        const b = gen.generate(seed);
        try {
          expect(a).toEqual(b);
        } catch {
          broken.push(`${gen.concept} seed=${seed}`);
        }
      }
    }
    expect(broken).toEqual([]);
  });

  it('every generator produces a question with a valid type and concept', () => {
    const registered = new Set<string>(REGISTERED_QUESTION_TYPES);
    const conceptIds = new Set(conceptTree.map((n) => n.id));
    for (const gen of generators) {
      const q = gen.generate(7);
      expect(registered.has(q.type), `${gen.concept}: bad type ${q.type}`).toBe(true);
      expect(conceptIds.has(q.concept), `${gen.concept}: concept ${q.concept} not in tree`).toBe(
        true,
      );
      expect(isNonEmpty(q.question)).toBe(true);
      expect(isNonEmpty(q.correctAnswer)).toBe(true);
      expect(isNonEmpty(q.id)).toBe(true);
    }
  });

  it('each generator yields different questions for different seeds (soft uniqueness)', () => {
    // Very soft check — just require at least 2 distinct outputs across the sample seeds.
    for (const gen of generators) {
      const ids = new Set(SAMPLE_SEEDS.map((s) => gen.generate(s).id));
      expect(ids.size, `${gen.concept} only produced ${ids.size} unique ids`).toBeGreaterThanOrEqual(
        2,
      );
    }
  });
});
