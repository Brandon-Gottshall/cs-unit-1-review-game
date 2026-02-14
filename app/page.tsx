'use client';

import React from "react";
import { useRouter } from 'next/navigation';
import {
  Play,
  BookOpen,
  Terminal,
  AlertTriangle,
  CheckCircle,
  Code,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CodeRain } from '@/components/visualizations/code-rain';
import { unifiedQuestionPool } from '@/lib/cs-game-data';

export default function HomePage() {
  const router = useRouter();

  // Question type counts
  const vocabCount = unifiedQuestionPool.filter(q => q.type === 'vocabulary' || q.type === 'match_definition').length;
  const tracingCount = unifiedQuestionPool.filter(q => q.type === 'trace_variables').length;
  const outputCount = unifiedQuestionPool.filter(q => q.type === 'predict_output').length;
  const errorCount = unifiedQuestionPool.filter(q => q.type === 'identify_error').length;
  const codeAnalysisCount = unifiedQuestionPool.filter(q => q.type === 'valid_invalid' || q.type === 'code_analysis').length;
  const tfCount = unifiedQuestionPool.filter(q => q.type === 'true_false').length;

  return (
    <div className="min-h-screen relative">
      <CodeRain charCount={40} />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero section */}
        <header className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <span>CS 1301K</span>
            <span className="w-1 h-1 rounded-full bg-primary" />
            <span>Exam 1 Prep</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 tracking-tight">
            <span className="gradient-text">Java Cram</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance mb-8">
            Master Java fundamentals through spaced repetition. Get every question right 3× in a row to graduate it.
          </p>

          {/* Main CTA */}
          <Button
            size="lg"
            onClick={() => router.push('/quiz')}
            className="gap-3 text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 shadow-lg shadow-primary/25"
          >
            <Play className="w-5 h-5" />
            Start Cram Session
            <Badge variant="secondary" className="ml-2 bg-background/20">
              {unifiedQuestionPool.length} Questions
            </Badge>
          </Button>
        </header>

        {/* Question pool info */}
        <Card
          className="mb-8 bg-card/50 backdrop-blur border-border/50 animate-slide-up"
          style={{ animationDelay: '100ms' }}
        >
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              Question Pool
            </CardTitle>
            <CardDescription>
              {unifiedQuestionPool.length} questions across all categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="font-semibold">{vocabCount}</p>
                  <p className="text-xs text-muted-foreground">Vocabulary</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <Code className="w-5 h-5 text-rose-400" />
                <div>
                  <p className="font-semibold">{tracingCount}</p>
                  <p className="text-xs text-muted-foreground">Trace Code</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <Terminal className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="font-semibold">{outputCount}</p>
                  <p className="text-xs text-muted-foreground">Output</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <AlertTriangle className="w-5 h-5 text-violet-400" />
                <div>
                  <p className="font-semibold">{errorCount}</p>
                  <p className="text-xs text-muted-foreground">Error Hunt</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <Code className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="font-semibold">{codeAnalysisCount}</p>
                  <p className="text-xs text-muted-foreground">Code Analysis</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <CheckCircle className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="font-semibold">{tfCount}</p>
                  <p className="text-xs text-muted-foreground">True/False</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chapters covered */}
        <Card
          className="bg-card/50 backdrop-blur border-border/50 animate-slide-up mb-8"
          style={{ animationDelay: '200ms' }}
        >
          <CardHeader className="pb-4">
            <CardTitle>Chapters Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {[
                { num: 1, title: 'Intro to Java' },
                { num: 2, title: 'Variables & Assignments' },
              ].map((chapter) => (
                <div
                  key={chapter.num}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border/50"
                >
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-bold flex items-center justify-center">
                    {chapter.num}
                  </span>
                  <span className="text-sm">{chapter.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How it works */}
        <Card
          className="bg-card/50 backdrop-blur border-border/50 animate-slide-up"
          style={{ animationDelay: '300ms' }}
        >
          <CardHeader className="pb-4">
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>• Answer each question correctly <strong className="text-foreground">3 times in a row</strong> to master it</p>
            <p>• Wrong answers reset your streak and the question comes back sooner</p>
            <p>• Questions you struggle with appear more frequently</p>
            <p>• Session ends when all questions are mastered</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
