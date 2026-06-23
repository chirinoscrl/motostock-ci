import type { SparePart } from '../types/sparePart';
import { StockBadge } from './StockBadge';

interface Props {
  items: SparePart[];
  onEdit: (part: SparePart) => void;
  onDelete: (part: SparePart) => void;
}

const actionButton: React.CSSProperties = {
  padding: '0.25rem 0.6rem',
  fontSize: '0.8rem',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  background: 'white',
  cursor: 'pointer',
};

export function SparePartList({ items, onEdit, onDelete }: Props) {
  if (items.length === 0) {
    return <p style={{ color: '#666' }}>No hay repuestos que coincidan.</p>;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
          <th style={{ padding: '0.5rem' }}>Nombre</th>
          <th style={{ padding: '0.5rem' }}>Marca</th>
          <th style={{ padding: '0.5rem' }}>Categoría</th>
          <th style={{ padding: '0.5rem' }}>Ref.</th>
          <th style={{ padding: '0.5rem', textAlign: 'right' }}>Precio</th>
          <th style={{ padding: '0.5rem', textAlign: 'right' }}>Stock</th>
          <th style={{ padding: '0.5rem' }}>Estado</th>
          <th style={{ padding: '0.5rem', textAlign: 'right' }}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {items.map((part) => (
          <tr key={part.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
            <td style={{ padding: '0.5rem' }}>{part.name}</td>
            <td style={{ padding: '0.5rem' }}>{part.brand}</td>
            <td style={{ padding: '0.5rem' }}>{part.category}</td>
            <td style={{ padding: '0.5rem' }}>{part.reference}</td>
            <td style={{ padding: '0.5rem', textAlign: 'right' }}>
              {part.price.toLocaleString()}
            </td>
            <td style={{ padding: '0.5rem', textAlign: 'right' }}>{part.stock}</td>
            <td style={{ padding: '0.5rem' }}>
              <StockBadge status={part.status} />
            </td>
            <td style={{ padding: '0.5rem', textAlign: 'right' }}>
              <div
                style={{
                  display: 'flex',
                  gap: '0.4rem',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  type="button"
                  style={actionButton}
                  onClick={() => onEdit(part)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  style={{ ...actionButton, color: '#dc2626' }}
                  onClick={() => onDelete(part)}
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
