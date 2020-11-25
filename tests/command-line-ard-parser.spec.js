const commandLineArgsParser = require('../src/command-line-args-parser');

describe('command line args parser', () => {
  it('sets default values', () => {
    // Given

    // When
    const { app, gateway, breakBuild, path, components } = commandLineArgsParser.parse();

    // Then
    expect(app).toBe(undefined);
    expect(gateway).toBe(100);
    expect(path).toBe('src');
    expect(breakBuild).toBe(false);
    expect(components).toBe(undefined);
  })

  it('parses given values', () => {
    // Given
    process.argv.push('--app', 'my-app');
    process.argv.push('--gateway', '70');
    process.argv.push('--src', 'src/app');
    process.argv.push('--break-build');
    process.argv.push('--components=wiz-privacy');

    // When
    const { app, gateway, breakBuild, path, components } = commandLineArgsParser.parse();

    // Then
    expect(app).toBe('my-app');
    expect(gateway).toBe(70);
    expect(path).toBe('src/app');
    expect(breakBuild).toBe(true);
    expect(components).toBe('wiz-privacy');
  })
});