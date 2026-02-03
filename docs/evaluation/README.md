# IMP-49: Evaluations-Dokumentation (Kapitel 6 BA)

Strukturierte Dokumentation für die Evaluation des barrierefreien Video-Players.

## Struktur

| Datei                | Inhalt                                             |
| -------------------- | -------------------------------------------------- |
| `wcag-compliance.md` | Vollständige Evaluations-Matrix pro WCAG-Kriterium |
| `evidence-index.md`  | Übersicht aller Testbelege und Speicherorte        |
| `README.md`          | Diese Datei                                        |

## Belege-Speicherorte

| Beleg-Typ          | Speicherort                                  |
| ------------------ | -------------------------------------------- |
| Screenshots        | `docs/screenshots/`                          |
| Axe-Reports        | `docs/test-reports/axe-*.json`               |
| Lighthouse-Reports | `docs/test-reports/lighthouse-*.html`        |
| Playwright-Reports | `docs/test-reports/playwright/`              |
| Coverage-Reports   | `coverage/lcov-report/index.html`            |
| SR-Transkripte     | Manuell in `docs/evaluation/sr-transcripts/` |

## Vollständigkeits-Check

Anforderungskatalog vs. Evaluations-Dokumentation abgleichen:

- [ ] Jedes Muss-Kriterium in `wcag-compliance.md` mit Testergebnis
- [ ] Jedes Soll-Kriterium (falls implementiert) dokumentiert
- [ ] Alle Belege in `evidence-index.md` referenziert
- [ ] Coverage-Reports generiert: `npm run test:coverage`
- [ ] E2E durchgelaufen: `npm run test:e2e`
- [ ] Regression: `npm run test:regression`

```bash
npm run test:coverage   # Unit + Integration
npm run test:e2e        # E2E (inkl. Axe)
npm run test:regression # Smoke Tests
```
