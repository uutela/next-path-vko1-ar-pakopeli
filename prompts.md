# prompts.md

Every message from the user that drove this project, in order and verbatim,
as part of the next-path week 1 exercise. Answers chosen from a multiple
choice prompt are marked as selections rather than typed text. A `→` line
after each entry summarises what was answered and what it changed.

Course-step prompts are quoted in full. Nothing here is paraphrased.

The assistant's own replies are not reproduced — this is a record of what
drove the work, not a transcript. Several messages below are answers to a
question that is therefore invisible, so those carry an *In reply to* line
naming the question they settle.

The `→` summaries run to three sentences where the answer was worth three and
longer where it was not. The instruction asked for brevity; the entries that
exceed it are the ones where something was found, and shortening those would
throw away the part of this file the study circle is meant to read.

---

## Where the submission lives

| Asked for | Here |
|---|---|
| Repository | https://github.com/uutela/next-path-vko1-ar-pakopeli |
| Spec and acceptance criteria | `specs/features/` — seven specs, 100 criteria |
| Evidence of order | below, with commit hashes and one honest exception |
| Green tests | `specs/audit-report.md`, and the summary below |
| Reflection | below |
| INBOX | `INBOX.md` — nine entries, seven resolved |

```
$ npm test
 Test Files  14 passed (14)
      Tests  132 passed (132)
$ npx tsc --noEmit
 exit 0
$ node scripts/browser-smoke.mjs
 14 checks, 0 console errors, 0 page errors
```

## Was the spec written before the code?

For the six specs of step 4, yes, and git shows it. They landed in one commit
of their own, and every line of implementation came afterwards:

| Spec | Spec commit | First implementation |
|---|---|---|
| `proximity.md` | `22b9ca6` | `178637e` |
| `puzzle.md` | `22b9ca6` | `891bb81` |
| `game-state.md` | `22b9ca6` | `c536a5a` |
| `points-store.md` | `22b9ca6` | `5a07039` |

**One exception, stated rather than tidied away.** `specs/features/app-shell.md`
and `src/ui/AppShell.tsx` are in the same commit, `b7af453`. The spec *was*
written first — the red run against nine criteria and a stub is in entry 55 —
but the commit does not prove it, and a reader should not have to take my word
for it.

**And one slip inside a cycle.** map-view AC12 and AC13 went green the moment
they were written, because the implementation and the tests went in together.
That is the exact trap `AGENTS.md` names. It is recorded in entry 64, and both
criteria were then proved able to fail rather than left to look fine.

## Reflection: what had to be said more than once

Three times, in different words, the same correction:

> **53** — *"pitääkö react native testata muulla tapaa?"*
> **58** — *"eikös pitäis jatkaa vaihetta 7 oikean react nativen testauksella?"*
> **63** — *"Koititko et http://localhost:8081/ :ssa avaa oikeasti tehtävän?"*

Every one of them says: **you are verifying this one step away from how it
will actually be used.** And every one of them was right, with a real defect
behind it:

1. The browser run passed against a web bundle that **did not compile at all**,
   because `AppShell` imported Viro unconditionally and Viro's web files need a
   peer package that is not published.
2. The native build had **no Viro in it whatsoever** — installed with
   `npm install` instead of `expo install`, so its config plugin was never
   registered — and two config plugins then destroyed each other's Podfile.
3. Playwright granted the location permission and *moved* the position, while
   the app watched only for movement. **A laptop on a desk got no position at
   all.** No test could have found it, because finding it required not moving.

The pattern behind all three is the same. Each layer of verification was
honest about what it checked and silent about what it stood in for: a mocked
Viro proves what the component asks Viro to draw, never how Viro draws it; a
jsdom render proves a style value, never a pixel; an injected position proves
a state transition, never that a position ever arrives.

The second pattern is mine, and it repeated three times without anyone having
to point it out: I wrote a rule into a document and did not put a criterion
behind it. `architecture.md` said the AR screen had no web implementation, and
nothing enforced it. `ui-ux.md` showed a telephone keypad, and AC3 passed
while the keys rendered four to a row. `Map.web.tsx` said in its own comment
that the web build must load MapLibre's stylesheet, and nothing did. **An
architecture rule with no criterion is a comment**, and it took three separate
defects to learn it.

---


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

### 43 — same prompt, AC2

**proximity AC2 — a known 20 m north offset measures 20 m**

RED. Only the test was added; the implementation was left at `return 0`.

```
FAIL  src/domain/distance.test.ts > distanceMeters > AC2: a known 20 m north offset measures 20 m
AssertionError: expected 20 to be less than or equal to 0.01
Tests  1 failed | 1 passed (2)
```

The error is the whole distance: `return 0` cannot produce one, which is
precisely the missing behaviour. AC1 stayed green.

GREEN. This is the criterion that forces the haversine formula out, as the
AC1 cycle predicted. Mean earth radius 6371000 m, extracted as a named
constant, with `toRadians` as a helper.

```
Test Files  1 passed (1)
     Tests  2 passed (2)
exit 0
```

The implementation returns 19.999997645 m for AC2's coordinates — inside the
0.01 m tolerance the spec names — and exactly `0` for AC1, which matters
because AC1 asserts strict equality with `toBe(0)`. It holds because
`sin(0)` is 0 and `asin(0)` is 0, so no floating point residue accumulates.

REFACTOR: nothing done. The radius is a named constant, `toRadians` is
extracted, and the variable names come from the spec. There is no duplication
to remove after two tests.

### 44
> Voidaanko nyt huijata ja tehdä loput tdd-jutut kerralla? Mut kuitenkin
> laadukkaasti

> joo

→ **A deliberate departure from the course instruction**, which says "stop
after this AC". Recorded here so the log does not misrepresent how the work
was done.

Batched per spec rather than per criterion, in two runs: all of a spec's tests
written with no implementation at all, run, red output shown — then the
implementation, run, green output shown. The two things that make a test
trustworthy survive that: the test is written before the code rather than
derived from it, and the red is observed. What is lost is the per-criterion
view of which AC forced which line, the chance to notice a criterion passing
as a side effect of another one's implementation, and "smallest
implementation" as a per-test discipline.

