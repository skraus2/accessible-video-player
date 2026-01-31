# Barrierefreier Web-Video-Player

> **Bachelorarbeit:** Konzeption und prototypische Umsetzung eines barrierefreien Web-Video-Players nach WCAG 2.2 Level AA

[![WCAG 2.2 Level AA](https://img.shields.io/badge/WCAG-2.2%20Level%20AA-blue.svg)](https://www.w3.org/WAI/WCAG22/quickref/?currentsidebar=%23col_customize&levels=aaa)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Projektziel

Diese Bachelorarbeit konzipiert und implementiert einen prototypischen HTML5-Video-Player, der vollständig barrierefrei nach den **Web Content Accessibility Guidelines (WCAG) 2.2 Level AA** gestaltet ist.

### Forschungsfragen

1. Welche WCAG 2.2 Erfolgskriterien sind für Video-Player relevant?
2. Wie können diese Kriterien technisch umgesetzt werden?
3. Wie lässt sich Barrierefreiheit systematisch testen und validieren?

### Abgrenzung

- **Fokus:** Accessibility-First-Ansatz, keine Feature-Vollständigkeit
- **Zielgruppe:** Menschen mit verschiedenen Behinderungen (visuell, motorisch, kognitiv, auditiv)
- **Scope:** Prototyp mit Core-Funktionen (Play/Pause, Timeline, Lautstärke, Untertitel, Audiodeskription, Settings, Fullscreen)

## ✨ Features

### Implementierte Barrierefreiheits-Features

- ✅ **Tastaturbedienung:** Alle Funktionen per Tastatur bedienbar (Tab, Pfeiltasten, Enter, Space, ESC)
- ✅ **Screenreader-Support:** Optimiert für NVDA, JAWS, VoiceOver
- ✅ **ARIA-Semantik:** Vollständige ARIA-Attribute für assistive Technologien
- ✅ **Untertitel (Captions):** WebVTT-Format, aktivierbar/deaktivierbar
- ✅ **Audiodeskription:** Separate Beschreibungsspur für visuelle Inhalte
- ✅ **Fokus-Management:** Keine Tastaturfallen, logische Tab-Reihenfolge
- ✅ **Live-Regions:** Status-Ansagen ohne Fokus-Wechsel
- ✅ **Responsive Design:** 320px (Mobile) bis Desktop
- ✅ **Kontrast-Konformität:** Min. 4,5:1 (Text), 3:1 (UI-Komponenten)
- ✅ **Touch-Optimierung:** Min. 44×44px Zielgrößen

### Video-Player-Funktionen

- Play/Pause-Control
- Timeline-Scrubbing (Slider)
- Lautstärkeregelung
- Untertitel-Toggle
- Audiodeskription-Toggle
- Einstellungen (Wiedergabegeschwindigkeit, Qualität)
- Vollbild-Modus

## 🛠️ Tech Stack

### Implementierung

- **HTML5:** Semantisches Markup, natives `<video>`-Element
- **CSS3:** Custom Properties, Flexbox/Grid, Responsive Design
- **Vanilla JavaScript (ES6+):** Keine Framework-Abhängigkeiten für volle A11y-Kontrolle

**Warum kein Framework?**  
Frameworks wie React/Vue können Fokus-Management und ARIA-Handling erschweren. Vanilla JS ermöglicht präzise Kontrolle über alle Accessibility-Aspekte und zeigt fundamentales Verständnis von Web-Standards.

### Testing-Strategie (Triple-Layer Approach)

| Ebene              | Tools                    | Coverage | WCAG-Prüfung                    |
| ------------------ | ------------------------ | -------- | ------------------------------- |
| **Unit Tests**     | Jest + JSDOM             | ~90%     | Helper-Funktionen, State-Management |
| **Integration Tests** | Testing Library + jest-axe | ~80%  | Controls, ARIA-Interaktionen, automatisierte Axe-Scans |
| **E2E Tests**      | Playwright + @axe-core/playwright | ~70% | User-Workflows, Cross-Browser, automatisierte WCAG-Prüfung |
| **Manuelle Tests** | NVDA, JAWS, Axe DevTools, Lighthouse | 100% | Screenreader-UX, Subjektive Kriterien |

**Gesamte Code-Coverage:** ≥75% (exzellent für akademischen Prototyp)

## 📦 Installation & Setup

### Voraussetzungen

- Node.js 20.x LTS
- npm ≥10.x
- Git
- Modern browser (Chrome/Firefox/Safari/Edge)

### Schritt-für-Schritt

```bash
# 1. Repository klonen
git clone https://github.com/[username]/accessible-video-player.git
cd accessible-video-player

# 2. Dependencies installieren
npm install

# 3. Playwright-Browser installieren (einmalig, ~1.5 GB)
npx playwright install

# 4. Dev-Server starten
npm run dev
# → Öffnet automatisch http://localhost:3000
```

## 🧪 Testing

```bash
# Alle Tests ausführen (Unit + Integration + E2E)
npm test

# Nur Unit Tests
npm run test:unit

# Nur Integration Tests
npm run test:integration

# Nur E2E Tests (startet automatisch Dev-Server)
npm run test:e2e

# E2E Tests mit UI (interaktiv, empfohlen während Entwicklung)
npm run test:e2e:ui

# Coverage-Report generieren
npm run test:coverage
# → Report in coverage/lcov-report/index.html

# Tests im Watch-Mode (Auto-Rerun bei Code-Änderungen)
npm run test:watch
```

### Manuelle Accessibility-Tests

```bash
# 1. Dev-Server starten
npm run dev

# 2. In Chrome: DevTools öffnen (F12)
# 3. Lighthouse-Tab → Accessibility Audit → "Analyze page load"
# 4. Axe DevTools Extension → "Scan ALL of my page"
# 5. NVDA starten (Ctrl+Alt+N) → Player mit Tastatur bedienen
```

## 📁 Projektstruktur

```
accessible-video-player/
├── src/                          # Source Code
│   ├── index.html                # Haupt-HTML mit Player-Markup
│   ├── css/
│   │   ├── variables.css         # Design System (CSS Custom Properties)
│   │   ├── player.css            # Player-Styling
│   │   └── utilities.css         # Helper-Klassen (.sr-only, etc.)
│   ├── js/
│   │   ├── player.js             # Main Entry Point
│   │   ├── utils/                # Helper-Funktionen
│   │   │   ├── formatTime.js     # Zeitformatierung (MM:SS, H:MM:SS)
│   │   │   ├── aria.js           # ARIA-Update-Funktionen
│   │   │   └── liveRegion.js     # announceStatus() für Live-Regions
│   │   └── components/           # Player-Komponenten
│   │       ├── playPause.js      # Play/Pause-Logik
│   │       ├── timeline.js       # Timeline-Slider
│   │       ├── volume.js         # Lautstärke-Control
│   │       ├── captions.js       # Untertitel-Toggle
│   │       ├── settings.js       # Settings-Panel
│   │       └── focusManagement.js # Fokus-Loop & -Return
│   └── assets/
│       ├── videos/
│       │   ├── sample.mp4        # Test-Video
│       │   ├── captions-de.vtt   # Deutsche Untertitel
│       │   └── descriptions-de.vtt # Audiodeskription
│       └── icons/                # SVG-Icons (Play, Pause, CC, etc.)
├── tests/                        # Test-Suites
│   ├── unit/                     # Unit Tests (~90% Coverage)
│   │   ├── formatTime.test.js
│   │   ├── aria.test.js
│   │   └── liveRegion.test.js
│   ├── integration/              # Integration Tests (~80% Coverage)
│   │   ├── playPause.integration.test.js
│   │   ├── captions.integration.test.js
│   │   ├── settings.integration.test.js
│   │   └── focusManagement.integration.test.js
│   └── e2e/                      # E2E Tests (~70% Coverage)
│       ├── axe.e2e.test.js       # Automatisierte Axe-Scans
│       ├── keyboard.e2e.test.js  # Tastatur-Workflows
│       ├── responsive.e2e.test.js # 320px - Desktop
│       └── crossBrowser.e2e.test.js # Chrome, Firefox, Safari
├── docs/                         # Dokumentation & BA-Material
│   ├── screenshots/              # UI-Screenshots (verschiedene States)
│   ├── test-reports/             # Lighthouse, Axe, Playwright-Reports
│   │   ├── axe/
│   │   ├── lighthouse/
│   │   └── playwright/
│   ├── research/                 # Recherche-Notizen, Tool-Listen
│   └── evaluation/               # WCAG-Evaluations-Dokumentation
├── .github/
│   └── workflows/
│       └── tests.yml             # CI/CD: Automatisierte Tests bei Push
├── jest.config.js                # Jest-Konfiguration
├── playwright.config.js          # Playwright-Konfiguration
├── package.json                  # Dependencies & Scripts
└── README.md                     # Diese Datei
```

## 🎯 WCAG 2.2 Level AA Konformität

### Erfüllte Erfolgskriterien (geplant)

| Prinzip   | Level A | Level AA | Gesamt  |
| --------- | ------- | -------- | ------- |
| 1. Wahrnehmbar | 9/9 ✅  | 5/5 ✅   | 14/14   |
| 2. Bedienbar   | 7/7 ✅  | 7/7 ✅   | 14/14   |
| 3. Verständlich| 4/4 ✅  | 3/3 ✅   | 7/7     |
| 4. Robust      | 2/2 ✅  | 1/1 ✅   | 3/3     |
| **GESAMT**     | 22/22   | 16/16    | 38/38   |

→ Detaillierte Evaluations-Matrix in `docs/evaluation/wcag-compliance.md`

### Testing-Methodik pro Kriterium

- **Automatisiert (Axe + Lighthouse):** ~57% der Kriterien
- **Programmatisch (Playwright API):** ~15% der Kriterien
- **Manuell (NVDA + visuelle Inspektion):** ~28% der Kriterien
- **GESAMT:** 100% Coverage

## 📊 Test-Coverage & Qualitätsmetriken

### Code-Coverage (Ziel)

- **Unit Tests:** ≥90% (Helper-Funktionen, State-Management)
- **Integration Tests:** ≥80% (Controls, ARIA-Interaktionen)
- **E2E Tests:** ≥70% (User-Workflows, Cross-Browser)
- **Gesamt:** ≥75% (exzellent für akademischen Prototyp)

### Qualitätsmetriken

- **Lighthouse Accessibility Score:** ≥95/100 (Ziel: 100)
- **Axe Violations:** 0 (WCAG 2.2 Level AA)
- **Browser-Kompatibilität:** Chrome, Firefox, Safari, Edge (je aktuellste Version)
- **Screenreader-Kompatibilität:** NVDA (Windows), JAWS (optional), VoiceOver (macOS)

## 🔬 Wissenschaftlicher Ansatz

### Methodik (Bachelorarbeit)

1. **Anforderungsanalyse:** Mapping relevanter WCAG 2.2 Kriterien auf Video-Player-Kontext
2. **Konzeption:** Architektur-Entscheidungen (Vanilla JS vs. Framework, Testing-Strategie)
3. **Prototypische Umsetzung:** Iterative Implementierung mit TDD-Ansatz (Test-Driven Development)
4. **Evaluation:** Dreifach-validierte Tests (automatisiert + manuell + Screenreader)
5. **Dokumentation:** Jedes WCAG-Kriterium mit Test-Evidenz belegt

### Evaluations-Framework

| Kriterium        | Testmethode           | Tool                    | Beleg                |
| ---------------- | --------------------- | ----------------------- | -------------------- |
| 1.1.1 (Nicht-Text-Inhalte) | Automatisiert + Manuell | Axe + NVDA           | Screenshot + SR-Transkript |
| 2.1.1 (Tastatur) | E2E-Test              | Playwright              | Test-Code + Video     |
| 4.1.2 (Name, Rolle, Wert) | Integration-Test | jest-axe + Testing Library | Test-Coverage-Report |
| …                | …                     | …                       | …                    |

→ Vollständige Evaluations-Tabelle in `docs/evaluation/wcag-compliance.md`

## 🤝 Beitragen

Dieses Projekt ist Teil einer Bachelorarbeit und nicht für externe Contributions gedacht.

**Feedback willkommen:**

- Issues für gefundene Accessibility-Probleme
- Diskussionen zu Implementierungs-Entscheidungen
- Vorschläge für Testing-Methodik

## 📄 Lizenz

MIT License - Siehe LICENSE für Details.

Hinweis: Dieses Projekt dient ausschließlich akademischen Zwecken im Rahmen einer Bachelorarbeit. Für Production-Use bitte gründliche Sicherheits- und Performance-Audits durchführen.

## ✍️ Autor & Kontext

**[Dein Name]**  
Bachelorarbeit, [Universität/Hochschule]  
Studiengang: [z.B. Medieninformatik / Informatik]  
Betreuer: [Prof. Dr. Name]  
Semester: [z.B. WiSe 2025/2026]

**Titel:** Konzeption und prototypische Umsetzung eines barrierefreien Web-Video-Players nach WCAG 2.2 Level AA

## 🔗 Ressourcen & Weiterführende Links

### WCAG & Accessibility

- [WCAG 2.2 Guidelines (W3C)](https://www.w3.org/WAI/WCAG22/quickref/)
- [ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM WCAG 2 Checklist](https://webaim.org/standards/wcag/checklist)

### Testing-Tools

- [Axe DevTools Documentation](https://developer.deque.com/axe/devtools/)
- [NVDA Screenreader](https://www.nvaccess.org/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Library](https://testing-library.com/)

### Akademische Quellen

- [W3C Media Accessibility User Requirements](https://www.w3.org/TR/media-accessibility-reqs/)
- [BBC Subtitle Guidelines](https://www.bbc.co.uk/accessibility/guides/subtitles/)
- [WebVTT Specification](https://www.w3.org/TR/webvtt1/)

---

**Status:** 🚧 In Entwicklung (Setup abgeschlossen, Implementierung läuft)  
**Letztes Update:** [Datum]  
**WCAG 2.2 AA Konformität:** 🎯 Ziel (in Evaluation)
