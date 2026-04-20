import { describe, expect, it } from 'vitest'

import { parseQuizRouteState } from './quiz-route'

const parse = (query: string) => parseQuizRouteState(new URLSearchParams(query))

describe('parseQuizRouteState', () => {
  it('defaults every optional field', () => {
    const state = parse('')
    expect(state.typeFilter).toBeNull()
    expect(state.workflowQuestionId).toBeNull()
    expect(state.workflowDebug).toBe(false)
    expect(state.requestedFocusConceptId).toBeNull()
  })

  it('reads focusConcept when present', () => {
    expect(parse('focusConcept=computer-components').requestedFocusConceptId).toBe(
      'computer-components',
    )
  })

  it('turns on workflowDebug when wf=1 or a workflow question id is present', () => {
    expect(parse('wf=1').workflowDebug).toBe(true)
    expect(parse('question=q-7').workflowDebug).toBe(true)
    expect(parse('wfQuestion=q-8').workflowDebug).toBe(true)
  })

  it('reads the type filter for comma-separated values', () => {
    expect(parse('type=trace_variables,eval_expression').typeFilter).toBe(
      'trace_variables,eval_expression',
    )
  })
})
