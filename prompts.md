# prompts.md

Every prompt of this project in order, as part of the next-path week 1
exercise. Prompts are recorded as they were actually sent.

---

## Step 0 — harness

No prompt. `AGENTS.md`, `CLAUDE.md` and `specs/TEMPLATE.md` were created
directly. `specs/TEMPLATE.md` and the project-specific lines of
`AGENTS.md` were finished during the session (see step 2b).

---

## Step 1 — research, no code, no spec

> Run the `research` workflow from @AGENTS.md — read-only, no code, no spec.
>
> Task: Tehdään MVP-toteutus mun toisia projekteja varten Augmented Reality
> Pakopelistä. Toive tämän takia (toivottavasti ei rajaa liikaa => saat
> ehdottaa muutakin): - React native ios ja android + jos mahdollista jonkin
> react native web versio. Käytetään vain ilmaisia ja lisenssiltään meille
> sopivia kirjastoja yms. Haluan, että tätä voi tarvittaessa käyttää myös
> kaupalliseen tarkoitukseen ja ettei lähdekoodia ole pakko julkaista vaikka
> next-path -kurssissa se onkin avoimessa repossa. Haluaisin systeemin, jossa
> meillä on kartta, jossa näkyy piste meidän määrittelemässä paikassa. Siihen
> olisi hyvä olla jonkinlainen ylläpito että missä pisteitä on. Kun tulee
> pisteen lähelle pitää saada jotenkin kamera päälle ja siellä pitää näkyä
> AR-kamerassa boksi, jossa on näytössä tekstiä ja alla numeronäppäimistö
> jolla voi syöttää numeroita ja enter, jolla voi kokeilla onko koodi oikein.
> Meidän tämän viikon MVP1:ssä siinä voi olla helppo yhteensä lasku, kun
> oikean arvon saa syötettyä, niin laatikko aukeaa ja tulee joku onnistumisen
> viesti.
>
> This is a fresh project, so research the problem, not a codebase: the
> simplest approach that could work. Let's think about the tech stack later.
>
> Report: the approach you would take, what to reuse, and what was unclear
> enough that you had to guess. Ask me about the guesses — do not resolve
> them yourself.

The model reported an approach and asked about its guesses instead of
resolving them. Open questions raised: AR level, admin model, web target,
map tile licensing, number of points, persistence, demo location, what
"the box opens" means, and leftover conventions in `AGENTS.md`.

---

## Step 2 — decisions

Answered across several messages rather than one line. Consolidated:

> World-anchored AR, not a camera overlay — accepting that React Native Web
> cannot do it. The keypad is inside the anchored panel and is pressable.
> Points are maintained both as a file in the repo and through an in-app
> editor. Web is a bonus, mobile decides. Map tiles must need no account and
> no API key. This MVP is our product, not a reusable building block — later
> projects copy from this repo rather than import it. One point and one
> puzzle in MVP1. The demo is outdoors on real GPS; mocking is a development
> and testing tool only. If the week runs short, the in-app editor is cut
> first and anchored AR survives. Solving shows a congratulation text and
> plays a fanfare.

### Tech stack proposed by the user, verified and accepted

> - Kirjasto: @maplibre/maplibre-react-native (natiivi) ja maplibre-gl +
>   react-map-gl (web)
> - Tiilet: https://tiles.openfreemap.org/styles/liberty — vektoritiilet
> - OpenFreeMap on ilmainen, ei API-avainta, ei rajoituksia — data OSM:stä

Verified: `@maplibre/maplibre-react-native` MIT, `maplibre-gl` BSD,
`react-map-gl` MIT. OpenFreeMap requires no API key, states no request
limits, and permits commercial use; attribution `© OpenMapTiles` +
`Data from OpenStreetMap` is mandatory. No SLA — single operator, donation
funded; self-hosting is the escape hatch and the style URL is kept in one
place so switching stays a one-line change.

An earlier suggestion of CARTO was rejected: its tile service requires an
API key and a commercial agreement, which fails the no-account constraint.
Its *style* is separately licensed (BSD-3 code, CC-BY 4.0 design) and may be
reused with self-hosted tiles.

### Late step 2 decisions

- Trigger radius: **20 m**, to tolerate GPS drift outdoors.
- The arithmetic puzzle is **randomly generated**, not fixed. Randomness is
  injected — `generatePuzzle(rng: () => number)` — so the function stays pure
  and acceptance criteria can state a precise expected value.
- Difficulty: **two operands, each 1–9**, so the answer is 2–18.

