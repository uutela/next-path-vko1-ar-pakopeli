import { StyleSheet, View } from 'react-native';
import { PuzzlePanel } from './PuzzlePanel.web';
import type { ArScreenProps } from './ArScreen';

/**
 * The puzzle screen on web: the panel on a plain background, with no camera
 * and no overlay. The camera adapter is accepted and ignored — a camera needs
 * a permission prompt and a secure context, and asking a stranger for either
 * before they can try a puzzle is the opposite of easy. Anchored AR and the
 * camera are both native-only by the PRD.
 *
 * Imports no Viro, deliberately: Viro's web files require a peer package that
 * is not published, and one such import takes down the whole web bundle.
 * See specs/features/ar-panel.md AC17 and AC20.
 */
export function ArScreen({ camera: _camera, ...panelProps }: ArScreenProps) {
  return (
    <View style={styles.screen}>
      <PuzzlePanel {...panelProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#1f2937',
  },
});
