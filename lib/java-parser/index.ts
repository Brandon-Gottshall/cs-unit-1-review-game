/**
 * Java Parser — Public API
 *
 * Parses a subset of Java (Ch 1-2 scope) and returns diagnostic errors
 * with educational hints. Runs entirely client-side.
 *
 * Usage:
 *   import { parseJava } from '@/lib/java-parser';
 *   const result = parseJava(code);
 *   if (!result.success) {
 *     result.errors.forEach(e => console.log(e.message, e.hint));
 *   }
 */

import { JavaLexer } from "./tokens";
import { parser } from "./parser";
import { visitor } from "./visitor";
import { classifyParserError, createDiagnostic, type DiagnosticError, type DiagnosticCategory } from "./diagnostics";

export type { DiagnosticError, DiagnosticCategory };

export interface ParseResult {
  /** True if no errors were found */
  success: boolean;
  /** Concrete Syntax Tree (for advanced use) */
  cst: any;
  /** All diagnostic errors found */
  errors: DiagnosticError[];
}

/**
 * Parse Java code and return diagnostics.
 *
 * @param code  - Java source code to parse
 * @param mode  - 'full' expects a complete class declaration,
 *                'statements' expects bare statements (no class wrapper)
 */
export function parseJava(
  code: string,
  mode: 'full' | 'statements' = 'full'
): ParseResult {
  const errors: DiagnosticError[] = [];

  // Step 1: Lex
  const lexResult = JavaLexer.tokenize(code);
  for (const err of lexResult.errors) {
    errors.push(createDiagnostic(
      'general_syntax',
      err.line ?? 0,
      err.column ?? 0,
      `Unrecognized character: ${err.message}`
    ));
  }

  // Step 2: Parse
  parser.input = lexResult.tokens;
  const cst = mode === 'full' ? parser.program() : parser.statements();

  for (const err of parser.errors) {
    const tokenName = (err as any).token?.tokenType?.name;
    const category = classifyParserError(err.message, tokenName);
    errors.push(createDiagnostic(
      category,
      (err as any).token?.startLine ?? 0,
      (err as any).token?.startColumn ?? 0,
      err.message
    ));
  }

  // Step 3: Semantic analysis (only if parse produced a CST)
  if (parser.errors.length === 0 && cst) {
    visitor.errors = [];
    visitor.visit(cst);
    errors.push(...visitor.errors);
  }

  return {
    success: errors.length === 0,
    cst,
    errors,
  };
}

/**
 * Quick check: does this code have syntax errors?
 * Lighter than full parseJava — skips semantic analysis.
 */
export function hasSyntaxErrors(code: string, mode: 'full' | 'statements' = 'full'): boolean {
  const lexResult = JavaLexer.tokenize(code);
  if (lexResult.errors.length > 0) return true;

  parser.input = lexResult.tokens;
  mode === 'full' ? parser.program() : parser.statements();
  return parser.errors.length > 0;
}
