import React from 'react';

type TokenType =
  | 'keyword'
  | 'type'
  | 'string'
  | 'comment'
  | 'number'
  | 'boolean'
  | 'annotation'
  | 'method'
  | 'operator'
  | 'plain';

interface Token {
  type: TokenType;
  value: string;
}

const JAVA_KEYWORDS = new Set([
  'abstract', 'assert', 'break', 'case', 'catch', 'class', 'const', 'continue',
  'default', 'do', 'else', 'enum', 'extends', 'final', 'finally', 'for',
  'goto', 'if', 'implements', 'import', 'instanceof', 'interface', 'native',
  'new', 'package', 'private', 'protected', 'public', 'return', 'static',
  'strictfp', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws',
  'transient', 'try', 'void', 'volatile', 'while',
]);

const JAVA_TYPES = new Set([
  'boolean', 'byte', 'char', 'double', 'float', 'int', 'long', 'short',
  'String', 'Integer', 'Double', 'Float', 'Long', 'Short', 'Byte',
  'Character', 'Boolean', 'Object', 'System', 'Scanner', 'Math',
  'Array', 'ArrayList', 'List', 'Map', 'HashMap', 'Set', 'HashSet',
  'Collections', 'Arrays', 'Random', 'StringBuilder',
]);

const TOKEN_CLASSES: Record<TokenType, string> = {
  keyword: 'syn-kw',
  type: 'syn-type',
  string: 'syn-str',
  comment: 'syn-cmt',
  number: 'syn-num',
  boolean: 'syn-bool',
  annotation: 'syn-ann',
  method: 'syn-fn',
  operator: 'syn-op',
  plain: '',
};

export function tokenizeJava(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < code.length) {
    // Multi-line comment
    if (code[i] === '/' && code[i + 1] === '*') {
      const end = code.indexOf('*/', i + 2);
      const value = end === -1 ? code.slice(i) : code.slice(i, end + 2);
      tokens.push({ type: 'comment', value });
      i += value.length;
      continue;
    }

    // Single-line comment
    if (code[i] === '/' && code[i + 1] === '/') {
      const end = code.indexOf('\n', i);
      const value = end === -1 ? code.slice(i) : code.slice(i, end);
      tokens.push({ type: 'comment', value });
      i += value.length;
      continue;
    }

    // String literal
    if (code[i] === '"') {
      let j = i + 1;
      while (j < code.length && code[j] !== '"' && code[j] !== '\n') {
        if (code[j] === '\\') j++;
        j++;
      }
      tokens.push({ type: 'string', value: code.slice(i, j + 1) });
      i = j + 1;
      continue;
    }

    // Char literal
    if (code[i] === "'") {
      let j = i + 1;
      while (j < code.length && code[j] !== "'" && code[j] !== '\n') {
        if (code[j] === '\\') j++;
        j++;
      }
      tokens.push({ type: 'string', value: code.slice(i, j + 1) });
      i = j + 1;
      continue;
    }

    // Annotation
    if (code[i] === '@' && i + 1 < code.length && /[a-zA-Z]/.test(code[i + 1])) {
      let j = i + 1;
      while (j < code.length && /\w/.test(code[j])) j++;
      tokens.push({ type: 'annotation', value: code.slice(i, j) });
      i = j;
      continue;
    }

    // Number (including hex 0x, binary 0b, underscores, suffixes)
    if (/\d/.test(code[i]) || (code[i] === '.' && i + 1 < code.length && /\d/.test(code[i + 1]))) {
      let j = i;
      if (code[j] === '0' && j + 1 < code.length && /[xXbBoO]/.test(code[j + 1])) {
        j += 2;
      }
      while (j < code.length && /[\d.eE_a-fA-FxXbBoOlLdDfF+-]/.test(code[j])) j++;
      tokens.push({ type: 'number', value: code.slice(i, j) });
      i = j;
      continue;
    }

    // Identifier / keyword / type / method
    if (/[a-zA-Z_$]/.test(code[i])) {
      let j = i;
      while (j < code.length && /[\w$]/.test(code[j])) j++;
      const word = code.slice(i, j);

      // Peek ahead past whitespace for '(' to detect method calls
      let k = j;
      while (k < code.length && code[k] === ' ') k++;

      if (word === 'true' || word === 'false' || word === 'null') {
        tokens.push({ type: 'boolean', value: word });
      } else if (JAVA_KEYWORDS.has(word)) {
        tokens.push({ type: 'keyword', value: word });
      } else if (JAVA_TYPES.has(word)) {
        tokens.push({ type: 'type', value: word });
      } else if (code[k] === '(') {
        tokens.push({ type: 'method', value: word });
      } else {
        tokens.push({ type: 'plain', value: word });
      }
      i = j;
      continue;
    }

    // Whitespace (keep newlines separate for line splitting)
    if (code[i] === '\n') {
      tokens.push({ type: 'plain', value: '\n' });
      i++;
      continue;
    }
    if (/[ \t\r]/.test(code[i])) {
      let j = i;
      while (j < code.length && /[ \t\r]/.test(code[j])) j++;
      tokens.push({ type: 'plain', value: code.slice(i, j) });
      i = j;
      continue;
    }

    // Everything else (operators, punctuation, braces)
    tokens.push({ type: 'operator', value: code[i] });
    i++;
  }

  return tokens;
}

/** Render a tokenized line as highlighted React elements. */
function renderTokens(tokens: Token[]): React.ReactNode[] {
  return tokens.map((token, i) => {
    const cls = TOKEN_CLASSES[token.type];
    if (!cls) return <React.Fragment key={i}>{token.value}</React.Fragment>;
    return (
      <span key={i} className={cls}>
        {token.value}
      </span>
    );
  });
}

/** Highlight a single line of Java (no newlines expected). */
export function highlightLine(line: string): React.ReactNode {
  return <>{renderTokens(tokenizeJava(line))}</>;
}

/** Highlight a full Java snippet, returning an array of highlighted lines. */
export function highlightLines(code: string): React.ReactNode[] {
  const tokens = tokenizeJava(code);

  // Split tokens at newline boundaries into per-line groups
  const lines: Token[][] = [[]];
  for (const token of tokens) {
    if (token.value === '\n') {
      lines.push([]);
    } else if (token.value.includes('\n')) {
      // Multi-line token (e.g. block comment) — split and replicate type
      const parts = token.value.split('\n');
      parts.forEach((part, idx) => {
        if (idx > 0) lines.push([]);
        if (part) lines[lines.length - 1].push({ type: token.type, value: part });
      });
    } else {
      lines[lines.length - 1].push(token);
    }
  }

  return lines.map((lineTokens, i) => (
    <React.Fragment key={i}>{renderTokens(lineTokens)}</React.Fragment>
  ));
}
