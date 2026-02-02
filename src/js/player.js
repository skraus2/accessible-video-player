/**
 * Einstiegspunkt für den barrierefreien Video-Player (ES-Modul).
 */
import { formatTime, formatTimeForAria } from './utils/formatTime.js';
import { togglePlayPause } from './utils/togglePlayPause.js';
import {
  toggleCaptions,
  syncCaptionsButtonState,
} from './utils/toggleCaptions.js';
import { announceStatus } from './utils/announceStatus.js';
import {
  toggleDescriptions,
  syncDescriptionsButtonState,
} from './utils/toggleDescriptions.js';
import { toggleFullscreen, isFullscreen } from './utils/toggleFullscreen.js';

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
    const result = togglePlayPause(video, button);
    if (result.playing === true) {
      announceStatus('Video wird abgespielt');
    } else if (result.playing === false) {
      announceStatus('Video pausiert');
    }
  });

  // Optional: Click auf Video → Toggle (Maus/Touch)
  video.addEventListener('click', () => {
    const result = togglePlayPause(video, button);
    if (result.playing === true) {
      announceStatus('Video wird abgespielt');
    } else if (result.playing === false) {
      announceStatus('Video pausiert');
    }
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

  const STEP_SECONDS = 5;

  function onMetadataLoaded() {
    const duration = Math.floor(video.duration);
    const max = Number.isFinite(duration) && duration > 0 ? duration : 100;
    slider.max = String(max);
    slider.step = String(STEP_SECONDS);
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

  // IMP-23: Pfeiltasten, Home, End (WCAG 2.1.1) – explizit für Zuverlässigkeit/Testbarkeit
  slider.addEventListener('keydown', e => {
    const max = Number(slider.max) || 100;
    let value = Number(slider.value) || 0;
    const step = Number(slider.step) || STEP_SECONDS;

    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      value = Math.min(value + step, max);
      slider.value = String(value);
      video.currentTime = value;
      updateTimeDisplay();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      value = Math.max(value - step, 0);
      slider.value = String(value);
      video.currentTime = value;
      updateTimeDisplay();
    } else if (e.key === 'Home') {
      e.preventDefault();
      slider.value = '0';
      video.currentTime = 0;
      updateTimeDisplay();
    } else if (e.key === 'End') {
      e.preventDefault();
      slider.value = String(max);
      video.currentTime = max;
      updateTimeDisplay();
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

  // IMP-24: Pfeiltasten (WCAG 2.1.1) – explizit für Zuverlässigkeit/Testbarkeit
  const VOLUME_STEP = 5;
  slider.addEventListener('keydown', e => {
    const max = 100;
    let value = Number(slider.value) || 0;

    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      e.preventDefault();
      value = Math.min(value + VOLUME_STEP, max);
      slider.value = String(value);
      setVolume(value);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      e.preventDefault();
      value = Math.max(value - VOLUME_STEP, 0);
      slider.value = String(value);
      setVolume(value);
    }
  });

  function isExpanded() {
    return button.getAttribute('aria-expanded') === 'true';
  }

  function setExpanded(expanded) {
    button.setAttribute('aria-expanded', String(expanded));
    if (expanded) {
      sliderContainer.removeAttribute('hidden');
      slider.removeAttribute('tabindex'); // IMP-21: In Tab-Sequenz wenn sichtbar
    } else {
      sliderContainer.setAttribute('hidden', '');
      slider.setAttribute('tabindex', '-1'); // IMP-21: Nicht in Tab-Sequenz wenn versteckt
    }
  }

  // IMP-21: Initial: Lautstärke-Slider versteckt → tabindex="-1"
  slider.setAttribute('tabindex', '-1');

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
    const result = toggleCaptions(
      video,
      /** @type {HTMLButtonElement} */ (button)
    );
    if (result.enabled) {
      announceStatus('Untertitel aktiviert');
    } else {
      announceStatus('Untertitel deaktiviert');
    }
  });
}

/**
 * IMP-15: Audiodeskription-Button Funktionalität
 * - Click: Toggle textTracks (descriptions) showing/hidden
 * - aria-pressed, visuell hervorgehoben (analog CC)
 */
function initDescriptionsControls() {
  const video = /** @type {HTMLVideoElement | null} */ (
    document.getElementById('player-video')
  );
  const button = document.querySelector('.player-btn--descriptions');

  if (!video || !button) return;

  video.addEventListener('loadedmetadata', () => {
    syncDescriptionsButtonState(
      video,
      /** @type {HTMLButtonElement} */ (button)
    );
  });

  if (video.readyState >= 1) {
    syncDescriptionsButtonState(
      video,
      /** @type {HTMLButtonElement} */ (button)
    );
  }

  button.addEventListener('click', () => {
    toggleDescriptions(video, /** @type {HTMLButtonElement} */ (button));
  });
}

/**
 * IMP-20: Vollbild-Button Funktionalität
 * - Click: Toggle Fullscreen (Player-Container)
 * - aria-pressed, aria-label, Icon-Wechsel
 * - fullscreenchange: Sync bei ESC
 */
function initFullscreenControls() {
  const playerContainer = document.querySelector('.player-container');
  const button = document.querySelector('.player-btn--fullscreen');
  const fullscreenIcon = button?.querySelector('.player-btn__icon--fullscreen');
  const exitIcon = button?.querySelector('.player-btn__icon--exit-fullscreen');

  if (!playerContainer || !button) return;

  function updateUI(fullscreen) {
    button.setAttribute('aria-pressed', String(fullscreen));
    button.setAttribute(
      'aria-label',
      fullscreen ? 'Vollbild beenden' : 'Vollbild aktivieren'
    );
    button.setAttribute(
      'title',
      fullscreen ? 'Vollbild beenden' : 'Vollbild aktivieren'
    );

    if (fullscreenIcon && exitIcon) {
      if (fullscreen) {
        fullscreenIcon.setAttribute('hidden', '');
        exitIcon.removeAttribute('hidden');
      } else {
        fullscreenIcon.removeAttribute('hidden');
        exitIcon.setAttribute('hidden', '');
      }
    }
  }

  function onFullscreenChange() {
    updateUI(isFullscreen());
  }

  document.addEventListener('fullscreenchange', onFullscreenChange);
  document.addEventListener('webkitfullscreenchange', onFullscreenChange);
  document.addEventListener('mozfullscreenchange', onFullscreenChange);
  document.addEventListener('MSFullscreenChange', onFullscreenChange);

  button.addEventListener('click', async () => {
    await toggleFullscreen(/** @type {HTMLElement} */ (playerContainer));
    updateUI(isFullscreen());
  });
}

/**
 * IMP-16 + IMP-17 + IMP-25: Settings-Panel öffnen/schließen + Fokus-Management
 * - Click Settings: Panel anzeigen, aria-expanded, Fokus auf erstes Element
 * - Close-Button, Backdrop-Click, ESC: Panel schließen, Fokus zurück
 */
function initSettingsControls() {
  const settingsButton = document.querySelector('.player-btn--settings');
  const panel = document.getElementById('player-settings-panel');
  const closeButton = panel?.querySelector('.player-btn--close');
  const backdrop = panel?.querySelector('.player-settings__backdrop');
  const speedSelect = /** @type {HTMLSelectElement | null} */ (
    document.getElementById('player-settings-speed')
  );

  if (!settingsButton || !panel) return;

  const panelFocusables = [
    closeButton,
    speedSelect,
    document.getElementById('player-settings-quality'),
  ].filter(Boolean);

  function setPanelInTabOrder(inTabOrder) {
    panelFocusables.forEach(el => {
      if (inTabOrder) {
        el.removeAttribute('tabindex');
      } else {
        el.setAttribute('tabindex', '-1');
      }
    });
  }

  function openPanel() {
    panel.removeAttribute('hidden');
    settingsButton.setAttribute('aria-expanded', 'true');
    setPanelInTabOrder(true); // IMP-21: Panel-Elemente in Tab-Sequenz
    // IMP-25: Fokus auf erstes fokussierbares Element (WCAG 2.4.3)
    const firstFocusable = speedSelect || closeButton;
    if (firstFocusable) {
      requestAnimationFrame(() => firstFocusable.focus());
    }
  }

  function closePanel() {
    panel.setAttribute('hidden', '');
    settingsButton.setAttribute('aria-expanded', 'false');
    setPanelInTabOrder(false); // IMP-21: Panel-Elemente nicht in Tab-Sequenz
    // IMP-25: Fokus zurück auf Settings-Button (WCAG 2.4.3)
    settingsButton.focus();
  }

  // IMP-21: Initial: Settings-Panel versteckt → tabindex="-1" auf allen Fokussierbaren
  setPanelInTabOrder(false);

  function isPanelOpen() {
    return !panel.hasAttribute('hidden');
  }

  settingsButton.addEventListener('click', () => {
    openPanel();
  });

  if (closeButton) {
    closeButton.addEventListener('click', () => {
      closePanel();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => {
      closePanel();
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isPanelOpen()) {
      closePanel();
    }
  });

  // IMP-18: Wiedergabegeschwindigkeit ändern
  const video = /** @type {HTMLVideoElement | null} */ (
    document.getElementById('player-video')
  );

  if (video && speedSelect) {
    const STORAGE_KEY = 'player-playback-rate';

    function applySpeed(value) {
      const rate = parseFloat(value);
      if (Number.isFinite(rate) && rate > 0) {
        video.playbackRate = rate;
        speedSelect.value = String(rate);
        try {
          localStorage.setItem(STORAGE_KEY, String(rate));
        } catch {
          // localStorage nicht verfügbar
        }
      }
    }

    speedSelect.addEventListener('change', () => {
      applySpeed(speedSelect.value);
    });

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const rate = parseFloat(saved);
        if (Number.isFinite(rate) && rate > 0) {
          video.playbackRate = rate;
          const option = speedSelect.querySelector(`option[value="${saved}"]`);
          if (option) speedSelect.value = saved;
        }
      }
    } catch {
      // localStorage nicht verfügbar
    }
  }

  // IMP-19: Videoqualität ändern (Mock – echte Umsetzung erfordert HLS/DASH)
  const qualitySelect = /** @type {HTMLSelectElement | null} */ (
    document.getElementById('player-settings-quality')
  );
  const statusEl = document.getElementById('player-status');

  if (qualitySelect) {
    qualitySelect.addEventListener('change', () => {
      const value = qualitySelect.value;
      const label =
        qualitySelect.options[qualitySelect.selectedIndex]?.textContent ??
        value;

      console.log('[Player] Videoqualität gewechselt:', value, `(${label})`);

      if (statusEl) {
        statusEl.textContent = `Qualitätswechsel würde hier erfolgen (${label})`;
      }
    });
  }
}

// Init
initPlayPauseControls();
initTimelineControls();
initVolumeControls();
initCaptionsControls();
initDescriptionsControls();
initFullscreenControls();
initSettingsControls();
