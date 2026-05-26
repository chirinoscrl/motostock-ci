import { useCallback, useEffect, useState } from 'react';
import { sparePartsApi } from './services/sparePartsApi';
import type { SparePart } from './types/sparePart';
import { SparePartForm } from './components/SparePartForm';
import { SparePartList } from './components/SparePartList';

export function App() {
  const [parts, setParts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<'ok' | 'down' | 'unknown'>('unknown');
  const [error, setError] = useState<string | null>(null);

  const loadParts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await sparePartsApi.list();
      setParts(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    sparePartsApi
      .health()
      .then(() => setApiStatus('ok'))
      .catch(() => setApiStatus('down'));
    loadParts();
  }, [loadParts]);

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

      <SparePartForm onCreated={loadParts} />

      <h2 style={{ margin: '0 0 0.75rem' }}>Repuestos registrados</h2>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}
      {!loading && !error && <SparePartList items={parts} />}
    </main>
  );
}
