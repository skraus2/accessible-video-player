/**
 * IMP-10U-A: Unit Tests für togglePlayPause-Funktion
 * Testet isoliert: Paused → Playing, Playing → Paused, aria-label, Icon-Wechsel
 */
import { jest } from '@jest/globals';

describe('togglePlayPause (IMP-10U-A)', () => {
  let togglePlayPause;

  beforeAll(async () => {
    // Dynamischer Import für ES-Modul
    const module = await import('../../src/js/utils/togglePlayPause.js');
    togglePlayPause = module.togglePlayPause;
  });

  describe('Paused → Playing', () => {
    test('startet pausiertes Video und aktualisiert Button', () => {
      const video = {
        paused: true,
        play: jest.fn(() => Promise.resolve()),
        pause: jest.fn(),
      };

      const button = document.createElement('button');
      button.setAttribute('aria-label', 'Abspielen');
      button.setAttribute('title', 'Abspielen');

      // Icons hinzufügen
      const playIcon = document.createElement('span');
      playIcon.className = 'player-btn__icon player-btn__icon--play';
      button.appendChild(playIcon);

      const pauseIcon = document.createElement('span');
      pauseIcon.className = 'player-btn__icon player-btn__icon--pause';
      pauseIcon.setAttribute('hidden', '');
      button.appendChild(pauseIcon);

      const result = togglePlayPause(video, button);

      // Video.play() wurde aufgerufen
      expect(video.play).toHaveBeenCalledTimes(1);
      expect(video.pause).not.toHaveBeenCalled();

      // aria-label wechselt zu "Pause"
      expect(button.getAttribute('aria-label')).toBe('Pause');
      expect(button.getAttribute('title')).toBe('Pause');

      // Button hat is-playing Klasse
      expect(button.classList.contains('is-playing')).toBe(true);

      // Icons: Play versteckt, Pause sichtbar
      expect(playIcon.hasAttribute('hidden')).toBe(true);
      expect(pauseIcon.hasAttribute('hidden')).toBe(false);

      // Rückgabewert
      expect(result).toEqual({ playing: true });
    });

    test('behandelt play() Promise-Fehler', () => {
      const video = {
        paused: true,
        play: jest.fn(() => Promise.reject(new Error('Autoplay blocked'))),
        pause: jest.fn(),
      };

      const button = document.createElement('button');
      const playIcon = document.createElement('span');
      playIcon.className = 'player-btn__icon--play';
      button.appendChild(playIcon);

      const pauseIcon = document.createElement('span');
      pauseIcon.className = 'player-btn__icon--pause';
      pauseIcon.setAttribute('hidden', '');
      button.appendChild(pauseIcon);

      // Sollte nicht werfen
      expect(() => {
        togglePlayPause(video, button);
      }).not.toThrow();

      expect(video.play).toHaveBeenCalled();
      expect(button.getAttribute('aria-label')).toBe('Pause');
    });
  });

  describe('Playing → Paused', () => {
    test('pausiert laufendes Video und aktualisiert Button', () => {
      const video = {
        paused: false,
        play: jest.fn(),
        pause: jest.fn(),
      };

      const button = document.createElement('button');
      button.classList.add('is-playing');
      button.setAttribute('aria-label', 'Pause');
      button.setAttribute('title', 'Pause');

      // Icons hinzufügen
      const playIcon = document.createElement('span');
      playIcon.className = 'player-btn__icon player-btn__icon--play';
      playIcon.setAttribute('hidden', '');
      button.appendChild(playIcon);

      const pauseIcon = document.createElement('span');
      pauseIcon.className = 'player-btn__icon player-btn__icon--pause';
      button.appendChild(pauseIcon);

      const result = togglePlayPause(video, button);

      // Video.pause() wurde aufgerufen
      expect(video.pause).toHaveBeenCalledTimes(1);
      expect(video.play).not.toHaveBeenCalled();

      // aria-label wechselt zu "Abspielen"
      expect(button.getAttribute('aria-label')).toBe('Abspielen');
      expect(button.getAttribute('title')).toBe('Abspielen');

      // Button hat keine is-playing Klasse mehr
      expect(button.classList.contains('is-playing')).toBe(false);

      // Icons: Play sichtbar, Pause versteckt
      expect(playIcon.hasAttribute('hidden')).toBe(false);
      expect(pauseIcon.hasAttribute('hidden')).toBe(true);

      // Rückgabewert
      expect(result).toEqual({ playing: false });
    });
  });

  describe('Edge Cases', () => {
    test('gibt null zurück bei fehlendem video', () => {
      const button = document.createElement('button');
      const result = togglePlayPause(null, button);
      expect(result).toEqual({ playing: null });
    });

    test('gibt null zurück bei fehlendem button', () => {
      const video = { paused: true, play: jest.fn(), pause: jest.fn() };
      const result = togglePlayPause(video, null);
      expect(result).toEqual({ playing: null });
    });

    test('verwendet button.classList wenn video.paused fehlt', () => {
      const video = {
        // paused fehlt
        play: jest.fn(() => Promise.resolve()),
        pause: jest.fn(),
      };

      const button = document.createElement('button');
      // Keine is-playing Klasse → sollte als paused behandelt werden
      const playIcon = document.createElement('span');
      playIcon.className = 'player-btn__icon--play';
      button.appendChild(playIcon);

      const pauseIcon = document.createElement('span');
      pauseIcon.className = 'player-btn__icon--pause';
      pauseIcon.setAttribute('hidden', '');
      button.appendChild(pauseIcon);

      togglePlayPause(video, button);

      // Sollte play() aufrufen, da button keine is-playing Klasse hat
      expect(video.play).toHaveBeenCalled();
      expect(button.classList.contains('is-playing')).toBe(true);
    });

    test('funktioniert ohne Icons (graceful degradation)', () => {
      const video = {
        paused: true,
        play: jest.fn(() => Promise.resolve()),
        pause: jest.fn(),
      };

      const button = document.createElement('button');
      // Keine Icons vorhanden

      const result = togglePlayPause(video, button);

      expect(video.play).toHaveBeenCalled();
      expect(button.getAttribute('aria-label')).toBe('Pause');
      expect(result).toEqual({ playing: true });
    });
  });
});
