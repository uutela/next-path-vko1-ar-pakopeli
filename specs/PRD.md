# PRD — AR Pakopeli

**Status:** Draft
**Scope:** MVP1, week 1

## Goal

A location-based escape game. A player walks to a physical point shown on a
map. Within 20 metres the phone opens an AR view, where a panel anchored in
the world shows an arithmetic puzzle and a keypad. Entering the correct
answer opens the panel with a congratulation and a fanfare.

MVP1 is done when that walk-through works **outdoors, on a real phone, with
real GPS** — one point, one puzzle, start to finish, without a developer
touching the device.

This repo is the product, not a library. Later projects copy from it rather
than import it, so the code is optimised to read well as an example.

## Users

| User | What they do | What they need |
|---|---|---|
| **Player** | Walks to the point, solves the puzzle | A map that shows where to go, a clear signal when close enough, a panel that is readable and pressable outdoors |
| **Admin** | Decides where points are and what they ask | To place a point at their current location while standing there, and to seed points from a file in the repo |

No accounts. Both roles run on the same device; the admin view is not
protected.

## Decisions

**Platforms.** iOS and Android are the product. Web is a bonus and will not
have anchored AR — React Native Web cannot do it. Everything else works on
web.

**AR.** The panel is anchored in the world, not a camera overlay. The puzzle
text and the number keys are one object; pressing a key means touching the
screen where the key appears.

**Map.** `@maplibre/maplibre-react-native` on native, `maplibre-gl` with
`react-map-gl` on web. Tiles from OpenFreeMap (Liberty style): no API key,
no registration, no request limits, commercial use permitted. Attribution
`© OpenMapTiles` and `Data from OpenStreetMap` is mandatory and must be
visible on the map. The style URL lives in one shared constant so switching
to self-hosted tiles stays a one-line change.

**Licensing.** Every dependency must be free and permissively licensed —
MIT or BSD — with no obligation to publish source and no barrier to
commercial use. The fanfare sidesteps the question entirely: it is
synthesised by a script in this repo rather than sourced from anywhere, so
the audio is our own work. This constraint outranks convenience.

**Trigger.** A point activates at **20 metres**, chosen to tolerate GPS
drift outdoors rather than to be precise.

**Puzzle.** Addition of two operands, each 1–9, so the answer is 2–18. The
operands are drawn randomly per attempt. Randomness is injected —
`generatePuzzle(rng: () => number)` — so the function stays pure and every
acceptance criterion can state an exact expected value.

**Success.** The panel text is replaced by a congratulation and a fanfare
plays.

**State.** Points persist on the device; an admin who marks a point in the
field still has it after a restart. Solved progress does **not** persist —
a restart returns every point to unsolved. A reset button does the same
without restarting, so the route can be walked repeatedly during a demo.

**Architecture.** GPS, camera and point storage each sit behind their own
adapter. The game is a state machine — `MAP → NEAR → PUZZLE → SOLVED` — and
distance, transition and answer checking are pure functions of their inputs.
The whole of the game logic is therefore testable with no phone, no GPS and
no camera; mocked location is a development and testing tool, never the demo.

**If the week runs short**, the in-app editor is cut first and points come
from the file alone. Anchored AR survives.

## Non-goals

Explicitly out of scope for MVP1. None of these is a missing feature.

- **No accounts, no login, no roles.** The admin view is open.
- **No backend, no server, no network calls** other than map tiles.
- **No multiplayer**, no shared or synchronised state between devices.
- **No scoring, timing or leaderboards.**
- **No navigation** to the point — the map shows where it is, nothing routes
  the player there.
- **No offline maps.** Tiles require a connection.
- **No anti-cheat.** A player can walk away and come back, or read the code.
- **No persisted progress.** See Decisions.
- **No 3D models or scene content** beyond the puzzle panel itself.
- **No anchored AR on web.**
- **No analytics, telemetry or crash reporting.** The player's location never
  leaves the device.
- **One point and one puzzle only.** Multiple points, sequenced courses and
  puzzle types other than addition are deliberately deferred.
