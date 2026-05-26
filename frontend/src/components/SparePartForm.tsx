import { useState, type FormEvent } from 'react';
import { sparePartsApi, type CreateSparePartInput } from '../services/sparePartsApi';

const CATEGORIES = [
  'Motor',
  'Frenos',
  'Llantas',
  'Transmisión',
  'Suspensión',
  'Eléctrico',
  'Accesorios',
  'Lubricantes',
];

const EMPTY: CreateSparePartInput = {
  name: '',
  brand: '',
  category: CATEGORIES[0],
  reference: '',
  price: 0,
  stock: 0,
};

interface Props {
  onCreated: () => void;
}

export function SparePartForm({ onCreated }: Props) {
  const [form, setForm] = useState<CreateSparePartInput>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof CreateSparePartInput>(
    key: K,
    value: CreateSparePartInput[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await sparePartsApi.create(form);
      setForm(EMPTY);
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setSubmitting(false);
    }
  };

  const field: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.75rem',
        padding: '1rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '1.5rem',
      }}
    >
      <label style={field}>
        Nombre
        <input
          required
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
        />
      </label>
      <label style={field}>
        Marca
        <input
          required
          value={form.brand}
          onChange={(e) => update('brand', e.target.value)}
        />
      </label>
      <label style={field}>
        Categoría
        <select
          value={form.category}
          onChange={(e) => update('category', e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label style={field}>
        Referencia
        <input
          required
          value={form.reference}
          onChange={(e) => update('reference', e.target.value)}
        />
      </label>
      <label style={field}>
        Precio
        <input
          required
          type="number"
          min={0}
          value={form.price}
          onChange={(e) => update('price', Number(e.target.value))}
        />
      </label>
      <label style={field}>
        Stock
        <input
          required
          type="number"
          min={0}
          step={1}
          value={form.stock}
          onChange={(e) => update('stock', Number(e.target.value))}
        />
      </label>

      {error && (
        <p style={{ gridColumn: '1 / -1', color: '#dc2626', margin: 0 }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        style={{
          gridColumn: '1 / -1',
          padding: '0.6rem',
          background: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: submitting ? 'not-allowed' : 'pointer',
        }}
      >
        {submitting ? 'Guardando...' : 'Crear repuesto'}
      </button>
    </form>
  );
}
