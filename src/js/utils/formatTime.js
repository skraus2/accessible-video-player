/**
 * Formatiert Sekunden als MM:SS (z. B. für Anzeige der Abspielzeit).
 * @param {number} seconds - Sekunden
 * @returns {string} Formatierte Zeit
 */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
