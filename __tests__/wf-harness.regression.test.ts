import { createWFHarness } from '@brandon-gottshall/review-game-core/wf-harness/vitest';

import { unifiedQuestionPool, type CSQuestionType } from '../lib/cs-game-data';
import { conceptTree } from '../lib/concept-tree';
import { generators } from '../lib/question-generators';

const registeredTypes = [
  'vocabulary',
  'true_false',
  'trace_variables',
  'predict_output',
  'identify_error',
  'complete_code',
  'valid_invalid',
  'match_definition',
  'code_analysis',
  'write_program',
] as const satisfies readonly CSQuestionType[];

const renderInteractiveCases = [
  'trace_variables',
  'predict_output',
  'write_program',
] as const satisfies readonly CSQuestionType[];

createWFHarness<CSQuestionType>({
  registeredTypes,
  renderInteractiveCases,
  interactivePayloadMap: {
    trace_variables: {
      payloadKey: 'variantData',
      requiredKeys: ['code', 'finalValues'],
    },
    predict_output: {
      payloadKey: 'outputData',
      requiredKeys: ['code', 'expectedOutput'],
    },
    write_program: {
      payloadKey: 'programData',
      requiredKeys: ['filename', 'description', 'expectedOutput', 'sampleSolution'],
    },
  },
  questionPool: unifiedQuestionPool,
  conceptTree,
  generators,
  quizClientPath: 'app/quiz/quiz-client.tsx',
}).all();
