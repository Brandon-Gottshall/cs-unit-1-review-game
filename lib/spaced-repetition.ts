"use client";

/**
 * Session-based spaced repetition for cramming
 *
 * Within a single study session:
 * - Wrong → requeue after ~3 questions
 * - Right once → requeue after ~6 questions
 * - Right 2x in a row → requeue after ~12 questions
 * - Right 3x in a row → graduated (done for this session)
 *
 * Exponential backoff on correct streaks.
 * Resets streak on wrong answer.
 */

const STORAGE_KEY = 'cs1301-session-progress';

// How many questions before seeing this one again, based on streak
const STREAK_INTERVALS: Record<number, number> = {
  0: 3,   // Just got wrong: see again soon
  1: 6,   // Got right once
  2: 12,  // Got right twice in a row
};

// Penalty levels for wrong guesses
// 0 = first guess correct (full credit)
// 1 = second guess correct (partial credit)
// 2 = both guesses wrong (full penalty)
const PENALTY_INTERVALS: Record<number, number> = {
  0: 0,   // No penalty
  1: 4,   // 2nd guess correct: slightly penalized
  2: 2,   // Both wrong: comes back very soon
};

const GRADUATION_STREAK = 3; // Correct this many times in a row = done

export interface QuestionState {
  streak: number;           // Current correct streak (0 = just missed)
  totalCorrect: number;     // Total times answered correctly
  totalWrong: number;       // Total times answered wrong
  nextAppearance: number;   // Question index when this should next appear
  graduated: boolean;       // Done for this session
}

export interface SessionState {
  questions: Record<string, QuestionState>;
  currentIndex: number;     // How many questions have been shown
  sessionId: string;        // Unique session identifier
}

// In-memory state for current session (resets on page reload)
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

function initSession(questionIds: string[]): SessionState {
  const state: SessionState = {
    questions: {},
    currentIndex: 0,
    sessionId: Date.now().toString(),
  };

  // Shuffle question order for initial presentation
  const shuffled = shuffle(questionIds);

  // Initialize all questions with staggered initial appearances
  shuffled.forEach((id, index) => {
    state.questions[id] = {
      streak: 0,
      totalCorrect: 0,
      totalWrong: 0,
      nextAppearance: index, // Staggered based on shuffle order
      graduated: false,
    };
  });

  return state;
}

/**
 * Start or get current session
 */
export function getSession(questionIds: string[]): SessionState {
  if (!sessionState) {
    sessionState = initSession(questionIds);
  }
  return sessionState;
}

/**
 * Reconcile a loaded session with the current question pool.
 * This is CRITICAL for resume to work correctly:
 * - Keeps progress for questions that exist in both saved session AND current pool
 * - Adds NEW questions that weren't in the saved session (unmastered)
 * - Removes questions that no longer exist in the current pool
 *
 * Without this, resuming a session where all saved questions were graduated
 * would show "All Mastered!" even if new questions were added to the pool.
 */
