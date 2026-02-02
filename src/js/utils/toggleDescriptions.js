/**
 * Toggle-Funktion für Audiodeskription (Descriptions).
 * Schaltet video.textTracks (kind="descriptions") zwischen "showing" und "hidden".
 * Hinweis: Echte AD als separate Audio-Spur wäre komplex; textTrack "descriptions"
 * wird von Screenreadern genutzt.
 *
 * @param {HTMLVideoElement} video
 * @param {HTMLButtonElement} button
 * @returns {{ enabled: boolean }} enabled=true wenn AD-Spur an
 */
export function toggleDescriptions(video, button) {
  if (!video || !button) return { enabled: false };

  const track = Array.from(video.textTracks || []).find(
    t => t.kind === 'descriptions'
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
export function syncDescriptionsButtonState(video, button) {
  if (!video || !button) return;

  const track = Array.from(video.textTracks || []).find(
    t => t.kind === 'descriptions'
  );

  if (!track) return;

  const enabled = track.mode === 'showing';
  button.setAttribute('aria-pressed', String(enabled));
}
