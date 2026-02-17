import { describe, it, expect } from 'vitest';
import { deepMerge } from '../generate';

describe('deepMerge', () => {
  it('returns target when source is empty', () => {
    const target = { a: 1, b: { c: 2 } };
    expect(deepMerge(target, {})).toEqual(target);
  });

  it('overrides top-level primitives', () => {
    expect(deepMerge({ a: 1 }, { a: 2 })).toEqual({ a: 2 });
  });

  it('adds new keys from source', () => {
    expect(deepMerge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
  });

  it('deep merges nested objects', () => {
    const target = { theme: { colors: { primary: 'blue', ink: 'black' } } };
    const source = { theme: { colors: { primary: 'red' } } };
    expect(deepMerge(target, source)).toEqual({
      theme: { colors: { primary: 'red', ink: 'black' } },
    });
  });

  it('does not mutate target or source', () => {
    const target = { a: { b: 1 } };
    const source = { a: { b: 2 } };
    const targetCopy = JSON.parse(JSON.stringify(target));
    const sourceCopy = JSON.parse(JSON.stringify(source));
    deepMerge(target, source);
    expect(target).toEqual(targetCopy);
    expect(source).toEqual(sourceCopy);
  });

  it('replaces arrays entirely (no element merge)', () => {
    const target = { items: [1, 2, 3] };
    const source = { items: [4, 5] };
    expect(deepMerge(target, source)).toEqual({ items: [4, 5] });
  });

  it('handles three-level nesting', () => {
    const target = { a: { b: { c: 1, d: 2 } } };
    const source = { a: { b: { c: 99 } } };
    expect(deepMerge(target, source)).toEqual({ a: { b: { c: 99, d: 2 } } });
  });

  it('source primitive overwrites target object', () => {
    const target = { a: { nested: true } };
    const source = { a: 'flat' };
    expect(deepMerge(target, source)).toEqual({ a: 'flat' });
  });
});
