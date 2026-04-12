# CS Unit 1 Review Game Workflow Contract

This repo treats `workflow-complete` as browser-verified, not just unit-tested.

## Validation

- `npm run test:wf` runs the Vitest WF harness.
- `npm run test:browser-harness` runs the repo-owned Playwright browser WF suite.
- `npm run test:browser-harness:headed` opens the same suite in a visible browser.
- `npm run test:browser-harness:debug` runs the suite in Playwright debug mode.

## Browser WF contract

- Launcher and entry flow: `/` to `/quiz`.
- Exact routing flow: `/quiz?wf=1&question=<questionId>` must land on the requested question.
- Staged-answer flow: a multiple-choice question must support an initial wrong answer, option elimination, and a correct second attempt.
- Recovery/support-state flow: the feedback overlay must expose `Review Question`, and the `I have no idea` path must work on supported questions.
- Persistence/restore flow: a saved `cs1301-session-v2` session plus `cs1301-variation-picker` state must reopen to the resume prompt and survive reload.
- Calculator shell behavior: not present in this repo, so no calculator-specific browser case is required.

## Deterministic debug state

- The quiz page accepts `question` as the exact-question override used by the Playwright harness. `wfQuestion` remains as a backward-compatible alias only.
- Browser tests use the localStorage keys `cs1301-session-v2`, `cs1301-session-history`, and `cs1301-variation-picker` to seed restore scenarios.
- The active question wrapper exposes `data-testid="wf-active-question"` plus `data-wf-question-id` and `data-wf-question-type` for browser assertions.
