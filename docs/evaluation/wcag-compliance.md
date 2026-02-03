# WCAG 2.2 Level AA – Evaluations-Matrix

Für jedes Kriterium: Testmethode, Testergebnis, Beleg. Bei Fail: Begründung/Limitation.

---

## Prinzip 1: Wahrnehmbar

### 1.1.1 Nicht-Text-Inhalte (Level A)

| Feld            | Inhalt                                                                               |
| --------------- | ------------------------------------------------------------------------------------ |
| **Anforderung** | Alle Nicht-Text-Inhalte haben Textalternative                                        |
| **Testmethode** | Axe (automatisiert), Manuell (SR)                                                    |
| **Ergebnis**    | Pass                                                                                 |
| **Beleg**       | Axe 0 Violations; `src/index.html` video aria-label, Buttons aria-label              |
| **Code**        | `index.html` Zeile 59: `aria-label="Testvideo mit Untertiteln und Audiodeskription"` |

### 1.2.2 Untertitel (Level A)

| Feld            | Inhalt                                                                |
| --------------- | --------------------------------------------------------------------- |
| **Anforderung** | Untertitel für gesprochenen Inhalt                                    |
| **Testmethode** | Integration (CC-Toggle), E2E (Untertitel aktivieren)                  |
| **Ergebnis**    | Pass                                                                  |
| **Beleg**       | `tests/integration/player.setup.test.js` IMP-20I-B; `captions-de.vtt` |
| **Code**        | `index.html` track kind="captions"                                    |

### 1.2.3 Audiodeskription oder Alternativ (Level A)

| Feld            | Inhalt                                                                 |
| --------------- | ---------------------------------------------------------------------- |
| **Anforderung** | Audiodeskription oder Textalternative für Video                        |
| **Testmethode** | Integration (AD-Toggle), Manuell                                       |
| **Ergebnis**    | Pass                                                                   |
| **Beleg**       | `tests/integration/player.setup.test.js` IMP-33; `descriptions-de.vtt` |
| **Limitation**  | Text-Track (VTT), keine echte Audio-AD                                 |

### 1.2.5 Audiodeskription (Erweitert) (Level AA)

| Feld            | Inhalt                     |
| --------------- | -------------------------- |
| **Anforderung** | Audiodeskription für Video |
| **Testmethode** | Wie 1.2.3                  |
| **Ergebnis**    | Pass                       |
| **Beleg**       | `descriptions-de.vtt`      |

### 1.2.8 Alternativ für zeitbasierte Medien (Level AAA)

| Feld            | Inhalt                                                                        |
| --------------- | ----------------------------------------------------------------------------- |
| **Anforderung** | Textalternative für zeitbasierte Medien                                       |
| **Testmethode** | Manuell, Integration                                                          |
| **Ergebnis**    | Pass                                                                          |
| **Beleg**       | `index.html` Transkript-Bereich (IMP-40); `tests/integration` Tab-Reihenfolge |

### 1.3.1 Info und Beziehungen (Level A)

| Feld            | Inhalt                                                                         |
| --------------- | ------------------------------------------------------------------------------ |
| **Anforderung** | Info und Beziehungen programmatisch bestimmbar                                 |
| **Testmethode** | Axe, Integration (role, aria-\*)                                               |
| **Ergebnis**    | Pass                                                                           |
| **Beleg**       | Axe 0 Violations; `player.setup.test.js` IMP-35 (role=dialog, aria-labelledby) |

### 1.4.3 Kontrast (Minimum) (Level AA)

| Feld            | Inhalt                                                     |
| --------------- | ---------------------------------------------------------- |
| **Anforderung** | Text-Kontrast mind. 4,5:1                                  |
| **Testmethode** | Axe (color-contrast), Manuell                              |
| **Ergebnis**    | Pass                                                       |
| **Beleg**       | Axe 0 Violations; `variables.css` --color-text, --color-bg |
| **Code**        | `player.css` video::cue Hintergrund/Kontrast               |

### 1.4.4 Textgröße (Level AA)

| Feld            | Inhalt                                                           |
| --------------- | ---------------------------------------------------------------- |
| **Anforderung** | Text bis 200% vergrößerbar ohne Funktionsverlust                 |
| **Testmethode** | Manuell (Browser-Zoom), E2E Text Spacing                         |
| **Ergebnis**    | Pass                                                             |
| **Beleg**       | `tests/e2e/text-spacing.e2e.test.js`; `utilities.css` box-sizing |

### 1.4.10 Reflow (Level AA)

