# IMP-42: Responsive Design testen (WCAG 1.4.10, 1.4.4)

## Viewport-Breiten

| Breite | Gerätetyp      | Prüfpunkte                                       |
| ------ | -------------- | ------------------------------------------------ |
| 320px  | Mobile (klein) | Alle Controls sichtbar, kein horizontaler Scroll |
| 768px  | Tablet         | Layout optimal, Controls in einer/drei Zeilen    |
| 1920px | Desktop        | Layout optimal, max-width 64rem zentriert        |

## Implementierte Maßnahmen

- **flex-wrap: wrap** auf Haupt- und Sekundärleiste → Controls brechen bei Platzmangel um
- **rem-basierte Größen** → Skalierung bei Browser-Zoom (100%, 150%, 200%)
- **min-width: 0** auf Timeline → Flex-Item kann schrumpfen
- **width: 100%** auf Player-Container → Kein Überlauf bei schmalen Viewports
- **@media (max-width: 480px)** → Reduziertes Padding auf Mobile

## Akzeptanzkriterien-Checkliste

### 320px (Mobile)

- [ ] Player-Layout funktional
- [ ] Alle Controls erreichbar (ggf. gestapelt)
- [ ] Kein horizontales Scrollen
- [ ] Touch-Ziele mind. 44×44px

### 768px (Tablet)

- [ ] Layout optimal
- [ ] Controls gut gruppiert

### 1920px (Desktop)

- [ ] Layout optimal
- [ ] Player zentriert, max. 64rem breit

### Browser-Zoom (alle Viewports)

- [ ] 100%: Layout nutzbar
- [ ] 150%: Layout nutzbar
- [ ] 200%: Layout nutzbar (WCAG 1.4.4)

## Empfohlene Tests

### DevTools Responsive Mode

1. Chrome/Firefox: F12 → Toggle Device Toolbar (Ctrl+Shift+M)
2. Viewports: 320px, 768px, 1920px
3. Prüfen: Kein horizontaler Scroll, alle Controls klickbar

### Browser-Zoom

1. Strg/Cmd + Plus: 150%, 200%
2. Prüfen: Layout bleibt nutzbar, Text lesbar

### Optional: Echtes Gerät

- Smartphone (z. B. 375px)
- Tablet (z. B. 768px)
- Touch-Bedienung: Buttons/Slider gut erreichbar
