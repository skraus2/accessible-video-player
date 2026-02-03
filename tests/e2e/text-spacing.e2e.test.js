/**
 * IMP-45: Textabstände-Test (WCAG 1.4.12)
 * Prüft: Kein Content-Verlust bei erhöhten Textabständen
 */
import { test, expect } from '@playwright/test';

const TEXT_SPACING_STYLES = `
  * {
    line-height: 1.5 !important;
    letter-spacing: 0.12em !important;
    word-spacing: 0.16em !important;
  }
  p, li {
    margin-bottom: 2em !important;
  }
`;

test.describe('IMP-45: Textabstände (WCAG 1.4.12)', () => {
  test('Controls bleiben lesbar und klickbar mit Text Spacing', async ({
    page,
  }) => {
    await page.goto('/');

    await page.addStyleTag({ content: TEXT_SPACING_STYLES });

    const transcriptToggle = page.locator('.player-transcript__toggle');
    await expect(transcriptToggle).toBeVisible();
    await expect(transcriptToggle).toContainText('Transkript');

    await page.click('.player-btn--settings');
    await expect(page.locator('#player-settings-panel')).toBeVisible();
    await expect(page.locator('.player-settings__label').first()).toBeVisible();

    const labels = page.locator('.player-settings__label');
    const count = await labels.count();
    expect(count).toBeGreaterThanOrEqual(2);

    await page.keyboard.press('Escape');
  });

  test('Alle Buttons bleiben klickbar mit Text Spacing', async ({ page }) => {
    await page.goto('/');
    await page.addStyleTag({ content: TEXT_SPACING_STYLES });

    await page.click('.player-btn--play-pause');
    await page.waitForTimeout(300);
    const isPlaying = await page
      .locator('#player-video')
      .evaluate(v => !v.paused);
    expect(isPlaying).toBe(true);

    await page.click('.player-btn--captions');
    const ccPressed = await page
      .locator('.player-btn--captions')
      .getAttribute('aria-pressed');
    expect(ccPressed).toBe('true');
  });
});