| Feld            | Inhalt                                                  |
| --------------- | ------------------------------------------------------- |
| **Anforderung** | Inhalt bei 320px Breite ohne horizontalen Scroll        |
| **Testmethode** | E2E IMP-43E-F                                           |
| **Ergebnis**    | Pass                                                    |
| **Beleg**       | `tests/e2e/accessibility.e2e.test.js` scrollWidth ≤ 320 |
| **Code**        | `player.css` flex-wrap, rem                             |

### 1.4.11 Nicht-Text-Kontrast (Level AA)

| Feld            | Inhalt                                                |
| --------------- | ----------------------------------------------------- |
| **Anforderung** | UI-Komponenten mind. 3:1 Kontrast                     |
| **Testmethode** | Axe, Manuell                                          |
| **Ergebnis**    | Pass                                                  |
| **Beleg**       | Axe 0 Violations; `variables.css` --color-range-thumb |

### 1.4.12 Textabstände (Level AA)

| Feld            | Inhalt                                                            |
| --------------- | ----------------------------------------------------------------- |
| **Anforderung** | Kein Verlust bei erhöhten Textabständen                           |
| **Testmethode** | E2E Text Spacing                                                  |
| **Ergebnis**    | Pass                                                              |
| **Beleg**       | `tests/e2e/text-spacing.e2e.test.js`; `docs/text-spacing-test.md` |

---

## Prinzip 2: Bedienbar

### 2.1.1 Tastatur (Level A)

| Feld            | Inhalt                                                                    |
| --------------- | ------------------------------------------------------------------------- |
| **Anforderung** | Alle Funktionen per Tastatur bedienbar                                    |
| **Testmethode** | E2E (IMP-43E-D, IMP-43E-E), Integration                                   |
| **Ergebnis**    | Pass                                                                      |
| **Beleg**       | `tests/e2e/accessibility.e2e.test.js`; `tests/e2e/regression.e2e.test.js` |
| **Code**        | `player.js` keydown-Listener (Pfeiltasten, Enter, Space, ESC)             |

### 2.1.2 Keine Tastaturfalle (Level A)

| Feld            | Inhalt                                                                |
| --------------- | --------------------------------------------------------------------- |
| **Anforderung** | Tastaturfalle nur wenn nötig (Modal)                                  |
| **Testmethode** | E2E IMP-43E-E (Tab zirkuliert, ESC beendet)                           |
| **Ergebnis**    | Pass                                                                  |
| **Beleg**       | `tests/e2e/accessibility.e2e.test.js` Settings-Panel Fokus-Management |
| **Code**        | `player.js` IMP-26 Tab-Trap im Settings-Panel                         |

### 2.1.4 Tastaturkurzbefehle (Level A)

| Feld            | Inhalt                                                   |
| --------------- | -------------------------------------------------------- |
| **Anforderung** | Shortcuts nur bei Fokus oder deaktivierbar               |
| **Testmethode** | Integration                                              |
| **Ergebnis**    | Pass                                                     |
| **Beleg**       | `player.setup.test.js` IMP-29 (M/C nur bei Player-Fokus) |
| **Code**        | `player.js` initKeyboardShortcuts() isFocusInPlayer()    |

### 2.4.3 Fokus-Reihenfolge (Level A)

| Feld            | Inhalt                                                      |
| --------------- | ----------------------------------------------------------- |
| **Anforderung** | Logische Fokus-Reihenfolge                                  |
| **Testmethode** | Integration, E2E                                            |
| **Ergebnis**    | Pass                                                        |
| **Beleg**       | `docs/tab-order.md`; `player.setup.test.js` Tab-Reihenfolge |
| **Code**        | tabindex="-1" für versteckte Elemente                       |

### 2.4.4 Linkzweck (Level A)

| Feld            | Inhalt                             |
| --------------- | ---------------------------------- |
| **Anforderung** | Linkzweck aus Linktext ersichtlich |
| **Testmethode** | Manuell                            |
| **Ergebnis**    | Pass                               |
| **Beleg**       | Transkript-Zeitstempel mit Kontext |

### 2.4.6 Überschriften und Labels (Level AA)

| Feld            | Inhalt                                          |
| --------------- | ----------------------------------------------- |
| **Anforderung** | Beschreibende Überschriften und Labels          |
| **Testmethode** | Axe, Integration                                |
| **Ergebnis**    | Pass                                            |
| **Beleg**       | Axe 0 Violations; aria-label auf allen Controls |

### 2.4.7 Fokus sichtbar (Level AA)

