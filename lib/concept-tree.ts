/**
 * CS-1301 Concept Tree - Skill tree style progression system
 *
 * Concepts are organized as nodes with prerequisites.
 * Mastering prerequisites unlocks new concepts.
 * Questions are mapped to concepts by their generated IDs.
 *
 * Structure covers Introduction to Java (Chapters 1-2)
 */

export interface ConceptNode {
  id: string;
  name: string;
  description: string;
  prerequisites: string[];
  questionIds: string[];  // Question IDs that belong to this concept
  chapter: number;
  // Visual positioning (for skill tree layout)
  x?: number;  // 0-100 percentage
  y?: number;  // 0-100 percentage
}

export type ConceptTree = ConceptNode[];

export type MasteryData = Record<string, { correct: number; total: number }>;

// Threshold for considering a concept "mastered" (70%)
export const MASTERY_THRESHOLD = 0.7;

/**
 * The actual concept tree for CS-1301
 *
 * Layout (skill tree style):
 *
 *    [Computer Components]    [Language History]
 *           |                        |
 *    [Programs & Instructions]  [IDE Concepts]
 *           |                        |
 *    [Programming Basics] -----------+
 *       /          \
 *   [Comments]  [Errors & Debugging]
 *       |
 *  [Variables & Assignments]
 *       |
 *   [Identifiers]
 *    /    |    \
 *  [Int Arithmetic] [Floating Point] [Constants]
 *    |      |         |
 *   [Division/Modulo] [Type Conversions] [Math Methods]
 *       |         |         |
 *   [Binary]  [Chars/Strings] [Numeric Types]
 *                |           |
 *            [Overflow]  [Random Numbers]
 */
