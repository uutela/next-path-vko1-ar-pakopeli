import { createMockLocationSource } from './location';
import type { Coordinates } from '../domain/types';

const INSIDE: Coordinates = { latitude: 60.1700708711, longitude: 24.9384 };
const OUTSIDE: Coordinates = { latitude: 60.1707993216, longitude: 24.9384 };

describe('createMockLocationSource', () => {
  it('AC8: emits its scripted coordinates in order', () => {
    const seen: Coordinates[] = [];
    const source = createMockLocationSource([INSIDE, OUTSIDE]);
    source.watch((c) => seen.push(c));

    source.advance();
    source.advance();

    expect(seen).toEqual([INSIDE, OUTSIDE]);
  });

  it('AC9: a cancelled source stops emitting', () => {
    const seen: Coordinates[] = [];
    const source = createMockLocationSource([INSIDE, OUTSIDE]);
    const cancel = source.watch((c) => seen.push(c));

    source.advance();
    cancel();
    source.advance();

    expect(seen).toEqual([INSIDE]);
  });

  it('AC8: an empty list never calls back', () => {
    const seen: Coordinates[] = [];
    const source = createMockLocationSource([]);
    source.watch((c) => seen.push(c));

    expect(() => source.advance()).not.toThrow();
    expect(seen).toEqual([]);
  });
});
