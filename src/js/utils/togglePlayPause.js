/**
 * Toggle-Funktion für Play/Pause (testbar, ohne direkte DOM-Abhängigkeit außer dem Button).
 *
 * Erwartet:
 * - video: HTMLVideoElement (oder kompatibles Objekt mit paused/play/pause)
 * - button: Button-Element mit Icons:
 *   - .player-btn__icon--play
 *   - .player-btn__icon--pause
 *
 * @param {HTMLVideoElement} video
 * @param {HTMLButtonElement} button
 * @returns {{ playing: boolean | null }} playing=true wenn nach dem Aufruf im Playing-State
 */
export function togglePlayPause(video, button) {
  if (!video || !button) return { playing: null };

  const playIcon = button.querySelector('.player-btn__icon--play');
  const pauseIcon = button.querySelector('.player-btn__icon--pause');

  const isPaused =
    typeof video.paused === 'boolean'
      ? video.paused
      : !button.classList.contains('is-playing');

  if (isPaused) {
    // Play
    try {
      const maybePromise = video.play?.();
      if (maybePromise && typeof maybePromise.catch === 'function') {
        maybePromise.catch(() => {});
      }
    } catch {
      // Ignorieren: Browser-Policy/Mock kann play() werfen
    }

    button.classList.add('is-playing');
    button.setAttribute('aria-label', 'Pause');
    button.setAttribute('title', 'Pause');

    if (pauseIcon) pauseIcon.removeAttribute('hidden');
    if (playIcon) playIcon.setAttribute('hidden', '');

    return { playing: true };
  }

  // Pause
  try {
    video.pause?.();
  } catch {
    // Ignorieren: Mock kann pause() werfen
  }

  button.classList.remove('is-playing');
  button.setAttribute('aria-label', 'Abspielen');
  button.setAttribute('title', 'Abspielen');

  if (pauseIcon) pauseIcon.setAttribute('hidden', '');
  if (playIcon) playIcon.removeAttribute('hidden');

  return { playing: false };
}
