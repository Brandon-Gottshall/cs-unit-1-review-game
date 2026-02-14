import { CstParser } from "chevrotain";
import {
  allTokens,
  // Keywords
  Public, Class, Static, Void, Int, Double, StringType, Char, Boolean,
  Final, New, True, False, Null, Byte, Short, Long, Float,
  // Literals
  IntegerLiteral, DoubleLiteral, StringLiteral, CharLiteral,
  // Operators
  Plus, Minus, Star, Slash, Percent, Equals,
  PlusEquals, MinusEquals, StarEquals, SlashEquals, PercentEquals,
  PlusPlus, MinusMinus,
  EqualEqual, NotEqual, LessThan, GreaterThan, LessEqual, GreaterEqual,
  And, Or, Bang,
  // Delimiters
  LParen, RParen, LBrace, RBrace, LBracket, RBracket,
  Semicolon, Comma, Dot,
  // Identifier
  Identifier,
} from "./tokens";

/**
 * Chevrotain CST Parser for a subset of Java (Ch 1-2 scope).
 *
 * Supports:
 * - Class and main method boilerplate
 * - Variable declarations (int, double, String, char, boolean, byte, short, long, float)
 * - final constants
 * - Assignments and compound assignments (+=, -=, etc.)
 * - Arithmetic expressions with correct precedence
 * - Type casts: (int)x, (double)y
 * - System.out.println / System.out.print
 * - Math.pow, Math.sqrt, Math.abs
 * - String concatenation (handled via + in additive)
 * - Increment/decrement (++, --)
 * - Comments (handled at lexer level)
 */
export class JavaSubsetParser extends CstParser {
  constructor() {
    super(allTokens, {
      recoveryEnabled: true,
      maxLookahead: 4,
    });
    this.performSelfAnalysis();
  }

  // ─── Top-level ──────────────────────────────────────────────
  public program = this.RULE("program", () => {
    this.MANY(() => {
      this.SUBRULE(this.classDeclaration);
    });
  });

  // Also parse bare statements (for snippet-level code without class wrapper)
  public statements = this.RULE("statements", () => {
    this.MANY(() => {
      this.SUBRULE(this.statement);
    });
  });

  private classDeclaration = this.RULE("classDeclaration", () => {
    this.CONSUME(Public);
    this.CONSUME(Class);
    this.CONSUME(Identifier, { LABEL: "className" });
    this.CONSUME(LBrace);
    this.MANY(() => {
      this.SUBRULE(this.classMember);
    });
    this.CONSUME(RBrace);
  });

  private classMember = this.RULE("classMember", () => {
    this.OR([
      {
        // Disambiguate: main method starts with "public static void"
        GATE: () =>
          this.LA(1).tokenType === Public &&
          this.LA(2).tokenType === Static &&
          this.LA(3).tokenType === Void,
        ALT: () => this.SUBRULE(this.mainMethod),
      },
      { ALT: () => this.SUBRULE(this.fieldDeclaration) },
    ]);
  });

  private mainMethod = this.RULE("mainMethod", () => {
    this.CONSUME(Public);
    this.CONSUME(Static);
    this.CONSUME(Void);
    // Expect "main"
    this.CONSUME(Identifier, { LABEL: "methodName" });
    this.CONSUME(LParen);
    this.CONSUME(StringType);
    this.CONSUME(LBracket);
    this.CONSUME(RBracket);
    this.CONSUME2(Identifier, { LABEL: "paramName" });
    this.CONSUME(RParen);
    this.SUBRULE(this.block);
  });

