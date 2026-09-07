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
