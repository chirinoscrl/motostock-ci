import type { SparePart } from '../types/sparePart';

interface Props {
  items: SparePart[];
}

function Card({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: '120px',
        padding: '0.9rem 1rem',
        border: '1px solid #e5e7eb',
        borderLeft: `4px solid ${color}`,
        borderRadius: '8px',
        background: '#fafafa',
      }}
    >
      <div style={{ fontSize: '1.6rem', fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{label}</div>
    </div>
  );
}

export function DashboardStats({ items }: Props) {
  const total = items.length;
  const lowStock = items.filter((p) => p.status === 'bajo_stock').length;
  const outOfStock = items.filter((p) => p.status === 'agotado').length;
  const available = items.filter((p) => p.status === 'disponible').length;

  return (
    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
      <Card label="Total" value={total} color="#2563eb" />
      <Card label="Disponibles" value={available} color="#16a34a" />
      <Card label="Bajo stock" value={lowStock} color="#d97706" />
      <Card label="Agotados" value={outOfStock} color="#dc2626" />
    </div>
  );
}
