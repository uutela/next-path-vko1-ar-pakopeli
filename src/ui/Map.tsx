import { Map as MapLibreMap, Marker } from '@maplibre/maplibre-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { MAP_ATTRIBUTION, MAP_STYLE_URL } from '../config/map';
import type { EscapePoint } from '../domain/types';

export interface MapProps {
  points: EscapePoint[];
}

/** Native map. The web build resolves Map.web.tsx instead. */
export function Map({ points }: MapProps) {
  return (
    <View style={styles.container}>
      <MapLibreMap style={styles.map} mapStyle={MAP_STYLE_URL} attribution={false}>
        {points.map((point) => (
          <Marker
            key={point.id}
            lngLat={[point.coordinates.longitude, point.coordinates.latitude]}
          >
            <View style={styles.marker} />
          </Marker>
        ))}
      </MapLibreMap>
      <Text style={styles.attribution}>{MAP_ATTRIBUTION}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  marker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#c2410c',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  attribution: {
    fontSize: 11,
    opacity: 0.8,
    color: '#1a1a1a',
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});
