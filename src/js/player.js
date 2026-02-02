/**
 * Einstiegspunkt für den barrierefreien Video-Player (ES-Modul).
 */
import { formatTime } from './utils/formatTime.js';
import { togglePlayPause } from './utils/togglePlayPause.js';

// Platzhalter: Player-Logik wird in späteren Tickets ergänzt.
// formatTime ist bereits importierbar für spätere Nutzung (z. B. Anzeige currentTime).
if (typeof formatTime !== 'function') {
  throw new Error('formatTime sollte eine Funktion sein');
}

/**
 * IMP-10: Play/Pause-Button Funktionalität (Maus/Touch)
 * - Click auf Button toggelt video.play()/video.pause()
 * - Icon + aria-label werden aktualisiert
 * - Optional: Click auf Video toggelt ebenfalls
 */
function initPlayPauseControls() {
  const video = /** @type {HTMLVideoElement | null} */ (
    document.getElementById('player-video')
  );
  const button = /** @type {HTMLButtonElement | null} */ (
    document.querySelector('.player-btn--play-pause')
  );

  if (!video || !button) return;

  // Button Click → Toggle
  button.addEventListener('click', () => {
    togglePlayPause(video, button);
  });

  // Optional: Click auf Video → Toggle (Maus/Touch)
  video.addEventListener('click', () => {
    togglePlayPause(video, button);
  });
}

// Init
initPlayPauseControls();
