# prompts.md

Every message from the user that drove this project, in order and verbatim,
as part of the next-path week 1 exercise. Answers chosen from a multiple
choice prompt are marked as selections rather than typed text. A `→` line
after each entry records what it changed.

Course-step prompts are quoted in full. Nothing here is paraphrased.

The assistant's own replies are not reproduced — this is a record of what
drove the work, not a transcript. Several messages below are answers to a
question that is therefore invisible, so those carry an *In reply to* line
naming the question they settle.

---

## Before the work — establishing which rules apply

### 1
> Moi. Kenenn kanssa juttelen?

→ The global `~/.claude/CLAUDE.md` on this machine defines an orchestrator
persona and a team of named subagents. This repo's `CLAUDE.md` overrides all
of it, so the answer was: no persona, no delegation, and the AGENTS.md
workflows are the operating model here.

### 2
*In reply to: the explanation that this repo overrides the global orchestrator persona, and that the AGENTS.md workflows apply instead*

> Kiitos, kunhan tsekkasin :)

---

## Step 1 — research, no code, no spec

### 3
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

→ Findings reported and every guess raised as a question instead of being
resolved: AR level, admin model, web target, map tile licensing, number of
points, persistence, demo location, what "the box opens" means, and leftover
conventions in `AGENTS.md` that belonged to a different project.

---

## Step 2 — decisions

### 4 — selections
> Mitä "AR" tarkoittaa MVP1:ssä?
> **Haluan tuon vaihtoehdon 2 vaikka se ei varmaan ole mahdollinen react
> native web-toteutuksessa**
>
> Miten pisteitä ylläpidetään MVP1:ssä? — **Molemmat**
>
> Onko web-versio oikea vaatimus vai bonus? — **Bonus — mobiili ratkaisee**
>
> Saako karttalaatat hakea ilmaisen tason pilvipalvelusta, joka vaatii tilin
> ja API-avaimen? — **OSM pitäisi olla ok eikä tarvii tiliä tai API-avainta**

→ World-anchored AR chosen over a camera overlay, accepting that React Native
Web cannot do it. The OSM answer contained a conflict worth raising rather
than resolving: OSM *data* is free, but the OSM Foundation's tile server
forbids app use, so "OSM without an account" does not by itself name a tile
source.

### 5
*In reply to: "Ankkuroidaanko numeronäppäimistö myös 3D-tilaan, vai pysyykö se ruudulla?"*

> Numeronäppäimet ovat laatikkossa ja niitä voi painaa :)

→ The panel and keypad are one anchored object; pressing means touching the
screen where the key appears. An earlier caution about 3D hit-testing being
awkward was withdrawn — this is the ordinary pattern in AR toolkits.

### 6
> ja tämä MVP on silti nyt meidän tuote. Enemmän tätä käytettäisiin et kato
> tästä reposta mallia, kuin että tarvii olla joku uudelleen käytettävä
> palikka

→ A correction to the research report, which had claimed the most important
user was "you in later projects" and that the pipeline should be isolated for
reuse. Reversed: optimise for readability as an example, not extensibility.
No plugin architecture, no package boundaries, no abstractions the MVP does
not need itself.

### 7
> Leaflet ja carto?

→ Verified rather than answered from memory. Leaflet is BSD-2 and fine, but
needs a WebView in React Native, and it is a map *library*, not a tile source.
CARTO fails the no-account constraint: its docs describe a free API key with a
5M request fair-use limit and a commercial agreement above it, while its own
`basemap-styles` repo is stricter — "access to CARTO's basemap tile services
is restricted to CARTO enterprise customers and Non-Profit GRANTS only". Its
*style* is separately licensed (BSD-3 code, CC-BY 4.0 design) and may be
reused with self-hosted tiles.

### 8
> muistin vasta että carto nykyään vaatii avaimen. Miten olisi:
> - Kirjasto: @maplibre/maplibre-react-native (natiivi) ja maplibre-gl +
>   react-map-gl (web)
> - Tiilet: https://tiles.openfreemap.org/styles/liberty — vektoritiilet,
>   Map.tsx:13 ja Map.web.tsx:16
> - OpenFreeMap on ilmainen, ei API-avainta, ei rajoituksia — data OSM:stä

