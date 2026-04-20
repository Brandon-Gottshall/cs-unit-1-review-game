import {
  normalizeThemePreference,
  type ThemePreference,
} from '@brandon-gottshall/review-game-core'
import { saveLearnerThemePreference } from '@/lib/server/learner-profile'

type ThemePayload = {
  learnerId?: string
  themePreference?: ThemePreference
}

export async function PUT(request: Request): Promise<Response> {
  const body = await request.json().catch(() => null) as ThemePayload | null
  const learnerId = body?.learnerId?.trim()
  const themePreference = normalizeThemePreference(body?.themePreference)

  if (!learnerId || !themePreference) {
    return Response.json({ error: 'Missing learnerId or themePreference' }, { status: 400 })
  }

  const stored = await saveLearnerThemePreference(learnerId, themePreference)
  return Response.json({ themePreference: stored })
}
