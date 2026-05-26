import type { SparePart } from '../types/sparePart';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface CreateSparePartInput {
  name: string;
  brand: string;
  category: string;
  reference: string;
  price: number;
  stock: number;
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export const sparePartsApi = {
  async list(): Promise<SparePart[]> {
    const res = await fetch(`${API_URL}/spare-parts`);
    return handle<SparePart[]>(res);
  },

  async create(input: CreateSparePartInput): Promise<SparePart> {
    const res = await fetch(`${API_URL}/spare-parts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handle<SparePart>(res);
  },

  async health(): Promise<{ status: string; service: string }> {
    const res = await fetch(`${API_URL}/health`);
    return handle(res);
  },
};
