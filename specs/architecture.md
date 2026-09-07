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
  ui/           MapScreen.tsx  Map.tsx  Map.web.tsx
                ArScreen.tsx  PuzzlePanel.tsx
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

Native and web differ in exactly one place: the map. React Native resolves
`Map.tsx` on iOS and Android and `Map.web.tsx` on web, and both take the same
props and import the same constants from `config/map.ts`. Nothing else in the
tree branches on platform.

The AR screen has no web implementation. On web the app shows the map and
says so; anchored AR is a native-only feature by the PRD.

## What this architecture refuses

No service layer, no dependency injection container, no state library, no
event bus, no backend client. The game is small enough that a reducer and four
adapter modules cover it, and every one of those would be a non-goal from the
PRD wearing a technical disguise.
