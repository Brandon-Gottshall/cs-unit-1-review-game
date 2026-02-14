/**
 * Diagnostic error types and educational message generation.
 *
 * Maps parser/semantic errors to student-friendly explanations
 * targeting CS 1301 Ch 1-2 common mistakes.
 */

export type DiagnosticCategory =
  | 'missing_semicolon'
  | 'unclosed_brace'
  | 'unclosed_paren'
  | 'invalid_lhs_assignment'
  | 'undeclared_variable'
  | 'type_mismatch'
  | 'duplicate_declaration'
  | 'assign_to_final'
  | 'missing_type'
  | 'unexpected_token'
  | 'general_syntax';

export interface DiagnosticError {
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  category: DiagnosticCategory;
  message: string;
  hint?: string;
}

/**
 * Educational hints for each error category.
 * These map directly to Ch 1-2 learning objectives.
 */
const HINTS: Record<DiagnosticCategory, string> = {
  missing_semicolon:
    'In Java, every statement must end with a semicolon (;). This is different from some other languages.',
  unclosed_brace:
    'Every opening brace { must have a matching closing brace }. Check your class and method definitions.',
  unclosed_paren:
    'Every opening parenthesis ( must have a matching closing parenthesis ).',
  invalid_lhs_assignment:
    'The left side of an assignment (=) must be a single variable name. Expressions like x + 1 cannot be assigned to.',
  undeclared_variable:
    'You must declare a variable with its type (e.g., int x;) before you can use or assign to it.',
  type_mismatch:
    'Java is strongly typed. You cannot assign a value of one type to a variable of an incompatible type without casting.',
  duplicate_declaration:
    'This variable name is already declared in this scope. Each variable can only be declared once.',
  assign_to_final:
    'Variables declared with the final keyword are constants and cannot be reassigned after initialization.',
  missing_type:
    'Variable declarations in Java require a type (int, double, String, char, etc.) before the variable name.',
  unexpected_token:
    'The parser encountered something it did not expect at this position. Check for typos or missing syntax.',
  general_syntax:
    'There is a syntax error in this code. Review Java syntax rules for statements and expressions.',
};

export function createDiagnostic(
  category: DiagnosticCategory,
  line: number,
  column: number,
  message: string,
  extra?: { endLine?: number; endColumn?: number }
): DiagnosticError {
  return {
    line,
    column,
    endLine: extra?.endLine,
    endColumn: extra?.endColumn,
    category,
    message,
    hint: HINTS[category],
  };
}

/**
 * Attempt to classify a raw Chevrotain parser error into an educational category.
 */
export function classifyParserError(errorMessage: string, tokenName?: string): DiagnosticCategory {
  const msg = errorMessage.toLowerCase();

  if (tokenName === 'Semicolon' || msg.includes('semicolon')) {
    return 'missing_semicolon';
  }
  if (tokenName === 'RBrace' || msg.includes('rbrace') || msg.includes('}')) {
    return 'unclosed_brace';
  }
  if (tokenName === 'RParen' || msg.includes('rparen') || msg.includes(')')) {
    return 'unclosed_paren';
  }
  if (msg.includes('left') && msg.includes('assignment')) {
    return 'invalid_lhs_assignment';
  }

  return 'general_syntax';
}
