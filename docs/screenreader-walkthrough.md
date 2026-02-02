# IMP-37: Screenreader-Walkthrough (WCAG 4.1.2, 4.1.3, 2.1.1, 2.4.x)

Systematischer SR-Test für den barrierefreien Video-Player. Empfohlen: NVDA (30–60 Min.), JAWS (kritische Flows), optional VoiceOver (macOS/iOS).

## Voraussetzungen

- **NVDA**: [nvaccess.org](https://www.nvaccess.org/) (kostenlos)
- **JAWS**: Lizenz erforderlich (kritische Flows)
- **VoiceOver**: macOS (Cmd+F5) / iOS (Triple-Tap)
- Player lokal starten: `npm run dev` oder `npx serve src`

## Erwartete SR-Ansagen (Implementierung)

| Element               | Erwartete Ansage                                                                |
| --------------------- | ------------------------------------------------------------------------------- |
| Play/Pause (pausiert) | „Abspielen, Button"                                                             |
| Play/Pause (läuft)    | „Pause, Button"                                                                 |
| Timeline-Slider       | „Videoposition, Schieberegler, [X Minuten Y Sekunden von Z Minuten W Sekunden]" |
| Lautstärke-Button     | „Lautstärke, Button, eingeklappt" / „ausgeklappt"                               |
| Lautstärke-Slider     | „Lautstärke, Schieberegler, [X] Prozent"                                        |
| Untertitel            | „Untertitel, Umschalter, nicht gedrückt" / „gedrückt"                           |
| Audiodeskription      | „Audiodeskription, Umschalter, nicht gedrückt" / „gedrückt"                     |
| Einstellungen         | „Einstellungen, Button, eingeklappt" / „ausgeklappt"                            |
| Vollbild              | „Vollbild aktivieren, Umschalter, nicht gedrückt" / „gedrückt"                  |
| Settings-Dialog       | „Einstellungen, Dialog"                                                         |

---

## Szenario 1: Video mit Untertiteln starten (Tab-Navigation)

**Schritte:**

1. Seite laden, Fokus auf Player
2. Tab → Play-Button
3. Enter/Space → Video startet
4. Tab → Timeline
5. Tab → Lautstärke
6. Tab → Untertitel
7. Enter → Untertitel aktivieren

**Erwartete Ansagen:**

| Schritt           | Erwartete Ansage                                   |
| ----------------- | -------------------------------------------------- |
| Tab zu Play       | „Abspielen, Button"                                |
| Nach Enter        | „Video wird abgespielt" (Live-Region)              |
| Tab zu Timeline   | „Videoposition, Schieberegler, [Zeit] von [Dauer]" |
| Tab zu Lautstärke | „Lautstärke, Button, eingeklappt"                  |
| Tab zu Untertitel | „Untertitel, Umschalter, nicht gedrückt"           |
| Nach Enter (CC)   | „Untertitel aktiviert" (Live-Region)               |

**Checkliste:**

- [ ] Alle Ansagen klar und eindeutig
- [ ] Kein „Button, Button" oder leerer Name
- [ ] Live-Region meldet Play/CC-Status
- [ ] Fokus-Pfad logisch

---

## Szenario 2: Lautstärke ändern (Slider-Bedienung)

**Schritte:**

1. Tab zu Lautstärke-Button
2. Enter → Slider öffnet, Fokus auf Slider
3. Pfeil-Hoch → Lautstärke erhöhen
4. Pfeil-Runter → Lautstärke verringern
5. Tab oder Klick außerhalb → Slider schließen

**Erwartete Ansagen:**

| Schritt         | Erwartete Ansage                        |
| --------------- | --------------------------------------- |
| Slider öffnet   | „Lautstärke, Schieberegler, 70 Prozent" |
| Pfeil-Hoch      | „75 Prozent" (oder neuer Wert)          |
| Pfeil-Runter    | „65 Prozent" (oder neuer Wert)          |
| Slider schließt | Fokus zurück auf „Lautstärke, Button"   |

**Checkliste:**

- [ ] Slider mit Prozent-Einheit (aria-valuetext)
- [ ] Fokus auf Slider beim Öffnen
- [ ] Pfeiltasten sofort bedienbar

---

## Szenario 3: Einstellungen öffnen, Geschwindigkeit ändern, schließen

**Schritte:**

1. Tab zu Einstellungen-Button
2. Enter → Panel öffnet
3. Tab → Wiedergabegeschwindigkeit
4. Pfeil-Runter → z.B. 1.25x wählen
5. Tab → Close-Button
6. Enter → Panel schließt

**Erwartete Ansagen:**

| Schritt         | Erwartete Ansage                                      |
| --------------- | ----------------------------------------------------- |
| Panel öffnet    | „Einstellungen, Dialog"                               |
| Fokus auf Speed | „Wiedergabegeschwindigkeit, Kombinationsfeld, …"      |
| Tab zu Close    | „Einstellungen schließen, Button"                     |
| Panel schließt  | Fokus zurück auf „Einstellungen, Button, ausgeklappt" |

**Checkliste:**

- [ ] Dialog-Label „Einstellungen" angesagt
- [ ] Fokus-Loop im Panel (Tab vom letzten → erstes)
- [ ] ESC schließt Panel
- [ ] Fokus-Return auf Settings-Button

---

## Szenario 4: Timeline scrubben

**Schritte:**

1. Tab zu Timeline-Slider
2. Pfeil-Rechts → 5 Sekunden vor
3. Pfeil-Links → 5 Sekunden zurück
4. Home → Anfang
5. End → Ende

**Erwartete Ansagen:**

| Schritt            | Erwartete Ansage                                                  |
| ------------------ | ----------------------------------------------------------------- |
| Fokus auf Timeline | „Videoposition, Schieberegler, [Position] von [Dauer]"            |
| Pfeil-Rechts       | Aktualisierte Zeit (z.B. „5 Sekunden von 10 Minuten 15 Sekunden") |
| Home               | „0 Sekunden von …"                                                |
| End                | „[Dauer] von [Dauer]"                                             |

**Checkliste:**

- [ ] aria-valuetext mit lesbarer Zeit
- [ ] Pfeiltasten, Home, End funktionieren

---

## Szenario 5: Video-Klick (ohne Fokus auf Button)

**Schritte:**

1. Tab zu Timeline (Fokus nicht auf Play)
2. Klick auf Video-Bereich (Play)

**Erwartete Ansage:**

- „Video wird abgespielt" (Live-Region)
- Fokus bleibt auf Timeline

**Checkliste:**

- [ ] Status ohne Fokus-Wechsel
- [ ] Meldung klar und rechtzeitig

---

## Szenario 6: Globale Shortcuts (M, F, C)

**Schritte:**

1. Fokus im Player (z.B. Play-Button)
2. C → Untertitel ein/aus
3. M → Mute/Unmute
4. F → Vollbild (falls unterstützt)

**Erwartete Ansagen:**

- C: „Untertitel aktiviert" / „Untertitel deaktiviert"
- M: Lautstärke-Slider zeigt 0% / vorheriger Wert
- F: „Vollbild aktivieren" ↔ „Vollbild beenden"

**Checkliste:**

- [ ] Shortcuts nur bei Player-Fokus
- [ ] Keine Reaktion bei Fokus außerhalb

---

## Problem-Dokumentation

| #   | Problem | Schwere | SR  | Schritte |
| --- | ------- | ------- | --- | -------- |
| 1   |         |         |     |          |
| 2   |         |         |     |          |

**Schweregrade:** Kritisch / Mittel / Gering

---

## Akzeptanzkriterien (IMP-37)

- [ ] Alle Controls per SR navigierbar und bedienbar
- [ ] Alle Ansagen klar und eindeutig
- [ ] Kein „Button, Button" oder leerer Name
- [ ] Fokus-Pfad logisch nachvollziehbar

---

## Abhängigkeiten

- IMP-30: aria-valuetext Timeline
- IMP-31: aria-valuetext Lautstärke
- IMP-32: aria-label Play/Pause
- IMP-33: aria-pressed Toggle-Buttons
- IMP-34: aria-expanded Settings/Lautstärke
- IMP-35: Dialog aria-labelledby
- IMP-36: Live-Region Statusmeldungen
