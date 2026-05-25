import React, { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import AdminNav from '../../components/AdminNav';
import useAnalyticsData from '../../hooks/useAnalyticsData';
import './Analiticas.css';

const COLORES = ['#961C2C', '#c0394c', '#e8687a', '#f0a0aa', '#7b8fa1', '#d5a021'];
const ROJO = '#961C2C';
const PROD_API_BASE = 'https://albi-backend-nine.vercel.app';
const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const configuredApiBase = import.meta.env.VITE_ANALYTICS_API_URL || '';
const API_BASE =
  !isLocalHost && configuredApiBase.includes('localhost')
    ? PROD_API_BASE
    : configuredApiBase || (isLocalHost ? 'http://localhost:4000' : PROD_API_BASE);
const ADMIN_TOKEN_KEY = 'albiero_emailmkt_admin_token';

const RANGOS = [
  { value: '7d', label: '7 dias' },
  { value: '30d', label: '30 dias' },
  { value: '90d', label: '90 dias' },
  { value: 'custom', label: 'Rango' },
];

const formatNumber = (value) => Number(value || 0).toLocaleString('es-AR');

const formatDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="an-tooltip">
      <p className="an-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <strong>{formatNumber(p.value)}</strong>
        </p>
      ))}
    </div>
  );
};

const StatCard = ({ title, value, sub }) => (
  <div className="an-stat-card">
    <p className="an-stat-title">{title}</p>
    <p className="an-stat-value">{value}</p>
    {sub && <p className="an-stat-sub">{sub}</p>}
  </div>
);

