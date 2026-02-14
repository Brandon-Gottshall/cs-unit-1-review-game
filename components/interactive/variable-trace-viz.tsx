'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { shuffleArray } from '@/lib/cs-game-data';
import { highlightLine } from '@/lib/java-syntax-highlight';

export interface TraceStep {
  line: number;
  statement: string;
  variables: Record<string, { type: string; value: string | number | boolean }>;
  output?: string;
  highlight?: 'changed' | 'new';
  changedVars?: string[];
}

export interface VariableTraceVizProps {
  code: string;
  steps: TraceStep[];
  onAnswer: (isCorrect: boolean, penalty: number) => void;
  questionPrompt: string;
  correctAnswer: string;
  distractors?: string[];
}

export function VariableTraceViz({
  code,
  steps,
  onAnswer,
  questionPrompt,
  correctAnswer,
  distractors,
}: VariableTraceVizProps) {
  const [answered, setAnswered] = useState(false);
  const [answerCorrect, setAnswerCorrect] = useState<boolean | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [animatingVars, setAnimatingVars] = useState<Set<string>>(new Set());
  const [attempt, setAttempt] = useState(1);
  const [eliminatedOptions, setEliminatedOptions] = useState<Set<string>>(new Set());

  const currentStep = steps[currentStepIndex];
  const codeLines = (code || '').split('\n');

  // Build shuffled MC options that include the correct answer
  const options = useMemo(() => {
    if (distractors && distractors.length > 0) {
      return shuffleArray([correctAnswer, ...distractors.slice(0, 3)]);
    }
    return null;
  }, [correctAnswer, distractors]);

  const allowTwoGuesses = options && options.length > 2;

  const handleSubmitAnswer = () => {
    if (!userAnswer) return;
    const isCorrect = userAnswer.trim() === correctAnswer.trim();

    if (isCorrect) {
      setAnswerCorrect(true);
      setAnswered(true);
      onAnswer(true, attempt === 1 ? 0 : 1);
    } else if (allowTwoGuesses && attempt === 1) {
      setEliminatedOptions(prev => new Set([...prev, userAnswer]));
      setUserAnswer('');
      setAttempt(2);
    } else {
      setAnswerCorrect(false);
      setAnswered(true);
      onAnswer(false, 2);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1];
      const changedVars = nextStep.changedVars || [];
      setAnimatingVars(new Set(changedVars));
      setCurrentStepIndex(currentStepIndex + 1);
      setTimeout(() => setAnimatingVars(new Set()), 600);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setAnimatingVars(new Set());
    }
  };

  const cumulativeOutput = steps
    .slice(0, currentStepIndex + 1)
    .filter((step) => step.output)
    .map((step) => step.output)
    .join('\n');

  return (
    <Card className="max-w-2xl mx-auto bg-card/50 backdrop-blur border-border/50">
      <div className="p-6 space-y-6">
        {/* Badge row */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="gap-1.5 text-cyan-400 border-cyan-500/30 bg-cyan-500/10">
            <span className="text-sm">🔍</span>
            Trace
          </Badge>
        </div>

        {/* Question */}
        <h2 className="text-xl font-semibold leading-relaxed">{questionPrompt}</h2>

        {/* Code — ALWAYS visible so student can read it before answering */}
        <div className="overflow-x-auto rounded-lg border border-border/50 bg-black/40">
          <pre className="font-mono text-sm leading-relaxed text-foreground/90">
            {codeLines.map((line, idx) => (
              <div
                key={idx}
                className={cn(
                  'px-4 py-1',
                  answered && currentStep?.line === idx + 1
                    ? 'bg-yellow-500/20 font-semibold text-yellow-300'
                    : ''
                )}
              >
                <span className="mr-4 inline-block w-8 text-right text-foreground/40">
                  {idx + 1}
                </span>
                {highlightLine(line)}
              </div>
            ))}
          </pre>
        </div>

        {/* Answer section */}
        {!answered && (
          <div className="space-y-3">
            {/* Two-guess indicator */}
            {attempt === 2 && (
              <div className="flex items-center gap-2 text-amber-400 text-sm">
                <span>⚠</span>
                <span>Second chance — one option eliminated</span>
              </div>
            )}

            {options ? (
              /* MC options — full-width stacked like QuestionCard */
              <div className="space-y-2">
                {options.map((option) => {
                  const isEliminated = eliminatedOptions.has(option);
                  const isSelected = userAnswer === option;
                  return (
                    <button
                      key={option}
                      onClick={() => !isEliminated && setUserAnswer(option)}
                      disabled={isEliminated}
                      className={cn(
                        'w-full text-left px-4 py-3 rounded-lg border transition-all font-mono text-sm',
                        isEliminated
                          ? 'opacity-40 cursor-not-allowed border-border/30 bg-muted/20 line-through'
                          : isSelected
                            ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/50'
                            : 'border-border/50 bg-card/30 hover:bg-card/60 hover:border-border'
                      )}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Free-text input */
              <Input
                placeholder="Enter your answer (e.g. x = 15, y = 10)"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="font-mono"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmitAnswer();
                }}
              />
            )}

            <Button
              onClick={handleSubmitAnswer}
              disabled={!userAnswer}
              className="w-full"
            >
              Submit Answer
            </Button>
          </div>
        )}

        {/* Answer feedback */}
        {answered && (
          <div
            className={cn(
              'rounded-lg border px-4 py-3 font-mono text-sm',
              answerCorrect
                ? 'border-green-500/50 bg-green-500/10 text-green-400'
                : 'border-red-500/50 bg-red-500/10 text-red-400'
            )}
          >
            {answerCorrect ? (
              <>
                <span className="font-semibold">Correct!</span> {correctAnswer}
              </>
            ) : (
              <>
                <span className="font-semibold">Incorrect.</span> You answered{' '}
                <span className="font-bold">{userAnswer}</span>, but the correct answer is{' '}
                <span className="font-bold">{correctAnswer}</span>.
              </>
            )}
          </div>
        )}

        {/* Post-answer: step-through debugger */}
        {answered && steps.length > 0 && Object.keys(currentStep?.variables || {}).length > 0 && (
          <div className="space-y-4 pt-2 border-t border-border/30">
            <p className="text-sm text-muted-foreground">Step through the execution:</p>

            {/* Variable State */}
            <Card className="bg-card/30 border-border/30">
              <div className="p-4">
                <Badge variant="secondary" className="mb-3">
                  Variable State (Step {currentStepIndex + 1} of {steps.length})
                </Badge>
                <div className="space-y-2">
                  {Object.entries(currentStep.variables).map(
                    ([varName, { type, value }]) => (
                      <div
                        key={varName}
                        className={cn(
                          'rounded border border-border/50 bg-black/40 p-3 font-mono text-sm transition-all duration-500',
                          animatingVars.has(varName)
                            ? 'animate-pulse bg-green-500/20 shadow-lg shadow-green-500/20'
                            : ''
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-blue-400">{varName}</span>
                          <span className="text-foreground/70">{type}</span>
                        </div>
                        <div className="mt-1 text-lg font-bold text-foreground">
                          {String(value)}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </Card>

            {/* Console Output */}
            {cumulativeOutput && (
              <Card className="bg-card/30 border-border/30">
                <div className="p-4">
                  <Badge variant="secondary" className="mb-3">
                    Console Output
                  </Badge>
                  <div className="overflow-x-auto rounded border border-border/50 bg-black/40 p-3 font-mono text-sm text-green-400">
                    {cumulativeOutput.split('\n').map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Step Controls */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                className="flex-1"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextStep}
                disabled={currentStepIndex === steps.length - 1}
                className="flex-1"
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
