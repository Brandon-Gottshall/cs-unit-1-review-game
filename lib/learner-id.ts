const LEARNER_ID_KEY = 'cs1301-learner-id'

export function normalizeLearnerEmail(raw: string): string {
  return raw.trim().toLowerCase()
}

export function isEmailLearnerId(value: string): boolean {
  const normalized = normalizeLearnerEmail(value)
  if (normalized.length < 5 || normalized.length > 254) return false
  if (!normalized.includes('@')) return false
  const [local, domain] = normalized.split('@')
  if (!local || !domain || !domain.includes('.')) return false
  return true
}

export function getLearnerId(): string {
  if (typeof window === 'undefined') return ''
  const stored = localStorage.getItem(LEARNER_ID_KEY) ?? ''
  return isEmailLearnerId(stored) ? normalizeLearnerEmail(stored) : ''
}

export function setLearnerId(rawEmail: string): { ok: true } | { ok: false; error: string } {
  if (typeof window === 'undefined') return { ok: false, error: 'Not available' }
  const normalized = normalizeLearnerEmail(rawEmail)
  if (!isEmailLearnerId(normalized)) {
    return { ok: false, error: 'Enter a valid student email address.' }
  }

  localStorage.setItem(LEARNER_ID_KEY, normalized)
  return { ok: true }
}

export function clearLearnerId(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(LEARNER_ID_KEY)
}
