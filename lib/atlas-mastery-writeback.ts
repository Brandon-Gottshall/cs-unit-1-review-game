import { useEffect, useMemo, useRef } from 'react'

const HUB_BASE_URL =
  process.env.NEXT_PUBLIC_ATLAS_HUB_URL ?? 'http://localhost:3100'

type MasteryEvent = {
  userId: string
  conceptId: string
  phase: 'learning' | 'practicing' | 'mastered' | 'shaky' | 'tracked_in_quiz'
  readiness: number
  timestamp: string
  gameId: string
  sessionId: string
}

export async function postMasteryEvent(event: MasteryEvent): Promise<void> {
  try {
    await fetch(`${HUB_BASE_URL}/api/mastery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    })
  } catch {
    // Silent on network errors so quiz flow never regresses.
  }
}

export function useMasteryWriteback(
  focusConceptId: string | null,
  atlasUserId: string | null,
  correct: boolean,
  gameId: string,
): void {
  const sessionId = useMemo(
    () =>
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `s-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    [],
  )
  const postedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!correct || !focusConceptId || !atlasUserId) return
    const dedupKey = `${sessionId}:${focusConceptId}`
    if (postedRef.current.has(dedupKey)) return
    postedRef.current.add(dedupKey)
    void postMasteryEvent({
      userId: atlasUserId,
      conceptId: focusConceptId,
      phase: 'practicing',
      readiness: 68,
      timestamp: new Date().toISOString(),
      gameId,
      sessionId,
    })
  }, [atlasUserId, correct, focusConceptId, gameId, sessionId])
}
