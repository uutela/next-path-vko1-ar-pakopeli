# Feature: Map view

**Status:** Draft

## Problem Statement
The player needs to see where the point is before walking to it. The map must
work on iOS, Android and web from one set of decisions, must need no API key
or account, and must carry the attribution the tile licence requires — an
attribution that is missing is a licence breach, not a cosmetic bug.

## Proposed Change
One shared configuration module and two platform implementations resolved by
React Native's platform extensions:

- `src/config/map.ts` — the single source of the style URL and the
  attribution string. Nothing else in the app hard-codes either
- `src/ui/Map.tsx` — native, using `@maplibre/maplibre-react-native`
- `src/ui/Map.web.tsx` — web, using `maplibre-gl` with `react-map-gl`

Both render one marker per point and centre on the player. Both import the
style URL from `src/config/map.ts`; neither declares its own.

## Acceptance Criteria

### AC1: The style URL is defined exactly once
**Given** the source tree
**When** it is searched for the string `tiles.openfreemap.org`
**Then** the only match is in `src/config/map.ts`, and its exported value is `https://tiles.openfreemap.org/styles/liberty`

### AC2: Both platform maps read the shared constant
**Given** `src/ui/Map.tsx` and `src/ui/Map.web.tsx`
**When** their imports are inspected
**Then** both import `MAP_STYLE_URL` from `src/config/map.ts`

### AC3: The attribution string is exactly as the licence requires
**Given** `src/config/map.ts`
**When** the exported `MAP_ATTRIBUTION` is read
**Then** it is exactly `© OpenMapTiles Data from OpenStreetMap`

### AC4: The attribution is visible on the map
**Given** the map view rendered with one point
**When** the rendered output is queried for the text `© OpenMapTiles Data from OpenStreetMap`
**Then** exactly one node with that text is present and it is not hidden

### AC5: One marker is rendered per point
**Given** the map view rendered with `points = [SEED_A, SEED_B]`
**When** the rendered output is queried for markers
**Then** exactly two markers are present, at the coordinates of `SEED_A` and `SEED_B`

### AC6: An empty point list renders a map with no markers
**Given** the map view rendered with `points = []`
**When** the rendered output is queried for markers
**Then** zero markers are present, the map itself still renders, and nothing is thrown

### AC7: No API key is present anywhere
**Given** the source tree
**When** it is searched for `apiKey`, `api_key`, `access_token` and `accessToken`
**Then** there are no matches

## Files to Modify
| File | Change |
|---|---|
| `src/config/map.ts` | New. `MAP_STYLE_URL` and `MAP_ATTRIBUTION`, exported as `const` |
| `src/ui/Map.tsx` | New. Native map with markers and attribution |
| `src/ui/Map.web.tsx` | New. Web map, same props, same constants |
| `src/ui/Map.test.tsx` | New. AC4–AC6 against the rendered output |
| `src/config/map.test.ts` | New. AC1, AC3 and AC7 as source-level assertions |

## Risk
- **What could break:** an attribution that renders off-screen or behind
  another view still counts as missing. AC4 checks presence, not position —
  a human has to confirm it is actually legible on the phone.
- **OpenFreeMap has no SLA.** If the tile host is down the map is blank and
  the game is unusable. AC1 exists so that switching to self-hosted tiles is
  a one-line change rather than a hunt.
- **The web and native map libraries are different implementations** of the
  same style spec; they can diverge in rendering. Web is a bonus target, so a
  visual difference there is not a blocker.
- **Rollback:** delete the two `Map` files. The game cannot be played without
  a map, so there is no partial fallback — this is all or nothing.

## Testing Strategy (MANDATORY)
| Function | Case | Given | When | Then |
|---|---|---|---|---|
| `MAP_STYLE_URL` | happy path | the config module | read | equals the OpenFreeMap Liberty URL (AC1) |
| source tree | happy path | all files | searched for `tiles.openfreemap.org` | one match, in `src/config/map.ts` (AC1) |
| source tree | happy path | both Map files | imports inspected | both import `MAP_STYLE_URL` (AC2) |
| `MAP_ATTRIBUTION` | happy path | the config module | read | exactly `© OpenMapTiles Data from OpenStreetMap` (AC3) |
| `Map` | happy path | one point | rendered | attribution text present exactly once (AC4) |
| `Map` | happy path | two points | rendered | two markers at the given coordinates (AC5) |
| `Map` | boundary | zero points | rendered | zero markers, map renders, no throw (AC6) |
| source tree | error case | all files | searched for key and token names | no matches (AC7) |

## Spec Readiness checklist
- [x] Every AC has a precise expected value — no "works correctly"
- [x] Another person could write a test from each AC without asking
- [x] Every AC can fail — one that cannot fail proves nothing
- [x] Error and edge cases have ACs of their own
- [x] Every AC appears in the testing strategy table
