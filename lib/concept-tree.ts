/**
 * CS-1301 Concept Tree - Skill tree style progression system
 *
 * Concepts are organized as nodes with prerequisites.
 * Mastering prerequisites unlocks new concepts.
 * Questions are mapped to concepts by their generated IDs.
 *
 * Structure covers Introduction to Java through loops (Chapters 1-4).
 */

import {
  MASTERY_THRESHOLD,
  calculateTreeProgress,
  getConceptMastery,
  getMasteredConcepts,
  getNextUnlockedConcepts,
  getUnlockedQuestionIds,
  isConceptUnlocked,
  populateConceptQuestions,
  type ConceptNode,
  type ConceptTree,
  type MasteryData,
  type QuestionForMapping,
} from '@brandon-gottshall/review-game-core';

export type {
  ConceptNode,
  ConceptTree,
  MasteryData,
  QuestionForMapping,
};
export {
  MASTERY_THRESHOLD,
  calculateTreeProgress,
  getConceptMastery,
  getMasteredConcepts,
  getNextUnlockedConcepts,
  getUnlockedQuestionIds,
  isConceptUnlocked,
  populateConceptQuestions,
};

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

  // ======================================================
  // === CHAPTER 3: BRANCHES ==============================
  // ======================================================

  // === TIER 9A: Branch foundations (y≈105) ===
  {
    id: 'boolean-type',
    name: 'Boolean Type',
    description: 'boolean variables, true/false literals, boolean expressions as conditions',
    prerequisites: ['variables-assignments'],
    questionIds: [],
    chapter: 3,
    x: 65,
    y: 103,
  },
  {
    id: 'if-else',
    name: 'If / Else',
    description: 'if, else-if, else syntax; conditional execution; one-way and two-way branches',
    prerequisites: ['arithmetic-int', 'boolean-type'],
    questionIds: [],
    chapter: 3,
    x: 20,
    y: 105,
  },
  {
    id: 'equality-ops',
    name: 'Equality Operators',
    description: '== and != for int, char, boolean; distinguishing assignment (=) from equality (==)',
    prerequisites: ['arithmetic-int'],
    questionIds: [],
    chapter: 3,
    x: 42,
    y: 105,
  },
  {
    id: 'floating-point-eq',
    name: 'Floating-Point Equality',
    description: 'Why == is unreliable for doubles; epsilon comparison; Math.abs(a-b) < eps pattern',
    prerequisites: ['floating-point', 'if-else'],
    questionIds: [],
    chapter: 3,
    x: 85,
    y: 105,
  },

  // === TIER 9B: Relational + logical (y≈118) ===
  {
    id: 'range-comparisons',
    name: 'Range Comparisons',
    description: '<, >, <=, >= operators; checking membership in a numeric range',
    prerequisites: ['if-else', 'equality-ops'],
    questionIds: [],
    chapter: 3,
    x: 12,
    y: 118,
  },
  {
    id: 'logical-and-or-not',
    name: 'Logical Operators',
    description: '&&, ||, ! operators; truth tables; compound boolean expressions',
    prerequisites: ['if-else', 'boolean-type'],
    questionIds: [],
    chapter: 3,
    x: 38,
    y: 118,
  },
  {
    id: 'switch-statement',
    name: 'Switch Statement',
    description: 'switch/case/default syntax; fall-through; break to exit; comparing to if-else chains',
    prerequisites: ['if-else', 'equality-ops'],
    questionIds: [],
    chapter: 3,
    x: 62,
    y: 118,
  },
  {
    id: 'string-equals',
    name: 'String Equality',
    description: '.equals() and .equalsIgnoreCase() vs == for Strings; why reference equality fails',
    prerequisites: ['if-else', 'chars-strings'],
    questionIds: [],
    chapter: 3,
    x: 85,
    y: 118,
  },

  // === TIER 9C: Advanced branches + string access (y≈131) ===
  {
    id: 'nested-branches',
    name: 'Nested Branches',
    description: 'if inside if; dangling-else rule; indentation conventions; multi-way decisions',
    prerequisites: ['logical-and-or-not', 'range-comparisons'],
    questionIds: [],
    chapter: 3,
    x: 12,
    y: 131,
  },
  {
    id: 'short-circuit',
    name: 'Short-Circuit Evaluation',
    description: '&& stops at first false; || stops at first true; use for null/index safety guards',
    prerequisites: ['logical-and-or-not'],
    questionIds: [],
    chapter: 3,
    x: 35,
    y: 131,
  },
  {
    id: 'ternary',
    name: 'Ternary Operator',
    description: 'condition ? valueIfTrue : valueIfFalse; inline assignments; readability tradeoffs',
    prerequisites: ['if-else'],
    questionIds: [],
    chapter: 3,
    x: 57,
    y: 131,
  },
  {
    id: 'string-access',
    name: 'String Access Methods',
    description: '.charAt(i), .indexOf(c), .length(); iterating over characters; bounds checking',
    prerequisites: ['string-equals', 'chars-strings'],
    questionIds: [],
    chapter: 3,
    x: 76,
    y: 131,
  },

  // === String tier (y≈143) ===
  {
    id: 'string-ops',
    name: 'String Operations',
    description: '.substring(start, end), .toUpperCase(), .toLowerCase(), .trim(), .replace(); string concatenation patterns',
    prerequisites: ['string-access'],
    questionIds: [],
    chapter: 3,
    x: 76,
    y: 143,
  },
  {
    id: 'character-methods',
    name: 'Character Methods',
    description: 'Character.isDigit(), Character.isLetter(), Character.isUpperCase(), Character.toLowerCase(); char ↔ int arithmetic',
    prerequisites: ['string-access'],
    questionIds: [],
    chapter: 3,
    x: 90,
    y: 143,
  },

  // ======================================================
  // === CHAPTER 4: LOOPS =================================
  // ======================================================

  // === TIER 10A: Loop foundations (y≈148) ===
  {
    id: 'while-loop',
    name: 'While Loop',
    description: 'while syntax; loop condition; update step; infinite loops; sentinel-controlled loops',
    prerequisites: ['if-else', 'arithmetic-int'],
    questionIds: [],
    chapter: 4,
    x: 15,
    y: 148,
  },
  {
    id: 'for-loop',
    name: 'For Loop',
    description: 'for(init; condition; update) syntax; counting loops; loop variable scope; comparing while vs for',
    prerequisites: ['if-else', 'arithmetic-int'],
    questionIds: [],
    chapter: 4,
    x: 38,
    y: 148,
  },
  {
    id: 'variable-scope',
    name: 'Variable Scope',
    description: 'Block scope; loop variable not accessible after loop; shadowing; declaring outside vs inside loop',
    prerequisites: ['if-else', 'variables-assignments'],
    questionIds: [],
    chapter: 4,
    x: 60,
    y: 148,
  },

  // === TIER 10B: Intermediate loops (y≈160) ===
  {
    id: 'loop-patterns',
    name: 'Loop Patterns',
    description: 'Accumulator, counter, max/min, running total; input-validation loop; do-while concept',
    prerequisites: ['while-loop', 'for-loop'],
    questionIds: [],
    chapter: 4,
    x: 15,
    y: 160,
  },
  {
    id: 'break-continue',
    name: 'Break & Continue',
    description: 'break exits loop immediately; continue skips to next iteration; labeled break for nested loops',
    prerequisites: ['while-loop', 'for-loop'],
    questionIds: [],
    chapter: 4,
    x: 38,
    y: 160,
  },
  {
    id: 'nested-loops',
    name: 'Nested Loops',
    description: 'Loop inside a loop; outer × inner iterations; triangle/rectangle patterns; multiplication table',
    prerequisites: ['for-loop', 'loop-patterns'],
    questionIds: [],
    chapter: 4,
    x: 60,
    y: 160,
  },
  {
    id: 'loops-strings',
    name: 'Loops with Strings',
    description: 'Iterating over characters with .charAt(i) and .length(); building strings in a loop; counting/searching',
    prerequisites: ['for-loop', 'string-access'],
    questionIds: [],
    chapter: 4,
    x: 80,
    y: 160,
  },

  // === TIER 11: Practice / applications (y≈172) ===
  {
    id: 'incremental-dev',
    name: 'Incremental Development',
    description: 'Coding in small verifiable steps; stub and expand; using output to verify intermediate results',
    prerequisites: ['loop-patterns'],
    questionIds: [],
    chapter: 4,
    x: 8,
    y: 172,
  },
  {
    id: 'domain-validation',
    name: 'Domain Validation',
    description: 'Validating user input ranges; re-prompting loops; combining range checks with logical operators',
    prerequisites: ['nested-branches', 'while-loop'],
    questionIds: [],
    chapter: 4,
    x: 24,
    y: 172,
  },
  {
    id: 'salary-loops',
    name: 'Running Totals',
    description: 'Accumulating values across loop iterations; average calculation; sum-of-series patterns',
    prerequisites: ['loop-patterns'],
    questionIds: [],
    chapter: 4,
    x: 40,
    y: 172,
  },
  {
    id: 'date-validation',
    name: 'Multi-Condition Validation',
    description: 'Validating compound conditions (month, day, leap year); combining boolean logic with branching',
    prerequisites: ['nested-branches', 'domain-validation'],
    questionIds: [],
    chapter: 4,
    x: 55,
    y: 172,
  },
  {
    id: 'unit-testing-branches',
    name: 'Testing Branches',
    description: 'Choosing test values to cover each branch; equivalence classes; boundary values (just inside/outside)',
    prerequisites: ['nested-branches'],
    questionIds: [],
    chapter: 4,
    x: 69,
    y: 172,
  },
  {
    id: 'gcd-euclid',
    name: "Euclid's GCD Algorithm",
    description: "Euclid's algorithm; while(b != 0) { r = a%b; a=b; b=r; }; tracing loop iterations",
    prerequisites: ['while-loop', 'int-division-modulo'],
    questionIds: [],
    chapter: 4,
    x: 82,
    y: 172,
  },
  {
    id: 'javadoc',
    name: 'Javadoc Comments',
    description: '/** */ format; @param, @return tags; generating HTML docs; documentation best practices',
    prerequisites: ['write-programs'],
    questionIds: [],
    chapter: 4,
    x: 93,
    y: 172,
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
