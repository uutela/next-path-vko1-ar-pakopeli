import { distanceMeters } from './distance';

describe('distanceMeters', () => {
  it('AC1: identical coordinates are zero metres apart', () => {
    const a = { latitude: 60.1699, longitude: 24.9384 };
    const b = { latitude: 60.1699, longitude: 24.9384 };

    expect(distanceMeters(a, b)).toBe(0);
  });
});
