import { useCallback, useEffect, useState } from 'react';
import { sparePartsApi } from './services/sparePartsApi';
import type { SparePart } from './types/sparePart';
import { SparePartForm } from './components/SparePartForm';
import { SparePartList } from './components/SparePartList';
import { FilterBar, type Filters } from './components/FilterBar';
import { DashboardStats } from './components/DashboardStats';

const EMPTY_FILTERS: Filters = { status: '', search: '' };

export function App() {
  const [parts, setParts] = useState<SparePart[]>([]);
  const [allParts, setAllParts] = useState<SparePart[]>([]);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [editing, setEditing] = useState<SparePart | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<'ok' | 'down' | 'unknown'>('unknown');
  const [error, setError] = useState<string | null>(null);

  const loadFiltered = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await sparePartsApi.list(filters);
      setParts(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadStats = useCallback(async () => {
    try {
      setAllParts(await sparePartsApi.list());
    } catch {
      /* la tabla ya muestra el error; las tarjetas quedan con el último valor */
    }
  }, []);

  useEffect(() => {
    sparePartsApi
      .health()
      .then(() => setApiStatus('ok'))
      .catch(() => setApiStatus('down'));
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadFiltered();
  }, [loadFiltered]);

  const refresh = useCallback(() => {
    setEditing(null);
    loadFiltered();
    loadStats();
  }, [loadFiltered, loadStats]);

  const handleDelete = useCallback(
    async (part: SparePart) => {
      if (!window.confirm(`¿Eliminar "${part.name}"?`)) return;
      try {
        await sparePartsApi.remove(part.id);
        refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    },
    [refresh],
  );

  return (
    <main
      style={{
        fontFamily: 'system-ui, sans-serif',
        padding: '2rem',
        maxWidth: '960px',
        margin: '0 auto',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
        }}
      >
        <h1 style={{ margin: 0 }}>MotoStock CI</h1>
        <span
          style={{
            fontSize: '0.85rem',
            color: apiStatus === 'ok' ? '#16a34a' : '#dc2626',
          }}
        >
          API: {apiStatus}
        </span>
      </header>

      <DashboardStats items={allParts} />

      <SparePartForm
        editing={editing}
        onSaved={refresh}
        onCancelEdit={() => setEditing(null)}
      />

      <h2 style={{ margin: '0 0 0.75rem' }}>Repuestos registrados</h2>

      <FilterBar filters={filters} onChange={setFilters} />

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}
      {!loading && !error && (
        <SparePartList
          items={parts}
          onEdit={setEditing}
          onDelete={handleDelete}
        />
      )}
    </main>
  );
}
