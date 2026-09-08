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

/**
 * Whether a value read back from storage is a point the game can use.
 *
 * Shape *and* values: a stored `{ id: "p2", foo: 1 }` used to survive as far
 * as `isWithinRadius` and throw on the first location update, and a stored
 * latitude of 91 would throw one step later inside `distanceMeters`. Either
 * killed the app seconds after launch, with no way back but clearing device
 * storage. See specs/features/points-store.md AC11 to AC13.
 */
export function isEscapePoint(value: unknown): value is EscapePoint {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const point = value as Partial<EscapePoint>;
  const { coordinates } = point;

  return (
    typeof point.id === 'string' &&
    point.id.length > 0 &&
    typeof point.name === 'string' &&
    typeof point.radiusMeters === 'number' &&
    point.radiusMeters > 0 &&
    typeof coordinates === 'object' &&
    coordinates !== null &&
    typeof coordinates.latitude === 'number' &&
    coordinates.latitude >= -90 &&
    coordinates.latitude <= 90 &&
    typeof coordinates.longitude === 'number' &&
    coordinates.longitude >= -180 &&
    coordinates.longitude <= 180
  );
}
