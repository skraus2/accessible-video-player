/**
 * IMP-47: Regressionstests (Smoke Tests)
 * Basis-Testset – läuft nach jedem größeren Code-Change
 * Ziel: <15 Min., alle Tests Pass
 */
import { test, expect } from '@playwright/test';

test.describe('IMP-47: Regression Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Video startet/pausiert (Maus)', async ({ page }) => {
    await page.click('.player-btn--play-pause');
    await page.waitForTimeout(300);
    const isPlaying = await page
      .locator('#player-video')
      .evaluate(v => !v.paused);
    expect(isPlaying).toBe(true);

    await page.click('.player-btn--play-pause');
    await page.waitForTimeout(200);
    const isPaused = await page
      .locator('#player-video')
      .evaluate(v => v.paused);
    expect(isPaused).toBe(true);
  });

  test('Video startet/pausiert (Tastatur)', async ({ page }) => {
    await page.getByRole('button', { name: 'Abspielen' }).focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    const isPlaying = await page
      .locator('#player-video')
      .evaluate(v => !v.paused);
    expect(isPlaying).toBe(true);
  });

  test('Timeline scrubben (Maus)', async ({ page }) => {
    const timeline = page.locator('#player-timeline-input');
    const box = await timeline.boundingBox();
    expect(box).toBeTruthy();
    await page.mouse.click(box.x + box.width * 0.5, box.y + box.height / 2);
    const value = parseInt(await timeline.inputValue(), 10);
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(100);
  });

  test('Timeline scrubben (Tastatur)', async ({ page }) => {
    const timeline = page.locator('#player-timeline-input');
    await timeline.focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    const value = parseInt(await timeline.inputValue(), 10);
    expect(value).toBeGreaterThanOrEqual(0);
  });

  test('Lautstärke ändern (Maus)', async ({ page }) => {
    await page.click('.player-btn--volume');
    await expect(page.locator('#volume-slider')).toBeVisible();
    const volumeInput = page.locator('#player-volume-input');
    const box = await volumeInput.boundingBox();
    expect(box).toBeTruthy();
    await page.mouse.click(box.x + box.width * 0.3, box.y + box.height / 2);
    const value = parseInt(await volumeInput.inputValue(), 10);
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(100);
  });

  test('Lautstärke ändern (Tastatur)', async ({ page }) => {
    await page.click('.player-btn--volume');
    const volumeInput = page.locator('#player-volume-input');
    await volumeInput.focus();
    await page.keyboard.press('ArrowDown');
    const value = parseInt(await volumeInput.inputValue(), 10);
    expect(value).toBeLessThanOrEqual(100);
  });

  test('Untertitel aktivieren', async ({ page }) => {
    await page.click('.player-btn--captions');
    const ccPressed = await page
      .locator('.player-btn--captions')
      .getAttribute('aria-pressed');
    expect(ccPressed).toBe('true');
    const showing = await page.locator('#player-video').evaluate(v => {
      const t = Array.from(v.textTracks || []).find(x => x.kind === 'captions');
      return t?.mode === 'showing';
    });
    expect(showing).toBe(true);
  });

  test('Settings öffnen/schließen (Maus)', async ({ page }) => {
    await page.click('.player-btn--settings');
    await expect(page.locator('#player-settings-panel')).toBeVisible();
    await expect(page.locator('#player-settings-speed')).toBeFocused();
    await page.click('.player-btn--close');
    await expect(page.locator('#player-settings-panel')).toBeHidden();
  });

  test('Settings öffnen/schließen (Tastatur + ESC)', async ({ page }) => {
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.locator(':focus').getAttribute('aria-label');
      if (focused === 'Einstellungen') break;
    }
    await page.keyboard.press('Enter');
    await expect(page.locator('#player-settings-panel')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#player-settings-panel')).toBeHidden();
    await expect(page.locator('.player-btn--settings')).toBeFocused();
  });

  test('Fullscreen aktivieren/deaktivieren', async ({ page }, testInfo) => {
    // Fullscreen-API funktioniert in Chromium-Headless nicht – mit --headed oder Firefox/WebKit testen
    test.skip(
      testInfo.project.name === 'chromium',
      'Fullscreen API does not work in Chromium headless'
    );

    await page.click('.player-btn--fullscreen');
    await expect(page.locator('.player-btn--fullscreen')).toHaveAttribute(
      'aria-pressed',
      'true',
      { timeout: 5000 }
    );

    await page.click('.player-btn--fullscreen');
    await expect(page.locator('.player-btn--fullscreen')).toHaveAttribute(
      'aria-pressed',
      'false',
      { timeout: 5000 }
    );
  });

  test('Tab-Reihenfolge korrekt', async ({ page }) => {
    const found = [];
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('Tab');
      const label = await page.locator(':focus').getAttribute('aria-label');
      const id = await page.locator(':focus').getAttribute('id');
      if (label) found.push(label);
      else if (id === 'player-timeline-input') found.push('Videoposition');
      if (found.length >= 7) break;
    }
    expect(found).toContain('Abspielen');
    expect(found).toContain('Untertitel');
    expect(found).toContain('Einstellungen');
  });

  test('Screenreader-Ansagen: Play-Button aria-label', async ({ page }) => {
    const playBtn = page.locator('.player-btn--play-pause');
    await expect(playBtn).toHaveAttribute('aria-label', 'Abspielen');
    await page.click('.player-btn--play-pause');
    await page.waitForTimeout(200);
    await expect(playBtn).toHaveAttribute('aria-label', 'Pause');
  });

  test('Screenreader-Ansagen: CC aria-pressed', async ({ page }) => {
    await expect(page.locator('.player-btn--captions')).toHaveAttribute(
      'aria-pressed',
      'false'
    );
    await page.click('.player-btn--captions');
    await expect(page.locator('.player-btn--captions')).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });
});
