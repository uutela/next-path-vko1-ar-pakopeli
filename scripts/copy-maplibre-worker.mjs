/**
 * Copies MapLibre's worker into public/ so the web dev server actually has it.
 *
 * maplibre-gl 6 loads its worker relative to `import.meta.url`, which Metro
 * does not rewrite: the request went to /node_modules/expo/maplibre-gl-worker.mjs
 * and the dev server answered with the app's index.html. A worker built from an
 * HTML document dies on the spot, and MapLibre without its worker processes no
 * tiles at all. See specs/features/map-view.md AC11.
 *
 * Generated rather than committed, so it cannot drift from the installed
 * version. Runs from postinstall.
 */
import { copyFileSync, mkdirSync } from 'node:fs';

/**
 * Both files, not just the worker: the worker is an ES module whose first line
 * is `import … from "./maplibre-gl-shared.mjs"`, and MapLibre starts it with
 * `new Worker(url, { type: 'module' })`. A worker whose sibling import cannot
 * be resolved dies silently on creation, with no console error anywhere.
 */
const FILES = ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs'];

const targetDir = new URL('../public/', import.meta.url);
mkdirSync(targetDir, { recursive: true });

for (const file of FILES) {
  copyFileSync(
    new URL(`../node_modules/maplibre-gl/dist/${file}`, import.meta.url),
    new URL(file, targetDir),
  );
  console.log(`Copied ${file} to public/`);
}
