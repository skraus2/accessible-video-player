module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.cjs'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'json'],
  collectCoverageFrom: [
    'src/js/**/*.js',
    '!src/js/player.js', // Main entry point
  ],
  // Frühphase: niedrige Schwellen, später anheben wenn mehr Tests existieren
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/tests/__mocks__/styleMock.js',
  },
};
