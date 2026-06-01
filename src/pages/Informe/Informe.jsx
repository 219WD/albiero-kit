import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import './Informe.css';

const PROD_API_BASE = 'https://albi-backend-nine.vercel.app';
const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const configuredApiBase = import.meta.env.VITE_ANALYTICS_API_URL || '';
const API_BASE =
  !isLocalHost && configuredApiBase.includes('localhost')
    ? PROD_API_BASE
    : configuredApiBase || (isLocalHost ? 'http://localhost:4000' : PROD_API_BASE);

const COLORS = ['#961C2C', '#E0B85A', '#4E9F7D', '#6F7BD8', '#E47A4B', '#6EC7D1'];

async function publicRequest(token) {
  const response = await fetch(`${API_BASE}/api/reports/public/${encodeURIComponent(token)}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || `Error ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return data;
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function topLabel(list = []) {
  const first = list[0];
  if (!first) return 'Sin dato';
  return `${first.label} (${first.count})`;
}

function compactPercent(value) {
  return `${Number(value || 0)}%`;
}

export default function Informe() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError('');

    publicRequest(token)
      .then((nextData) => {
        if (!ignore) setData(nextData);
      })
      .catch((err) => {
        if (!ignore) setError(err.message || 'No se pudo abrir el informe.');
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [token]);

  const report = data?.report;
  const summary = data?.summary;
  const totals = summary?.totals || {};
  const breakdowns = summary?.breakdowns || {};
  const funnel = summary?.funnel || [];
  const locationConversion = summary?.locationConversion || [];
  const filters = useMemo(() => Object.entries(report?.filters || {}).filter(([, value]) => value), [report]);

  if (loading) {
    return (
      <main className="informe-page informe-page--center">
        <section className="informe-empty">
          <h1>Cargando informe</h1>
          <p>Estamos preparando las metricas del Excel.</p>
        </section>
      </main>
    );
  }

  if (error || !report || !summary) {
    return (
      <main className="informe-page informe-page--center">
        <section className="informe-empty">
          <h1>Informe no disponible</h1>
          <p>{error || 'El link no existe o fue pausado.'}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="informe-page">
      <section className="informe-sheet">
        <header className="informe-hero">
          <div>
            <span>Albiero Seguridad</span>
            <h1>{report.title}</h1>
            <p>{report.periodLabel || `${formatDate(report.from)} a ${formatDate(report.to)}`}</p>
          </div>
          <div className="informe-actions">
            <button type="button" onClick={() => window.print()}>Descargar PDF</button>
          </div>
        </header>

        <section className="informe-meta">
          <span>Desde {formatDate(report.from)}</span>
          <span>Hasta {formatDate(report.to)}</span>
          <span>Generado {formatDate(summary.generatedAt)}</span>
          {filters.map(([key, value]) => <span key={key}>{key}: {value}</span>)}
        </section>

        <section className="informe-kpis">
          <article className="is-primary">
            <span>Leads</span>
            <strong>{totals.leads || 0}</strong>
            <small>{totals.completeLeadsPercent || 0}% completos</small>
          </article>
          <article>
            <span>Newsletter</span>
            <strong>{totals.newsletterSubscribers || 0}</strong>
            <small>emails suscritos</small>
          </article>
          <article>
            <span>Con email</span>
            <strong>{compactPercent(totals.withEmailPercent)}</strong>
            <small>{totals.withEmail || 0} registros</small>
          </article>
          <article>
            <span>Contacto completo</span>
            <strong>{compactPercent(totals.completeContactLeadsPercent)}</strong>
            <small>nombre + email + lead</small>
          </article>
          <article>
            <span>Zona top</span>
            <strong>{topLabel(breakdowns.ubicacion)}</strong>
          </article>
          <article>
            <span>Tipo top</span>
            <strong>{topLabel(breakdowns.tipo)}</strong>
          </article>
        </section>

        <section className="informe-grid">
          <article className="informe-card informe-card--wide">
            <h2>Evolucion diaria de leads</h2>
            <div className="informe-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={summary.dailyLeads || []} margin={{ top: 8, right: 12, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#961C2C" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#961C2C" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(0,0,0,0.08)" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="leads" stroke="#961C2C" fill="url(#leadGradient)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="informe-card">
            <h2>Casa vs comercio</h2>
            <div className="informe-chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={breakdowns.tipo || []} dataKey="count" nameKey="label" innerRadius={58} outerRadius={86} paddingAngle={4}>
                    {(breakdowns.tipo || []).map((entry, index) => (
                      <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="informe-legend">
              {(breakdowns.tipo || []).map((item, index) => (
                <span key={item.label}><i style={{ background: COLORS[index % COLORS.length] }} />{item.label}: {item.percent}%</span>
              ))}
            </div>
          </article>

          <article className="informe-card">
            <h2>Sistemas elegidos</h2>
            <div className="informe-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdowns.sistema || []} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid stroke="rgba(0,0,0,0.08)" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#E0B85A" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="informe-card">
            <h2>Embudo</h2>
            <div className="informe-funnel">
              {funnel.map((step) => (
                <div key={step.key}>
                  <span>{step.label}</span>
                  <strong>{step.count}</strong>
                  <small>{step.retention}% retencion</small>
                  <b style={{ width: `${Math.min(step.retention, 100)}%` }} />
                </div>
              ))}
            </div>
          </article>

          <article className="informe-card">
            <h2>Ranking de zonas</h2>
            <div className="informe-table">
              {locationConversion.slice(0, 8).map((item) => (
                <div key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.leads} leads</strong>
                  <small>{item.visits} pasos 2 / {item.conversion}% conv.</small>
                </div>
              ))}
            </div>
          </article>

          <article className="informe-card informe-card--wide">
            <h2>Ultimos leads del periodo</h2>
            <div className="informe-leads">
              {(summary.recentLeads || []).map((lead, index) => (
                <div key={`${lead.fecha}-${index}`}>
                  <span>
                    <strong>{lead.nombre !== 'Sin dato' ? lead.nombre : lead.tipo}</strong>
                    <small>{lead.ubicacion} / {lead.sistema}</small>
                  </span>
                  <em>{formatDate(lead.fecha)}</em>
                </div>
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
