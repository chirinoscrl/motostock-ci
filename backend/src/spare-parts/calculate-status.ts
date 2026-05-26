export type SparePartStatus = 'disponible' | 'bajo_stock' | 'agotado';

export function calculateStatus(stock: number): SparePartStatus {
  if (stock <= 0) return 'agotado';
  if (stock <= 5) return 'bajo_stock';
  return 'disponible';
}
