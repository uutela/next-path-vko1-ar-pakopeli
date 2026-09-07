import { useCallback, useEffect, useRef, useState } from 'react';
import { ArScreen } from './ArScreen';
import { MapScreen } from './MapScreen';
import { transition } from '../domain/gameState';
import { mergePoints } from '../domain/points';
import type { LocationSource } from '../adapters/location';
import type { AudioPlayer } from '../adapters/audio';
import type { CameraAdapter } from '../adapters/camera';
import type { PointStore } from '../adapters/pointStore';
import type { EscapePoint, GameEvent, GameState } from '../domain/types';

export interface AppShellProps {
  seed: EscapePoint[];
  pointStore: PointStore;
  location: LocationSource;
  audio: AudioPlayer;
  camera: CameraAdapter;
  rng: () => number;
}

/**
 * The composition. Holds one GameState, changes it only through `transition`,
 * and picks the screen the state implies. Every source is injected, so this
 * renders in a test with no device. See specs/features/app-shell.md.
 */
export function AppShell({ seed, pointStore, location, audio, camera, rng }: AppShellProps) {
  const [state, setState] = useState<GameState>({ kind: 'MAP' });
  const [points, setPoints] = useState<EscapePoint[]>(seed);

  // The point list arrives asynchronously, so it is read through a ref rather
  // than captured by the dispatch closure. `transition` keeps taking its
  // context as an argument and stays pure.
  const pointsRef = useRef(points);
  pointsRef.current = points;

  const dispatch = useCallback(
    (event: GameEvent) => {
      setState((previous) => transition(previous, event, { points: pointsRef.current, rng }));
    },
    [rng],
  );

  useEffect(() => {
    let cancelled = false;
    void pointStore.loadStoredPoints().then((stored) => {
      if (!cancelled) {
        setPoints(mergePoints(seed, stored));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [pointStore, seed]);

  useEffect(
    () => location.watch((coordinates) => dispatch({ kind: 'LOCATION_CHANGED', coordinates })),
    [location, dispatch],
  );

  if (state.kind === 'PUZZLE' || state.kind === 'SOLVED') {
    return <ArScreen state={state} onEvent={dispatch} audio={audio} camera={camera} />;
  }

  return <MapScreen state={state} points={points} onEvent={dispatch} />;
}
