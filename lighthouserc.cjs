/** @type {import('@lhci/cli').Config} */
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/'],
      numberOfRuns: 1,
    },
    assert: {
      // Kein Preset – nur Kategorie-Scores, damit CI nicht an bf-cache/meta-description/etc. scheitert
      assertions: {
        'categories:performance': ['warn', { minScore: 0.5 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