Scope limited to the four pure domain specs, 44 remaining criteria. The two UI
specs need MapLibre and Viro installed and a different kind of verification,
so they are their own job.

**proximity — AC3 to AC9, plus two rows from the testing strategy table**

RED. All nine tests present, `isWithinRadius` added as a stub that throws.

```
× AC8: latitude above 90 is rejected      AssertionError: expected function to throw an error, but it didn't
× AC8: latitude below -90 is rejected     AssertionError: expected function to throw an error, but it didn't
× AC9: longitude above 180 is rejected    AssertionError: expected function to throw an error, but it didn't
× AC5: a player inside the radius          Error: isWithinRadius is not implemented
× AC6: a player exactly on the radius      Error: isWithinRadius is not implemented
× AC7: a player outside the radius         Error: isWithinRadius is not implemented
× AC5: a player standing on the point      Error: isWithinRadius is not implemented
Tests  7 failed | 4 passed (11)
```

Four passed immediately: AC1 and AC2 were already green, and **AC3 and AC4
went green the moment they were written**, because the haversine formula AC2
forced out already satisfies them. That is not a batching artifact — it would
have happened in the strict per-criterion flow too, since both assert
properties of a formula that already exists. It is worth naming because a
test that has never been red is exactly what the workflow warns about, and
these two are only trustworthy because the implementation they describe was
driven out by a criterion that *was* red.

GREEN. `assertValidCoordinates` for AC8 and AC9, and `isWithinRadius`
delegating to `distanceMeters` with an inclusive comparison.

```
Test Files  1 passed (1)
     Tests  11 passed (11)
exit 0
```

REFACTOR: nothing. Validation is extracted, the radius is a named constant,
and `isWithinRadius` is one line.

**Noticed, not fixed** — one line added to `INBOX.md`: AC6 says it pins the
inclusive boundary, but its coordinate measures 19.999997645 m against a 20 m
radius, so the test passes with `<` just as well as `<=`. Verified by running
both comparisons. The criterion does not prove what it claims. Per AGENTS.md
the spec is corrected before the test, so this is recorded rather than patched
mid-cycle.

### 45
*In reply to: "Kumman haluat?" — fix AC6 by asserting an exact-radius distance, or drop the inclusivity claim*

> dropataan toi inclusive

→ The spec was corrected first, as AGENTS.md requires, and only then the test.

`proximity.md` AC6 is now "A player just inside the radius is within it", and
states the measured distance — 19.999997645 m against a 20 m radius — instead
of claiming 20.0 m. A paragraph beneath it records that behaviour at exactly
`radiusMeters` is deliberately unspecified, that the earlier claim was
untestable with this coordinate, and why manufacturing an exact-boundary
coordinate is not worth it: a difference of micrometres cannot reach a player
through a GPS reading that drifts by metres. The Risk section names the
consequence — no test would catch a future change between `<` and `<=`.

The doc comment on `isWithinRadius` was changed too. It had claimed the
boundary was inclusive, which is more than the spec now says, and a comment
that promises more than the spec is the same defect in a different file.

Verified rather than assumed: with the implementation flipped to `<`, the
suite still passes — which is now correct, since both comparisons are
acceptable. Flipped back to `<=` afterwards.

```
Tests  11 passed (11)
exit 0
```

The `INBOX.md` line is marked resolved rather than deleted, so the record shows
the mechanism working end to end: noticed during a cycle, filed as one line,
not detoured into, resolved by a decision.

### 46 — same prompt, puzzle.md

> jatka

**puzzle — AC1 to AC12, plus the whitespace row from the testing strategy**

RED. All thirteen tests written against three stubs that throw. Every failure
was behavioural — no import, path or fixture error anywhere:

```
× AC1: the lowest draw produces 1 + 1                 Error: generatePuzzle is not implemented
× AC2: the highest draw produces 9 + 9                Error: generatePuzzle is not implemented
× AC3: a mid-range draw maps to the documented operands
× AC4: the generator draws exactly twice
× AC5: the answer is always the sum, and operands stay in 1..9
× AC6: the correct answer is accepted                 Error: checkAnswer is not implemented
× AC7: a wrong answer is rejected
× AC8: a leading zero is still the same number
× AC9: empty input is rejected, not an error          AssertionError: expected [Function] to not throw
× AC6: surrounding whitespace is ignored
× AC10: a digit is appended to empty input            Error: appendDigit is not implemented
× AC11: a second digit is appended
× AC12: a third digit is ignored
Failed Tests 13
```

Unlike proximity, nothing passed early here: no part of this module existed,
so every criterion had a genuine red.

GREEN. `drawOperand` extracted so the 1..9 span is written once, `checkAnswer`
as a single `parseInt` comparison, `appendDigit` guarded by a named length
constant.

```
Test Files  2 passed (2)
     Tests  24 passed (24)
exit 0
```

REFACTOR: nothing. Constants are named, the shared draw is already extracted,
and there is no duplication between the three functions.

**Noticed, not fixed** — one line in `INBOX.md`. `parseInt` stops at the first
non-digit, so `"7abc"`, `"7.9"`, `"+7"` and `"7e0"` all read as 7. Probed by
running each input rather than assumed. No criterion covers them and the
keypad cannot produce them, since `appendDigit` only ever appends `0`-`9`, so
this is recorded rather than hardened.

### 47
*In reply to: three options for the INBOX line on `checkAnswer` — close it into the spec's Risk section, harden it, or leave it open*

> 2

→ Hardened. The order AGENTS.md requires was followed exactly: spec, then
test, then implementation.

`puzzle.md` gained AC13, "Input containing anything but digits is rejected",
covering `"7abc"`, `"7.9"`, `"+7"` and `"7e0"` — each of which a bare
`parseInt` reads as 7. Whitespace stays acceptable, since AC6 already covers
`"7 "`, so the rule is that the input must be all digits *after* trimming.
The criterion states its own justification, because nothing in MVP1 can
produce such input: the PRD says later projects read this repo as an example,
and a domain function that silently accepts `"7abc"` is a worse example.

