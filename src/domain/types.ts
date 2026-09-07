/** A point on the earth, as reported by the location adapter. */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/** A place the player must reach, and how close counts as reaching it. */
export interface EscapePoint {
  id: string;
  name: string;
  coordinates: Coordinates;
  radiusMeters: number;
}

/** One arithmetic task: two operands and the sum they add up to. */
export interface Puzzle {
  left: number;
  right: number;
  answer: number;
}