export const conceptTree: ConceptTree = [
  // === TIER 1: Foundations (no prerequisites) ===
  {
    id: 'computer-components',
    name: 'Computer Components',
    description: 'RAM, SSD, cache, clock speed, Moore\'s Law, operating systems',
    prerequisites: [],
    questionIds: [],
    chapter: 1,
    x: 20,
    y: 5,
  },
  {
    id: 'language-history',
    name: 'Language History',
    description: 'C, C++, Java timeline and evolution of programming languages',
    prerequisites: [],
    questionIds: [],
    chapter: 1,
    x: 80,
    y: 5,
  },

  // === TIER 2: Programs & Execution ===
  {
    id: 'programs-instructions',
    name: 'Programs & Instructions',
    description: 'Bits, machine instructions, assembly, compiler, application code',
    prerequisites: ['computer-components'],
    questionIds: [],
    chapter: 1,
    x: 50,
    y: 15,
  },
  {
    id: 'ide-concepts',
    name: 'IDE Concepts',
    description: 'Syntax highlighting, delimiters, console, CLI, command-line arguments',
    prerequisites: [],
    questionIds: [],
    chapter: 1,
    x: 80,
    y: 25,
  },

  // === TIER 3: Programming Basics ===
  {
    id: 'programming-basics',
    name: 'Programming Basics',
    description: 'Main method, statements, semicolons, println, counting instructions',
    prerequisites: ['programs-instructions', 'ide-concepts'],
    questionIds: [],
    chapter: 1,
    x: 40,
    y: 30,
  },
  {
    id: 'comments-whitespace',
    name: 'Comments & Whitespace',
    description: '//, /* */, code readability and formatting',
    prerequisites: ['programming-basics'],
    questionIds: [],
    chapter: 1,
    x: 70,
    y: 35,
  },
  {
    id: 'errors-debugging',
    name: 'Errors & Debugging',
    description: 'Syntax, logic, and runtime errors; compile-time vs runtime',
    prerequisites: ['programming-basics'],
    questionIds: [],
    chapter: 1,
    x: 20,
    y: 35,
  },

  // === TIER 4: Variables ===
  {
    id: 'variables-assignments',
    name: 'Variables & Assignments',
    description: 'Variable declarations (int), memory, valid/invalid assignments, tracing',
    prerequisites: ['programming-basics'],
    questionIds: [],
    chapter: 2,
    x: 40,
    y: 45,
  },
  {
    id: 'identifiers',
    name: 'Identifiers',
    description: 'Naming rules, camelCase convention, reserved words and keywords',
    prerequisites: ['variables-assignments'],
    questionIds: [],
    chapter: 2,
    x: 70,
    y: 50,
  },

  // === TIER 5: Arithmetic ===
  {
    id: 'arithmetic-int',
    name: 'Integer Arithmetic',
    description: 'Operators (+, -, *, /), precedence, parentheses, expression evaluation',
    prerequisites: ['variables-assignments'],
    questionIds: [],
    chapter: 2,
    x: 30,
    y: 60,
  },
  {
    id: 'floating-point',
    name: 'Floating Point',
    description: 'Double data type, floating-point numbers, mixed arithmetic operations, scientific notation',
    prerequisites: ['variables-assignments'],
    questionIds: [],
    chapter: 2,
    x: 60,
    y: 60,
  },

  // === TIER 6: Operations & Types ===
  {
    id: 'int-division-modulo',
    name: 'Division & Modulo',
    description: 'Integer division truncation, modulo operator (%), even/odd detection',
    prerequisites: ['arithmetic-int'],
    questionIds: [],
    chapter: 2,
    x: 20,
    y: 72,
  },
  {
    id: 'type-conversions',
    name: 'Type Conversions',
    description: 'Widening and narrowing conversions, explicit casts, (int) and (double)',
    prerequisites: ['arithmetic-int', 'floating-point'],
    questionIds: [],
    chapter: 2,
    x: 50,
    y: 72,
  },
  {
    id: 'constants',
    name: 'Constants',
    description: 'Final keyword, constant values, UPPER_CASE naming convention',
    prerequisites: ['variables-assignments'],
    questionIds: [],
    chapter: 2,
    x: 75,
    y: 65,
  },
  {
    id: 'math-methods',
    name: 'Math Methods',
    description: 'Math.pow, Math.sqrt, Math.abs, exponentiation, square root, absolute value',
    prerequisites: ['floating-point'],
    questionIds: [],
    chapter: 2,
    x: 85,
    y: 72,
  },

  // === TIER 7: Advanced Types ===
  {
    id: 'binary',
    name: 'Binary Numbers',
    description: 'Decimal to binary conversion, binary to decimal, base-2 representation',
    prerequisites: ['arithmetic-int'],
    questionIds: [],
    chapter: 2,
    x: 20,
    y: 85,
  },
  {
    id: 'chars-strings',
    name: 'Characters & Strings',
    description: 'Char type, ASCII codes, String type, concatenation, String methods (charAt, substring, length)',
    prerequisites: ['type-conversions'],
    questionIds: [],
    chapter: 2,
    x: 50,
    y: 85,
  },
  {
    id: 'numeric-types',
    name: 'Numeric Data Types',
    description: 'Byte, short, int, long, float, double ranges and memory usage',
    prerequisites: ['type-conversions'],
    questionIds: [],
    chapter: 2,
    x: 75,
    y: 85,
  },

  // === TIER 7.5: Program Structure & Writing ===
  {
    id: 'java-program-structure',
    name: 'Java Program Structure',
    description: 'The anatomy of a Java file: import statements, class declaration, main method signature (public static void main), filename↔classname rule',
    prerequisites: ['programming-basics', 'identifiers'],
    questionIds: [],
    chapter: 1,
    x: 50,
    y: 88,
  },
  {
    id: 'write-programs',
    name: 'Write Full Programs',
    description: 'Writing complete Java programs from scratch: imports, class, main method, Scanner, output',
    prerequisites: ['java-program-structure', 'floating-point'],
    questionIds: [],
    chapter: 2,
    x: 50,
    y: 95,
  },

  // === TIER 8: Advanced Topics ===
  {
    id: 'overflow',
    name: 'Integer Overflow',
    description: 'Overflow detection, wrap-around behavior, consequences of exceeding type range',
    prerequisites: ['numeric-types', 'binary'],
    questionIds: [],
    chapter: 2,
    x: 35,
    y: 92,
  },
  {
    id: 'random-numbers',
    name: 'Random Numbers',
    description: 'Random class, seed, nextInt method, generating random numbers in a range',
    prerequisites: ['math-methods'],
    questionIds: [],
    chapter: 2,
    x: 65,
    y: 92,
  },
];

/**
 * @deprecated Use q.concept directly — all questions now carry an explicit concept field.
 * Kept as fallback for any edge cases.
 */
export function getQuestionConcept(
  questionId: string,
  _questionText: string,
  _questionType: string,
  chapter: number
): string {
  // ID-prefix fallback
  if (questionId.startsWith('gen-')) {
    // Generated questions encode concept in ID: gen-{concept}-{seed}
    const parts = questionId.split('-');
    return parts.slice(1, -1).join('-');
  }

  // Chapter-based fallback
  return chapter === 1 ? 'programming-basics' : 'variables-assignments';
}

