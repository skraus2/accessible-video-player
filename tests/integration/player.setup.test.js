/**
 * IMP-20I: Integration-Testing-Setup
 * Testing Library + DOM-Tests
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { screen } from '@testing-library/dom';
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
