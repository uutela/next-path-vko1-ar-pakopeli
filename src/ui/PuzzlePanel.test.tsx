import { createElement } from 'react';
import type { ReactNode } from 'react';
import { KEY_SIZE, PANEL_DISTANCE_METRES, PuzzlePanel } from './PuzzlePanel';
import { describePanelBehaviour } from './panelBehaviour';

/**
 * Viro is a native renderer. These stand-ins record what our component asks it
 * to draw; `viroTag` and `onClick` are real Viro props, so the tags the shared
 * suite queries are the component's own output.
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

describePanelBehaviour('PuzzlePanel (anchored)', PuzzlePanel);

describe('PuzzlePanel (anchored) sizing', () => {
  it('AC15: every key is large enough to hit at arm’s length', () => {
    expect(KEY_SIZE).toBeGreaterThanOrEqual(0.06);
    expect(PANEL_DISTANCE_METRES).toBeGreaterThan(0);
    expect(PANEL_DISTANCE_METRES).toBeLessThanOrEqual(0.7);
  });
});
