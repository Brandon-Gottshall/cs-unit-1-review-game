import { beforeEach, describe, expect, it, vi } from 'vitest'

const { getLearnerBootstrapMock } = vi.hoisted(() => ({
  getLearnerBootstrapMock: vi.fn(),
}))

vi.mock('@/lib/server/learner-profile', () => ({
  getLearnerBootstrap: getLearnerBootstrapMock,
}))

describe('GET /api/bootstrap', () => {
  beforeEach(() => {
    getLearnerBootstrapMock.mockReset()
  })

  it('returns the learner bootstrap payload from the store', async () => {
    getLearnerBootstrapMock.mockResolvedValue({
      learnerId: 'learner@example.com',
      themePreference: null,
      emailConfirmed: false,
    })

    const { GET } = await import('@/app/api/bootstrap/route')
    const response = await GET(new Request('http://localhost/api/bootstrap?learnerId=learner@example.com'))
    const body = await response.json()

    expect(getLearnerBootstrapMock).toHaveBeenCalledWith('learner@example.com')
    expect(response.status).toBe(200)
    expect(body.learnerId).toBe('learner@example.com')
    expect(body.emailConfirmed).toBe(false)
  })
})
