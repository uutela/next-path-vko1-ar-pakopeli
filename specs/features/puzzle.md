# Feature: Arithmetic puzzle

**Status:** Draft

## Problem Statement
The panel needs a puzzle that is different each time but never hard: two
single-digit numbers to add. Because the operands are drawn at random, the
generator cannot call `Math.random` itself — an acceptance criterion could
then never state an exact expected value, and the spec would be unfalsifiable.

## Proposed Change
Three pure functions in `src/domain/puzzle.ts`:

- `generatePuzzle(rng: () => number): Puzzle` — calls `rng` exactly twice;
  each operand is `Math.floor(rng() * 9) + 1`, so both land in 1..9 and the
  answer in 2..18. The first call produces `left`, the second `right`
- `checkAnswer(puzzle: Puzzle, input: string): boolean` — parses `input` as a
  base-10 integer and compares it to `puzzle.answer`
- `appendDigit(input: string, digit: string): string` — appends one digit,
  refusing to grow past two characters, since 18 is the largest answer

In production `rng` is `Math.random`. In tests it is a function returning a
scripted sequence. Randomness is injected, never taken.

## Acceptance Criteria

### AC1: The lowest draw produces 1 + 1
**Given** an `rng` returning `0` on every call
**When** `generatePuzzle(rng)` is called
**Then** it returns `{ left: 1, right: 1, answer: 2 }`

### AC2: The highest draw produces 9 + 9
**Given** an `rng` returning `0.9999999` on every call
**When** `generatePuzzle(rng)` is called
**Then** it returns `{ left: 9, right: 9, answer: 18 }`

### AC3: A mid-range draw maps to the documented operands
**Given** an `rng` returning `0.5` then `0.2`
**When** `generatePuzzle(rng)` is called
**Then** it returns `{ left: 5, right: 2, answer: 7 }`

### AC4: The generator draws exactly twice
**Given** an `rng` that counts its calls
**When** `generatePuzzle(rng)` is called once
**Then** the counter reads exactly `2`

### AC5: The answer is always the sum of the operands
**Given** an `rng` returning any sequence of values in `[0, 1)`
**When** `generatePuzzle(rng)` is called
**Then** `answer === left + right`, and both operands are integers in `1..9`

### AC6: The correct answer is accepted
**Given** `puzzle = { left: 5, right: 2, answer: 7 }`
**When** `checkAnswer(puzzle, "7")` is called
**Then** it returns `true`

### AC7: A wrong answer is rejected
**Given** the same puzzle
**When** `checkAnswer(puzzle, "8")` is called
**Then** it returns `false`

### AC8: A leading zero is still the same number
**Given** the same puzzle
**When** `checkAnswer(puzzle, "07")` is called
**Then** it returns `true`

### AC9: Empty input is rejected, not an error
**Given** the same puzzle
**When** `checkAnswer(puzzle, "")` is called
**Then** it returns `false` and nothing is thrown

### AC10: A digit is appended to empty input
**Given** `input = ""`
**When** `appendDigit(input, "5")` is called
**Then** it returns `"5"`

### AC11: A second digit is appended
**Given** `input = "1"`
**When** `appendDigit(input, "2")` is called
**Then** it returns `"12"`

### AC12: A third digit is ignored
**Given** `input = "12"`
**When** `appendDigit(input, "3")` is called
**Then** it returns `"12"` unchanged

## Files to Modify
| File | Change |
|---|---|
| `src/domain/types.ts` | Add the `Puzzle` interface: `left`, `right`, `answer`, all `number` |
| `src/domain/puzzle.ts` | New. `generatePuzzle`, `checkAnswer`, `appendDigit` |
| `src/domain/puzzle.test.ts` | New. One test per row of the testing strategy |

## Risk
- **What could break:** nothing depends on this yet. The trap is writing
  `Math.random()` inside `generatePuzzle` — every AC above becomes untestable
  the moment that happens, and the failure is silent.
- **Two-character input** assumes the answer never exceeds 18. If the
  difficulty is ever raised, AC12 and `appendDigit` both have to change; the
  cap is a single constant so the change is one line.
- **No clear or backspace key** — see the open question in `ar-panel.md`.
- **Rollback:** delete the two files.

## Testing Strategy (MANDATORY)
| Function | Case | Given | When | Then |
|---|---|---|---|---|
| `generatePuzzle` | boundary | `rng` returns `0` | called | `{ left: 1, right: 1, answer: 2 }` (AC1) |
| `generatePuzzle` | boundary | `rng` returns `0.9999999` | called | `{ left: 9, right: 9, answer: 18 }` (AC2) |
| `generatePuzzle` | happy path | `rng` returns `0.5`, `0.2` | called | `{ left: 5, right: 2, answer: 7 }` (AC3) |
| `generatePuzzle` | happy path | counting `rng` | called once | counter is `2` (AC4) |
| `generatePuzzle` | property | 100 scripted draws in `[0,1)` | called | `answer === left + right`, operands in `1..9` (AC5) |
| `checkAnswer` | happy path | answer `7`, input `"7"` | called | `true` (AC6) |
| `checkAnswer` | error case | answer `7`, input `"8"` | called | `false` (AC7) |
| `checkAnswer` | edge case | answer `7`, input `"07"` | called | `true` (AC8) |
| `checkAnswer` | error case | answer `7`, input `""` | called | `false`, no throw (AC9) |
| `checkAnswer` | edge case | answer `7`, input `"7 "` | called | `true` — surrounding whitespace ignored |
| `appendDigit` | happy path | `""` + `"5"` | called | `"5"` (AC10) |
| `appendDigit` | happy path | `"1"` + `"2"` | called | `"12"` (AC11) |
| `appendDigit` | boundary | `"12"` + `"3"` | called | `"12"` (AC12) |

## Spec Readiness checklist
- [x] Every AC has a precise expected value — no "works correctly"
- [x] Another person could write a test from each AC without asking
- [x] Every AC can fail — one that cannot fail proves nothing
- [x] Error and edge cases have ACs of their own
- [x] Every AC appears in the testing strategy table
