'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import Editor from 'react-simple-code-editor';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { parseJava, type DiagnosticError } from '@/lib/java-parser';
import { highlightCode, highlightLines } from '@/lib/java-syntax-highlight';
import { Terminal, AlertTriangle, Check, X, ChevronRight, Lightbulb } from 'lucide-react';

// ─── Idle hint system ─────────────────────────────────────────
// Hints are derived from what the student's code is *missing*.
// After IDLE_MS of no typing, we surface the next relevant nudge.
const IDLE_MS = 20_000; // 20 seconds of silence → nudge

interface CodeGap {
  test: (code: string, filename: string) => boolean;
  nudge: string;
}

/** Build gap list based on what the question requires */
function buildCodeGaps(requiredElements?: string[]): CodeGap[] {
  const needsScanner = requiredElements?.some(r => r.includes('Scanner'));

  return [
    {
      test: (code) => code.trim().length === 0,
      nudge: 'Start by thinking about what goes at the very top of a Java file…',
    },
    // Scanner-specific nudge if the question needs it
    ...(needsScanner ? [{
      test: (code: string) => !code.includes('import java.util.Scanner') && code.trim().length > 0,
      nudge: 'This program needs user input. Scanner isn\'t auto-imported — what\'s the import statement?',
    }] : [{
      test: (code: string) => !code.includes('import ') && code.trim().length > 0 && !/public\s+class/.test(code),
      nudge: 'Do you need to import anything? Not everything in Java is auto-imported…',
    }]),
    {
      test: (code) => !/public\s+class\s+\w+/.test(code) && code.trim().length > 0,
      nudge: 'Every Java file needs a class declaration. The class name must match the filename…',
    },
    // ── Granular main method signature hints ──
    // Pure recall cues — no OOP concepts (students haven't learned static/access modifiers yet).
    // Just help them remember the next word in: public static void main(String[] args)
    // Order: most-complete partial match first → least complete.
    {
      // They have "public static void main" but wrong/missing params
      test: (code) => /public\s+class/.test(code)
        && /public\s+static\s+void\s+main/.test(code)
        && !/public\s+static\s+void\s+main\s*\(\s*String\s*\[\]\s*\w+\s*\)/.test(code),
      nudge: 'Almost there — main always takes the same parameter. Think: (String[] ____)',
    },
    {
      // They have "public static void" but haven't written "main" yet
      test: (code) => /public\s+class/.test(code)
        && /public\s+static\s+void\b/.test(code)
        && !/public\s+static\s+void\s+main/.test(code),
      nudge: 'public static void ____  — what\'s the name of the method that Java runs first?',
    },
    {
      // They have "public static" inside the class but no "void" yet
      test: (code) => /public\s+class/.test(code)
        && /\{\s*[\s\S]*public\s+static\b/.test(code)
        && !/public\s+static\s+void/.test(code),
      nudge: 'public static ____  — the main method doesn\'t give anything back. What keyword means "returns nothing"?',
    },
    {
      // They wrote "public" inside the class (not the class keyword) but no "static"
      test: (code) => {
        if (!/public\s+class\s+\w+/.test(code)) return false;
        const classBody = code.replace(/public\s+class\s+\w+\s*\{/, '');
        return /\bpublic\b/.test(classBody) && !/public\s+static/.test(classBody);
      },
      nudge: 'public ____  — the next keyword is six letters long. Think: "public s_____"',
    },
    {
      // They have the class but haven't started the main method at all
      test: (code) => /public\s+class/.test(code) && !/public\s+static\s+void\s+main/.test(code),
      nudge: 'Now you need the main method inside your class. It starts with the same keyword as your class declaration…',
    },
    ...(needsScanner ? [{
      test: (code: string) => /public\s+static\s+void\s+main/.test(code) && !/new\s+Scanner/.test(code),
      nudge: 'You\'ll need to create a Scanner object. What do you pass to its constructor?',
    }] : []),
    {
      test: (code) => /public\s+static\s+void\s+main/.test(code) && !/System\.out\.print/.test(code) && code.trim().split('\n').length < 6,
      nudge: 'You have the structure. Now think about what the program needs to do inside main…',
    },
  ];
}

export interface WriteProgramChallengeProps {
  filename: string;
  description: string;
  expectedOutput: string;
  sampleSolution: string;
  requiredElements?: string[];
  hints?: string[];
  onAnswer: (isCorrect: boolean, penalty: number, studentCode: string, explanation: string) => void;
  onContinue: () => void;
}

// ─── Test-runner types ───────────────────────────────────────
interface TestResult {
  name: string;
  label: string;
  passed: boolean;
  detail?: string;
}

/** Derive a camelCase test name from a required element string */
function testNameFor(element: string): string {
  // "System.out.println" → "testUsesSystemOutPrintln"
  const cleaned = element.replace(/[^a-zA-Z0-9]/g, ' ').trim().split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  return `testUses${cleaned}`;
}

/** Extract string literals from System.out.print/println calls */
function extractPrintedStrings(code: string): string[] {
  const results: string[] = [];
  const re = /System\.out\.print(?:ln)?\s*\(\s*"([^"]*)"\s*\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code)) !== null) {
    results.push(m[1]);
  }
  return results;
}

