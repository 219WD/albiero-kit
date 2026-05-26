import { useEffect, useMemo, useState } from 'react';
import AdminNav from '../../components/AdminNav';
import { ADMIN_TOKEN_KEY, getAdminFromToken } from '../../utils/adminSession';
import './Dashboard.css';

const PROD_API_BASE = 'https://albi-backend-nine.vercel.app';
const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const configuredApiBase = import.meta.env.VITE_ANALYTICS_API_URL || '';
const API_BASE =
  !isLocalHost && configuredApiBase.includes('localhost')
    ? PROD_API_BASE
    : configuredApiBase || (isLocalHost ? 'http://localhost:4000' : PROD_API_BASE);

async function apiRequest(endpoint, token = '') {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

function formatNumber(value) {
  return Number(value || 0).toLocaleString('es-AR');
}

function formatDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getMetrics(promo) {
  return {
    views: Number(promo.metrics?.views || 0),
    clicks: Number(promo.metrics?.clicks || 0),
    subscribes: Number(promo.metrics?.subscribes || 0),
    subscribeRate: Number(promo.metrics?.subscribeRate || 0),
  };
}

function StatCard({ label, value, detail, tone = '' }) {
  return (
    <article className={`dash-stat ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </article>
  );
}

export default function Dashboard() {
  const [token, setToken] = useState(() => localStorage.getItem(ADMIN_TOKEN_KEY) || '');
  const admin = useMemo(() => getAdminFromToken(token), [token]);
  const [summary, setSummary] = useState(null);
  const [leadsData, setLeadsData] = useState(null);
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState('');

  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken('');
  };

  const loadDashboard = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [summaryData, leadsResult, promosResult] = await Promise.all([
        apiRequest('/api/analytics/sheet-summary?range=30d', token),
        apiRequest('/api/analytics/sheet-leads?range=30d&pageSize=6', token),
        apiRequest('/api/promos', token),
      ]);

      setSummary(summaryData);
      setLeadsData(leadsResult);
      setPromos(promosResult.promos || []);
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
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!token || !admin) {
    return (
      <main className="dash-page dash-page--center">
        <section className="dash-empty">
          <h1>Dashboard</h1>
          <p>Tenes que iniciar sesion como admin para entrar.</p>
          <a href="/emailmkt">Ir a login</a>
        </section>
      </main>
    );
  }

  const totals = summary?.totals || {};
  const statusCounts = leadsData?.statusCounts || [];
  const newLeads = statusCounts.find((item) => item.label === 'Nuevo')?.count || 0;
  const soldLeads = statusCounts.find((item) => item.label === 'Vendido')?.count || 0;
  const topLocation = summary?.breakdowns?.ubicacion?.[0];
  const topType = summary?.breakdowns?.tipo?.[0];
  const activePromo = promos.find((promo) => promo.active) || promos[0];
  const activePromoMetrics = activePromo ? getMetrics(activePromo) : null;

  return (
    <main className="dash-page">
      <AdminNav />

      <header className="dash-header">
        <div>
          <h1>Dashboard</h1>
          <p>Resumen operativo de los ultimos 30 dias.</p>
        </div>
        <div className="dash-actions">
          <button type="button" onClick={loadDashboard}>Actualizar</button>
          <button type="button" className="is-secondary" onClick={logout}>Salir</button>
        </div>
      </header>

      {error && <div className="dash-alert dash-alert--error">{error}</div>}
      {loading && <div className="dash-alert">Cargando datos...</div>}

      {!loading && !error && (
        <>
          <section className="dash-stats">
            <StatCard label="Leads 30 dias" value={formatNumber(totals.leads)} detail="Desde Google Sheets" tone="is-primary" />
            <StatCard label="Nuevos por contactar" value={formatNumber(newLeads)} detail="Estado Nuevo" />
            <StatCard label="Vendidos" value={formatNumber(soldLeads)} detail="Marcados en CRM" />
            <StatCard label="Newsletter" value={formatNumber(totals.newsletterSubscribers)} detail="Emails unicos" />
            <StatCard label="Con email" value={`${totals.withEmailPercent || 0}%`} detail={`${formatNumber(totals.withEmail)} leads`} />
            <StatCard label="Lead completo" value={`${totals.completeContactLeadsPercent || 0}%`} detail={`${formatNumber(totals.completeContactLeads)} completos`} />
          </section>

          <section className="dash-grid">
            <article className="dash-card dash-focus">
              <h2>Prioridad comercial</h2>
              <div className="dash-focus-list">
                <a href="/leads?status=Nuevo">
                  <strong>{formatNumber(newLeads)}</strong>
                  <span>leads nuevos para revisar</span>
                </a>
                <a href="/analiticas">
                  <strong>{topLocation?.label || 'Sin zona'}</strong>
                  <span>zona con mas leads {topLocation ? `(${topLocation.percent}%)` : ''}</span>
                </a>
                <a href="/analiticas">
                  <strong>{topType?.label || 'Sin tipo'}</strong>
                  <span>tipo dominante {topType ? `(${topType.percent}%)` : ''}</span>
                </a>
              </div>
            </article>

            <article className="dash-card">
              <h2>Promo activa</h2>
              {activePromo ? (
                <>
                  <div className="dash-promo-head">
                    <strong>{activePromo.title}</strong>
                    <span>{activePromo.discountValue} {activePromo.discountLabel}</span>
                  </div>
                  <div className="dash-mini-stats">
                    <span><b>{formatNumber(activePromoMetrics.views)}</b> vistas</span>
                    <span><b>{formatNumber(activePromoMetrics.clicks)}</b> clics</span>
                    <span><b>{formatNumber(activePromoMetrics.subscribes)}</b> emails</span>
                    <span><b>{activePromoMetrics.subscribeRate}%</b> conv.</span>
                  </div>
                  <a className="dash-card-link" href="/promos">Administrar promos</a>
                </>
              ) : (
                <p className="dash-muted">Todavia no hay promos guardadas.</p>
              )}
            </article>

            <article className="dash-card">
              <h2>Ultimos leads</h2>
              <div className="dash-leads">
                {(leadsData?.leads || []).map((lead) => (
                  <a href="/leads" key={`${lead.rowNumber}-${lead.fecha}`} className="dash-lead-row">
                    <span>
                      <strong>{lead.nombre}</strong>
                      <small>{lead.ubicacion} · {lead.sistema}</small>
                    </span>
                    <em>{formatDateTime(lead.fecha)}</em>
                  </a>
                ))}
                {!leadsData?.leads?.length && <p className="dash-muted">No hay leads recientes.</p>}
              </div>
            </article>

            <article className="dash-card">
              <h2>Herramientas</h2>
              <div className="dash-tools">
                <a href="/leads">Administrar leads</a>
                <a href="/analiticas">Ver analiticas</a>
                <a href="/emailmkt">Email marketing</a>
                <a href="/promos">Editar promos</a>
                {admin.rango === 'superadmin' && <a href="/usuarios">Usuarios</a>}
                {summary?.sheetUrl && <a href={summary.sheetUrl} target="_blank" rel="noreferrer">Abrir Excel</a>}
              </div>
            </article>
          </section>
        </>
      )}
    </main>
  );
}
