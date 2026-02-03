/**
 * IMP-43: Automatisierte Accessibility-Tests mit Axe
 * IMP-43E-A: Axe-Scan Initial-Zustand (Video nicht gestartet, Settings geschlossen)
 * WCAG 2.2 AA – Ziel: 0 Violations
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const REPORT_DIR = join(process.cwd(), 'docs', 'test-reports');

test.describe('IMP-43E-A: Axe-Scan Initial-Zustand', () => {
  test('Player hat keine A11y-Violations (Initial-Zustand)', async ({
    page,
  }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();

    mkdirSync(REPORT_DIR, { recursive: true });
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-')
      .slice(0, 19);
    const reportPath = join(REPORT_DIR, `axe-initial-${timestamp}.json`);
    writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf8');

    if (results.violations.length > 0) {
      const report = results.violations
        .map(
          v =>
            `[${v.id}] ${v.help}\n  Impact: ${v.impact}\n  ${v.nodes.length} node(s): ${v.nodes.map(n => n.html).join('; ')}`
        )
        .join('\n\n');
      throw new Error(
        `Axe found ${results.violations.length} violation(s). Report: ${reportPath}\n\n${report}`
      );
    }

    expect(results.violations).toEqual([]);
  });
});

test.describe('IMP-43E-B: Axe-Scan während Wiedergabe', () => {
  test('Player hat keine Violations während Wiedergabe', async ({ page }) => {
    await page.goto('/');

    await page.click('.player-btn--play-pause');
    await page.waitForTimeout(500);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});

test.describe('IMP-43E-C: Axe-Scan Settings-Panel offen', () => {
  test('Settings-Panel hat keine Violations', async ({ page }) => {
    await page.goto('/');

    await page.click('.player-btn--settings');
    await expect(page.locator('#player-settings-panel')).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});

test.describe('IMP-43E-D: Kompletter Tastatur-Workflow', () => {
  test('Video mit Untertiteln starten (nur Tastatur)', async ({ page }) => {
    await page.goto('/');

    // Tab zu Play-Button (Video ist vor Play im DOM, ggf. 2 Tabs)
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.locator(':focus').getAttribute('aria-label');
      if (focused === 'Abspielen') break;
    }
    const playFocused = await page.locator(':focus').getAttribute('aria-label');
    expect(playFocused).toBe('Abspielen');

    // Video starten
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Prüfe Video läuft
    const isPlaying = await page
      .locator('#player-video')
      .evaluate(v => !v.paused);
    expect(isPlaying).toBe(true);

    // Tab zu CC-Button (Timeline → Volume → CC = 3 Tabs)
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('Tab');
    }
    await expect(page.locator('.player-btn--captions')).toBeFocused();

    // Untertitel aktivieren
    await page.keyboard.press('Enter');
    const ccPressed = await page
      .locator('.player-btn--captions')
      .getAttribute('aria-pressed');
    expect(ccPressed).toBe('true');

    // Verifiziere Untertitel sichtbar (Text-Track mode)
    const captionsShowing = await page.locator('#player-video').evaluate(v => {
      const track = Array.from(v.textTracks || []).find(
        t => t.kind === 'captions'
      );
      return track?.mode === 'showing';
    });
    expect(captionsShowing).toBe(true);
  });
});

test.describe('IMP-43E-E: Settings-Panel Fokus-Management', () => {
  test('Settings-Panel Fokus-Management (Tastatur)', async ({ page }) => {
    await page.goto('/');

    // Tab zu Settings-Button
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.locator(':focus').getAttribute('aria-label');
      if (focused === 'Einstellungen') break;
    }
    await expect(page.locator('.player-btn--settings')).toBeFocused();

    // Settings öffnen
    await page.keyboard.press('Enter');
    await expect(page.locator('#player-settings-panel')).toBeVisible();

    // Fokus auf erstem Panel-Element (Wiedergabegeschwindigkeit-Select)
    let focusedId = await page.locator(':focus').getAttribute('id');
    expect(focusedId).toBe('player-settings-speed');

    // Tab zirkuliert im Panel (Speed → Quality → Close → Speed)
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('Tab');
    }
    focusedId = await page.locator(':focus').getAttribute('id');
    expect(focusedId).toBe('player-settings-speed');

    // ESC schließt Panel
    await page.keyboard.press('Escape');
    await expect(page.locator('#player-settings-panel')).toBeHidden();

    // Fokus zurück auf Settings-Button
    const focusedLabel = await page
      .locator(':focus')
      .getAttribute('aria-label');
    expect(focusedLabel).toBe('Einstellungen');
  });
});

test.describe('IMP-43: Axe Accessibility (WCAG 2.2 AA)', () => {
  test('Player-Seite: 0 Axe Violations für WCAG 2.2 AA', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();

    const violations = results.violations;

    if (violations.length > 0) {
      const report = violations
        .map(
          v =>
            `[${v.id}] ${v.help}\n  Impact: ${v.impact}\n  ${v.nodes.length} node(s): ${v.nodes.map(n => n.html).join('; ')}`
        )
        .join('\n\n');
      throw new Error(
        `Axe found ${violations.length} WCAG 2.2 AA violation(s):\n\n${report}`
      );
    }

    expect(violations).toHaveLength(0);
  });

  test('Player-Seite: Needs-Review-Items dokumentieren', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();

    const incomplete = results.incomplete ?? [];

    // Needs Review werden als "incomplete" zurückgegeben
    // Akzeptanzkriterium: Alle geprüft und dokumentiert (Pass/Fail/N/A)
    // Im Test: Wir dokumentieren sie – bei 0 Violations ist der Test bestanden
    if (incomplete.length > 0) {
      // eslint-disable-next-line no-console
      console.log(
        `IMP-43: ${incomplete.length} Needs-Review-Item(s) – manuell prüfen:`,
        JSON.stringify(
          incomplete.map(i => ({
            id: i.id,
            impact: i.impact,
            help: i.help,
            nodes: i.nodes.length,
          })),
          null,
          2
        )
      );
    }

    // Test besteht – Needs Review blockieren nicht, müssen aber manuell geprüft werden
    expect(results.violations).toHaveLength(0);
  });
});
