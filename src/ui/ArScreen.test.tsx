import { render, screen } from '@testing-library/react';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { ArScreen } from './ArScreen';
import type { CameraAdapter, CameraPermission } from '../adapters/camera';
import type { EscapePoint, GameState } from '../domain/types';

vi.mock('@reactvision/react-viro', () => ({
  ViroARSceneNavigator: () => createElement('div', { 'data-testid': 'camera-preview' }),
  ViroARScene: ({ children }: { children?: ReactNode }) => createElement('div', null, children),
  ViroFlexView: ({ children, viroTag }: { children?: ReactNode; viroTag?: string }) =>
    createElement('div', { 'data-testid': viroTag }, children),
  ViroText: ({ text }: { text: string }) => createElement('span', null, text),
  ViroNode: ({ children }: { children?: ReactNode }) => createElement('div', null, children),
}));

const POINT: EscapePoint = {
  id: 'p1',
  name: 'Puisto',
  coordinates: { latitude: 60.1699, longitude: 24.9384 },
  radiusMeters: 20,
};

const PUZZLE_STATE = {
  kind: 'PUZZLE',
  point: POINT,
  puzzle: { left: 5, right: 2, answer: 7 },
  input: '',
} satisfies Extract<GameState, { kind: 'PUZZLE' }>;

function cameraAdapter(permission: CameraPermission) {
  const requests: number[] = [];
  const camera: CameraAdapter = {
    permission,
    request: () => requests.push(1),
  };
  return { camera, requests };
}

describe('ArScreen', () => {
  it('AC1: opening the puzzle starts the camera', () => {
    const { camera } = cameraAdapter('granted');

    render(
      createElement(ArScreen, {
        state: PUZZLE_STATE,
        onEvent: () => undefined,
        audio: { play: () => undefined },
        camera,
      }),
    );

    expect(screen.getAllByTestId('camera-preview')).toHaveLength(1);
  });

  it('AC11: denied camera permission explains itself and shows no keypad', () => {
    const { camera } = cameraAdapter('denied');

    render(
      createElement(ArScreen, {
        state: PUZZLE_STATE,
        onEvent: () => undefined,
        audio: { play: () => undefined },
        camera,
      }),
    );

    expect(screen.getByText('Kamera tarvitaan tehtävän avaamiseen.')).toBeTruthy();
    expect(screen.queryAllByTestId(/^key-/)).toHaveLength(0);
  });

  it('AC11: undetermined permission is requested exactly once', () => {
    const { camera, requests } = cameraAdapter('undetermined');

    render(
      createElement(ArScreen, {
        state: PUZZLE_STATE,
        onEvent: () => undefined,
        audio: { play: () => undefined },
        camera,
      }),
    );

    expect(requests).toHaveLength(1);
  });
});
