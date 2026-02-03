# IMP-47: Regressionstests (Smoke Tests)

## Basis-Testset

Nach jedem größeren Code-Change durchführen. Ziel: **<15 Min.**, alle Tests **Pass**.

### Automatisierte E2E-Tests

| #   | Test                               | Maus | Tastatur | Pass/Fail |
| --- | ---------------------------------- | ---- | -------- | --------- |
| 1   | Video startet/pausiert             | ✓    | ✓        |           |
| 2   | Timeline scrubben                  | ✓    | ✓        |           |
| 3   | Lautstärke ändern                  | ✓    | ✓        |           |
| 4   | Untertitel aktivieren              | ✓    |          |           |
| 5   | Settings öffnen/schließen          | ✓    | ✓ + ESC  |           |
| 6   | Fullscreen aktivieren/deaktivieren | ✓    |          |           |
| 7   | Tab-Reihenfolge korrekt            |      | ✓        |           |
| 8   | Screenreader: Play aria-label      |      | ✓        |           |
| 9   | Screenreader: CC aria-pressed      |      | ✓        |           |

### Ausführung

```bash
# Schneller Regression-Run (nur Chromium, ~2–5 Min.)
npm run test:regression

# Vollständiger E2E-Run (alle Browser)
npm run test:e2e
```

### Manuelle Stichproben (Screenreader)

| Test                    | Erwartete Ansage                      | Pass/Fail |
| ----------------------- | ------------------------------------- | --------- |
| Play-Button fokussiert  | „Abspielen, Button“                   |           |
| Pause-Button fokussiert | „Pause, Button“                       |           |
| CC aktiv                | „Untertitel, gedrückt, Toggle-Button“ |           |
| Settings geöffnet       | „Einstellungen, Dialog“               |           |
| Timeline                | „Videoposition, Slider, X Prozent“    |           |

### Regressionsfehler

Bei **Fail**: Sofort identifizieren und beheben. Test-Output und Screenshots in `test-results/` prüfen.

### CI-Integration

Der Workflow `.github/workflows/tests.yml` führt alle E2E-Tests (inkl. Regression) bei Push/PR aus.