RED, before touching the implementation:

```
× AC13: trailing letters are rejected      AssertionError: expected true to be false
× AC13: a decimal point is rejected        AssertionError: expected true to be false
× AC13: a leading sign is rejected         AssertionError: expected true to be false
× AC13: exponent notation is rejected      AssertionError: expected true to be false
Tests  4 failed | 24 passed (28)
```

A useful shape of red: not "not implemented" but "expected true to be false".
The function existed and worked — it was the *specified behaviour* that
changed, so the failure is the old behaviour being caught rather than a
missing one.

GREEN with a `DIGITS_ONLY` guard before the parse.

```
Test Files  2 passed (2)
     Tests  28 passed (28)
exit 0
```

Behaviour confirmed by running every input, not by reasoning about it:
`"7"`, `"07"`, `"7 "` and `"  7  "` accepted; `""`, `"7abc"`, `"7.9"`, `"+7"`,
`"7e0"` and `"0x7"` rejected.

### 48 — same prompt, game-state.md

> jatka

**game-state — AC1 to AC15, plus four rows from the testing strategy**

RED. Nineteen tests against one stub. Every failure was
`transition is not implemented`; the 28 tests already passing stayed green.

```
× AC1 … AC15                Error: transition is not implemented
Test Files  1 failed | 2 passed (3)
     Tests  19 failed | 28 passed (47)
```

GREEN. `transition` reads as the spec does: `RESET` short-circuits from any
state, then a switch over the four states. `nearestPointInRange` implements
AC13's tie-break by distance rather than array order. The `PUZZLE` branch
returns `state` itself — not a copy — whenever nothing changes, which is what
AC5, AC9 and AC15's second row ask for and which also keeps React from
re-rendering on a no-op.

```
Test Files  3 passed (3)
     Tests  47 passed (47)
exit 0
```

REFACTOR — the first cycle where there was something to do. `scriptedRng` had
been written twice, once in each test file, and it has a subtle contract:
it repeats its last value forever rather than running out. Two definitions
means two places to get that wrong. Extracted to `src/testing/scriptedRng.ts`,
which sits outside the `*.test.ts` glob so it is a helper rather than a suite.
`specs/architecture.md` gained the directory, since a layout diagram that does
not match the tree is worse than none. Tests stayed green through the move.

Three of the criteria here are about *nothing happening*: a puzzle stays open
when the player drifts out of range (AC5), a solved point stays solved
(AC10), and an event that does not apply is ignored rather than throwing
(AC12). Those are the ones that would show up on a phone as a panel that
flickers shut mid-answer, and they are the reason the state machine is a pure
function rather than logic spread across screens.

### 49 — same prompt, points-store.md

> jatketaan

**points-store — AC1 to AC10, plus one row from the testing strategy**

**The spec was corrected before any test was written.** It named
`loadStoredPoints` and `saveStoredPoints` as free exports taking no storage
argument, which cannot be tested against a fake without mocking the
AsyncStorage module — and that would have forced the package to be installed
purely for the tests, contradicting the deferral recorded in
`specs/tech-stack.md`. The adapter is now a factory over a minimal
`KeyValueStore` interface: `{ getItem, setItem }`, the subset of AsyncStorage
this needs. Production passes AsyncStorage, tests pass an in-memory object,
and neither the adapter nor the suite depends on the package.

RED. Eleven tests against two stubs.

```
× AC7, AC8, AC9, AC7, AC10   Error: createPointStore is not implemented
× AC1 … AC6                  Error: mergePoints is not implemented
Failed Tests 11
```

GREEN. `mergePoints` builds a `Map` keyed by id — seed first, stored second,
so a stored point with the same id wins — and sorts by id on the way out.
`createPointStore` writes exactly the four fields of an `EscapePoint`, which
is what keeps solved progress out of storage **by construction** rather than
by remembering not to write it.

```
Test Files  5 passed (5)
     Tests  58 passed (58)
exit 0
```

REFACTOR: nothing. No duplication between the two modules.

Two things checked by running rather than assuming:

**AC10 can actually fail.** The earlier AC6 episode was a criterion that could
not fail for the reason it claimed, so this one was verified the same way:
with the field-stripping removed, AC10 goes red and everything else stays
green. It is testing what it says it tests.

**A gap, filed in `INBOX.md` rather than fixed.** `loadStoredPoints` guards
against unparseable JSON and against JSON that is not an array, but not
against an array of the wrong shape — `[{"foo":1}]` and `[null]` come back as
if they were points. Only this app writes the key, so the shape can only be
wrong if a future version changes it, which is exactly when it would hurt.

With this, all four pure domain specs are green: 58 tests across
`distance`, `puzzle`, `gameState` and `points`. The two UI specs remain.

### 50 — same prompt, map-view.md

> eikös ole tarkoitus tehdä kaikki testit ennen kokeilua, joten tehdään ensin

→ Right, and it is the point of working from specs. The two UI specs were done
before any attempt to run the app.

`@maplibre/maplibre-react-native`, `maplibre-gl` and `react-map-gl` installed —
the deferral recorded in step 5 ends here, because this is the code that uses
them. The MapLibre API was read from the installed typings rather than
recalled: `Map` takes `mapStyle`, `Marker` takes `lngLat` as
`[longitude, latitude]`.

**map-view — AC1 to AC7**

RED, on the first attempt, was wrong for an instructive reason. AC1 searches
the source tree for the tile host and expects exactly one file to contain it —
and the *test file itself* matched, because the assertion spelled the URL out
in full. The failure read `expected [ 'src/config/map.test.ts' ] to deeply
equal [ 'src/config/map.ts' ]`.

That is a broken instrument, not a disagreement between test and spec, so
fixing it is not the forbidden kind of test-fixing: the needle and the expected
value are now both built from parts, so the file never contains the strings it
searches for. The corrected red read `expected [] to deeply equal
[ 'src/config/map.ts' ]` — nothing contained the URL yet.

