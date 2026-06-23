import type { SparePartStatus } from '../types/sparePart';

export interface Filters {
  status: SparePartStatus | '';
  search: string;
}

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const STATUS_OPTIONS: { value: SparePartStatus | ''; label: string }[] = [
  { value: '', label: 'Todos los estados' },
  { value: 'disponible', label: 'Disponible' },
  { value: 'bajo_stock', label: 'Bajo stock' },
  { value: 'agotado', label: 'Agotado' },
];

export function FilterBar({ filters, onChange }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '1rem',
        flexWrap: 'wrap',
      }}
    >
      <input
        placeholder="Buscar por nombre, marca o categoría..."
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        style={{
          flex: 1,
          minWidth: '220px',
          padding: '0.5rem',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
        }}
      />
      <select
        value={filters.status}
        onChange={(e) =>
          onChange({ ...filters, status: e.target.value as Filters['status'] })
        }
        style={{
          padding: '0.5rem',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
        }}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
