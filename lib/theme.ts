import {
  THEME_PREFERENCE_STORAGE_KEY as THEME_STORAGE_KEY,
  buildThemeInitScript,
  type ThemePreference,
} from '@brandon-gottshall/review-game-core'

export const THEME_INIT_SCRIPT = buildThemeInitScript({
  gameId: 'cs-unit-1-review-game',
})

export type LearnerThemeBootstrap = {
  themePreference: ThemePreference | null
  emailConfirmed: boolean
}

export const fetchLearnerThemeBootstrap = async (
  learnerId: string,
): Promise<LearnerThemeBootstrap | null> => {
  const response = await fetch(`/api/bootstrap?learnerId=${encodeURIComponent(learnerId)}`)
  if (!response.ok) return null
  const payload = await response.json()
  return {
    themePreference: payload.themePreference ?? null,
    emailConfirmed: payload.emailConfirmed === true,
  }
}

export const fetchBootstrapThemePreference = async (
  learnerId: string,
): Promise<ThemePreference | null> => {
  const bootstrap = await fetchLearnerThemeBootstrap(learnerId)
  return bootstrap?.themePreference ?? null
}

export const saveThemePreference = async (
  learnerId: string,
  themePreference: ThemePreference,
): Promise<ThemePreference> => {
  const response = await fetch('/api/learner/theme', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ learnerId, themePreference }),
  })

  if (!response.ok) {
    throw new Error('Theme preference save failed')
  }

  const payload = await response.json()
  return payload.themePreference ?? themePreference
}

export const syncStoredThemePreference = async (learnerId: string): Promise<void> => {
  const { migrateStoredThemePreferenceToLearner } = await import('@brandon-gottshall/review-game-core/ui')
  await migrateStoredThemePreferenceToLearner(learnerId, async (targetLearnerId, preference) => {
    await saveThemePreference(targetLearnerId, preference)
  })
}

export const confirmLearnerEmail = async (learnerId: string): Promise<boolean> => {
  const response = await fetch('/api/learner/confirm-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ learnerId }),
  })

  if (!response.ok) {
    throw new Error('Learner email confirmation failed')
  }

  const payload = await response.json()
  return payload.emailConfirmed === true
}
