import { ViroARScene, ViroARSceneNavigator } from '@reactvision/react-viro';
import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PuzzlePanel } from './PuzzlePanel';
import type { PuzzlePanelProps } from './PuzzlePanel';
import type { CameraAdapter } from '../adapters/camera';

export interface ArScreenProps extends PuzzlePanelProps {
  camera: CameraAdapter;
}

interface SceneProps {
  sceneNavigator: { viroAppProps: PuzzlePanelProps };
}

/**
 * Defined once, at module level, and never as a closure over the current
 * props. ViroARSceneNavigator stores `initialScene` in its constructor and
 * never re-reads it, so a closure would freeze the panel at whatever state
 * existed when the camera opened. Changing state travels through
 * `viroAppProps`, which Viro refreshes on every render.
 * See specs/features/ar-panel.md AC16.
 */
function PuzzleScene({ sceneNavigator }: SceneProps) {
  return (
    <ViroARScene>
      <PuzzlePanel {...sceneNavigator.viroAppProps} />
    </ViroARScene>
  );
}

/** Camera, permission handling, and the AR scene that hosts the panel. */
export function ArScreen({ camera, ...panelProps }: ArScreenProps) {
  useEffect(() => {
    if (camera.permission === 'undetermined') {
      camera.request();
    }
  }, [camera]);

  if (camera.permission === 'denied') {
    return (
      <View style={styles.notice}>
        <Text style={styles.noticeText}>Kamera tarvitaan tehtävän avaamiseen.</Text>
      </View>
    );
  }

  if (camera.permission !== 'granted') {
    return null;
  }

  return (
    <ViroARSceneNavigator
      // Viro declares `scene` as `() => JSX.Element`, but its own renderer
      // calls it with `sceneNavigator` and `arSceneNavigator`. The declared
      // type understates what it passes, so the cast is narrowed to this one
      // line rather than weakening PuzzleScene's own props.
      initialScene={{ scene: PuzzleScene as unknown as () => ReactElement }}
      viroAppProps={panelProps}
      style={styles.scene}
    />
  );
}

const styles = StyleSheet.create({
  scene: { flex: 1 },
  notice: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  noticeText: { fontSize: 18, color: '#1a1a1a', textAlign: 'center' },
});
