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

/**
 * IMP-12: Lautstärke-Button öffnet/schließt Lautstärke-Slider
 * - Click: Toggle Sichtbarkeit, aria-expanded
 * - Optional: Klick außerhalb schließt Slider
 */
function initVolumeControls() {
  const button = /** @type {HTMLButtonElement | null} */ (
    document.querySelector('.player-btn--volume')
  );
  const slider = document.getElementById('volume-slider');

  if (!button || !slider) return;

  function isExpanded() {
    return button.getAttribute('aria-expanded') === 'true';
  }

  function setExpanded(expanded) {
    button.setAttribute('aria-expanded', String(expanded));
    if (expanded) {
      slider.removeAttribute('hidden');
    } else {
      slider.setAttribute('hidden', '');
    }
  }

  function closeSlider() {
    if (isExpanded()) {
      setExpanded(false);
    }
  }

  button.addEventListener('click', e => {
    e.stopPropagation();
    setExpanded(!isExpanded());
  });

  // Optional: Klick außerhalb schließt Slider
  document.addEventListener('click', e => {
    const volume = button.closest('.player-volume');
    if (volume && !volume.contains(/** @type {Node} */ (e.target))) {
      closeSlider();
    }
  });
}

// Init
initPlayPauseControls();
initTimelineControls();
initVolumeControls();
