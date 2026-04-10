/**
 * Template-based question generators for CS-1301 Review Game.
 *
 * Each generator uses a seeded PRNG so that the same seed always produces
 * the identical question (deterministic) while different seeds give variety.
 */

import {
  cleanDistractors,
  generateForConcept as generateQuestionForConcept,
  mulberry32,
  pick,
  randInt,
  type Generator,
} from '@brandon-gottshall/review-game-core';
import type { CSUnifiedQuestion } from './cs-game-data';

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

export type QuestionGenerator = Generator<CSUnifiedQuestion>;

// ---------------------------------------------------------------------------
// 1. arithmetic-int  (predict_output) – Chapter 2, section 2.5
// ---------------------------------------------------------------------------

const arithmeticIntGenerator: QuestionGenerator = {
  id: 'arithmetic-int',
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
  id: 'int-division-modulo',
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
  id: 'floating-point',
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
  id: 'type-conversions',
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
  id: 'math-methods',
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
  id: 'variables-assignments',
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
  id: 'binary',
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
  id: 'chars-strings',
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
// 9. equality-ops  (predict_output) – Chapter 3, section 3.1
// ---------------------------------------------------------------------------

const branchEqualGenerator: QuestionGenerator = {
  id: 'equality-ops',
  concept: 'equality-ops',
  type: 'predict_output',
  generate(seed: number): CSUnifiedQuestion {
    const rng = mulberry32(seed);
    rng();

    type Variant = 'int-equal' | 'int-not-equal' | 'char-equal';
    const variant: Variant = pick(rng, ['int-equal', 'int-not-equal', 'char-equal'] as const);

    let code: string;
    let correct: string;

    if (variant === 'int-equal') {
      const a = randInt(rng, 1, 9);
      const b = a; // always equal so branch fires
      code = wrapMain('BranchEqual', `int a = ${a};\nint b = ${b};\nif (a == b) {\n    System.out.println("equal");\n} else {\n    System.out.println("not equal");\n}`);
      correct = 'equal';
    } else if (variant === 'int-not-equal') {
      const a = randInt(rng, 1, 9);
      const b = a + randInt(rng, 1, 5);
      code = wrapMain('BranchEqual', `int a = ${a};\nint b = ${b};\nif (a == b) {\n    System.out.println("equal");\n} else {\n    System.out.println("not equal");\n}`);
      correct = 'not equal';
    } else {
      const chars = ['A', 'B', 'C', 'Z'] as const;
      const ch = pick(rng, chars);
      const same = rng() > 0.5;
      const ch2 = same ? ch : pick(rng, chars.filter(c => c !== ch));
      code = wrapMain('BranchChar', `char c1 = '${ch}';\nchar c2 = '${ch2}';\nif (c1 == c2) {\n    System.out.println("match");\n} else {\n    System.out.println("no match");\n}`);
      correct = same ? 'match' : 'no match';
    }

    const wrong = correct === 'equal' ? 'not equal' : correct === 'not equal' ? 'equal' : correct === 'match' ? 'no match' : 'match';
    return {
      id: `gen-equality-ops-${seed}`,
      concept: 'equality-ops',
      chapter: 3,
      type: 'predict_output',
      question: `What does this program print?\n\n\`\`\`java\n${code}\n\`\`\``,
      correctAnswer: correct,
      distractors: cleanDistractors(correct, [wrong, 'true', 'false']),
      explanation: `The == operator compares primitive values directly. The condition evaluates to ${correct === 'equal' || correct === 'match' ? 'true' : 'false'}, so the corresponding branch executes.`,
      interactive: { outputData: { code, expectedOutput: correct + '\n' } },
    };
  },
};

// ---------------------------------------------------------------------------
// 10. range-comparisons  (predict_output) – Chapter 3, section 3.2
// ---------------------------------------------------------------------------

const branchRangeGenerator: QuestionGenerator = {
  id: 'range-comparisons',
  concept: 'range-comparisons',
  type: 'predict_output',
  generate(seed: number): CSUnifiedQuestion {
    const rng = mulberry32(seed);
    rng();

    const lo = randInt(rng, 1, 10);
    const hi = lo + randInt(rng, 5, 15);
    const offset = randInt(rng, -2, hi - lo + 2);
    const x = lo + offset;
    const inside = x >= lo && x <= hi;
    const code = wrapMain('RangeCheck',
      `int x = ${x};\nif (x >= ${lo} && x <= ${hi}) {\n    System.out.println("in range");\n} else {\n    System.out.println("out of range");\n}`);
    const correct = inside ? 'in range' : 'out of range';

    return {
      id: `gen-range-comparisons-${seed}`,
      concept: 'range-comparisons',
      chapter: 3,
      type: 'predict_output',
      question: `What does this program print?\n\n\`\`\`java\n${code}\n\`\`\``,
      correctAnswer: correct,
      distractors: cleanDistractors(correct, ['in range', 'out of range', 'true', 'false']),
      explanation: `x = ${x}. The condition x >= ${lo} is ${x >= lo} and x <= ${hi} is ${x <= hi}. Both must be true (&&) for "in range". Result: ${correct}.`,
      interactive: { outputData: { code, expectedOutput: correct + '\n' } },
    };
  },
};

// ---------------------------------------------------------------------------
// 11. logical-and-or-not  (predict_output) – Chapter 3, section 3.3
// ---------------------------------------------------------------------------

const logicalOpsGenerator: QuestionGenerator = {
  id: 'logical-and-or-not',
  concept: 'logical-and-or-not',
  type: 'predict_output',
  generate(seed: number): CSUnifiedQuestion {
    const rng = mulberry32(seed);
    rng();

    type Op = '&&' | '||' | '!';
    const op: Op = pick(rng, ['&&', '||', '!'] as const);
    let code: string;
    let correct: string;

    if (op === '!') {
      const b = rng() > 0.5;
      code = wrapMain('LogicalNot', `boolean b = ${b};\nSystem.out.println(!b);`);
      correct = String(!b);
    } else {
      const a = rng() > 0.5;
      const b = rng() > 0.5;
      const result = op === '&&' ? (a && b) : (a || b);
      code = wrapMain('LogicalOp', `boolean a = ${a};\nboolean b = ${b};\nSystem.out.println(a ${op} b);`);
      correct = String(result);
    }

    return {
      id: `gen-logical-and-or-not-${seed}`,
      concept: 'logical-and-or-not',
      chapter: 3,
      type: 'predict_output',
      question: `What does this program print?\n\n\`\`\`java\n${code}\n\`\`\``,
      correctAnswer: correct,
      distractors: cleanDistractors(correct, ['true', 'false', '1', '0']),
      explanation: `Evaluating the logical expression produces ${correct}.`,
      interactive: { outputData: { code, expectedOutput: correct + '\n' } },
    };
  },
};

// ---------------------------------------------------------------------------
// 12. while-loop  (trace_variables) – Chapter 4, section 4.2
// ---------------------------------------------------------------------------

const whileLoopGenerator: QuestionGenerator = {
  id: 'while-loop',
  concept: 'while-loop',
  type: 'trace_variables',
  generate(seed: number): CSUnifiedQuestion {
    const rng = mulberry32(seed);
    rng();

    const start = randInt(rng, 0, 3);
    const limit = start + randInt(rng, 3, 6);
    const step = randInt(rng, 1, 3);

    // Compute final values
    let i = start;
    let sum = 0;
    while (i < limit) {
      sum += i;
      i += step;
    }

    const code = wrapMain('WhileTrace',
      `int i = ${start};\nint sum = 0;\nwhile (i < ${limit}) {\n    sum += i;\n    i += ${step};\n}\nSystem.out.println("i=" + i + " sum=" + sum);`);
    const correct = `i=${i} sum=${sum}`;

    return {
      id: `gen-while-loop-${seed}`,
      concept: 'while-loop',
      chapter: 4,
      type: 'trace_variables',
      question: `Trace the loop and determine the final values of \`i\` and \`sum\`:\n\n\`\`\`java\nint i = ${start};\nint sum = 0;\nwhile (i < ${limit}) {\n    sum += i;\n    i += ${step};\n}\n\`\`\``,
      correctAnswer: correct,
      distractors: cleanDistractors(correct, [
        `i=${i - step} sum=${sum - (i - step)}`,
        `i=${limit} sum=${sum + 1}`,
        `i=${i} sum=${sum - step}`,
      ]),
      explanation: `The loop runs while i < ${limit}, starting at ${start} and incrementing by ${step} each iteration. After the loop: i = ${i}, sum = ${sum}.`,
      interactive: {
        outputData: { code, expectedOutput: correct + '\n' },
        variantData: { code, finalValues: { i, sum }, steps: [`i starts at ${start}`, `loop runs until i >= ${limit}`, `final: i=${i}, sum=${sum}`] },
      },
    };
  },
};

// ---------------------------------------------------------------------------
// 13. for-loop  (predict_output) – Chapter 4, section 4.3
// ---------------------------------------------------------------------------

const forLoopGenerator: QuestionGenerator = {
  id: 'for-loop',
  concept: 'for-loop',
  type: 'predict_output',
  generate(seed: number): CSUnifiedQuestion {
    const rng = mulberry32(seed);
    rng();

    const start = randInt(rng, 0, 3);
    const limit = start + randInt(rng, 3, 6);
    // Accumulate sum of i
    let total = 0;
    for (let i = start; i < limit; i++) total += i;

    const code = wrapMain('ForLoop',
      `int total = 0;\nfor (int i = ${start}; i < ${limit}; i++) {\n    total += i;\n}\nSystem.out.println(total);`);
    const correct = String(total);

    return {
      id: `gen-for-loop-${seed}`,
      concept: 'for-loop',
      chapter: 4,
      type: 'predict_output',
      question: `What does this program print?\n\n\`\`\`java\n${code}\n\`\`\``,
      correctAnswer: correct,
      distractors: cleanDistractors(correct, [
        String(total + 1),
        String(total - 1),
        String(limit - start),
        String(total * 2),
      ]),
      explanation: `The loop sums i from ${start} to ${limit - 1} (inclusive). Total = ${total}.`,
      interactive: { outputData: { code, expectedOutput: correct + '\n' } },
    };
  },
};

// ---------------------------------------------------------------------------
// 14. nested-loops  (predict_output) – Chapter 4, section 4.4
// ---------------------------------------------------------------------------

const nestedLoopsGenerator: QuestionGenerator = {
  id: 'nested-loops',
  concept: 'nested-loops',
  type: 'predict_output',
  generate(seed: number): CSUnifiedQuestion {
    const rng = mulberry32(seed);
    rng();

    const rows = randInt(rng, 2, 4);
    const cols = randInt(rng, 2, 4);

    // Count total inner iterations
    const total = rows * cols;
    const code = wrapMain('NestedLoop',
      `int count = 0;\nfor (int i = 0; i < ${rows}; i++) {\n    for (int j = 0; j < ${cols}; j++) {\n        count++;\n    }\n}\nSystem.out.println(count);`);
    const correct = String(total);

    return {
      id: `gen-nested-loops-${seed}`,
      concept: 'nested-loops',
      chapter: 4,
      type: 'predict_output',
      question: `What does this program print?\n\n\`\`\`java\n${code}\n\`\`\``,
      correctAnswer: correct,
      distractors: cleanDistractors(correct, [
        String(rows + cols),
        String(rows),
        String(cols),
        String(total + 1),
      ]),
      explanation: `The outer loop runs ${rows} times. For each outer iteration, the inner loop runs ${cols} times. Total increments: ${rows} × ${cols} = ${total}.`,
      interactive: { outputData: { code, expectedOutput: correct + '\n' } },
    };
  },
};

// ---------------------------------------------------------------------------
// 15. loops-strings  (predict_output) – Chapter 4, section 4.6
// ---------------------------------------------------------------------------

const stringIterationGenerator: QuestionGenerator = {
  id: 'loops-strings',
  concept: 'loops-strings',
  type: 'predict_output',
  generate(seed: number): CSUnifiedQuestion {
    const rng = mulberry32(seed);
    rng();

    const words = ['hello', 'java', 'loop', 'code', 'world'] as const;
    const word = pick(rng, words);
    const targetChar = word[randInt(rng, 0, word.length - 1)]!;
    let count = 0;
    for (let i = 0; i < word.length; i++) {
      if (word[i] === targetChar) count++;
    }

    const code = wrapMain('StringLoop',
      `String s = "${word}";\nint count = 0;\nfor (int i = 0; i < s.length(); i++) {\n    if (s.charAt(i) == '${targetChar}') {\n        count++;\n    }\n}\nSystem.out.println(count);`);
    const correct = String(count);

    return {
      id: `gen-loops-strings-${seed}`,
      concept: 'loops-strings',
      chapter: 4,
      type: 'predict_output',
      question: `What does this program print?\n\n\`\`\`java\n${code}\n\`\`\``,
      correctAnswer: correct,
      distractors: cleanDistractors(correct, [
        String(word.length),
        String(count + 1),
        String(count > 0 ? count - 1 : 1),
        '0',
      ]),
      explanation: `The loop scans every character of "${word}" and counts occurrences of '${targetChar}'. There ${count === 1 ? 'is' : 'are'} ${count} occurrence${count === 1 ? '' : 's'}.`,
      interactive: { outputData: { code, expectedOutput: correct + '\n' } },
    };
  },
};

// ---------------------------------------------------------------------------
// 16. switch-statement  (predict_output) – Chapter 3, section 3.6
// ---------------------------------------------------------------------------

const switchStatementGenerator: QuestionGenerator = {
  id: 'switch-statement',
  concept: 'switch-statement',
  type: 'predict_output',
  generate(seed: number): CSUnifiedQuestion {
    const rng = mulberry32(seed);
    rng();

    const val = randInt(rng, 1, 4);
    const hasFallthrough = rng() > 0.6;

    let code: string;
    let correct: string;

    if (hasFallthrough && val <= 2) {
      // val 1 falls through to val 2
      code = wrapMain('SwitchFall',
        `int x = ${val};\nswitch (x) {\n    case 1:\n    case 2:\n        System.out.println("low");\n        break;\n    case 3:\n        System.out.println("mid");\n        break;\n    default:\n        System.out.println("other");\n}`);
      correct = val <= 2 ? 'low' : val === 3 ? 'mid' : 'other';
    } else {
      code = wrapMain('SwitchBasic',
        `int x = ${val};\nswitch (x) {\n    case 1:\n        System.out.println("one");\n        break;\n    case 2:\n        System.out.println("two");\n        break;\n    case 3:\n        System.out.println("three");\n        break;\n    default:\n        System.out.println("other");\n}`);
      correct = val === 1 ? 'one' : val === 2 ? 'two' : val === 3 ? 'three' : 'other';
    }

    return {
      id: `gen-switch-statement-${seed}`,
      concept: 'switch-statement',
      chapter: 3,
      type: 'predict_output',
      question: `What does this program print?\n\n\`\`\`java\n${code}\n\`\`\``,
      correctAnswer: correct,
      distractors: cleanDistractors(correct, ['one', 'two', 'three', 'low', 'mid', 'other'].filter(s => s !== correct)),
      explanation: `x = ${val}. The switch matches case ${val <= 2 && hasFallthrough ? '1/2 (fallthrough)' : val}, printing "${correct}".`,
      interactive: { outputData: { code, expectedOutput: correct + '\n' } },
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
  // Ch3-4 generators
  branchEqualGenerator,
  branchRangeGenerator,
  logicalOpsGenerator,
  whileLoopGenerator,
  forLoopGenerator,
  nestedLoopsGenerator,
  stringIterationGenerator,
  switchStatementGenerator,
];

/**
 * Try to generate a question for the given concept using a fresh seed.
 * Returns null if no generator exists for that concept.
 */
export function generateForConcept(
  concept: string,
  usedSeeds: Set<number>,
): CSUnifiedQuestion | null {
  return generateQuestionForConcept(concept, generators, usedSeeds);
}
