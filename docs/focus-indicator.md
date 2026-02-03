# IMP-46: Fokus-Indikator-Konsistenz (WCAG 2.4.7, 2.4.13)

## Anforderungen

| Kriterium    | Wert                          |
| ------------ | ----------------------------- |
| Mindestdicke | 2px (implementiert: 3px)      |
| Kontrast     | ≥3:1 zu Hintergrund           |
| Stil         | Konsistent über alle Controls |

## Implementierter Stil

```css
outline: 3px solid var(--color-border-focus);
outline-offset: 2px;
```

- **Farbe:** `#0066cc` (--color-border-focus)
- **Dicke:** 3px (--player-focus-outline-width-button)
- **Kontrast:** #0066cc auf #f0f0f0 (bg-bar) ≈ 4.5:1 ✓

## Controls mit Fokus-Indikator

| Control                      | Selektor                        | Fokus-Styling          |
| ---------------------------- | ------------------------------- | ---------------------- |
| Play/Pause                   | .player-btn--play-pause         | outline 3px            |
| Timeline-Slider              | .player-range--timeline         | outline 3px (am Input) |
| Lautstärke-Button            | .player-btn--volume             | outline 3px            |
| Lautstärke-Slider            | .player-range--volume           | outline 3px            |
| CC, AD, Settings, Fullscreen | .player-btn--secondary          | outline 3px            |
| Transkript-Toggle            | .player-transcript\_\_toggle    | outline 3px            |
| Transkript-Links             | .player-transcript\_\_timestamp | outline 3px            |
| Settings Close               | .player-btn--close              | outline 3px            |
| Settings Selects             | .player-settings\_\_select      | outline 3px            |

## Manuelle Prüfung

1. **Tastatur:** Tab durch alle Controls, visuell Fokus prüfen
2. **Kontrast:** Fokus-Farbe (#0066cc) vs. Hintergrund messen (z. B. WebAIM Contrast Checker)
3. **Screenshots:** Fokus-Serie für Dokumentation

## Kontrast-Messung

| Hintergrund                | Fokus-Farbe | Kontrast |
| -------------------------- | ----------- | -------- |
| #f0f0f0 (bg-bar)           | #0066cc     | ~4.5:1 ✓ |
| #e5e5e5 (bg-bar-secondary) | #0066cc     | ~4.2:1 ✓ |
| #ffffff (bg)               | #0066cc     | ~5.1:1 ✓ |

## focus-visible

Alle Controls nutzen `:focus-visible` – Fokus nur bei Tastatur-Navigation sichtbar, nicht bei Maus-Klick (`:focus:not(:focus-visible)` setzt outline: none).