AC7 was green from the moment it was written: no key or token names existed to
find. Recorded rather than glossed over, for the same reason as proximity's
AC3 and AC4.

GREEN. Both platform components import the same two constants. Native uses
MapLibre's `Map`/`Marker`; web uses `react-map-gl/maplibre`. Component tests
mock the native module and record what our component asks it to draw, so what
is under test is our marker-per-point logic, not MapLibre's rendering.

Two criteria were then deliberately broken to confirm they can fail: dropping
the attribution's `fontSize` to 8 turned AC4 red on its own, and inlining the
URL into `Map.web.tsx` turned AC1 red on its own. Both restored.

**`npx tsc --noEmit` broke, and was fixed before claiming green.** The
source-scanning test imports `node:fs` and `node:path`, which needs
`@types/node` and `"node"` in the tsconfig `types` array. AGENTS.md promises
that command works, so a green test run alongside a red type check is not
green.

```
Test Files  7 passed (7)
     Tests  65 passed (65)
tsc exit 0
```

**Filed in `INBOX.md`:** the map renders no `Camera`, so it never centres on
the player or a point. No criterion asks for centring, so the
smallest-implementation rule left it out — but a map that never centres is not
usable in the field. It needs a criterion before it gets code.

### 51 — same prompt, ar-panel.md

> ok, jatka

**Two spec conflicts were surfaced before any code, and both were decided by
the user rather than guessed.**

*AC1 was in the wrong spec.* `ui-ux.md` shows the AR screen only in `PUZZLE`
and `SOLVED`, so an `Avaa tehtävä` button rendered there could never be
pressed in `NEAR`, the state that fires it. Moved to `map-view.md` as AC8 and
AC9; `ar-panel.md` AC1 now covers what that screen actually owns — the camera
preview.

*AC15 was in the wrong units.* Viro declares `ViroStyle = ViewStyle &
ShadowStyleIOS`, so `minWidth: 48` typechecks — but Viro lays out in metres of
world space, so it would have meant a 48-metre key, and the test would have
passed while asserting nonsense. The worst kind of green: not a red that needs
fixing, but a green that means nothing. Rewritten in 3D units, with the number
derived rather than picked: 0.06 m at 0.6 m subtends 5.72 degrees, computed
before writing it down.

**The Viro API was read, not recalled, and two guesses were wrong.**
`ViroText` has no `testID`, and `ViroButton` requires an image `source` — it
is not a text button. Keys are `ViroFlexView` with `onClick` and `viroTag`,
both real props, so the tags the tests query are the component's own output.

RED: 18 failures across `PuzzlePanel`, `ArScreen` and `MapScreen`.
`map-view.md` AC9 passed immediately — the stub renders nothing, so the button
it asserts is absent was trivially absent. Recorded, not glossed.

GREEN: 84 tests pass, `tsc` clean.

**AC9 did not test what it claimed, and this was only found by trying to break
it.** Removing the component's replay guard left all 84 green. The reason:
`useEffect` with dependencies `[state.kind, audio]` does not re-run when a
re-render passes the identical props, so the guard never executed — the test
proved React's dependency array works, not that our component guards anything.
The spec was fine; the test was weak. It now renders a fresh adapter object
each time, which is what an inline prop gives in real code. Verified both
ways: green with the guard, red without it.

The first attempt to check this was itself broken — a `sed` whose pattern
never matched, reported as "nothing failed". The second attempt asserted the
match first. A check that cannot fail is worth no more than a test that
cannot.

**Filed in `INBOX.md`:** `ArScreen` passes Viro a scene closure through
`initialScene`. If Viro calls it only at mount, the panel keeps the props it
captured and the typed input never updates on screen. No criterion covers the
panel inside the AR scene, so nothing catches it.

All six specs are green. 84 tests, 10 files.

### 52
*In reply to: what to do about the INBOX line on ArScreen's scene closure*

> tee

→ The line had been written with an "if", so the first step was to find out
whether it was a defect at all. It was — confirmed from
`ViroARSceneNavigator`'s own source:

```js
constructor(props) {
  const scene = { sceneClass: this.props.initialScene, ... };   // captured once
```
```js
// update the arSceneNavigator with the latest given props on every render
this.arSceneNavigator.viroAppProps = this.props.viroAppProps;
```

`initialScene` is read in the constructor and never again; `viroAppProps` is
the channel Viro itself refreshes. A scene passed as a closure is frozen at
mount, so the player would press keys, the state machine would update, and the
anchored panel would show the input it had when the camera opened. The core
interaction, silently dead.

Nothing caught it because all fifteen panel criteria render `PuzzlePanel`
directly. The defect lives in the seam none of them cross.

**Spec, then test, then fix.** `ar-panel.md` gained AC16. The test's stand-in
had to reproduce *both* Viro behaviours — capture the scene once, refresh
`viroAppProps` every render — because a stand-in that simply called the scene
function again would have made the frozen closure look fine. A mock is a
measuring instrument, and one built to agree with the code measures nothing.

```
RED    AssertionError: expected '' to be '12'
GREEN  Tests  85 passed (85)
```

`PuzzleScene` is now a module-level component reading
`sceneNavigator.viroAppProps`. One narrowed cast was needed: Viro declares
`scene` as `() => JSX.Element` while its renderer calls it with
`sceneNavigator` and `arSceneNavigator`, so the declared type understates what
it passes. The cast sits on that one line rather than weakening
`PuzzleScene`'s own props, and no `any` is involved.

Verified by putting the closure back: AC16 goes red alone, and nothing else
does. Restored.

---

## Between steps 6 and 7 — the app shell

### 53
> Aloitetaan askel 7 … mutta mietityttää toi chrome laajennos. Ja lisäksi
> pitääkö react native testata muulla tapaa?

→ Both questions were worth asking, and checking the repo before starting the
app turned up a third problem that mattered more than either.

