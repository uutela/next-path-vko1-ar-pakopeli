import { createElement } from 'react';
import type { ReactNode } from 'react';
import { KEY_SIZE, PANEL_DISTANCE_METRES, PANEL_MATERIAL, PuzzlePanel } from './PuzzlePanel';
import { describePanelBehaviour } from './panelBehaviour';

/**
 * Viro is a native renderer. These stand-ins record what our component asks it
 * to draw; `viroTag` and `onClick` are real Viro props, so the tags the shared
 * suite queries are the component's own output.
 */
vi.mock('@reactvision/react-viro', () => ({
  ViroMaterials: { createMaterials: () => undefined },
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
  ViroNode: ({ children, viroTag }: { children?: ReactNode; viroTag?: string }) =>
    createElement('div', { 'data-testid': viroTag }, children),
}));

describePanelBehaviour('PuzzlePanel (anchored)', PuzzlePanel);

describe('PuzzlePanel (anchored) surface', () => {
  it('AC23: the panel is visible from behind', () => {
    expect(PANEL_MATERIAL.cullMode).toBe('None');
  });
});

describe('PuzzlePanel (anchored) sizing', () => {
  it('AC15: every key is large enough to hit at arm’s length', () => {
    expect(KEY_SIZE).toBeGreaterThanOrEqual(0.24);
    expect(PANEL_DISTANCE_METRES).toBeGreaterThan(0);
    expect(PANEL_DISTANCE_METRES).toBeLessThanOrEqual(2.8);

    // Only the angle reaches a player, so state it: four times the geometry at
    // four times the distance is the same key to aim at.
    const degrees = (2 * Math.atan(KEY_SIZE / 2 / PANEL_DISTANCE_METRES) * 180) / Math.PI;
    expect(degrees).toBeGreaterThanOrEqual(4.9);
  });
});
