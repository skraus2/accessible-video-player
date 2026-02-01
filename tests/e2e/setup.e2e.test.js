import { test, expect } from '@playwright/test';

test('Dev-Server ist erreichbar', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Barrierefreier Video-Player/);
  await expect(page.locator('h1')).toHaveText('Setup erfolgreich!');
});

test('Seite hat korrekte HTML-Struktur', async ({ page }) => {
  await page.goto('/');
  const lang = await page.locator('html').getAttribute('lang');
  expect(lang).toBe('de');

  const viewport = await page.locator('meta[name="viewport"]');
  await expect(viewport).toHaveAttribute('content', /width=device-width/);
});