  private fieldDeclaration = this.RULE("fieldDeclaration", () => {
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Public) },
        { ALT: () => this.CONSUME(Static) },
        { ALT: () => this.CONSUME(Final) },
      ]);
    });
    this.SUBRULE(this.typeSpec);
    this.CONSUME(Identifier, { LABEL: "fieldName" });
    this.OPTION(() => {
      this.CONSUME(Equals);
      this.SUBRULE(this.expression);
    });
    this.CONSUME(Semicolon);
  });

  // ─── Statements ─────────────────────────────────────────────
  private block = this.RULE("block", () => {
    this.CONSUME(LBrace);
    this.MANY(() => {
      this.SUBRULE(this.statement);
    });
    this.CONSUME(RBrace);
  });

  private statement = this.RULE("statement", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.variableDeclaration) },
      {
        // Disambiguate: System.out.println/print starts with Identifier("System").Dot
        GATE: () => {
          const t1 = this.LA(1);
          return t1.tokenType === Identifier && t1.image === "System";
        },
        ALT: () => this.SUBRULE(this.printStatement),
      },
      { ALT: () => this.SUBRULE(this.expressionStatement) },
      { ALT: () => this.SUBRULE(this.block) },
    ]);
  });

  private variableDeclaration = this.RULE("variableDeclaration", () => {
    this.OPTION(() => this.CONSUME(Final));
    this.SUBRULE(this.typeSpec);
    this.CONSUME(Identifier, { LABEL: "varName" });
    this.OPTION2(() => {
      this.CONSUME(Equals);
      this.SUBRULE(this.expression);
    });
    this.CONSUME(Semicolon);
  });

  // System.out.println(...) or System.out.print(...)
  private printStatement = this.RULE("printStatement", () => {
    this.CONSUME(Identifier, { LABEL: "system" }); // "System"
    this.CONSUME(Dot);
    this.CONSUME2(Identifier, { LABEL: "out" }); // "out"
    this.CONSUME2(Dot);
    this.CONSUME3(Identifier, { LABEL: "printMethod" }); // "println" or "print"
    this.CONSUME(LParen);
    this.OPTION(() => {
      this.SUBRULE(this.expression);
    });
    this.CONSUME(RParen);
    this.CONSUME(Semicolon);
  });

  // Assignment or standalone expression (method call, increment, etc.)
  private expressionStatement = this.RULE("expressionStatement", () => {
    this.SUBRULE(this.expression);
    // Check for assignment operator
    this.OPTION(() => {
      this.OR([
        { ALT: () => this.CONSUME(Equals) },
        { ALT: () => this.CONSUME(PlusEquals) },
        { ALT: () => this.CONSUME(MinusEquals) },
        { ALT: () => this.CONSUME(StarEquals) },
        { ALT: () => this.CONSUME(SlashEquals) },
        { ALT: () => this.CONSUME(PercentEquals) },
      ]);
      this.SUBRULE2(this.expression);
    });
    this.CONSUME(Semicolon);
  });

  // ─── Types ──────────────────────────────────────────────────
  private typeSpec = this.RULE("typeSpec", () => {
    this.OR([
      { ALT: () => this.CONSUME(Int) },
      { ALT: () => this.CONSUME(Double) },
      { ALT: () => this.CONSUME(StringType) },
      { ALT: () => this.CONSUME(Char) },
      { ALT: () => this.CONSUME(Boolean) },
      { ALT: () => this.CONSUME(Byte) },
      { ALT: () => this.CONSUME(Short) },
      { ALT: () => this.CONSUME(Long) },
      { ALT: () => this.CONSUME(Float) },
      { ALT: () => this.CONSUME(Void) },
    ]);
    // Array type: int[]
    this.OPTION(() => {
      this.CONSUME(LBracket);
      this.CONSUME(RBracket);
    });
  });

  // ─── Expressions (precedence climbing) ──────────────────────
  private expression = this.RULE("expression", () => {
    this.SUBRULE(this.logicalOrExpression);
  });

  private logicalOrExpression = this.RULE("logicalOrExpression", () => {
    this.SUBRULE(this.logicalAndExpression);
    this.MANY(() => {
      this.CONSUME(Or);
      this.SUBRULE2(this.logicalAndExpression);
    });
  });

  private logicalAndExpression = this.RULE("logicalAndExpression", () => {
    this.SUBRULE(this.equalityExpression);
    this.MANY(() => {
      this.CONSUME(And);
      this.SUBRULE2(this.equalityExpression);
    });
  });

  private equalityExpression = this.RULE("equalityExpression", () => {
    this.SUBRULE(this.relationalExpression);
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(EqualEqual) },
        { ALT: () => this.CONSUME(NotEqual) },
      ]);
      this.SUBRULE2(this.relationalExpression);
    });
  });

  private relationalExpression = this.RULE("relationalExpression", () => {
    this.SUBRULE(this.additiveExpression);
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(LessThan) },
        { ALT: () => this.CONSUME(GreaterThan) },
        { ALT: () => this.CONSUME(LessEqual) },
        { ALT: () => this.CONSUME(GreaterEqual) },
      ]);
      this.SUBRULE2(this.additiveExpression);
    });
  });

  private additiveExpression = this.RULE("additiveExpression", () => {
    this.SUBRULE(this.multiplicativeExpression);
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Plus) },
        { ALT: () => this.CONSUME(Minus) },
      ]);
      this.SUBRULE2(this.multiplicativeExpression);
    });
  });

  private multiplicativeExpression = this.RULE("multiplicativeExpression", () => {
    this.SUBRULE(this.unaryExpression);
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Star) },
        { ALT: () => this.CONSUME(Slash) },
        { ALT: () => this.CONSUME(Percent) },
      ]);
      this.SUBRULE2(this.unaryExpression);
    });
  });

  private unaryExpression = this.RULE("unaryExpression", () => {
    this.OR([
      // Prefix: -x, +x, !x, ++x, --x
      {
        ALT: () => {
          this.OR2([
            { ALT: () => this.CONSUME(Minus) },
            { ALT: () => this.CONSUME(Plus) },
            { ALT: () => this.CONSUME(Bang) },
            { ALT: () => this.CONSUME(PlusPlus) },
            { ALT: () => this.CONSUME(MinusMinus) },
          ]);
          this.SUBRULE(this.unaryExpression);
        },
      },
      // Type cast: (int)x, (double)y
      {
        ALT: () => this.SUBRULE(this.castOrPrimary),
      },
    ]);
  });

  // Disambiguate (type)expr from (expr)
  private castOrPrimary = this.RULE("castOrPrimary", () => {
    this.OR([
      {
        // Type cast: (int)expr
        GATE: () => this.isCast(),
        ALT: () => {
          this.CONSUME(LParen);
          this.SUBRULE(this.typeSpec);
          this.CONSUME(RParen);
          this.SUBRULE(this.unaryExpression);
        },
      },
      { ALT: () => this.SUBRULE(this.postfixExpression) },
    ]);
  });

  private postfixExpression = this.RULE("postfixExpression", () => {
    this.SUBRULE(this.primaryExpression);
    this.OPTION(() => {
      this.OR([
        { ALT: () => this.CONSUME(PlusPlus) },
        { ALT: () => this.CONSUME(MinusMinus) },
      ]);
    });
  });

  private primaryExpression = this.RULE("primaryExpression", () => {
    this.OR([
      { ALT: () => this.CONSUME(IntegerLiteral) },
      { ALT: () => this.CONSUME(DoubleLiteral) },
      { ALT: () => this.CONSUME(StringLiteral) },
      { ALT: () => this.CONSUME(CharLiteral) },
      { ALT: () => this.CONSUME(True) },
      { ALT: () => this.CONSUME(False) },
      { ALT: () => this.CONSUME(Null) },
      // Identifier, possibly followed by method call or dot access
      {
        ALT: () => {
          this.CONSUME(Identifier);
          this.MANY(() => {
            this.OR2([
              // Method call: identifier(args)
              {
                ALT: () => {
                  this.CONSUME(LParen);
                  this.OPTION(() => {
                    this.SUBRULE(this.argumentList);
                  });
                  this.CONSUME(RParen);
                },
              },
              // Dot access: identifier.field or identifier.method()
              {
                ALT: () => {
                  this.CONSUME(Dot);
                  this.CONSUME2(Identifier);
                },
              },
            ]);
          });
        },
      },
      // Parenthesized expression
      {
        ALT: () => {
          this.CONSUME2(LParen);
          this.SUBRULE(this.expression);
          this.CONSUME2(RParen);
        },
      },
      // new ClassName(args) — for Random, Scanner, etc.
      {
        ALT: () => {
          this.CONSUME(New);
          this.CONSUME3(Identifier);
          this.CONSUME3(LParen);
          this.OPTION2(() => {
            this.SUBRULE2(this.argumentList);
          });
          this.CONSUME3(RParen);
        },
      },
    ]);
  });

  private argumentList = this.RULE("argumentList", () => {
    this.SUBRULE(this.expression);
    this.MANY(() => {
      this.CONSUME(Comma);
      this.SUBRULE2(this.expression);
    });
  });

  // ─── Lookahead helper for type cast disambiguation ──────────
  private isCast(): boolean {
    // Peek: ( <type_keyword> )
    // This is a simplification — works for primitive casts
    const nextToken = this.LA(1);
    const tokenAfter = this.LA(2);
    if (nextToken.tokenType !== LParen) return false;

    const typeTokens = [Int, Double, Char, Byte, Short, Long, Float];
    return typeTokens.some(t => tokenAfter.tokenType === t);
  }
}

// Singleton parser instance (Chevrotain parsers are stateful but reusable)
export const parser = new JavaSubsetParser();
