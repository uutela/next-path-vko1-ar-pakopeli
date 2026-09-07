import { distanceMeters, isWithinRadius } from './distance';
import { appendDigit, checkAnswer, generatePuzzle } from './puzzle';
import type {
  Coordinates,
  EscapePoint,
  GameEvent,
  GameState,
  TransitionContext,
} from './types';

/** The point in range whose centre is closest, or undefined if none is. */
function nearestPointInRange(
  coordinates: Coordinates,
  points: EscapePoint[],
): EscapePoint | undefined {
  let nearest: EscapePoint | undefined;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const point of points) {
    if (!isWithinRadius(coordinates, point)) {
      continue;
    }
    const distance = distanceMeters(coordinates, point.coordinates);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = point;
    }
  }

  return nearest;
}

/**
 * The only place a game rule lives. Pure: no clock, no network, no GPS.
 * Events that do not apply to the current state return it unchanged.
 * See specs/features/game-state.md.
 */
export function transition(
  state: GameState,
  event: GameEvent,
  ctx: TransitionContext,
): GameState {
  if (event.kind === 'RESET') {
    return { kind: 'MAP' };
  }

  switch (state.kind) {
    case 'MAP':
    case 'NEAR': {
      if (event.kind === 'LOCATION_CHANGED') {
        const point = nearestPointInRange(event.coordinates, ctx.points);
        return point ? { kind: 'NEAR', point } : { kind: 'MAP' };
      }
      if (state.kind === 'NEAR' && event.kind === 'OPEN_PUZZLE') {
        return {
          kind: 'PUZZLE',
          point: state.point,
          puzzle: generatePuzzle(ctx.rng),
          input: '',
        };
      }
      return state;
    }

    case 'PUZZLE': {
      switch (event.kind) {
        case 'DIGIT_PRESSED':
          return { ...state, input: appendDigit(state.input, event.digit) };
        case 'CLEAR':
          // An already empty input is returned as-is, so React sees no change.
          return state.input === '' ? state : { ...state, input: '' };
        case 'SUBMIT':
          if (state.input === '') {
            return state;
          }
          return checkAnswer(state.puzzle, state.input)
            ? { kind: 'SOLVED', point: state.point }
            : { ...state, input: '' };
        default:
          // A puzzle stays open when the player drifts out of range: GPS
          // wobble would otherwise close the panel mid-answer. See AC5.
          return state;
      }
    }

    case 'SOLVED':
      return state;
  }
}
