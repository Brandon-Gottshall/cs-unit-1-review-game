import { beforeEach, describe, expect, it, vi } from 'vitest'

const { saveLearnerThemePreferenceMock } = vi.hoisted(() => ({
  saveLearnerThemePreferenceMock: vi.fn(),
}))

vi.mock('@/lib/server/learner-profile', () => ({
  saveLearnerThemePreference: saveLearnerThemePreferenceMock,
}))

describe('PUT /api/learner/theme', () => {
  beforeEach(() => {
    saveLearnerThemePreferenceMock.mockReset()
  })

  it('persists a normalized theme preference', async () => {
    saveLearnerThemePreferenceMock.mockResolvedValue({
      themeId: 'default',
      colorScheme: 'dark',
      updatedAt: '2026-04-19T12:00:00.000Z',
    })

    const { PUT } = await import('@/app/api/learner/theme/route')
    const response = await PUT(new Request('http://localhost/api/learner/theme', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        learnerId: 'learner@example.com',
        themePreference: {
          themeId: 'default',
          colorScheme: 'dark',
          updatedAt: '2026-04-19T12:00:00.000Z',
        },
      }),
    }))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(saveLearnerThemePreferenceMock).toHaveBeenCalledWith('learner@example.com', {
      themeId: 'default',
      colorScheme: 'dark',
      updatedAt: '2026-04-19T12:00:00.000Z',
    })
    expect(body.themePreference.colorScheme).toBe('dark')
  })
})
