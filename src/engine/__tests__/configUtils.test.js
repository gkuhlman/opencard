import { describe, it, expect } from 'vitest';
import { setByPath, computeOverrides } from '../configUtils';

describe('setByPath', () => {
  it('sets a top-level key', () => {
    expect(setByPath({ a: 1 }, 'a', 2)).toEqual({ a: 2 });
  });

  it('sets a nested key', () => {
    const obj = { theme: { colors: { primary: 'blue' } } };
    const result = setByPath(obj, 'theme.colors.primary', 'red');
    expect(result.theme.colors.primary).toBe('red');
  });

  it('does not mutate the original', () => {
    const obj = { a: { b: 1 } };
    const result = setByPath(obj, 'a.b', 2);
    expect(obj.a.b).toBe(1);
    expect(result.a.b).toBe(2);
  });

  it('preserves sibling keys', () => {
    const obj = { a: { b: 1, c: 2 } };
    const result = setByPath(obj, 'a.b', 99);
    expect(result).toEqual({ a: { b: 99, c: 2 } });
  });
});

describe('computeOverrides', () => {
  it('returns undefined when config equals defaults', () => {
    const obj = { a: 1 };
    expect(computeOverrides(obj, obj)).toBeUndefined();
  });

  it('returns undefined for identical objects (different refs)', () => {
    const defaults = { a: 1, b: { c: 2 } };
    const config = { a: 1, b: { c: 2 } };
    expect(computeOverrides(config, defaults)).toBeUndefined();
  });

  it('returns only changed fields', () => {
    const defaults = { a: 1, b: 2, c: 3 };
    const config = { a: 1, b: 99, c: 3 };
    expect(computeOverrides(config, defaults)).toEqual({ b: 99 });
  });

  it('handles nested changes', () => {
    const defaults = { theme: { colors: { primary: 'blue', ink: 'black' } } };
    const config = { theme: { colors: { primary: 'red', ink: 'black' } } };
    expect(computeOverrides(config, defaults)).toEqual({
      theme: { colors: { primary: 'red' } },
    });
  });

  it('returns undefined for identical arrays', () => {
    const defaults = { items: [1, 2, 3] };
    const config = { items: [1, 2, 3] };
    expect(computeOverrides(config, defaults)).toBeUndefined();
  });

  it('returns changed arrays', () => {
    const defaults = { items: [1, 2] };
    const config = { items: [3, 4] };
    expect(computeOverrides(config, defaults)).toEqual({ items: [3, 4] });
  });

  it('is the inverse of deepMerge', async () => {
    // deepMerge(defaults, overrides) → config
    // computeOverrides(config, defaults) → overrides
    const { deepMerge } = await import('../generate');
    const defs = { a: 1, b: { c: 2, d: 3 }, e: [1, 2] };
    const overrides = { b: { c: 99 }, e: [3] };
    const config = deepMerge(defs, overrides);
    expect(computeOverrides(config, defs)).toEqual(overrides);
  });
});