**`App.tsx` was still the step 5 placeholder.** `grep` found zero references
to `MapScreen`, `ArScreen`, `transition` or `mergePoints` in it. Eighty-five
tested parts existed and nothing joined them, so any tool pointed at the app
would have shown "Ei vielä pisteitä." `src/adapters/location.ts` did not
exist either, so `LOCATION_CHANGED` had no source.

On React Native: the browser can only reach the map half. Viro is native, and
ARKit anchoring is native-only by the PRD's own decision — web is a bonus
without it.

### 54
> haluan että käytetään mieluummin playwright mcp:tä. Eikös noi jotkut voi
> testata xcoden simulaattorilla ja mockeilla tai testikirjastolla

→ **No Playwright MCP is configured here** — a tool search returned Appium and
Notion, nothing else. Recommended instead: `playwright` as a dev dependency
plus `scripts/browser-smoke.mjs`, which is also what the course's own step 7
artifact is.

On the simulator: right, and better supported than expected. A full Appium MCP
is available, including `appium_geolocation`, which would drive `MAP → NEAR`
without anyone going outside. ARKit still does not run in the iOS simulator,
so the anchored panel is first seen on a real device — Apple's limit, not ours.

### 55
> ja tehdään speksi + tdd

**app-shell — AC1 to AC9**

`specs/features/app-shell.md`: nine criteria over the composition, the
location source, and the screen routing. Everything is injected, so the whole
shell renders in a test with no device.

One spec wording was corrected before writing code: it had said `useReducer`
over `transition`, but the point list arrives asynchronously and a reducer
cannot read it without either impurity or threading context through every
action. It now says the list is read through a ref, so `transition` keeps
taking its context as an argument and stays pure.

RED: eleven failures, every one `createMockLocationSource is not implemented`
or a null render.

GREEN: 96 tests across 12 files, `tsc` clean.

`expo-location` turned out never to have been installed — the earlier
`expo install` covered camera, audio and storage only. Installed, and the
expo APIs were read from typings rather than recalled:
`watchPositionAsync(options, callback)` resolving to a subscription with
`remove()`, `useCameraPermissions`, `createAudioPlayer`.

The root `App.tsx` now builds the real adapters and renders `AppShell`. No
criterion covers it, by design — it is the one file that cannot run under
jsdom, so the spec's Risk section names it as the first thing to suspect when
tests are green and the app misbehaves. Every adapter it builds is wrapped in
`useMemo`, because a fresh `location` object each render would resubscribe on
every render.

Verified by breaking: dropping the subscription cleanup turns AC6 red alone,
and returning the seed instead of the merge turns AC5 red alone.

---

## Step 7 — run the app and walk through it in a browser

### 56
> aloitetaan

> Start the app. If the port is already in use, pick another one and tell me
> the URL you actually used.
>
> Then use the browser tool to walk through AC«N» as a user would: click,
> type, read the screen, take a screenshot.
>
> Report exactly what you did and what you saw — inputs and outputs. List
> every difference from the AC. Do not fix anything yet.

Playwright 1.63.0 as a dev dependency plus `scripts/browser-smoke.mjs`, since
no Playwright MCP is configured here and the course's own step 7 artifact is a
script. Port 8081 was free, so the URL is **http://localhost:8081**.

The web build does not compile. Nothing was fixed, per the prompt.

```
UnableToResolveError: Unable to resolve module @reactvision/viro-web-renderer
from node_modules/@reactvision/react-viro/dist/components/ViroAmbientLight.web.js
```

`@reactvision/react-viro` declares `@reactvision/viro-web-renderer` as a peer
dependency, and **that package is not published** — `npm view` returns 404. So
Viro's web build cannot be completed by installing anything.

`AppShell` imports `ArScreen` unconditionally, `ArScreen` imports Viro, and
Metro resolves Viro's `.web.js` files on web. One import therefore takes down
the entire web bundle, including the map screen, which has no Viro in it at
all. The PRD said web would have no anchored AR; it did not say web would have
nothing.

Everything else the run observed follows from that single failure — recorded
in full in the report to the user rather than repeated here.

### 57
> No toihan tiedettiin

> Ihmettelinkin miksi haluat playwrightlilla testata

> Tee korjaus

→ Both fair. The AR-not-on-web part was known and had been said. Two things
were not: that `@reactvision/viro-web-renderer` **is not published at all**
(404, so no install can fix it), and that one import therefore takes down the
whole web bundle rather than only the AR screen. The earlier claim that "the
browser covers the map half" was wrong, and this run is what showed it.

On the tool: the course's step 7 assumes a web app, because Pasi's project was
one. Ours is React Native with native AR. Following the instruction's tool
instead of its purpose — run the app and see what actually happens — is why
this started in a browser rather than a simulator.

**The real fault was a spec violation, not a library surprise.**
`specs/architecture.md` already said "the AR screen has no web implementation;
on web the app shows the map and says so". `Map.tsx`/`Map.web.tsx` existed;
`ArScreen.web.tsx` did not, and `AppShell` imported `ArScreen` unconditionally.
No criterion covered the platform split, so nothing noticed. An architecture
rule with no criterion is a comment.

`ar-panel.md` gained AC17 and AC18, `ui-ux.md` gained the string, and
`src/ui/ArScreen.web.tsx` imports no Viro.

The first RED was the instrument's fault again: the test searched for the
package name as a *substring*, so the doc comment in `ArScreen.web.tsx`
explaining the rule matched it. The criterion says "files importing", and a
comment is not an import, so the test now matches `from`/`require` forms.

After the fix the web bundle builds — 3.5 MB, HTTP 200 — and the smoke run is
all green:

```
PASS  app-shell AC1 attribution present
PASS  app-shell AC1 no offer while far
PASS  app-shell AC2 offer appears in range
PASS  map-view a map canvas is rendered
PASS  map-view the map canvas has area
PASS  ar-panel AC18 web says where the puzzle opens
PASS  ar-panel AC18 no keypad on web
console errors: 0   page errors: 0
```

