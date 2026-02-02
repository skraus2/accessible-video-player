/**
 * Vollbild-Toggle mit Browser-Präfixen (webkit, moz, ms).
 * @param {HTMLElement} element - Element für Vollbild (z. B. Player-Container)
 * @returns {Promise<boolean>} true wenn Vollbild aktiviert, false wenn beendet
 */
export async function toggleFullscreen(element) {
  if (!element) return false;

  const isFullscreen = !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );

  try {
    if (isFullscreen) {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
      return false;
    }

    const request =
      element.requestFullscreen ||
      element.webkitRequestFullscreen ||
      element.webkitRequestFullScreen ||
      element.mozRequestFullScreen ||
      element.msRequestFullscreen;

    if (request) {
      await request.call(element);
      return true;
    }
  } catch {
    // User aborted or not supported
  }
  return false;
}

/**
 * Prüft ob Vollbild aktiv ist.
 * @returns {boolean}
 */
export function isFullscreen() {
  return !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
}
