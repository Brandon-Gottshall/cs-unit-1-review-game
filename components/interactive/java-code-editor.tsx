'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { parseJava, type DiagnosticError } from '@/lib/java-parser';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

interface JavaCodeEditorProps {
  /** Initial code to display */
  initialCode: string;
  /** Read-only mode (for display/identify-error questions) */
  readOnly?: boolean;
  /** Callback on code change */
  onCodeChange?: (code: string) => void;
  /** Callback when errors update */
  onErrorsChange?: (errors: DiagnosticError[]) => void;
  /** Show the Chevrotain error panel */
  showErrors?: boolean;
  /** Parse mode: 'full' for class-wrapped code, 'statements' for bare statements */
  parseMode?: 'full' | 'statements';
  /** Lines to highlight (1-indexed) */
  highlightLines?: number[];
  /** Highlight color */
  highlightColor?: 'error' | 'success' | 'warning';
  /** Max height */
  maxHeight?: string;
}

export function JavaCodeEditor({
  initialCode,
  readOnly = false,
  onCodeChange,
  onErrorsChange,
  showErrors = true,
  parseMode = 'full',
  highlightLines = [],
  highlightColor = 'error',
  maxHeight = '400px',
}: JavaCodeEditorProps) {
  const [code, setCode] = useState(initialCode || '');
  const [errors, setErrors] = useState<DiagnosticError[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Parse on code change (debounced)
  const runParser = useCallback((newCode: string) => {
    if (!showErrors) return;
    try {
      const result = parseJava(newCode, parseMode);
      setErrors(result.errors);
      onErrorsChange?.(result.errors);
    } catch {
      // Parser crash — don't block the UI
      setErrors([]);
    }
  }, [showErrors, parseMode, onErrorsChange]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runParser(code), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [code, runParser]);

  // Reset when initialCode changes (new question)
  useEffect(() => {
    setCode(initialCode);
    setErrors([]);
  }, [initialCode]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  // Handle tab key for indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      onCodeChange?.(newCode);
      // Restore cursor position
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      });
    }
  };

  const lines = code.split('\n');
  const errorLines = new Set(errors.map(e => e.line));
  const highlightSet = new Set(highlightLines);

  const highlightClasses: Record<string, string> = {
    error: 'bg-red-500/10 border-l-2 border-red-500',
    success: 'bg-green-500/10 border-l-2 border-green-500',
    warning: 'bg-amber-500/10 border-l-2 border-amber-500',
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden bg-card/50 backdrop-blur">
      {/* Editor area */}
      <div className="relative flex" style={{ maxHeight }}>
        {/* Line numbers + error gutter */}
        <div className="flex-shrink-0 bg-muted/30 border-r border-border select-none overflow-hidden">
          {lines.map((_, i) => {
            const lineNum = i + 1;
            const hasError = errorLines.has(lineNum);
            const isHighlighted = highlightSet.has(lineNum);
            return (
              <div
                key={lineNum}
                className={cn(
                  'px-2 h-6 flex items-center justify-end text-xs font-mono',
                  hasError ? 'text-red-400' : 'text-muted-foreground/60',
                  isHighlighted && highlightClasses[highlightColor],
                )}
              >
                {hasError && <AlertTriangle className="w-3 h-3 mr-1 text-red-400" />}
                {lineNum}
              </div>
            );
          })}
        </div>

        {/* Code textarea (overlaid on pre for coloring) */}
        <div className="flex-1 relative overflow-auto">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleChange}
            onKeyDown={readOnly ? undefined : handleKeyDown}
            readOnly={readOnly}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            className={cn(
              'w-full h-full p-3 font-mono text-sm leading-6 bg-transparent resize-none outline-none',
              'text-foreground caret-primary',
              readOnly && 'cursor-default opacity-90',
            )}
            style={{
              fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
              minHeight: `${lines.length * 24 + 24}px`,
              tabSize: 2,
            }}
          />
        </div>
      </div>

      {/* Error panel */}
      {showErrors && errors.length > 0 && (
        <div className="border-t border-border bg-red-500/5 max-h-32 overflow-y-auto">
          {errors.map((err, i) => (
            <div key={i} className="px-3 py-1.5 text-xs flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-red-400 font-medium">Line {err.line}:</span>{' '}
                <span className="text-foreground/80">{err.message}</span>
                {err.hint && (
                  <p className="text-muted-foreground mt-0.5">{err.hint}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
