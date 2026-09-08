import type { EscapePoint } from '../domain/types';

/**
 * Tile style and the attribution its licence requires.
 *
 * OpenFreeMap needs no account and no API key, and permits commercial use.
 * It has no SLA, so this URL is kept here and nowhere else: switching to
 * self-hosted tiles is then a one-line change. See specs/features/map-view.md.
 */
export const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';

/** Mandatory. Rendering the map without this is a licence breach. */
export const MAP_ATTRIBUTION = '© OpenMapTiles Data from OpenStreetMap';

/** Close enough that a 20 m radius is a meaningful part of the screen. */
export const MAP_ZOOM = 15;

/** Where the map looks when there are no points at all: Helsinki, Senate Square. */
export const MAP_FALLBACK_CENTRE: [number, number] = [24.9384, 60.1699];

/**
 * Where the map opens. The first point, so its marker is on screen — a map
 * centred anywhere else shows the player somewhere they are not.
 * See specs/features/map-view.md AC12.
 */
export function initialCentre(points: EscapePoint[]): [number, number] {
  const first = points[0];
  if (!first) {
    return MAP_FALLBACK_CENTRE;
  }
  return [first.coordinates.longitude, first.coordinates.latitude];
}
