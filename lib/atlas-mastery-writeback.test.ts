import { beforeEach, describe, expect, it, vi } from 'vitest'

import { postMasteryEvent } from './atlas-mastery-writeback'

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('postMasteryEvent', () => {
  it('POSTs a JSON body to /api/mastery on the hub base URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })
    globalThis.fetch = fetchMock as unknown as typeof fetch

    await postMasteryEvent({
      userId: 'atlas-123',
      conceptId: 'computer-components',
      phase: 'practicing',
      readiness: 68,
      timestamp: '2026-04-20T12:00:00.000Z',
      gameId: 'cs-unit-1',
      sessionId: 'abc',
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(String(fetchMock.mock.calls[0][0])).toMatch(/\/api\/mastery$/)
  })

  it('swallows network errors so the game never regresses', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('offline')) as unknown as typeof fetch
    await expect(
      postMasteryEvent({
        userId: 'atlas-123',
        conceptId: 'computer-components',
        phase: 'practicing',
        readiness: 68,
        timestamp: '2026-04-20T12:00:00.000Z',
        gameId: 'cs-unit-1',
        sessionId: 'abc',
      }),
    ).resolves.toBeUndefined()
  })
})
