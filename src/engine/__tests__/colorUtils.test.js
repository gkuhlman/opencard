import { describe, it, expect } from 'vitest';
import { deriveColors } from '../colorUtils';

describe('deriveColors', () => {
  it('returns the input as the primary color', () => {
    const palette = deriveColors('#3a9bd5');
    expect(palette.primary).toBe('#3a9bd5');
  });

  it('returns all expected palette keys', () => {
    const palette = deriveColors('#3a9bd5');
    const expectedKeys = [
      'primary', 'primaryLight', 'primaryMuted', 'primaryFaint',
      'ink', 'background', 'pageBackground',
      'border', 'borderLight', 'diamondFill', 'diamondStroke',
    ];
    expect(Object.keys(palette).sort()).toEqual(expectedKeys.sort());
  });

  it('all values are valid hex colors', () => {
    const palette = deriveColors('#c0392b');
    for (const [key, value] of Object.entries(palette)) {
      expect(value, `${key} should be a hex color`).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('produces different palettes for different inputs', () => {
    const blue = deriveColors('#3a9bd5');
    const red = deriveColors('#c0392b');
    expect(blue.primaryLight).not.toBe(red.primaryLight);
    expect(blue.ink).not.toBe(red.ink);
    expect(blue.border).not.toBe(red.border);
  });

  it('produces consistent output for the same input', () => {
    const a = deriveColors('#2e7d32');
    const b = deriveColors('#2e7d32');
    expect(a).toEqual(b);
  });

  it('handles grayscale input', () => {
    const palette = deriveColors('#808080');
    expect(palette.primary).toBe('#808080');
    for (const value of Object.values(palette)) {
      expect(value).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('background and pageBackground are fixed values', () => {
    const palette = deriveColors('#ff0000');
    expect(palette.background).toBe('#fdfdfd');
    expect(palette.pageBackground).toBe('#e8e0d6');
  });
});
