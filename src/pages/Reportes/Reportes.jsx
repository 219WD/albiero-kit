import { useEffect, useMemo, useState } from 'react';
import AdminNav from '../../components/AdminNav';
import { ADMIN_TOKEN_KEY, getAdminFromToken } from '../../utils/adminSession';
import './Reportes.css';

const PROD_API_BASE = 'https://albi-backend-nine.vercel.app';
const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const configuredApiBase = import.meta.env.VITE_ANALYTICS_API_URL || '';
const API_BASE =
  !isLocalHost && configuredApiBase.includes('localhost')
    ? PROD_API_BASE
    : configuredApiBase || (isLocalHost ? 'http://localhost:4000' : PROD_API_BASE);

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

function pad(value) {
  return String(value).padStart(2, '0');
}

function getPreviousMonthDefaults() {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const last = new Date(now.getFullYear(), now.getMonth(), 0);
  const monthName = first.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });

  return {
    from: `${first.getFullYear()}-${pad(first.getMonth() + 1)}-${pad(first.getDate())}`,
    to: `${last.getFullYear()}-${pad(last.getMonth() + 1)}-${pad(last.getDate())}`,
    periodLabel: monthName.charAt(0).toUpperCase() + monthName.slice(1),
  };
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function buildPublicUrl(token) {
  return `${window.location.origin}/informe/${token}`;
}

function reportFingerprint(report = {}) {
  return JSON.stringify({
    title: report.title || '',
    periodLabel: report.periodLabel || '',
    range: report.range || '',
    from: report.from || '',
    to: report.to || '',
    filters: report.filters || {},
  });
}

function uniqueReports(items = []) {
  const seen = new Set();
  return items.filter((item) => {
    const key = reportFingerprint(item) || item.id || item.token;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const initialDates = getPreviousMonthDefaults();

export default function Reportes() {
  const [token, setToken] = useState(() => localStorage.getItem(ADMIN_TOKEN_KEY) || '');
  const admin = useMemo(() => getAdminFromToken(token), [token]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: 'Informe comercial Albiero',
    periodLabel: initialDates.periodLabel,
    from: initialDates.from,
    to: initialDates.to,
    producto: '',
    tipo: '',
    ubicacion: '',
    sistema: '',
  });

  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken('');
  };

  const loadReports = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await apiRequest('/api/reports', {}, token);
      setReports(uniqueReports(data.reports || []));
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
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const createReport = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const data = await apiRequest('/api/reports', {
        method: 'POST',
        body: JSON.stringify({
          title: form.title,
          periodLabel: form.periodLabel,
          range: 'custom',
          from: form.from,
          to: form.to,
          filters: {
            producto: form.producto,
            tipo: form.tipo,
            ubicacion: form.ubicacion,
            sistema: form.sistema,
          },
        }),
      }, token);
      setReports((current) => uniqueReports([data.report, ...current]));
      setMessage('Informe creado. Ya podes compartir el link publico.');
    } catch (err) {
      setError(err.message || 'No se pudo crear el informe.');
    } finally {
      setSaving(false);
    }
  };

  const toggleReport = async (report) => {
    setMessage('');
    setError('');

    try {
      const data = await apiRequest(`/api/reports/${encodeURIComponent(report.id)}`, {
        method: 'PATCH',
        body: JSON.stringify({ ...report, active: !report.active }),
      }, token);
      setReports((current) => current.map((item) => (item.id === report.id ? data.report : item)));
    } catch (err) {
      setError(err.message || 'No se pudo actualizar el informe.');
    }
  };

  const copyLink = async (report) => {
    const url = buildPublicUrl(report.token);
    await navigator.clipboard?.writeText(url);
    setMessage('Link copiado al portapapeles.');
  };

  if (!token || !admin) {
    return (
      <main className="reportes-page reportes-page--center">
        <section className="reportes-empty">
          <h1>Reportes</h1>
          <p>Tenes que iniciar sesion como admin para crear informes publicos.</p>
          <a href="/emailmkt">Ir a login</a>
        </section>
      </main>
    );
  }

  return (
    <main className="reportes-page">
      <AdminNav />

      <header className="reportes-header">
        <div>
          <h1>Reportes</h1>
          <p>Crea balances publicos con metricas, graficos y descarga en PDF.</p>
        </div>
        <div className="reportes-actions">
          <button type="button" onClick={loadReports}>Actualizar</button>
          <button type="button" className="is-secondary" onClick={logout}>Salir</button>
        </div>
      </header>

      {message && <div className="reportes-alert reportes-alert--ok">{message}</div>}
      {error && <div className="reportes-alert reportes-alert--error">{error}</div>}

      <section className="reportes-layout">
        <form className="reportes-card reportes-form" onSubmit={createReport}>
          <h2>Nuevo informe</h2>

          <label>
            Titulo
            <input value={form.title} onChange={(event) => updateForm('title', event.target.value)} />
          </label>

          <div className="reportes-grid">
            <label>
              Periodo visible
              <input value={form.periodLabel} onChange={(event) => updateForm('periodLabel', event.target.value)} />
            </label>
            <label>
              Desde
              <input type="date" value={form.from} onChange={(event) => updateForm('from', event.target.value)} />
            </label>
            <label>
              Hasta
              <input type="date" value={form.to} onChange={(event) => updateForm('to', event.target.value)} />
            </label>
          </div>

          <div className="reportes-grid">
            <label>
              Producto
              <input placeholder="Todos" value={form.producto} onChange={(event) => updateForm('producto', event.target.value)} />
            </label>
            <label>
              Tipo
              <input placeholder="Casa / Comercio" value={form.tipo} onChange={(event) => updateForm('tipo', event.target.value)} />
            </label>
            <label>
              Ubicacion
              <input placeholder="Todas" value={form.ubicacion} onChange={(event) => updateForm('ubicacion', event.target.value)} />
            </label>
            <label>
              Sistema
              <input placeholder="Todos" value={form.sistema} onChange={(event) => updateForm('sistema', event.target.value)} />
            </label>
          </div>

          <button type="submit" disabled={saving}>{saving ? 'Creando...' : 'Crear link publico'}</button>
        </form>

        <section className="reportes-card">
          <h2>Links creados</h2>
          {loading ? (
            <p className="reportes-muted">Cargando informes...</p>
          ) : reports.length ? (
            <div className="reportes-list">
              {reports.map((report) => (
                <article className={`reportes-item ${report.active ? 'is-active' : ''}`} key={report.id}>
                  <div>
                    <strong>{report.title}</strong>
                    <span>{report.periodLabel || `${formatDate(report.from)} a ${formatDate(report.to)}`}</span>
                    <small>{buildPublicUrl(report.token)}</small>
                  </div>
                  <div className="reportes-item-actions">
                    <a href={buildPublicUrl(report.token)} target="_blank" rel="noreferrer">Ver</a>
                    <button type="button" onClick={() => copyLink(report)}>Copiar</button>
                    <button type="button" className="is-secondary" onClick={() => toggleReport(report)}>
                      {report.active ? 'Pausar' : 'Activar'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="reportes-muted">Todavia no hay informes compartidos.</p>
          )}
        </section>
      </section>
    </main>
  );
}
