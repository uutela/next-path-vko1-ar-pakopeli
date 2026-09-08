# Audit report

**Date:** 2026-09-08
**Scope:** every change so far — seven feature specs, 94 acceptance criteria,
123 tests, and the harness around them.

```
$ npm test
 Test Files  14 passed (14)
      Tests  123 passed (123)
   Duration  2.41s
$ npx tsc --noEmit
 exit 0
$ node scripts/browser-smoke.mjs
 14 checks, all passing, 0 console errors, 0 page errors
```

## Which acceptance criterion each change serves

| Module | Serves | Proven by |
|---|---|---|
| `domain/distance.ts` | proximity AC1–AC9 | 11 tests: two known distances computed before writing, symmetry, three radius boundaries, two range validations |
| `domain/puzzle.ts` | puzzle AC1–AC13 | 16 tests: draw bounds, exactly two rng calls, a 100-draw property, four rejected non-digit inputs |
| `domain/gameState.ts` | game-state AC1–AC15 | 19 tests, four of which pin that *nothing* happens |
| `domain/points.ts` | points-store AC1–AC6 | 6 tests: override by id, sort, no mutation |
| `adapters/pointStore.ts` | points-store AC7–AC10 | 5 tests against an in-memory fake |
| `adapters/location.ts` | app-shell AC8–AC12 | 6 tests, including the stationary-device case |
| `config/map.ts` | map-view AC1, AC3, AC7, AC10–AC13 | 8 tests, four of them source-tree assertions |
| `ui/Map.tsx` | map-view AC4–AC6, AC14 | 4 render tests against a MapLibre stand-in |
| `ui/MapScreen.tsx` | map-view AC8, AC9 | 2 render tests |
| `ui/PuzzlePanel.tsx` | ar-panel AC2–AC15, AC22 | the shared suite plus a sizing test |
| `ui/PuzzlePanel.web.tsx` | ar-panel AC18, AC19, AC22 | the same shared suite, plus points-based sizing |
| `ui/ArScreen.tsx` | ar-panel AC1, AC11, AC16 | 4 render tests, one reproducing Viro's constructor capture |
| `ui/ArScreen.web.tsx` | ar-panel AC17, AC20 | 3 tests, two of them source-tree assertions |
| `ui/AppShell.tsx` | app-shell AC1–AC7 | 8 render tests |

Every one of the 94 criteria appears in its spec's testing strategy table,
checked mechanically rather than by eye.

## What changed that no acceptance criterion asked for

Named rather than defended. Each is deliberate; none is covered.

1. **`App.tsx`** — builds the real adapters. Uncovered *by design*, and
   `app-shell.md` Risk says so and names it as the first thing to suspect. It
   is also where the stationary-device bug lived until the rule moved out of it.
2. **`patches/@reactvision+react-viro+2.58.1.patch`** — makes Viro's Podfile
   write synchronous. No criterion; without it no native build exists at all.
3. **`scripts/`** — the fanfare generator, the MapLibre worker copy, the local
   points file, and the browser smoke test. Tooling, not product.
4. **`src/ui/Map.web.tsx` is never rendered by any Vitest test.** Its criteria
   (AC2, AC10, AC11) are source-tree assertions, and only
   `scripts/browser-smoke.mjs` executes it. A render-time throw there would be
   caught by the browser run and by nothing else.
5. **`src/testing/scriptedRng.ts` and `src/ui/panelBehaviour.ts`** — test
   support. `panelBehaviour.ts` carries thirteen criteria and is itself
   untested, which is inherent: a suite cannot prove itself.

## Input validation and error paths

| Where | Guarded | Test |
|---|---|---|
| `distanceMeters` | latitude and longitude range, `RangeError` with an exact message | proximity AC8, AC9 — three tests |
| `checkAnswer` | all digits after trimming; `"7abc"`, `"7.9"`, `"+7"`, `"7e0"` rejected | puzzle AC13 — four tests |
| `appendDigit` | two characters maximum | puzzle AC12 |
| `transition` | every inapplicable event returns the state unchanged | game-state AC9, AC12 — four tests |
| `loadStoredPoints` | unparseable JSON, and JSON that is not an array | points-store AC8, AC9 |
| `createLocationSource` | cancellation before the first position | app-shell AC12 |
| `ArScreen` | camera permission denied, and undetermined requested once | ar-panel AC11 |

