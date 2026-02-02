/**
 * IMP-30U-A: Unit Tests für updateTimelineAria (WCAG 4.1.2)
 * Testet aria-valuenow und aria-valuetext isoliert
 */
describe('updateTimelineAria (IMP-30U-A)', () => {
  let updateTimelineAria;

  beforeAll(async () => {
    const module = await import('../../src/js/utils/updateTimelineAria.js');
    updateTimelineAria = module.updateTimelineAria;
  });

  function createSlider() {
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '100';
    slider.value = '0';
    return slider;
  }

  test('setzt aria-valuenow und aria-valuetext korrekt (154s / 615s)', () => {
    const slider = createSlider();

    updateTimelineAria(slider, 154, 615);

    expect(slider.getAttribute('aria-valuenow')).toBe('154');
    expect(slider.getAttribute('aria-valuetext')).toBe(
      '2 Minuten 34 Sekunden von 10 Minuten 15 Sekunden'
    );
  });

  test('Edge Case: 0 Sekunden', () => {
    const slider = createSlider();

    updateTimelineAria(slider, 0, 615);

    expect(slider.getAttribute('aria-valuenow')).toBe('0');
    expect(slider.getAttribute('aria-valuetext')).toBe(
      '0 Sekunden von 10 Minuten 15 Sekunden'
    );
  });

  test('Edge Case: Videoende (currentTime = duration)', () => {
    const slider = createSlider();

    updateTimelineAria(slider, 615, 615);

    expect(slider.getAttribute('aria-valuenow')).toBe('615');
    expect(slider.getAttribute('aria-valuetext')).toBe(
      '10 Minuten 15 Sekunden von 10 Minuten 15 Sekunden'
    );
  });

  test('Edge Case: Stunden-Format in Dauer', () => {
    const slider = createSlider();

    updateTimelineAria(slider, 90, 3661);

    expect(slider.getAttribute('aria-valuenow')).toBe('90');
    expect(slider.getAttribute('aria-valuetext')).toBe(
      '1 Minute 30 Sekunden von 1 Stunde 1 Minute 1 Sekunde'
    );
  });

  test('rundet Dezimalzahlen ab', () => {
    const slider = createSlider();

    updateTimelineAria(slider, 154.7, 615.3);

    expect(slider.getAttribute('aria-valuenow')).toBe('154');
    expect(slider.getAttribute('aria-valuetext')).toBe(
      '2 Minuten 34 Sekunden von 10 Minuten 15 Sekunden'
    );
  });

  test('duration 0/NaN wird als 0 behandelt', () => {
    const slider = createSlider();

    updateTimelineAria(slider, 10, 0);

    expect(slider.getAttribute('aria-valuenow')).toBe('10');
    expect(slider.getAttribute('aria-valuetext')).toBe(
      '10 Sekunden von 0 Sekunden'
    );
  });
});
