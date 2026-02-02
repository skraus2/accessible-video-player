import { formatTimeForAriaWithDuration } from './formatTime.js';

/**
 * IMP-30: Aktualisiert aria-valuenow und aria-valuetext am Timeline-Slider (WCAG 4.1.2).
 * @param {HTMLInputElement} slider - Range-Input (Timeline)
 * @param {number} currentTime - Aktuelle Position in Sekunden
 * @param {number} duration - Gesamtdauer in Sekunden
 */
export function updateTimelineAria(slider, currentTime, duration) {
  const current = Math.floor(currentTime);
  const dur = Math.floor(duration) || 0;
  slider.setAttribute('aria-valuenow', String(current));
  slider.setAttribute(
    'aria-valuetext',
    formatTimeForAriaWithDuration(current, dur)
  );
}
