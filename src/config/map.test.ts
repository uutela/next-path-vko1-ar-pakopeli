import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { MAP_ATTRIBUTION, MAP_STYLE_URL } from './map';

/**
 * Built from parts so this test file does not itself contain the strings it
 * searches for — otherwise every search below would match its own source.
 */
const TILE_HOST = ['tiles', 'openfreemap', 'org'].join('.');
const KEY_NAMES = [
  ['api', 'Key'].join(''),
  ['api', '_key'].join(''),
  ['access', '_token'].join(''),
  ['access', 'Token'].join(''),
];

function sourceFiles(dir = 'src'): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      return sourceFiles(path);
    }
    return /\.tsx?$/.test(path) ? [path] : [];
  });
}

function filesContaining(needle: string): string[] {
  return sourceFiles().filter((path) => readFileSync(path, 'utf8').includes(needle));
}

describe('map configuration', () => {
  it('AC1: the style URL is defined exactly once, in src/config/map.ts', () => {
    expect(filesContaining(TILE_HOST)).toEqual(['src/config/map.ts']);
    expect(MAP_STYLE_URL).toBe(`https://${TILE_HOST}/styles/liberty`);
  });

  it('AC2: both platform maps read the shared constant', () => {
    for (const path of ['src/ui/Map.tsx', 'src/ui/Map.web.tsx']) {
      expect(readFileSync(path, 'utf8')).toContain('MAP_STYLE_URL');
    }
  });

  it('AC3: the attribution string is exactly as the licence requires', () => {
    expect(MAP_ATTRIBUTION).toBe('© OpenMapTiles Data from OpenStreetMap');
  });

  it('AC7: no API key or access token appears anywhere in the source', () => {
    for (const name of KEY_NAMES) {
      expect(filesContaining(name)).toEqual([]);
    }
  });
});
