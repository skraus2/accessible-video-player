require('@testing-library/jest-dom');

// Mock für Video-Element (JSDOM unterstützt kein echtes Video)
global.HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
global.HTMLMediaElement.prototype.pause = jest.fn();
global.HTMLMediaElement.prototype.load = jest.fn();

Object.defineProperty(HTMLMediaElement.prototype, 'muted', {
  get: jest.fn(() => false),
  set: jest.fn(),
});

Object.defineProperty(HTMLMediaElement.prototype, 'paused', {
  get: jest.fn(() => true),
});
