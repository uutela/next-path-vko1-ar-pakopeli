import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAudioPlayer } from 'expo-audio';
import { useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { useMemo } from 'react';
import { AppShell } from './src/ui/AppShell';
import { createPointStore } from './src/adapters/pointStore';
import seedPoints from './src/data/points.json';
import type { AudioPlayer } from './src/adapters/audio';
import type { CameraAdapter } from './src/adapters/camera';
import type { LocationSource } from './src/adapters/location';
import type { EscapePoint } from './src/domain/types';

/**
 * The one file no acceptance criterion covers: it builds the real adapters,
 * none of which run under jsdom. Kept thin for that reason — if the tests are
 * green and the app misbehaves, suspect this file first.
 * See specs/features/app-shell.md.
 */

const SEED = seedPoints as EscapePoint[];

/** Real GPS. The mock source in src/adapters/location.ts is for development. */
function createExpoLocationSource(): LocationSource {
  return {
    watch(onChange) {
      let subscription: Location.LocationSubscription | undefined;
      let cancelled = false;

      void (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted' || cancelled) {
          return;
        }
        subscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, distanceInterval: 1 },
          ({ coords }) => onChange({ latitude: coords.latitude, longitude: coords.longitude }),
        );
        if (cancelled) {
          subscription.remove();
        }
      })();

      return () => {
        cancelled = true;
        subscription?.remove();
      };
    },
  };
}

// One sound, created once. The adapter ignores the asset argument because
// there is nothing else to play.
const fanfarePlayer = createAudioPlayer(require('./assets/fanfare.wav'));

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();

  const location = useMemo(createExpoLocationSource, []);
  const pointStore = useMemo(() => createPointStore(AsyncStorage), []);
  const audio = useMemo<AudioPlayer>(() => ({ play: () => fanfarePlayer.play() }), []);

  const camera = useMemo<CameraAdapter>(
    () => ({
      permission: permission?.status ?? 'undetermined',
      request: () => {
        void requestPermission();
      },
    }),
    [permission, requestPermission],
  );

  return (
    <AppShell
      seed={SEED}
      pointStore={pointStore}
      location={location}
      audio={audio}
      camera={camera}
      rng={Math.random}
    />
  );
}
