# IMP-39: Audiodeskription-Spur testen (WCAG 1.2.5)

## Implementierungsstatus

**Aktuell:** Text-Track-Fallback (keine separate Audio-Spur)

- `<track kind="descriptions">` mit `descriptions-de.vtt`
- Screenreader lesen die Beschreibungstexte bei aktiven Cues vor
- Keine native HTML5-Multi-Audio-Unterstützung (echte AD-Audio-Spur würde MSE/HLS erfordern)

## Beschreibungsinhalt (descriptions-de.vtt)

| Zeit        | Inhalt                                             |
| ----------- | -------------------------------------------------- |
| 0:02–0:04   | Eine Person sitzt vor einem neutralen Hintergrund. |
| 0:08–0:09.5 | Die Person lächelt in die Kamera.                  |

## Akzeptanzkriterien-Checkliste

### Text-Track-Implementierung

- [x] AD-Button schaltet `kind="descriptions"` Track ein/aus
- [x] Screenreader können Beschreibungen vorlesen (bei `mode="showing"`)
- [x] aria-pressed synchron mit Track-Zustand

### Inhalts-Check

- [ ] **Personen:** Wer ist zu sehen? (z.B. „Eine Person“)
- [ ] **Setting:** Wo spielt die Szene? (z.B. „neutraler Hintergrund“)
- [ ] **Handlungen:** Was passiert visuell? (z.B. „lächelt in die Kamera“)
- [ ] **On-Screen-Texte:** Werden eingeblendete Texte beschrieben? (falls relevant)
- [ ] **Wesentliche visuelle Infos:** Alles Wichtige für Verständnis ohne Bild?

### Timing (Best Practice)

- **Idealerweise:** AD-Cues in Sprechpausen des Haupt-Audios
- **Aktuell:** Cues können mit Untertiteln überlappen (bei Text-Track unkritisch)
- **Bei echter Audio-AD:** Keine Überlappung mit Dialog

## Empfohlene Tests

### 1. Screenreader-Test (NVDA/JAWS/VoiceOver)

1. AD-Button aktivieren (aria-pressed="true")
2. Video starten
3. Prüfen: Werden die Beschreibungen zu den Cue-Zeiten vorgelesen?
4. Prüfen: Sind die Texte vollständig und verständlich?

### 2. Inhalts-Check

- [ ] Alle sichtbaren Personen beschrieben?
- [ ] Schauplatz/Szenerie beschrieben?
- [ ] Wichtige Handlungen und Gesten beschrieben?
- [ ] Einblendungen/Overlays beschrieben (falls vorhanden)?

### 3. Alternativ: Texttranskript

Falls nur Text-Track (kein Audio): Vollständiges Transkript mit allen visuellen Infos bereitstellen.

## Hinweise

- **Echte Audio-AD:** Würde separate Audiospur oder gemischtes Audio erfordern (z.B. HLS mit mehreren Audio-Tracks)
- **Text-Track:** Ausreichend für Screenreader-Nutzer; sehbehinderte Nutzer ohne SR profitieren von echter Audio-AD
- **Timing:** Bei längeren Videos Cues in Sprechpausen legen (≥2–3 Sekunden Pause empfohlen)
