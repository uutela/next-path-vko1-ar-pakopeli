# AR Pakopeli — week 1

A location-based AR escape game. Built as the **week 1 exercise of the
next-path course** (Saranen & ModernPath, autumn 2026), where the method was
**spec-driven development**: a specification with acceptance criteria first,
then the code, then the test that proves the criterion.

Week 2 continues in a separate repository —
[next-path-vko2-ar-pakopeli](https://github.com/uutela/next-path-vko2-ar-pakopeli) —
which adds point pairs and an AI agent that invents the puzzles.

## What it is

A player walks to a point shown on a map. Within range the phone opens an AR
view, where a panel anchored in the world shows a sum and a keypad. The right
code opens the panel with a congratulation and a fanfare. An admin defines
where the points are.

"Working" means outdoors, on a real phone, with real GPS.

## Running it

    npm install
    npm test          # 132 unit tests
    npx tsc --noEmit  # types
    npm run web       # the map half, in a browser
    node scripts/browser-smoke.mjs

The AR half is native-only: the web build loads no Viro at all, deliberately,
because Viro's web files require a package that is not published.

## The files

| File | What it is |
|---|---|
| `AGENTS.md` | How to work in this repo — the operating manual the model reads |
| `specs/` | PRD, architecture, tech stack, UI/UX, and seven feature specs |
| `specs/audit-report.md` | What was checked, and what the checks found |
| `INBOX.md` | Everything noticed while working and deliberately not fixed |
| `prompts.md` | Every prompt that drove week 1, verbatim, with what each changed |

## The exercise

The question the week asked was whether writing the specification first changes
what gets built. `prompts.md` has the honest answer, including the one place
where the commit history does not prove the spec came first — stated rather
than tidied away.
