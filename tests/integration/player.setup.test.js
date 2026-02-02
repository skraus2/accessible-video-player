/**
 * IMP-20I: Integration-Testing-Setup
 * Testing Library + DOM-Tests
 */
import { jest } from '@jest/globals';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/dom';

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
