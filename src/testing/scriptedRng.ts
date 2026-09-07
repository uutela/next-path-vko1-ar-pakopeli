/**
 * An rng that hands back a scripted sequence and then repeats its last value.
 *
 * Randomness is injected throughout the domain so that every acceptance
 * criterion can name an exact expected value; this is the function tests pass
 * where production passes `Math.random`.
 */
export function scriptedRng(...values: number[]): () => number {
  let index = 0;
  return () => values[Math.min(index++, values.length - 1)] ?? 0;
}
