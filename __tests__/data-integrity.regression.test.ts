/**
 * REGRESSION TEST: Question Pool & Concept Tree Integrity
 *
 * Guards against agent data corruption:
 * - Questions missing required fields
 * - Question types not in the union
 * - Concept tree with broken prerequisites (cycles, orphans)
 * - Concept keyword mappings referencing non-existent concepts
 */
import { describe, it, expect } from 'vitest';
import {
  unifiedQuestionPool,
  type CSQuestionType,
  type CSUnifiedQuestion,
} from '../lib/cs-game-data';
import {
  conceptTree,
  populateConceptQuestions,
  getQuestionConcept,
  MASTERY_THRESHOLD,
} from '../lib/concept-tree';

// ─── Valid types from the union ──────────────────────────────
const VALID_TYPES: CSQuestionType[] = [
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

// ─── Question Pool Integrity ─────────────────────────────────
describe('Question pool integrity', () => {
  it('pool is non-empty', () => {
    expect(unifiedQuestionPool.length).toBeGreaterThan(0);
  });

  it('every question has required fields', () => {
    for (const q of unifiedQuestionPool) {
      expect(q.id, `missing id`).toBeTruthy();
      expect(q.chapter, `${q.id}: missing chapter`).toBeGreaterThan(0);
      expect(q.type, `${q.id}: missing type`).toBeTruthy();
      expect(q.question, `${q.id}: missing question text`).toBeTruthy();
      expect(q.correctAnswer, `${q.id}: missing correctAnswer`).toBeTruthy();
    }
  });

  it('every question type is in the valid union', () => {
    for (const q of unifiedQuestionPool) {
      expect(
        VALID_TYPES,
        `${q.id} has invalid type "${q.type}"`
      ).toContain(q.type);
    }
  });

  it('question IDs are unique', () => {
    const ids = unifiedQuestionPool.map(q => q.id);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(dupes, `duplicate IDs: ${dupes.join(', ')}`).toHaveLength(0);
  });

  it('MC questions have at least 2 distractors', () => {
    const mcTypes: CSQuestionType[] = ['vocabulary', 'match_definition', 'code_analysis'];
    for (const q of unifiedQuestionPool) {
      if (mcTypes.includes(q.type) && q.distractors) {
        expect(
          q.distractors.length,
          `${q.id}: needs ≥2 distractors, has ${q.distractors.length}`
        ).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('trace_variables questions have variantData', () => {
    for (const q of unifiedQuestionPool) {
      if (q.type === 'trace_variables' && q.interactive) {
        expect(
          q.interactive.variantData,
          `${q.id}: trace_variables missing variantData`
        ).toBeTruthy();
      }
    }
  });

  it('predict_output questions have outputData', () => {
    for (const q of unifiedQuestionPool) {
      if (q.type === 'predict_output' && q.interactive) {
        expect(
          q.interactive.outputData,
          `${q.id}: predict_output missing outputData`
        ).toBeTruthy();
      }
    }
  });
});

// ─── Concept Tree: DAG Validity ──────────────────────────────
describe('Concept tree is a valid DAG', () => {
  const nodeIds = new Set(conceptTree.map(n => n.id));

  it('has nodes', () => {
    expect(conceptTree.length).toBeGreaterThan(0);
  });

  it('node IDs are unique', () => {
    const ids = conceptTree.map(n => n.id);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(dupes, `duplicate concept IDs: ${dupes.join(', ')}`).toHaveLength(0);
  });

  it('all prerequisites reference existing nodes', () => {
    for (const node of conceptTree) {
      for (const prereq of node.prerequisites) {
        expect(
          nodeIds.has(prereq),
          `${node.id} has orphan prerequisite "${prereq}"`
        ).toBe(true);
      }
    }
  });

  it('no self-referencing prerequisites', () => {
    for (const node of conceptTree) {
      expect(
        node.prerequisites,
        `${node.id} lists itself as prerequisite`
      ).not.toContain(node.id);
    }
  });

  it('has no cycles (topological sort succeeds)', () => {
    // Kahn's algorithm
    const inDegree = new Map<string, number>();
    const adj = new Map<string, string[]>();

    for (const node of conceptTree) {
      inDegree.set(node.id, node.prerequisites.length);
      for (const prereq of node.prerequisites) {
        if (!adj.has(prereq)) adj.set(prereq, []);
        adj.get(prereq)!.push(node.id);
      }
    }

    const queue = [...conceptTree.filter(n => n.prerequisites.length === 0).map(n => n.id)];
    let sorted = 0;

    while (queue.length > 0) {
      const current = queue.shift()!;
      sorted++;
      for (const neighbor of adj.get(current) ?? []) {
        const deg = inDegree.get(neighbor)! - 1;
        inDegree.set(neighbor, deg);
        if (deg === 0) queue.push(neighbor);
      }
    }

    expect(sorted, 'cycle detected in concept tree').toBe(conceptTree.length);
  });

  it('has at least one root node (no prerequisites)', () => {
    const roots = conceptTree.filter(n => n.prerequisites.length === 0);
    expect(roots.length).toBeGreaterThan(0);
  });
});

// ─── Concept-Question Mapping ────────────────────────────────
describe('Concept-question mapping', () => {
  it('every question maps to an existing concept', () => {
    const allNodeIds = new Set(conceptTree.map(n => n.id));
    for (const q of unifiedQuestionPool) {
      const conceptId = getQuestionConcept(q.id, q.question, q.type, q.chapter);
      expect(allNodeIds.has(conceptId), `${q.id} → "${conceptId}" not in tree`).toBe(true);
    }
  });

  it('populateConceptQuestions distributes all questions', () => {
    const questions = unifiedQuestionPool.map(q => ({
      id: q.id,
      question: q.question,
      type: q.type,
      chapter: q.chapter,
    }));
    const populated = populateConceptQuestions(conceptTree, questions);
    const assignedIds = populated.flatMap(c => c.questionIds);
    expect(assignedIds.length).toBe(unifiedQuestionPool.length);
  });

  it('MASTERY_THRESHOLD is between 0 and 1', () => {
    expect(MASTERY_THRESHOLD).toBeGreaterThan(0);
    expect(MASTERY_THRESHOLD).toBeLessThanOrEqual(1);
  });
});
