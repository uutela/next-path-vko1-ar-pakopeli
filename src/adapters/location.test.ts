import { createLocationSource, createMockLocationSource } from './location';
import type { PositionProvider } from './location';
import type { Coordinates } from '../domain/types';

const INSIDE: Coordinates = { latitude: 60.1700708711, longitude: 24.9384 };
const OUTSIDE: Coordinates = { latitude: 60.1707993216, longitude: 24.9384 };

describe('createMockLocationSource', () => {
  it('AC8: emits its scripted coordinates in order', () => {
    const seen: Coordinates[] = [];
    const source = createMockLocationSource([INSIDE, OUTSIDE]);
    source.watch((c) => seen.push(c));

    source.advance();
    source.advance();

    expect(seen).toEqual([INSIDE, OUTSIDE]);
  });

  it('AC9: a cancelled source stops emitting', () => {
    const seen: Coordinates[] = [];
    const source = createMockLocationSource([INSIDE, OUTSIDE]);
    const cancel = source.watch((c) => seen.push(c));

    source.advance();
    cancel();
    source.advance();

    expect(seen).toEqual([INSIDE]);
  });

  it('AC8: an empty list never calls back', () => {
    const seen: Coordinates[] = [];
    const source = createMockLocationSource([]);
    source.watch((c) => seen.push(c));

    expect(() => source.advance()).not.toThrow();
    expect(seen).toEqual([]);
  });
});

describe('createLocationSource', () => {
  /** A provider whose current position and changes are both driven by hand. */
  function fakeProvider(current: Coordinates) {
    let resolveCurrent: (c: Coordinates) => void = () => undefined;
    const pending = new Promise<Coordinates>((resolve) => {
      resolveCurrent = resolve;
    });
    let listener: ((c: Coordinates) => void) | undefined;
    let stopped = 0;

    const provider: PositionProvider = {
      getCurrent: () => pending,
      watch: (onChange) => {
        listener = onChange;
        return Promise.resolve(() => {
          stopped += 1;
          listener = undefined;
        });
      },
    };

    return {
      provider,
      deliverCurrent: () => resolveCurrent(current),
      move: (to: Coordinates) => listener?.(to),
      stopped: () => stopped,
    };
  }

  it('AC10: a device that never moves still gets a position', async () => {
    const seen: Coordinates[] = [];
    const fake = fakeProvider(INSIDE);
    createLocationSource(fake.provider).watch((c) => seen.push(c));

    fake.deliverCurrent();
    await Promise.resolve();
    await Promise.resolve();

    expect(seen).toEqual([INSIDE]);
  });

  it('AC11: movement after the first position is delivered too', async () => {
    const seen: Coordinates[] = [];
    const fake = fakeProvider(INSIDE);
    createLocationSource(fake.provider).watch((c) => seen.push(c));

    fake.deliverCurrent();
    await Promise.resolve();
    await Promise.resolve();
    fake.move(OUTSIDE);

    expect(seen).toEqual([INSIDE, OUTSIDE]);
  });

  it('AC12: cancelling before the first position arrives delivers nothing', async () => {
    const seen: Coordinates[] = [];
    const fake = fakeProvider(INSIDE);
    const cancel = createLocationSource(fake.provider).watch((c) => seen.push(c));

    cancel();
    fake.deliverCurrent();
    await Promise.resolve();
    await Promise.resolve();

    expect(seen).toEqual([]);
  });
});
