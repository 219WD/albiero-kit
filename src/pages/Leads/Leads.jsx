import { useEffect, useMemo, useState } from 'react';
import AdminNav from '../../components/AdminNav';
import { ADMIN_TOKEN_KEY, getAdminFromToken } from '../../utils/adminSession';
import './Leads.css';

const PROD_API_BASE = 'https://albi-backend-nine.vercel.app';
const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const configuredApiBase = import.meta.env.VITE_ANALYTICS_API_URL || '';
const API_BASE =
  !isLocalHost && configuredApiBase.includes('localhost')
    ? PROD_API_BASE
    : configuredApiBase || (isLocalHost ? 'http://localhost:4000' : PROD_API_BASE);

const RANGES = [
  { value: '7d', label: '7 dias' },
  { value: '30d', label: '30 dias' },
  { value: '90d', label: '90 dias' },
  { value: 'custom', label: 'Rango' },
];
const PAGE_SIZE = 50;

async function apiRequest(endpoint, options = {}, token = '') {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || `Error ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return data;
}

function formatDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function buildQuery(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  return query.toString();
}

function buildWhatsAppUrl(lead) {
  const phone = String(lead.telefono || '').replace(/\D/g, '');
  if (!phone) return '';

  const normalizedPhone = phone.startsWith('54') ? phone : `549${phone}`;
  const name = lead.nombre && lead.nombre !== 'Sin dato' ? lead.nombre : '';
  const text = `Hola ${name}, te contacto de Albiero Seguridad por tu consulta sobre ${lead.producto || 'seguridad'} en ${lead.ubicacion || 'Tucuman'}.`;
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(text)}`;
}

