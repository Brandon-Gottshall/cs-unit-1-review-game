import { expect, test, type Page } from '@playwright/test';

import { unifiedQuestionPool } from '../../lib/cs-game-data';
import { serializePickerState } from '../../lib/variation-picker';

test.describe.configure({ mode: 'serial' });

const SESSION_KEY = 'cs1301-session-v2';
const HISTORY_KEY = 'cs1301-session-history';
const PICKER_KEY = 'cs1301-variation-picker';

type ConceptState = {
  streak: number;
  totalCorrect: number;
  totalWrong: number;
  nextAppearance: number;
  graduated: boolean;
};

function questionById(questionId: string) {
  const question = unifiedQuestionPool.find((q) => q.id === questionId);
  if (!question) {
    throw new Error(`Unknown question id: ${questionId}`);
  }
  return question;
}

function buildResumeFixture(questionId: string) {
  const question = questionById(questionId);
  const conceptIds = [...new Set(unifiedQuestionPool.map((q) => q.concept))];
  const concepts: Record<string, ConceptState> = {};

  conceptIds.forEach((conceptId, index) => {
    concepts[conceptId] = {
      streak: conceptId === question.concept ? 1 : 0,
      totalCorrect: conceptId === question.concept ? 1 : 0,
      totalWrong: 0,
      nextAppearance: conceptId === question.concept ? 0 : 1000 + index,
      graduated: false,
    };
  });

  const session = {
    version: 2 as const,
    concepts,
    currentIndex: 1,
    sessionId: `wf-${questionId}`,
  };

  const picker = serializePickerState({
    usedQuestionIds: new Set(
      unifiedQuestionPool
        .filter((q) => q.concept === question.concept && q.id !== question.id)
        .map((q) => q.id)
    ),
    generatorSeeds: new Map(),
  });

  const history = [
    {
      questionId: question.id,
      question: question.question,
      yourAnswer: question.correctAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect: true,
      timestamp: 1,
      type: question.type,
      chapter: question.chapter,
    },
  ];

  return {
    session,
    picker,
    history,
    question,
  };
}

async function seedResumeState(page: Page, questionId: string) {
  const fixture = buildResumeFixture(questionId);

  await page.goto('/quiz', { waitUntil: 'domcontentloaded' });
  await page.evaluate(
    ({ session, picker, history, sessionKey, historyKey, pickerKey }) => {
      localStorage.setItem(sessionKey, JSON.stringify(session));
      localStorage.setItem(historyKey, JSON.stringify(history));
      localStorage.setItem(pickerKey, picker);
    },
    {
      session: fixture.session,
      picker: fixture.picker,
      history: fixture.history,
      sessionKey: SESSION_KEY,
      historyKey: HISTORY_KEY,
      pickerKey: PICKER_KEY,
    }
  );

  return fixture.question;
}

async function goToQuestion(page: Page, questionId: string) {
  await page.goto(`/quiz?wf=1&question=${questionId}`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByTestId('wf-active-question')).toHaveAttribute('data-wf-question-id', questionId);
}

test('launcher entry reaches quiz and exact routing resolves the requested question', async ({ page }) => {
  const question = questionById('ch2-vars-004');

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByTestId('home-shell')).toHaveAttribute('data-hydrated', 'true');
  await expect(page.getByRole('button', { name: 'Start Cram Session' })).toBeVisible();
  await page.getByRole('button', { name: 'Start Cram Session' }).click();
  await expect(page).toHaveURL(/\/quiz$/);

  await goToQuestion(page, question.id);
  await expect(page.getByTestId('wf-active-question')).toHaveAttribute('data-wf-question-type', question.type);
  await expect(page.getByText(question.question)).toBeVisible();
  await expect(page.getByRole('button', { name: question.correctAnswer, exact: true })).toBeVisible();
});

test('staged-answer flow and recovery path work on a routed question', async ({ page }) => {
  const question = questionById('ch1-comp-001');
  await goToQuestion(page, question.id);

  const questionFrame = page.getByTestId('wf-active-question');
  await questionFrame.getByRole('button', { name: 'Java Verification Module', exact: true }).click();
  await questionFrame.getByRole('button', { name: 'Submit Answer' }).click();
  await expect(page.getByText('Second chance — one option eliminated')).toBeVisible();

  await questionFrame.getByRole('button', { name: question.correctAnswer, exact: true }).click();
  await questionFrame.getByRole('button', { name: 'Submit Answer' }).click();
  await expect(page.getByRole('heading', { name: 'Got it on the second try' })).toBeVisible();

  await page.getByRole('button', { name: 'Review Question' }).click();
  const reviewModal = page.getByTestId('wf-review-modal');
  await expect(reviewModal).toBeVisible();
  await expect(reviewModal.getByText(question.question)).toBeVisible();
  await expect(reviewModal.getByText(question.correctAnswer, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Close review question' }).click();
  await expect(page.getByTestId('wf-active-question')).toBeVisible();
});

test('support-state flow opens the review modal and exposes the answer recovery path', async ({ page }) => {
  const question = questionById('ch2-vars-006');
  await goToQuestion(page, question.id);

  const questionFrame = page.getByTestId('wf-active-question');
  await questionFrame.getByRole('button', { name: 'I have no idea' }).click();
  await questionFrame.getByRole('button', { name: 'Yes, show me' }).click();

  await expect(page.getByRole('heading', { name: 'Not quite — you\'ll see this concept again soon' })).toBeVisible();
  await page.getByRole('button', { name: 'Review Question' }).click();
  const reviewModal = page.getByTestId('wf-review-modal');
  await expect(reviewModal).toBeVisible();
  await expect(reviewModal.getByText(question.question)).toBeVisible();
  await expect(reviewModal.getByText(question.correctAnswer, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Close review question' }).click();
  await expect(page.getByTestId('wf-active-question')).toBeVisible();
});

test('persistence and restore bring the learner back to the saved session', async ({ page }) => {
  const question = await seedResumeState(page, 'ch2-vars-004');

  await page.reload({ waitUntil: 'domcontentloaded' });
  const resumeState = page.getByTestId('wf-resume-prompt');
  await expect(resumeState).toBeVisible();
  await expect(resumeState).toContainText('Questions answered: 1');

  await page.getByRole('button', { name: 'Continue Session' }).click();
  await expect(page.locator(`[data-wf-question-id="${question.id}"]`).first()).toBeVisible();
  await expect(page.getByText(question.question)).toBeVisible();

  const activeQuestion = page.locator(`[data-wf-question-id="${question.id}"]`).first();
  await activeQuestion.getByRole('button', { name: question.correctAnswer, exact: true }).click();
  await activeQuestion.getByRole('button', { name: 'Submit Answer' }).click();
  await expect(page.getByRole('heading', { name: '2x streak!' })).toBeVisible();
  await page.getByRole('button', { name: 'Continue' }).click();

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByTestId('wf-resume-prompt')).toContainText('Questions answered: 2');
});
