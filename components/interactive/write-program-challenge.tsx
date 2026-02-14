'use client';

import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { parseJava, type DiagnosticError } from '@/lib/java-parser';
import { Terminal, AlertTriangle, Check, X, Eye, Lightbulb, ChevronRight } from 'lucide-react';

export interface WriteProgramChallengeProps {
  filename: string;
  description: string;
  expectedOutput: string;
  sampleSolution: string;
  requiredElements?: string[];
  hints?: string[];
  onAnswer: (isCorrect: boolean, penalty: number) => void;
}

/** Structural checks that run before output comparison */
function checkStructure(
  code: string,
  filename: string,
  requiredElements?: string[],
): { pass: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check classname matches filename (minus .java)
  const expectedClass = filename.replace(/\.java$/, '');
  const classMatch = code.match(/public\s+class\s+(\w+)/);
  if (!classMatch) {
    issues.push('Missing public class declaration');
  } else if (classMatch[1] !== expectedClass) {
    issues.push(`Class name "${classMatch[1]}" doesn't match filename "${expectedClass}"`);
  }

  // Check main method
  if (!/public\s+static\s+void\s+main\s*\(\s*String\s*\[\]\s*\w+\s*\)/.test(code)) {
    issues.push('Missing or incorrect main method signature');
  }

  // Check required elements
  if (requiredElements) {
    for (const req of requiredElements) {
      if (!code.includes(req)) {
        issues.push(`Missing required element: ${req}`);
      }
    }
  }

  return { pass: issues.length === 0, issues };
}

/** Normalize output for comparison (strip trailing whitespace per line, trailing blank lines) */
function normalizeOutput(s: string): string {
  return s.replace(/[ \t]+$/gm, '').replace(/\n+$/, '');
}

