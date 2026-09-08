import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PuzzlePanel } from './PuzzlePanel.web';
import type { ArScreenProps } from './ArScreen';

/**
 * The camera screen on web: a live preview with the puzzle panel drawn over
 * it, fixed to the screen rather than anchored in the world. Anchoring is the
 * native-only part — see specs/PRD.md — and the puzzle is not.
 *
 * Imports no Viro, deliberately: Viro's web files require a peer package that
 * is not published, and one such import takes down the whole web bundle.
 * See specs/features/ar-panel.md AC17.
 */
export function ArScreen({ camera, ...panelProps }: ArScreenProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (camera.permission === 'undetermined') {
      camera.request();
    }
  }, [camera]);

  useEffect(() => {
    if (camera.permission !== 'granted') {
      return;
    }
    let stream: MediaStream | undefined;
    let cancelled = false;

    // Absent in jsdom, and absent over plain HTTP: both are handled by simply
    // showing no picture behind the panel rather than failing.
    void navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'environment' } })
      .then((opened) => {
        if (cancelled) {
          opened.getTracks().forEach((track) => track.stop());
          return;
        }
        stream = opened;
        if (videoRef.current) {
          videoRef.current.srcObject = opened;
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [camera.permission]);

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
    <View style={styles.container}>
      <video
        ref={videoRef}
        data-testid="camera-preview"
        autoPlay
        playsInline
        muted
        style={videoStyle}
      />
      <View style={styles.overlay} pointerEvents="box-none">
        <PuzzlePanel {...panelProps} />
      </View>
    </View>
  );
}

const videoStyle = {
  position: 'absolute' as const,
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover' as const,
  backgroundColor: '#1a1a1a',
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  notice: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  noticeText: { fontSize: 18, color: '#1a1a1a', textAlign: 'center' },
});
