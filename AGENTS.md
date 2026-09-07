# AGENTS.md — AR Pakopeli

> Operating manual for AI agents in this repo. The model reads this file
> at the start of every session — anything written here never needs
> repeating in a prompt.

## What this is

AR Pakopeli is a location-based escape game. A player walks to a physical
point shown on a map, and within range the phone opens an AR view where an
anchored panel shows a puzzle and a keypad. Entering the correct code opens
the panel with a congratulation and a fanfare. An admin defines where the
points are and what they ask.

This repo is the product, not a reusable library — later projects copy from
it rather than import it. Optimise for a codebase that reads well as an
example.

"Working" means: outdoors, on a real phone, with real GPS — one point, one
puzzle, walked through end to end.

## Commands

- `npm test` — run all tests (Vitest)
- `npx tsc --noEmit` — type check
- `npm start` — run the app

Run these — never reason about what they would probably print.
"Green" means the command exited 0 just now, nothing else.

## Workflows: research and spec

### research
Goal: understand the task before planning. Read-only.
1. Gather context: existing code when there is any, libraries and
   worked examples worth reusing, external API docs if needed
2. Identify scope: which files, what rules apply, what depends on what
3. Analyze: outline what needs doing, list what is still unknown
4. Present findings and ASK about every open question —
   never resolve a guess silently
No code, no spec, in this pass.

### spec
Goal: a specification before implementation.
Required for: new features, API changes, anything multi-file.
Write specs/features/<name>.md — structure in specs/TEMPLATE.md.

Spec Readiness checklist — the spec is NOT ready until every box holds:
- [ ] Every AC is Given/When/Then with a precise expected value
- [ ] Files to modify are listed with what changes in each
- [ ] Risk: what could break, and how to roll back
- [ ] Testing strategy covers every AC, plus error and edge cases
- [ ] Every AC has at least one named test case

## Workflows: tdd, develop, review

### tdd
Prerequisite: a spec with a testing strategy (run spec first).
For EACH acceptance criterion, in order:
  RED      write the failing test for THIS AC only; the test name
           states the AC; run it and confirm it fails FOR THE RIGHT
           REASON (missing behaviour, not a broken import)
  GREEN    smallest implementation that passes this test; run ALL
           tests, confirm no regressions
  REFACTOR remove duplication, improve names; tests stay green
Then repeat the cycle for edge cases: invalid input, boundaries,
error paths.

Two traps, both near-certain:
- The model writes test and implementation in one pass. The test is
  then derived from the code and always passes. Ask separately.
- The model "fixes" a failing test to match the code. The spec
  decides which one is wrong — correct the spec first, then the test.

### develop
For work that has a spec: read it, follow the patterns already in
the codebase, change only the files the spec lists, run tdd for the
ACs, and update the spec status Draft -> In Progress -> Done.

### review
Compare the diff against the spec: which AC each change serves, what
changed that no AC asked for, which tests prove what. End with a
verdict: APPROVED or CHANGES_REQUIRED — never prose that cannot be
branched on.

## Coding conventions

- TypeScript strict, no `any`
- Interfaces for every data structure; `type` only for unions
- ES modules
- Business logic in pure functions, testable without the CLI/UI
- Each source (GPS, camera, point storage) lives behind its own
  adapter returning a plain typed record — the game state machine
  never touches a source directly
- User-facing text is Finnish; identifiers, comments and commit
  messages are English

## Guardrails

- Never touch `.env`; never run a command that deletes data
- Never "fix" a failing test by editing the test — the spec decides
  which one is wrong, and the spec is corrected first
- Stop after two consecutive red rounds and report — do not thrash
- The player's location never leaves the device — no analytics,
  no remote logging, no third party

## When you notice something

One line in INBOX.md. Do not implement it, do not detour.
