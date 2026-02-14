import { unifiedQuestionPool } from '../lib/cs-game-data.ts';

const problematic = unifiedQuestionPool.filter(q => {
  const inter = q.interactive as any;
  if (q.type === 'trace_variables') {
    return inter?.variantData == null;
  }
  if (q.type === 'predict_output') {
    return inter?.outputData == null;
  }
  if (q.type === 'identify_error' || q.type === 'complete_code') {
    return q.formula == null;
  }
  return false;
});

console.log('Problematic:', problematic.length);
problematic.forEach(q => console.log(q.id, q.type, 'formula?', q.formula != null, 'interactive?', JSON.stringify(q.interactive)?.slice(0, 80)));

console.log('Types:', [...new Set(unifiedQuestionPool.map(q => q.type))].join(', '));

// Also check QuestionCard - does it render any code component?
const codeQuestions = unifiedQuestionPool.filter(q =>
  q.type === 'code_analysis' || q.type === 'valid_invalid'
);
console.log('\ncode_analysis + valid_invalid questions:', codeQuestions.length);
codeQuestions.forEach(q => {
  console.log(' ', q.id, q.type, 'formula?', q.formula != null, q.formula?.slice(0, 50));
});
