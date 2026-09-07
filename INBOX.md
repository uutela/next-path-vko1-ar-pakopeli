# INBOX

One line per thing noticed while working. Not implemented, not detoured into.

- ~~RESOLVED~~ `proximity.md` AC6 claimed to pin the inclusive boundary ("standing exactly
  on the radius counts as inside"), but its coordinate measures 19.999997645 m
  against a 20 m radius, so the test passes with `<` as well as `<=`. The
  criterion did not prove what it said it proved. Resolved by correcting the
  spec first: the inclusivity claim was dropped and the criterion now states
  what its coordinate actually tests, with the exact-boundary behaviour left
  explicitly unspecified.
- ~~RESOLVED~~ `checkAnswer` used `parseInt`, which stops at the first non-digit, so
  `"7abc"`, `"7.9"`, `"+7"` and `"7e0"` all count as 7. No criterion covers
  these and the keypad cannot produce them — `appendDigit` only ever appends
  `0`-`9`. Resolved by hardening rather than closing: the spec gained AC13
  first, then the tests, then the implementation. The reason is the PRD —
  later projects read this repo as an example, and a domain function that
  silently accepts `"7abc"` is a worse example than one that does not.
- `loadStoredPoints` guards against unparseable JSON (AC9) and against JSON
  that is not an array, but not against an array of the wrong shape:
  `[{"foo":1}]` and `[null]` are returned as if they were points. Probed by
  running each input. Only this app writes the key, so the shape can only be
  wrong if a future version changes it — which is exactly when it would hurt.
  Fixing it means a validating criterion in `points-store.md` first.
- The map has no `Camera`, so it does not centre on the player or on any
  point. No criterion in `map-view.md` asks for centring, so it was left out
  under the smallest-implementation rule — but a map that never centres is not
  usable in the field. Needs a criterion before it is added.
- ~~RESOLVED~~ `ArScreen` built the AR scene as a closure — `const scene = () => <ViroARScene><PuzzlePanel …/></ViroARScene>`
  — and Viro is given it once through `initialScene`. If Viro calls it only at
  mount, the panel would keep the props it captured then, and the typed input
  would never update on screen. No criterion covers the panel *inside* the AR
  scene (every panel criterion renders `PuzzlePanel` directly), so nothing
  catches this. **Confirmed from Viro's source, not left as a hypothesis:**
  `initialScene` is stored in the constructor and never re-read, while
  `viroAppProps` is refreshed every render by Viro's own admission. Resolved by
  a full cycle — `ar-panel.md` gained AC16, the test reproduces both behaviours
  so a frozen closure cannot hide, and `PuzzleScene` is now a module-level
  component fed through `viroAppProps`.
- The web map loads its data but paints nothing. Probed: four requests to
  `tiles.openfreemap.org` (style, planet, sprites) all succeed, zero failed
  requests, and the canvas is 1280x664 with class `maplibregl-canvas` — but
  `maplibre-gl`'s stylesheet is **not present** in the document. `Map.web.tsx`
  says in its own comment that the web build "must also load maplibre-gl's
  stylesheet … in the HTML shell", and nothing ever did. Same shape as the
  `ArScreen.web.tsx` omission: an obligation written down and not enforced by
  any criterion.
- **`@reactvision/react-viro` and `@maplibre/maplibre-react-native` cannot both
  be prebuilt.** Verified by isolation: MapLibre alone succeeds, Viro alone
  succeeds, both together fail in either plugin order with
  `[ios.podfile]: withIosPodfileBaseMod: Failed to match "/post_install do
  \|installer\|/"`. Viro's iOS plugin writes the Podfile directly through
  `withDangerousMod` and `fs.writeFile`, while MapLibre's operates on Expo's
  managed Podfile contents; MapLibre then sees a Podfile with no `post_install`
  block. This blocks every native build, so the AR half has never run. It
  touches a PRD decision — anchored AR *and* a MapLibre map — so it is a
  decision, not a bug fix.
