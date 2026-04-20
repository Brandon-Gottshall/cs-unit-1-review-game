import { confirmLearnerEmail } from '@/lib/server/learner-profile'

type ConfirmEmailPayload = {
  learnerId?: string
}

export async function POST(request: Request): Promise<Response> {
  const body = await request.json().catch(() => null) as ConfirmEmailPayload | null
  const learnerId = body?.learnerId?.trim()

  if (!learnerId) {
    return Response.json({ error: 'Missing learnerId' }, { status: 400 })
  }

  const emailConfirmed = await confirmLearnerEmail(learnerId)
  return Response.json({ emailConfirmed })
}
