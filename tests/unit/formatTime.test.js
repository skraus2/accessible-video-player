/**
 * IMP-11U-A: Unit Tests für formatTime-Funktion
 * Testet M:SS und H:MM:SS Format, Edge Cases, führende Nullen
 */
describe('formatTime (IMP-11U-A)', () => {
  let formatTime;

  beforeAll(async () => {
    const module = await import('../../src/js/utils/formatTime.js');
    formatTime = module.formatTime;
  });

  describe('Edge Cases', () => {
    test('formatiert 0 Sekunden', () => {
      expect(formatTime(0)).toBe('0:00');
    });

    test('formatiert Sekunden unter 60', () => {
      expect(formatTime(45)).toBe('0:45');
      expect(formatTime(5)).toBe('0:05');
    });

    test('formatiert Minuten korrekt', () => {
      expect(formatTime(125)).toBe('2:05');
      expect(formatTime(600)).toBe('10:00');
    });

    test('formatiert Stunden korrekt', () => {
      expect(formatTime(3661)).toBe('1:01:01');
    });
  });

  describe('Führende Nullen', () => {
    test('Sekunden mit führender Null', () => {
      expect(formatTime(5)).toBe('0:05');
      expect(formatTime(9)).toBe('0:09');
    });

    test('Minuten mit führender Null bei Stunden-Format', () => {
      expect(formatTime(3661)).toBe('1:01:01');
      expect(formatTime(3605)).toBe('1:00:05');
    });
  });

  describe('Weitere Werte', () => {
    test('formatiert 2:34 (154 Sekunden)', () => {
      expect(formatTime(154)).toBe('2:34');
    });

    test('formatiert 10:15 (615 Sekunden)', () => {
      expect(formatTime(615)).toBe('10:15');
    });

    test('formatiert 59:59 (unter 1 Stunde)', () => {
      expect(formatTime(59 * 60 + 59)).toBe('59:59');
    });

    test('formatiert 1:00:00', () => {
      expect(formatTime(3600)).toBe('1:00:00');
    });

    test('rundet Dezimalzahlen ab', () => {
      expect(formatTime(65.9)).toBe('1:05');
      expect(formatTime(125.4)).toBe('2:05');
    });
  });
});

describe('formatTimeForAriaWithDuration (IMP-30)', () => {
  let formatTimeForAriaWithDuration;

  beforeAll(async () => {
    const module = await import('../../src/js/utils/formatTime.js');
    formatTimeForAriaWithDuration = module.formatTimeForAriaWithDuration;
  });

  test('formatiert Position und Dauer im WCAG-Format', () => {
    expect(formatTimeForAriaWithDuration(154, 615)).toBe(
      '2 Minuten 34 Sekunden von 10 Minuten 15 Sekunden'
    );
  });

  test('formatiert 0 Sekunden korrekt', () => {
    expect(formatTimeForAriaWithDuration(0, 615)).toBe(
      '0 Sekunden von 10 Minuten 15 Sekunden'
    );
  });

  test('formatiert nur Sekunden (unter 1 Minute)', () => {
    expect(formatTimeForAriaWithDuration(5, 120)).toBe(
      '5 Sekunden von 2 Minuten 0 Sekunden'
    );
  });

  test('formatiert mit Stunde in Dauer', () => {
    expect(formatTimeForAriaWithDuration(90, 3661)).toBe(
      '1 Minute 30 Sekunden von 1 Stunde 1 Minute 1 Sekunde'
    );
  });
});
