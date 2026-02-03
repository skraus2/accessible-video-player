# IMP-45: Textabstände-Test (WCAG 1.4.12)

## Hintergrund

WCAG 1.4.12 verlangt: **Kein Verlust von Inhalt oder Funktionalität**, wenn Nutzer erhöhte Textabstände anwenden:

- **line-height:** mind. 1.5× Schriftgröße
- **letter-spacing:** mind. 0.12× Schriftgröße
- **word-spacing:** mind. 0.16× Schriftgröße
- **paragraph-spacing:** mind. 2× Schriftgröße

## Text Spacing Bookmarklet

1. Bookmarklet hinzufügen: [Text Spacing Bookmarklet](https://www.html5accessibility.com/tests/tsbookmarklet.html)
2. Player-Seite öffnen: `npm run dev` → http://localhost:3000
3. Bookmarklet klicken → erhöhte Abstände werden angewendet

## Manuelle Prüfcheckliste

- [ ] **Play/Pause-Button** – Icon sichtbar, klickbar
- [ ] **Timeline-Slider** – Label „Videoposition“ (sr-only) – keine Clipping-Probleme
- [ ] **Lautstärke-Button** – sichtbar, klickbar
- [ ] **CC/AD/Settings/Fullscreen** – alle Buttons klickbar
- [ ] **Transkript-Toggle** – Text „Vollständiges Transkript anzeigen“ vollständig lesbar
- [ ] **Settings-Panel** – Labels „Wiedergabegeschwindigkeit“, „Videoqualität“ lesbar
- [ ] **Transkript-Inhalt** – alle Einträge lesbar, keine abgeschnittenen Texte

## Implementierte CSS-Anpassungen

| Element                                                               | Anpassung                                          |
| --------------------------------------------------------------------- | -------------------------------------------------- |
| `.player-controls`, `.player-settings__content`, `.player-transcript` | `overflow: visible`                                |
| `.player-settings__label`, `.player-transcript__toggle`, …            | `white-space: normal`, `overflow-wrap: break-word` |
| `.player-bar--main`, `.player-bar--secondary`                         | `overflow: visible`                                |

## Screenshots (optional)

Vor/nach Bookmarklet für Dokumentation:

1. Screenshot ohne Text Spacing → `docs/screenshots/player-default.png`
2. Bookmarklet aktivieren
3. Screenshot mit Text Spacing → `docs/screenshots/player-text-spacing.png`

## Automatisierter E2E-Test

```bash
npx playwright test tests/e2e/text-spacing.e2e.test.js
```

Prüft: Controls sichtbar, Settings-Labels lesbar, keine abgeschnittenen Texte.
