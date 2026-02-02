/**
 * IMP-36U-A: Unit Tests für announceStatus (WCAG 4.1.3)
 * Testet Live-Region-Befüllung und Timing isoliert
 */
import { jest } from '@jest/globals';

describe('announceStatus (IMP-36U-A)', () => {
  let announceStatus;

  beforeAll(async () => {
    const module = await import('../../src/js/utils/announceStatus.js');
    announceStatus = module.announceStatus;
  });

  beforeEach(() => {
    document.body.innerHTML = '';
    const liveRegion = document.createElement('div');
    liveRegion.id = 'player-status';
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    document.body.appendChild(liveRegion);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('befüllt Live-Region mit Nachricht', () => {
    announceStatus('Video wird abgespielt');

    const liveRegion = document.getElementById('player-status');
    expect(liveRegion).toHaveTextContent('Video wird abgespielt');
  });

  test('leert Live-Region nach 1000ms', () => {
    jest.useFakeTimers();

    const liveRegion = document.getElementById('player-status');
    announceStatus('Video wird abgespielt');

    expect(liveRegion.textContent).toBe('Video wird abgespielt');

    jest.advanceTimersByTime(1000);

    expect(liveRegion.textContent).toBe('');
  });

  test('announceStatus mit beliebigem Text', () => {
    jest.useFakeTimers();

    const liveRegion = document.getElementById('player-status');
    announceStatus('Untertitel aktiviert');

    expect(liveRegion.textContent).toBe('Untertitel aktiviert');

    jest.advanceTimersByTime(1000);

    expect(liveRegion.textContent).toBe('');
  });

  test('spätere announceStatus überschreibt vorherige und startet neuen Timer', () => {
    jest.useFakeTimers();

    const liveRegion = document.getElementById('player-status');
    announceStatus('Erste Meldung');
    expect(liveRegion.textContent).toBe('Erste Meldung');

    jest.advanceTimersByTime(500);
    announceStatus('Zweite Meldung');
    expect(liveRegion.textContent).toBe('Zweite Meldung');

    jest.advanceTimersByTime(500);
    expect(liveRegion.textContent).toBe('Zweite Meldung');

    jest.advanceTimersByTime(500);
    expect(liveRegion.textContent).toBe('');
  });

  test('clearAfterMs=0 leert nicht automatisch', () => {
    const liveRegion = document.getElementById('player-status');
    announceStatus('Test', { clearAfterMs: 0 });

    expect(liveRegion.textContent).toBe('Test');

    jest.useFakeTimers();
    jest.advanceTimersByTime(5000);
    expect(liveRegion.textContent).toBe('Test');
  });

  test('statusId-Option: nutzt alternative Live-Region', () => {
    const customRegion = document.createElement('div');
    customRegion.id = 'custom-status';
    document.body.appendChild(customRegion);

    announceStatus('Custom', { statusId: 'custom-status' });

    expect(document.getElementById('custom-status')).toHaveTextContent(
      'Custom'
    );
    expect(document.getElementById('player-status')).toHaveTextContent('');
  });

  test('fehlendes Element: wirft nicht, bricht ab', () => {
    document.body.innerHTML = '';

    expect(() => announceStatus('Test')).not.toThrow();
  });
});
