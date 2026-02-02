/**
 * Formatiert Sekunden als M:SS oder H:MM:SS (je nach Videolänge).
 * @param {number} seconds - Sekunden
 * @returns {string} Formatierte Zeit (z. B. "2:34" oder "1:02:34")
 */
export function formatTime(seconds) {
  const s = Math.floor(seconds % 60);
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor(seconds / 3600);

  const pad = n => String(n).padStart(2, '0');

  if (h > 0) {
    return `${h}:${pad(m)}:${pad(s)}`;
  }
  return `${m}:${pad(s)}`;
}

/**
 * Formatiert Sekunden für aria-valuetext (Screenreader).
 * @param {number} seconds - Sekunden
 * @returns {string} z. B. "2 Minuten 34 Sekunden" oder "1 Stunde 2 Minuten 34 Sekunden"
 */
export function formatTimeForAria(seconds) {
  const s = Math.floor(seconds % 60);
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor(seconds / 3600);

  const parts = [];
  if (h > 0) parts.push(`${h} Stunde${h !== 1 ? 'n' : ''}`);
  if (m > 0) parts.push(`${m} Minute${m !== 1 ? 'n' : ''}`);
  parts.push(`${s} Sekunde${s !== 1 ? 'n' : ''}`);

  return parts.join(' ');
}

/**
 * IMP-30: Formatiert Timeline-aria-valuetext mit aktueller Position und Dauer.
 * @param {number} current - Aktuelle Position in Sekunden
 * @param {number} duration - Gesamtdauer in Sekunden
 * @returns {string} z. B. "2 Minuten 34 Sekunden von 10 Minuten 15 Sekunden"
 */
export function formatTimeForAriaWithDuration(current, duration) {
  return `${formatTimeForAria(current)} von ${formatTimeForAria(duration)}`;
}
