/**
 * REGRESSION TEST: Module Exports
 *
 * Guards against agents renaming or removing exports that other
 * modules depend on. If quiz-client.tsx imports X and an agent
 * renames X to Y, this test catches it.
 *
 * These are the exact imports used by app/quiz/quiz-client.tsx
 * and app/page.tsx — the two consumer entry points.
 */
import { describe, it, expect } from 'vitest';

describe('lib/cs-game-data exports', () => {
  it('exports required symbols', async () => {
    const mod = await import('../lib/cs-game-data');
    expect(mod.unifiedQuestionPool).toBeDefined();
    expect(Array.isArray(mod.unifiedQuestionPool)).toBe(true);
    expect(mod.shuffleArray).toBeTypeOf('function');
    // Type exports verified by TS compilation, but check the pool shape
    expect(mod.unifiedQuestionPool[0]).toHaveProperty('id');
    expect(mod.unifiedQuestionPool[0]).toHaveProperty('type');
    expect(mod.unifiedQuestionPool[0]).toHaveProperty('question');
    expect(mod.unifiedQuestionPool[0]).toHaveProperty('correctAnswer');
  });
});

describe('lib/concept-tree exports', () => {
  it('exports required symbols', async () => {
    const mod = await import('../lib/concept-tree');
    expect(mod.conceptTree).toBeDefined();
    expect(Array.isArray(mod.conceptTree)).toBe(true);
    expect(mod.populateConceptQuestions).toBeTypeOf('function');
    expect(mod.getQuestionConcept).toBeTypeOf('function');
    expect(mod.getConceptMastery).toBeTypeOf('function');
    expect(mod.isConceptUnlocked).toBeTypeOf('function');
    expect(mod.getUnlockedQuestionIds).toBeTypeOf('function');
    expect(mod.getMasteredConcepts).toBeTypeOf('function');
    expect(mod.getNextUnlockedConcepts).toBeTypeOf('function');
    expect(mod.calculateTreeProgress).toBeTypeOf('function');
    expect(mod.MASTERY_THRESHOLD).toBeTypeOf('number');
  });
});

describe('lib/java-parser exports', () => {
  it('exports required symbols', async () => {
    const mod = await import('../lib/java-parser');
    expect(mod.parseJava).toBeTypeOf('function');
    expect(mod.hasSyntaxErrors).toBeTypeOf('function');
  });
});

describe('lib/spaced-repetition exports', () => {
  it('exports required symbols', async () => {
    const mod = await import('../lib/spaced-repetition');
    expect(mod.getNextQuestion).toBeTypeOf('function');
    expect(mod.recordAnswer).toBeTypeOf('function');
    expect(mod.getSessionStats).toBeTypeOf('function');
    expect(mod.resetSession).toBeTypeOf('function');
    expect(mod.getQuestionProgress).toBeTypeOf('function');
  });
});

describe('components/interactive barrel exports', () => {
  it('exports all three interactive components', async () => {
    const mod = await import('../components/interactive');
    expect(mod.JavaCodeEditor).toBeDefined();
    expect(mod.VariableTraceViz).toBeDefined();
    expect(mod.CodeOutputComparison).toBeDefined();
  });
});
