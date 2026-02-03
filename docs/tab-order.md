# Tab-Reihenfolge (IMP-21)

## IMP-28: Lautstärke-Slider Fokus-Entscheidung

**Entscheidung:** Fokus auf Slider beim Öffnen (bessere UX – sofortige Pfeiltasten-Bedienung).

- **Öffnen:** Lautstärke-Button klicken → Slider erscheint, Fokus springt auf Slider
- **Schließen:** Backdrop-Klick oder erneuter Button-Klick → Fokus zurück auf Button

## Dokumentierter Tab-Pfad

Die Tab-Reihenfolge folgt der visuellen Anordnung (links→rechts):

1. **Abspielen** (Play/Pause-Button)
2. **Videoposition** (Timeline-Slider)
3. **Lautstärke** (Lautstärke-Button)
4. **Lautstärke** (Lautstärke-Slider) – nur wenn geöffnet
5. **Untertitel** (CC-Button)
6. **Audiodeskription** (AD-Button)
7. **Einstellungen** (Settings-Button)
8. **Vollbild aktivieren** (Fullscreen-Button)
9. **Transkript** (IMP-40: Vollständiges Transkript anzeigen)

## Versteckte Elemente (nicht in Tab-Sequenz)

- **Lautstärke-Slider**: `tabindex="-1"` wenn geschlossen
- **Settings-Panel** (Close-Button, Wiedergabegeschwindigkeit, Videoqualität): `tabindex="-1"` wenn Panel geschlossen

## WCAG 2.4.3 (Fokus-Reihenfolge)

- Kein Element mit `tabindex > 0`
- Shift+Tab funktioniert rückwärts in korrekter Reihenfolge

## IMP-29: Globale Shortcuts (nur bei Player-Fokus)

| Taste | Aktion             |
| ----- | ------------------ |
| M     | Mute/Unmute        |
| F     | Vollbild ein/aus   |
| C     | Untertitel ein/aus |

Aktiv nur wenn Fokus in `.player-container` oder `.player-settings` (WCAG 2.1.4).
