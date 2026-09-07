# Feature: Point storage and admin editor

**Status:** Draft

## Problem Statement
Points have to come from somewhere, and from two places at once: a file in
the repo so the game has content on a fresh install, and an in-app editor so
an admin standing in a park can mark a point where they are rather than
guessing coordinates off a map. Points created in the field must survive a
restart, or the editor is a demo rather than a tool. Solved progress must
*not* survive, so the same route can be walked again.

## Proposed Change
A pure merge function plus one adapter.

`src/domain/points.ts`:
- `mergePoints(seed: EscapePoint[], stored: EscapePoint[]): EscapePoint[]` —
  every seed point, overridden by a stored point with the same `id`, plus
  stored points whose `id` is not in the seed. Result sorted by `id` so the
  order is deterministic.

`src/adapters/pointStore.ts` — the only module that touches device storage.
It is a factory over a minimal key-value interface rather than a pair of free
functions, so tests pass an in-memory fake and production passes AsyncStorage:

- `createPointStore(storage: KeyValueStore): PointStore`
- `PointStore.loadStoredPoints(): Promise<EscapePoint[]>`
- `PointStore.saveStoredPoints(points: EscapePoint[]): Promise<void>`

`KeyValueStore` is `{ getItem(key): Promise<string | null>; setItem(key, value): Promise<void> }`
— the subset of AsyncStorage this adapter needs. Depending on the subset
rather than the package means the tests do not need AsyncStorage installed,
which matters because `specs/tech-stack.md` defers installing it until the
code that uses it is written.

An earlier version of this spec named the two functions as free exports with
no storage argument. That cannot be tested against a fake without mocking the
AsyncStorage module, which would have forced the package to be installed for
the sake of the tests alone.

`src/data/points.json` holds the seed. Solved state is never written by
either function: it lives only in `GameState`, in memory.

## Acceptance Criteria

Throughout, `SEED_A` is `{ id: "p1", name: "Puisto", coordinates: { latitude: 60.1699, longitude: 24.9384 }, radiusMeters: 20 }`.

### AC1: With nothing stored, the seed is the whole list
**Given** `seed = [SEED_A]` and `stored = []`
**When** `mergePoints(seed, stored)` is called
**Then** it returns `[SEED_A]`

### AC2: A stored point with a new id is added
**Given** `seed = [SEED_A]` and `stored = [{ id: "p2", name: "Kentta", coordinates: { latitude: 60.1710, longitude: 24.9400 }, radiusMeters: 20 }]`
**When** `mergePoints(seed, stored)` is called
**Then** it returns both points, ordered `["p1", "p2"]` by `id`

### AC3: A stored point overrides a seed point with the same id
**Given** `seed = [SEED_A]` and `stored = [{ id: "p1", name: "Siirretty", coordinates: { latitude: 60.1800, longitude: 24.9384 }, radiusMeters: 30 }]`
**When** `mergePoints(seed, stored)` is called
**Then** it returns exactly one point, with `name: "Siirretty"`, `radiusMeters: 30` and `latitude: 60.1800`

### AC4: Two empty lists produce an empty list
**Given** `seed = []` and `stored = []`
**When** `mergePoints(seed, stored)` is called
**Then** it returns `[]`

### AC5: The result is sorted by id regardless of input order
**Given** `seed = []` and `stored` containing ids in the order `["p3", "p1", "p2"]`
**When** `mergePoints(seed, stored)` is called
**Then** the returned ids are `["p1", "p2", "p3"]`

### AC6: Merging does not mutate its inputs
**Given** any `seed` and `stored`
**When** `mergePoints` is called
**Then** both argument arrays are deep-equal to what they were before the call

### AC7: A saved point is returned by the next load
**Given** an empty store
**When** `saveStoredPoints([SEED_A])` resolves and `loadStoredPoints()` is then called
**Then** it resolves to `[SEED_A]`

### AC8: An empty store loads as an empty list, not an error
**Given** a store that has never been written
**When** `loadStoredPoints()` is called
**Then** it resolves to `[]` and nothing is thrown

### AC9: Unreadable stored data loads as an empty list
**Given** a store whose contents are the string `not json`
**When** `loadStoredPoints()` is called
**Then** it resolves to `[]` and nothing is thrown — a corrupt store falls back to the seed rather than crashing the app

### AC10: Solved progress is never written to the store
**Given** a point has been solved and `saveStoredPoints` has been called
**When** the stored payload is inspected
**Then** no key named `solved` appears anywhere in it

## Files to Modify
| File | Change |
|---|---|
| `src/domain/points.ts` | New. `mergePoints` |
| `src/domain/points.test.ts` | New. AC1–AC6 |
| `src/adapters/pointStore.ts` | New. `KeyValueStore`, `createPointStore`, and the corrupt-data fallback |
| `src/adapters/pointStore.test.ts` | New. AC7–AC10 against an in-memory fake of the storage API |
| `src/data/points.json` | New. The seed point for the demo location |

## Risk
- **What could break:** a bad merge silently hides a point, which in the
  field looks like broken GPS rather than a data problem. AC3 and AC5 pin it.
- **The seed file will contain a real location** once the demo spot is
  chosen. That is a coordinate of a public place, not a person, and the repo
  is public — worth a deliberate choice of somewhere neutral.
- **Rollback:** delete the four source files; the game falls back to reading
  `points.json` alone, since `mergePoints([], seed)` and `mergePoints(seed, [])`
  both return the seed.

## Testing Strategy (MANDATORY)
| Function | Case | Given | When | Then |
|---|---|---|---|---|
| `mergePoints` | happy path | seed with one point, nothing stored | called | the seed list (AC1) |
| `mergePoints` | happy path | stored point with a new id | called | both, ordered by id (AC2) |
| `mergePoints` | edge case | stored point reusing a seed id | called | one point, stored values win (AC3) |
| `mergePoints` | boundary | both lists empty | called | `[]` (AC4) |
| `mergePoints` | edge case | ids out of order | called | sorted `["p1","p2","p3"]` (AC5) |
| `mergePoints` | property | any inputs | called | arguments unmutated (AC6) |
| `loadStoredPoints` | happy path | a point was saved | called after save | that point (AC7) |
| `loadStoredPoints` | edge case | store never written | called | `[]`, no throw (AC8) |
| `loadStoredPoints` | error case | store holds `not json` | called | `[]`, no throw (AC9) |
| `saveStoredPoints` | happy path | two points | called | the store holds both, ids preserved |
| `saveStoredPoints` | error case | a solved point in memory | called | payload contains no `solved` key (AC10) |

## Spec Readiness checklist
- [x] Every AC has a precise expected value — no "works correctly"
- [x] Another person could write a test from each AC without asking
- [x] Every AC can fail — one that cannot fail proves nothing
- [x] Error and edge cases have ACs of their own
- [x] Every AC appears in the testing strategy table
