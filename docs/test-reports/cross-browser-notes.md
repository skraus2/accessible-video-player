# IMP-43E-G / IMP-44: Browser-spezifische Unterschiede

## Konfiguration

Playwright führt alle E2E-Tests in 4 Browsern aus:

| Projekt  | Browser         | Gerät           |
| -------- | --------------- | --------------- |
| chromium | Chrome          | Desktop Chrome  |
| firefox  | Firefox         | Desktop Firefox |
| webkit   | Safari (WebKit) | Desktop Safari  |
| edge     | Microsoft Edge  | Desktop Edge    |

## Test-Matrix (IMP-44)

| Test            | Chromium | Firefox | WebKit | Edge |
| --------------- | -------- | ------- | ------ | ---- |
| Play-Button     | ✓        | ✓       | ✓      | ✓    |
| Timeline-Slider | ✓        | ✓       | ✓      | ✓    |
| Lautstärke      | ✓        | ✓       | ✓      | ✓    |
| Untertitel      | ✓        | ✓       | ✓      | ✓    |
| Fullscreen      | ✓        | ✓       | ✓      | ✓    |
| Settings-Panel  | ✓        | ✓       | ✓      | ✓    |

## Bekannte Abweichungen

| Browser | Issue | Status |
| ------- | ----- | ------ |
| (leer)  | –     | –      |

Bei Abweichungen hier dokumentieren (z. B. Video-Codec, ARIA-Verhalten, Fullscreen).

→ Vollständige Dokumentation: `docs/cross-browser-compatibility.md`
