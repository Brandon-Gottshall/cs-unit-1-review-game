'use client';

import { useEffect, useState } from 'react';
import { Check, X, ArrowRight, Eye, History, Map } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FeedbackOverlayProps {
  isVisible: boolean;
  isCorrect: boolean;
  message: string;
  detail?: string;
  onContinue: () => void;
  onReviewQuestion?: () => void;
  onShowHistory?: () => void;
  onShowSkillTree?: () => void;
  historyCount?: number;
}

export function FeedbackOverlay({
  isVisible,
  isCorrect,
  message,
  detail,
  onContinue,
  onReviewQuestion,
  onShowHistory,
  onShowSkillTree,
  historyCount = 0,
}: FeedbackOverlayProps) {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        'animate-in fade-in duration-200'
      )}
    >
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onContinue}
      />
      
      {/* Feedback card */}
      <div
        className={cn(
          'relative flex flex-col items-center gap-6 p-8 rounded-2xl max-w-md mx-4',
          'bg-card border-2 shadow-2xl',
          'animate-in zoom-in-95 duration-300',
          isCorrect ? 'border-success/50' : 'border-destructive/50'
        )}
      >
        {/* Icon */}
        <div
          className={cn(
            'w-20 h-20 rounded-full flex items-center justify-center',
            isCorrect
              ? 'bg-success/20 text-success shadow-[0_0_40px_rgba(34,197,94,0.4)]'
              : 'bg-destructive/20 text-destructive shadow-[0_0_40px_rgba(239,68,68,0.4)]'
          )}
        >
          {isCorrect ? (
            <Check className="w-10 h-10 stroke-[3]" />
          ) : (
            <X className="w-10 h-10 stroke-[3]" />
          )}
        </div>
        
        {/* Message */}
        <div className="text-center space-y-3">
          <h3
            className={cn(
              'text-2xl font-bold',
              isCorrect ? 'text-success' : 'text-destructive'
            )}
          >
            {message}
          </h3>

          {detail && (
            <div className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              {detail.split('\n').map((line, i) => (
                <p key={i} className={cn(
                  i === 0 && !isCorrect ? 'font-medium text-foreground mb-2' : ''
                )}>
                  {line || <br />}
                </p>
              ))}
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-3">
          {onReviewQuestion && (
            <Button
              onClick={onReviewQuestion}
              variant="outline"
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              Review Question
            </Button>
          )}
          <Button
            onClick={onContinue}
            className={cn(
              'gap-2 px-6',
              isCorrect
                ? 'bg-success hover:bg-success/90 text-success-foreground'
                : 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
            )}
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Secondary actions */}
        {(onShowHistory || onShowSkillTree) && (
          <div className="flex gap-2 pt-2 border-t border-border/30">
            {onShowSkillTree && (
              <Button
                onClick={onShowSkillTree}
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <Map className="w-4 h-4" />
                Map
              </Button>
            )}
            {onShowHistory && (
              <Button
                onClick={onShowHistory}
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <History className="w-4 h-4" />
                History ({historyCount})
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Compact inline feedback for quick responses
export function InlineFeedback({
  isCorrect,
  className,
}: {
  isCorrect: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
        isCorrect
          ? 'bg-success/20 text-success border border-success/30'
          : 'bg-destructive/20 text-destructive border border-destructive/30',
        className
      )}
    >
      {isCorrect ? (
        <>
          <Check className="w-4 h-4" />
          <span>Correct!</span>
        </>
      ) : (
        <>
          <X className="w-4 h-4" />
          <span>Incorrect</span>
        </>
      )}
    </div>
  );
}