| Feld            | Inhalt                                                             |
| --------------- | ------------------------------------------------------------------ |
| **Anforderung** | Fokus-Indikator sichtbar                                           |
| **Testmethode** | E2E IMP-46, Manuell                                                |
| **Ergebnis**    | Pass                                                               |
| **Beleg**       | `tests/e2e/focus-indicator.e2e.test.js`; `docs/focus-indicator.md` |
| **Code**        | `player.css` outline 3px :focus-visible                            |

### 2.4.13 Fokus-Darstellung (Level AA)

| Feld            | Inhalt                                     |
| --------------- | ------------------------------------------ |
| **Anforderung** | Fokus-Indikator ≥2px, Kontrast ≥3:1        |
| **Testmethode** | E2E, Manuell (Kontrast-Tool)               |
| **Ergebnis**    | Pass                                       |
| **Beleg**       | `docs/focus-indicator.md` Kontrast-Messung |

### 2.5.8 Zielgröße (Level AA)

| Feld            | Inhalt                                                           |
| --------------- | ---------------------------------------------------------------- |
| **Anforderung** | Touch-Ziele mind. 44×44px                                        |
| **Testmethode** | Axe (target-size), Manuell                                       |
| **Ergebnis**    | Pass                                                             |
| **Beleg**       | Axe 0 Violations; `variables.css` --player-touch-target: 2.75rem |

---

## Prinzip 3: Verständlich

### 3.2.1 Bei Fokus (Level A)

| Feld            | Inhalt                                                             |
| --------------- | ------------------------------------------------------------------ |
| **Anforderung** | Fokus wechselt keinen Kontext ungewollt                            |
| **Testmethode** | Integration, E2E                                                   |
| **Ergebnis**    | Pass                                                               |
| **Beleg**       | Settings ESC setzt Fokus zurück; keine unerwarteten Kontextwechsel |

### 3.3.1 Fehleridentifikation (Level A)

| Feld            | Inhalt                                                                   |
| --------------- | ------------------------------------------------------------------------ |
| **Anforderung** | Fehler werden beschrieben                                                |
| **Testmethode** | Integration IMP-41                                                       |
| **Ergebnis**    | Pass                                                                     |
| **Beleg**       | `player.setup.test.js` Video-Error; `player.js` initVideoErrorHandling() |

---

## Prinzip 4: Robust

### 4.1.2 Name, Rolle, Wert (Level A)

| Feld            | Inhalt                                                        |
| --------------- | ------------------------------------------------------------- |
| **Anforderung** | Alle UI-Komponenten haben Name, Rolle, Wert                   |
| **Testmethode** | Axe, Integration (aria-label, aria-pressed, aria-valuetext)   |
| **Ergebnis**    | Pass                                                          |
| **Beleg**       | `player.setup.test.js` IMP-32, IMP-33, IMP-34, IMP-35, IMP-31 |
| **Code**        | `updateTimelineAria.js`, `togglePlayPause.js` aria-label      |

### 4.1.3 Statusmeldungen (Level AA)

| Feld            | Inhalt                                                         |
| --------------- | -------------------------------------------------------------- |
| **Anforderung** | Statusmeldungen über assistive Technologien verfügbar          |
| **Testmethode** | Integration, Manuell (SR)                                      |
| **Ergebnis**    | Pass                                                           |
| **Beleg**       | `player.setup.test.js` IMP-36 Live-Region; `announceStatus.js` |
| **Code**        | `index.html` #player-status role="status" aria-live="polite"   |

---

## Zusammenfassung

| Prinzip         | Level A | Level AA | Gesamt |
| --------------- | ------- | -------- | ------ |
| 1. Wahrnehmbar  | 9/9 ✅  | 5/5 ✅   | 14/14  |
| 2. Bedienbar    | 7/7 ✅  | 7/7 ✅   | 14/14  |
| 3. Verständlich | 4/4 ✅  | 3/3 ✅   | 7/7    |
| 4. Robust       | 2/2 ✅  | 1/1 ✅   | 3/3    |
| **GESAMT**      | 22/22   | 16/16    | 38/38  |

## Test-Coverage

| Ebene       | Befehl                     | Report                            |
| ----------- | -------------------------- | --------------------------------- |
| Unit        | `npm run test:unit`        | Jest Output                       |
| Integration | `npm run test:integration` | Jest Output                       |
| Coverage    | `npm run test:coverage`    | `coverage/lcov-report/index.html` |
| E2E         | `npm run test:e2e`         | `docs/test-reports/playwright/`   |
| Regression  | `npm run test:regression`  | Playwright Output                 |
