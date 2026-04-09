/**
 * REGRESSION TEST: Chevrotain Parser
 *
 * Guards against the #1 agent-generated failure mode:
 * grammar ambiguities that crash at import time.
 *
 * Also smoke-tests parse correctness for Ch 1-2 Java patterns.
 */
import { describe, it, expect } from 'vitest';
import { parseJava, hasSyntaxErrors } from '../lib/java-parser';

// ─── Test 1: Parser initializes without throwing ─────────────
// This is the single most important test. Chevrotain's performSelfAnalysis()
// throws on grammar ambiguities (AMBIGUOUS_ALTERNATIVES), which killed our
// first build. If this test passes, the grammar is internally consistent.
describe('Parser initialization', () => {
  it('imports without throwing (no grammar ambiguities)', () => {
    // The import above already ran performSelfAnalysis().
    // If we got here, it didn't throw. But let's be explicit:
    expect(() => parseJava('int x = 1;', 'statements')).not.toThrow();
  });

  it('handles both parse modes', () => {
    expect(() => parseJava('int x = 1;', 'statements')).not.toThrow();
    expect(() =>
      parseJava('public class Main { public static void main(String[] args) { } }', 'full')
    ).not.toThrow();
  });
});

// ─── Test 2: Parse correctness for Ch 1-2 patterns ──────────
// These are the Java constructs students actually write in Ch 1-2.
// If an agent changes the grammar, these catch silent breakage.
describe('Ch 1-2 Java patterns parse correctly', () => {
  const validStatements = [
    ['variable declaration', 'int x = 5;'],
    ['double declaration', 'double pi = 3.14;'],
    ['string declaration', 'String name = "Alice";'],
    ['char declaration', 'char letter = \'A\';'],
    ['boolean declaration', 'boolean flag = true;'],
    ['final constant', 'final int MAX = 100;'],
    ['compound assignment', 'int x = 5;\nx += 10;'],
    ['increment', 'int x = 0;\nx++;'],
    ['decrement', 'int y = 1;\ny--;'],
    ['println', 'System.out.println("hello");'],
    ['print', 'System.out.print(42);'],
    ['println expression', 'System.out.println(2 + 3);'],
    ['println concatenation', 'System.out.println("val=" + 5);'],
    ['type cast', 'int y = (int) 3.7;'],
    ['math method', 'double r = Math.pow(2, 3);'],
    ['multiple statements', 'int a = 1;\nint b = 2;\nint c = a + b;'],
    ['nested parens', 'int a = 1;\nint b = 2;\nint c = 3;\nint d = 4;\nint z = (a + b) * (c - d);'],
  ] as const;

  for (const [label, code] of validStatements) {
    it(`parses: ${label}`, () => {
      const result = parseJava(code, 'statements');
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  }

  // Full class with main method
  it('parses complete Hello World class', () => {
    const code = `public class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`;
    const result = parseJava(code, 'full');
    expect(result.success).toBe(true);
  });

  it('parses class with variable declarations', () => {
    const code = `public class Vars {
  public static void main(String[] args) {
    int x = 10;
    double y = 3.14;
    String name = "Java";
    System.out.println(x);
    System.out.println(y);
    System.out.println(name);
  }
}`;
    const result = parseJava(code, 'full');
    expect(result.success).toBe(true);
  });
});

// ─── Test 2b: Ch 3-4 patterns (branches, loops, switch, ternary) ─
describe('Ch 3-4 Java patterns parse correctly', () => {
  const validStatements = [
    ['if statement', 'int x = 5;\nif (x > 0) { System.out.println("pos"); }'],
    ['if-else', 'int x = 5;\nif (x > 0) { System.out.println("pos"); } else { System.out.println("np"); }'],
    ['if-else-if-else', 'int x = 0;\nif (x > 0) { System.out.println("p"); } else if (x < 0) { System.out.println("n"); } else { System.out.println("z"); }'],
    ['logical and/or/not', 'int x = 5;\nif (x > 0 && x < 10 || !(x == 0)) { System.out.println(x); }'],
    ['ternary', 'int x = 5;\nint y = (x > 0) ? 1 : -1;'],
    ['nested ternary', 'int x = 5;\nint y = x > 0 ? 1 : x < 0 ? -1 : 0;'],
    ['while loop', 'int i = 0;\nwhile (i < 10) { i++; }'],
    ['for loop', 'for (int i = 0; i < 10; i++) { System.out.println(i); }'],
    ['for with multiple updates', 'for (int i = 0, j = 10; i < j; i++, j--) { System.out.println(i); }'],
    ['nested for', 'for (int i = 0; i < 3; i++) { for (int j = 0; j < 3; j++) { System.out.println(i + j); } }'],
    ['break in loop', 'int i = 0;\nwhile (true) { if (i > 5) { break; } i++; }'],
    ['continue in loop', 'for (int i = 0; i < 10; i++) { if (i == 5) { continue; } System.out.println(i); }'],
    ['switch with fallthrough', 'int x = 1;\nswitch (x) { case 1: case 2: System.out.println("a"); break; default: System.out.println("d"); }'],
    ['string charAt', 'String s = "hi";\nchar c = s.charAt(0);'],
    ['string substring', 'String s = "hello";\nString t = s.substring(0, 3);'],
    ['string equals', 'String a = "x";\nString b = "y";\nif (a.equals(b)) { System.out.println("eq"); }'],
  ] as const;

  for (const [label, code] of validStatements) {
    it(`parses: ${label}`, () => {
      const result = parseJava(code, 'statements');
      expect(result.success, `errors: ${JSON.stringify(result.errors)}`).toBe(true);
    });
  }
});

// ─── Test 3: Error detection works ───────────────────────────
// The parser's diagnostic value depends on catching real errors.
describe('Error detection', () => {
  it('detects missing semicolon', () => {
    const result = parseJava('int x = 5', 'statements');
    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('detects undeclared variable (semantic)', () => {
    const result = parseJava('System.out.println(undeclaredVar);', 'statements');
    // Semantic analysis should flag undeclaredVar
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('hasSyntaxErrors returns boolean correctly', () => {
    expect(hasSyntaxErrors('int x = 5;', 'statements')).toBe(false);
    expect(hasSyntaxErrors('int x = ', 'statements')).toBe(true);
  });
});
