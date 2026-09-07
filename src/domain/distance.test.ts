import { distanceMeters } from './distance';

describe('distanceMeters', () => {
  it('AC1: identical coordinates are zero metres apart', () => {
    const a = { latitude: 60.1699, longitude: 24.9384 };
    const b = { latitude: 60.1699, longitude: 24.9384 };

    expect(distanceMeters(a, b)).toBe(0);
  });

  it('AC2: a known 20 m north offset measures 20 m', () => {
    const a = { latitude: 60.1699, longitude: 24.9384 };
    const b = { latitude: 60.1700798643, longitude: 24.9384 };

    expect(Math.abs(distanceMeters(a, b) - 20.0)).toBeLessThanOrEqual(0.01);
  });
});
