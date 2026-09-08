# Architecture

**Status:** Draft
**Scope:** MVP1

## Shape

Three layers, and one rule that keeps them honest: **dependencies point
inward only.**

```
  ui/          screens and components — React, no game rules
    |
    v
  domain/      pure functions — the whole game, no I/O
    ^
    |
  adapters/    GPS, camera, storage, audio — I/O, no game rules
```

`domain/` imports nothing from `ui/` or `adapters/`. It is plain TypeScript
with no React import, so every rule in the game can be tested with Vitest and
no device. That is not a style preference: anchored AR and real GPS are both
slow and awkward to test, so anything that *can* be moved out of them must be.

## Directory layout

```
src/
  domain/       types.ts  distance.ts  puzzle.ts  gameState.ts  points.ts
  adapters/     location.ts  camera.ts  pointStore.ts  audio.ts
  ui/           AppShell.tsx  MapScreen.tsx  Map.tsx  Map.web.tsx
                ArScreen.tsx      PuzzlePanel.tsx      (native, anchored)
                ArScreen.web.tsx  PuzzlePanel.web.tsx  (web, overlay)
  config/       map.ts
  data/         points.json
  testing/      scriptedRng.ts — helpers used only by tests
assets/         fanfare.wav
scripts/        generate-fanfare.mjs
```

## How a move through the game flows

1. The location adapter emits a `Coordinates` on each GPS update
2. `App` dispatches `{ kind: 'LOCATION_CHANGED', coordinates }`
3. `transition(state, event, ctx)` returns the next `GameState` — this is the
   only place a game rule lives
4. React re-renders whatever that state implies

The same path serves every event: a key press, a submit, a reset. There is one
reducer and one state object; no screen keeps a private copy of anything.

## State ownership

`App.tsx` holds exactly one `GameState`, driven by `useReducer` over
`transition`. `ctx` carries the point list and the RNG, both created once at
startup:

- `points` — `mergePoints(seed, stored)`, read once when the app opens
- `rng` — `Math.random` in production, a scripted function in tests

Solved progress lives only in that in-memory state. Nothing writes it
anywhere, which is what makes the PRD's "progress does not persist" true by
construction rather than by discipline.

## Adapters

Each adapter is a module exporting plain functions over plain types. None of
them imports `domain/` or `ui/`. Each has a fake used by tests:

| Adapter | Real | Fake in tests |
|---|---|---|
| `location` | `expo-location` watch | a function returning scripted coordinates |
| `camera` | `expo-camera` permission and preview | a permission value chosen per test |
| `pointStore` | AsyncStorage read/write | an in-memory object |
| `audio` | `expo-audio` playback | a spy counting `play` calls |

Mocked location is a development and testing tool. The demo runs on real GPS.

## Platform split

Native and web differ in two places, and both are resolved by React Native's
platform extensions. Nothing in the tree reads `Platform.OS`.

**The map.** `Map.tsx` on iOS and Android, `Map.web.tsx` on web. Same props,
same constants from `config/map.ts`.

**The camera view.** `ArScreen.tsx` with `PuzzlePanel.tsx` draws the panel as
a Viro object anchored in the world. `ArScreen.web.tsx` with
`PuzzlePanel.web.tsx` draws the same panel as ordinary React Native views over
a camera preview — a heads-up overlay, fixed to the screen rather than to the
world.

**Anchoring is the native-only part; the puzzle is not.** The PRD's non-goal
is "no anchored AR on web", and an overlay is not anchored AR. Both panels are
driven by the same `GameState`, dispatch the same `GameEvent`s, and get their
rules from `domain/`. The two implementations differ in how they draw and
never in what they do — which is what makes the shared `transition` worth
having.

An earlier version of this section said the AR screen had no web
implementation at all and that web would only show the map. That was stricter
than the PRD, which says "everything else works on web", and it made the web
build a showcase rather than something a person could play.

## What this architecture refuses

No service layer, no dependency injection container, no state library, no
event bus, no backend client. The game is small enough that a reducer and four
adapter modules cover it, and every one of those would be a non-goal from the
PRD wearing a technical disguise.