→ Accepted after verification, and better than anything proposed before it.
`@maplibre/maplibre-react-native` MIT, `maplibre-gl` BSD, `react-map-gl` MIT
with first-class MapLibre support via `react-map-gl/maplibre`. OpenFreeMap
confirmed: no API key, no registration, no request limits, commercial use
explicitly permitted, MIT software, OSM data. Attribution `© OpenMapTiles` +
`Data from OpenStreetMap` is mandatory. The one caveat found and recorded: a
single operator, donation funded, explicitly no SLA — so the style URL is kept
in one shared constant, making a switch to self-hosted tiles a one-line change.

### 9
> joo, unohda tiedostot.. Oli copy paste sielät mistä myöhemmin halutaan tätä
> protoa hyväksikäyttää :)

→ `Map.tsx:13` and `Map.web.tsx:16` referred to another project, not this
repo, which had no source files at all.

### 10 — selections
> Missä tätä testataan ja demotaan? — *Sisällä valesijainnilla*
>
> Jos viikko loppuu kesken, mistä tingitään ensin? — **Sovelluksen editori
> putoaa**
>
> Montako pistettä ja tehtävää MVP1:ssä? — **Yksi piste, yksi tehtävä**

### 11
*In reply to: "Onko sinulla toinen repo, josta nuo Map.tsx / Map.web.tsx ovat?" — listed as open question 1*

> unohda kysymyksen 1 jutut.. ei katsota sinne

### 12
> demotaan ulkona oikealla gps:llä.. mut sinä voi mockata sitä tai käyttää
> jotain kirjastoja testaukseen

→ Overrides the selection in 10. The demo runs outdoors on real GPS; mocking
is a development and testing tool, never the demo. This raised two field-only
risks that no desk test can cover: GPS drift against the radius, and ARKit /
ARCore surface tracking in bright sun on plain asphalt or grass.

### 13
*In reply to: two open questions: (1) does solved progress survive a restart, and (2) what "the box opens" means visually*

> 2. teksti vaihtuu onnittelutekstiksi ja joku fanfaari soi.. mitä itse olet
> mieltä kohdasta 1?

→ Success behaviour settled. On persistence, the recommendation given was that
the question is really two: solved progress should **not** persist, because
solving a point during a field test would leave it solved for the demo; points
created in the editor **must** persist, or the editor is a demo rather than a
tool. A reset button is worth more than persistence for a repeated walk-through.

---

## Step 2b — the harness, finished mid-session

### 14
> Aijoo, tehdään tollainen specs template: specs/TEMPLATE.md. Speksin pohja.
> Tekoäly täyttää sen askeleessa 4.
>
> *(followed by the full template text from the course)*

→ Written verbatim. One gap flagged rather than silently fixed: `AGENTS.md`'s
`develop` workflow requires a spec status of Draft → In Progress → Done, but
the template had nowhere to record it.

### 15
> Nää oli turhia tuolla agents.MD:  Each source (git log, calendar, notes, ...)
> lives behind its own adapter returning a plain typed record — collecting,
> ranking and rendering never touch a source directly
> - Ranking ("what matters most today") is a pure function of the
>   collected records: same input, same briefing, no clock or network
>   reads inside it
> - The briefing text the user reads is Finnish; identifiers, comments
>   and commit messages are English

→ Removed as asked. Two of the three carried principles this project actually
relies on, and replacements were offered rather than assumed: the adapter
boundary, and the language rule.

### 16
> ja sit tuolla agents.md:ssä voisi olla coding kohdassa: interfaces for every
> data structure

→ Added. One conflict raised: the game state machine is a discriminated union,
which TypeScript cannot express with `interface`, so the rule as written would
have forbidden the design already agreed.

### 17
*In reply to: the three replacement rules offered after the briefing leftovers were removed — the adapter boundary, the language rule, and `type` for unions*

> ja hei noi ehdotuksesi siis hyvät coding kohtaan

→ All three applied: `Interfaces for every data structure; type only for
unions`, the adapter rule rewritten for GPS, camera and point storage, and
`User-facing text is Finnish; identifiers, comments and commit messages are
English`.

### 18
*In reply to: "Sanotko ok, niin siivoan ne samalla" — cleaning the same leftovers out of the Guardrails section*

> ok

→ Guardrails cleaned of the same leftovers and replaced with one rule that
matters here: `The player's location never leaves the device — no analytics,
no remote logging, no third party`.

### 19
> arvo satunnaisesti jos siihen saat jonkun funktion.. ei liian vaikea :)

