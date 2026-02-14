import { createToken, Lexer } from "chevrotain";

// ─── Comments & Whitespace (skipped) ────────────────────────────
export const BlockComment = createToken({
  name: "BlockComment",
  pattern: /\/\*[\s\S]*?\*\//,
  group: Lexer.SKIPPED,
});
export const LineComment = createToken({
  name: "LineComment",
  pattern: /\/\/[^\n\r]*/,
  group: Lexer.SKIPPED,
});
export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

// ─── Identifier (defined early, referenced by keywords via longer_alt) ──
export const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z_$][a-zA-Z0-9_$]*/,
});

// ─── Keywords ───────────────────────────────────────────────────
export const Public = createToken({ name: "Public", pattern: /public/, longer_alt: Identifier });
export const Class = createToken({ name: "Class", pattern: /class/, longer_alt: Identifier });
export const Static = createToken({ name: "Static", pattern: /static/, longer_alt: Identifier });
export const Void = createToken({ name: "Void", pattern: /void/, longer_alt: Identifier });
export const Int = createToken({ name: "Int", pattern: /int/, longer_alt: Identifier });
export const Double = createToken({ name: "Double", pattern: /double/, longer_alt: Identifier });
export const StringType = createToken({ name: "StringType", pattern: /String/, longer_alt: Identifier });
export const Char = createToken({ name: "Char", pattern: /char/, longer_alt: Identifier });
export const Boolean = createToken({ name: "Boolean", pattern: /boolean/, longer_alt: Identifier });
export const Final = createToken({ name: "Final", pattern: /final/, longer_alt: Identifier });
export const New = createToken({ name: "New", pattern: /new/, longer_alt: Identifier });
export const True = createToken({ name: "True", pattern: /true/, longer_alt: Identifier });
export const False = createToken({ name: "False", pattern: /false/, longer_alt: Identifier });
export const Null = createToken({ name: "Null", pattern: /null/, longer_alt: Identifier });
export const Byte = createToken({ name: "Byte", pattern: /byte/, longer_alt: Identifier });
export const Short = createToken({ name: "Short", pattern: /short/, longer_alt: Identifier });
export const Long = createToken({ name: "Long", pattern: /long/, longer_alt: Identifier });
export const Float = createToken({ name: "Float", pattern: /float/, longer_alt: Identifier });

// ─── Literals ───────────────────────────────────────────────────
// Double literal must come before integer to match "3.14" before "3"
export const DoubleLiteral = createToken({
  name: "DoubleLiteral",
  pattern: /\d+\.\d+([eE][+-]?\d+)?[dD]?|\d+[eE][+-]?\d+[dD]?/,
});
export const IntegerLiteral = createToken({
  name: "IntegerLiteral",
  pattern: /0|[1-9]\d*[lL]?/,
});
export const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: /"(?:[^"\\]|\\.)*"/,
});
export const CharLiteral = createToken({
  name: "CharLiteral",
  pattern: /'(?:[^'\\]|\\.)'/,
});

// ─── Operators (multi-char before single-char) ──────────────────
export const PlusEquals = createToken({ name: "PlusEquals", pattern: /\+=/ });
export const MinusEquals = createToken({ name: "MinusEquals", pattern: /-=/ });
export const StarEquals = createToken({ name: "StarEquals", pattern: /\*=/ });
export const SlashEquals = createToken({ name: "SlashEquals", pattern: /\/=/ });
export const PercentEquals = createToken({ name: "PercentEquals", pattern: /%=/ });
export const PlusPlus = createToken({ name: "PlusPlus", pattern: /\+\+/ });
export const MinusMinus = createToken({ name: "MinusMinus", pattern: /--/ });
export const EqualEqual = createToken({ name: "EqualEqual", pattern: /==/ });
export const NotEqual = createToken({ name: "NotEqual", pattern: /!=/ });
export const LessEqual = createToken({ name: "LessEqual", pattern: /<=/ });
export const GreaterEqual = createToken({ name: "GreaterEqual", pattern: />=/ });
export const And = createToken({ name: "And", pattern: /&&/ });
export const Or = createToken({ name: "Or", pattern: /\|\|/ });

export const Plus = createToken({ name: "Plus", pattern: /\+/ });
export const Minus = createToken({ name: "Minus", pattern: /-/ });
export const Star = createToken({ name: "Star", pattern: /\*/ });
export const Slash = createToken({ name: "Slash", pattern: /\// });
export const Percent = createToken({ name: "Percent", pattern: /%/ });
export const Equals = createToken({ name: "Equals", pattern: /=/ });
export const LessThan = createToken({ name: "LessThan", pattern: /</ });
export const GreaterThan = createToken({ name: "GreaterThan", pattern: />/ });
export const Bang = createToken({ name: "Bang", pattern: /!/ });

// ─── Delimiters ─────────────────────────────────────────────────
export const LParen = createToken({ name: "LParen", pattern: /\(/ });
export const RParen = createToken({ name: "RParen", pattern: /\)/ });
export const LBrace = createToken({ name: "LBrace", pattern: /\{/ });
export const RBrace = createToken({ name: "RBrace", pattern: /\}/ });
export const LBracket = createToken({ name: "LBracket", pattern: /\[/ });
export const RBracket = createToken({ name: "RBracket", pattern: /\]/ });
export const Semicolon = createToken({ name: "Semicolon", pattern: /;/ });
export const Comma = createToken({ name: "Comma", pattern: /,/ });
export const Dot = createToken({ name: "Dot", pattern: /\./ });

// ─── Token ordering (order matters!) ────────────────────────────
export const allTokens = [
  // Skipped tokens first
  BlockComment,
  LineComment,
  WhiteSpace,

  // Keywords before Identifier
  Public, Class, Static, Void,
  Int, Double, StringType, Char, Boolean,
  Final, New, True, False, Null,
  Byte, Short, Long, Float,

  // Literals (double before integer)
  DoubleLiteral,
  IntegerLiteral,
  StringLiteral,
  CharLiteral,

  // Multi-char operators before single-char
  PlusEquals, MinusEquals, StarEquals, SlashEquals, PercentEquals,
  PlusPlus, MinusMinus,
  EqualEqual, NotEqual, LessEqual, GreaterEqual,
  And, Or,

  // Single-char operators
  Plus, Minus, Star, Slash, Percent,
  Equals,
  LessThan, GreaterThan, Bang,

  // Delimiters
  LParen, RParen, LBrace, RBrace, LBracket, RBracket,
  Semicolon, Comma, Dot,

  // Identifier last (catch-all)
  Identifier,
];

export const JavaLexer = new Lexer(allTokens);
