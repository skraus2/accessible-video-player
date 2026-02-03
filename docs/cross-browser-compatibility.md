# IMP-44: Cross-Browser-Kompatibilität

## Getestete Browser

| Browser | Playwright-Projekt | Version |
| ------- | ------------------ | ------- |
| Chrome  | chromium           | Aktuell |
| Firefox | firefox            | Aktuell |
| Safari  | webkit             | Aktuell |
| Edge    | edge               | Aktuell |

## Funktionstest-Matrix

| Funktion        | Chrome | Firefox | Safari | Edge |
| --------------- | ------ | ------- | ------ | ---- |
| Play/Pause      | ✓      | ✓       | ✓      | ✓    |
| Timeline-Slider | ✓      | ✓       | ✓      | ✓    |
| Lautstärke      | ✓      | ✓       | ✓      | ✓    |
| Untertitel (CC) | ✓      | ✓       | ✓      | ✓    |
| Fullscreen      | ✓      | ✓       | ✓      | ✓    |
| Settings-Panel  | ✓      | ✓       | ✓      | ✓    |

## Implementierte Browser-Präfixe

### Fullscreen-API

Der Player nutzt alle gängigen Präfixe für maximale Kompatibilität:

- `requestFullscreen` / `exitFullscreen` (Standard)
- `webkitRequestFullscreen` / `webkitExitFullscreen` (Safari)
- `mozRequestFullScreen` / `mozCancelFullScreen` (Firefox)
- `msRequestFullscreen` / `msExitFullscreen` (ältere Edge)

### TextTrack (Untertitel)

- WebVTT wird von allen modernen Browsern unterstützt
- `video::cue` CSS für einheitliches Styling

## Bekannte Einschränkungen

| Browser | Einschränkung | Status |
| ------- | ------------- | ------ |
| (leer)  | –             | –      |

## UI-Unterschiede (akzeptabel)

- **Select-Dropdowns:** Native Darstellung variiert (Chrome vs. Safari vs. Firefox)
- **Range-Slider:** Leichte visuelle Unterschiede
- **Fullscreen:** Browser-spezifische Overlays (z. B. Safari-Leiste)

## Tests ausführen

```bash
# Alle Browser
npm run test:e2e

# Nur Cross-Browser-Tests
npx playwright test tests/e2e/cross-browser.e2e.test.js

# Einzelner Browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
npx playwright test --project=edge
```

## Edge installieren (lokal)

```bash
npx playwright install msedge
```

## Screenshot-Vergleich (optional)

Für visuelle Konsistenz können Screenshots pro Browser verglichen werden:

```bash
npx playwright test tests/e2e/cross-browser.e2e.test.js --project=chromium
# Screenshots bei Failure: test-results/
# Oder manuell: page.screenshot({ path: 'docs/screenshots/player-chromium.png' })
```
