'use client';

import React from "react";
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function GameShell({
  title,
  description,
  children,
}: GameShellProps) {
  const router = useRouter();

  const handleExit = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleExit}
              className="rounded-full hover:bg-muted"
              aria-label="Exit to home"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                {description}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 relative z-10">
        {children}
      </main>
    </div>
  );
}
