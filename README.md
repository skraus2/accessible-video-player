# Barrierefreier Web-Video-Player

> WCAG 2.2 Level AA konformer Video-Player – Bachelorarbeit

## 📋 Projektziel

Entwicklung und Evaluation eines vollständig barrierefreien HTML5-Video-Players, der alle WCAG 2.2 Level AA Erfolgskriterien erfüllt. Der Player dient als Prototyp für eine Bachelorarbeit zum Thema "Implementierung barrierefreier Webanwendungen".

## ✨ Features (geplant)

- ✅ Vollständige Tastaturbedienung
- ✅ Screenreader-Unterstützung (NVDA, JAWS, VoiceOver)
- ✅ Untertitel (WebVTT)
- ✅ Audiodeskription
- ✅ Responsive Design (320px – Desktop)
- ✅ WCAG 2.2 AA konform
- ✅ Umfassende Test-Coverage (Unit, Integration, E2E)

## 🛠️ Tech Stack

**Implementierung:**

- HTML5 + CSS3 + Vanilla JavaScript (ES6+)

**Testing:**

- Unit/Integration: Jest + Testing Library
- E2E: Playwright + Axe-Core
- Manuell: NVDA, Axe DevTools, Lighthouse

## 📦 Installation & Setup

### Voraussetzungen

- Node.js 20.x LTS
- npm ≥10.x
- Git

### Schritt-für-Schritt

1. **Repository klonen:**

   ```bash
   git clone https://github.com/skraus2/accessible-video-player.git
   cd accessible-video-player
   ```

2. **Dependencies installieren:**

   ```bash
   npm install
   ```

3. **Playwright-Browser installieren:**

   ```bash
   npx playwright install
   ```

4. **Dev-Server starten:**

   ```bash
   npm run dev
   ```

   Öffnet automatisch http://localhost:3000

### Test-Video (sample.mp4)

Der Player erwartet ein Test-Video unter `src/assets/videos/sample.mp4` (nicht im Repo, siehe `.gitignore`).

- **Option A (empfohlen):** Eigenes kurzes Test-Video (30–60 s) erstellen, als MP4 (H.264) exportieren.
- **Option B:** Blender Demo-Videos (Creative Commons): [download.blender.org/demo/movies/](https://download.blender.org/demo/movies/) – z. B. „Spring“. Speichern als `src/assets/videos/sample.mp4`. Für Performance unter 20 MB halten.

## 🧪 Testing

```bash
# Alle Tests ausführen
npm test

# Nur Unit Tests
npm run test:unit

# Nur Integration Tests
npm run test:integration

# Nur E2E Tests
npm run test:e2e

# Coverage-Report generieren
npm run test:coverage

# Tests im Watch-Mode
npm run test:watch
```

## 📁 Projektstruktur

```
accessible-video-player/
├── src/                    # Source Code
│   ├── index.html          # Haupt-HTML
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript
│   └── assets/             # Videos, Icons
├── tests/                  # Test-Suites
│   ├── unit/               # Unit Tests
│   ├── integration/        # Integration Tests
│   └── e2e/                # E2E Tests
├── docs/                   # Dokumentation & Reports
└── README.md
```

## 🎯 WCAG 2.2 Konformität (Ziel)

| Level | Erfolgskriterien | Status   |
| ----- | ----------------- | -------- |
| A     | 30 Kriterien      | 🚧 In Arbeit |
| AA    | 20 Kriterien      | 🚧 In Arbeit |

→ Detaillierte Evaluations-Dokumentation in `docs/evaluation/`

## 📊 Test-Coverage (Ziel)

- Unit Tests: ≥90%
- Integration Tests: ≥80%
- E2E Tests: ≥70%
- **Gesamt: ≥75%**

## 🤝 Beitragen

Dieses Projekt ist Teil einer Bachelorarbeit und nicht für externe Contributions gedacht. Feedback und Issues sind jedoch willkommen!

## 📄 Lizenz

MIT License – Siehe LICENSE für Details.

## ✍️ Autor

Simon Kraus  
Bachelorarbeit, [Universität/Hochschule], [Jahr]

## 🔗 Weiterführende Links

- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [Axe DevTools Dokumentation](https://developer.deque.com/axe/devtools/)
- [NVDA Screenreader](https://www.nvaccess.org/)
- [Playwright Dokumentation](https://playwright.dev/docs/intro)
