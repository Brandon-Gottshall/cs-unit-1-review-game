'use client';

import React from 'react';
import { Lock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  type ConceptNode,
  type MasteryData,
  getConceptMastery,
  isConceptUnlocked,
} from '@/lib/concept-tree';

// Mastery threshold (70%)
const MASTERY_THRESHOLD = 0.7;

interface SkillTreeNodeProps {
  id: string;
  name: string;
  description: string;
  mastery: number;
  isUnlocked: boolean;
  isMastered: boolean;
  onClick: () => void;
  x?: number;
  y?: number;
}

export function SkillTreeNode({
  id,
  name,
  description,
  mastery,
  isUnlocked,
  isMastered,
  onClick,
}: SkillTreeNodeProps) {
  const progressPercent = Math.round(mastery * 100);

  return (
    <button
      data-testid={`skill-node-${id}`}
      onClick={() => isUnlocked && onClick()}
      className={cn(
        'relative flex flex-col items-center p-3 rounded-xl border-2 transition-all min-w-[100px]',
        'hover:scale-105',
        isMastered && 'mastered border-green-500 bg-green-500/20',
        !isMastered && isUnlocked && 'border-primary bg-primary/10 cursor-pointer',
        !isUnlocked && 'locked border-muted bg-muted/30 cursor-not-allowed opacity-60'
      )}
    >
      {/* Progress ring */}
      {isUnlocked && !isMastered && mastery > 0 && (
        <svg
          data-testid="progress-ring"
          className="absolute -top-1 -right-1 w-6 h-6"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted"
          />
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
            strokeDasharray={`${mastery * 62.8} 62.8`}
            strokeLinecap="round"
            transform="rotate(-90 12 12)"
          />
        </svg>
      )}

      {/* Icon */}
      <div className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center mb-1',
        isMastered && 'bg-green-500 text-white',
        !isMastered && isUnlocked && 'bg-primary/20 text-primary',
        !isUnlocked && 'bg-muted text-muted-foreground'
      )}>
        {!isUnlocked && <Lock data-testid="lock-icon" className="w-5 h-5" />}
        {isMastered && <Check data-testid="check-icon" className="w-5 h-5" />}
        {isUnlocked && !isMastered && (
          <span className="text-sm font-bold">{progressPercent}%</span>
        )}
      </div>

      {/* Name */}
      <span className={cn(
        'text-xs font-medium text-center leading-tight',
        !isUnlocked && 'text-muted-foreground'
      )}>
        {name}
      </span>
    </button>
  );
}

interface SkillTreeProps {
  concepts: ConceptNode[];
  masteryData: MasteryData;
  onSelectConcept: (conceptId: string) => void;
}

export function SkillTree({
  concepts,
  masteryData,
  onSelectConcept,
}: SkillTreeProps) {
  // Pre-calculate states for all concepts
  const conceptStates = concepts.map(concept => {
    const mastery = getConceptMastery(concept.id, concept.questionIds, masteryData);
    const unlocked = isConceptUnlocked(concept.id, concepts, masteryData);
    const mastered = mastery >= MASTERY_THRESHOLD;
    return { concept, mastery, unlocked, mastered };
  });

  // Generate connection lines between prerequisites
  const connections: Array<{ from: ConceptNode; to: ConceptNode; active: boolean }> = [];
  for (const { concept } of conceptStates) {
    for (const prereqId of concept.prerequisites) {
      const prereq = concepts.find(c => c.id === prereqId);
      if (prereq) {
        const prereqState = conceptStates.find(s => s.concept.id === prereqId);
        connections.push({
          from: prereq,
          to: concept,
          active: prereqState?.mastered ?? false,
        });
      }
    }
  }

  return (
    <div className="relative w-full h-full min-h-[500px]">
      {/* Connection lines (SVG) */}
      <svg
        data-testid="skill-tree-connections"
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        {connections.map(({ from, to, active }, idx) => {
          const x1 = (from.x ?? 50);
          const y1 = (from.y ?? 50);
          const x2 = (to.x ?? 50);
          const y2 = (to.y ?? 50);

          return (
            <line
              key={`${from.id}-${to.id}-${idx}`}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke={active ? 'rgb(34, 197, 94)' : 'rgb(100, 100, 100)'}
              strokeWidth={active ? 3 : 2}
              strokeDasharray={active ? undefined : '5,5'}
              className="transition-all"
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {conceptStates.map(({ concept, mastery, unlocked, mastered }) => (
        <div
          key={concept.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${concept.x ?? 50}%`,
            top: `${concept.y ?? 50}%`,
          }}
        >
          <SkillTreeNode
            id={concept.id}
            name={concept.name}
            description={concept.description}
            mastery={mastery}
            isUnlocked={unlocked}
            isMastered={mastered}
            onClick={() => onSelectConcept(concept.id)}
          />
        </div>
      ))}
    </div>
  );
}

// Also export a full-page skill tree view component
interface SkillTreePageProps {
  concepts: ConceptNode[];
  masteryData: MasteryData;
  onSelectConcept: (conceptId: string) => void;
  onClose: () => void;
}

export function SkillTreePage({
  concepts,
  masteryData,
  onSelectConcept,
  onClose,
}: SkillTreePageProps) {
  // Calculate overall stats
  const totalConcepts = concepts.length;
  const masteredCount = concepts.filter(c => {
    const mastery = getConceptMastery(c.id, c.questionIds, masteryData);
    return mastery >= MASTERY_THRESHOLD;
  }).length;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h2 className="text-xl font-bold">Concept Map</h2>
          <p className="text-sm text-muted-foreground">
            {masteredCount} / {totalConcepts} concepts mastered
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-muted"
        >
          ✕
        </button>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-auto p-4">
        <SkillTree
          concepts={concepts}
          masteryData={masteryData}
          onSelectConcept={onSelectConcept}
        />
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-muted bg-muted/30" />
            <span className="text-muted-foreground">Locked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-primary bg-primary/10" />
            <span>Unlocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-500/20" />
            <span className="text-green-400">Mastered</span>
          </div>
        </div>
      </div>
    </div>
  );
}
