import MapGL, { Marker } from 'react-map-gl/maplibre';
// Without this the map loads its tiles and paints nothing: the canvas is
// created at full size and the screen stays white. See map-view.md AC10.
import 'maplibre-gl/dist/maplibre-gl.css';
import { StyleSheet, Text, View } from 'react-native';
import { MAP_ATTRIBUTION, MAP_STYLE_URL } from '../config/map';
import type { MapProps } from './Map';

/**
 * Web map. Same props and same constants as the native one; only the library
 * differs.
 */
export function Map({ points }: MapProps) {
  return (
    <View style={styles.container}>
      <View style={styles.mapArea}>
        <MapGL
          mapStyle={MAP_STYLE_URL}
          attributionControl={false}
          initialViewState={{ longitude: 24.9384, latitude: 60.1699, zoom: 15 }}
          // Explicit rather than `flex: 1`: react-map-gl renders a plain DOM
          // div, where a flex value inside react-native-web's layout means
          // nothing. This did not by itself make the map draw its data — see
          // the open item in INBOX.md.
          style={{ width: '100%', height: '100%' }}
        >
          {points.map((point) => (
            <Marker
              key={point.id}
              longitude={point.coordinates.longitude}
              latitude={point.coordinates.latitude}
            />
          ))}
        </MapGL>
      </View>
      <Text style={styles.attribution}>{MAP_ATTRIBUTION}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapArea: { flex: 1 },
  attribution: {
    fontSize: 11,
    opacity: 0.8,
    color: '#1a1a1a',
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});
