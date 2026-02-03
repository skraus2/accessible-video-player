/**
 * IMP-43E-G: Cross-Browser-Tests (Chrome, Firefox, Safari)
 * Läuft automatisch in allen 3 Browsern via playwright.config.js projects
 */
import { test, expect } from '@playwright/test';

test.describe('IMP-43E-G: Cross-Browser Grundfunktionen', () => {
  test('Play-Button funktioniert', async ({ page }) => {
    await page.goto('/');
    await page.click('.player-btn--play-pause');
    await page.waitForTimeout(500);

    const isPlaying = await page
      .locator('#player-video')
      .evaluate(v => !v.paused);
    expect(isPlaying).toBe(true);
  });

  test('Untertitel-Toggle funktioniert', async ({ page }) => {
    await page.goto('/');
    await page.click('.player-btn--captions');

    const ccPressed = await page
      .locator('.player-btn--captions')
      .getAttribute('aria-pressed');
    expect(ccPressed).toBe('true');

    const captionsShowing = await page.locator('#player-video').evaluate(v => {
      const track = Array.from(v.textTracks || []).find(
        t => t.kind === 'captions'
      );
      return track?.mode === 'showing';
    });
    expect(captionsShowing).toBe(true);
  });

  test('Settings-Panel öffnen und schließen funktioniert', async ({ page }) => {
    await page.goto('/');
    await page.click('.player-btn--settings');

    await expect(page.locator('#player-settings-panel')).toBeVisible();
    await expect(page.locator('#player-settings-speed')).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(page.locator('#player-settings-panel')).toBeHidden();
    await expect(page.locator('.player-btn--settings')).toBeFocused();
  });
});
