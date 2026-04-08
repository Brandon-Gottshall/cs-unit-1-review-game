/**
 * Template-based question generators for CS-1301 Review Game.
 *
 * Each generator uses a seeded PRNG so that the same seed always produces
 * the identical question (deterministic) while different seeds give variety.
 */

import type {
  CSQuestionType,
  CSUnifiedQuestion,
} from './cs-game-data';

// ---------------------------------------------------------------------------
// Seeded PRNG – mulberry32
// ---------------------------------------------------------------------------

function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Return a random integer in [min, max] (inclusive). */
function randInt(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

/** Pick a random element from an array. */
function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

/** Shuffle an array in-place (Fisher-Yates) using the given rng. */
function shuffle<T>(rng: () => number, arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Remove duplicates and the correct answer from a distractors list. */
function cleanDistractors(correct: string, candidates: string[]): string[] {
  const seen = new Set<string>();
  seen.add(correct);
  const result: string[] = [];
  for (const c of candidates) {
    if (!seen.has(c)) {
      seen.add(c);
      result.push(c);
    }
  }
  return result;
}

/** Wrap statements inside a full Java program. */
function wrapMain(className: string, body: string): string {
  return (
    `public class ${className} {\n` +
    `    public static void main(String[] args) {\n` +
    body
      .split('\n')
      .map((l) => `        ${l}`)
      .join('\n') +
    `\n    }\n}`
  );
}

// ---------------------------------------------------------------------------
// Generator interface
// ---------------------------------------------------------------------------

export interface QuestionGenerator {
  concept: string;
  type: CSQuestionType;
  generate: (seed: number) => CSUnifiedQuestion;
}

// ---------------------------------------------------------------------------
// 1. arithmetic-int  (predict_output) – Chapter 2, section 2.5
// ---------------------------------------------------------------------------

const arithmeticIntGenerator: QuestionGenerator = {
  concept: 'arithmetic-int',
  type: 'predict_output',
  generate(seed: number): CSUnifiedQuestion {
    const rng = mulberry32(seed);
    // Burn one value so the first useful draw is well-mixed
    rng();

    const a = randInt(rng, 1, 20);
    const b = randInt(rng, 1, 10);
    const c = randInt(rng, 2, 6);

    const correct = a + b * c; // * before +
    const leftToRight = (a + b) * c;
    const wrongPrecedence = a * b + c;
    const allAdd = a + b + c;

    const bodyLines = [
      `int x = ${a} + ${b} * ${c};`,
      `System.out.println(x);`,
    ];
    const code = wrapMain('Arithmetic', bodyLines.join('\n'));
    const correctStr = String(correct);
    const expectedOutput = correctStr + '\n';

    const distractors = cleanDistractors(correctStr, [
      String(leftToRight),
      String(wrongPrecedence),
      String(allAdd),
    ]);

    return {
      id: `gen-arithmetic-int-${seed}`,
      concept: 'arithmetic-int',
      chapter: 2,
      section: '2.5',
      type: 'predict_output',
      question: `What does this program print?\n\n\`\`\`java\n${code}\n\`\`\``,
      correctAnswer: correctStr,
      distractors,
      explanation: `In Java, * has higher precedence than +. So ${b} * ${c} = ${b * c} is evaluated first, then ${a} + ${b * c} = ${correct}.`,
      interactive: {
        outputData: {
          code,
          expectedOutput,
        },
      },
    };
  },
};

// ---------------------------------------------------------------------------
// 2. int-division-modulo  (predict_output) – Chapter 2, section 2.7
// ---------------------------------------------------------------------------

const intDivisionModuloGenerator: QuestionGenerator = {
  concept: 'int-division-modulo',
  type: 'predict_output',
  generate(seed: number): CSUnifiedQuestion {
    const rng = mulberry32(seed);
    rng();

    const a = randInt(rng, 10, 99);
    const b = randInt(rng, 2, 9);

    const divResult = Math.trunc(a / b);
    const modResult = a % b;
    const floatDiv = (a / b).toFixed(1);

    const bodyLines = [
      `System.out.println(${a} / ${b});`,
      `System.out.println(${a} % ${b});`,
    ];
    const code = wrapMain('DivMod', bodyLines.join('\n'));
    const correctStr = `${divResult}\n${modResult}`;
    const expectedOutput = correctStr + '\n';

    const distractors = cleanDistractors(correctStr, [
      `${floatDiv}\n${modResult}`,
      `${divResult}\n${b - modResult}`,
      `${divResult + 1}\n${modResult}`,
      `${floatDiv}\n${b - modResult}`,
    ]);

    return {
      id: `gen-int-division-modulo-${seed}`,
      concept: 'int-division-modulo',
      chapter: 2,
      section: '2.7',
      type: 'predict_output',
      question: `What does this program print?\n\n\`\`\`java\n${code}\n\`\`\``,
      correctAnswer: correctStr,
      distractors,
      explanation: `Java integer division truncates toward zero: ${a} / ${b} = ${divResult}. The remainder operator gives ${a} % ${b} = ${modResult} (since ${divResult} * ${b} + ${modResult} = ${a}).`,
      interactive: {
        outputData: {
          code,
          expectedOutput,
        },
      },
    };
  },
};

// ---------------------------------------------------------------------------
// 3. floating-point  (predict_output) – Chapter 2, section 2.6
// ---------------------------------------------------------------------------

const floatingPointGenerator: QuestionGenerator = {
  concept: 'floating-point',
  type: 'predict_output',
  generate(seed: number): CSUnifiedQuestion {
    const rng = mulberry32(seed);
    rng();

    // Decide variant: 0 = int division assigned to double, 1 = cast before division
    const variant = rng() < 0.5 ? 0 : 1;

    const a = randInt(rng, 3, 19);
    // Make sure b doesn't divide a evenly so the distinction matters
    let b = randInt(rng, 2, 9);
    while (a % b === 0) {
      b = randInt(rng, 2, 9);
    }

    const intDiv = Math.trunc(a / b);
    const floatDiv = a / b;

    let bodyLine: string;
    let correct: string;
    let wrongAnswer: string;
    let explanation: string;

    if (variant === 0) {
      // int / int -> assigned to double (truncated int result stored as double)
      bodyLine = `double result = ${a} / ${b};`;
      correct = intDiv + '.0';
      wrongAnswer = floatDiv.toString();
      // If wrongAnswer has too many decimals, truncate to a few
      if (wrongAnswer.length > 10) {
        wrongAnswer = floatDiv.toFixed(4);
      }
      explanation = `Both ${a} and ${b} are int literals, so ${a} / ${b} performs integer division = ${intDiv}. That int is then widened to double, giving ${intDiv}.0.`;
    } else {
      // explicit cast: (double) a / b  -> real floating-point division
      bodyLine = `double result = (double) ${a} / ${b};`;
      const fpResult = floatDiv;
      // Show enough precision but not too much
      correct = fpResult.toString();
      if (correct.length > 12) {
        // Use a rounded representation that Java would print
        correct = parseFloat(fpResult.toPrecision(15)).toString();
      }
      wrongAnswer = intDiv + '.0';
      explanation = `The cast (double) converts ${a} to ${a}.0 before dividing, so the division is floating-point: ${a}.0 / ${b} = ${correct}.`;
    }

    const bodyLines = [bodyLine, `System.out.println(result);`];
    const code = wrapMain('FloatDiv', bodyLines.join('\n'));
    const expectedOutput = correct + '\n';

    const distractors = cleanDistractors(correct, [
      wrongAnswer,
      String(a * b) + '.0',
      String(intDiv + 1) + '.0',
    ]);

    return {
      id: `gen-floating-point-${seed}`,
      concept: 'floating-point',
      chapter: 2,
      section: '2.6',
      type: 'predict_output',
      question: `What does this program print?\n\n\`\`\`java\n${code}\n\`\`\``,
      correctAnswer: correct,
      distractors,
      explanation,
      interactive: {
        outputData: {
          code,
          expectedOutput,
        },
      },
    };
  },
};

// ---------------------------------------------------------------------------
// 4. type-conversions  (predict_output) – Chapter 2, section 2.8
// ---------------------------------------------------------------------------

const typeConversionsGenerator: QuestionGenerator = {
  concept: 'type-conversions',
  type: 'predict_output',
  generate(seed: number): CSUnifiedQuestion {
    const rng = mulberry32(seed);
    rng();

    const variant = rng() < 0.5 ? 0 : 1;

    let bodyLine: string;
    let correct: string;
    let distractorCandidates: string[];
    let explanation: string;

    if (variant === 0) {
      // (int) double  – truncation
      const whole = randInt(rng, 1, 50);
      const frac = randInt(rng, 1, 9);
      const dblVal = parseFloat(`${whole}.${frac}`);
      const truncated = Math.trunc(dblVal);
      const rounded = Math.round(dblVal);

      bodyLine = `System.out.println((int) ${dblVal});`;
      correct = String(truncated);
      distractorCandidates = [
        String(rounded),
        String(truncated + 1),
        String(truncated - 1),
        String(dblVal),
      ];
      explanation = `Casting a double to int truncates (drops the decimal part without rounding): (int) ${dblVal} = ${truncated}.`;
    } else {
      // (double) int / int  – promotes first operand
      const a = randInt(rng, 3, 25);
      let b = randInt(rng, 2, 9);
      while (a % b === 0) {
        b = randInt(rng, 2, 9);
      }
      const fpResult = a / b;
      const intDiv = Math.trunc(a / b);

      bodyLine = `System.out.println((double) ${a} / ${b});`;
      let correctVal = fpResult.toString();
      if (correctVal.length > 12) {
        correctVal = parseFloat(fpResult.toPrecision(15)).toString();
      }
      correct = correctVal;
      distractorCandidates = [
        intDiv + '.0',
        String(intDiv),
        String(a * b) + '.0',
      ];
      explanation = `The cast (double) converts ${a} to ${a}.0, so the division is floating-point: ${a}.0 / ${b} = ${correct}.`;
    }

    const code = wrapMain('TypeCast', `${bodyLine}`);
    const expectedOutput = correct + '\n';

    const distractors = cleanDistractors(correct, distractorCandidates);

    return {
      id: `gen-type-conversions-${seed}`,
      concept: 'type-conversions',
      chapter: 2,
      section: '2.8',
      type: 'predict_output',
      question: `What does this program print?\n\n\`\`\`java\n${code}\n\`\`\``,
      correctAnswer: correct,
      distractors,
      explanation,
      interactive: {
        outputData: {
          code,
          expectedOutput,
        },
      },
    };
  },
};

// ---------------------------------------------------------------------------
// 5. math-methods  (predict_output) – Chapter 2, section 2.10
// ---------------------------------------------------------------------------

const mathMethodsGenerator: QuestionGenerator = {
  concept: 'math-methods',
  type: 'predict_output',
  generate(seed: number): CSUnifiedQuestion {
    const rng = mulberry32(seed);
    rng();

    const variant = randInt(rng, 0, 2); // 0=pow, 1=sqrt, 2=abs

    let bodyLine: string;
    let correct: string;
    let distractorCandidates: string[];
    let explanation: string;

    if (variant === 0) {
      // Math.pow – small base and exponent for clean results
      const base = randInt(rng, 2, 6);
      const exp = randInt(rng, 2, 4);
      const result = Math.pow(base, exp);
      // Math.pow returns double, Java prints with .0 for whole numbers
      correct = result % 1 === 0 ? result + '.0' : String(result);

      bodyLine = `System.out.println(Math.pow(${base}, ${exp}));`;
      distractorCandidates = [
        String(base * exp) + '.0',
        String(base + exp) + '.0',
        String(result + 1) + '.0',
        String(result - 1) + '.0',
      ];
      explanation = `Math.pow(${base}, ${exp}) computes ${base}^${exp} = ${result}. Math.pow returns a double, so Java prints ${correct}.`;
    } else if (variant === 1) {
      // Math.sqrt – use perfect squares
      const perfectSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144];
      const n = pick(rng, perfectSquares);
      const root = Math.sqrt(n);
      correct = root + '.0';

      bodyLine = `System.out.println(Math.sqrt(${n}));`;
      distractorCandidates = [
        String(n / 2) + '.0',
        String(root + 1) + '.0',
        String(root - 1) + '.0',
        String(root),
      ];
      explanation = `Math.sqrt(${n}) = ${root}.0. Math.sqrt returns a double, so the output includes the decimal.`;
    } else {
      // Math.abs – use negative values
      const val = -randInt(rng, 1, 50);
      const result = Math.abs(val);
      correct = String(result);

      bodyLine = `System.out.println(Math.abs(${val}));`;
      distractorCandidates = [
        String(val),
        String(-result),
        String(result + 1),
        String(result - 1),
      ];
      explanation = `Math.abs(${val}) returns the absolute value = ${result}. Since the argument is an int, the result is int (no .0).`;
    }

    const code = wrapMain('MathMethods', bodyLine);
    const expectedOutput = correct + '\n';

    const distractors = cleanDistractors(correct, distractorCandidates);

    return {
      id: `gen-math-methods-${seed}`,
      concept: 'math-methods',
      chapter: 2,
      section: '2.10',
      type: 'predict_output',
      question: `What does this program print?\n\n\`\`\`java\n${code}\n\`\`\``,
      correctAnswer: correct,
      distractors,
      explanation,
      interactive: {
        outputData: {
          code,
          expectedOutput,
        },
      },
    };
  },
};

// ---------------------------------------------------------------------------
// 6. variables-assignments  (trace_variables) – Chapter 2, section 2.1
// ---------------------------------------------------------------------------

const variablesAssignmentsGenerator: QuestionGenerator = {
  concept: 'variables-assignments',
  type: 'trace_variables',
  generate(seed: number): CSUnifiedQuestion {
    const rng = mulberry32(seed);
    rng();

    const a = randInt(rng, 1, 20);
    const b = randInt(rng, 1, 15);
    const c = randInt(rng, 1, 10);

    // int x = A;  -> x = A
    // int y = x + B;  -> y = A + B
    // x = y - C;  -> x = (A + B) - C

    const x0 = a;
    const y0 = x0 + b;
    const x1 = y0 - c;

    const codeLines = [
      `int x = ${a};`,
      `int y = x + ${b};`,
      `x = y - ${c};`,
      `System.out.println("x = " + x);`,
      `System.out.println("y = " + y);`,
    ];
    const code = wrapMain('VarTrace', codeLines.join('\n'));

    const correctStr = `x = ${x1}, y = ${y0}`;

    const distractors = cleanDistractors(correctStr, [
      `x = ${x0}, y = ${y0}`,
      `x = ${x1}, y = ${x1}`,
      `x = ${a - c}, y = ${a + b}`,
      `x = ${y0 - c + 1}, y = ${y0 + 1}`,
    ]);

    const steps = [
      `int x = ${a};  →  x = ${x0}`,
      `int y = x + ${b};  →  y = ${x0} + ${b} = ${y0}`,
      `x = y - ${c};  →  x = ${y0} - ${c} = ${x1}`,
    ];

    return {
      id: `gen-variables-assignments-${seed}`,
      concept: 'variables-assignments',
      chapter: 2,
      section: '2.1',
      type: 'trace_variables',
      question: `Trace the variables in this program. What are the final values of x and y?\n\n\`\`\`java\n${code}\n\`\`\``,
      correctAnswer: correctStr,
      distractors,
      explanation: `Step-by-step: ${steps.join(' | ')}. Final values: x = ${x1}, y = ${y0}.`,
      interactive: {
        variantData: {
          code,
          finalValues: { x: x1, y: y0 },
          steps,
        },
      },
    };
  },
};

// ---------------------------------------------------------------------------
// 7. binary  (vocabulary) – Chapter 2, section 2.11
// ---------------------------------------------------------------------------

/** Convert a non-negative integer to its binary string. */
function toBinary(n: number): string {
  if (n === 0) return '0';
  let bits = '';
  let v = n;
  while (v > 0) {
    bits = (v & 1) + bits;
    v >>>= 1;
  }
  return bits;
}

const binaryGenerator: QuestionGenerator = {
  concept: 'binary',
  type: 'vocabulary',
  generate(seed: number): CSUnifiedQuestion {
    const rng = mulberry32(seed);
    rng();

    const decimal = randInt(rng, 2, 63);
    const correct = toBinary(decimal);

    // Distractors: adjacent numbers' binary, reversed bits
    const reversed = correct.split('').reverse().join('');
    const distractorCandidates = [
      toBinary(decimal + 1),
      toBinary(decimal - 1),
      reversed,
      toBinary(decimal + 2),
    ];

    const distractors = cleanDistractors(correct, distractorCandidates);

    // Build breakdown explanation
    const breakdownParts: string[] = [];
    let remaining = decimal;
    let power = 1;
    while (power <= decimal) power <<= 1;
    power >>= 1;
    while (power >= 1) {
      if (remaining >= power) {
        breakdownParts.push(`${power}`);
        remaining -= power;
      }
      power >>= 1;
    }

    const explanation = `Decimal ${decimal} = ${breakdownParts.join(' + ')} in powers of 2 = ${correct} in binary.`;

    return {
      id: `gen-binary-${seed}`,
      concept: 'binary',
      chapter: 2,
      section: '2.11',
      type: 'vocabulary',
      question: `What is the binary representation of the decimal number ${decimal}?`,
      correctAnswer: correct,
      distractors,
      explanation,
    };
  },
};

// ---------------------------------------------------------------------------
// 8. chars-strings  (predict_output) – Chapter 2, section 2.12
// ---------------------------------------------------------------------------

const charsStringsGenerator: QuestionGenerator = {
  concept: 'chars-strings',
  type: 'predict_output',
  generate(seed: number): CSUnifiedQuestion {
    const rng = mulberry32(seed);
    rng();

    const a = randInt(rng, 1, 50);
    const b = randInt(rng, 1, 50);

    // "Value: " + A + B  ->  concatenation because left-to-right and first operand is String
    const correct = `Value: ${a}${b}`;
    const arithmeticResult = `Value: ${a + b}`;

    const bodyLine = `System.out.println("Value: " + ${a} + ${b});`;
    const code = wrapMain('StringConcat', bodyLine);
    const expectedOutput = correct + '\n';

    const distractors = cleanDistractors(correct, [
      arithmeticResult,
      `Value:${a}${b}`,
      `${a}${b}`,
      `Value: ${a + b}.0`,
    ]);

    return {
      id: `gen-chars-strings-${seed}`,
      concept: 'chars-strings',
      chapter: 2,
      section: '2.12',
      type: 'predict_output',
      question: `What does this program print?\n\n\`\`\`java\n${code}\n\`\`\``,
      correctAnswer: correct,
      distractors,
      explanation: `The + operator is evaluated left-to-right. "Value: " + ${a} produces the String "Value: ${a}" (string concatenation because the left operand is a String). Then "Value: ${a}" + ${b} also concatenates, producing "${correct}". The integers are never added arithmetically.`,
      interactive: {
        outputData: {
          code,
          expectedOutput,
        },
      },
    };
  },
};

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export const generators: QuestionGenerator[] = [
  arithmeticIntGenerator,
  intDivisionModuloGenerator,
  floatingPointGenerator,
  typeConversionsGenerator,
  mathMethodsGenerator,
  variablesAssignmentsGenerator,
  binaryGenerator,
  charsStringsGenerator,
];

/**
 * Try to generate a question for the given concept using a fresh seed.
 * Returns null if no generator exists for that concept.
 */
export function generateForConcept(
  concept: string,
  usedSeeds: Set<number>,
): CSUnifiedQuestion | null {
  const matching = generators.filter((g) => g.concept === concept);
  if (matching.length === 0) return null;

  // Pick a generator at random (using Math.random – this choice doesn't need to be deterministic)
  const gen = matching[Math.floor(Math.random() * matching.length)];

  // Try seeds until we find one that hasn't been used (max 100 attempts)
  for (let attempt = 0; attempt < 100; attempt++) {
    const seed = Math.floor(Math.random() * 2147483647);
    if (!usedSeeds.has(seed)) {
      usedSeeds.add(seed);
      return gen.generate(seed);
    }
  }

  // Extremely unlikely fallback – all 100 random seeds collided
  return null;
}