### Step 2b — harness finished during the session

`specs/TEMPLATE.md` was created, plus a `Status: Draft | In Progress | Done`
field so the `develop` workflow has somewhere to record status.

`AGENTS.md` was written for a different project ("briefing", git log,
calendar, notes). Those leftovers were removed and replaced:

- `Interfaces for every data structure; type only for unions`
- `Each source (GPS, camera, point storage) lives behind its own adapter …`
- `User-facing text is Finnish; identifiers, comments and commit messages
  are English`
- Guardrail: `The player's location never leaves the device — no analytics,
  no remote logging, no third party`

`What this is` was rewritten: the earlier text called this a building block
for other projects, which the step 2 decisions had reversed.

---

## Step 3 — PRD

> Write the PRD in specs/PRD.md: goal, users, the decisions I just made, and
> explicit non-goals. One page. Do not use the feature template yet.

Written as `specs/PRD.md`. No new decisions were introduced — the document
only records what steps 1 and 2 settled, and states the non-goals explicitly
so that later feature specs cannot quietly expand the scope.

---

## Step 4 — feature specs

> Write the spec for the features of the app.
>
> Ground it in the research pass findings and specs/PRD.md. Write
> specs/features/«feature».md for each feature using specs/TEMPLATE.md.
>
> Acceptance criteria as Given/When/Then, numbered AC1, AC2, …
> Every one names a precise expected value or output — never "a sensible
> message", never "works correctly".
>
> Then run the Spec Readiness checklist and show the result item by item.

Six specs in `specs/features/`, split along the architecture: three pure
domain features (`proximity`, `puzzle`, `game-state`), one storage feature
(`points-store`) and two views (`map-view`, `ar-panel`). 67 acceptance
criteria and 77 test rows.

The haversine values in `proximity.md` were computed before writing, not
estimated, so `60.1700798643` is provably 20.000000 m from the reference
point.

One question was left open in `ar-panel.md` rather than resolved silently:
the keypad had no clear key, so a mistyped digit could only be recovered by
spending a wrong answer.

### Decision

> tehdään c-näppäin

The keypad is now twelve keys — `0`–`9`, `C` and `OK`. `CLEAR` was added to
`GameEvent`; `ar-panel.md` gained AC13 and AC14, and `game-state.md` gained
AC15, which pins that clearing keeps the same operands rather than drawing a
fresh puzzle.

### Fanfare

> voisiko fanfare olla joku tietokoneellsiesti generoit wav, jonka teet?

Yes, and it is the better answer: a synthesised asset has no third-party
licence at all, rather than a permissive one that has to be verified and
recorded. `scripts/generate-fanfare.mjs` writes `assets/fanfare.wav` from a
score held in source — C–E–G rising, then a held C major chord, 1.45 s, mono
44.1 kHz 16-bit PCM, no dependencies.

Checked before use: peak 0.8900 with no clipped samples, DC offset 0.000001,
and both the first and last sample exactly 0 so it neither clicks in nor out.

`specs/features/ar-panel.md` and `specs/PRD.md` were updated: the fanfare is
no longer listed as a licence risk, because it no longer is one.

### Readiness exercise: find a criterion that only promises "it works"

The step 4 instructions end with a task for the human: find an acceptance
criterion that says "correct", "sensible" or "works", and rewrite it with a
precise, measurable value. The first search was too narrow — it looked for
exact phrases like "works correctly" and found nothing but the checklist line
itself. Searching for vague *promises* rather than vague *words* found three.

**1. `map-view.md` AC4** — "exactly one node with that text is present and it
is **not hidden**". A test cannot branch on "not hidden". Now: the node's
computed `fontSize` is at least 11, its `opacity` at least 0.8, and its
`display` is not `none`.

**2. `map-view.md` AC6** — "zero markers are present, **the map itself still
renders**". Now: the map container is present with a measured width and
height both greater than 0.

**3. `ar-panel.md`** — the best find, because it was not a weak AC but a
missing one. "Whether the keys are large enough to hit at arm's length" sat in
the Risk section as a field-only concern, which in practice means nobody
checks it until the demo — and a touch target too small to hit outdoors, with
a shaking hand in bright sun, is exactly how an AR demo fails. "Large enough"
also has a settled measurable value. It is now AC15: every one of the twelve
keys has a touch target of at least 48 x 48 points, and adjacent key centres
are at least 56 points apart. The risk section records that key size was moved
from the field onto the desk.

Specs now hold 68 acceptance criteria across six files.
