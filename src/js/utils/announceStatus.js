/**
 * IMP-36: Live-Region Status-Ankündigungen (WCAG 4.1.3)
 * Schreibt Nachricht in #player-status (role="status", aria-live="polite").
 * Screenreader lesen die Meldung vor, ohne Fokus zu wechseln.
 *
 * @param {string} message - Anzuzeigende Statusmeldung
 * @param {Object} [options]
 * @param {number} [options.clearAfterMs=1000] - Nach wie vielen ms geleert wird
 * @param {string} [options.statusId='player-status'] - ID der Live-Region
 */
let clearTimeoutId = null;

export function announceStatus(message, options = {}) {
  const { clearAfterMs = 1000, statusId = 'player-status' } = options;
  const el = document.getElementById(statusId);
  if (!el) return;

  if (clearTimeoutId) {
    clearTimeout(clearTimeoutId);
    clearTimeoutId = null;
  }

  el.textContent = message;

  if (clearAfterMs > 0) {
    clearTimeoutId = setTimeout(() => {
      el.textContent = '';
      clearTimeoutId = null;
    }, clearAfterMs);
  }
}
