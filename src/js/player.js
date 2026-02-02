/**
 * Einstiegspunkt für den barrierefreien Video-Player (ES-Modul).
 */
import { formatTime, formatTimeForAria } from './utils/formatTime.js';
import { togglePlayPause } from './utils/togglePlayPause.js';
import {
  toggleCaptions,
  syncCaptionsButtonState,
} from './utils/toggleCaptions.js';

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
 * IMP-12 + IMP-13: Lautstärke-Button/Slider
 * - Button: Toggle Sichtbarkeit, aria-expanded
 * - Slider: video.volume = value/100, Sync, Initial 70%
 * - Optional: Mute-Icon bei volume = 0
 */
function initVolumeControls() {
  const video = /** @type {HTMLVideoElement | null} */ (
    document.getElementById('player-video')
  );
  const button = /** @type {HTMLButtonElement | null} */ (
    document.querySelector('.player-btn--volume')
  );
  const sliderContainer = document.getElementById('volume-slider');
  const slider = /** @type {HTMLInputElement | null} */ (
    document.getElementById('player-volume-input')
  );

  if (!video || !button || !sliderContainer || !slider) return;

  const volumeIcon = button.querySelector('.player-btn__icon--volume');
  const muteIcon = button.querySelector('.player-btn__icon--mute');

  const INITIAL_VOLUME = 0.7;

  function syncVolumeToUI() {
    const vol = video ? video.volume : INITIAL_VOLUME;
    const pct = Math.round(vol * 100);
    slider.value = String(pct);

    if (volumeIcon && muteIcon) {
      if (vol === 0) {
        volumeIcon.setAttribute('hidden', '');
        muteIcon.removeAttribute('hidden');
      } else {
        volumeIcon.removeAttribute('hidden');
        muteIcon.setAttribute('hidden', '');
      }
    }
  }

  function setVolume(value) {
    const pct = Math.max(0, Math.min(100, Number(value)));
    const vol = pct / 100;
    video.volume = vol;
    syncVolumeToUI();
  }

  // Initial: 70%
  if (video) {
    video.volume = INITIAL_VOLUME;
  }
  slider.value = String(Math.round(INITIAL_VOLUME * 100));
  syncVolumeToUI();

  if (video) {
    video.addEventListener('volumechange', syncVolumeToUI);
  }

  slider.addEventListener('input', () => {
    setVolume(slider.value);
  });

  function isExpanded() {
    return button.getAttribute('aria-expanded') === 'true';
  }

  function setExpanded(expanded) {
    button.setAttribute('aria-expanded', String(expanded));
    if (expanded) {
      sliderContainer.removeAttribute('hidden');
    } else {
      sliderContainer.setAttribute('hidden', '');
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

  document.addEventListener('click', e => {
    const volume = button.closest('.player-volume');
    if (volume && !volume.contains(/** @type {Node} */ (e.target))) {
      closeSlider();
    }
  });
}

/**
 * IMP-14: Untertitel-Button Funktionalität
 * - Click: Toggle textTracks (captions) showing/hidden
 * - aria-pressed, visuell hervorgehoben
 */
function initCaptionsControls() {
  const video = /** @type {HTMLVideoElement | null} */ (
    document.getElementById('player-video')
  );
  const button = document.querySelector('.player-btn--captions');

  if (!video || !button) return;

  video.addEventListener('loadedmetadata', () => {
    syncCaptionsButtonState(video, /** @type {HTMLButtonElement} */ (button));
  });

  if (video.readyState >= 1) {
    syncCaptionsButtonState(video, /** @type {HTMLButtonElement} */ (button));
  }

  button.addEventListener('click', () => {
    toggleCaptions(video, /** @type {HTMLButtonElement} */ (button));
  });
}

// Init
initPlayPauseControls();
initTimelineControls();
initVolumeControls();
initCaptionsControls();
