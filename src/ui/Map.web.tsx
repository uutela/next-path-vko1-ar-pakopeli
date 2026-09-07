import MapGL, { Marker } from 'react-map-gl/maplibre';
import { StyleSheet, Text, View } from 'react-native';
import { MAP_ATTRIBUTION, MAP_STYLE_URL } from '../config/map';
import type { MapProps } from './Map';

/**
 * Web map. Same props and same constants as the native one; only the library
 * differs. The web build must also load maplibre-gl's stylesheet, which is
 * done in the HTML shell rather than imported here so the type checker and
 * the test runner never see a CSS import.
 */
export function Map({ points }: MapProps) {
  return (
    <View style={styles.container}>
      <MapGL
        mapStyle={MAP_STYLE_URL}
        attributionControl={false}
        initialViewState={{ longitude: 24.9384, latitude: 60.1699, zoom: 15 }}
        style={{ flex: 1 }}
      >
        {points.map((point) => (
          <Marker
            key={point.id}
            longitude={point.coordinates.longitude}
            latitude={point.coordinates.latitude}
          />
        ))}
      </MapGL>
      <Text style={styles.attribution}>{MAP_ATTRIBUTION}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  attribution: {
    fontSize: 11,
    opacity: 0.8,
    color: '#1a1a1a',
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});
