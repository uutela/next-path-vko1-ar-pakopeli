import type { Coordinates, EscapePoint } from './types';

/** Mean earth radius, as used by the haversine formula. */
const EARTH_RADIUS_METERS = 6371000;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function assertValidCoordinates({ latitude, longitude }: Coordinates): void {
  if (latitude < -90 || latitude > 90) {
    throw new RangeError('latitude must be between -90 and 90');
  }
  if (longitude < -180 || longitude > 180) {
    throw new RangeError('longitude must be between -180 and 180');
  }
}

/**
 * Great-circle distance between two coordinates, in metres.
 * See specs/features/proximity.md.
 */
export function distanceMeters(a: Coordinates, b: Coordinates): number {
  assertValidCoordinates(a);
  assertValidCoordinates(b);

  const deltaLatitude = toRadians(b.latitude - a.latitude);
  const deltaLongitude = toRadians(b.longitude - a.longitude);
  const latitudeA = toRadians(a.latitude);
  const latitudeB = toRadians(b.latitude);

  const h =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(latitudeA) * Math.cos(latitudeB) * Math.sin(deltaLongitude / 2) ** 2;

  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(h));
}

/**
 * Whether the player is close enough to a point to open it. Behaviour at a
 * distance of exactly radiusMeters is unspecified, so this comparison is free
 * to change. See specs/features/proximity.md.
 */
export function isWithinRadius(player: Coordinates, point: EscapePoint): boolean {
  return distanceMeters(player, point.coordinates) <= point.radiusMeters;
}
