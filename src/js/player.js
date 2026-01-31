/**
 * Einstiegspunkt für den barrierefreien Video-Player (ES-Modul).
 */
import { formatTime } from './utils/formatTime.js';

// Platzhalter: Player-Logik wird in späteren Tickets ergänzt.
// formatTime ist bereits importierbar für spätere Nutzung (z. B. Anzeige currentTime).
if (typeof formatTime !== 'function') {
  throw new Error('formatTime sollte eine Funktion sein');
}