`networkidle` had to go from the script: map tiles and Metro's HMR socket keep
the network busy, so it never settles.

**But the screenshot shows a blank map**, and the checks above did not catch
it — a canvas with area is not a canvas with a map on it. Probed rather than
guessed: four requests to `tiles.openfreemap.org` all succeed, nothing fails,
the canvas is 1280x664 with class `maplibregl-canvas`, and `maplibre-gl`'s
stylesheet is absent from the document. `Map.web.tsx`'s own comment says the
web build "must also load maplibre-gl's stylesheet … in the HTML shell", and
nothing ever did. Filed in `INBOX.md`, not fixed.

### 58
> eikö pitäis jatkaa vaihetta 7 oikean react nativen testauksella?

> Selvitä ja paikkaa Viron plugin

→ Right, and the native attempt found three things the browser never could.

**Viro had no native code at all.** The first `expo prebuild` succeeded and
installed 244 pods with no Viro among them, because Viro had been installed
with `npm install` rather than `npx expo install`, so its config plugin was
never registered in `app.json`. The build would have compiled without AR and
failed only at runtime.

**With the plugin registered, prebuild broke**, with
`withIosPodfileBaseMod: Failed to match "/post_install do |installer|/"`.
Isolated rather than guessed: MapLibre alone fine, Viro alone fine, both
together broken in either order.

**The cause, read out of `withViroIos.js`:** the iOS plugin does its Podfile
work inside callback-based `fs.readFile`/`fs.writeFile`, within an `async` mod
that returns before either callback fires. The write therefore lands at an
arbitrary later time. Alone that usually wins the race; beside another plugin
editing the same file it does not.

`patches/@reactvision+react-viro+2.58.1.patch` makes both calls synchronous,
with `postinstall: patch-package` to reapply it. Prebuild then succeeds with
both plugins, and the Podfile carries `pod 'ViroReact'` and
`$MLRN.post_install(installer)` together. 248 pods: ViroReact 2.58.1, ViroKit
1.0, MapLibreReactNative 11.3.10.

**Then the simulator turned out to be impossible.** The build stopped with
"Unable to find a destination matching the provided destination specifier",
and `xcodebuild -showdestinations` lists no concrete simulator at all — only
the placeholder — even with an iPhone 17 Pro booted. Viro's plugin sets
`EXCLUDED_ARCHS[sdk=iphonesimulator*] = arm64`, which appears twice in the
generated `project.pbxproj`. On an arm64 Mac that leaves no architecture for a
simulator build.

So the Appium-in-the-simulator plan does not work either, and it is Viro's
constraint rather than ARKit's. Every native run needs a physical device.
Xcode can see three connected already.

### 59
*In reply to: which connected device to build for*

> リンゴ17P.

> latautui laitteella. punaien piste näkyy helsingin keskustassa

→ **The app runs on a real phone.** iPhone 17 Pro (iPhone18,1), signed with
the existing Apple Development identity, built in about two minutes:

```
› Build Succeeded
› 0 error(s), and 1 warning(s)
› Installing … ARPakopeli.app  ✔ Complete 100%
iOS Bundled 3264ms node_modules/expo/AppEntry.js (938 modules)
 LOG   VRTMaterialManager lookup: FOUND
 WARN  MapLibre Native … Invalid geometry in line layer
```

`VRTMaterialManager lookup: FOUND` is the line that matters: Viro's native
module loaded. Without the Podfile patch there would have been no Viro in the
binary at all, so the patch was necessary rather than cosmetic. The user
confirms a red marker in central Helsinki — the seed point at Senaatintori,
60.1699 / 24.9384 — so MapLibre renders tiles and places the marker from
`src/data/points.json` correctly on the device.

Two warnings recorded rather than chased:
- `ViroKit … built for newer version 17.6` while building for iOS 16.4 — a
  deployment-target mismatch in Viro's prebuilt binary
- `Invalid geometry in line layer` from MapLibre, originating in OpenFreeMap's
  tile data rather than in this code

**What is now proven natively:** the build, Viro's native module, MapLibre
rendering, and the marker's position. **What is not yet exercised:** every
criterion past the `MAP` state, because `MAP → NEAR` needs the player within
20 m of the seed point. That is the next session's work — either move the seed
point to where the phone is, or walk to Senaatintori.

---

## Back to steps 4 and 5 — a playable web build

### 60
> Jotta saadaan tämä joidenkin muidenkin laitteilla ja koneilla toimimaan,
> niin ehkä se react native web olisi myös hyvä saada toimimaan. Miten meidän
> pitää palata stepeissä takaisin, jos halutaan tehdä niin, että web versiossa
> ei tarvitse olla tuo oikea AR vaan riittää overlay cameran päälle?

> Joo

→ **Not as far back as it looked.** The PRD already said it: "Web is a bonus
and will not have anchored AR — React Native Web cannot do it. *Everything
else works on web.*" A camera overlay is not anchored AR, so the non-goal
still holds and nothing about the product changed.

What contradicted it was `specs/architecture.md`, written in step 5: "the AR
screen has no web implementation; on web the app shows the map and says so".
That was stricter than the PRD, and the build followed it. **The restriction
was mine, not a product decision** — so the earliest step to revisit was 5,
not 3.

Changed: `architecture.md` (the platform split now covers the camera view as
well as the map), `ui-ux.md` (one camera screen, same strings on both
platforms, sizes in metres for Viro and points for web), and the PRD sharpened
to say the overlay out loud rather than leaving it to be inferred.

Then step 4: `ar-panel.md` AC17 widened, AC18 to AC21 replaced.

**AC18 is the one worth noting.** Rather than copying thirteen criteria for a
second panel, it says the web panel must satisfy AC2–AC14 *unchanged*. The
suite lives in `src/ui/panelBehaviour.ts` and runs against both
implementations. Two renderings of one behaviour, so the behaviour is written
once — and the web panel is tested more honestly than the anchored one, since
`react-native-web` renders real components where Viro needs a stand-in.