export function reconcileSession(currentQuestionIds: string[]): void {
  if (!sessionState) return;

  const currentIdSet = new Set(currentQuestionIds);
  const savedIds = Object.keys(sessionState.questions);
  const savedIdSet = new Set(savedIds);

  // Remove questions that no longer exist in the pool
  for (const id of savedIds) {
    if (!currentIdSet.has(id)) {
      delete sessionState.questions[id];
    }
  }

  // Add NEW questions that weren't in the saved session
  // These are questions that were added to the pool after the session was saved
  let newQuestionIndex = sessionState.currentIndex;
  for (const id of currentQuestionIds) {
    if (!savedIdSet.has(id)) {
      // New question - add it with initial state
      sessionState.questions[id] = {
        streak: 0,
        totalCorrect: 0,
        totalWrong: 0,
        nextAppearance: newQuestionIndex++, // Schedule after existing questions
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
 * Record an answer and update question state
 * @param questionId - the question ID
 * @param correct - whether they got it correct (on any guess)
 * @param penalty - 0 = first guess correct, 1 = second guess correct, 2 = fully wrong
 */
export function recordAnswer(questionId: string, correct: boolean, penalty: number = 0): QuestionState {
  if (!sessionState) {
    throw new Error('Session not initialized');
  }

  const q = sessionState.questions[questionId];
  if (!q) {
    throw new Error(`Unknown question: ${questionId}`);
  }

  sessionState.currentIndex++;

  if (correct && penalty === 0) {
    // First guess correct: full credit
    q.streak++;
    q.totalCorrect++;

    if (q.streak >= GRADUATION_STREAK) {
      q.graduated = true;
      q.nextAppearance = Infinity;
    } else {
      const interval = STREAK_INTERVALS[q.streak] || 12;
      q.nextAppearance = sessionState.currentIndex + interval;
    }
  } else if (correct && penalty === 1) {
    // Second guess correct: partial credit
    // Don't increment streak, but don't reset it either
    // Use a shorter interval as mild punishment
    q.totalCorrect++;
    const interval = PENALTY_INTERVALS[1];
    q.nextAppearance = sessionState.currentIndex + interval;
  } else {
    // Fully wrong: reset streak, come back soon
    q.streak = 0;
    q.totalWrong++;
    const interval = PENALTY_INTERVALS[2];
    q.nextAppearance = sessionState.currentIndex + interval;
  }

  return q;
}

/**
 * Get the next question to show
 * Returns null if all questions are graduated
 */
export function getNextQuestion(): string | null {
  if (!sessionState) return null;

  const candidates: Array<{ id: string; priority: number }> = [];

  for (const [id, state] of Object.entries(sessionState.questions)) {
    if (state.graduated) continue;

    // Priority: due now = 0, not due = how many questions until due
    const priority = Math.max(0, state.nextAppearance - sessionState.currentIndex);
    candidates.push({ id, priority });
  }

  if (candidates.length === 0) return null;

  // Sort by priority (lowest first = most urgent)
  candidates.sort((a, b) => a.priority - b.priority);

  // If the most urgent item isn't due yet, we're in "waiting" mode
  // but we should still show something — show the one coming soonest
  return candidates[0].id;
}

/**
 * Get all questions that need review, sorted by urgency
 */
export function getReviewQueue(): string[] {
  if (!sessionState) return [];

  const candidates: Array<{ id: string; priority: number }> = [];

  for (const [id, state] of Object.entries(sessionState.questions)) {
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
  struggling: number;  // Wrong 2+ times
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

  for (const state of Object.values(sessionState.questions)) {
    if (state.graduated) graduated++;
    if (state.totalWrong >= 2) struggling++;
    totalCorrect += state.totalCorrect;
    totalWrong += state.totalWrong;
  }

  const total = Object.keys(sessionState.questions).length;
  const questionsAnswered = totalCorrect + totalWrong;

  const stats = {
    total,
    graduated,
    remaining: total - graduated,
    struggling,
    questionsAnswered,
    accuracy: questionsAnswered > 0 ? Math.round((totalCorrect / questionsAnswered) * 100) : 0,
  };

  return stats;
}

/**
 * Check if session is complete (all graduated)
 */
export function isSessionComplete(): boolean {
  if (!sessionState) return false;

  return Object.values(sessionState.questions).every(q => q.graduated);
}

/**
 * Get progress for a specific question
 */
export function getQuestionProgress(questionId: string): QuestionState | null {
  if (!sessionState) return null;
  return sessionState.questions[questionId] || null;
}

/**
 * Persistence: save session to localStorage (optional, for page refresh survival)
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
 * Safe save that only writes if we have more progress than what's in storage
 * Prevents stale cleanup effects from overwriting newer data
 *
 * IMPORTANT: Does NOT save sessions with 0 progress to prevent React Strict Mode
 * from polluting localStorage with empty sessions
 */
export function saveSessionIfNewer(): void {
  if (!sessionState || typeof window === 'undefined') return;

  // Don't save empty sessions - this prevents React Strict Mode cleanup
  // from saving a session before the user has answered any questions
  if (sessionState.currentIndex === 0) {
    return;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const existing = JSON.parse(stored);
      // Only save if we have equal or more progress
      if (sessionState.currentIndex < existing.currentIndex) {
        return;
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionState));
  } catch (e) {
    console.error('Failed to save session:', e);
  }
}

/**
 * Persistence: load session from localStorage
 *
 * Returns true only if there's a session with actual progress (currentIndex > 0).
 * This prevents showing "Resume session?" when there's nothing to resume.
 */
export function loadSession(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);

      // Only restore session if there's actual progress
      // This prevents React Strict Mode cleanup artifacts from triggering resume prompts
      if (parsed.currentIndex === 0) {
        // No progress - treat as if no saved session exists
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
}
