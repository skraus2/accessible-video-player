describe('Jest Setup', () => {
  test('Jest ist korrekt konfiguriert', () => {
    expect(true).toBe(true);
  });

  test('JSDOM ist verfügbar', () => {
    const div = document.createElement('div');
    expect(div).toBeInstanceOf(HTMLDivElement);
  });

  test('Video-Element-Mock funktioniert', () => {
    const video = document.createElement('video');
    expect(video.play).toBeDefined();
    expect(video.pause).toBeDefined();
  });
});
