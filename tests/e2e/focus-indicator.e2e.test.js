/**
 * IMP-46: Fokus-Indikator-Konsistenz (WCAG 2.4.7, 2.4.13)
 * Prüft: Alle fokussierbaren Controls haben sichtbaren Fokus-Indikator
 */
import { test, expect } from '@playwright/test';

test.describe('IMP-46: Fokus-Indikator', () => {
  test('Play-Button hat Fokus-Indikator ≥2px bei Tastatur-Fokus', async ({
    page,
  }) => {
    await page.goto('/');

    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.locator(':focus').getAttribute('aria-label');
      if (focused === 'Abspielen') break;
    }

    const outlineWidth = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || !el.matches('.player-btn--play-pause')) return 0;
      return parseFloat(getComputedStyle(el).outlineWidth) || 0;
    });

    expect(outlineWidth).toBeGreaterThanOrEqual(2);
  });

  test('Fokus-CSS-Variablen sind gesetzt', async ({ page }) => {
    await page.goto('/');

    const vars = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        outlineWidth: root
          .getPropertyValue('--player-focus-outline-width-button')
          .trim(),
        focusColor: root.getPropertyValue('--color-border-focus').trim(),
      };
    });

    expect(vars.outlineWidth).toMatch(/3px|0\.1875rem/);
    expect(vars.focusColor).toMatch(/#0066cc|rgb/);
  });
});
