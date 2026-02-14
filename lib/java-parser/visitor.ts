import { parser } from "./parser";
import { createDiagnostic, type DiagnosticError } from "./diagnostics";

const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

/**
 * Semantic visitor that walks the CST to detect:
 * - Undeclared variables
 * - Duplicate declarations
 * - Assignment to final variables
 * - Basic type tracking
 *
 * Scoped to Ch 1-2 constructs.
 */

interface VarInfo {
  type: string;
  isFinal: boolean;
  line: number;
}

export class JavaSemanticVisitor extends BaseCstVisitor {
  private scopes: Map<string, VarInfo>[] = [];
  public errors: DiagnosticError[] = [];

  constructor() {
    super();
    this.validateVisitor();
  }

  private pushScope() {
    this.scopes.push(new Map());
  }

  private popScope() {
    this.scopes.pop();
  }

  private declareVar(name: string, info: VarInfo): boolean {
    const currentScope = this.scopes[this.scopes.length - 1];
    if (currentScope?.has(name)) {
      return false; // duplicate
    }
    currentScope?.set(name, info);
    return true;
  }

  private lookupVar(name: string): VarInfo | undefined {
    // Search from innermost scope outward
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      const found = this.scopes[i].get(name);
      if (found) return found;
    }
    return undefined;
  }

  // ─── CST Visitor methods ───────────────────────────────────
  // These method names must match the parser rule names exactly.

  program(ctx: any) {
    this.pushScope();
    ctx.classDeclaration?.forEach((c: any) => this.visit(c));
    this.popScope();
  }

  statements(ctx: any) {
    this.pushScope();
    ctx.statement?.forEach((s: any) => this.visit(s));
    this.popScope();
  }

  classDeclaration(ctx: any) {
    ctx.classMember?.forEach((m: any) => this.visit(m));
  }

  classMember(ctx: any) {
    if (ctx.mainMethod) this.visit(ctx.mainMethod);
    if (ctx.fieldDeclaration) this.visit(ctx.fieldDeclaration);
  }

  mainMethod(ctx: any) {
    this.pushScope();
    // Declare args parameter
    const paramName = ctx.paramName?.[0]?.image;
    if (paramName) {
      this.declareVar(paramName, { type: 'String[]', isFinal: false, line: ctx.paramName[0].startLine });
    }
    if (ctx.block) this.visit(ctx.block);
    this.popScope();
  }

  fieldDeclaration(ctx: any) {
    const isFinal = !!ctx.Final;
    const varName = ctx.fieldName?.[0]?.image;
    const typeStr = ctx.typeSpec ? this.getTypeString(ctx.typeSpec[0]) : 'unknown';

    if (varName) {
      if (!this.declareVar(varName, { type: typeStr, isFinal, line: ctx.fieldName[0].startLine })) {
        this.errors.push(createDiagnostic(
          'duplicate_declaration',
          ctx.fieldName[0].startLine,
          ctx.fieldName[0].startColumn,
          `Variable '${varName}' is already declared in this scope`
        ));
      }
    }

    if (ctx.expression) this.visit(ctx.expression);
  }

  block(ctx: any) {
    this.pushScope();
    ctx.statement?.forEach((s: any) => this.visit(s));
    this.popScope();
  }

  statement(ctx: any) {
    if (ctx.variableDeclaration) this.visit(ctx.variableDeclaration);
    if (ctx.printStatement) this.visit(ctx.printStatement);
    if (ctx.expressionStatement) this.visit(ctx.expressionStatement);
    if (ctx.block) this.visit(ctx.block);
  }

  variableDeclaration(ctx: any) {
    const isFinal = !!ctx.Final;
    const varName = ctx.varName?.[0]?.image;
    const typeStr = ctx.typeSpec ? this.getTypeString(ctx.typeSpec[0]) : 'unknown';

    if (varName) {
      if (!this.declareVar(varName, { type: typeStr, isFinal, line: ctx.varName[0].startLine })) {
        this.errors.push(createDiagnostic(
          'duplicate_declaration',
          ctx.varName[0].startLine,
          ctx.varName[0].startColumn,
          `Variable '${varName}' is already declared in this scope`
        ));
      }
    }

    if (ctx.expression) this.visit(ctx.expression);
  }

  printStatement(ctx: any) {
    if (ctx.expression) this.visit(ctx.expression);
  }

  expressionStatement(ctx: any) {
    // Check if this is an assignment to undeclared or final variable
    if (ctx.expression) {
      this.visit(ctx.expression[0]);
    }

    // If there's an assignment operator, check LHS
    if (ctx.Equals || ctx.PlusEquals || ctx.MinusEquals || ctx.StarEquals || ctx.SlashEquals || ctx.PercentEquals) {
      // LHS should be a simple identifier — extract from first expression CST
      const lhsIdent = this.extractIdentifier(ctx.expression?.[0]);
      if (lhsIdent) {
        const varInfo = this.lookupVar(lhsIdent.image);
        if (!varInfo) {
          this.errors.push(createDiagnostic(
            'undeclared_variable',
            lhsIdent.startLine,
            lhsIdent.startColumn,
            `Variable '${lhsIdent.image}' has not been declared`
          ));
        } else if (varInfo.isFinal) {
          this.errors.push(createDiagnostic(
            'assign_to_final',
            lhsIdent.startLine,
            lhsIdent.startColumn,
            `Cannot assign to '${lhsIdent.image}' — it was declared final`
          ));
        }
      }

      if (ctx.expression?.[1]) this.visit(ctx.expression[1]);
    }
  }

  // ─── Expression visitors (check identifier references) ─────

  expression(ctx: any) {
    if (ctx.logicalOrExpression) this.visit(ctx.logicalOrExpression);
  }

  logicalOrExpression(ctx: any) {
    ctx.logicalAndExpression?.forEach((e: any) => this.visit(e));
  }

  logicalAndExpression(ctx: any) {
    ctx.equalityExpression?.forEach((e: any) => this.visit(e));
  }

  equalityExpression(ctx: any) {
    ctx.relationalExpression?.forEach((e: any) => this.visit(e));
  }

  relationalExpression(ctx: any) {
    ctx.additiveExpression?.forEach((e: any) => this.visit(e));
  }

  additiveExpression(ctx: any) {
    ctx.multiplicativeExpression?.forEach((e: any) => this.visit(e));
  }

  multiplicativeExpression(ctx: any) {
    ctx.unaryExpression?.forEach((e: any) => this.visit(e));
  }

  unaryExpression(ctx: any) {
    if (ctx.unaryExpression) this.visit(ctx.unaryExpression);
    if (ctx.castOrPrimary) this.visit(ctx.castOrPrimary);
  }

  castOrPrimary(ctx: any) {
    if (ctx.unaryExpression) this.visit(ctx.unaryExpression);
    if (ctx.postfixExpression) this.visit(ctx.postfixExpression);
    if (ctx.typeSpec) {
      // Type cast — typeSpec is just a token, no visiting needed
    }
  }

  postfixExpression(ctx: any) {
    if (ctx.primaryExpression) this.visit(ctx.primaryExpression);
  }

  primaryExpression(ctx: any) {
    // Check identifier usage
    if (ctx.Identifier) {
      const ident = ctx.Identifier[0];
      const name = ident.image;
      // Skip well-known identifiers that aren't user variables
      const builtins = new Set(['System', 'out', 'println', 'print', 'Math', 'pow', 'sqrt', 'abs',
        'nextInt', 'nextDouble', 'nextLine', 'Random', 'Scanner', 'parseInt', 'parseDouble',
        'length', 'charAt', 'substring', 'toLowerCase', 'toUpperCase', 'equals', 'compareTo',
        'round', 'ceil', 'floor', 'min', 'max']);
      if (!builtins.has(name)) {
        const varInfo = this.lookupVar(name);
        if (!varInfo) {
          this.errors.push(createDiagnostic(
            'undeclared_variable',
            ident.startLine,
            ident.startColumn,
            `Variable '${name}' has not been declared`
          ));
        }
      }
    }

    if (ctx.expression) this.visit(ctx.expression);
    if (ctx.argumentList) this.visit(ctx.argumentList);
  }

  argumentList(ctx: any) {
    ctx.expression?.forEach((e: any) => this.visit(e));
  }

  typeSpec(_ctx: any) {
    // No action needed — just a type token
  }

  // ─── Helpers ────────────────────────────────────────────────

  private getTypeString(typeCtx: any): string {
    if (!typeCtx) return 'unknown';
    const children = typeCtx.children || typeCtx;
    if (children.Int) return 'int';
    if (children.Double) return 'double';
    if (children.StringType) return 'String';
    if (children.Char) return 'char';
    if (children.Boolean) return 'boolean';
    if (children.Byte) return 'byte';
    if (children.Short) return 'short';
    if (children.Long) return 'long';
    if (children.Float) return 'float';
    if (children.Void) return 'void';
    return 'unknown';
  }

  /**
   * Extract the first Identifier token from an expression CST node.
   * Used to identify the LHS of assignments.
   */
  private extractIdentifier(exprCtx: any): any | null {
    if (!exprCtx) return null;
    // Walk down: expression → logicalOr → logicalAnd → equality → relational → additive → multiplicative → unary → castOrPrimary → postfix → primary → Identifier
    try {
      const lor = exprCtx.children?.logicalOrExpression?.[0];
      const land = lor?.children?.logicalAndExpression?.[0];
      const eq = land?.children?.equalityExpression?.[0];
      const rel = eq?.children?.relationalExpression?.[0];
      const add = rel?.children?.additiveExpression?.[0];
      const mul = add?.children?.multiplicativeExpression?.[0];
      const un = mul?.children?.unaryExpression?.[0];
      const cop = un?.children?.castOrPrimary?.[0];
      const post = cop?.children?.postfixExpression?.[0];
      const prim = post?.children?.primaryExpression?.[0];
      return prim?.children?.Identifier?.[0] || null;
    } catch {
      return null;
    }
  }
}

export const visitor = new JavaSemanticVisitor();
