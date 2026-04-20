import { beforeEach, describe, expect, it, vi } from 'vitest'

const { confirmLearnerEmailMock } = vi.hoisted(() => ({
  confirmLearnerEmailMock: vi.fn(),
}))

vi.mock('@/lib/server/learner-profile', () => ({
  confirmLearnerEmail: confirmLearnerEmailMock,
}))

describe('POST /api/learner/confirm-email', () => {
  beforeEach(() => {
    confirmLearnerEmailMock.mockReset()
  })

  it('marks the learner email as confirmed', async () => {
    confirmLearnerEmailMock.mockResolvedValue(true)

    const { POST } = await import('@/app/api/learner/confirm-email/route')
    const response = await POST(new Request('http://localhost/api/learner/confirm-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ learnerId: 'learner@example.com' }),
    }))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(confirmLearnerEmailMock).toHaveBeenCalledWith('learner@example.com')
    expect(body.emailConfirmed).toBe(true)
  })
})