→ Random puzzle generation. The design point raised: randomness must be
injected — `generatePuzzle(rng: () => number)` — or the function is impure and
no acceptance criterion could ever state an exact expected value.

### 20
*In reply to: "puuttuu enää laukaisusäde metreinä — suositukseni 20–30 m"*

> 20m ok

→ Trigger radius 20 m, sized for GPS drift rather than precision.

### 21
*In reply to: "Kaksi lukua väliltä 1–9, vastaus siis 2–18. Käykö se?"*

> sopii

→ Difficulty: two operands, each 1–9, so the answer is 2–18.

### 22
*In reply to: a request to read "What this is" and put it in your own words, since the course asks for that section specifically*

> what this is osio on nyt hyvä

→ `AGENTS.md`'s "What this is" had been left saying this repo was a building
block for other projects, which message 6 had reversed. Rewritten to say what
the app does, for whom, and what "working" means: outdoors, on a real phone,
with real GPS, one point, one puzzle, end to end.

### 23
> pitäisikö tehdä commit

### 24
*In reply to: three proposals: `git init`, a `.gitignore` written before any dependency exists, and the first commit*

> Nämä ok.. ja saa olla public myös mun uutela githubissa

→ `git init`, a `.gitignore` written before any dependency existed so
`node_modules` could never enter history, first commit, and a public repo at
github.com/uutela/next-path-vko1-ar-pakopeli.

---

## Step 3 — PRD

### 25
> Askel 3: Eli mun prompti sulle: Write the PRD in specs/PRD.md: goal, users,
> the decisions I just made, and explicit non-goals. One page. Do not use the
> feature template yet.

→ `specs/PRD.md`. No new decisions introduced; twelve non-goals stated
explicitly so later feature specs cannot quietly expand the scope.

### 26
*In reply to: the finished `specs/PRD.md`, offered for review before committing*

> PRD OK.. tee commit ja push

### 27
> Ollaan nyt mielesteäni tehty tämä steppi: 3) Vaatimusdokumentti eli PRD,
> yksi sivu (10 min) *(followed by the course material for step 3)*

→ Confirmed done. The course's warning — that the model tried to bring the
non-goals back in step 5 — was noted in advance, with the four most likely
returns named: a backend, a PIN on the admin view, crash reporting, and
persisted progress.

---

## Step 4 — feature specs

### 28
> jes, jatketaan steppiin 4. Tässä minun prompti: Write the spec for the
> features of the app.
>
> Ground it in the research pass findings and specs/PRD.md. Write
> specs/features/«feature».md for each feature using specs/TEMPLATE.md.
>
> Acceptance criteria as Given/When/Then, numbered AC1, AC2, …
> Every one names a precise expected value or output — never "a sensible
> message", never "works correctly".
>
> Then run the Spec Readiness checklist and show the result item by item.

→ Six specs split along the architecture: three pure domain features
(`proximity`, `puzzle`, `game-state`), one storage feature (`points-store`)
and two views (`map-view`, `ar-panel`). The haversine values in
`proximity.md` were computed before writing rather than estimated, so
`60.1700798643` is provably 20.000000 m from the reference point. One question
was left open rather than resolved silently: the keypad had no clear key, so a
mistyped digit could only be recovered by spending a wrong answer.

### 29
*In reply to: the open question in `ar-panel.md`: the keypad had no clear key, so a mistyped digit could only be recovered by spending a wrong answer*

> tehdään c-näppäin

→ Twelve keys: `0`–`9`, `C` and `OK`. `CLEAR` added to `GameEvent`;
`ar-panel.md` gained AC13 and AC14, `game-state.md` gained AC15, which pins
that clearing keeps the same operands rather than drawing a fresh puzzle.

### 30
> voisiko fanfare olla joku tietokoneellsiesti generoit wav, jonka teet?

→ A better answer than sourcing one: a synthesised asset has no third-party
licence at all. `scripts/generate-fanfare.mjs` writes `assets/fanfare.wav`
from a score held in source — C–E–G rising, then a held C major chord, 1.45 s,
mono 44.1 kHz 16-bit PCM, no dependencies. Checked before use: peak 0.8900
with no clipped samples, DC offset 0.000001, first and last sample exactly 0
so it neither clicks in nor out.

### 31
*In reply to: `assets/fanfare.wav`, sent for listening before the specs were updated*