/** Run structural + faked-output test suite against student code */
function runTestSuite(
  code: string,
  filename: string,
  expectedOutput: string,
  requiredElements?: string[],
): TestResult[] {
  const results: TestResult[] = [];
  const expectedClass = filename.replace(/\.java$/, '');

  // 1. Class declaration
  const classMatch = code.match(/public\s+class\s+(\w+)/);
  if (!classMatch) {
    results.push({
      name: 'testClassDeclaration',
      label: `Class name matches ${filename}`,
      passed: false,
      detail: 'No public class declaration found',
    });
  } else if (classMatch[1] !== expectedClass) {
    results.push({
      name: 'testClassDeclaration',
      label: `Class name matches ${filename}`,
      passed: false,
      detail: `Found "${classMatch[1]}" — expected "${expectedClass}"`,
    });
  } else {
    results.push({
      name: 'testClassDeclaration',
      label: `Class name matches ${filename}`,
      passed: true,
    });
  }

  // 2. Main method
  const hasMain = /public\s+static\s+void\s+main\s*\(\s*String\s*\[\]\s*\w+\s*\)/.test(code);
  results.push({
    name: 'testMainMethod',
    label: 'Has valid main method signature',
    passed: hasMain,
    detail: hasMain ? undefined : 'Expected: public static void main(String[] args)',
  });

  // 3. Required elements
  if (requiredElements) {
    for (const req of requiredElements) {
      // Skip class name and main method — already tested above
      if (req === `public class ${expectedClass}` || req === 'public static void main') continue;
      const found = code.includes(req);
      results.push({
        name: testNameFor(req),
        label: `Uses ${req}`,
        passed: found,
        detail: found ? undefined : `"${req}" not found in your code`,
      });
    }
  }

  // 4. Faked output test — compare print literals to expected output
  const printed = extractPrintedStrings(code);
  const expectedLines = expectedOutput.replace(/\n$/, '').split('\n');
  if (printed.length === 0 && expectedLines.length > 0 && expectedLines[0] !== '') {
    results.push({
      name: 'testExpectedOutput',
      label: `Output matches "${expectedLines[0]}${expectedLines.length > 1 ? '...' : ''}"`,
      passed: false,
      detail: 'No print statements found',
    });
  } else if (printed.length > 0) {
    const outputMatches = printed.length === expectedLines.length &&
      printed.every((p, i) => p === expectedLines[i]);
    results.push({
      name: 'testExpectedOutput',
      label: `Output matches "${expectedLines[0]}${expectedLines.length > 1 ? '...' : ''}"`,
      passed: outputMatches,
      detail: outputMatches ? undefined
        : `Expected: ${expectedLines.join('\\n')}\nGot: ${printed.join('\\n')}`,
    });
  }

  return results;
}

