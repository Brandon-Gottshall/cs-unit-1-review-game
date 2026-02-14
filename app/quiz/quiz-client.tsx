"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GameShell } from "@/components/game/game-shell";
import { FeedbackOverlay } from "@/components/game/feedback-overlay";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, RotateCcw, BookOpen, Code, Terminal, AlertTriangle, CheckCircle, Pencil, Trophy, X, Check, HelpCircle, ChevronRight, Clock, Map as MapIcon, Play, FileText } from "lucide-react";
import { SkillTreePage } from "@/components/skill-tree";
import {
  conceptTree,
  populateConceptQuestions,
  type MasteryData,
} from "@/lib/concept-tree";
import {
  unifiedQuestionPool,
  type CSUnifiedQuestion,
  type CSQuestionType,
  shuffleArray,
} from "@/lib/cs-game-data";
import { JavaCodeEditor, VariableTraceViz, CodeOutputComparison } from "@/components/interactive";
import {
  getSession,
  resetSession,
  reconcileSession,
  recordAnswer as srRecordAnswer,
  getNextQuestion,
  getSessionStats,
  isSessionComplete,
  getQuestionProgress,
  saveSession,
  saveSessionIfNewer,
  loadSession,
  clearSavedSession,
} from "@/lib/spaced-repetition";

// History entry type
interface HistoryEntry {
  questionId: string;
  question: string;
  yourAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  timestamp: number;
  type: CSQuestionType;
  chapter: number;
}

// Question type metadata
const typeInfo: Record<CSQuestionType, { label: string; icon: React.ReactNode; color: string }> = {
  vocabulary: { label: "Vocabulary", icon: <BookOpen className="w-4 h-4" />, color: "bg-emerald-500/20 text-emerald-400" },
  true_false: { label: "True/False", icon: <CheckCircle className="w-4 h-4" />, color: "bg-purple-500/20 text-purple-400" },
  trace_variables: { label: "Trace", icon: <Code className="w-4 h-4" />, color: "bg-rose-500/20 text-rose-400" },
  predict_output: { label: "Output", icon: <Play className="w-4 h-4" />, color: "bg-amber-500/20 text-amber-400" },
  identify_error: { label: "Bug Hunt", icon: <AlertTriangle className="w-4 h-4" />, color: "bg-violet-500/20 text-violet-400" },
  complete_code: { label: "Complete", icon: <Pencil className="w-4 h-4" />, color: "bg-cyan-500/20 text-cyan-400" },
  valid_invalid: { label: "Valid?", icon: <HelpCircle className="w-4 h-4" />, color: "bg-orange-500/20 text-orange-400" },
  match_definition: { label: "Match", icon: <BookOpen className="w-4 h-4" />, color: "bg-emerald-500/20 text-emerald-400" },
  code_analysis: { label: "Analyze", icon: <FileText className="w-4 h-4" />, color: "bg-teal-500/20 text-teal-400" },
};

// Lazy-build a map for quick lookup
let _questionMap: Map<string, CSUnifiedQuestion> | null = null;
function getQuestionMap(): Map<string, CSUnifiedQuestion> {
  if (!_questionMap) {
    _questionMap = new Map<string, CSUnifiedQuestion>();
    for (const q of unifiedQuestionPool) {
      _questionMap.set(q.id, q);
    }
  }
  return _questionMap;
}

