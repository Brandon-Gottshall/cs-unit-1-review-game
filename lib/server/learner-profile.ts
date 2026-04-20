import {
  normalizeThemePreference,
  type ThemePreference,
} from '@brandon-gottshall/review-game-core'
import { isEmailLearnerId, normalizeLearnerEmail } from '@/lib/learner-id'
import { withNeonSql } from '@/lib/server/neon'

export type LearnerBootstrap = {
  learnerId: string
  themePreference: ThemePreference | null
  emailConfirmed: boolean
}

const normalizeStoredThemePreference = (value: unknown): ThemePreference | null => (
  normalizeThemePreference(value)
)

const isMissingLearnerProfileColumnError = (error: unknown): boolean => (
  Boolean(
    error
    && typeof error === 'object'
    && 'code' in error
    && (error as { code?: string }).code === '42703'
  )
)

export const getLearnerBootstrap = async (learnerId?: string): Promise<LearnerBootstrap> => {
  const resolvedLearnerId = learnerId ? normalizeLearnerEmail(learnerId) : ''
  if (!isEmailLearnerId(resolvedLearnerId)) {
    return {
      learnerId: '',
      themePreference: null,
      emailConfirmed: false,
    }
  }

  const stored = await withNeonSql(async (sql) => {
    await sql.query(
      `
        INSERT INTO learners (id, last_seen_at, updated_at)
        VALUES ($1, NOW(), NOW())
        ON CONFLICT (id)
        DO UPDATE SET last_seen_at = NOW(), updated_at = NOW()
      `,
      [resolvedLearnerId]
    )

    let themeRows: Array<{ theme_preference: unknown }> = []
    try {
      themeRows = await sql.query(
        `
          SELECT theme_preference
          FROM learners
          WHERE id = $1
        `,
        [resolvedLearnerId]
      ) as Array<{ theme_preference: unknown }>
    } catch (error) {
      if (!isMissingLearnerProfileColumnError(error)) throw error
    }

    let emailConfirmationRows: Array<{ email_confirmed: unknown }> = []
    try {
      emailConfirmationRows = await sql.query(
        `
          SELECT email_confirmed
          FROM learners
          WHERE id = $1
        `,
        [resolvedLearnerId]
      ) as Array<{ email_confirmed: unknown }>
    } catch (error) {
      if (!isMissingLearnerProfileColumnError(error)) throw error
    }

    return {
      themePreference: normalizeStoredThemePreference(themeRows[0]?.theme_preference ?? null),
      emailConfirmed: emailConfirmationRows[0]?.email_confirmed === true,
    }
  })

  return {
    learnerId: resolvedLearnerId,
    themePreference: stored?.themePreference ?? null,
    emailConfirmed: stored?.emailConfirmed ?? false,
  }
}

export const saveLearnerThemePreference = async (
  learnerId: string,
  themePreference: ThemePreference,
): Promise<ThemePreference> => {
  const normalizedLearnerId = normalizeLearnerEmail(learnerId)

  const stored = await withNeonSql(async (sql) => {
    try {
      await sql.query(
        `
          INSERT INTO learners (id, theme_preference, last_seen_at, updated_at)
          VALUES ($1, $2::jsonb, NOW(), NOW())
          ON CONFLICT (id)
          DO UPDATE SET
            theme_preference = EXCLUDED.theme_preference,
            last_seen_at = NOW(),
            updated_at = NOW()
        `,
        [normalizedLearnerId, JSON.stringify(themePreference)]
      )
    } catch (error) {
      if (!isMissingLearnerProfileColumnError(error)) throw error
    }

    return themePreference
  })

  return stored ?? themePreference
}

export const confirmLearnerEmail = async (learnerId: string): Promise<boolean> => {
  const normalizedLearnerId = normalizeLearnerEmail(learnerId)

  const stored = await withNeonSql(async (sql) => {
    try {
      await sql.query(
        `
          INSERT INTO learners (id, email_confirmed, last_seen_at, updated_at)
          VALUES ($1, TRUE, NOW(), NOW())
          ON CONFLICT (id)
          DO UPDATE SET
            email_confirmed = TRUE,
            last_seen_at = NOW(),
            updated_at = NOW()
        `,
        [normalizedLearnerId]
      )
    } catch (error) {
      if (!isMissingLearnerProfileColumnError(error)) throw error
    }

    return true
  })

  return stored ?? true
}
