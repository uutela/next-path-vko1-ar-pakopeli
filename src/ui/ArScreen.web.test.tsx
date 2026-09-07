import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import { createElement } from 'react';
import { ArScreen } from './ArScreen.web';
import type { CameraAdapter } from '../adapters/camera';
import type { EscapePoint, GameState } from '../domain/types';

/**
 * Assembled from parts so this file is not itself a match, and matched as an
 * `import`/`require` rather than as a substring: the criterion is about files
 * that *import* Viro, and a doc comment naming the package is not an import.
 */
const VIRO_PACKAGE = ['@reactvision', 'react-viro'].join('/');
const VIRO_IMPORT = new RegExp(
  `(?:from|require\\(\\s*)\\s*['"]${VIRO_PACKAGE.replace('/', '\\/')}['"]`,
);

function sourceFiles(dir = 'src'): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      return sourceFiles(path);
    }
    return /\.tsx?$/.test(path) && !/\.test\.tsx?$/.test(path) ? [path] : [];
  });
}

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

const camera: CameraAdapter = { permission: 'granted', request: () => undefined };

describe('the web platform split', () => {
  it('AC17: only the native AR files import Viro', () => {
    const importers = sourceFiles().filter((path) =>
      VIRO_IMPORT.test(readFileSync(path, 'utf8')),
    );

    expect(importers.sort()).toEqual(['src/ui/ArScreen.tsx', 'src/ui/PuzzlePanel.tsx']);
  });

  it('AC17: the web AR screen imports neither Viro nor the panel', () => {
    const source = readFileSync('src/ui/ArScreen.web.tsx', 'utf8');

    expect(VIRO_IMPORT.test(source)).toBe(false);
    expect(source).not.toContain('./PuzzlePanel');
  });

  it('AC18: the web AR screen says where the puzzle can be opened', () => {
    render(
      createElement(ArScreen, {
        state: PUZZLE_STATE,
        onEvent: () => undefined,
        audio: { play: () => undefined },
        camera,
      }),
    );

    expect(screen.getAllByText('Tehtävä avataan puhelimen sovelluksessa.')).toHaveLength(1);
    expect(screen.queryAllByTestId(/^key-/)).toHaveLength(0);
  });
});
