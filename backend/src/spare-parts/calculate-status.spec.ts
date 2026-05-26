import { calculateStatus } from './calculate-status';

describe('calculateStatus', () => {
  it('returns "agotado" when stock is 0', () => {
    expect(calculateStatus(0)).toBe('agotado');
  });

  it('returns "bajo_stock" when stock is between 1 and 5', () => {
    expect(calculateStatus(1)).toBe('bajo_stock');
    expect(calculateStatus(3)).toBe('bajo_stock');
    expect(calculateStatus(5)).toBe('bajo_stock');
  });

  it('returns "disponible" when stock is greater than 5', () => {
    expect(calculateStatus(6)).toBe('disponible');
    expect(calculateStatus(100)).toBe('disponible');
  });
});