const BreakdownTable = ({ rows = [] }) => (
  <div className="an-desglose">
    {rows.map((row, index) => (
      <div key={`${row.label}-${index}`} className="an-desglose-row">
        <span className="an-desglose-label">{row.label}</span>
        <div className="an-desglose-bar-wrap">
          <div
            className="an-desglose-bar"
            style={{
              width: `${row.percent}%`,
              background: COLORES[index % COLORES.length],
            }}
          />
        </div>
        <span className="an-desglose-count">
          {row.count} <span className="an-desglose-pct">({row.percent}%)</span>
        </span>
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <p className="an-empty">Sin datos para este periodo</p>
);

const apiRequest = async (endpoint, options = {}, token = '') => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Error ${response.status}`);
  }

  return data;
};

const Analiticas = () => {
  const [token, setToken] = useState(() => localStorage.getItem(ADMIN_TOKEN_KEY) || '');
  const [authMode, setAuthMode] = useState('login');
  const [adminUser, setAdminUser] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminPassConfirm, setAdminPassConfirm] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [range, setRange] = useState('30d');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [activeRange, setActiveRange] = useState('30d');

  const { summary, loading, error, refetch } = useAnalyticsData(activeRange, from, to, token);
  const breakdowns = summary?.breakdowns || {};
  const totals = summary?.totals || {};
  const topLocation = breakdowns.ubicacion?.[0];
  const topType = breakdowns.tipo?.[0];

  const applyRange = () => setActiveRange(range);
  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken('');
  };

  const handleAuth = async (event) => {
    event.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setAuthMessage('');

    try {
      if (authMode === 'register') {
        if (adminPass !== adminPassConfirm) {
          throw new Error('Las contrasenas no coinciden.');
        }

        const data = await apiRequest('/api/emailmkt/register', {
          method: 'POST',
          body: JSON.stringify({
            username: adminUser,
            email: adminEmail,
            password: adminPass,
          }),
        });

        setAuthMessage(data.message || 'Usuario creado. Ahora falta habilitar el rango admin.');
        setAdminPass('');
        setAdminPassConfirm('');
        setAuthMode('login');
        return;
      }

      const data = await apiRequest('/api/emailmkt/login', {
        method: 'POST',
        body: JSON.stringify({
          username: adminUser,
          password: adminPass,
        }),
      });

      localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      setToken(data.token);
      setAdminPass('');
    } catch (err) {
      setAuthError(err.message || 'No se pudo iniciar sesion.');
    } finally {
      setAuthLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="an-page an-page--login">
        <form className="an-login-card" onSubmit={handleAuth}>
          <div>
            <h1 className="an-title">Analiticas</h1>
            <p className="an-subtitle">Ingreso solo para administradores</p>
          </div>

          <div className="an-auth-tabs">
            <button
              type="button"
              className={`an-auth-tab ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => {
                setAuthMode('login');
                setAuthError('');
                setAuthMessage('');
              }}
            >
              Ingresar
            </button>
            <button
              type="button"
              className={`an-auth-tab ${authMode === 'register' ? 'active' : ''}`}
              onClick={() => {
                setAuthMode('register');
                setAuthError('');
                setAuthMessage('');
              }}
            >
              Registrar
            </button>
          </div>

          <label className="an-login-label">
            Usuario o email
            <input
              type="text"
              value={adminUser}
              onChange={(event) => setAdminUser(event.target.value)}
              autoComplete="username"
              required
            />
          </label>

          {authMode === 'register' && (
            <label className="an-login-label">
              Email
              <input
                type="email"
                value={adminEmail}
                onChange={(event) => setAdminEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>
          )}

          <label className="an-login-label">
            Contrasena
            <input
              type="password"
              value={adminPass}
              onChange={(event) => setAdminPass(event.target.value)}
              autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
              required
            />
          </label>

          {authMode === 'register' && (
            <label className="an-login-label">
              Repetir contrasena
              <input
                type="password"
                value={adminPassConfirm}
                onChange={(event) => setAdminPassConfirm(event.target.value)}
                autoComplete="new-password"
                required
              />
            </label>
          )}

          {authError && <div className="an-auth-alert an-auth-alert--error">{authError}</div>}
          {authMessage && <div className="an-auth-alert an-auth-alert--ok">{authMessage}</div>}

          <button className="an-apply-btn an-login-submit" type="submit" disabled={authLoading}>
            {authLoading ? 'Validando...' : authMode === 'login' ? 'Entrar' : 'Crear usuario'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="an-page">
      <AdminNav />

      <div className="an-header">
        <div>
          <h1 className="an-title">Analiticas</h1>
          <p className="an-subtitle">Leads tomados desde Google Sheets</p>
        </div>

        <div className="an-range-selector">
          {RANGOS.map((item) => (
            <button
              key={item.value}
              className={`an-range-btn ${range === item.value ? 'active' : ''}`}
              onClick={() => setRange(item.value)}
            >
              {item.label}
            </button>
          ))}

          {range === 'custom' && (
            <div className="an-date-inputs">
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="an-date-input" />
              <span>a</span>
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="an-date-input" />
            </div>
          )}

          <button className="an-apply-btn" onClick={applyRange}>Aplicar</button>
          <button className="an-apply-btn an-secondary-btn" onClick={refetch}>Actualizar</button>
          {summary?.sheetUrl && (
            <a className="an-apply-btn an-excel-btn" href={summary.sheetUrl} target="_blank" rel="noreferrer">
              Abrir Excel
            </a>
          )}
          <button className="an-apply-btn an-logout-btn" onClick={logout}>Salir</button>
        </div>
      </div>

      {loading && <div className="an-loading"><span className="an-spinner" />Cargando datos...</div>}
      {error && <div className="an-error">Error: {error}</div>}

      {!loading && !error && (
        <>
          <div className="an-stats-grid">
            <StatCard title="Leads totales" value={formatNumber(totals.leads)} sub="FormularioEnviado_WhatsApp" />
            <StatCard title="Tipos" value={formatNumber(totals.tipos)} sub={topType ? `${topType.label}: ${topType.percent}%` : 'Casa / Comercio'} />
            <StatCard title="Ubicaciones" value={formatNumber(totals.ubicaciones)} sub={topLocation ? `${topLocation.label}: ${topLocation.percent}%` : 'Zonas detectadas'} />
            <StatCard title="Filas en Excel" value={formatNumber(totals.sheetRows)} sub="Total de registros leidos" />
            <StatCard title="Newsletter" value={formatNumber(totals.newsletterSubscribers)} sub="Emails suscriptos unicos" />
            <StatCard title="Con nombre" value={formatNumber(totals.withName)} sub={`${totals.withNamePercent || 0}% de leads`} />
            <StatCard title="Con email" value={formatNumber(totals.withEmail)} sub={`${totals.withEmailPercent || 0}% de leads`} />
            <StatCard title="Lead completo" value={formatNumber(totals.completeContactLeads)} sub="Nombre + email + datos del kit" />
          </div>

          <div className="an-card">
            <h2 className="an-card-title">Leads por dia</h2>
            {!summary?.dailyLeads?.length ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={summary.dailyLeads} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={ROJO} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={ROJO} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="label" tick={{ fill: '#888', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: '#888', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="leads" name="Leads" stroke={ROJO} strokeWidth={2} fill="url(#leadGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="an-two-col">
            <div className="an-card">
              <h2 className="an-card-title">Casa vs Comercio</h2>
              {!breakdowns.tipo?.length ? (
                <EmptyState />
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={breakdowns.tipo} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="count" nameKey="label" paddingAngle={3}>
                      {breakdowns.tipo.map((_, index) => <Cell key={index} fill={COLORES[index % COLORES.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value, name) => [formatNumber(value), name]} />
                    <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{ color: '#ccc', fontSize: 12 }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="an-card">
              <h2 className="an-card-title">Ubicaciones</h2>
              {!breakdowns.ubicacion?.length ? <EmptyState /> : <BreakdownTable rows={breakdowns.ubicacion} />}
            </div>
          </div>

          <div className="an-two-col">
            <div className="an-card">
              <h2 className="an-card-title">Sistemas elegidos</h2>
              {!breakdowns.sistema?.length ? (
                <EmptyState />
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={breakdowns.sistema} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="label" tick={{ fill: '#888', fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tick={{ fill: '#888', fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Leads" fill={ROJO} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="an-card">
              <h2 className="an-card-title">Productos</h2>
              {!breakdowns.producto?.length ? <EmptyState /> : <BreakdownTable rows={breakdowns.producto} />}
            </div>
          </div>

          <div className="an-card">
            <h2 className="an-card-title">Ultimos leads</h2>
            {!summary?.recentLeads?.length ? (
              <EmptyState />
            ) : (
              <div className="an-table-wrap">
                <table className="an-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Tipo</th>
                      <th>Ubicacion</th>
                      <th>Sistema</th>
                      <th>Producto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.recentLeads.map((lead, index) => (
                      <tr key={`${lead.fecha}-${index}`}>
                        <td>{formatDateTime(lead.fecha)}</td>
                        <td>{lead.tipo}</td>
                        <td>{lead.ubicacion}</td>
                        <td>{lead.sistema}</td>
                        <td>{lead.producto}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Analiticas;
