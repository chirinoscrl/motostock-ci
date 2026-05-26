export type SparePartStatus = 'disponible' | 'bajo_stock' | 'agotado';

export interface SparePart {
  _id: string;
  name: string;
  brand: string;
  category: string;
  reference: string;
  price: number;
  stock: number;
  status: SparePartStatus;
  createdAt: string;
  updatedAt: string;
}
