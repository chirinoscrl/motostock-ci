import type { SparePart } from '../types/sparePart';
import { StockBadge } from './StockBadge';

interface Props {
  items: SparePart[];
}

export function SparePartList({ items }: Props) {
  if (items.length === 0) {
    return <p style={{ color: '#666' }}>No hay repuestos registrados todavía.</p>;
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}
