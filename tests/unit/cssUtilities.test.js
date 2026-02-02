/**
 * IMP-11U: Unit Tests für CSS-Utilities
 * Testet .sr-only, CSS-Variablen, box-sizing, hasClass-Helper
 */
const { readFileSync } = require('fs');
const { join } = require('path');
const { hasClass } = require('../utils/domHelpers.js');

const projectRoot = join(__dirname, '../..');

/** Injiziert CSS-Dateien in das Dokument für getComputedStyle-Tests */
function injectCSS() {
  const variablesCSS = readFileSync(
    join(projectRoot, 'src/css/variables.css'),
    'utf-8'
  );
  const utilitiesCSS = readFileSync(
    join(projectRoot, 'src/css/utilities.css'),
    'utf-8'
  );

  const style = document.createElement('style');
  style.textContent = variablesCSS + '\n' + utilitiesCSS;
  document.head.appendChild(style);
}

describe('CSS Utilities (IMP-11U)', () => {
  beforeAll(() => {
    injectCSS();
  });

  describe('hasClass Helper', () => {
    test('gibt true zurück wenn Element die Klasse hat', () => {
      const div = document.createElement('div');
      div.className = 'sr-only';
      expect(hasClass(div, 'sr-only')).toBe(true);
    });

    test('gibt true zurück bei mehreren Klassen', () => {
      const div = document.createElement('div');
      div.className = 'foo sr-only bar';
      expect(hasClass(div, 'sr-only')).toBe(true);
    });

    test('gibt false zurück wenn Klasse fehlt', () => {
      const div = document.createElement('div');
      div.className = 'other-class';
      expect(hasClass(div, 'sr-only')).toBe(false);
    });

    test('gibt false zurück bei Teilübereinstimmung', () => {
      const div = document.createElement('div');
      div.className = 'sr-only-focus';
      expect(hasClass(div, 'sr-only')).toBe(false);
    });

    test('gibt false zurück bei null/undefined Element', () => {
      expect(hasClass(null, 'sr-only')).toBe(false);
      expect(hasClass(undefined, 'sr-only')).toBe(false);
    });
  });

  describe('.sr-only Klasse', () => {
    test('Element ist visuell versteckt (position, width, height)', () => {
      const div = document.createElement('div');
      div.className = 'sr-only';
      div.textContent = 'Screenreader-only Text';
      document.body.appendChild(div);

      const styles = window.getComputedStyle(div);
      expect(styles.position).toBe('absolute');
      expect(styles.width).toBe('1px');
      expect(styles.height).toBe('1px');

      document.body.removeChild(div);
    });

    test('Element hat overflow hidden und clip für visuelle Verbergung', () => {
      const div = document.createElement('div');
      div.className = 'sr-only';
      document.body.appendChild(div);

      const styles = window.getComputedStyle(div);
      expect(styles.overflow).toBe('hidden');
      expect(styles.clip).toBe('rect(0px, 0px, 0px, 0px)');

      document.body.removeChild(div);
    });

    test('Element ist für Screenreader zugänglich (im DOM, hat Inhalt)', () => {
      const div = document.createElement('div');
      div.className = 'sr-only';
      div.textContent = 'Zugänglicher Text';
      document.body.appendChild(div);

      expect(div.textContent).toBe('Zugänglicher Text');
      expect(div.getAttribute('aria-hidden')).toBeNull();

      document.body.removeChild(div);
    });
  });

  describe('CSS-Variablen (:root)', () => {
    test('--color-primary existiert und hat Wert', () => {
      const root = document.documentElement;
      const value = getComputedStyle(root).getPropertyValue('--color-primary');
      expect(value.trim()).toBe('#0066cc');
    });

    test('Design-System-Farben sind definiert', () => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);

      expect(styles.getPropertyValue('--color-text').trim()).toBe('#1a1a1a');
      expect(styles.getPropertyValue('--color-bg').trim()).toBe('#ffffff');
      expect(styles.getPropertyValue('--color-border-focus').trim()).toBe(
        '#0066cc'
      );
    });

    test('Abstands-Variablen sind definiert', () => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);

      expect(styles.getPropertyValue('--space-xs').trim()).toBe('0.25rem');
      expect(styles.getPropertyValue('--space-md').trim()).toBe('1rem');
      expect(styles.getPropertyValue('--space-xl').trim()).toBe('2rem');
    });

    test('Player-spezifische Variablen sind definiert', () => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);

      expect(styles.getPropertyValue('--player-touch-target').trim()).toBe(
        '2.75rem'
      );
      expect(styles.getPropertyValue('--player-radius').trim()).toBe('0.25rem');
    });
  });

  describe('box-sizing: border-box', () => {
    test('ist global auf border-box gesetzt', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      const styles = window.getComputedStyle(div);
      expect(styles.boxSizing).toBe('border-box');

      document.body.removeChild(div);
    });
  });
});
