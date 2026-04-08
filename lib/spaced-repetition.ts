"use client";

/**
 * Session-based spaced repetition — concept-level tracking
 *
 * Tracks mastery per CONCEPT, not per individual question.
 * Each time a concept is due, the quiz client picks a never-before-seen
 * variation via the variation picker.
 *
 * Graduation: 3 consecutive first-attempt correct answers on 3 DIFFERENT
 * variations of the same concept.
 *
 * Intervals (same as before):
 * - Wrong → requeue after ~3 questions
 * - Right once → requeue after ~6 questions
 * - Right 2x in a row → requeue after ~12 questions
 * - Right 3x in a row → graduated (done for this session)
 */

const STORAGE_KEY = 'cs1301-session-v2';

// How many questions before seeing this concept again, based on streak
const STREAK_INTERVALS: Record<number, number> = {
  0: 3,   // Just got wrong: see again soon
  1: 6,   // Got right once
  2: 12,  // Got right twice in a row
};

// Penalty levels for wrong guesses
const PENALTY_INTERVALS: Record<number, number> = {
  0: 0,   // No penalty
  1: 4,   // 2nd guess correct: slightly penalized
  2: 2,   // Both wrong: comes back very soon
};

const GRADUATION_STREAK = 3;

export interface ConceptState {
  streak: number;           // Consecutive correct on DIFFERENT variations
  totalCorrect: number;
  totalWrong: number;
  nextAppearance: number;   // Session index when this concept should next appear
  graduated: boolean;       // Done for this session
}

export interface SessionState {
  version: 2;
  concepts: Record<string, ConceptState>;
  currentIndex: number;     // How many questions have been shown
  sessionId: string;
}

// In-memory state
let sessionState: SessionState | null = null;

// Fisher-Yates shuffle
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function initSession(conceptIds: string[]): SessionState {
  const state: SessionState = {
    version: 2,
    concepts: {},
    currentIndex: 0,
    sessionId: Date.now().toString(),
  };

  const shuffled = shuffle(conceptIds);

  shuffled.forEach((id, index) => {
    state.concepts[id] = {
      streak: 0,
      totalCorrect: 0,
      totalWrong: 0,
      nextAppearance: index,
      graduated: false,
    };
  });

  return state;
}

/**
 * Start or get current session
 */
export function getSession(conceptIds: string[]): SessionState {
  if (!sessionState) {
    sessionState = initSession(conceptIds);
  }
  return sessionState;
}

/**
 * Reconcile a loaded session with the current concept pool.
 * Keeps progress for existing concepts, adds new ones, removes stale ones.
 */
export function reconcileSession(currentConceptIds: string[]): void {
  if (!sessionState) return;

  const currentIdSet = new Set(currentConceptIds);
  const savedIds = Object.keys(sessionState.concepts);
  const savedIdSet = new Set(savedIds);

  // Remove concepts no longer in the pool
  for (const id of savedIds) {
    if (!currentIdSet.has(id)) {
      delete sessionState.concepts[id];
    }
  }

  // Add new concepts
  let newIndex = sessionState.currentIndex;
  for (const id of currentConceptIds) {
    if (!savedIdSet.has(id)) {
      sessionState.concepts[id] = {
        streak: 0,
        totalCorrect: 0,
        totalWrong: 0,
        nextAppearance: newIndex++,
        graduated: false,
      };
    }
  }
}

/**
 * Reset session (start fresh)
 */
export function resetSession(): void {
  sessionState = null;
}

/**
 * Record an answer for a concept
 * @param conceptId - the concept that was tested
 * @param correct - whether they got it correct (on any guess)
 * @param penalty - 0 = first guess correct, 1 = second guess correct, 2 = fully wrong
 */
export function recordAnswer(conceptId: string, correct: boolean, penalty: number = 0): ConceptState {
  if (!sessionState) {
    throw new Error('Session not initialized');
  }

  const c = sessionState.concepts[conceptId];
  if (!c) {
    throw new Error(`Unknown concept: ${conceptId}`);
  }

  sessionState.currentIndex++;

  if (correct && penalty === 0) {
    // First guess correct: advance streak
    c.streak++;
    c.totalCorrect++;

    if (c.streak >= GRADUATION_STREAK) {
      c.graduated = true;
      c.nextAppearance = Infinity;
    } else {
      const interval = STREAK_INTERVALS[c.streak] || 12;
      c.nextAppearance = sessionState.currentIndex + interval;
    }
  } else if (correct && penalty === 1) {
    // Second guess correct: partial credit, don't advance streak
    c.totalCorrect++;
    const interval = PENALTY_INTERVALS[1];
    c.nextAppearance = sessionState.currentIndex + interval;
  } else {
    // Fully wrong: reset streak, come back soon
    c.streak = 0;
    c.totalWrong++;
    const interval = PENALTY_INTERVALS[2];
    c.nextAppearance = sessionState.currentIndex + interval;
  }

  return c;
}

