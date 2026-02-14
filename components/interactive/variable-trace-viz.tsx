'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

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

  const currentStep = steps[currentStepIndex];
  const codeLines = (code || '').split('\n');

  const handleSubmitAnswer = () => {
    const isCorrect = userAnswer.trim() === correctAnswer.trim();
    setAnswerCorrect(isCorrect);
    setAnswered(true);
    onAnswer(isCorrect, isCorrect ? 0 : 1);
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
    <div className="flex flex-col gap-6">
      {/* Question Prompt */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">{questionPrompt}</h3>

        {!answered && (
          <div className="space-y-3">
            {distractors ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {distractors.map((option) => (
                  <Button
                    key={option}
                    variant={userAnswer === option ? 'default' : 'outline'}
                    onClick={() => setUserAnswer(option)}
                    className="font-mono"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            ) : (
              <Input
                placeholder="Enter your answer"
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

        {answered && (
          <div
            className={cn(
              'rounded-lg border px-4 py-2 font-mono text-sm',
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
      </div>

      {answered && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Code Panel */}
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <div className="p-4">
              <Badge variant="secondary" className="mb-3">
                Code
              </Badge>
              <div className="overflow-x-auto rounded border border-border/50 bg-black/40">
                <pre className="font-mono text-xs leading-relaxed text-foreground/90">
                  {codeLines.map((line, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        'px-4 py-1',
                        currentStep.line === idx + 1
                          ? 'bg-yellow-500/20 font-semibold text-yellow-300'
                          : ''
                      )}
                    >
                      <span className="mr-4 inline-block w-8 text-right text-foreground/50">
                        {idx + 1}
                      </span>
                      {line}
                    </div>
                  ))}
                </pre>
              </div>
            </div>
          </Card>

          {/* Variable State Panel */}
          <div className="space-y-4">
            {/* Variables Table */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <div className="p-4">
                <Badge variant="secondary" className="mb-3">
                  Variable State (Step {currentStepIndex + 1} of {steps.length})
                </Badge>
                <div className="space-y-2">
                  {Object.entries(currentStep.variables).length === 0 ? (
                    <p className="text-sm text-foreground/50 italic">
                      No variables initialized yet
                    </p>
                  ) : (
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
                  )}
                </div>
              </div>
            </Card>

            {/* Console Output */}
            {cumulativeOutput && (
              <Card className="bg-card/50 backdrop-blur border-border/50">
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
        </div>
      )}
    </div>
  );
}
