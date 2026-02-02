/**
 * IMP-20I: Integration-Testing-Setup
 * Testing Library + DOM-Tests
 */
import { jest } from '@jest/globals';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { screen, fireEvent, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '../..');

/** Lädt index.html in document.body (ohne Scripts) */
function loadPlayerHTML() {
  const htmlPath = join(projectRoot, 'src/index.html');
  const html = readFileSync(htmlPath, 'utf-8');
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : html;
  document.body.innerHTML = bodyContent;
}

/** Mockt Video mit mutablem paused-State für Play/Pause-Tests */
function setupVideoMock() {
  const video = document.getElementById('player-video');
  if (!video) return;

  let paused = true;
  video.play = jest.fn(() => {
    paused = false;
    return Promise.resolve();
  });
  video.pause = jest.fn(() => {
    paused = true;
  });
  Object.defineProperty(video, 'paused', {
    get: () => paused,
    configurable: true,
  });
}

describe('Player Integration (IMP-20I)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    loadPlayerHTML();
  });

  test('Play-Button ist per aria-label auffindbar', () => {
    const playButton = screen.getByRole('button', { name: 'Abspielen' });
    expect(playButton).toBeInTheDocument();
  });

  test('Player-Container hat role="region"', () => {
    const region = screen.getByRole('region', {
      name: /Video-Player.*Untertiteln und Audiodeskription/i,
    });
    expect(region).toBeInTheDocument();
  });

  test('Timeline-Slider ist vorhanden', () => {
    const slider = screen.getByRole('slider', { name: 'Videoposition' });
    expect(slider).toBeInTheDocument();
  });

  test('Settings-Button öffnet Panel bei Klick (mit Player-Init)', async () => {
    await import('../../src/js/player.js');

    const user = userEvent.setup();
    const settingsButton = screen.getByRole('button', {
      name: 'Einstellungen',
    });
    const panel = document.getElementById('player-settings-panel');

    expect(panel).toHaveAttribute('hidden');

    await user.click(settingsButton);

    expect(panel).not.toHaveAttribute('hidden');
    expect(settingsButton).toHaveAttribute('aria-expanded', 'true');
  });
});

describe('Play/Pause Integration (IMP-20I-A)', () => {
  beforeEach(async () => {
    jest.resetModules();
    document.body.innerHTML = '';
    loadPlayerHTML();
    setupVideoMock();
    await import('../../src/js/player.js');
  });

  test('Play-Button startet Video und aktualisiert aria-label', () => {
    const button = screen.getByRole('button', { name: 'Abspielen' });
    const video = document.getElementById('player-video');

    fireEvent.click(button);

    expect(video.paused).toBe(false);
    expect(button).toHaveAttribute('aria-label', 'Pause');
    expect(button).toHaveClass('is-playing');
  });

  test('Pause-Button pausiert Video und aktualisiert aria-label', () => {
    const button = screen.getByRole('button', { name: 'Abspielen' });
    const video = document.getElementById('player-video');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Pause');

    fireEvent.click(button);

    expect(video.paused).toBe(true);
    expect(button).toHaveAttribute('aria-label', 'Abspielen');
    expect(button).not.toHaveClass('is-playing');
  });

  test('Icon wechselt zwischen Play und Pause', () => {
    const button = screen.getByRole('button', { name: 'Abspielen' });
    const playIcon = button.querySelector('.player-btn__icon--play');
    const pauseIcon = button.querySelector('.player-btn__icon--pause');

    expect(playIcon).not.toHaveAttribute('hidden');
    expect(pauseIcon).toHaveAttribute('hidden');

    fireEvent.click(button);

    expect(playIcon).toHaveAttribute('hidden');
    expect(pauseIcon).not.toHaveAttribute('hidden');

    fireEvent.click(button);

    expect(playIcon).not.toHaveAttribute('hidden');
    expect(pauseIcon).toHaveAttribute('hidden');
  });
});

