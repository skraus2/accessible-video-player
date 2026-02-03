# IMP-49: Index der Testbelege

## Automatisierte Reports

| Beleg                     | Befehl                      | Speicherort                            |
| ------------------------- | --------------------------- | -------------------------------------- |
| Unit/Integration Coverage | `npm run test:coverage`     | `coverage/lcov-report/index.html`      |
| Axe-Report (Initial)      | `npm run axe:report`        | `docs/test-reports/axe-initial-*.json` |
| Axe-Report (allg.)        | E2E-Test                    | `docs/test-reports/axe-initial-*.json` |
| Playwright HTML-Report    | `npm run test:e2e`          | `docs/test-reports/playwright/`        |
| Lighthouse                | `npm run lighthouse:report` | LHCI temporary storage                 |

## Manuelle Belege

| Beleg                   | Anleitung                          | Speicherort                         |
| ----------------------- | ---------------------------------- | ----------------------------------- |
| Screenshot 320px        | E2E IMP-43E-F                      | `docs/screenshots/player-320px.png` |
| Screenshot Text Spacing | `docs/text-spacing-test.md`        | `docs/screenshots/`                 |
| SR-Transkript           | `docs/screenreader-walkthrough.md` | `docs/evaluation/sr-transcripts/`   |
| Fokus-Serie             | `docs/focus-indicator.md`          | Screenshots bei Tab-Durchlauf       |

## Test-Dateien (Code als Beleg)

| WCAG-Bereich            | Test-Datei                                                    |
| ----------------------- | ------------------------------------------------------------- |
| Formatierung, ARIA      | `tests/unit/formatTime.test.js`, `updateTimelineAria.test.js` |
| Live-Region             | `tests/unit/announceStatus.test.js`                           |
| Play/Pause              | `tests/unit/togglePlayPause.test.js`                          |
| Controls, ARIA, Fokus   | `tests/integration/player.setup.test.js`                      |
| Axe, Tastatur, Settings | `tests/e2e/accessibility.e2e.test.js`                         |
| Cross-Browser           | `tests/e2e/cross-browser.e2e.test.js`                         |
| Regression              | `tests/e2e/regression.e2e.test.js`                            |
| Text Spacing            | `tests/e2e/text-spacing.e2e.test.js`                          |
| Fokus-Indikator         | `tests/e2e/focus-indicator.e2e.test.js`                       |