> fanfare.wav ok

### 32
> mielestäni kriteerit ok. Vaikka ei niitä nyt ihan kaikki pystynyt lukemaan.
> Tällainen oli ohje ja siinä on lopussa ohje että pitää etsiä joku kriteeri
> joka on vaikka vain "toimii" ja siihen pitäisi miettiä kunnon mitattava
> arvo. Voitko auttaa sellaisen etsinnässä?
> *(followed by the course material for step 4)*

→ The first search was too narrow: it looked for exact phrases like "works
correctly" and found nothing but the checklist line itself. Searching for
vague **promises** rather than vague **words** found three.

**1. `map-view.md` AC4** — "present and it is **not hidden**". A test cannot
branch on "not hidden". Now: computed `fontSize` at least 11, `opacity` at
least 0.8, `display` not `none`.

**2. `map-view.md` AC6** — "**the map itself still renders**". Now: the map
container is present with a measured width and height both greater than 0.

**3. `ar-panel.md`** — the best find, because it was not a weak criterion but
a missing one. "Whether the keys are large enough to hit at arm's length" sat
in the Risk section as a field-only concern, which in practice means nobody
checks it until the demo — and a touch target too small to hit outdoors, with
a shaking hand in bright sun, is exactly how an AR demo fails. Now AC15: every
one of the twelve keys at least 48 x 48 points, adjacent centres at least 56
points apart.

### 33
> tehdäänkö eka commit + push, sitten tämä muutos ja commit

→ Nothing to commit — the working tree was already clean and pushed.

### 34
> ja sit pitääkö promt.md:hen lisätä jotain tästä miten ollaan työskennelty?

→ Yes; the readiness exercise is part of the step 4 instructions, not a
side note.

### 35
> onko jotain committtoimatta / pushaamatta?

→ Nothing. 14 files on disk, 14 tracked, working tree clean, `main` in sync.

---

## Step 5 — architecture, UI/UX, tech stack, and the scaffold

### 36
> Nyt olisi vaihe 5. Minua vähän jännittää, koska olen käyttänyt koko
> tehtävästä jutusta termiä MVP (ehkä MVP1?), ja täsäs promptissa on myös
> käytetty termiä MVP: Write architecture, ui/ux and tech stack specs into
> specs/. Focus on simplicity and being able to quickly develop an MVP. Stay
> inside the PRD non-goals: «yksi laite, ei tunnuksia, ei tietokantaa, tms.».
> One page each.
>
> Then scaffold the project according to the tech stack spec: install
> what is needed, make the commands in @AGENTS.md real, and run `npm test`
> with no tests yet. It must pass green. Show the output.

→ No terminology conflict: the prompt's "MVP" is an adjective meaning keep it
simple; `MVP1` is our named scope. But one sentence in it is genuinely
dangerous — "focus on simplicity" can read as licence to reverse the one
decision that was deliberately *not* the simplest, world-anchored AR. It
stayed, per the PRD.

The prompt still carried Pasi's non-goals as a placeholder; ours were used.

The course warned this is where a model brings the non-goals back. The four
named in advance — a backend for syncing, a PIN on the admin view, crash
reporting as good practice, persisted progress because it is trivial — none
were added. `tech-stack.md` lists them under **Deliberately not used** with
the reason.

**Scaffold:** Expo SDK 57, React Native 0.86, React 19, TypeScript 7 strict,
Vitest 5. MapLibre and Viro deliberately not installed yet: both need a custom
dev build and a config plugin, and installing them before any code uses them
would let a native install failure block the harness. This is an interpretation
of "install what is needed", not a literal reading of it.

Two things worth recording:

- `"type": "module"` in `package.json` breaks Metro's resolution, but without
  it Vitest warns that its ESM config is loaded as CommonJS. Resolved by
  dropping the field and naming the config `vitest.config.mts`.
- `passWithNoTests: true` is set so the harness could be verified green before
  any test exists. It must be removed once the first real test lands in step
  6, or a broken include glob would pass silently.

```
$ npm test
 RUN  v5.0.0 /Users/null/Projects/next-path-vko1-ar-pakopeli
 No test files found, exiting with code 0
 include: src/**/*.test.ts, src/**/*.test.tsx
 exit 0

$ npx tsc --noEmit
 exit 0

$ npm start
 Starting Metro Bundler / Waiting on http://localhost:8099
 GET /status -> HTTP 200, packager-status:running
```

