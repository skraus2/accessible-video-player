#!/usr/bin/env node
/**
 * IMP-43: Axe-Report als JSON/HTML speichern
 * Verwendung: npm run dev (in anderem Terminal) && node scripts/axe-report.js
 */
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPORT_DIR = join(__dirname, '..', 'docs', 'test-reports');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  } catch (e) {
    console.error(
      'Fehler: Dev-Server nicht erreichbar. Bitte zuerst "npm run dev" starten.'
    );
    process.exit(1);
  }

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
    .analyze();

  mkdirSync(REPORT_DIR, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const jsonPath = join(REPORT_DIR, `axe-report-${timestamp}.json`);
  writeFileSync(jsonPath, JSON.stringify(results, null, 2), 'utf8');

  console.log(`Axe-Report gespeichert: ${jsonPath}`);
  console.log(`Violations: ${results.violations.length}`);
  console.log(
    `Incomplete (Needs Review): ${(results.incomplete ?? []).length}`
  );
  console.log(`Passed: ${results.passes.length}`);

  if (results.violations.length > 0) {
    console.log('\nViolations:');
    results.violations.forEach(v => {
      console.log(`  [${v.id}] ${v.help} (${v.nodes.length} node(s))`);
    });
    process.exit(1);
  }

  await browser.close();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