// History Panel Component
function HistoryPanel({
  history,
  isOpen,
  onClose,
  onReviewQuestion
}: {
  history: HistoryEntry[];
  isOpen: boolean;
  onClose: () => void;
  onReviewQuestion: (questionId: string) => void;
}) {
  if (!isOpen) return null;

  const correctCount = history.filter(h => h.isCorrect).length;
  const incorrectCount = history.length - correctCount;
  const accuracy = history.length > 0 ? Math.round((correctCount / history.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative ml-auto w-full max-w-md bg-card border-l border-border h-full overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Question History
            </h2>
            <p className="text-sm text-muted-foreground">
              {history.length} answered • <span className="text-green-400">{correctCount} ✓</span> • <span className="text-red-400">{incorrectCount} ✗</span> • <span className={accuracy >= 80 ? "text-green-400" : accuracy >= 60 ? "text-amber-400" : "text-foreground"}>{accuracy}% accuracy</span>
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* History list */}
        <div className="flex-1 overflow-y-auto p-2">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Clock className="w-12 h-12 mb-2 opacity-50" />
              <p>No questions answered yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {[...history].reverse().map((entry, idx) => {
                const info = typeInfo[entry.type];
                return (
                  <button
                    key={`${entry.questionId}-${entry.timestamp}`}
                    onClick={() => onReviewQuestion(entry.questionId)}
                    className={`w-full text-left p-3 rounded-lg border transition-all hover:bg-muted/50 ${
                      entry.isCorrect
                        ? 'border-green-500/30 bg-green-500/5'
                        : 'border-red-500/30 bg-red-500/5'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        entry.isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {entry.isCorrect ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className={`text-xs ${info.color}`}>
                            {info.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Ch. {entry.chapter}</span>
                        </div>
                        <p className="text-sm font-medium line-clamp-2">{entry.question}</p>
                        {!entry.isCorrect && (
                          <p className="text-xs text-muted-foreground mt-1">
                            <span className="text-red-400">Your answer:</span> {entry.yourAnswer || '(skipped)'}
                          </p>
                        )}
                        <p className="text-xs text-green-400 mt-0.5">
                          Answer: {entry.correctAnswer.substring(0, 60)}{entry.correctAnswer.length > 60 ? '...' : ''}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── CodeAnswerOptions: MC answer options for code-based questions ─────────────
// Used by identify_error and complete_code question types alongside JavaCodeEditor.
// Renders distractors as MC options if available, otherwise falls back to self-assessment.
interface CodeAnswerOptionsProps {
  question: CSUnifiedQuestion;
  onAnswer: (isCorrect: boolean, explanation: string, penalty: number, selectedAnswer?: string) => void;
}

function CodeAnswerOptions({ question, onAnswer }: CodeAnswerOptionsProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [attempt, setAttempt] = useState(1);
  const [eliminatedOptions, setEliminatedOptions] = useState<Set<string>>(new Set());

  const options = useMemo(() => {
    if (question.distractors && question.distractors.length > 0) {
      return shuffleArray([question.correctAnswer, ...question.distractors.slice(0, 3)]);
    }
    return null;
  }, [question]);

  const allowTwoGuesses = options && options.length > 2;

  const handleSelect = (answer: string) => {
    if (hasSubmitted || eliminatedOptions.has(answer)) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    const isCorrect = selectedAnswer === question.correctAnswer;

    if (isCorrect) {
      setHasSubmitted(true);
      const explanation = question.explanation || question.correctAnswer;
      setTimeout(() => onAnswer(true, explanation, attempt === 1 ? 0 : 1, selectedAnswer), 500);
    } else if (allowTwoGuesses && attempt === 1) {
      setEliminatedOptions(prev => new Set([...prev, selectedAnswer]));
      setSelectedAnswer(null);
      setAttempt(2);
    } else {
      setHasSubmitted(true);
      const explanation = question.explanation
        ? `${question.correctAnswer}\n\n${question.explanation}`
        : question.correctAnswer;
      setTimeout(() => onAnswer(false, explanation, 2, selectedAnswer), 500);
    }
  };

  if (!options) {
    // Fallback: no distractors, just "I Understand"
    return (
      <Button
        onClick={() => onAnswer(true, question.explanation || question.correctAnswer, 0)}
        className="w-full gap-2"
      >
        <Check className="w-4 h-4" />
        I Understand
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      {attempt === 2 && !hasSubmitted && (
        <div className="flex items-center gap-2 text-amber-400 text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>Second chance — one option eliminated</span>
        </div>
      )}
      {options.map((option, idx) => {
        const isSelected = selectedAnswer === option;
        const isCorrect = option === question.correctAnswer;
        const showResult = hasSubmitted;
        const isEliminated = eliminatedOptions.has(option);

        let className = "w-full p-4 text-left rounded-lg border transition-all ";
        if (isEliminated) {
          className += "border-red-500/30 bg-red-500/5 opacity-40 cursor-not-allowed line-through";
        } else if (showResult) {
          if (isCorrect) {
            className += "border-green-500 bg-green-500/10 text-green-400";
          } else if (isSelected && !isCorrect) {
            className += "border-red-500 bg-red-500/10 text-red-400";
          } else {
            className += "border-border/50 opacity-50";
          }
        } else if (isSelected) {
          className += "border-primary bg-primary/10";
        } else {
          className += "border-border/50 hover:border-border hover:bg-muted/30";
        }

        return (
          <button
            key={idx}
            onClick={() => handleSelect(option)}
            disabled={hasSubmitted || isEliminated}
            className={className}
          >
            <span className="text-sm">{option}</span>
          </button>
        );
      })}
      {!hasSubmitted && (
        <Button
          onClick={handleSubmit}
          disabled={!selectedAnswer}
          className="w-full gap-2"
        >
          <Check className="w-4 h-4" />
          Submit Answer
        </Button>
      )}
    </div>
  );
}

interface QuestionCardProps {
  question: CSUnifiedQuestion;
  streak: number;
  onAnswer: (isCorrect: boolean, explanation: string, penalty: number, selectedAnswer?: string) => void;
}

function QuestionCard({ question, streak, onAnswer }: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [attempt, setAttempt] = useState(1);
  const [eliminatedOptions, setEliminatedOptions] = useState<Set<string>>(new Set());
  const [showNoIdeaConfirm, setShowNoIdeaConfirm] = useState(false);

  // Generate answer options
  const options = useMemo(() => {
    if (question.distractors && question.distractors.length > 0) {
      return shuffleArray([question.correctAnswer, ...question.distractors.slice(0, 3)]);
    }
    return null;
  }, [question]);

  // Is this a non-binary question (more than 2 options)?
  const allowTwoGuesses = options && options.length > 2;

  const handleSelect = (answer: string) => {
    if (hasSubmitted || eliminatedOptions.has(answer)) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer && options) return;

    const isCorrect = selectedAnswer === question.correctAnswer;

    if (isCorrect) {
      setHasSubmitted(true);
      const penalty = attempt === 1 ? 0 : 1;
      const explanation = question.explanation || question.correctAnswer;
      setTimeout(() => {
        onAnswer(true, explanation, penalty, selectedAnswer!);
      }, 500);
    } else if (allowTwoGuesses && attempt === 1) {
      setEliminatedOptions(prev => new Set([...prev, selectedAnswer!]));
      setSelectedAnswer(null);
      setAttempt(2);
    } else {
      setHasSubmitted(true);
      const explanation = question.explanation
        ? `${question.correctAnswer}\n\n${question.explanation}`
        : question.correctAnswer;
      setTimeout(() => {
        onAnswer(false, explanation, 2, selectedAnswer!);
      }, 500);
    }
  };

  const handleReveal = () => {
    setHasSubmitted(true);
  };

  const handleSelfAssess = (gotIt: boolean) => {
    const explanation = gotIt
      ? (question.explanation || question.correctAnswer)
      : (question.explanation
          ? `${question.correctAnswer}\n\n${question.explanation}`
          : question.correctAnswer);
    onAnswer(gotIt, explanation, gotIt ? 0 : 2, gotIt ? question.correctAnswer : '(self-assessed: missed)');
  };

  const handleNoIdeaClick = () => {
    setShowNoIdeaConfirm(true);
  };

  const handleNoIdeaConfirm = () => {
    setShowNoIdeaConfirm(false);
    setHasSubmitted(true);
    const explanation = question.explanation
      ? `${question.correctAnswer}\n\n${question.explanation}`
      : question.correctAnswer;
    setTimeout(() => {
      onAnswer(false, explanation, 2, '(no idea)');
    }, 300);
  };

  const handleNoIdeaCancel = () => {
    setShowNoIdeaConfirm(false);
  };

  const info = typeInfo[question.type];

  return (
    <Card className="max-w-2xl mx-auto bg-card/50 backdrop-blur border-border/50">
      <CardContent className="p-6 space-y-6">
        {/* Question type badge + streak indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`gap-1.5 ${info.color}`}>
              {info.icon}
              {info.label}
            </Badge>
            {streak > 0 && (
              <Badge variant="outline" className="gap-1 bg-green-500/10 text-green-400 border-green-500/30">
                🔥 {streak}
              </Badge>
            )}
          </div>
          <Badge variant="outline" className="text-muted-foreground">
            {question.section ? `§${question.section}` : `Ch. ${question.chapter}`}
          </Badge>
        </div>

        {/* Question */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold leading-relaxed">{question.question}</h2>
          {question.formula && (
            <p className="text-sm text-muted-foreground font-mono bg-muted/50 px-3 py-1.5 rounded inline-block">
              {question.formula}
            </p>
          )}
        </div>

        {/* Attempt indicator */}
        {attempt === 2 && !hasSubmitted && (
          <div className="flex items-center gap-2 text-amber-400 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Second chance — one option eliminated</span>
          </div>
        )}

        {/* Answer options or reveal button */}
        {options ? (
          <div className="space-y-3">
            {options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === question.correctAnswer;
              const showResult = hasSubmitted;
              const isEliminated = eliminatedOptions.has(option);

              let className = "w-full p-4 text-left rounded-lg border transition-all ";
              if (isEliminated) {
                className += "border-red-500/30 bg-red-500/5 opacity-40 cursor-not-allowed line-through";
              } else if (showResult) {
                if (isCorrect) {
                  className += "border-green-500 bg-green-500/10 text-green-400";
                } else if (isSelected && !isCorrect) {
                  className += "border-red-500 bg-red-500/10 text-red-400";
                } else {
                  className += "border-border/50 opacity-50";
                }
              } else if (isSelected) {
                className += "border-primary bg-primary/10";
              } else {
                className += "border-border/50 hover:border-border hover:bg-muted/30";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(option)}
                  disabled={hasSubmitted || isEliminated}
                  className={className}
                >
                  <span className="text-sm">{option}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {!hasSubmitted ? (
              <div className="text-center space-y-3">
                <p className="text-muted-foreground">Think about the answer, then reveal it.</p>
                {showNoIdeaConfirm ? (
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-3">
                    <p className="text-amber-400 text-sm">Skip this question and see the answer?</p>
                    <div className="flex gap-2 justify-center">
                      <Button
                        onClick={handleNoIdeaConfirm}
                        variant="destructive"
                        size="sm"
                        className="gap-1"
                      >
                        <Check className="w-3 h-3" />
                        Yes, show me
                      </Button>
                      <Button
                        onClick={handleNoIdeaCancel}
                        variant="outline"
                        size="sm"
                        className="gap-1"
                      >
                        <X className="w-3 h-3" />
                        Let me try
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button onClick={handleReveal} variant="outline" className="gap-2">
                      Reveal Answer
                    </Button>
                    <Button
                      onClick={handleNoIdeaClick}
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground gap-2"
                    >
                      <HelpCircle className="w-4 h-4" />
                      I have no idea
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <p className="font-medium text-primary">{question.correctAnswer}</p>
                </div>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => handleSelfAssess(true)}
                    className="gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4" />
                    Got It
                  </Button>
                  <Button
                    onClick={() => handleSelfAssess(false)}
                    variant="destructive"
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    Missed It
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Submit button for multiple choice */}
        {options && !hasSubmitted && (
          <div className="space-y-2">
            {showNoIdeaConfirm ? (
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-3">
                <p className="text-amber-400 text-sm text-center">Skip this question and see the answer?</p>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={handleNoIdeaConfirm}
                    variant="destructive"
                    size="sm"
                    className="gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Yes, show me
                  </Button>
                  <Button
                    onClick={handleNoIdeaCancel}
                    variant="outline"
                    size="sm"
                    className="gap-1"
                  >
                    <X className="w-3 h-3" />
                    Let me try
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                  className="w-full"
                >
                  Submit Answer
                </Button>
                <Button
                  onClick={handleNoIdeaClick}
                  variant="ghost"
                  className="w-full text-muted-foreground hover:text-foreground gap-2"
                >
                  <HelpCircle className="w-4 h-4" />
                  I have no idea
                </Button>
              </>
            )}
          </div>
        )}

        {/* Key facts */}
        {hasSubmitted && question.keyFacts && (
          <div className="pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">Key Facts:</p>
            <ul className="text-sm space-y-1">
              {question.keyFacts.map((fact, idx) => (
                <li key={idx} className="text-muted-foreground">• {fact}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const HISTORY_STORAGE_KEY = 'cs1301-session-history';

export default function QuizClient() {
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, graduated: 0, remaining: 0, struggling: 0, questionsAnswered: 0, accuracy: 0 });
  const [currentStreak, setCurrentStreak] = useState(0);

  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    message: string;
    detail?: string;
  } | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // History tracking
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [reviewingQuestionId, setReviewingQuestionId] = useState<string | null>(null);
  const [reviewFromFeedback, setReviewFromFeedback] = useState(false);
  const [latestAnswer, setLatestAnswer] = useState<{
    questionId: string;
    yourAnswer: string | null;
    isCorrect: boolean;
    explanation?: string;
    keyFacts?: string[];
  } | null>(null);

  // Skill tree
  const [showSkillTree, setShowSkillTree] = useState(false);
  const [populatedConceptTree] = useState(() => {
    const questions = unifiedQuestionPool.map(q => ({
      id: q.id,
      question: q.question,
      type: q.type,
      chapter: q.chapter,
    }));
    return populateConceptQuestions(conceptTree, questions);
  });

  // Build mastery data from history for skill tree
  const masteryData = useMemo((): MasteryData => {
    const data: MasteryData = {};
    for (const entry of history) {
      if (!data[entry.questionId]) {
        data[entry.questionId] = { correct: 0, total: 0 };
      }
      data[entry.questionId].total++;
      if (entry.isCorrect) {
        data[entry.questionId].correct++;
      }
    }
    return data;
  }, [history]);

  // Initialize session on mount - check for saved progress
  useEffect(() => {
    const hasSaved = loadSession();

    if (hasSaved) {
      try {
        const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        }
      } catch (e) {
        console.error('Failed to load history:', e);
      }
      setShowResumePrompt(true);
      setInitialized(true);
    } else {
      const questionIds = unifiedQuestionPool.map(q => q.id);
      getSession(questionIds);
      setCurrentQuestionId(getNextQuestion());
      setStats(getSessionStats());
      setInitialized(true);
    }

    return () => {
      saveSessionIfNewer();
    };
  }, []);

  // Handle resuming or starting fresh
  const handleResumeSession = useCallback(() => {
    setShowResumePrompt(false);
    const questionIds = unifiedQuestionPool.map(q => q.id);
    reconcileSession(questionIds);
    const nextId = getNextQuestion();
    setCurrentQuestionId(nextId);
    setStats(getSessionStats());
    if (nextId) {
      const nextProgress = getQuestionProgress(nextId);
      setCurrentStreak(nextProgress?.streak || 0);
    }
  }, []);

  const handleStartFresh = useCallback(() => {
    setShowResumePrompt(false);
    clearSavedSession();
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    setHistory([]);
    resetSession();
    const questionIds = unifiedQuestionPool.map(q => q.id);
    getSession(questionIds);
    setCurrentQuestionId(getNextQuestion());
    setStats(getSessionStats());
    setCurrentStreak(0);
  }, []);

  const currentQuestion = currentQuestionId ? getQuestionMap().get(currentQuestionId) : null;
  const progress = getQuestionProgress(currentQuestionId || '');

  const handleAnswer = useCallback(
    (isCorrect: boolean, explanation: string, penalty: number, selectedAnswer?: string) => {
      if (!currentQuestionId) return;

      const question = getQuestionMap().get(currentQuestionId);
      if (!question) return;

      const newState = srRecordAnswer(currentQuestionId, isCorrect, penalty);
      setCurrentStreak(newState.streak);

      setLatestAnswer({
        questionId: currentQuestionId,
        yourAnswer: selectedAnswer || null,
        isCorrect,
        explanation,
        keyFacts: question.keyFacts,
      });

      const newEntry: HistoryEntry = {
        questionId: currentQuestionId,
        question: question.question,
        yourAnswer: selectedAnswer || null,
        correctAnswer: question.correctAnswer,
        isCorrect,
        timestamp: Date.now(),
        type: question.type,
        chapter: question.chapter,
      };
      setHistory(prev => {
        const updated = [...prev, newEntry];
        try {
          localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.error('Failed to save history:', e);
        }
        return updated;
      });

      setStats(getSessionStats());
      saveSession();

      let message: string;
      if (!isCorrect) {
        message = "Not quite — you'll see this again soon";
      } else if (penalty === 1) {
        message = "Got it on the second try";
      } else if (newState.graduated) {
        message = "Mastered! 🎉";
      } else if (newState.streak === 1) {
        message = "Correct!";
      } else {
        message = `${newState.streak}x streak!`;
      }

      setFeedback({
        isCorrect,
        message,
        detail: explanation,
      });
      setShowFeedback(true);
    },
    [currentQuestionId]
  );

  const handleContinue = useCallback(() => {
    setShowFeedback(false);
    setFeedback(null);
    setLatestAnswer(null);

    const nextId = getNextQuestion();
    setCurrentQuestionId(nextId);
    setStats(getSessionStats());

    if (nextId) {
      const nextProgress = getQuestionProgress(nextId);
      setCurrentStreak(nextProgress?.streak || 0);
    }
  }, []);

  const handleRestart = () => {
    clearSavedSession();
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    resetSession();
    const questionIds = unifiedQuestionPool.map(q => q.id);
    getSession(questionIds);
    setCurrentQuestionId(getNextQuestion());
    setStats(getSessionStats());
    setCurrentStreak(0);
    setHistory([]);
  };

  const handleReviewQuestion = useCallback((questionId: string) => {
    setReviewingQuestionId(questionId);
    setShowHistory(false);
  }, []);

  const handleCloseReview = useCallback(() => {
    setReviewingQuestionId(null);
    setLatestAnswer(null);
    if (reviewFromFeedback) {
      setReviewFromFeedback(false);
      const nextId = getNextQuestion();
      setCurrentQuestionId(nextId);
      setStats(getSessionStats());
      if (nextId) {
        const nextProgress = getQuestionProgress(nextId);
        setCurrentStreak(nextProgress?.streak || 0);
      }
    }
  }, [reviewFromFeedback]);

  const handleFinish = () => {
    clearSavedSession();
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    resetSession();
    router.push('/');
  };

  if (!initialized) {
    return (
      <GameShell title="Loading..." description="Preparing questions">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </GameShell>
    );
  }

  // Resume prompt
  if (showResumePrompt) {
    const savedStats = getSessionStats();
    return (
      <GameShell title="Welcome Back!" description="Continue your study session">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Clock className="w-16 h-16 text-white" />
            </div>
          </div>

          <div className="text-center space-y-4 max-w-md">
            <h2 className="text-2xl font-bold">Previous Session Found</h2>
            <div className="text-muted-foreground space-y-1">
              <p>Progress: {savedStats.graduated} of {savedStats.total} mastered</p>
              <p>Questions answered: {savedStats.questionsAnswered}</p>
              <p>Accuracy: {savedStats.accuracy}%</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleResumeSession}
              size="lg"
              className="gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              Continue Session
            </Button>
            <Button
              onClick={handleStartFresh}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Start Fresh
            </Button>
          </div>
        </div>
      </GameShell>
    );
  }

  // Session complete!
  if (isSessionComplete() || !currentQuestion) {
    return (
      <GameShell
        title="Session Complete!"
        description="You've mastered all questions"
      >
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
          <div className="relative">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Trophy className="w-20 h-20 text-white" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">All Questions Mastered!</h2>
            <p className="text-muted-foreground">
              You answered {stats.questionsAnswered} questions with {stats.accuracy}% accuracy
            </p>
            {stats.struggling > 0 && (
              <p className="text-amber-400 text-sm flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {stats.struggling} items needed extra practice
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={handleRestart} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Practice Again
            </Button>
            <Button onClick={handleFinish} className="gap-2">
              Back to Home
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </GameShell>
    );
  }

  const progressPercent = stats.total > 0 ? (stats.graduated / stats.total) * 100 : 0;

  return (
    <GameShell
      title="Cram Session"
      description={`${stats.graduated} / ${stats.total} mastered`}
    >
      {/* Progress bar */}
      <div className="max-w-2xl mx-auto mb-6">
        <Progress value={progressPercent} className="h-2" />
      </div>

      <div className="py-4 pb-20">
        {currentQuestion && currentQuestion.type === 'trace_variables' && currentQuestion.interactive?.variantData ? (
          <VariableTraceViz
            key={currentQuestionId}
            code={currentQuestion.interactive.variantData.code}
            steps={currentQuestion.interactive.variantData.steps?.map((desc, idx) => ({
              line: idx + 1,
              statement: desc,
              variables: {},
            })) || []}
            questionPrompt={currentQuestion.question}
            correctAnswer={currentQuestion.correctAnswer}
            distractors={currentQuestion.distractors}
            onAnswer={(isCorrect, penalty) => handleAnswer(isCorrect, currentQuestion.correctAnswer, penalty)}
          />
        ) : currentQuestion && currentQuestion.type === 'predict_output' && currentQuestion.interactive?.outputData ? (
          <CodeOutputComparison
            key={currentQuestionId}
            code={currentQuestion.interactive.outputData.code}
            expectedOutput={currentQuestion.interactive.outputData.expectedOutput}
            questionPrompt={currentQuestion.question}
            onAnswer={(isCorrect, penalty) => handleAnswer(isCorrect, currentQuestion.correctAnswer, penalty)}
          />
        ) : currentQuestion && (currentQuestion.type === 'identify_error' || currentQuestion.type === 'complete_code') && currentQuestion.formula ? (
          <Card className="max-w-2xl mx-auto bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={`gap-1.5 ${typeInfo[currentQuestion.type].color}`}>
                  {typeInfo[currentQuestion.type].icon}
                  {typeInfo[currentQuestion.type].label}
                </Badge>
                <Badge variant="outline" className="text-muted-foreground">
                  {currentQuestion.section ? `§${currentQuestion.section}` : `Ch. ${currentQuestion.chapter}`}
                </Badge>
              </div>

              <h2 className="text-xl font-semibold leading-relaxed">{currentQuestion.question}</h2>

              <JavaCodeEditor
                initialCode={currentQuestion.formula || ''}
                readOnly={currentQuestion.type === 'identify_error'}
                parseMode={/\bclass\s/.test(currentQuestion.formula || '') ? 'full' : 'statements'}
                highlightLines={currentQuestion.interactive?.errorData?.errorLine ? [currentQuestion.interactive.errorData.errorLine] : []}
                highlightColor={currentQuestion.type === 'identify_error' ? 'error' : 'warning'}
                maxHeight="300px"
                showErrors={false}
              />

              {currentQuestion.keyFacts && (
                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-2">Key Facts:</p>
                  <ul className="text-sm space-y-1">
                    {currentQuestion.keyFacts.map((fact, idx) => (
                      <li key={idx} className="text-muted-foreground">• {fact}</li>
                    ))}
                  </ul>
                </div>
              )}

              <CodeAnswerOptions
                question={currentQuestion}
                onAnswer={handleAnswer}
              />
            </CardContent>
          </Card>
        ) : currentQuestion ? (
          <QuestionCard
            key={currentQuestionId}
            question={currentQuestion}
            streak={progress?.streak || 0}
            onAnswer={handleAnswer}
          />
        ) : null}
      </div>

      {/* Bottom stats bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t border-border py-3 px-4">
        <div className="max-w-2xl mx-auto flex justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              <span className="font-bold text-primary">{stats.graduated}</span> / {stats.total} mastered
            </span>
            <span className="text-muted-foreground">
              <span className="font-bold text-foreground">{stats.remaining}</span> remaining
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSkillTree(true)}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <MapIcon className="w-4 h-4" />
              Map
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(true)}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Clock className="w-4 h-4" />
              ({history.length})
            </Button>
            <span className={progressPercent >= 80 ? "text-green-400" : progressPercent >= 40 ? "text-amber-400" : "text-foreground"}>
              {Math.round(progressPercent)}% mastery
            </span>
          </div>
        </div>
      </div>

      <FeedbackOverlay
        isVisible={showFeedback}
        isCorrect={feedback?.isCorrect ?? false}
        message={feedback?.message ?? ""}
        detail={feedback?.detail}
        onContinue={handleContinue}
        onReviewQuestion={() => {
          setShowFeedback(false);
          if (currentQuestionId) {
            setReviewingQuestionId(currentQuestionId);
            setReviewFromFeedback(true);
          }
        }}
        onShowHistory={() => {
          setShowFeedback(false);
          setShowHistory(true);
        }}
        onShowSkillTree={() => {
          setShowFeedback(false);
          setShowSkillTree(true);
        }}
        historyCount={history.length}
      />

      {/* History panel */}
      <HistoryPanel
        history={history}
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onReviewQuestion={handleReviewQuestion}
      />

      {/* Review question modal */}
      {reviewingQuestionId && (() => {
        const reviewQuestion = getQuestionMap().get(reviewingQuestionId);
        const historyEntry = history.find(h => h.questionId === reviewingQuestionId);
        const answerInfo = (latestAnswer?.questionId === reviewingQuestionId)
          ? latestAnswer
          : historyEntry;
        if (!reviewQuestion) return null;

        const info = typeInfo[reviewQuestion.type];
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={handleCloseReview}
            />
            <div className="relative max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`gap-1.5 ${info.color}`}>
                    {info.icon}
                    {info.label}
                  </Badge>
                  <Badge variant="outline" className="text-muted-foreground">
                    {reviewQuestion.section ? `§${reviewQuestion.section}` : `Ch. ${reviewQuestion.chapter}`}
                  </Badge>
                  {answerInfo && (
                    <Badge variant="outline" className={answerInfo.isCorrect ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}>
                      {answerInfo.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={handleCloseReview}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <h2 className="text-xl font-semibold">{reviewQuestion.question}</h2>

              {reviewQuestion.formula && (
                <p className="text-sm text-muted-foreground font-mono bg-muted/50 px-3 py-1.5 rounded inline-block">
                  {reviewQuestion.formula}
                </p>
              )}

              {/* Show all answer options */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Answer Options:</p>
                {(() => {
                  const allOptions = [reviewQuestion.correctAnswer, ...(reviewQuestion.distractors || [])];
                  return allOptions.map((option, idx) => {
                    const isCorrect = option === reviewQuestion.correctAnswer;
                    const wasSelected = answerInfo?.yourAnswer === option;

                    let className = "p-3 rounded-lg border text-sm ";
                    if (isCorrect) {
                      className += "bg-green-500/10 border-green-500/30 text-green-400";
                    } else if (wasSelected) {
                      className += "bg-red-500/10 border-red-500/30 text-red-400";
                    } else {
                      className += "bg-muted/30 border-border/50 text-muted-foreground";
                    }

                    return (
                      <div key={idx} className={className}>
                        <div className="flex items-center gap-2">
                          {isCorrect && <Check className="w-4 h-4 text-green-400 flex-shrink-0" />}
                          {wasSelected && !isCorrect && <X className="w-4 h-4 text-red-400 flex-shrink-0" />}
                          <span>{option}</span>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Show explanation */}
              {(latestAnswer?.questionId === reviewingQuestionId && latestAnswer.explanation) ? (
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Explanation:</p>
                  <p className="text-sm whitespace-pre-line">{latestAnswer.explanation}</p>
                </div>
              ) : reviewQuestion.explanation ? (
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Explanation:</p>
                  <p className="text-sm">{reviewQuestion.explanation}</p>
                </div>
              ) : null}

              {/* Show key facts */}
              {(() => {
                const keyFacts = (latestAnswer?.questionId === reviewingQuestionId && latestAnswer.keyFacts)
                  ? latestAnswer.keyFacts
                  : reviewQuestion.keyFacts;
                if (!keyFacts || keyFacts.length === 0) return null;
                return (
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-2">Key Facts:</p>
                    <ul className="text-sm space-y-1">
                      {keyFacts.map((fact, idx) => (
                        <li key={idx} className="text-muted-foreground">• {fact}</li>
                      ))}
                    </ul>
                  </div>
                );
              })()}

              <Button onClick={handleCloseReview} className="w-full gap-2">
                {reviewFromFeedback ? (
                  <>
                    Continue to Next Question
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  'Close Review'
                )}
              </Button>
            </div>
          </div>
        );
      })()}

      {/* Skill Tree / Concept Map */}
      {showSkillTree && (
        <SkillTreePage
          concepts={populatedConceptTree}
          masteryData={masteryData}
          onSelectConcept={(conceptId) => {
            setShowSkillTree(false);
          }}
          onClose={() => setShowSkillTree(false)}
        />
      )}
    </GameShell>
  );
}
