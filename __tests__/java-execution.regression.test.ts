/**
 * Java Execution Validation Tests
 *
 * Validates that question data matches real Java execution output.
 * Catches LLM-generated answer errors that would teach students wrong things.
 *
 * Three categories:
 *  1. predict_output — wraps formula in main(), runs it, asserts stdout === correctAnswer
 *  2. trace_variables — wraps formula in main() with println for each traced var,
 *     asserts printed values match correctAnswer
 *  3. identify_error — wraps formula in main(), asserts compilation FAILS
 *
 * Requires `java` (11+) on PATH for single-file source-code launch.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, rmSync } from 'fs';
import path from 'path';
import { unifiedQuestionPool } from '@/lib/cs-game-data';

const JAVA_TMP = path.join('/tmp', 'cs1301-java-tests');

// Verify java is available before all tests
beforeAll(() => {
  try {
    execSync('java --version', { stdio: 'pipe' });
  } catch {
    throw new Error('java not found on PATH — these tests require JDK 11+');
  }
  // Clean and recreate temp dir
  rmSync(JAVA_TMP, { recursive: true, force: true });
  mkdirSync(JAVA_TMP, { recursive: true });
});

/**
 * Wrap bare Java statements in a compilable class + main method.
 * Handles both bare statements and code that already contains main().
 */
function wrapInMain(code: string, extraStatements: string = ''): string {
  const hasMain = /public\s+static\s+void\s+main/.test(code);
  const hasClass = /\bclass\s+\w+/.test(code);

  if (hasClass && hasMain) {
    // Already a full class — inject extra statements before closing braces
    if (extraStatements) {
      // Insert before the last closing brace of main
      return code.replace(
        /(\n?\s*}\s*}\s*)$/,
        `\n    ${extraStatements}\n$1`
      );
    }
    return code;
  }

  if (hasMain && !hasClass) {
    // Has main but no class wrapper
    return `public class Test {\n  ${code}\n${extraStatements ? '    ' + extraStatements + '\n' : ''}}`;
  }

  // Bare statements — wrap in class + main
  const indented = code.split('\n').map(l => '    ' + l).join('\n');
  const extra = extraStatements ? '\n    ' + extraStatements : '';
  return `public class Test {\n  public static void main(String[] args) {\n${indented}${extra}\n  }\n}`;
}

/**
 * Execute a Java source string and return { stdout, stderr, exitCode }.
 */
function runJava(source: string, id: string): { stdout: string; stderr: string; exitCode: number } {
  const filePath = path.join(JAVA_TMP, `Test_${id.replace(/[^a-zA-Z0-9]/g, '_')}.java`);
  writeFileSync(filePath, source);

  try {
    const stdout = execSync(`java "${filePath}" 2>&1`, {
      timeout: 10000,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return { stdout: stdout.trim(), stderr: '', exitCode: 0 };
  } catch (e: any) {
    return {
      stdout: (e.stdout || '').trim(),
      stderr: (e.stderr || '').trim(),
      exitCode: e.status || 1,
    };
  }
}

/**
 * Parse a trace_variables correctAnswer like "x = 15, y = 15" or "z = 15"
 * into a map of variable names to expected values.
 */
function parseTraceAnswer(answer: string): Map<string, string> {
  const result = new Map<string, string>();
  // Split on ", " but respect that values might contain commas (unlikely for primitives)
  const pairs = answer.split(/,\s*/);
  for (const pair of pairs) {
    const match = pair.match(/^(\w+)\s*=\s*(.+)$/);
    if (match) {
      result.set(match[1], match[2].trim());
    }
  }
  return result;
}

/**
 * Generate println statements that print each traced variable.
 * Uses the same format as correctAnswer: "varName = value"
 */
function generateTracePrintlns(vars: Map<string, string>): string {
  return [...vars.keys()]
    .map(v => `System.out.println("${v} = " + ${v});`)
    .join('\n    ');
}

// ═══════════════════════════════════════════════════════════════════════
// predict_output: run code, assert stdout matches correctAnswer
// ═══════════════════════════════════════════════════════════════════════
describe('predict_output: actual Java output matches correctAnswer', () => {
  const outputQuestions = unifiedQuestionPool.filter(q => q.type === 'predict_output');

  it.each(
    outputQuestions.map(q => [q.id, q])
  )('%s', (_id, q) => {
    const source = wrapInMain(q.formula!);
    const result = runJava(source, q.id);

    expect(result.exitCode, `Java execution failed for ${q.id}:\n${result.stderr || result.stdout}`).toBe(0);
    expect(result.stdout, `Output mismatch for ${q.id}:\nCode: ${q.formula}\nExpected: "${q.correctAnswer}"\nActual: "${result.stdout}"`).toBe(q.correctAnswer);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// trace_variables: run code with println appended, assert values match
// ═══════════════════════════════════════════════════════════════════════
describe('trace_variables: actual Java variable values match correctAnswer', () => {
  const traceQuestions = unifiedQuestionPool.filter(q => q.type === 'trace_variables');

  it.each(
    traceQuestions.map(q => [q.id, q])
  )('%s', (_id, q) => {
    const expectedVars = parseTraceAnswer(q.correctAnswer);
    expect(expectedVars.size, `Could not parse correctAnswer "${q.correctAnswer}" for ${q.id}`).toBeGreaterThan(0);

    const printlns = generateTracePrintlns(expectedVars);
    const source = wrapInMain(q.formula!, printlns);
    const result = runJava(source, q.id);

    expect(result.exitCode, `Java execution failed for ${q.id}:\n${result.stderr || result.stdout}`).toBe(0);

    // Parse actual output lines into a map
    const actualLines = result.stdout.split('\n');
    const actualVars = new Map<string, string>();
    for (const line of actualLines) {
      const match = line.match(/^(\w+)\s*=\s*(.+)$/);
      if (match) actualVars.set(match[1], match[2].trim());
    }

    // Compare each expected variable
    for (const [varName, expectedVal] of expectedVars) {
      const actualVal = actualVars.get(varName);
      expect(actualVal, `Variable "${varName}" not found in output for ${q.id}. Actual output: ${result.stdout}`).toBeDefined();

      // Numeric comparison to handle int/double format differences (e.g., "21.49" vs "21.490000000000002")
      const expectedNum = parseFloat(expectedVal);
      const actualNum = parseFloat(actualVal!);
      if (!isNaN(expectedNum) && !isNaN(actualNum)) {
        expect(actualNum, `${q.id}: ${varName} expected ${expectedVal} but got ${actualVal}`).toBeCloseTo(expectedNum, 2);
      } else {
        expect(actualVal, `${q.id}: ${varName} expected "${expectedVal}" but got "${actualVal}"`).toBe(expectedVal);
      }
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════
// identify_error: code should FAIL to compile
// ═══════════════════════════════════════════════════════════════════════
describe('identify_error: code should fail to compile', () => {
  const errorQuestions = unifiedQuestionPool.filter(q => q.type === 'identify_error');

  it.each(
    errorQuestions.map(q => [q.id, q])
  )('%s', (_id, q) => {
    const source = wrapInMain(q.formula!);
    const result = runJava(source, q.id);

    expect(
      result.exitCode,
      `${q.id}: Expected compilation failure but code ran successfully!\nCode: ${q.formula}\nOutput: ${result.stdout}`
    ).not.toBe(0);
  });
});
