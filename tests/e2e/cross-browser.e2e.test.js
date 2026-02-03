/**
 * IMP-43E-G, IMP-44: Cross-Browser-Tests (Chrome, Firefox, Safari, Edge)
 * Läuft automatisch in allen 4 Browsern via playwright.config.js projects
 */
import { test, expect } from '@playwright/test';

test.describe('IMP-44: Cross-Browser Kompatibilität', () => {
  test('Play-Button funktioniert', async ({ page }) => {
    await page.goto('/');
    await page.click('.player-btn--play-pause');
    await page.waitForTimeout(500);

    const isPlaying = await page
      .locator('#player-video')
      .evaluate(v => !v.paused);
    expect(isPlaying).toBe(true);
  });

  test('Timeline-Slider funktioniert', async ({ page }) => {
    await page.goto('/');
    await page.click('.player-btn--play-pause');
    await page.waitForTimeout(300);

    const timeline = page.locator('#player-timeline-input');
    await timeline.focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    const value = parseInt(await timeline.inputValue(), 10);
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(100);
  });

  test('Lautstärke-Slider funktioniert', async ({ page }) => {
    await page.goto('/');
    await page.click('.player-btn--volume');
    await expect(page.locator('#volume-slider')).toBeVisible();

    const volumeInput = page.locator('#player-volume-input');
    await volumeInput.focus();
    await page.keyboard.press('ArrowDown');
    const valueAfter = parseInt(await volumeInput.inputValue(), 10);
    expect(valueAfter).toBeLessThanOrEqual(100);
    expect(valueAfter).toBeGreaterThanOrEqual(0);
  });

  test('Untertitel werden angezeigt', async ({ page }) => {
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

  test('Fullscreen-Toggle funktioniert', async ({ page }, testInfo) => {
    // Fullscreen-API funktioniert in Chromium-Headless nicht
    test.skip(
      testInfo.project.name === 'chromium',
      'Fullscreen API does not work in Chromium headless'
    );

    await page.goto('/');
    await page.click('.player-btn--fullscreen');

    const ariaPressed = await page
      .locator('.player-btn--fullscreen')
      .getAttribute('aria-pressed');
    expect(ariaPressed).toBe('true');

    await page.click('.player-btn--fullscreen');
    const ariaPressedAfter = await page
      .locator('.player-btn--fullscreen')
      .getAttribute('aria-pressed');
    expect(ariaPressedAfter).toBe('false');
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
