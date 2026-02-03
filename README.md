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

## 🛠️ Technologien

| Bereich              | Technologie                                   |
| -------------------- | --------------------------------------------- |
| **Markup**           | HTML5 (semantisch, natives `<video>`)         |
| **Styling**          | CSS3 (Custom Properties, Flexbox, Responsive) |
| **Logik**            | Vanilla JavaScript (ES6+ Module)              |
| **Unit/Integration** | Jest, Testing Library, JSDOM                  |
| **E2E**              | Playwright, @axe-core/playwright              |

**Warum Vanilla JS?**  
Frameworks können Fokus-Management und ARIA-Handling erschweren. Vanilla JS ermöglicht präzise Kontrolle über alle Accessibility-Aspekte.

### Testing-Strategie (Triple-Layer Approach)

| Ebene                 | Tools                                | Coverage | WCAG-Prüfung                                               |
| --------------------- | ------------------------------------ | -------- | ---------------------------------------------------------- |
| **Unit Tests**        | Jest + JSDOM                         | ~90%     | Helper-Funktionen, State-Management                        |
| **Integration Tests** | Testing Library + jest-axe           | ~80%     | Controls, ARIA-Interaktionen, automatisierte Axe-Scans     |
| **E2E Tests**         | Playwright + @axe-core/playwright    | ~70%     | User-Workflows, Cross-Browser, automatisierte WCAG-Prüfung |
| **Manuelle Tests**    | NVDA, JAWS, Axe DevTools, Lighthouse | 100%     | Screenreader-UX, Subjektive Kriterien                      |

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

### Unit Tests (Jest + JSDOM)

Helper-Funktionen, Formatierung, State-Management.

```bash
npm run test:unit
```

### Integration Tests (Testing Library + JSDOM)

Controls, ARIA-Interaktionen, Fokus-Management, Live-Region.

```bash
npm run test:integration
```

### E2E Tests (Playwright)

User-Workflows, Cross-Browser, Axe-Scans, Tastatur-Navigation.

```bash
# Playwright-Browser einmalig installieren
npx playwright install

# Alle E2E-Tests (startet Dev-Server automatisch)
npm run test:e2e

# Regression-Smoke-Tests (nur Chromium, ~5 Min.)
npm run test:regression

# E2E mit UI (interaktiv)
npm run test:e2e:ui
```

### Alle Tests

```bash
npm test          # Unit + Integration
npm run test:e2e  # E2E separat (benötigt Playwright)
npm run test:coverage  # Coverage-Report
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

### Automatisierte Accessibility-Reports (IMP-43)

```bash
# Axe-Report als JSON speichern (Dev-Server muss laufen)
npm run axe:report
# → docs/test-reports/axe-report-*.json

# Lighthouse-Report (Dev-Server muss laufen)
npm run dev &
sleep 5
npm run lighthouse:report
```

→ Vollständige Anleitung: `docs/accessibility-testing.md`

## 📁 Projektstruktur

```
accessible-video-player/
├── src/
│   ├── index.html                # Haupt-HTML mit Player-Markup
│   ├── css/
│   │   ├── variables.css         # Design System (CSS Custom Properties)
│   │   ├── player.css            # Player-Styling
│   │   └── utilities.css         # .sr-only, etc.
│   ├── js/
│   │   ├── player.js             # Main Entry Point (alle Init-Funktionen)
│   │   └── utils/
│   │       ├── formatTime.js     # Zeitformatierung, aria-valuetext
│   │       ├── updateTimelineAria.js
│   │       ├── announceStatus.js # Live-Region (WCAG 4.1.3)
│   │       ├── togglePlayPause.js
│   │       ├── toggleCaptions.js
│   │       ├── toggleDescriptions.js
│   │       └── toggleFullscreen.js
│   └── assets/videos/
│       ├── sample.mp4            # Test-Video (separat laden)
│       ├── captions-de.vtt
│       └── descriptions-de.vtt
├── tests/
│   ├── unit/                     # Jest
│   ├── integration/              # Testing Library
│   └── e2e/                      # Playwright + Axe
├── docs/                         # accessibility-testing.md, tab-order.md, etc.
├── .github/workflows/
│   ├── tests.yml
│   └── lighthouse.yml
├── jest.config.cjs
├── playwright.config.js
└── package.json
```

## 🎯 WCAG 2.2 Level AA Konformität

### Erfüllte Erfolgskriterien (geplant)

| Prinzip         | Level A | Level AA | Gesamt |
| --------------- | ------- | -------- | ------ |
| 1. Wahrnehmbar  | 9/9 ✅  | 5/5 ✅   | 14/14  |
| 2. Bedienbar    | 7/7 ✅  | 7/7 ✅   | 14/14  |
| 3. Verständlich | 4/4 ✅  | 3/3 ✅   | 7/7    |
| 4. Robust       | 2/2 ✅  | 1/1 ✅   | 3/3    |
| **GESAMT**      | 22/22   | 16/16    | 38/38  |

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

| Kriterium                  | Testmethode             | Tool                       | Beleg                      |
| -------------------------- | ----------------------- | -------------------------- | -------------------------- |
| 1.1.1 (Nicht-Text-Inhalte) | Automatisiert + Manuell | Axe + NVDA                 | Screenshot + SR-Transkript |
| 2.1.1 (Tastatur)           | E2E-Test                | Playwright                 | Test-Code + Video          |
| 4.1.2 (Name, Rolle, Wert)  | Integration-Test        | jest-axe + Testing Library | Test-Coverage-Report       |
| …                          | …                       | …                          | …                          |

→ Vollständige Evaluations-Tabelle in `docs/evaluation/wcag-compliance.md`

## ⚠️ Bekannte Limitationen

- **Test-Video:** `sample.mp4` muss separat geladen werden (nicht im Repo, >5 MB)
- **Audiodeskription:** Text-Track (VTT), keine echte Audio-Spur
- **Videoqualität:** Select vorhanden, Logik nicht implementiert
- **Fullscreen:** In Headless-E2E-Tests kann Vollbild eingeschränkt sein

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
