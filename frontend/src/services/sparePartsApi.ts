import type { SparePart, SparePartStatus } from '../types/sparePart';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface CreateSparePartInput {
  name: string;
  brand: string;
  category: string;
  reference: string;
  price: number;
  stock: number;
}

export type UpdateSparePartInput = Partial<CreateSparePartInput>;

export interface SparePartsQuery {
  status?: SparePartStatus | '';
  search?: string;
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

function buildQuery(params: SparePartsQuery = {}): string {
  const search = new URLSearchParams();
  if (params.status) search.set('status', params.status);
  if (params.search) search.set('search', params.search);
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export const sparePartsApi = {
  async list(params: SparePartsQuery = {}): Promise<SparePart[]> {
    const res = await fetch(`${API_URL}/spare-parts${buildQuery(params)}`);
    return handle<SparePart[]>(res);
  },

  async get(id: string): Promise<SparePart> {
    const res = await fetch(`${API_URL}/spare-parts/${id}`);
    return handle<SparePart>(res);
  },

  async create(input: CreateSparePartInput): Promise<SparePart> {
    const res = await fetch(`${API_URL}/spare-parts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handle<SparePart>(res);
  },

  async update(id: string, input: UpdateSparePartInput): Promise<SparePart> {
    const res = await fetch(`${API_URL}/spare-parts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handle<SparePart>(res);
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/spare-parts/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`API ${res.status}: ${body}`);
    }
  },

  async health(): Promise<{ status: string; service: string }> {
    const res = await fetch(`${API_URL}/health`);
    return handle(res);
  },
};
