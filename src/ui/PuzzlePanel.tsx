import { ViroFlexView, ViroText } from '@reactvision/react-viro';
import { useEffect, useRef } from 'react';
import { FANFARE } from '../adapters/audio';
import type { AudioPlayer } from '../adapters/audio';
import type { GameEvent, GameState } from '../domain/types';

/**
 * Viro lays out in metres of world space, not React Native points. A 0.06 m
 * key on a panel 0.6 m away subtends 5.7 degrees — several times the angular
 * size of a phone touch target, which is the margin a whole arm needs.
 * See specs/features/ar-panel.md AC15.
 */
export const PANEL_DISTANCE_METRES = 0.6;
export const KEY_SIZE = 0.06;

/** The telephone arrangement, as rows rather than as a consequence of
 * wrapping, so the layout is structural and cannot drift with a width. */
const KEY_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['C', '0', 'OK'],
] as const;

export interface PuzzlePanelProps {
  state: Extract<GameState, { kind: 'PUZZLE' } | { kind: 'SOLVED' }>;
  onEvent: (event: GameEvent) => void;
  audio: AudioPlayer;
}

function eventForKey(label: string): GameEvent {
  if (label === 'OK') {
    return { kind: 'SUBMIT' };
  }
  if (label === 'C') {
    return { kind: 'CLEAR' };
  }
  return { kind: 'DIGIT_PRESSED', digit: label };
}

/** The anchored panel: puzzle text, the typed input, and the keypad. */
export function PuzzlePanel({ state, onEvent, audio }: PuzzlePanelProps) {
  const fanfarePlayed = useRef(false);

  useEffect(() => {
    if (state.kind === 'SOLVED' && !fanfarePlayed.current) {
      fanfarePlayed.current = true;
      audio.play(FANFARE);
    }
  }, [state.kind, audio]);

  if (state.kind === 'SOLVED') {
    return (
      <ViroFlexView viroTag="panel" position={[0, 0, -PANEL_DISTANCE_METRES]} style={panel}>
        <ViroText text="Oikein! Laatikko aukesi." style={title} />
        <ViroFlexView viroTag="reset" onClick={() => onEvent({ kind: 'RESET' })} style={key}>
          <ViroText text="Aloita alusta" style={keyLabel} />
        </ViroFlexView>
      </ViroFlexView>
    );
  }

  return (
    <ViroFlexView viroTag="panel" position={[0, 0, -PANEL_DISTANCE_METRES]} style={panel}>
      <ViroText text={`${state.puzzle.left} + ${state.puzzle.right} = ?`} style={title} />
      <ViroFlexView viroTag="input-display" style={display}>
        <ViroText text={state.input} style={title} />
      </ViroFlexView>
      {KEY_ROWS.map((row, index) => (
        <ViroFlexView key={row.join('')} viroTag={`key-row-${index}`} style={keyRow}>
          {row.map((label) => (
            <ViroFlexView
              key={label}
              viroTag={`key-${label}`}
              onClick={() => onEvent(eventForKey(label))}
              style={key}
            >
              <ViroText text={label} style={keyLabel} />
            </ViroFlexView>
          ))}
        </ViroFlexView>
      ))}
    </ViroFlexView>
  );
}

/**
 * Every size is in metres of world space, and every ViroText carries an
 * explicit width and height. Viro gives an unsized text box roughly a metre
 * on a side, which inside a 0.36 m panel overflowed the column and clipped
 * away the title, the input and eleven of the twelve keys — on the device the
 * panel showed only its background, the input strip and one key.
 *
 * Nothing in jsdom can see this: the tests render Viro through a stand-in that
 * turns every element into a div, so they prove what the component asks Viro
 * to draw and never how Viro draws it.
 */
const ROW_HEIGHT = KEY_SIZE + 0.008;

const panel = {
  width: 0.3,
  height: 0.44,
  flexDirection: 'column' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  backgroundColor: '#faf9f7',
  padding: 0.01,
};
const keyRow = {
  width: 0.22,
  height: ROW_HEIGHT,
  flexDirection: 'row' as const,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};
const title = {
  width: 0.28,
  height: 0.05,
  fontSize: 20,
  color: '#1a1a1a',
  textAlign: 'center' as const,
  textAlignVertical: 'center' as const,
};
const display = {
  width: 0.28,
  height: 0.05,
  backgroundColor: '#ffffff',
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};
const key = {
  width: KEY_SIZE,
  height: KEY_SIZE,
  margin: 0.004,
  backgroundColor: '#e7e5e4',
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};
const keyLabel = {
  width: KEY_SIZE,
  height: KEY_SIZE,
  fontSize: 18,
  color: '#1a1a1a',
  textAlign: 'center' as const,
  textAlignVertical: 'center' as const,
};
