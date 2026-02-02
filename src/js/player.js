/**
 * Einstiegspunkt für den barrierefreien Video-Player (ES-Modul).
 */
import { formatTime, formatTimeForAria } from './utils/formatTime.js';
import { togglePlayPause } from './utils/togglePlayPause.js';

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

/**
 * IMP-11: Timeline-Slider Funktionalität (Maus/Touch)
 * - loadedmetadata: max = video.duration
 * - timeupdate: value = currentTime, Zeitanzeige + aria
 * - input: video.currentTime = slider.value
 */
function initTimelineControls() {
  const video = /** @type {HTMLVideoElement | null} */ (
    document.getElementById('player-video')
  );
  const slider = /** @type {HTMLInputElement | null} */ (
    document.getElementById('player-timeline-input')
  );
  const timeCurrent = document.getElementById('player-time-current');
  const timeDuration = document.getElementById('player-time-duration');

  if (!video || !slider || !timeCurrent || !timeDuration) return;

  function updateTimeDisplay() {
    const current = Math.floor(video.currentTime);
    const duration = Math.floor(video.duration) || 0;

    timeCurrent.textContent = formatTime(current);
    timeDuration.textContent = formatTime(duration);

    slider.setAttribute('aria-valuenow', String(current));
    slider.setAttribute('aria-valuetext', formatTimeForAria(current));
  }

  function onMetadataLoaded() {
    const duration = Math.floor(video.duration);
    const max = Number.isFinite(duration) && duration > 0 ? duration : 100;
    slider.max = String(max);
    slider.value = String(Math.floor(video.currentTime));
    updateTimeDisplay();
  }

  video.addEventListener('loadedmetadata', onMetadataLoaded);

  // Falls Metadaten bereits geladen (z. B. Cache)
  if (video.readyState >= 1) {
    onMetadataLoaded();
  }

  video.addEventListener('timeupdate', () => {
    const current = Math.floor(video.currentTime);
    slider.value = String(current);
    updateTimeDisplay();
  });

  slider.addEventListener('input', () => {
    const value = Number(slider.value);
    if (Number.isFinite(value) && value >= 0) {
      video.currentTime = value;
    }
  });
}

// Init
initPlayPauseControls();
initTimelineControls();