describe('Untertitel-Toggle Integration (IMP-20I-B)', () => {
  beforeEach(async () => {
    jest.resetModules();
    document.body.innerHTML = '';
    loadPlayerHTML();
    setupCaptionsTrackMock();
    await import('../../src/js/player.js');
  });

  test('Untertitel-Toggle ändert TextTrack und aria-pressed', () => {
    const button = screen.getByRole('button', { name: 'Untertitel' });
    const video = document.getElementById('player-video');
    const captionsTrack = video.textTracks[0];

    expect(captionsTrack.mode).toBe('hidden');

    fireEvent.click(button);

    expect(captionsTrack.mode).toBe('showing');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveClass('player-btn--captions');
  });

  test('Zweiter Click deaktiviert Untertitel', () => {
    const button = screen.getByRole('button', { name: 'Untertitel' });
    const video = document.getElementById('player-video');
    const captionsTrack = video.textTracks[0];

    fireEvent.click(button);
    expect(captionsTrack.mode).toBe('showing');
    expect(button).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(button);

    expect(captionsTrack.mode).toBe('hidden');
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  test('Button-Styling bei aktivierten Untertiteln (aria-pressed)', () => {
    const button = screen.getByRole('button', { name: 'Untertitel' });

    expect(button).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('Timeline-Slider Integration (IMP-20I-C)', () => {
  beforeEach(async () => {
    jest.resetModules();
    document.body.innerHTML = '';
    loadPlayerHTML();
    setupTimelineVideoMock(615);
    await import('../../src/js/player.js');
  });

  test('Timeline-Slider aktualisiert Video-Position und aria-valuetext', () => {
    const slider = screen.getByRole('slider', { name: 'Videoposition' });
    const video = document.getElementById('player-video');

    slider.value = '154';
    fireEvent.input(slider);

    // JSDOM feuert timeupdate nicht automatisch bei currentTime-Änderung
    fireEvent(video, new Event('timeupdate'));

    expect(video.currentTime).toBe(154);
    expect(slider).toHaveAttribute('aria-valuenow', '154');
    expect(slider).toHaveAttribute('aria-valuetext', '2 Minuten 34 Sekunden');
  });

  test('Zeitanzeige zeigt formatierte Zeit (formatTime-Integration)', () => {
    const slider = screen.getByRole('slider', { name: 'Videoposition' });
    const video = document.getElementById('player-video');
    const timeCurrent = document.getElementById('player-time-current');
    const timeDuration = document.getElementById('player-time-duration');

    slider.value = '154';
    fireEvent.input(slider);
    fireEvent(video, new Event('timeupdate'));

    expect(timeCurrent.textContent).toBe('2:34');
    expect(timeDuration.textContent).toBe('10:15');
  });
});

describe('Settings-Panel Integration (IMP-20I-D)', () => {
  beforeEach(async () => {
    jest.resetModules();
    document.body.innerHTML = '';
    loadPlayerHTML();
    await import('../../src/js/player.js');
  });

  test('Settings-Panel öffnet bei Button-Click mit aria-expanded', async () => {
    const user = userEvent.setup();
    const settingsButton = screen.getByRole('button', {
      name: 'Einstellungen',
    });
    const panel = document.getElementById('player-settings-panel');

    expect(panel).toHaveAttribute('hidden');

    await user.click(settingsButton);

    expect(panel).not.toHaveAttribute('hidden');
    expect(settingsButton).toHaveAttribute('aria-expanded', 'true');
  });

  test('Settings-Panel öffnet und Fokus auf erstem Element', async () => {
    const user = userEvent.setup();
    const settingsButton = screen.getByRole('button', {
      name: 'Einstellungen',
    });
    const speedSelect = screen.getByLabelText('Wiedergabegeschwindigkeit');

    await user.click(settingsButton);

    // requestAnimationFrame für Fokus – kurz warten
    await new Promise(resolve => requestAnimationFrame(resolve));

    expect(speedSelect).toHaveFocus();
  });

  test('ESC schließt Panel und setzt Fokus zurück auf Settings-Button', async () => {
    const user = userEvent.setup();
    const settingsButton = screen.getByRole('button', {
      name: 'Einstellungen',
    });
    const panel = document.getElementById('player-settings-panel');

    await user.click(settingsButton);
    expect(panel).not.toHaveAttribute('hidden');

    await user.keyboard('{Escape}');

    expect(panel).toHaveAttribute('hidden');
    expect(settingsButton).toHaveAttribute('aria-expanded', 'false');
    expect(settingsButton).toHaveFocus();
  });

  test('Close-Button schließt Panel und setzt Fokus zurück', async () => {
    const user = userEvent.setup();
    const settingsButton = screen.getByRole('button', {
      name: 'Einstellungen',
    });
    const panel = document.getElementById('player-settings-panel');

    await user.click(settingsButton);
    expect(panel).not.toHaveAttribute('hidden');

    const closeButton = screen.getByRole('button', {
      name: 'Einstellungen schließen',
    });
    await user.click(closeButton);

    expect(panel).toHaveAttribute('hidden');
    expect(settingsButton).toHaveAttribute('aria-expanded', 'false');
    expect(settingsButton).toHaveFocus();
  });
});

describe('Live-Region Status-Updates (IMP-20I-E)', () => {
  beforeEach(async () => {
    jest.resetModules();
    document.body.innerHTML = '';
    loadPlayerHTML();
    setupVideoMock();
    setupCaptionsTrackMock();
    await import('../../src/js/player.js');
  });

  test('Live-Region wird bei Play-Button-Click befüllt', () => {
    const playButton = screen.getByRole('button', { name: 'Abspielen' });
    const liveRegion = document.getElementById('player-status');

    fireEvent.click(playButton);

    expect(liveRegion).toHaveTextContent('Video wird abgespielt');
  });

  test('Live-Region wird nach 1 Sekunde geleert', async () => {
    const playButton = screen.getByRole('button', { name: 'Abspielen' });
    const liveRegion = document.getElementById('player-status');

    fireEvent.click(playButton);
    expect(liveRegion).toHaveTextContent('Video wird abgespielt');

    await waitFor(
      () => {
        expect(liveRegion).toHaveTextContent('');
      },
      { timeout: 1500 }
    );
  });

  test('Live-Region wird bei Untertitel-Toggle befüllt', () => {
    const captionsButton = screen.getByRole('button', { name: 'Untertitel' });
    const liveRegion = document.getElementById('player-status');

    fireEvent.click(captionsButton);

    expect(liveRegion).toHaveTextContent('Untertitel aktiviert');
  });

  test('Live-Region zeigt "Untertitel deaktiviert" bei zweitem Toggle', () => {
    const captionsButton = screen.getByRole('button', { name: 'Untertitel' });
    const liveRegion = document.getElementById('player-status');

    fireEvent.click(captionsButton);
    expect(liveRegion).toHaveTextContent('Untertitel aktiviert');

    fireEvent.click(captionsButton);

    expect(liveRegion).toHaveTextContent('Untertitel deaktiviert');
  });
});

/** Mockt Video für Timeline-Tests (duration, readyState, currentTime) */
function setupTimelineVideoMock(duration = 615) {
  const video = document.getElementById('player-video');
  if (!video) return;

  let currentTime = 0;
  Object.defineProperty(video, 'duration', {
    get: () => duration,
    configurable: true,
  });
  Object.defineProperty(video, 'currentTime', {
    get: () => currentTime,
    set: v => {
      currentTime = Number(v);
    },
    configurable: true,
  });
  Object.defineProperty(video, 'readyState', {
    value: 1, // HAVE_METADATA
    configurable: true,
  });
}

/** Mockt TextTrack für Captions (CC)-Tests (textTracks ist read-only in JSDOM) */
function setupCaptionsTrackMock() {
  const video = document.getElementById('player-video');
  if (!video) return;

  const captionsTrack = { mode: 'hidden', kind: 'captions' };
  const mockTextTracks = [captionsTrack];

  Object.defineProperty(video, 'textTracks', {
    configurable: true,
    enumerable: true,
    get: () => mockTextTracks,
  });
}
