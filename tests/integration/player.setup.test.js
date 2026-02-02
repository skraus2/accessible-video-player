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

describe('Play/Pause via Tastatur (IMP-22)', () => {
  beforeEach(async () => {
    jest.resetModules();
    document.body.innerHTML = '';
    loadPlayerHTML();
    setupVideoMock();
    await import('../../src/js/player.js');
  });

  test('Space-Taste startet Video wenn Play-Button fokussiert', async () => {
    const user = userEvent.setup();
    const button = screen.getByRole('button', { name: 'Abspielen' });
    const video = document.getElementById('player-video');

    button.focus();
    await user.keyboard(' ');

    expect(video.paused).toBe(false);
    expect(button).toHaveAttribute('aria-label', 'Pause');
  });

  test('Enter-Taste startet Video wenn Play-Button fokussiert', async () => {
    const user = userEvent.setup();
    const button = screen.getByRole('button', { name: 'Abspielen' });
    const video = document.getElementById('player-video');

    button.focus();
    await user.keyboard('{Enter}');

    expect(video.paused).toBe(false);
    expect(button).toHaveAttribute('aria-label', 'Pause');
  });

  test('Space-Taste pausiert Video wenn Pause-Button fokussiert', async () => {
    const user = userEvent.setup();
    const button = screen.getByRole('button', { name: 'Abspielen' });
    const video = document.getElementById('player-video');

    button.focus();
    await user.keyboard(' ');
    expect(video.paused).toBe(false);

    await user.keyboard(' ');

    expect(video.paused).toBe(true);
    expect(button).toHaveAttribute('aria-label', 'Abspielen');
  });

  test('Enter-Taste pausiert Video wenn Pause-Button fokussiert', async () => {
    const user = userEvent.setup();
    const button = screen.getByRole('button', { name: 'Abspielen' });
    const video = document.getElementById('player-video');

    button.focus();
    await user.keyboard('{Enter}');
    expect(video.paused).toBe(false);

    await user.keyboard('{Enter}');

    expect(video.paused).toBe(true);
    expect(button).toHaveAttribute('aria-label', 'Abspielen');
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

describe('Timeline-Slider via Tastatur (IMP-23)', () => {
  beforeEach(async () => {
    jest.resetModules();
    document.body.innerHTML = '';
    loadPlayerHTML();
    setupTimelineVideoMock(615);
    await import('../../src/js/player.js');
  });

  test('Pfeil-Rechts (→) springt 5 Sekunden vor', async () => {
    const user = userEvent.setup();
    const slider = screen.getByRole('slider', { name: 'Videoposition' });
    const video = document.getElementById('player-video');

    slider.focus();
    await user.keyboard('{ArrowRight}');

    expect(video.currentTime).toBe(5);
    expect(slider).toHaveAttribute('aria-valuenow', '5');
  });

  test('Pfeil-Links (←) springt 5 Sekunden zurück', async () => {
    const user = userEvent.setup();
    const slider = screen.getByRole('slider', { name: 'Videoposition' });
    const video = document.getElementById('player-video');

    slider.value = '20';
    slider.focus();
    await user.keyboard('{ArrowLeft}');

    expect(video.currentTime).toBe(15);
  });

  test('Home springt zu 0:00', async () => {
    const user = userEvent.setup();
    const slider = screen.getByRole('slider', { name: 'Videoposition' });
    const video = document.getElementById('player-video');

    slider.value = '100';
    fireEvent.input(slider);
    expect(video.currentTime).toBe(100);

    slider.focus();
    await user.keyboard('{Home}');

    expect(video.currentTime).toBe(0);
    expect(slider).toHaveAttribute('aria-valuenow', '0');
  });

  test('End springt zu Videoende', async () => {
    const user = userEvent.setup();
    const slider = screen.getByRole('slider', { name: 'Videoposition' });
    const video = document.getElementById('player-video');

    slider.focus();
    await user.keyboard('{End}');

    expect(video.currentTime).toBe(615);
    expect(slider).toHaveAttribute('aria-valuenow', '615');
  });

  test('Pfeil-Rechts am Ende überschreitet Videoende nicht', async () => {
    const user = userEvent.setup();
    const slider = screen.getByRole('slider', { name: 'Videoposition' });
    const video = document.getElementById('player-video');

    slider.value = '615';
    slider.focus();
    await user.keyboard('{ArrowRight}');

    expect(video.currentTime).toBe(615);
  });
});

describe('Lautstärke-Slider via Tastatur (IMP-24)', () => {
  beforeEach(async () => {
    jest.resetModules();
    document.body.innerHTML = '';
    loadPlayerHTML();
    await import('../../src/js/player.js');
  });

  test('Pfeil-Hoch (↑) erhöht Lautstärke', async () => {
    const user = userEvent.setup();
    const volumeButton = screen.getByRole('button', { name: 'Lautstärke' });
    const video = document.getElementById('player-video');

    await user.click(volumeButton);

    const volumeSlider = document.getElementById('player-volume-input');
    volumeSlider.focus();
    await user.keyboard('{ArrowUp}');

    expect(Number(volumeSlider.value)).toBe(75);
    expect(video.volume).toBeCloseTo(0.75);
  });

  test('Pfeil-Runter (↓) verringert Lautstärke', async () => {
    const user = userEvent.setup();
    const volumeButton = screen.getByRole('button', { name: 'Lautstärke' });
    const video = document.getElementById('player-video');

    await user.click(volumeButton);

    const volumeSlider = document.getElementById('player-volume-input');
    volumeSlider.focus();
    await user.keyboard('{ArrowDown}');

    expect(Number(volumeSlider.value)).toBe(65);
    expect(video.volume).toBeCloseTo(0.65);
  });

  test('Pfeil-Hoch am Maximum überschreitet 100 nicht', async () => {
    const user = userEvent.setup();
    const volumeButton = screen.getByRole('button', { name: 'Lautstärke' });
    const video = document.getElementById('player-video');

    await user.click(volumeButton);

    const volumeSlider = document.getElementById('player-volume-input');
    volumeSlider.value = '100';
    volumeSlider.focus();
    await user.keyboard('{ArrowUp}');

    expect(Number(volumeSlider.value)).toBe(100);
    expect(video.volume).toBe(1);
  });
});

describe('Lautstärke-Slider Fokus-Management (IMP-28)', () => {
  beforeEach(async () => {
    jest.resetModules();
    document.body.innerHTML = '';
    loadPlayerHTML();
    await import('../../src/js/player.js');
  });

  test('Lautstärke-Button öffnet Slider und setzt Fokus auf Slider', async () => {
    const user = userEvent.setup();
    const volumeButton = screen.getByRole('button', { name: 'Lautstärke' });
    const volumeSlider = document.getElementById('player-volume-input');

    await user.click(volumeButton);

    await new Promise(resolve => requestAnimationFrame(resolve));

    expect(volumeSlider).toHaveFocus();
  });

  test('Pfeiltasten funktionieren sofort nach Öffnen', async () => {
    const user = userEvent.setup();
    const volumeButton = screen.getByRole('button', { name: 'Lautstärke' });
    const volumeSlider = document.getElementById('player-volume-input');
    const video = document.getElementById('player-video');

    await user.click(volumeButton);
    await new Promise(resolve => requestAnimationFrame(resolve));

    await user.keyboard('{ArrowUp}');

    expect(Number(volumeSlider.value)).toBe(75);
    expect(video.volume).toBeCloseTo(0.75);
  });

  test('Schließen setzt Fokus zurück auf Button', async () => {
    const user = userEvent.setup();
    const volumeButton = screen.getByRole('button', { name: 'Lautstärke' });
    const volumeSlider = document.getElementById('player-volume-input');

    await user.click(volumeButton);
    await new Promise(resolve => requestAnimationFrame(resolve));
    expect(volumeSlider).toHaveFocus();

    await user.click(volumeButton);

    expect(volumeButton).toHaveFocus();
  });
});

describe('Globale Shortcuts M/F/C (IMP-29)', () => {
  beforeEach(async () => {
    jest.resetModules();
    document.body.innerHTML = '';
    loadPlayerHTML();
    setupVideoMock();
    setupCaptionsTrackMock();
    await import('../../src/js/player.js');
  });

  test('M-Taste bei Player-Fokus: Toggle Mute', async () => {
    const user = userEvent.setup();
    const playButton = screen.getByRole('button', { name: 'Abspielen' });
    const video = document.getElementById('player-video');

    playButton.focus();
    expect(video.volume).toBeGreaterThan(0);

    await user.keyboard('m');

    expect(video.volume).toBe(0);

    await user.keyboard('m');

    expect(video.volume).toBeGreaterThan(0);
  });

  test('C-Taste bei Player-Fokus: Toggle Captions', async () => {
    const user = userEvent.setup();
    const playButton = screen.getByRole('button', { name: 'Abspielen' });
    const video = document.getElementById('player-video');
    const captionsTrack = video.textTracks[0];

    playButton.focus();
    expect(captionsTrack.mode).toBe('hidden');

    await user.keyboard('c');

    expect(captionsTrack.mode).toBe('showing');

    await user.keyboard('c');

    expect(captionsTrack.mode).toBe('hidden');
  });

  test('Fokus außerhalb Player: M/C funktionieren nicht', async () => {
    const user = userEvent.setup();
    const h1 = document.querySelector('h1');
    const video = document.getElementById('player-video');
    const captionsTrack = video.textTracks[0];

    if (h1) {
      h1.setAttribute('tabindex', '0');
      h1.focus();
    }
    const volumeBefore = video.volume;
    const captionsBefore = captionsTrack.mode;

    await user.keyboard('m');
    await user.keyboard('c');

    expect(video.volume).toBe(volumeBefore);
    expect(captionsTrack.mode).toBe(captionsBefore);
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

  test('IMP-25: Tab zu Settings-Button, Enter drücken → Fokus auf Playback-Speed-Select', async () => {
    const user = userEvent.setup();
    const settingsButton = screen.getByRole('button', {
      name: 'Einstellungen',
    });
    const speedSelect = screen.getByLabelText('Wiedergabegeschwindigkeit');

    settingsButton.focus();
    await user.keyboard('{Enter}');

    await new Promise(resolve => requestAnimationFrame(resolve));

    expect(
      document.getElementById('player-settings-panel')
    ).not.toHaveAttribute('hidden');
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

  test('IMP-27: Tab zu Close-Button, Enter → Fokus zurück auf Settings-Button', async () => {
    const user = userEvent.setup();
    const settingsButton = screen.getByRole('button', {
      name: 'Einstellungen',
    });
    const panel = document.getElementById('player-settings-panel');
    const closeButton = panel?.querySelector('.player-btn--close');

    await user.click(settingsButton);
    await new Promise(resolve => requestAnimationFrame(resolve));

    closeButton?.focus();
    await user.keyboard('{Enter}');

    expect(panel).toHaveAttribute('hidden');
    expect(settingsButton).toHaveFocus();
  });
});

describe('Settings-Panel Fokus-Loop (IMP-26)', () => {
  beforeEach(async () => {
    jest.resetModules();
    document.body.innerHTML = '';
    loadPlayerHTML();
    await import('../../src/js/player.js');
  });

  test('Tab vom letzten Element springt zu erstem Element', async () => {
    const user = userEvent.setup();
    const settingsButton = screen.getByRole('button', {
      name: 'Einstellungen',
    });
    const panel = document.getElementById('player-settings-panel');
    const closeButton = panel?.querySelector('.player-btn--close');
    const speedSelect = document.getElementById('player-settings-speed');

    await user.click(settingsButton);
    await new Promise(resolve => requestAnimationFrame(resolve));

    closeButton?.focus();
    expect(document.activeElement).toBe(closeButton);

    await user.tab();

    expect(document.activeElement).toBe(speedSelect);
  });

  test('Shift+Tab vom ersten Element springt zu letztem Element', async () => {
    const user = userEvent.setup();
    const settingsButton = screen.getByRole('button', {
      name: 'Einstellungen',
    });
    const panel = document.getElementById('player-settings-panel');
    const closeButton = panel?.querySelector('.player-btn--close');
    const speedSelect = document.getElementById('player-settings-speed');

    await user.click(settingsButton);
    await new Promise(resolve => requestAnimationFrame(resolve));

    speedSelect?.focus();
    expect(document.activeElement).toBe(speedSelect);

    await user.tab({ shift: true });

    expect(document.activeElement).toBe(closeButton);
  });

  test('ESC schließt Panel und befreit Fokus', async () => {
    const user = userEvent.setup();
    const settingsButton = screen.getByRole('button', {
      name: 'Einstellungen',
    });
    const panel = document.getElementById('player-settings-panel');

    await user.click(settingsButton);
    expect(panel).not.toHaveAttribute('hidden');

    await user.keyboard('{Escape}');

    expect(panel).toHaveAttribute('hidden');
    expect(settingsButton).toHaveFocus();
  });

  test('IMP-29I-B: Fokus zirkuliert im Settings-Panel, ESC schließt', async () => {
    const user = userEvent.setup();
    const settingsButton = screen.getByRole('button', {
      name: 'Einstellungen',
    });
    const panel = document.getElementById('player-settings-panel');
    const speedSelect = screen.getByLabelText('Wiedergabegeschwindigkeit');
    const qualitySelect = screen.getByLabelText('Videoqualität');
    const closeButton = panel?.querySelector('.player-btn--close');

    await user.click(settingsButton);
    await new Promise(resolve => requestAnimationFrame(resolve));

    expect(speedSelect).toHaveFocus();

    await user.tab();
    expect(document.activeElement).toBe(qualitySelect);

    await user.tab();
    expect(document.activeElement).toBe(closeButton);

    await user.tab();
    expect(speedSelect).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(panel).toHaveAttribute('hidden');
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

describe('Tab-Reihenfolge (IMP-21)', () => {
  beforeEach(async () => {
    jest.resetModules();
    document.body.innerHTML = '';
    loadPlayerHTML();
    await import('../../src/js/player.js');
  });

  /** Liefert fokussierbare Elemente in Tab-Reihenfolge (ohne versteckte) */
  function getFocusableInTabOrder(container) {
    const selector =
      'button:not([tabindex="-1"]), input:not([tabindex="-1"]), select:not([tabindex="-1"])';
    const elements = Array.from(container.querySelectorAll(selector));
    return elements.filter(el => {
      let node = el;
      while (node && node !== container) {
        if (node.hasAttribute?.('hidden')) return false;
        node = node.parentElement;
      }
      return true;
    });
  }

  const EXPECTED_TAB_ORDER = [
    'Abspielen', // Play/Pause
    'Videoposition', // Timeline
    'Lautstärke', // Volume Button
    'Untertitel', // CC
    'Audiodeskription', // AD
    'Einstellungen', // Settings
    'Vollbild aktivieren', // Fullscreen
  ];

  test('Tab-Reihenfolge folgt visueller Anordnung (links→rechts)', () => {
    const container = document.querySelector('.player-container');
    const focusable = getFocusableInTabOrder(container);

    const labels = focusable.map(el => el.getAttribute('aria-label') ?? '');

    expect(focusable.length).toBe(EXPECTED_TAB_ORDER.length);
    expect(labels).toEqual(EXPECTED_TAB_ORDER);
  });

  test('Versteckte Elemente (Lautstärke-Slider, Settings-Panel) sind nicht in Tab-Sequenz', () => {
    const container = document.querySelector('.player-container');
    const focusable = getFocusableInTabOrder(container);

    const volumeSlider = document.getElementById('player-volume-input');
    const settingsPanel = document.getElementById('player-settings-panel');

    expect(focusable).not.toContain(volumeSlider);
    expect(settingsPanel?.hasAttribute('hidden')).toBe(true);
    expect(focusable.some(el => settingsPanel?.contains(el))).toBe(false);
  });

  test('Kein Element mit tabindex > 0', () => {
    const container = document.querySelector('.player-container');
    const withPositiveTabindex = container.querySelectorAll('[tabindex]');
    withPositiveTabindex.forEach(el => {
      const val = parseInt(el.getAttribute('tabindex') ?? '', 10);
      expect(val <= 0 || Number.isNaN(val)).toBe(true);
    });
  });

  test('Lautstärke-Slider in Tab-Sequenz wenn sichtbar', async () => {
    const user = userEvent.setup();
    const volumeButton = screen.getByRole('button', { name: 'Lautstärke' });
    const volumeSlider = document.getElementById('player-volume-input');

    await user.click(volumeButton);

    const container = document.querySelector('.player-container');
    const focusable = getFocusableInTabOrder(container);

    expect(focusable).toContain(volumeSlider);
  });

  test('Tab-Walkthrough: Fokus-Reihenfolge per Tastatur', async () => {
    const user = userEvent.setup();
    const playButton = screen.getByRole('button', { name: 'Abspielen' });

    playButton.focus();
    expect(document.activeElement).toBe(playButton);

    await user.tab();
    expect(document.activeElement?.getAttribute('aria-label')).toBe(
      'Videoposition'
    );

    await user.tab();
    expect(document.activeElement?.getAttribute('aria-label')).toBe(
      'Lautstärke'
    );

    await user.tab();
    expect(document.activeElement?.getAttribute('aria-label')).toBe(
      'Untertitel'
    );
  });
});

describe('Kompletter Tastatur-Workflow (IMP-29I-A)', () => {
  beforeEach(async () => {
    jest.resetModules();
    document.body.innerHTML = '';
    loadPlayerHTML();
    await import('../../src/js/player.js');
  });

  const TAB_ORDER = [
    'Abspielen',
    'Videoposition',
    'Lautstärke',
    'Untertitel',
    'Audiodeskription',
    'Einstellungen',
    'Vollbild aktivieren',
  ];

  test('Tab-Sequenz durch alle Controls (vorwärts)', async () => {
    const user = userEvent.setup();

    for (const label of TAB_ORDER) {
      await user.tab();
      const focused = document.activeElement;
      expect(focused?.getAttribute('aria-label')).toBe(label);
    }
  });

  test('Shift+Tab rückwärts-Navigation', async () => {
    const user = userEvent.setup();
    const fullscreenButton = screen.getByRole('button', {
      name: 'Vollbild aktivieren',
    });

    fullscreenButton.focus();

    const reverseOrder = [...TAB_ORDER].reverse();
    for (let i = 1; i < reverseOrder.length; i++) {
      await user.tab({ shift: true });
      expect(document.activeElement?.getAttribute('aria-label')).toBe(
        reverseOrder[i]
      );
    }
  });

  test('Versteckte Elemente werden übersprungen (Lautstärke-Slider geschlossen)', async () => {
    const user = userEvent.setup();
    const volumeButton = screen.getByRole('button', { name: 'Lautstärke' });
    const volumeSlider = document.getElementById('player-volume-input');

    await user.tab(); // Abspielen
    await user.tab(); // Videoposition
    await user.tab(); // Lautstärke-Button
    expect(document.activeElement).toBe(volumeButton);

    await user.tab(); // Sollte zu Untertitel springen (nicht Lautstärke-Slider)
    expect(document.activeElement?.getAttribute('aria-label')).toBe(
      'Untertitel'
    );
    expect(document.activeElement).not.toBe(volumeSlider);
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
