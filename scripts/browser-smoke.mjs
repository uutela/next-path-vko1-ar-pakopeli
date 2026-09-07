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

const browser = await chromium.launch();
const context = await browser.newContext({
  permissions: ['geolocation'],
  geolocation: FAR,
  locale: 'fi-FI',
});
const page = await context.newPage();

const consoleErrors = [];
const pageErrors = [];
page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
page.on('pageerror', (e) => pageErrors.push(e.message));

console.log(`→ opening ${URL}`);
const response = await page.goto(URL, { waitUntil: 'networkidle', timeout: 120_000 });
console.log(`  HTTP ${response?.status()}`);

// The bundle is built on first request; give it room before reading the DOM.
await page.waitForTimeout(5_000);
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

// AC3 — opening the puzzle shows the AR screen.
if (offers > 0) {
  console.log('→ clicking "Avaa tehtävä"');
  await page.getByText('Avaa tehtävä').first().click();
  await page.waitForTimeout(3_000);
  await page.screenshot({ path: `${OUT}/03-puzzle.png`, fullPage: true });
  const puzzle = await page.locator('text=/^\\d \\+ \\d = \\?$/').count();
  record('app-shell AC3 puzzle text appears', true, puzzle === 1);
} else {
  record('app-shell AC3 puzzle text appears', true, 'not reached — no offer to click');
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
