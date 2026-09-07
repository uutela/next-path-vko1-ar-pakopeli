import { mergePoints } from './points';
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
