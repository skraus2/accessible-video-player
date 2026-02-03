# IMP-43E-G: Browser-spezifische Unterschiede

## Konfiguration

Playwright führt alle E2E-Tests in 3 Browsern aus:

| Projekt  | Browser         | Gerät           |
| -------- | --------------- | --------------- |
| chromium | Chrome          | Desktop Chrome  |
| firefox  | Firefox         | Desktop Firefox |
| webkit   | Safari (WebKit) | Desktop Safari  |

## Test-Matrix

| Test              | Chromium | Firefox | WebKit |
| ----------------- | -------- | ------- | ------ |
| Play-Button       | ✓        | ✓       | ✓      |
| Untertitel-Toggle | ✓        | ✓       | ✓      |
| Settings-Panel    | ✓        | ✓       | ✓      |

## Bekannte Abweichungen

| Browser | Issue | Status |
| ------- | ----- | ------ |
| (leer)  | –     | –      |

Bei Abweichungen hier dokumentieren (z. B. Video-Codec, ARIA-Verhalten).
