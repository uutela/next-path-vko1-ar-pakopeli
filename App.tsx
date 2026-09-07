import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Placeholder shell. The map and AR screens arrive with their specs in
 * specs/features/; this exists so `npm start` is a real command.
 */
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AR Pakopeli</Text>
      <Text style={styles.body}>Ei vielä pisteitä.</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#faf9f7',
  },
  title: { fontSize: 32, fontWeight: '600', color: '#1a1a1a' },
  body: { fontSize: 18, color: '#4a4a4a', marginTop: 8 },
});
