import type { ReadonlyURLSearchParams } from 'next/navigation'

export type QuizRouteState = {
  typeFilter: string | null
  workflowQuestionId: string | null
  workflowDebug: boolean
  requestedAtlasUserId: string | null
  requestedFocusConceptId: string | null
}

const readSearchParam = (
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
  key: string,
): string | null => searchParams.get(key)

export const parseQuizRouteState = (
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
): QuizRouteState => {
  const workflowQuestionId =
    readSearchParam(searchParams, 'question') ??
    readSearchParam(searchParams, 'wfQuestion')
  return {
    typeFilter: readSearchParam(searchParams, 'type'),
    workflowQuestionId,
    workflowDebug:
      readSearchParam(searchParams, 'wf') === '1' || Boolean(workflowQuestionId),
    requestedAtlasUserId: readSearchParam(searchParams, 'atlasUserId'),
    requestedFocusConceptId: readSearchParam(searchParams, 'focusConcept'),
  }
}
