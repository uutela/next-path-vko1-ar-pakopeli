import type { Coordinates } from '../domain/types';

/** Where the player's position comes from. Returns its own unsubscribe. */
export interface LocationSource {
  watch(onChange: (coordinates: Coordinates) => void): () => void;
}

/** A scripted source for development and tests. The demo runs on real GPS. */
export interface MockLocationSource extends LocationSource {
  advance(): void;
}

export function createMockLocationSource(coordinates: Coordinates[]): MockLocationSource {
  let listener: ((coordinates: Coordinates) => void) | undefined;
  let index = 0;

  return {
    watch(onChange) {
      listener = onChange;
      return () => {
        listener = undefined;
      };
    },

    advance() {
      const next = coordinates[index];
      if (next === undefined || listener === undefined) {
        return;
      }
      index += 1;
      listener(next);
    },
  };
}