Twenty error-case rows, eighteen edge cases and fourteen boundaries across the
testing strategies — 52 of 110 rows are not happy paths.

**Two gaps found by this audit.**

**A. Corrupt stored points crash the app.** `loadStoredPoints` guards
unparseable JSON and non-arrays but not the shape of what is inside. A stored
`[{"id":"p2","foo":1}]` survives `mergePoints`, reaches `isWithinRadius`, and
throws on the first location update:

```
TypeError: Cannot destructure property 'latitude' of 'undefined' as it is undefined.
```

Verified by running it, not by reading. The app dies seconds after launch with
no way back except clearing device storage. It was filed in `INBOX.md` as a
robustness note; it is not a note, it is a crash.

**B. `createLocationSource` swallows every failure.** Two
`.catch(() => undefined)` calls make a denied permission, a timeout and a
device with no fix indistinguishable from "still looking" — to the player and
to the developer alike. This is what made a real diagnosis take an hour. The
user has decided against showing location state in the UI, which is a
legitimate scope decision; the swallowing itself is not the same decision and
was never made deliberately.

## Round 1 verdict

**CHANGES_REQUIRED**

1. **Corrupt stored points crash the app on the first location update.**
   `points-store.md` needs a criterion that `loadStoredPoints` returns only
   well-formed points, and the adapter needs to drop the rest. Blocking: it is
   a crash, and the stored file is written by an app that is still changing
   shape.
2. **`createLocationSource` discards the reason a position never arrived.**
   Not blocking, and not a request to change the UI the user has ruled on —
   but the failure should be visible to a developer rather than invisible to
   everyone.
3. **`Map.web.tsx` is executed only by the browser smoke test.** Not blocking.
   Worth recording so nobody reads the Vitest count as covering it.
4. **The native panel's sizing fix is unverified.** The device walkthrough
   showed the panel drawing only its background, one input strip and one key;
   every `ViroText` now has an explicit size, and nobody has looked since.
   Not blocking on the code, but step 7 is not closed until someone looks.


---

# Round 2

Item 1 fixed through the tdd workflow: `points-store.md` gained AC11 to AC13,
`isEscapePoint` is a pure guard covering shape *and* values, and
`loadStoredPoints` filters with it. Both criteria were proved able to fail,
and the crash path was re-run: two malformed entries dropped, one point kept,
no throw.

**The second pass found the same crash arriving by a different route.**
`App.tsx` cast both JSON imports to `EscapePoint[]` with no check.
`points.json` is committed and reviewed — but `points.local.json` is typed in
by hand, which makes it the likeliest source of a malformed point in the whole
system, not the least. A typed latitude of `"kuusikymmentä"` would have killed
the app on the first location update exactly as a corrupt store did.

Fixed the same way: `composeSeed` validates both files and lives in the domain
rather than as two casts in the one file no criterion covers. AC14, three
tests.

```
$ npm test                    130 passed (130)
$ npx tsc --noEmit            exit 0
$ node scripts/browser-smoke.mjs   14 checks, 0 errors
$ grep 'as EscapePoint[]' src App.tsx   no matches
```

98 criteria, every one covered by its spec's testing strategy.

## Round 2 verdict

**APPROVED**

Three findings remain recorded and none is a defect:

1. **`createLocationSource` discards the reason a position never arrived.** Two
   `.catch(() => undefined)` calls. The user has decided against showing
   location state in the UI, which settles the product question; this is the
   developer-visibility half, and it stays open in `INBOX.md`.
2. **`Map.web.tsx` is executed only by `scripts/browser-smoke.mjs`.** Its
   criteria are source-tree assertions. The Vitest count does not cover it,
   and nobody should read it as if it did.
3. **The native panel's sizing fix is unverified.** The device walkthrough
   showed the panel drawing only its background, one input strip and one key;
   every `ViroText` now has an explicit width and height, and nobody has
   looked since. Step 7 is not closed until someone does.