/**
 * Get the next concept to show
 * Returns null if all concepts are graduated
 */
export function getNextConcept(): string | null {
  if (!sessionState) return null;

  const candidates: Array<{ id: string; priority: number }> = [];

  for (const [id, state] of Object.entries(sessionState.concepts)) {
    if (state.graduated) continue;
    const priority = Math.max(0, state.nextAppearance - sessionState.currentIndex);
    candidates.push({ id, priority });
  }

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => a.priority - b.priority);
  return candidates[0].id;
}

/**
 * Get all concepts that need review, sorted by urgency
 */
export function getReviewQueue(): string[] {
  if (!sessionState) return [];

  const candidates: Array<{ id: string; priority: number }> = [];

  for (const [id, state] of Object.entries(sessionState.concepts)) {
    if (state.graduated) continue;
    const priority = Math.max(0, state.nextAppearance - sessionState.currentIndex);
    candidates.push({ id, priority });
  }

  candidates.sort((a, b) => a.priority - b.priority);
  return candidates.map(c => c.id);
}

/**
 * Get session statistics
 */
export function getSessionStats(): {
  total: number;
  graduated: number;
  remaining: number;
  struggling: number;
  questionsAnswered: number;
  accuracy: number;
} {
  if (!sessionState) {
    return { total: 0, graduated: 0, remaining: 0, struggling: 0, questionsAnswered: 0, accuracy: 0 };
  }

  let graduated = 0;
  let struggling = 0;
  let totalCorrect = 0;
  let totalWrong = 0;

  for (const state of Object.values(sessionState.concepts)) {
    if (state.graduated) graduated++;
    if (state.totalWrong >= 2) struggling++;
    totalCorrect += state.totalCorrect;
    totalWrong += state.totalWrong;
  }

  const total = Object.keys(sessionState.concepts).length;
  const questionsAnswered = totalCorrect + totalWrong;

  return {
    total,
    graduated,
    remaining: total - graduated,
    struggling,
    questionsAnswered,
    accuracy: questionsAnswered > 0 ? Math.round((totalCorrect / questionsAnswered) * 100) : 0,
  };
}

/**
 * Check if session is complete (all concepts graduated)
 */
export function isSessionComplete(): boolean {
  if (!sessionState) return false;
  return Object.values(sessionState.concepts).every(c => c.graduated);
}

/**
 * Get progress for a specific concept
 */
export function getConceptProgress(conceptId: string): ConceptState | null {
  if (!sessionState) return null;
  return sessionState.concepts[conceptId] || null;
}

/**
 * Save session to localStorage
 */
export function saveSession(): void {
  if (!sessionState || typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionState));
  } catch (e) {
    console.error('Failed to save session:', e);
  }
}

/**
 * Safe save — only writes if we have more progress than stored version.
 * Prevents React Strict Mode from polluting localStorage with empty sessions.
 */
export function saveSessionIfNewer(): void {
  if (!sessionState || typeof window === 'undefined') return;

  if (sessionState.currentIndex === 0) return;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const existing = JSON.parse(stored);
      if (sessionState.currentIndex < existing.currentIndex) return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionState));
  } catch (e) {
    console.error('Failed to save session:', e);
  }
}

/**
 * Load session from localStorage.
 * Returns true only if there's a session with actual progress.
 */
export function loadSession(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);

      // Only accept v2 sessions
      if (parsed.version !== 2) {
        localStorage.removeItem(STORAGE_KEY);
        return false;
      }

      if (parsed.currentIndex === 0) {
        localStorage.removeItem(STORAGE_KEY);
        return false;
      }

      sessionState = parsed;
      return true;
    }
  } catch (e) {
    console.error('Failed to load session:', e);
  }
  return false;
}

/**
 * Clear saved session
 */
export function clearSavedSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  // Also clear legacy v1 session
  localStorage.removeItem('cs1301-session-progress');
}