function FilterSelect({ label, value, options = [], onChange }) {
  return (
    <label className="leads-filter">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Todos</option>
        {options.map((option) => (
          <option value={option} key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

export default function Leads() {
  const [token, setToken] = useState(() => localStorage.getItem(ADMIN_TOKEN_KEY) || '');
  const admin = useMemo(() => getAdminFromToken(token), [token]);
  const [range, setRange] = useState('30d');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    producto: '',
    tipo: '',
    ubicacion: '',
    sistema: '',
    status: '',
    search: '',
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [savingKey, setSavingKey] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken('');
  };

  const loadLeads = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const query = buildQuery({
        range,
        from: range === 'custom' ? from : '',
        to: range === 'custom' ? to : '',
        page,
        pageSize: PAGE_SIZE,
        ...filters,
      });
      const nextData = await apiRequest(`/api/analytics/sheet-leads?${query}`, {}, token);
      setData(nextData);
    } catch (err) {
      if (err.status === 401) {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        setToken('');
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, range, from, to, page, filters.producto, filters.tipo, filters.ubicacion, filters.sistema, filters.status]);

  const updateFilter = (field, value) => {
    setPage(1);
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const applySearch = (event) => {
    event.preventDefault();
    setPage(1);
    loadLeads();
  };

  const clearFilters = () => {
    setPage(1);
    setFilters({ producto: '', tipo: '', ubicacion: '', sistema: '', status: '', search: '' });
  };

  const updateStatus = async (lead, status) => {
    if (!lead.rowNumber) {
      setError('Este lead no trae numero de fila desde el backend.');
      return;
    }

    const key = `${lead.rowNumber}-${status}`;
    setSavingKey(key);
    setMessage('');
    setError('');

    try {
      await apiRequest(`/api/analytics/sheet-leads/${lead.rowNumber}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }, token);
      setMessage(`Lead actualizado a ${status}.`);
      await loadLeads();
    } catch (err) {
      setError(err.message || 'No se pudo guardar el estado.');
    } finally {
      setSavingKey('');
    }
  };

  if (!token || !admin) {
    return (
      <main className="leads-page leads-page--center">
        <section className="leads-empty">
          <h1>Leads</h1>
          <p>Tenes que iniciar sesion como admin para administrar leads.</p>
          <a href="/emailmkt">Ir a login</a>
        </section>
      </main>
    );
  }

  const filterOptions = data?.filterOptions || {};
  const pagination = data?.pagination || { page: 1, total: 0, totalPages: 1 };
  const statusOptions = data?.statusOptions || ['Nuevo', 'Contactado', 'Cotizado', 'Vendido', 'Perdido'];

  return (
    <main className="leads-page">
      <AdminNav />

      <header className="leads-header">
        <div>
          <h1>Leads</h1>
          <p>Administra estados y seguimiento comercial desde el Excel.</p>
        </div>
        <div className="leads-actions">
          {data?.sheetUrl && <a href={data.sheetUrl} target="_blank" rel="noreferrer">Abrir Excel</a>}
          <button type="button" onClick={loadLeads}>Actualizar</button>
          <button type="button" className="is-secondary" onClick={logout}>Salir</button>
        </div>
      </header>

      {message && <div className="leads-alert leads-alert--ok">{message}</div>}
      {error && <div className="leads-alert leads-alert--error">{error}</div>}

      <section className="leads-status-row">
        {(data?.statusCounts || []).map((item) => (
          <button
            type="button"
            key={item.label}
            className={filters.status === item.label ? 'is-active' : ''}
            onClick={() => updateFilter('status', filters.status === item.label ? '' : item.label)}
          >
            <span>{item.label}</span>
            <strong>{item.count}</strong>
          </button>
        ))}
      </section>

      <section className="leads-card">
        <div className="leads-toolbar">
          <div className="leads-ranges">
            {RANGES.map((item) => (
              <button
                type="button"
                key={item.value}
                className={range === item.value ? 'is-active' : ''}
                onClick={() => {
                  setRange(item.value);
                  setPage(1);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {range === 'custom' && (
            <div className="leads-date-range">
              <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
              <span>a</span>
              <input type="date" value={to} onChange={(event) => setTo(event.target.value)} />
            </div>
          )}

          <form className="leads-search" onSubmit={applySearch}>
            <input
              type="search"
              placeholder="Buscar nombre, email, zona..."
              value={filters.search}
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            />
            <button type="submit">Buscar</button>
          </form>
        </div>

        <div className="leads-filters">
          <FilterSelect label="Producto" value={filters.producto} options={filterOptions.producto} onChange={(value) => updateFilter('producto', value)} />
          <FilterSelect label="Tipo" value={filters.tipo} options={filterOptions.tipo} onChange={(value) => updateFilter('tipo', value)} />
          <FilterSelect label="Zona" value={filters.ubicacion} options={filterOptions.ubicacion} onChange={(value) => updateFilter('ubicacion', value)} />
          <FilterSelect label="Sistema" value={filters.sistema} options={filterOptions.sistema} onChange={(value) => updateFilter('sistema', value)} />
          <button type="button" className="leads-clear" onClick={clearFilters}>Limpiar</button>
        </div>

        <div className="leads-table-head">
          <p>{loading ? 'Cargando leads...' : `${pagination.total} leads encontrados`}</p>
          <p>Pagina {pagination.page} de {pagination.totalPages}</p>
        </div>

        <div className="leads-table-wrap">
          <table className="leads-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Telefono</th>
                <th>Tipo</th>
                <th>Zona</th>
                <th>Sistema</th>
                <th>Producto</th>
                <th>Estado</th>
                <th>WhatsApp</th>
              </tr>
            </thead>
            <tbody>
              {!loading && data?.leads?.map((lead, index) => (
                <tr key={`${lead.rowNumber}-${index}`}>
                  <td>{formatDateTime(lead.fecha)}</td>
                  <td>{lead.nombre}</td>
                  <td>{lead.email}</td>
                  <td>{lead.telefono || <span className="leads-muted">Sin telefono</span>}</td>
                  <td>{lead.tipo}</td>
                  <td>{lead.ubicacion}</td>
                  <td>{lead.sistema}</td>
                  <td>{lead.producto}</td>
                  <td>
                    <select
                      value={lead.estado || 'Nuevo'}
                      disabled={savingKey.startsWith(`${lead.rowNumber}-`)}
                      onChange={(event) => updateStatus(lead, event.target.value)}
                    >
                      {statusOptions.map((status) => (
                        <option value={status} key={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {buildWhatsAppUrl(lead) ? (
                      <a className="leads-mini-link" href={buildWhatsAppUrl(lead)} target="_blank" rel="noreferrer">Abrir</a>
                    ) : (
                      <span className="leads-muted">Sin telefono</span>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && !data?.leads?.length && (
                <tr>
                  <td colSpan="10" className="leads-empty-row">No hay leads para estos filtros.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="leads-pagination">
          <button type="button" disabled={pagination.page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
            Anterior
          </button>
          <button type="button" disabled={pagination.page >= pagination.totalPages} onClick={() => setPage((current) => current + 1)}>
            Siguiente
          </button>
        </div>
      </section>
    </main>
  );
}
