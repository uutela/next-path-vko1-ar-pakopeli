/**
 * Walks the web build through the map half of the game and reports what it
 * saw. Read-only: it never fixes anything, it only looks.
 *
 *   node scripts/browser-smoke.mjs [url] [outDir]
 *
 * The AR half is not reachable here — Viro is a native renderer and ARKit
 * anchoring is native-only, which specs/PRD.md states as a decision rather
 * than a gap. See the report this prints for what that costs.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const URL = process.argv[2] ?? 'http://localhost:8081';
const OUT = process.argv[3] ?? '.smoke';

/** The seed point in src/data/points.json, and a position 19 m north of it. */
const POINT = { latitude: 60.1699, longitude: 24.9384 };
const INSIDE = { latitude: 60.1700708711, longitude: 24.9384 };
const FAR = { latitude: 60.1707993216, longitude: 24.9384 };

const results = [];
const record = (id, expected, actual) =>
  results.push({ id, expected, actual, ok: expected === actual });

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  // A synthetic camera, so getUserMedia resolves without hardware.
  args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
});
const context = await browser.newContext({
  permissions: ['geolocation', 'camera'],
  geolocation: FAR,
  locale: 'fi-FI',
});
const page = await context.newPage();

const consoleErrors = [];
const pageErrors = [];
page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
page.on('pageerror', (e) => pageErrors.push(e.message));

console.log(`→ opening ${URL}`);
// Not `networkidle`: map tiles and Metro's HMR socket keep the network busy,
// so it never settles. Wait for the document, then for the app to paint.
const response = await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 120_000 });
console.log(`  HTTP ${response?.status()}`);

// The bundle is built on first request, and it is 3.5 MB.
await page
  .getByText('© OpenMapTiles Data from OpenStreetMap')
  .waitFor({ timeout: 120_000 })
  .catch(() => console.log('  (attribution never appeared)'));
await page.waitForTimeout(3_000);
await page.screenshot({ path: `${OUT}/01-loaded.png`, fullPage: true });

const bodyText = await page.locator('body').innerText().catch(() => '');
console.log(`  body text: ${JSON.stringify(bodyText.slice(0, 200))}`);

// AC1 — the map state shows the map screen.
record(
  'app-shell AC1 attribution present',
  true,
  await page.getByText('© OpenMapTiles Data from OpenStreetMap').count() === 1,
);
record('app-shell AC1 no offer while far', 0, await page.getByText('Avaa tehtävä').count());

// AC2 — walking into range offers the puzzle.
console.log(`→ moving to ${INSIDE.latitude}, ${INSIDE.longitude} (19 m from the point)`);
await context.setGeolocation(INSIDE);
await page.waitForTimeout(4_000);
await page.screenshot({ path: `${OUT}/02-near.png`, fullPage: true });
const offers = await page.getByText('Avaa tehtävä').count();
record('app-shell AC2 offer appears in range', 1, offers);

// map-view AC5/AC6 — the map itself, not just its attribution.
const canvases = await page.locator('canvas').count();
record('map-view a map canvas is rendered', true, canvases > 0);
const canvasBox = canvases > 0 ? await page.locator('canvas').first().boundingBox() : null;
record(
  'map-view the map canvas has area',
  true,
  Boolean(canvasBox && canvasBox.width > 0 && canvasBox.height > 0),
);

// The whole puzzle, played on web. The panel is an overlay here rather than
// anchored — anchoring is the native-only part, not the puzzle.
if (offers > 0) {
  console.log('→ clicking "Avaa tehtävä"');
  await page.getByText('Avaa tehtävä').first().click();
  await page.waitForTimeout(3_000);
  await page.screenshot({ path: `${OUT}/03-puzzle.png`, fullPage: true });

  record('ar-panel AC20 camera preview present', 1, await page.getByTestId('camera-preview').count());
  const sum = await page.locator('text=/^\\d \\+ \\d = \\?$/').first().textContent();
  console.log(`  panel reads: ${JSON.stringify(sum)}`);
  record('ar-panel AC20 panel states a sum', true, /^\d \+ \d = \?$/.test(sum ?? ''));
  record('ar-panel AC3 twelve keys', 12, await page.getByTestId(/^key-/).count());

  // Solve it: read the operands off the screen and type the answer.
  const [left, right] = (sum ?? '').match(/\d/g)?.map(Number) ?? [];
  const answer = String((left ?? 0) + (right ?? 0));
  console.log(`→ typing ${answer}, then OK`);
  for (const digit of answer) {
    await page.getByTestId(`key-${digit}`).click();
  }
  record('ar-panel AC4 input display shows what was typed', answer, await page.getByTestId('input-display').innerText());

  await page.getByTestId('key-OK').click();
  await page.waitForTimeout(1_500);
  await page.screenshot({ path: `${OUT}/04-solved.png`, fullPage: true });
  record('ar-panel AC7 congratulation appears', 1, await page.getByText('Oikein! Laatikko aukesi.').count());
  record('ar-panel AC12 reset control appears', 1, await page.getByText('Aloita alusta').count());
} else {
  record('ar-panel AC20 camera preview present', 1, 'not reached — no offer to click');
}

console.log('\n──────── results ────────');
for (const r of results) {
  console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.id}`);
  if (!r.ok) console.log(`        expected ${JSON.stringify(r.expected)}, saw ${JSON.stringify(r.actual)}`);
}
console.log(`\nconsole errors: ${consoleErrors.length}`);
consoleErrors.slice(0, 10).forEach((e) => console.log(`  ! ${e.slice(0, 300)}`));
console.log(`page errors: ${pageErrors.length}`);
pageErrors.slice(0, 10).forEach((e) => console.log(`  !! ${e.slice(0, 300)}`));
console.log(`\nscreenshots in ${OUT}/`);

await browser.close();
process.exit(results.every((r) => r.ok) && pageErrors.length === 0 ? 0 : 1);