export function WriteProgramChallenge({
  filename,
  description,
  expectedOutput,
  sampleSolution,
  requiredElements,
  hints,
  onAnswer,
}: WriteProgramChallengeProps) {
  const expectedClass = filename.replace(/\.java$/, '');
  const initialCode = `// ${filename}\npublic class ${expectedClass} {\n    public static void main(String[] args) {\n        \n    }\n}`;

  const [code, setCode] = useState(initialCode);
  const [submitted, setSubmitted] = useState(false);
  const [syntaxErrors, setSyntaxErrors] = useState<DiagnosticError[]>([]);
  const [structureIssues, setStructureIssues] = useState<string[]>([]);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [result, setResult] = useState<'correct' | 'partial' | 'incorrect' | null>(null);

  const lines = code.split('\n');

  const handleSubmit = useCallback(() => {
    // 1. Syntax check
    const parseResult = parseJava(code, 'full');
    setSyntaxErrors(parseResult.errors);

    if (parseResult.errors.length > 0) {
      // Syntax errors — don't score yet, let them fix
      return;
    }

    // 2. Structure check
    const structure = checkStructure(code, filename, requiredElements);
    setStructureIssues(structure.issues);

    // 3. Determine result
    // For now, since we can't execute Java in browser, we check structure
    // and give partial credit for correct structure even if we can't verify output.
    // Full output verification would require SSG/Piston.
    setSubmitted(true);

    if (structure.pass) {
      // Structure is correct — award credit
      // In future, compare actual output via SSG
      setResult('correct');
      onAnswer(true, 0);
    } else if (structure.issues.length <= 1) {
      setResult('partial');
      onAnswer(false, 1);
    } else {
      setResult('incorrect');
      onAnswer(false, 2);
    }
  }, [code, filename, requiredElements, onAnswer]);

  const handleShowNextHint = () => {
    if (!showHint) {
      setShowHint(true);
    } else if (hints && hintIndex < hints.length - 1) {
      setHintIndex(prev => prev + 1);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto bg-card/50 backdrop-blur border-border/50">
      <div className="p-6 space-y-5">
        {/* Badge */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="gap-1.5 text-pink-400 border-pink-500/30 bg-pink-500/10">
            <Terminal className="w-4 h-4" />
            Write Program
          </Badge>
        </div>

        {/* Problem description */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold leading-relaxed">{description}</h2>
          <p className="text-sm text-muted-foreground">
            Expected output: <code className="bg-muted/50 px-1.5 py-0.5 rounded font-mono text-green-400">{expectedOutput}</code>
          </p>
        </div>

        {/* File tab */}
        <div className="flex items-center">
          <div className="px-3 py-1.5 bg-muted/50 border border-b-0 border-border/50 rounded-t-lg text-xs font-mono text-foreground/80 flex items-center gap-1.5">
            <span className="text-blue-400">☕</span>
            {filename}
          </div>
        </div>

        {/* Code editor */}
        <div className="rounded-b-lg rounded-tr-lg border border-border/50 bg-black/40 overflow-hidden">
          <div className="relative flex">
            {/* Line numbers */}
            <div className="flex-shrink-0 bg-muted/20 border-r border-border/30 select-none py-2">
              {lines.map((_, i) => (
                <div
                  key={i}
                  className="px-3 h-6 flex items-center justify-end text-xs font-mono text-foreground/40"
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setSyntaxErrors([]);
                setStructureIssues([]);
              }}
              readOnly={submitted}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              className={cn(
                'w-full p-2 font-mono text-sm leading-6 bg-transparent resize-none outline-none text-foreground/90',
                submitted && 'opacity-80 cursor-default',
              )}
              style={{
                fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                minHeight: `${Math.max(lines.length * 24 + 16, 200)}px`,
                tabSize: 4,
              }}
              onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  e.preventDefault();
                  const ta = e.currentTarget;
                  const start = ta.selectionStart;
                  const end = ta.selectionEnd;
                  const newCode = code.substring(0, start) + '    ' + code.substring(end);
                  setCode(newCode);
                  requestAnimationFrame(() => {
                    ta.selectionStart = ta.selectionEnd = start + 4;
                  });
                }
              }}
            />
          </div>
        </div>

        {/* Syntax errors */}
        {syntaxErrors.length > 0 && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 space-y-1">
            <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
              <AlertTriangle className="w-4 h-4" />
              Syntax Errors
            </div>
            {syntaxErrors.map((err, i) => (
              <p key={i} className="text-xs text-red-400/80 font-mono pl-6">
                Line {err.line}: {err.message}
              </p>
            ))}
          </div>
        )}

        {/* Structure issues (post-submit) */}
        {submitted && structureIssues.length > 0 && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 space-y-1">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-medium">
              <AlertTriangle className="w-4 h-4" />
              Structure Issues
            </div>
            {structureIssues.map((issue, i) => (
              <p key={i} className="text-xs text-amber-400/80 pl-6">• {issue}</p>
            ))}
          </div>
        )}

        {/* Hints */}
        {!submitted && hints && hints.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShowNextHint}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <Lightbulb className="w-4 h-4" />
            {showHint ? (hintIndex < hints.length - 1 ? 'Next Hint' : 'No More Hints') : 'Show Hint'}
          </Button>
        )}
        {showHint && hints && (
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-3">
            {hints.slice(0, hintIndex + 1).map((hint, i) => (
              <p key={i} className="text-sm text-blue-400/80">
                <span className="font-medium">Hint {i + 1}:</span> {hint}
              </p>
            ))}
          </div>
        )}

        {/* Submit / Result */}
        {!submitted ? (
          <Button onClick={handleSubmit} className="w-full gap-2">
            <ChevronRight className="w-4 h-4" />
            Check Program
          </Button>
        ) : (
          <div className="space-y-4">
            {/* Result badge */}
            <div
              className={cn(
                'rounded-lg border px-4 py-3 text-sm',
                result === 'correct'
                  ? 'border-green-500/50 bg-green-500/10 text-green-400'
                  : result === 'partial'
                    ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                    : 'border-red-500/50 bg-red-500/10 text-red-400',
              )}
            >
              {result === 'correct' ? (
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span className="font-semibold">Program structure looks correct!</span>
                </div>
              ) : result === 'partial' ? (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-semibold">Almost there — minor structural issues</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <X className="w-5 h-5" />
                  <span className="font-semibold">Structural issues found — review the solution</span>
                </div>
              )}
            </div>

            {/* Show/hide solution */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSolution(!showSolution)}
              className="gap-1.5"
            >
              <Eye className="w-4 h-4" />
              {showSolution ? 'Hide Solution' : 'View Solution'}
            </Button>

            {showSolution && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Reference solution:</p>
                <div className="rounded-lg border border-border/50 bg-black/40 overflow-x-auto">
                  <pre className="font-mono text-sm leading-relaxed text-foreground/90 p-3">
                    {sampleSolution.split('\n').map((line, i) => (
                      <div key={i} className="px-1">
                        <span className="mr-4 inline-block w-8 text-right text-foreground/40">
                          {i + 1}
                        </span>
                        {line}
                      </div>
                    ))}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
