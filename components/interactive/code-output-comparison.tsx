'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { JavaCodeEditor } from '@/components/interactive/java-code-editor';

export interface CodeOutputComparisonProps {
  code: string;
  expectedOutput: string;
  onAnswer: (isCorrect: boolean, penalty: number) => void;
  questionPrompt?: string;
}

type MatchResult = 'correct' | 'incorrect' | 'partial';

function getMatchResult(
  userOutput: string,
  expectedOutput: string
): { result: MatchResult; penalty: number } {
  // Normalize: strip trailing whitespace on each line, drop empty trailing lines
  const normalize = (s: string) =>
    s.replace(/[ \t]+$/gm, '').replace(/\n+$/, '');

  const userNorm = normalize(userOutput);
  const expectedNorm = normalize(expectedOutput);

  // Exact match (after normalizing trailing spaces/blank lines)
  if (userNorm === expectedNorm) {
    return { result: 'correct', penalty: 0 };
  }

  // Line structure must match — newlines matter (print vs println)
  const userLines = userNorm.split('\n');
  const expectedLines = expectedNorm.split('\n');

  if (userLines.length !== expectedLines.length) {
    return { result: 'incorrect', penalty: 2 };
  }

  // Same line count but minor per-line whitespace diffs → partial credit
  if (userLines.every((line, idx) => line.trim() === expectedLines[idx].trim())) {
    return { result: 'partial', penalty: 1 };
  }

  return { result: 'incorrect', penalty: 2 };
}

function computeDiff(userOutput: string, expectedOutput: string) {
  const normalize = (s: string) =>
    s.replace(/[ \t]+$/gm, '').replace(/\n+$/, '');
  const userLines = normalize(userOutput).split('\n');
  const expectedLines = normalize(expectedOutput).split('\n');
  const maxLines = Math.max(userLines.length, expectedLines.length);

  const diffs: Array<{
    userLine: string | null;
    expectedLine: string | null;
    match: boolean;
  }> = [];

  for (let i = 0; i < maxLines; i++) {
    const userLine = userLines[i] ?? null;
    const expectedLine = expectedLines[i] ?? null;
    const match =
      userLine !== null && expectedLine !== null && userLine.trim() === expectedLine.trim();

    diffs.push({ userLine, expectedLine, match });
  }

  return diffs;
}

export function CodeOutputComparison({
  code,
  expectedOutput,
  onAnswer,
  questionPrompt = 'What does this program output?',
}: CodeOutputComparisonProps) {
  const [userOutput, setUserOutput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  const handleCheckOutput = () => {
    const { result, penalty } = getMatchResult(userOutput, expectedOutput);
    setMatchResult(result);
    setSubmitted(true);

    const isCorrect = result === 'correct';
    onAnswer(isCorrect, penalty);
  };

  const diffs = submitted ? computeDiff(userOutput, expectedOutput) : [];

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {/* Question Prompt */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">{questionPrompt}</h3>
      </div>

      {/* Code Display */}
      <Card className="bg-card/50 backdrop-blur border-border/50 overflow-hidden">
        <div className="p-4">
          <Badge variant="secondary" className="mb-3">
            Code
          </Badge>
          <JavaCodeEditor
            initialCode={code}
            readOnly={true}
            showErrors={false}
          />
        </div>
      </Card>

      {/* Student's Prediction Input */}
      {!submitted && (
        <div className="space-y-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Your Predicted Output
            </label>
            <textarea
              placeholder="Type the program's output here..."
              value={userOutput}
              onChange={(e) => setUserOutput(e.target.value)}
              className={cn(
                'min-h-[120px] w-full rounded-lg border border-border/50 bg-black/40 p-3',
                'font-mono text-sm text-foreground placeholder-foreground/50',
                'focus:outline-none focus:ring-2 focus:ring-primary/50'
              )}
            />
          </div>
          <Button onClick={handleCheckOutput} disabled={!userOutput.trim()} className="w-full">
            Check Output
          </Button>
        </div>
      )}

      {/* Side-by-Side Comparison */}
      {submitted && (
        <div className="space-y-4">
          {/* Result Badge */}
          <div
            className={cn(
              'rounded-lg border px-4 py-3 font-semibold',
              matchResult === 'correct'
                ? 'border-green-500/50 bg-green-500/10 text-green-400'
                : matchResult === 'partial'
                  ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                  : 'border-red-500/50 bg-red-500/10 text-red-400'
            )}
          >
            {matchResult === 'correct' && '✓ Correct! Exact match.'}
            {matchResult === 'partial' &&
              '⚠ Partial credit. Output matches but whitespace differs.'}
            {matchResult === 'incorrect' && '✗ Incorrect. Output does not match.'}
          </div>

          {/* Output Comparison Grid */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Your Prediction */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <div className="p-4">
                <Badge variant="secondary" className="mb-3">
                  Your Prediction
                </Badge>
                <div className="overflow-x-auto rounded border border-border/50 bg-black/40 p-3 font-mono text-sm text-foreground/90">
                  {userOutput.split('\n').map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Actual Output */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <div className="p-4">
                <Badge variant="secondary" className="mb-3">
                  Actual Output
                </Badge>
                <div className="overflow-x-auto rounded border border-border/50 bg-black/40 p-3 font-mono text-sm text-foreground/90">
                  {expectedOutput.split('\n').map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Detailed Diff (if incorrect) */}
          {matchResult !== 'correct' && (
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <div className="p-4">
                <Badge variant="secondary" className="mb-3">
                  Line-by-Line Comparison
                </Badge>
                <div className="space-y-1">
                  {diffs.map((diff, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        'rounded border px-3 py-2 font-mono text-sm',
                        diff.match
                          ? 'border-green-500/30 bg-green-500/10 text-foreground'
                          : 'border-red-500/30 bg-red-500/10'
                      )}
                    >
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <span className="text-foreground/50">Your: </span>
                          <span className={diff.userLine === null ? 'text-red-400/70' : ''}>
                            {diff.userLine ?? '(empty)'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <span className="text-foreground/50">Expected: </span>
                          <span
                            className={diff.expectedLine === null ? 'text-red-400/70' : ''}
                          >
                            {diff.expectedLine ?? '(empty)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
