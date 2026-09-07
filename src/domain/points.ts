import type { EscapePoint } from './types';

/**
 * Seed points from the repo, overridden by points stored on the device.
 * A stored point with the same id wins; the result is sorted by id so the
 * order never depends on how either list happened to be built.
 * See specs/features/points-store.md.
 */
export function mergePoints(seed: EscapePoint[], stored: EscapePoint[]): EscapePoint[] {
  const byId = new Map<string, EscapePoint>();

  for (const point of seed) {
    byId.set(point.id, point);
  }
  for (const point of stored) {
    byId.set(point.id, point);
  }

  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
}
