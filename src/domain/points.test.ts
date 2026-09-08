import { composeSeed, isEscapePoint, mergePoints } from './points';
import type { EscapePoint } from './types';

const SEED_A: EscapePoint = {
  id: 'p1',
  name: 'Puisto',
  coordinates: { latitude: 60.1699, longitude: 24.9384 },
  radiusMeters: 20,
};

const STORED_B: EscapePoint = {
  id: 'p2',
  name: 'Kentta',
  coordinates: { latitude: 60.171, longitude: 24.94 },
  radiusMeters: 20,
};

describe('mergePoints', () => {
  it('AC1: with nothing stored, the seed is the whole list', () => {
    expect(mergePoints([SEED_A], [])).toEqual([SEED_A]);
  });

  it('AC2: a stored point with a new id is added, ordered by id', () => {
    expect(mergePoints([SEED_A], [STORED_B]).map((p) => p.id)).toEqual(['p1', 'p2']);
  });

  it('AC3: a stored point overrides a seed point with the same id', () => {
    const moved: EscapePoint = {
      id: 'p1',
      name: 'Siirretty',
      coordinates: { latitude: 60.18, longitude: 24.9384 },
      radiusMeters: 30,
    };

    const merged = mergePoints([SEED_A], [moved]);

    expect(merged).toHaveLength(1);
    expect(merged[0]).toEqual(moved);
  });

  it('AC4: two empty lists produce an empty list', () => {
    expect(mergePoints([], [])).toEqual([]);
  });

  it('AC5: the result is sorted by id regardless of input order', () => {
    const unordered: EscapePoint[] = ['p3', 'p1', 'p2'].map((id) => ({ ...SEED_A, id }));

    expect(mergePoints([], unordered).map((p) => p.id)).toEqual(['p1', 'p2', 'p3']);
  });

  it('AC6: merging does not mutate its inputs', () => {
    const seed = [SEED_A];
    const stored = [STORED_B];
    const seedBefore = structuredClone(seed);
    const storedBefore = structuredClone(stored);

    mergePoints(seed, stored);

    expect(seed).toEqual(seedBefore);
    expect(stored).toEqual(storedBefore);
  });
});

describe('isEscapePoint', () => {
  it('AC11: an entry that is not a point is dropped', () => {
    const notPoints: unknown[] = [
      { id: 'p2', foo: 1 },
      null,
      'p1',
      42,
      { id: 'p3', name: 'x', coordinates: { latitude: 60, longitude: 24 } },
    ];

    expect(notPoints.map(isEscapePoint)).toEqual([false, false, false, false, false]);
  });

  it('AC12: a point with impossible values is dropped', () => {
    const impossible: unknown[] = [
      { ...SEED_A, coordinates: { latitude: 91, longitude: 24 } },
      { ...SEED_A, coordinates: { latitude: 60, longitude: -181 } },
      { ...SEED_A, radiusMeters: 0 },
    ];

    expect(impossible.map(isEscapePoint)).toEqual([false, false, false]);
  });

  it('AC11: a well-formed point is kept', () => {
    expect(isEscapePoint(SEED_A)).toBe(true);
  });
});

describe('composeSeed', () => {
  it('AC14: a hand-edited local file cannot crash the game', () => {
    const local = [{ id: 'p1', coordinates: { latitude: 'kuusikymmentä' } }];

    expect(composeSeed([SEED_A], local)).toEqual([SEED_A]);
  });

  it('AC14: a well-formed local point overrides the committed seed', () => {
    const moved = { ...SEED_A, name: 'Lähellä', coordinates: { latitude: 60.2, longitude: 25 } };

    expect(composeSeed([SEED_A], [moved])).toEqual([moved]);
  });

  it('AC14: anything that is not an array is ignored', () => {
    expect(composeSeed([SEED_A], null)).toEqual([SEED_A]);
    expect(composeSeed(null, null)).toEqual([]);
  });
});
