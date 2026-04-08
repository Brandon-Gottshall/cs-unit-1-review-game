import type { CSUnifiedQuestion } from "./cs-game-data";
import { generateForConcept } from "./question-generators";

export interface VariationPickerState {
  usedQuestionIds: Set<string>;
  generatorSeeds: Map<string, Set<number>>; // concept → used seeds
}

/** Create fresh picker state */
export function createVariationPicker(): VariationPickerState {
  return {
    usedQuestionIds: new Set(),
    generatorSeeds: new Map(),
  };
}

/**
 * Pick an unseen variation for the given concept.
 * 1. Try static questions first (filter to unseen ones for this concept)
 * 2. If all static exhausted, use generator
 * 3. Returns null only if truly no options (no generator + all static used)
 */
export function pickVariation(
  concept: string,
  staticPool: CSUnifiedQuestion[],
  state: VariationPickerState
): CSUnifiedQuestion | null {
  // 1. Filter to unseen static questions for this concept
  const unseenStatic = staticPool.filter(
    (q) => q.concept === concept && !state.usedQuestionIds.has(q.id)
  );

  // 2. If any unseen static questions exist, pick one randomly
  if (unseenStatic.length > 0) {
    const picked = unseenStatic[Math.floor(Math.random() * unseenStatic.length)];
    state.usedQuestionIds.add(picked.id);
    return picked;
  }

  // 3. All static exhausted — try the generator
  let usedSeeds = state.generatorSeeds.get(concept);
  if (!usedSeeds) {
    usedSeeds = new Set();
    state.generatorSeeds.set(concept, usedSeeds);
  }

  const generated = generateForConcept(concept, usedSeeds);
  if (generated) {
    state.usedQuestionIds.add(generated.id);
    return generated;
  }

  // 4. Nothing available
  return null;
}

/** Serialize picker state for localStorage */
export function serializePickerState(state: VariationPickerState): string {
  return JSON.stringify({
    usedQuestionIds: [...state.usedQuestionIds],
    generatorSeeds: Object.fromEntries(
      [...state.generatorSeeds].map(([k, v]) => [k, [...v]])
    ),
  });
}

/** Deserialize picker state from localStorage */
export function deserializePickerState(json: string): VariationPickerState {
  const data = JSON.parse(json);
  return {
    usedQuestionIds: new Set(data.usedQuestionIds),
    generatorSeeds: new Map(
      Object.entries(data.generatorSeeds).map(([k, v]) => [k, new Set(v as number[])])
    ),
  };
}
