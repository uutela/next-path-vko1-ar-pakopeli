import { render, screen } from '@testing-library/react';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { KEY_SIZE, PANEL_DISTANCE_METRES, PuzzlePanel } from './PuzzlePanel';
import type { PuzzlePanelProps } from './PuzzlePanel';
import { FANFARE } from '../adapters/audio';
import type { AudioPlayer } from '../adapters/audio';
import type { EscapePoint, GameEvent, GameState } from '../domain/types';

/**
 * Viro is a native renderer. These stand-ins record what our component asks it
 * to draw; `viroTag` is a real Viro prop, so the tags below are the
 * component's own output rather than something the mock invents.
 */
vi.mock('@reactvision/react-viro', () => ({
  ViroFlexView: ({
    children,
    onClick,
    viroTag,
  }: {
    children?: ReactNode;
    onClick?: () => void;
    viroTag?: string;
  }) =>
    createElement(
      'div',
      { 'data-testid': viroTag, onClick: onClick ? () => onClick() : undefined },
      children,
    ),
  ViroText: ({ text }: { text: string }) => createElement('span', null, text),
  ViroNode: ({ children }: { children?: ReactNode }) => createElement('div', null, children),
}));

const POINT: EscapePoint = {
  id: 'p1',
  name: 'Puisto',
  coordinates: { latitude: 60.1699, longitude: 24.9384 },
  radiusMeters: 20,
};

const PUZZLE_STATE = {
  kind: 'PUZZLE',
  point: POINT,
  puzzle: { left: 5, right: 2, answer: 7 },
  input: '',
} satisfies Extract<GameState, { kind: 'PUZZLE' }>;

const SOLVED_STATE = { kind: 'SOLVED', point: POINT } satisfies Extract<
  GameState,
  { kind: 'SOLVED' }
>;

function harness(state: PuzzlePanelProps['state'] = PUZZLE_STATE) {
  const events: GameEvent[] = [];
  const played: string[] = [];
  const audio: AudioPlayer = { play: (asset) => played.push(asset) };
  const view = render(
    createElement(PuzzlePanel, { state, onEvent: (e: GameEvent) => events.push(e), audio }),
  );
  return { events, played, view };
}

const pressKey = (label: string) => screen.getByTestId(`key-${label}`).click();

describe('PuzzlePanel', () => {
  it('AC2: the panel states the sum in the documented format', () => {
    harness();
    expect(screen.getByText('5 + 2 = ?')).toBeTruthy();
  });

  it('AC3: the keypad has twelve keys', () => {
    harness();
    const labels = screen.getAllByTestId(/^key-/).map((n) => n.textContent);
    expect(labels).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK']);
  });

  it('AC4: a pressed digit is dispatched', () => {
    const { events } = harness();
    pressKey('7');
    expect(events).toEqual([{ kind: 'DIGIT_PRESSED', digit: '7' }]);
  });

  it('AC5: the input display is empty when the input is empty', () => {
    harness();
    expect(screen.getByTestId('input-display').textContent).toBe('');
  });

  it('AC4: the input display shows the current input', () => {
    harness({ ...PUZZLE_STATE, input: '12' });
    expect(screen.getByTestId('input-display').textContent).toBe('12');
  });

  it('AC6: pressing OK submits', () => {
    const { events } = harness({ ...PUZZLE_STATE, input: '7' });
    pressKey('OK');
    expect(events).toEqual([{ kind: 'SUBMIT' }]);
  });

  it('AC7: solving replaces the panel text with the congratulation', () => {
    harness(SOLVED_STATE);
    expect(screen.getByText('Oikein! Laatikko aukesi.')).toBeTruthy();
    expect(screen.queryByText('5 + 2 = ?')).toBeNull();
  });

  it('AC8: the fanfare plays once on solving', () => {
    const played: string[] = [];
    const audio: AudioPlayer = { play: (asset) => played.push(asset) };
    const view = render(
      createElement(PuzzlePanel, { state: PUZZLE_STATE, onEvent: () => undefined, audio }),
    );
    expect(played).toEqual([]);

    view.rerender(
      createElement(PuzzlePanel, { state: SOLVED_STATE, onEvent: () => undefined, audio }),
    );

    expect(played).toEqual([FANFARE]);
  });

  it('AC9: the fanfare does not replay on re-render', () => {
    const played: string[] = [];
    // A fresh adapter object per render, which is what an inline prop gives in
    // real code. Re-rendering with the *same* object proves nothing: React
    // skips an effect whose dependencies have not changed, so the component's
    // own guard would never run.
    const panel = () =>
      createElement(PuzzlePanel, {
        state: SOLVED_STATE,
        onEvent: () => undefined,
        audio: { play: (asset: string) => played.push(asset) } satisfies AudioPlayer,
      });

    const view = render(panel());
    view.rerender(panel());
    view.rerender(panel());

    expect(played).toEqual([FANFARE]);
  });

  it('AC10: a wrong answer keeps the puzzle on screen', () => {
    harness({ ...PUZZLE_STATE, input: '' });
    expect(screen.getByText('5 + 2 = ?')).toBeTruthy();
    expect(screen.getByTestId('input-display').textContent).toBe('');
    expect(screen.queryByText('Oikein! Laatikko aukesi.')).toBeNull();
  });

  it('AC12: the reset control returns to the map', () => {
    const { events } = harness(SOLVED_STATE);
    screen.getByText('Aloita alusta').click();
    expect(events).toEqual([{ kind: 'RESET' }]);
  });

  it('AC13: the clear key empties a mistyped input', () => {
    const { events } = harness({ ...PUZZLE_STATE, input: '12' });
    pressKey('C');
    expect(events).toEqual([{ kind: 'CLEAR' }]);
  });

  it('AC14: the clear key on empty input is harmless', () => {
    const { events } = harness();
    expect(() => pressKey('C')).not.toThrow();
    expect(events).toEqual([{ kind: 'CLEAR' }]);
  });

  it('AC15: every key is large enough to hit at arm’s length', () => {
    expect(KEY_SIZE).toBeGreaterThanOrEqual(0.06);
    expect(PANEL_DISTANCE_METRES).toBeGreaterThan(0);
    expect(PANEL_DISTANCE_METRES).toBeLessThanOrEqual(0.7);
  });
});
