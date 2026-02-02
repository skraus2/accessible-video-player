/**
 * Toggle-Funktion für Untertitel (Captions).
 * Schaltet video.textTracks (kind="captions") zwischen "showing" und "hidden".
 *
 * @param {HTMLVideoElement} video
 * @param {HTMLButtonElement} button
 * @returns {{ enabled: boolean }} enabled=true wenn Untertitel an
 */
export function toggleCaptions(video, button) {
  if (!video || !button) return { enabled: false };

  const track = Array.from(video.textTracks || []).find(
    t => t.kind === 'captions'
  );

  if (!track) return { enabled: false };

  const isShowing = track.mode === 'showing';
  const nextMode = isShowing ? 'hidden' : 'showing';

  track.mode = nextMode;
  const enabled = nextMode === 'showing';

  button.setAttribute('aria-pressed', String(enabled));

  return { enabled };
}

/**
 * Synchronisiert Button-State mit aktuellem Track-Modus.
 * @param {HTMLVideoElement} video
 * @param {HTMLButtonElement} button
 */
export function syncCaptionsButtonState(video, button) {
  if (!video || !button) return;

  const track = Array.from(video.textTracks || []).find(
    t => t.kind === 'captions'
  );

  if (!track) return;

  const enabled = track.mode === 'showing';
  button.setAttribute('aria-pressed', String(enabled));
}
