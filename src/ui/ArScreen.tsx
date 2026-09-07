import { ViroARScene, ViroARSceneNavigator } from '@reactvision/react-viro';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PuzzlePanel } from './PuzzlePanel';
import type { PuzzlePanelProps } from './PuzzlePanel';
import type { CameraAdapter } from '../adapters/camera';

export interface ArScreenProps extends PuzzlePanelProps {
  camera: CameraAdapter;
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

  const scene = () => (
    <ViroARScene>
      <PuzzlePanel {...panelProps} />
    </ViroARScene>
  );

  return <ViroARSceneNavigator initialScene={{ scene }} style={styles.scene} />;
}

const styles = StyleSheet.create({
  scene: { flex: 1 },
  notice: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  noticeText: { fontSize: 18, color: '#1a1a1a', textAlign: 'center' },
});
