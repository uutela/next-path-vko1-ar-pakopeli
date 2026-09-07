import type { EscapePoint } from '../domain/types';

const STORAGE_KEY = 'ar-pakopeli.points';

/** The subset of AsyncStorage this adapter needs. */
export interface KeyValueStore {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}

export interface PointStore {
  loadStoredPoints(): Promise<EscapePoint[]>;
  saveStoredPoints(points: EscapePoint[]): Promise<void>;
}

/**
 * The only module that touches device storage. Writes exactly the four fields
 * of an EscapePoint and nothing else, which is what keeps solved progress out
 * of storage by construction rather than by discipline.
 * See specs/features/points-store.md.
 */
export function createPointStore(storage: KeyValueStore): PointStore {
  return {
    async loadStoredPoints(): Promise<EscapePoint[]> {
      const raw = await storage.getItem(STORAGE_KEY);
      if (raw === null) {
        return [];
      }
      try {
        const parsed: unknown = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as EscapePoint[]) : [];
      } catch {
        // A corrupt store falls back to the seed rather than crashing the app.
        return [];
      }
    },

    async saveStoredPoints(points: EscapePoint[]): Promise<void> {
      const stripped = points.map(({ id, name, coordinates, radiusMeters }) => ({
        id,
        name,
        coordinates,
        radiusMeters,
      }));
      await storage.setItem(STORAGE_KEY, JSON.stringify(stripped));
    },
  };
}
