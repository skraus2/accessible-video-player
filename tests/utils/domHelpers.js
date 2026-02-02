/**
 * DOM-Helper-Funktionen für Unit-Tests
 */

/**
 * Prüft, ob ein Element eine bestimmte CSS-Klasse hat.
 * @param {Element} element - Das zu prüfende DOM-Element
 * @param {string} className - Der Klassenname (ohne Punkt)
 * @returns {boolean} true wenn die Klasse vorhanden ist
 */
function hasClass(element, className) {
  if (!element || typeof element.className !== 'string') {
    return false;
  }
  return element.className.split(/\s+/).includes(className);
}

module.exports = { hasClass };