RED was 16: thirteen from the shared suite against a stub, plus AC19, AC20 and
AC21. GREEN with `PuzzlePanel.web.tsx` and a rewritten `ArScreen.web.tsx` that
puts the panel over a `getUserMedia` preview.

**Then a screenshot found what no test had.** The keypad rendered four columns
of three, because the keys wrapped on width. `ui-ux.md` has always shown the
telephone layout, and AC3 passed anyway: twelve keys in the right order can
still be in the wrong shape. Same failure as the platform split — a rule in a
document with no criterion behind it. AC22 now pins four rows of three, and
both panels build the rows structurally instead of relying on wrapping.

Two test queries then broke, and both were the instrument's fault:
`getAllByTestId(/^key-/)` had started matching `key-row-0`. Narrowed to
`/^key-(?!row-)/`.

The browser now plays the whole game. Chromium with a synthetic camera, the
position driven through Playwright's geolocation override, and the answer read
off the screen rather than assumed:

```
  panel reads: "7 + 8 = ?"
→ typing 15, then OK
PASS  ar-panel AC20 camera preview present
PASS  ar-panel AC20 panel states a sum
PASS  ar-panel AC3 twelve keys
PASS  ar-panel AC4 input display shows what was typed
PASS  ar-panel AC7 congratulation appears
PASS  ar-panel AC12 reset control appears
console errors: 0   page errors: 0
```

116 tests across 14 files, tsc clean.

**Still open for anyone else to run it:** camera and geolocation need HTTPS in
a browser. `localhost` is exempt, so this works on the developer's machine and
nowhere else until the build is hosted over HTTPS. That is a deployment
decision the PRD does not yet cover.

### 61
> Aloitetaan ykkösestä ja sen jälkeen kakkonen. Voisiko toi meidän koordinaatti
> olla jossain tiedostossa mikä ei mene gittiin tai tänne historiaan

→ Yes, and AGENTS.md asks for it independently: "the player's location never
leaves the device". A home address does not belong in a public repository, and
the committed seed is a public square for the same reason.

`src/data/points.local.json` is gitignored and created empty by `postinstall`,
so a fresh clone still builds. The root `App.tsx` merges it over the committed
seed using the same `mergePoints` rule the store already uses — a matching id
replaces, any other id adds — so no new domain code and no new criterion were
needed. Verified with a throwaway value that was never written to the file:
seed alone gives `p1/Senaatintori`, seed plus a local file gives
`local/Lisätty, p1/Korvattu`.

The coordinate is filled in by the user and passes through neither this
transcript nor the repository.

**Task one, the blank web map, is half done.** `maplibre-gl`'s stylesheet is
now imported and pinned by AC10 — the document holds 103 `maplibregl` rules
where it held none, and the Liberty background and the marker render. But no
vector tile is ever fetched, so the map still shows no streets. What has been
ruled out by testing rather than argued: headless versus headed makes no
difference, WebGL2 is present in both, no console error or failed request
appears, the map element measures 1280x647, and the style, TileJSON and
sprites all return 200 while the tile template
`.../{z}/{x}/{y}.pbf` is never requested. Two candidates remain untested:
MapLibre fetching tiles from a Web Worker the page listener never sees, and a
disagreement between `react-map-gl` 8.1.3 and `maplibre-gl` 6.7.0 despite the
permissive peer range. The smoke script asserts tiles are fetched and fails,
which is the honest state rather than a green run over a blank map.

### 62
> Ja sit tehdään speksiin pieni helpoitus koska haluan et muut voi kokeilla
> tätä helpommin. Eli selainversiossa voitaisiin luopua kamerasta ja
> overleystä. […] Haluan myös että varmistetaan että selaimessa toimii tilet.

→ Two jobs. The tiles first, because they were an open finding.

**The blank web map was two faults with one symptom.** AC10 had already added
the missing stylesheet, and the map still drew only its background. AC11 is
the rest: `maplibre-gl` 6 resolves its worker against `import.meta.url`, Metro
does not rewrite that, and the dev server answered
`/node_modules/expo/maplibre-gl-worker.mjs` with the app's own `index.html` —
HTTP 200, `text/html`, 1280 bytes of doctype. A worker built from an HTML
document dies on creation, and MapLibre without its worker processes no tiles
at all. That is why not one `.pbf` was ever requested and why no error
appeared anywhere: nothing failed, the work simply never began.

The fix needed **two** files copied into `public/`, not one. The worker is an
ES module whose first line imports `./maplibre-gl-shared.mjs`, and a module
worker whose sibling import cannot resolve dies just as quietly. Copying only
the worker moved the symptom without curing it.

The smoke script had drifted too: it walked to hardcoded Senaatintori
coordinates, which stopped matching the moment a local point override existed.
It now derives the walk from the points the app actually uses, and never
prints them.

**Then the simplification, which removed criteria rather than adding them.**
The web build uses no camera at all: `ArScreen.web.tsx` renders the panel on a
plain background. AC20 was rewritten to assert the *absence* of a camera — it
renders with the permission reporting `denied` on purpose, because web must
not consult it — and AC21, which explained a denied camera on web, is gone
along with the thing it explained. The PRD, `architecture.md` and `ui-ux.md`
all say "no camera on web" now.

The browser test shows the change better than the code does: it launches with
no camera flags and no camera permission, and still plays the whole game.

Fourteen smoke checks, all passing, no console or page errors. 117 tests.

**Still true, and still the thing that blocks strangers:** geolocation needs a
secure context. `localhost` is exempt and nothing else is, so until the build
is hosted over HTTPS nobody else gets past the map — camera or no camera.

### 63
> Koititko et http://localhost:8081/ :ssa avaa oikeasti tehtävän?

> Voiko ongelma olla se ettei läppärini liiku, joten joku tarkastus ei laukea?

→ The honest answer to the first was "yes, but only through Playwright, which
grants the permission and injects the position". The human path had never been
walked, and the second question found exactly why it fails.

