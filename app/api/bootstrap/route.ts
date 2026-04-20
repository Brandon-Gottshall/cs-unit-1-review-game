import { getLearnerBootstrap } from '@/lib/server/learner-profile'

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const learnerId = url.searchParams.get('learnerId') ?? undefined
  const bootstrap = await getLearnerBootstrap(learnerId)
  return Response.json(bootstrap)
}
