'use client';

import { useEffect, useState } from 'react';

interface CodeRainProps {
  charCount?: number;
  className?: string;
}

const FALLING_CHARS = ['0', '1', '{', '}', ';', '=', '+', '-', 'int', 'void', 'class', 'public'];

interface FallingChar {
  id: string;
  char: string;
  left: number;
  delay: number;
  duration: number;
}

export function CodeRain({ charCount = 40, className = '' }: CodeRainProps) {
  const [chars, setChars] = useState<FallingChar[]>([]);

  useEffect(() => {
    // Generate random falling characters
    const newChars: FallingChar[] = Array.from({ length: charCount }, (_, i) => ({
      id: `char-${i}`,
      char: FALLING_CHARS[Math.floor(Math.random() * FALLING_CHARS.length)],
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 8 + Math.random() * 4, // 8-12 seconds
    }));
    setChars(newChars);
  }, [charCount]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* CSS animations for falling effect */}
      <style>{`
        @keyframes code-fall {
          from {
            transform: translateY(-10vh);
            opacity: 0.15;
          }
          to {
            transform: translateY(110vh);
            opacity: 0.05;
          }
        }

        .code-rain-char {
          animation: code-fall linear forwards;
          position: absolute;
          font-family: 'JetBrains Mono', 'Courier New', monospace;
          font-size: 14px;
          font-weight: 500;
          color: #10b981;
          text-shadow: 0 0 8px rgba(16, 185, 129, 0.3);
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
        }
      `}</style>

      {/* Render falling characters */}
      {chars.map((item) => (
        <div
          key={item.id}
          className="code-rain-char"
          style={{
            left: `${item.left}%`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
            top: '-10vh',
          }}
        >
          {item.char}
        </div>
      ))}
    </div>
  );
}
