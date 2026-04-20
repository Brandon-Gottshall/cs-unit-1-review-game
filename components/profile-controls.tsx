'use client'

import { useEffect, useState } from 'react'
import {
  shouldApplyThemePreference,
  type ThemePreference,
  type ThemePreferenceBase,
} from '@brandon-gottshall/review-game-core'
import {
  IdentityFloat,
  ThemeSwitcher,
  applyThemeChange,
  markIdentityFloatDismissed,
  persistThemePreferenceLocally,
  readBrowserThemePreference,
  readIdentityFloatDismissed,
  readStoredEmailConfirmation,
  writeStoredEmailConfirmation,
} from '@brandon-gottshall/review-game-core/ui'
import { clearLearnerId, getLearnerId, isEmailLearnerId, setLearnerId } from '@/lib/learner-id'
import {
  confirmLearnerEmail,
  fetchLearnerThemeBootstrap,
  saveThemePreference,
  syncStoredThemePreference,
} from '@/lib/theme'

type OpenPanel = 'theme' | 'identity' | null

type ProfileControlsProps = {
  /**
   * When false, hides the IdentityFloat and renders only the ThemeSwitcher.
   * Use in surfaces where identity is already established (e.g., quiz shell).
   */
  showIdentity?: boolean
}

export default function ProfileControls({ showIdentity = true }: ProfileControlsProps = {}) {
  const [mounted, setMounted] = useState(false)
  const [learnerId, setLearnerIdState] = useState(() => (
    typeof window === 'undefined' ? '' : getLearnerId()
  ))
  const [preference, setPreference] = useState<ThemePreference | null>(() => (
    typeof window === 'undefined' ? null : readBrowserThemePreference()
  ))
  const [identityMessage, setIdentityMessage] = useState<string | null>(null)
  const [themeMessage, setThemeMessage] = useState<string | null>(null)
  const [emailConfirmed, setEmailConfirmed] = useState(false)
  const [openPanel, setOpenPanel] = useState<OpenPanel>(() => {
    if (typeof window === 'undefined') return null
    if (isEmailLearnerId(getLearnerId())) return null
    if (readIdentityFloatDismissed()) return null
    return 'identity'
  })

  useEffect(() => {
    let ignore = false
    setMounted(true)
    const currentLearnerId = getLearnerId()
    setLearnerIdState(currentLearnerId)

    if (!isEmailLearnerId(currentLearnerId)) {
      setEmailConfirmed(false)
      return () => {
        ignore = true
      }
    }

    const localConfirmation = readStoredEmailConfirmation(currentLearnerId) === true
    setEmailConfirmed(localConfirmation)

    void fetchLearnerThemeBootstrap(currentLearnerId).then((bootstrap) => {
      if (ignore || !bootstrap) return
      const currentPreference = readBrowserThemePreference()
      if (
        bootstrap.themePreference
        && shouldApplyThemePreference(bootstrap.themePreference, currentPreference, { gameId: 'cs-unit-1-review-game' })
      ) {
        persistThemePreferenceLocally(bootstrap.themePreference, { gameId: 'cs-unit-1-review-game' })
        setPreference(bootstrap.themePreference)
      }

      const resolvedEmailConfirmed = bootstrap.emailConfirmed || localConfirmation
      if (resolvedEmailConfirmed) {
        writeStoredEmailConfirmation(currentLearnerId, true)
      }
      setEmailConfirmed(resolvedEmailConfirmed)
    })

    return () => {
      ignore = true
    }
  }, [])

  const handleThemeChange = async (nextPreferenceBase: ThemePreferenceBase) => {
    const nextPreference = applyThemeChange(preference, nextPreferenceBase, {
      gameId: 'cs-unit-1-review-game',
    })
    setPreference(nextPreference)

    if (!isEmailLearnerId(learnerId)) {
      setThemeMessage('Theme saved on this browser.')
      return
    }

    try {
      await saveThemePreference(learnerId, nextPreference)
      setThemeMessage('Theme saved for this learner profile.')
    } catch {
      setThemeMessage('Theme saved locally. Sync failed; try again.')
    }
  }

  const handleSaveIdentity = async (email: string) => {
    const result = setLearnerId(email)
    if (!result.ok) {
      setIdentityMessage(result.error)
      throw new Error(result.error)
    }

    const nextLearnerId = getLearnerId()
    setLearnerIdState(nextLearnerId)
    writeStoredEmailConfirmation(nextLearnerId, false)
    setEmailConfirmed(false)

    let nextMessage = `Theme profile attached to ${nextLearnerId}.`

    try {
      await syncStoredThemePreference(nextLearnerId)
      const bootstrap = await fetchLearnerThemeBootstrap(nextLearnerId)
      if (
        bootstrap?.themePreference
        && shouldApplyThemePreference(bootstrap.themePreference, preference, { gameId: 'cs-unit-1-review-game' })
      ) {
        persistThemePreferenceLocally(bootstrap.themePreference, { gameId: 'cs-unit-1-review-game' })
        setPreference(bootstrap.themePreference)
      }

      const resolvedEmailConfirmed = bootstrap?.emailConfirmed === true
      if (resolvedEmailConfirmed) {
        writeStoredEmailConfirmation(nextLearnerId, true)
      }
      setEmailConfirmed(resolvedEmailConfirmed)
    } catch {
      nextMessage = `Email saved for ${nextLearnerId}. Theme sync failed; try again.`
    }

    setIdentityMessage(nextMessage)
  }

  const handleGoAnonymous = () => {
    clearLearnerId()
    setLearnerIdState('')
    setEmailConfirmed(false)
    setIdentityMessage('Using anonymous mode on this browser.')
  }

  const handleConfirmEmail = async (email: string) => {
    await confirmLearnerEmail(email)
    writeStoredEmailConfirmation(email, true)
    setEmailConfirmed(true)
    setIdentityMessage(`Email confirmed for ${email}.`)
  }

  if (!mounted) return null

  return (
    <div className="flex flex-col items-end gap-3">
      <ThemeSwitcher
        preference={preference}
        gameId="cs-unit-1-review-game"
        currentEmail={isEmailLearnerId(learnerId) ? learnerId : null}
        anonymous={!isEmailLearnerId(learnerId)}
        statusMessage={themeMessage}
        open={openPanel === 'theme'}
        onOpenChange={(next) => setOpenPanel(next ? 'theme' : null)}
        onChange={handleThemeChange}
      />
      {showIdentity ? (
        <IdentityFloat
          currentEmail={isEmailLearnerId(learnerId) ? learnerId : null}
          emailConfirmed={isEmailLearnerId(learnerId) ? emailConfirmed : undefined}
          message={identityMessage}
          open={openPanel === 'identity'}
          onOpenChange={(next) => {
            setOpenPanel(next ? 'identity' : null)
            if (!next) markIdentityFloatDismissed()
          }}
          onSave={handleSaveIdentity}
          onConfirmEmail={handleConfirmEmail}
          onGoAnonymous={handleGoAnonymous}
        />
      ) : null}
    </div>
  )
}
