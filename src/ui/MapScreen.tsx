import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Map } from './Map';
import type { EscapePoint, GameEvent, GameState } from '../domain/types';

export interface MapScreenProps {
  state: GameState;
  points: EscapePoint[];
  onEvent: (event: GameEvent) => void;
}

/** The map, plus the offer to open a puzzle once a point is in range. */
export function MapScreen({ state, points, onEvent }: MapScreenProps) {
  return (
    <View style={styles.container}>
      <Map points={points} />
      {state.kind === 'NEAR' ? (
        <Pressable style={styles.button} onPress={() => onEvent({ kind: 'OPEN_PUZZLE' })}>
          <Text style={styles.buttonLabel}>Avaa tehtävä</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  button: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c2410c',
    paddingHorizontal: 24,
  },
  buttonLabel: { fontSize: 20, color: '#ffffff', fontWeight: '600' },
});