export function WriteProgramChallenge({
  filename,
  description,
  expectedOutput,
  sampleSolution,
  requiredElements,
  hints,
  onAnswer,
  onContinue,
}: WriteProgramChallengeProps) {
  // ── State ──
  const [code, setCode] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [syntaxErrors, setSyntaxErrors] = useState<DiagnosticError[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  // Animated test runner state
  const [runnerPhase, setRunnerPhase] = useState<'idle' | 'compiling' | 'running' | 'revealing' | 'done'>('idle');
  const [revealedCount, setRevealedCount] = useState(0);

  // Deferred answer — onAnswer fires only after animation completes
  const pendingAnswerRef = useRef<{ isCorrect: boolean; penalty: number; code: string; explanation: string } | null>(null);

  // Track which line the cursor is on so we skip it for semicolon warnings
  const [cursorLine, setCursorLine] = useState(-1);
  const editorWrapRef = useRef<HTMLDivElement>(null);
  const updateCursorLine = useCallback(() => {
    const textarea = editorWrapRef.current?.querySelector('textarea');
    if (textarea && textarea === document.activeElement) {
      const pos = textarea.selectionStart;
      setCursorLine(code.substring(0, pos).split('\n').length - 1);
    }
  }, [code]);

  // Manual hints (from question data)
  const [manualHintIndex, setManualHintIndex] = useState(-1);

  // Idle-based nudge
  const [idleNudge, setIdleNudge] = useState<string | null>(null);
  const [nudgeCount, setNudgeCount] = useState(0);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const codeRef = useRef(code);
  codeRef.current = code;

  // ── Idle timer logic ──
  const codeGaps = useMemo(() => buildCodeGaps(requiredElements), [requiredElements]);

  const resetIdleTimer = useCallback(() => {
    if (submitted) return;
    setIdleNudge(null);

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    idleTimerRef.current = setTimeout(() => {
      const currentCode = codeRef.current;
      for (const gap of codeGaps) {
        if (gap.test(currentCode, filename)) {
          setIdleNudge(gap.nudge);
          setNudgeCount(prev => prev + 1);
          return;
        }
      }
    }, IDLE_MS);
  }, [submitted, filename, codeGaps]);

  // Start idle timer on mount (empty editor → first nudge after 20s)
  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  const lines = (code || '\n').split('\n');

  // ── Live mistake detection (pre-submit gentle warnings) ──
  const expectedClass = filename.replace(/\.java$/, '');
  const liveWarnings = useMemo(() => {
    if (submitted || code.trim().length === 0) return [];
    const warnings: string[] = [];

    // Classname ≠ filename
    const classMatch = code.match(/public\s+class\s+(\w+)/);
    if (classMatch && classMatch[1] !== expectedClass) {
      warnings.push(`Class name "${classMatch[1]}" doesn't match filename "${expectedClass}" — Java requires these to match.`);
    }

    // Main method signature typos
    if (/public\s+static\s+void\s+main/.test(code)) {
      // Check for String[] args specifically
      if (!/public\s+static\s+void\s+main\s*\(\s*String\s*\[\]\s*\w+\s*\)/.test(code)) {
        warnings.push('Main method parameter should be String[] args (capital S, square brackets).');
      }
    }

    // Common: using "string" instead of "String"
    if (/\bstring\b/.test(code) && !/\bString\b/.test(code)) {
      warnings.push('"string" should be capitalized → "String" (Java is case-sensitive).');
    }

    // Missing semicolons — skip whichever line the cursor is currently on
    const allLines = code.split('\n');
    const stmtLines = allLines.filter((l, idx) => {
      if (idx === cursorLine) return false; // don't nag the line they're editing
      const trimmed = l.trim();
      return trimmed.length > 0
        && !trimmed.startsWith('//')
        && !trimmed.startsWith('import ')  // imports checked separately
        && !trimmed.endsWith('{')
        && !trimmed.endsWith('}')
        && !trimmed.startsWith('public class')
        && !trimmed.startsWith('public static void')
        && /[a-zA-Z0-9")\]]$/.test(trimmed);  // ends with identifier/value but no semicolon
    });
    if (stmtLines.length > 0) {
      warnings.push('Some lines may be missing semicolons — Java requires ; at the end of each statement.');
    }

    // System.out.Println (capital P)
    if (/System\.out\.Println/.test(code)) {
      warnings.push('"Println" should be lowercase → "println" (Java is case-sensitive).');
    }

    return warnings;
  }, [code, submitted, expectedClass, cursorLine]);

  // ── "Looks complete" detection for fire effect ──
  // Glow whenever the code has enough structure to be a real attempt,
  // even if there are warnings — students should feel encouraged to submit and learn from the test results.
  const looksComplete = useMemo(() => {
    if (submitted || code.trim().length === 0) return false;
    const hasClass = /public\s+class\s+\w+/.test(code);
    const hasMain = /public\s+static\s+void\s+main/.test(code);
    const hasOutput = /System\.out\.print/.test(code);
    const hasClosingBraces = (code.match(/}/g) || []).length >= 2;
    return hasClass && hasMain && hasOutput && hasClosingBraces;
  }, [code, submitted]);

  const handleSubmit = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    // 1. Syntax check — errors become a test result, NOT a blocker
    const parseResult = parseJava(code, 'full');
    setSyntaxErrors(parseResult.errors);

    const allTests: TestResult[] = [];

    // Compilation test (syntax)
    if (parseResult.errors.length > 0) {
      const errorSummary = parseResult.errors
        .map(e => `Line ${e.line}: ${e.message}`)
        .join('\n');
      allTests.push({
        name: 'testCompilation',
        label: `${filename} compiles without errors`,
        passed: false,
        detail: errorSummary,
      });
    } else {
      allTests.push({
        name: 'testCompilation',
        label: `${filename} compiles without errors`,
        passed: true,
      });
    }

    // 2. Run structural + output test suite
    const structuralTests = runTestSuite(code, filename, expectedOutput, requiredElements);
    allTests.push(...structuralTests);

    setTestResults(allTests);

    const failCount = allTests.filter(t => !t.passed).length;
    const passCount = allTests.filter(t => t.passed).length;

    // 3. Determine result
    setSubmitted(true);
    setRunnerPhase('compiling');

    // Penalty scales with hints used (manual + idle nudges)
    const hintPenalty = Math.min(
      (manualHintIndex + 1) + Math.floor(nudgeCount / 2),
      3,
    );

    // Build explanation for review modal
    const explanation = allTests
      .map(t => `${t.passed ? 'PASS' : 'FAIL'} ${t.name} — ${t.label}${t.detail ? `\n     ${t.detail}` : ''}`)
      .join('\n') + `\n\nTests passed: ${passCount}/${allTests.length}`;

    // Store answer — don't fire onAnswer yet; wait for animation to finish
    if (failCount === 0) {
      pendingAnswerRef.current = { isCorrect: true, penalty: hintPenalty, code, explanation };
    } else if (failCount <= 1) {
      pendingAnswerRef.current = { isCorrect: false, penalty: 1 + hintPenalty, code, explanation };
    } else {
      pendingAnswerRef.current = { isCorrect: false, penalty: 2 + hintPenalty, code, explanation };
    }
  }, [code, filename, expectedOutput, requiredElements, manualHintIndex, nudgeCount]);

  // ── Test runner animation ──
  useEffect(() => {
    if (runnerPhase === 'idle') return;

    if (runnerPhase === 'compiling') {
      const t = setTimeout(() => setRunnerPhase('running'), 400);
      return () => clearTimeout(t);
    }
    if (runnerPhase === 'running') {
      const t = setTimeout(() => {
        setRevealedCount(0);
        setRunnerPhase('revealing');
      }, 300);
      return () => clearTimeout(t);
    }
    if (runnerPhase === 'revealing') {
      if (revealedCount < testResults.length) {
        const t = setTimeout(() => setRevealedCount(prev => prev + 1), 250);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setRunnerPhase('done'), 300);
        return () => clearTimeout(t);
      }
    }
    if (runnerPhase === 'done') {
      // Animation finished — now fire onAnswer so FeedbackOverlay appears
      const pending = pendingAnswerRef.current;
      if (pending) {
        pendingAnswerRef.current = null;
        onAnswer(pending.isCorrect, pending.penalty, pending.code, pending.explanation);
      }
    }
  }, [runnerPhase, revealedCount, testResults.length, onAnswer]);

  const handleShowNextHint = () => {
    if (hints && manualHintIndex < hints.length - 1) {
      setManualHintIndex(prev => prev + 1);
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

        {/* File tab + Code editor — grouped to eliminate gap */}
        <div>
          <div className="flex items-center">
            <div className="px-3 py-1.5 bg-muted/50 border border-b-0 border-border/50 rounded-t-lg text-xs font-mono text-foreground/80 flex items-center gap-1.5">
              <span className="text-blue-400">☕</span>
              {filename}
            </div>
          </div>
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

            {/* Code editor with syntax highlighting */}
            <div ref={editorWrapRef} onKeyUp={updateCursorLine} onMouseUp={updateCursorLine}>
            <Editor
              value={code}
              onValueChange={(newCode) => {
                setCode(newCode);
                setSyntaxErrors([]);
                resetIdleTimer();
              }}
              highlight={(c) => highlightCode(c)}
              disabled={submitted}
              tabSize={4}
              insertSpaces
              padding={8}
              placeholder={`// Write your complete ${filename} program here\n// Start from scratch — imports, class, main method, everything.`}
              textareaClassName="code-editor-textarea"
              className={cn(
                'code-editor-root flex-1',
                submitted && 'opacity-80',
              )}
              style={{
                fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                fontSize: '0.875rem',
                lineHeight: '1.5rem',
                minHeight: `${Math.max(lines.length * 24 + 16, 240)}px`,
              }}
            />
            </div>
          </div>
        </div>
        </div>

        {/* Live warnings — pre-submit mistake detection */}
        {!submitted && liveWarnings.length > 0 && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-2.5 space-y-1">
            {liveWarnings.map((w, i) => (
              <p key={i} className="text-xs text-amber-400/70 flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                {w}
              </p>
            ))}
          </div>
        )}

        {/* Idle nudge — subtle, appears after inactivity */}
        {idleNudge && !submitted && (
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-2.5 flex items-start gap-2 animate-in fade-in duration-500">
            <Lightbulb className="w-4 h-4 text-blue-400/70 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-400/70 italic">{idleNudge}</p>
          </div>
        )}

        {/* Syntax errors — live pre-submit preview (also shown as test result post-submit) */}
        {!submitted && syntaxErrors.length > 0 && (
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

        {/* Test runner output (post-submit) */}
        {submitted && runnerPhase !== 'idle' && (
          <div className="rounded-lg border border-border/50 bg-black/60 font-mono text-sm overflow-hidden">
            <div className="px-4 py-2 border-b border-border/30 flex items-center gap-2 text-muted-foreground text-xs">
              <Terminal className="w-3.5 h-3.5" />
              Test Results
            </div>
            <div className="p-4 space-y-1.5">
              {/* Compiling */}
              <p className={cn(
                'text-muted-foreground transition-opacity duration-200',
                runnerPhase === 'compiling' ? 'animate-pulse' : 'opacity-60',
              )}>
                $ javac {filename}
                {runnerPhase !== 'compiling' && (
                  syntaxErrors.length > 0
                    ? <span className="text-red-400 ml-2">ERRORS</span>
                    : <span className="text-green-400 ml-2">OK</span>
                )}
              </p>

              {/* Running */}
              {(runnerPhase !== 'compiling') && (
                <p className={cn(
                  'text-muted-foreground transition-opacity duration-200',
                  runnerPhase === 'running' ? 'animate-pulse' : 'opacity-60',
                )}>
                  $ java -jar junit.jar --select-class {filename.replace(/\.java$/, '')}Test
                  {runnerPhase !== 'running' && <span className="text-green-400 ml-2">OK</span>}
                </p>
              )}

              {/* Test results — revealed one by one */}
              {(runnerPhase === 'revealing' || runnerPhase === 'done') && (
                <div className="mt-3 space-y-1">
                  {testResults.slice(0, revealedCount).map((t, i) => (
                    <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-200">
                      <div className="flex items-center gap-2">
                        {t.passed ? (
                          <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                        )}
                        <span className={t.passed ? 'text-green-400' : 'text-red-400'}>
                          {t.passed ? 'PASS' : 'FAIL'}
                        </span>
                        <span className="text-foreground/70">{t.label}</span>
                      </div>
                      {t.detail && !t.passed && (
                        <p className="ml-8 text-xs text-red-400/70 mt-0.5">{t.detail}</p>
                      )}
                    </div>
                  ))}

                  {/* Spinner while still revealing */}
                  {runnerPhase === 'revealing' && revealedCount < testResults.length && (
                    <p className="text-muted-foreground animate-pulse ml-1">...</p>
                  )}
                </div>
              )}

              {/* Summary bar */}
              {runnerPhase === 'done' && (() => {
                const passCount = testResults.filter(t => t.passed).length;
                const allPassed = passCount === testResults.length;
                return (
                  <div className={cn(
                    'mt-3 pt-3 border-t border-border/30 font-semibold',
                    allPassed ? 'text-green-400' : 'text-red-400',
                  )}>
                    Tests passed: {passCount}/{testResults.length}
                    {allPassed && ' — All tests passed!'}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Manual hints (question-authored, on-demand) */}
        {!submitted && hints && hints.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShowNextHint}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <Lightbulb className="w-4 h-4" />
            {manualHintIndex < 0
              ? 'Show Hint'
              : manualHintIndex < hints.length - 1
                ? 'Next Hint'
                : 'No More Hints'}
          </Button>
        )}
        {manualHintIndex >= 0 && hints && (
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-3 space-y-1">
            {hints.slice(0, manualHintIndex + 1).map((hint, i) => (
              <p key={i} className="text-sm text-blue-400/80">
                <span className="font-medium">Hint {i + 1}:</span> {hint}
              </p>
            ))}
          </div>
        )}

        {/* Submit / Result */}
        {!submitted ? (
          <Button
            onClick={handleSubmit}
            className={cn(
              'w-full gap-2 transition-all duration-500',
              looksComplete && 'bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 hover:from-orange-400 hover:via-red-400 hover:to-orange-400 shadow-lg shadow-orange-500/25 animate-pulse',
            )}
          >
            {looksComplete ? (
              <>🔥 Check Program 🔥</>
            ) : (
              <>
                <ChevronRight className="w-4 h-4" />
                Check Program
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            {/* Side-by-side: Your Code vs Sample Solution */}
            {runnerPhase === 'done' && (
              <>
                <div className="space-y-4">
                  {/* Student's code */}
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-medium">Your Code</p>
                    <div className="rounded-lg border border-border/50 bg-black/40 overflow-x-auto">
                      <pre className="font-mono text-sm leading-relaxed text-foreground/90 p-3 whitespace-pre">
                        {highlightLines(code).map((highlighted, i) => (
                          <div key={i} className="px-1">
                            <span className="mr-4 inline-block w-8 text-right text-foreground/40">
                              {i + 1}
                            </span>
                            {highlighted}
                          </div>
                        ))}
                      </pre>
                    </div>
                  </div>
                  {/* Sample solution */}
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-medium">Sample Solution</p>
                    <div className="rounded-lg border border-green-500/20 bg-black/40 overflow-x-auto">
                      <pre className="font-mono text-sm leading-relaxed p-3 whitespace-pre">
                        {highlightLines(sampleSolution).map((highlighted, i) => (
                          <div key={i} className="px-1">
                            <span className="mr-4 inline-block w-8 text-right text-foreground/40">
                              {i + 1}
                            </span>
                            {highlighted}
                          </div>
                        ))}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Continue button — advances to next question */}
                <Button onClick={onContinue} className="w-full gap-2">
                  Continue to Next Question
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
