# IMP-43: Automatisierte Accessibility-Tests (Axe, Lighthouse)

## Übersicht

| Tool                     | Zweck                          | Ziel           |
| ------------------------ | ------------------------------ | -------------- |
| **Axe DevTools**         | Manueller Scan, WCAG 2.2 AA    | 0 Violations   |
| **Lighthouse**           | Accessibility + Best Practices | Score ≥90      |
| **@axe-core/playwright** | Automatisierter E2E-Test       | CI-Integration |

---

## 1. Axe DevTools Extension

### Installation

- **Chrome**: [Axe DevTools – Chrome Web Store](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd)
- **Firefox**: [Axe DevTools – Firefox Add-ons](https://addons.mozilla.org/de/firefox/addon/axe-devtools/)

### Manueller Scan

1. Dev-Server starten: `npm run dev`
2. Seite öffnen: http://localhost:3000
3. Browser DevTools öffnen (F12)
4. Tab **„Axe DevTools“** wählen
5. **„Scan All of my page“** klicken
6. Ergebnis prüfen: **Violations** (rot), **Needs Review** (gelb), **Passed** (grün)

### Akzeptanzkriterien

- **0 Violations** für WCAG 2.2 AA
- Alle **Needs Review**-Items manuell prüfen und dokumentieren (Pass/Fail/N/A)

---

## 2. Needs-Review-Items dokumentieren

Needs-Review-Items erfordern manuelle Prüfung, da Axe sie nicht automatisch als Pass/Fail einstufen kann.

### Dokumentationsvorlage

| Regel-ID            | Beschreibung    | Ergebnis | Begründung                    |
| ------------------- | --------------- | -------- | ----------------------------- |
| z.B. color-contrast | Kontrast prüfen | Pass     | Text hat ausreichend Kontrast |
| …                   | …               | Fail/N/A | …                             |

Speichern in: `docs/test-reports/axe-needs-review.md`

---

## 3. Lighthouse Accessibility Audit

### Manuell (Chrome DevTools)

1. Dev-Server starten: `npm run dev`
2. Seite öffnen: http://localhost:3000
3. DevTools öffnen (F12) → Tab **„Lighthouse“**
4. Kategorien wählen: **Accessibility**, **Best Practices**
5. **„Analyze page load“** klicken
6. Ergebnis: Accessibility Score ≥90

### Report speichern

- Nach dem Audit: **„Save report“** (oben rechts)
- Speichern als: `docs/test-reports/lighthouse-accessibility-YYYY-MM-DD.html`
- Optional: JSON-Export für CI-Vergleiche

---

## 4. Automatisierte Tests (Playwright + Axe)

### E2E-Tests ausführen

```bash
# Playwright-Browser installieren (einmalig)
npx playwright install --with-deps

# E2E-Tests (inkl. Axe WCAG 2.2 AA)
npm run test:e2e
```

### Axe-Test-Datei

- `tests/e2e/accessibility.e2e.test.js`
- Prüft: 0 Violations für WCAG 2.2 AA
- Tags: `wcag2a`, `wcag2aa`, `wcag22aa`

### Axe-Report als JSON speichern

```bash
npx playwright install   # Einmalig, falls noch nicht installiert
npm run dev &            # In anderem Terminal
sleep 3
npm run axe:report
```

Speichert: `docs/test-reports/axe-report-YYYY-MM-DDTHH-MM-SS.json`

---

## 5. Lighthouse CI

Lighthouse läuft automatisch bei Push auf `main`:

- Workflow: `.github/workflows/lighthouse.yml`
- Konfiguration: `lighthouserc.cjs`
- Assertion: `categories:accessibility` minScore **0.9** (90)

### Lokal ausführen

```bash
npm run dev &
sleep 5
npm run lighthouse:report
# oder: npx @lhci/cli autorun
```

---

## 6. Relevante WCAG-Kriterien

Axe prüft ca. 57 % aller WCAG-Kriterien automatisch. Typische Bereiche:

- **1.1.1** Nicht-Text-Inhalte (Alt-Texte)
- **1.3.1** Info und Beziehungen (Semantik)
- **1.4.3** Kontrast (Minimum)
- **2.1.1** Tastatur
- **2.4.4** Linkzweck
- **2.4.6** Überschriften und Labels
- **2.5.8** Zielgröße (WCAG 2.2)
- **4.1.2** Name, Rolle, Wert

---

## 7. False Positives / Begründungen

Falls ein Issue nicht behoben wird (z.B. bewusste Abweichung):

| Issue | Begründung |
| ----- | ---------- |
| …     | …          |

Dokumentieren in: `docs/test-reports/accessibility-exceptions.md`

---

## 8. Checkliste IMP-43

- [ ] Axe DevTools installiert (Chrome oder Firefox)
- [ ] „Scan All of my page“ durchgeführt → 0 Violations
- [ ] Needs-Review-Items geprüft und dokumentiert
- [ ] Lighthouse Accessibility Score ≥90
- [ ] Alle Issues gefixt oder begründet
- [ ] Reports gespeichert (JSON/HTML) in `docs/test-reports/`
