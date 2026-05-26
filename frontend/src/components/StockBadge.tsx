import type { SparePartStatus } from '../types/sparePart';

const LABELS: Record<SparePartStatus, string> = {
  disponible: 'Disponible',
  bajo_stock: 'Bajo stock',
  agotado: 'Agotado',
};

const COLORS: Record<SparePartStatus, string> = {
  disponible: '#16a34a',
  bajo_stock: '#d97706',
  agotado: '#dc2626',
};

export function StockBadge({ status }: { status: SparePartStatus }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.15rem 0.6rem',
        borderRadius: '999px',
        fontSize: '0.8rem',
        color: 'white',
        background: COLORS[status],
      }}
    >
      {LABELS[status]}
    </span>
  );
}
