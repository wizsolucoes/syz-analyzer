const commandLineArgsParser = require('../src/command-line-args-parser');

describe('command line args parser', () => {
  it('sets default values', () => {
    // When
    const { app, breakBuild, path, components } = commandLineArgsParser.parse();

    // Then
    expect(app).toBe(undefined);
    expect(path).toBe('src');
    expect(breakBuild).toBe(false);
    expect(components).toBe(undefined);
  });

  it('parses given values', () => {
    // Given
    process.argv.push('--app', 'my-app');
    process.argv.push('--src', 'src/app');
    process.argv.push('--break-build');
    process.argv.push('--components=wiz-privacy');

    // When
    const { app, breakBuild, path, components } = commandLineArgsParser.parse();

    // Then
    expect(app).toBe('my-app');
    expect(path).toBe('src/app');
    expect(breakBuild).toBe(true);
    expect(components).toBe('wiz-privacy');
  });
});