### 37
> hetkonen, mistä tiedät nämä askeleet etukäteen?

→ From the step-3 message, which included the course's table of all nine steps
and their artifacts. The step titles come from that table; the prompt text for
each step arrives only when it is given.

### 38
*In reply to: the explanation that the step titles came from the course table pasted in message 27, not from knowing the course*

> Ahaa, selvä :)

### 39
> *(course material for step 5)* Tehtiinkö sen mukaan ja onko meidän prompit
> siellä md:ssä?

→ Step 5 yes, with the one documented deviation above. The prompts, only
partly: the course-step prompts were verbatim, but the conversational
decisions had been consolidated into prose. Of eleven sampled messages, eight
were missing as written — "Leaflet ja carto?", "20m ok", "sopii" and others
existed only as summarised outcomes. That was a choice made without asking.

### 40
*In reply to: "Kirjoitanko prompts.md:n uudelleen niin, että jokainen viestisi on sanatarkasti järjestyksessä?"*

> Korjaa vaan

→ This file rewritten so every message appears verbatim and in order, with the
earlier summaries kept as the `→` commentary beside each.

### 41
*In reply to: "Toi prompt.md vähän epäselvä, kun siinä ei näy sun kysymyksiä" — and to the open question about AC15*

> Lisää, jos pystyt

> Saa tehdä: muotoillaanko ar-panel.md AC15 uudelleen niin, että se lupaa
> tyyliarvot eikä mitattua layoutia — koska jsdomissa ei ole layout-moottoria
> eikä testi pysty mittaamaan. Se on ainoa kohta, jossa speksi lupaa enemmän
> kuin testi voi näyttää.

→ Fifteen *In reply to* lines added above, so the short answers are readable
without the questions they answer.

AC15 rewritten to promise what a test here can read: every key declares
`minWidth` and `minHeight` of at least 48, and the keypad gap is at least 8,
which is what places adjacent centres 56 apart. `AGENTS.md` is explicit that
when a spec and a test disagree the spec is corrected first, so the change was
made in the spec rather than by weakening a test later.

Checking for the same defect elsewhere found one more, introduced by the
earlier readiness fix: `map-view.md` AC6 had been rewritten to require "a
measured width and height both greater than 0", which fails for exactly the
same reason — jsdom measures nothing, so every element is 0 x 0. It now
requires the container to be present with a resolved style declaring `flex: 1`.

Both specs record what the tests deliberately do not prove, so the field visit
has a written list rather than a memory.

---

## Step 6 — TDD, one criterion at a time

The prompt below is repeated for each acceptance criterion; only the AC
number and the spec file change. It is recorded once, with a log entry per
cycle beneath it.

### 42
> Run the `tdd` workflow from @AGENTS.md for AC1 in
> specs/features/proximity.md.
>
> RED first: write the failing test for this AC only. The test name states
> the AC. Run it and paste the real output. Confirm it fails because the
> behaviour is missing — not because of an import, path or fixture.
>
> Only then GREEN: the smallest change that passes it. Run ALL tests and
> show the summary. Then REFACTOR with the tests green.
>
> Stop after this AC. Do not start the next one.

**proximity AC1 — identical coordinates are zero metres apart**

RED. `distanceMeters` was created as a stub that throws, so that the failure
would be behavioural rather than an unresolved import — the prompt asks for
exactly that distinction:

```
FAIL  src/domain/distance.test.ts > distanceMeters > AC1: identical coordinates are zero metres apart
Error: distanceMeters is not implemented
 ❯ distanceMeters src/domain/distance.ts:8:9
Tests  1 failed (1)
```

GREEN with `return 0`. This is deliberately degenerate and it is the point of
the discipline: AC1 alone does not justify the haversine formula, and writing
it here would make the RED phase of AC2 and AC3 fake, since both would pass
the moment they were written. The comment in the file says so, so the next
cycle does not read it as an oversight.

```
Test Files  1 passed (1)
     Tests  1 passed (1)
exit 0
```

REFACTOR: nothing done. One test, a three-line function, no duplication, and
the names come from the spec. Inventing a change here would be motion, not
refactoring.

`passWithNoTests: true` removed from `vitest.config.mts`, as planned in step 5
— the first real test now exists, so the guard would only hide a broken glob.
