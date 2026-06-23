import { useEffect, useState, type FormEvent } from 'react';
import {
  sparePartsApi,
  type CreateSparePartInput,
} from '../services/sparePartsApi';
import type { SparePart } from '../types/sparePart';

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

function toFormValues(part: SparePart): CreateSparePartInput {
  return {
    name: part.name,
    brand: part.brand,
    category: part.category,
    reference: part.reference,
    price: part.price,
    stock: part.stock,
  };
}

interface Props {
  editing?: SparePart | null;
  onSaved: () => void;
  onCancelEdit?: () => void;
}

export function SparePartForm({ editing, onSaved, onCancelEdit }: Props) {
  const [form, setForm] = useState<CreateSparePartInput>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(editing);

  useEffect(() => {
    setForm(editing ? toFormValues(editing) : EMPTY);
    setError(null);
  }, [editing]);

  const update = <K extends keyof CreateSparePartInput>(
    key: K,
    value: CreateSparePartInput[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (editing) {
        await sparePartsApi.update(editing.id, form);
      } else {
        await sparePartsApi.create(form);
      }
      setForm(EMPTY);
      onSaved();
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
        border: `1px solid ${isEdit ? '#2563eb' : '#ddd'}`,
        borderRadius: '8px',
        marginBottom: '1.5rem',
      }}
    >
      <h3 style={{ gridColumn: '1 / -1', margin: 0 }}>
        {isEdit ? `Editar: ${editing?.name}` : 'Nuevo repuesto'}
      </h3>

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

      <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.5rem' }}>
        <button
          type="submit"
          disabled={submitting}
          style={{
            flex: 1,
            padding: '0.6rem',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: submitting ? 'not-allowed' : 'pointer',
          }}
        >
          {submitting
            ? 'Guardando...'
            : isEdit
              ? 'Actualizar repuesto'
              : 'Crear repuesto'}
        </button>
        {isEdit && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={submitting}
            style={{
              padding: '0.6rem 1rem',
              background: 'white',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
