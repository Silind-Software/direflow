import { getNameFormats, createDefaultName } from '../cli/utils/nameFormat';

describe('Get correct name formats', () => {
  it('should create name formats from slug', () => {
    const slug = 'test-component-name';
    const formats = getNameFormats(slug);

    expect(formats.title).toBe('Test Component Name');
    expect(formats.pascal).toBe('TestComponentName');
    expect(formats.snake).toBe('test-component-name');
  });

  it('should create name formats from pascal', () => {
    const slug = 'TestComponentName';
    const formats = getNameFormats(slug);

    expect(formats.title).toBe('Test Component Name');
    expect(formats.pascal).toBe('TestComponentName');
    expect(formats.snake).toBe('test-component-name');
  });

  it('should create name formats from title', () => {
    const slug = 'Test Component Name';
    const formats = getNameFormats(slug);

    expect(formats.title).toBe('Test Component Name');
    expect(formats.pascal).toBe('TestComponentName');
    expect(formats.snake).toBe('test-component-name');
  });
});

describe('Get defualt name', () => {
  it('should create a default name', () => {
    const defaultName = createDefaultName('awesome');
    expect(defaultName).toBe('awesome-component');
  });

  it('should not create a default name', () => {
    const defaultName = createDefaultName('nice-component');
    expect(defaultName).toBe('nice-component');
  });
});
