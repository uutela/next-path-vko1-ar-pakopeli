import type { Coordinates } from './types';

/**
 * Great-circle distance between two coordinates, in metres.
 * See specs/features/proximity.md.
 */
export function distanceMeters(_a: Coordinates, _b: Coordinates): number {
  // Smallest implementation that satisfies AC1. AC2 and AC3 name distances
  // that are not zero and will force the haversine formula out; writing it
  // now would make their RED phase fake.
  return 0;
}
