import type { Puzzle } from './types';

const MIN_OPERAND = 1;
const MAX_OPERAND = 9;
/** The largest answer is 18, so two characters is the whole input. */
const MAX_INPUT_LENGTH = 2;

function drawOperand(rng: () => number): number {
  const span = MAX_OPERAND - MIN_OPERAND + 1;
  return Math.floor(rng() * span) + MIN_OPERAND;
}

/**
 * Draws one addition task. Randomness is injected so the function stays pure
 * and every criterion can state an exact expected value.
 * See specs/features/puzzle.md.
 */
export function generatePuzzle(rng: () => number): Puzzle {
  const left = drawOperand(rng);
  const right = drawOperand(rng);

  return { left, right, answer: left + right };
}

/** Whether the typed input is the puzzle's answer. */
export function checkAnswer(puzzle: Puzzle, input: string): boolean {
  return Number.parseInt(input.trim(), 10) === puzzle.answer;
}

/** Appends one digit to the typed input, refusing to grow past two. */
export function appendDigit(input: string, digit: string): string {
  if (input.length >= MAX_INPUT_LENGTH) {
    return input;
  }
  return input + digit;
}
