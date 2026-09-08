# UI and UX

**Status:** Draft
**Scope:** MVP1

## The whole app is two screens

| Screen | Shown when | Contains |
|---|---|---|
| Map | `MAP`, `NEAR` | Map, point markers, attribution, and in `NEAR` the button to open the puzzle |
| Camera | `PUZZLE`, `SOLVED` | Camera, the puzzle panel, and the reset control once solved |

The camera screen is the same screen on both platforms and shows the same
text. On a phone the panel is anchored in the world; on web it is a heads-up
overlay fixed to the screen. Nothing else about it differs, and no string
below is platform-specific.

There is no navigation stack, no tab bar and no menu. The state decides the
screen; the player never chooses one.

## Every string the player sees

Finnish, per the AGENTS.md convention. These are the exact values the
acceptance criteria assert, so they are settled here and nowhere else.

| Where | Text |
|---|---|
| Button, `NEAR` | `Avaa tehtävä` |
| Panel, `PUZZLE` | `5 + 2 = ?` — the pattern is `{left} + {right} = ?` |
| Panel, `SOLVED` | `Oikein! Laatikko aukesi.` |
| Camera denied | `Kamera tarvitaan tehtävän avaamiseen.` |
| Reset control | `Aloita alusta` |
| Map attribution | `© OpenMapTiles Data from OpenStreetMap` |

Nothing is written for a wrong answer. The input simply empties, which is
feedback enough and avoids a scolding tone in a game meant to be fun.

## The panel

One anchored object, stacked top to bottom:

```
  ┌─────────────────────┐
  │      5 + 2 = ?      │   puzzle text
  │         12          │   input display
  ├─────┬─────┬─────────┤
  │  1  │  2  │    3    │
  │  4  │  5  │    6    │   keypad
  │  7  │  8  │    9    │
  │  C  │  0  │   OK    │
  └─────┴─────┴─────────┘
```

Twelve keys in a 3 x 4 grid. `C` clears, `OK` submits. The layout is the
telephone arrangement, because that is what a phone keypad looks like and the
player should not have to read it.

## Sizing, and why it is a rule rather than a preference

This panel is used at arm's length, outdoors, by someone whose hand is not
steady. So:

- On a phone the panel is a Viro object measured in metres, so every key is at
  least **0.06 m** on a panel no further than **0.7 m** away — about 5 degrees
  of angular size. This is `ar-panel.md` AC15
- On web the panel is ordinary React Native views measured in points, so every
  key is at least **48 x 48 points**. Same intent, different unit, because the
  two renderers measure different things
- Puzzle text and input display are large enough to read past arm's length —
  at least **32 points**
- The attribution is the one small thing on screen, and it still has a floor:
  at least **11 points** at **0.8 opacity**, per `map-view.md` AC4

## Reading it in sunlight

The panel sits over a live camera feed, which may be anything from dark asphalt
to bright sky. So it does not rely on the background: an opaque panel, dark
text on a light surface, and no thin type. Colour never carries meaning on its
own — the state is always readable from the text.

## What the player can and cannot do

They walk, they look, they press keys. They cannot pan to a point they have
not walked to, edit a puzzle, skip one, or see an answer. Solving is the only
way forward, and `Aloita alusta` is the only way back.

## Admin

The point editor is a plain list with an add control that reads the current
GPS position. It is not designed, protected or polished — it exists so points
can be placed while standing on them. If the week runs short it is the first
thing cut, per the PRD, and none of the above changes when it goes.