`App.tsx` watched for position *changes* and never asked for the position it
already had: `watchPositionAsync` with `distanceInterval: 1` notifies after a
metre of movement, and `getCurrentPositionAsync` was called zero times. **A
laptop on a desk therefore produced no position at all**, the state machine
stayed in `MAP`, and the screen showed a map and nothing else.

**No test could have caught this, because catching it required not moving.**
Playwright's geolocation override works by *changing* the position, which is
the very movement the app was waiting for — so the automated walk passed while
a person sitting still saw nothing. It took someone stationary to find it, and
the user found it by reasoning about their own chair.

Fixed with criteria first: `app-shell.md` AC10 to AC12 pin that a device which
never moves still gets a position, that later movement still arrives, and that
cancelling before the first position delivers nothing. The rule moved out of
`App.tsx` into `createLocationSource` over a `PositionProvider`, so it is
tested rather than living in the one file no criterion covers; `App.tsx` now
only fetches.

Proved by the case that used to fail: permission granted, position set once
and never changed. `Avaa tehtävä` appears and the puzzle opens with `3 + 8 = ?`.

### 64
> Korjataan numero 1, mutta ei tuota kakkosta. Tee prosessin mukaan

> Ja testasin että selaimessa toimii

→ The map centred on a hard-coded Senaatintori, so a point anywhere else was
off screen and the player saw a map of somewhere they were not. AC5 passed
regardless: a marker per point is true whether or not the marker is in view.
The gap had been in `INBOX.md` since the map was written — filed and left —
which is why it was still there to make a real diagnosis take an hour.

Spec first: `map-view.md` AC12, AC13 and AC14. The centre is a pure function,
`initialCentre(points)`, so both platforms share it and it is tested without
rendering anything — the native map reads it through MapLibre's `Camera`,
which it had never had at all, and the web map through `initialViewState`.

**A process slip worth recording.** AC12 and AC13 went green the moment they
were written, because the implementation and the tests went in together — the
exact trap AGENTS.md names. Rather than pretend otherwise, both were proved
able to fail: swapping longitude and latitude turns AC12 red, and returning
`[0, 0]` instead of the named fallback turns AC13 red. The criteria are sound;
the discipline was not, and the difference is worth naming.

AC14 had a genuine red, since `Map.tsx` had no `Camera` to configure.

123 tests, tsc clean, every smoke check passing.

---

## Step 8 — review

### 65
> Run all tests and show the summary. Then run the `review` workflow from
> @AGENTS.md on all changes so far […] End with APPROVED or CHANGES_REQUIRED
> and a numbered list. If CHANGES_REQUIRED: fix the items one at a time, each
> through the tdd workflow (red first), then run the review again.

**Round 1: CHANGES_REQUIRED**, on one blocking item. The audit found a crash,
not a smell. `loadStoredPoints` guarded unparseable JSON and non-arrays and
stopped there, so a stored `[{"id":"p2","foo":1}]` survived `mergePoints`,
reached `isWithinRadius` and threw `TypeError: Cannot destructure property
'latitude' of 'undefined'` on the first location update — the app dying
seconds after launch with no way back but clearing device storage. It had been
sitting in `INBOX.md` as a robustness note.

Fixed through tdd: AC11 to AC13, `isEscapePoint` covering shape *and* values,
both proved able to fail.

**Round 2 found the same crash by a different route**, which is the point of
running the review again rather than declaring victory. `App.tsx` cast both
JSON imports to `EscapePoint[]` with no check — and `points.local.json` is
typed in by hand, making it the likeliest source of a malformed point in the
system rather than the least. AC14 and `composeSeed` moved that composition
into the domain, out of the one file no criterion covers.

**Round 2: APPROVED.** 130 tests, tsc clean, fourteen browser checks, 98
criteria all covered, and no unchecked array cast anywhere in the tree.

Three findings stay recorded and none is a defect: the location adapter
discards why a position never arrived (the UI half is a decision already
made, the developer-visibility half is not), `Map.web.tsx` is executed only by
the browser smoke test, and the native panel's sizing fix has not been looked
at on the device since it was written.

### 66
*In reply to: four open decisions, each with a recommendation*

> 1. lokitetaan

→ The adapter ended both promises with `.catch(() => undefined)`, which made a
refused permission, a device with no fix and a timeout indistinguishable from
"still looking" — to the player *and* to whoever was debugging. Two decisions
lived in that line and only one had been made: not showing the player a
location status is a scope decision and it stands, while throwing the reason
away was never decided at all. It was a reflex to avoid an unhandled rejection.

app-shell AC13 and AC14, red first. `createLocationSource` now takes a
`report` callback defaulting to a local `console.warn`, so the rule is tested
with a spy rather than by trusting a side effect.

Proved on the path that used to be silent: opening the app with no location
permission prints exactly one line —

```
warning: [location] Error: location permission was not granted
```

That is the line that would have turned yesterday's hour of probing the
browser, WebGL, MapLibre's worker and Viro's source into a glance at the
console.

It carries the reason a position failed, never a position, and it goes to a
local console. AGENTS.md's guardrail is that the player's location never
leaves the device, and nothing here sends anything anywhere.

132 tests, tsc clean, and no `.catch(() => undefined)` left in the tree.

### 67
> Tässä step 9 ohje: […] Write all my prompts to prompts.md and briefly
> summarise what you answered with three sentences each.

→ The log itself was written as the work happened rather than reconstructed at
the end, so step 9 was mostly a matter of adding what a reader needs on top of
it: where each thing the submission form asks for actually lives, whether the
spec really preceded the code, and the one honest answer to "what did you have
to say twice".

The order question has a clean answer for the six step-4 specs — one commit of
their own, `22b9ca6`, before any implementation — and one exception that is
stated rather than hidden: `app-shell.md` shares a commit with `AppShell.tsx`,
so the history does not prove for that spec what entry 55 shows actually
happened. The map-view AC12/AC13 slip is named in the same place.

The reflection is the part worth reading. Three times the user had to say, in
different words, that the verification was one step removed from how the thing
would really be used — and all three times there was a defect hiding in
exactly that gap.
