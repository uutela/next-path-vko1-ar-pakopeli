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

/**
 * Where a real position comes from. Split from `LocationSource` so the rule
 * below — deliver what we already know, then deliver changes — can be tested
 * without a device. See specs/features/app-shell.md AC10.
 */
export interface PositionProvider {
  getCurrent(): Promise<Coordinates>;
  watch(onChange: (coordinates: Coordinates) => void): Promise<() => void>;
}

/** Local only. Carries why a position failed, never a position. */
const defaultReport = (reason: unknown) => {
  console.warn('[location]', reason);
};

/**
 * Delivers the position we already have, then every change after it.
 *
 * Watching only for changes is what left a stationary device with no position
 * at all: `watchPositionAsync` notifies after a metre of movement, so a laptop
 * on a desk never triggered it and the game never left the map.
 * See specs/features/app-shell.md AC10.
 */
export function createLocationSource(
  provider: PositionProvider,
  report: (reason: unknown) => void = defaultReport,
): LocationSource {
  return {
    watch(onChange) {
      let cancelled = false;
      let stopWatching: (() => void) | undefined;

      const deliver = (coordinates: Coordinates) => {
        if (!cancelled) {
          onChange(coordinates);
        }
      };

      // A position that never arrives is a refused permission, a device with
      // no fix, or a timeout. The screen shows nothing either way — that is a
      // scope decision — but the reason is kept rather than discarded, because
      // silence here once turned a one-line problem into an hour of probing.
      void provider.getCurrent().then(deliver).catch(report);

      void provider
        .watch(deliver)
        .then((stop) => {
          if (cancelled) {
            stop();
          } else {
            stopWatching = stop;
          }
        })
        .catch(report);

      return () => {
        cancelled = true;
        stopWatching?.();
      };
    },
  };
}