/**
 * Calculate mastery percentage for a concept
 * @returns 0-1 representing mastery percentage
 */
export function getConceptMastery(
  conceptId: string,
  questionIds: string[],
  masteryData: MasteryData
): number {
  if (questionIds.length === 0) return 0;

  let totalCorrect = 0;
  let totalAttempts = 0;

  for (const qId of questionIds) {
    const data = masteryData[qId];
    if (data) {
      totalCorrect += data.correct;
      totalAttempts += data.total;
    }
  }

  if (totalAttempts === 0) return 0;
  return totalCorrect / totalAttempts;
}

/**
 * Check if a concept is unlocked based on prerequisite mastery
 */
export function isConceptUnlocked(
  conceptId: string,
  tree: ConceptTree,
  masteryData: MasteryData
): boolean {
  const concept = tree.find(c => c.id === conceptId);
  if (!concept) return false;

  // Root concepts (no prerequisites) are always unlocked
  if (concept.prerequisites.length === 0) return true;

  // Check all prerequisites are mastered
  for (const prereqId of concept.prerequisites) {
    const prereq = tree.find(c => c.id === prereqId);
    if (!prereq) continue;

    const mastery = getConceptMastery(prereqId, prereq.questionIds, masteryData);
    if (mastery < MASTERY_THRESHOLD) {
      return false;
    }
  }

  return true;
}

/**
 * Get all question IDs from unlocked concepts
 */
export function getUnlockedQuestionIds(
  tree: ConceptTree,
  masteryData: MasteryData
): string[] {
  const unlocked: string[] = [];

  for (const concept of tree) {
    if (isConceptUnlocked(concept.id, tree, masteryData)) {
      unlocked.push(...concept.questionIds);
    }
  }

  return unlocked;
}

/**
 * Get IDs of all mastered concepts (>= 70% mastery)
 */
export function getMasteredConcepts(
  tree: ConceptTree,
  masteryData: MasteryData
): string[] {
  return tree
    .filter(concept => {
      const mastery = getConceptMastery(concept.id, concept.questionIds, masteryData);
      return mastery >= MASTERY_THRESHOLD;
    })
    .map(c => c.id);
}

/**
 * Get concepts that are unlocked but not yet mastered (next to work on)
 */
export function getNextUnlockedConcepts(
  tree: ConceptTree,
  masteryData: MasteryData
): ConceptNode[] {
  return tree.filter(concept => {
    const unlocked = isConceptUnlocked(concept.id, tree, masteryData);
    const mastery = getConceptMastery(concept.id, concept.questionIds, masteryData);
    return unlocked && mastery < MASTERY_THRESHOLD;
  });
}

/**
 * Calculate overall progress through the concept tree
 */
export function calculateTreeProgress(
  tree: ConceptTree,
  masteryData: MasteryData
): {
  totalConcepts: number;
  masteredConcepts: number;
  unlockedConcepts: number;
  lockedConcepts: number;
  percentComplete: number;
} {
  let mastered = 0;
  let unlocked = 0;
  let locked = 0;

  for (const concept of tree) {
    const isUnlocked = isConceptUnlocked(concept.id, tree, masteryData);
    const mastery = getConceptMastery(concept.id, concept.questionIds, masteryData);

    if (mastery >= MASTERY_THRESHOLD) {
      mastered++;
      unlocked++; // Mastered concepts are also unlocked
    } else if (isUnlocked) {
      unlocked++;
    } else {
      locked++;
    }
  }

  return {
    totalConcepts: tree.length,
    masteredConcepts: mastered,
    unlockedConcepts: unlocked,
    lockedConcepts: locked,
    percentComplete: tree.length > 0 ? (mastered / tree.length) * 100 : 0,
  };
}

/**
 * Question data needed for concept mapping
 */
export interface QuestionForMapping {
  id: string;
  concept: string;
  question: string;
  type: string;
  chapter: number;
}

/**
 * Populate concept tree with actual question IDs from the pool.
 * Uses the explicit `concept` field on each question.
 */
export function populateConceptQuestions(
  tree: ConceptTree,
  questions: QuestionForMapping[]
): ConceptTree {
  const populated = tree.map(c => ({ ...c, questionIds: [] as string[] }));

  for (const q of questions) {
    const concept = populated.find(c => c.id === q.concept);
    if (concept) {
      concept.questionIds.push(q.id);
    }
  }

  return populated;
}
