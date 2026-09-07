import { StyleSheet, Text, View } from 'react-native';
import type { ArScreenProps } from './ArScreen';

/**
 * Web stand-in for the AR screen. It imports no Viro, and that is the whole
 * point: `@reactvision/react-viro` resolves `.web.js` files that require
 * `@reactvision/viro-web-renderer`, a peer dependency that is not published,
 * so a single Viro import anywhere in the web graph takes the entire bundle
 * down — map screen included.
 *
 * Anchored AR is native-only by the PRD. See specs/features/ar-panel.md AC17.
 */
export function ArScreen(_props: ArScreenProps) {
  return (
    <View style={styles.notice}>
      <Text style={styles.noticeText}>Tehtävä avataan puhelimen sovelluksessa.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  noticeText: { fontSize: 18, color: '#1a1a1a', textAlign: 'center' },
});
