import React, { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
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
const LEAD_STATUSES = ['Nuevo', 'Contactado', 'Cotizado', 'Vendido', 'Perdido'];

const RANGOS = [
  { value: '7d', label: '7 dias' },
  { value: '30d', label: '30 dias' },
  { value: '90d', label: '90 dias' },
  { value: 'custom', label: 'Rango' },
];

const formatNumber = (value) => Number(value || 0).toLocaleString('es-AR');

const normalizeKey = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');

const normalizeProductLabel = (value) => {
  const key = normalizeKey(value);
  const labels = {
    gps: 'GPS',
    seguimientovehicular: 'GPS',
    seguridadvehicular: 'GPS',
    kitalarmacamera: 'Kit Alarma y Camara',
    kitalarmaycamara: 'Kit Alarma y Camara',
    camaras: 'Camaras',
    camara: 'Camaras',
    alarmas: 'Alarmas',
    alarma: 'Alarmas',
    seguridadintegral: 'Seguridad Integral',
  };

  return labels[key] || value || 'Producto';
};

const inferServiceFromType = (type, fallbackService) => {
  const key = normalizeKey(type);
  const vehicleTypes = new Set(['auto', 'moto', 'camion', 'flota', 'vehiculo', 'vehiculos']);
  const integralTypes = new Set([
    'depositopredio',
    'deposito',
    'predio',
    'empresa',
    'propiedadparticular',
    'consorcio',
    'industria',
    'campo',
  ]);

  if (vehicleTypes.has(key)) return 'GPS';
  if (
    integralTypes.has(key)
    || key.includes('deposito')
    || key.includes('predio')
    || key.includes('propiedadparticular')
  ) {
    return 'Seguridad Integral';
  }
  return normalizeProductLabel(fallbackService);
};

const formatInputDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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

const ServicePieTooltip = ({ active, payload, service }) => {
  if (!active || !payload?.length) return null;

  const item = payload[0]?.payload || {};
  const serviceLabel = item.serviceLabel || normalizeProductLabel(service);
  return (
    <div className="an-tooltip an-tooltip--service">
      <p className="an-tooltip-label">{serviceLabel}</p>
      <p>
        Tipo: <strong>{item.label || 'Sin dato'}</strong>
      </p>
      <p>
        Leads: <strong>{formatNumber(item.count)}</strong>
      </p>
      <p>
        Porcentaje: <strong>{item.percent || 0}%</strong>
      </p>
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

const FilterSelect = ({ label, value, options = [], onChange }) => (
  <label className="an-filter">
    {label}
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">Todos</option>
      {options.map((option) => (
        <option value={option} key={option}>{option}</option>
      ))}
    </select>
  </label>
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

const groupedFallback = (label, count, rows = []) => {
  if (!rows.length) return [];

  const service = normalizeProductLabel(label);
  return [{
    label: service,
    count,
    percent: 100,
    rows: rows.map(row => ({
      ...row,
      serviceLabel: inferServiceFromType(row.label, service),
    })),
  }];
};

const GroupedPieBreakdown = ({ groups = [] }) => (
  <div className="an-service-grid">
    {groups.map((group, groupIndex) => (
      <div className="an-service-block" key={`${group.label}-${groupIndex}`}>
        <div className="an-service-head">
          <strong>{group.label}</strong>
          <span>{formatNumber(group.count)} leads</span>
        </div>

        <div className="an-service-chart">
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie
                data={group.rows}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={66}
                dataKey="count"
                nameKey="label"
                paddingAngle={3}
              >
                {group.rows.map((_, index) => (
                  <Cell key={index} fill={COLORES[(index + groupIndex) % COLORES.length]} />
                ))}
              </Pie>
              <Tooltip content={<ServicePieTooltip service={group.label} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <BreakdownTable rows={group.rows} />
      </div>
    ))}
  </div>
);

const GroupedBreakdown = ({ groups = [] }) => (
  <div className="an-service-grid">
    {groups.map((group, groupIndex) => (
      <div className="an-service-block" key={`${group.label}-${groupIndex}`}>
        <div className="an-service-head">
          <strong>{group.label}</strong>
          <span>{formatNumber(group.count)} leads</span>
        </div>
        <BreakdownTable rows={group.rows} />
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

const buildWhatsAppUrl = (lead) => {
  const phone = String(lead.telefono || '').replace(/\D/g, '');
  if (!phone) return '';

  const normalizedPhone = phone.startsWith('54') ? phone : `549${phone}`;
  const text = `Hola ${lead.nombre !== 'Sin dato' ? lead.nombre : ''}, te contacto de Albiero Seguridad por tu consulta sobre ${lead.producto || 'seguridad'} en ${lead.ubicacion || 'Tucuman'}.`;
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(text)}`;
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
  const [filters, setFilters] = useState({
    producto: '',
    tipo: '',
    ubicacion: '',
    sistema: '',
  });
  const [statusSaving, setStatusSaving] = useState('');

  const { summary, loading, error, errorStatus, refetch } = useAnalyticsData(activeRange, from, to, token, filters);
  const breakdowns = summary?.breakdowns || {};
  const totals = summary?.totals || {};
  const topLocation = breakdowns.ubicacion?.[0];
  const topType = breakdowns.tipo?.[0];
  const filterOptions = summary?.filterOptions || {};
  const fallbackServiceLabel =
    filters.producto
    || breakdowns.producto?.[0]?.label
    || 'Producto';
  const tipoPorProducto = breakdowns.tipoPorProducto?.length
    ? breakdowns.tipoPorProducto
    : groupedFallback(fallbackServiceLabel, totals.leads, breakdowns.tipo);
  const sistemaPorProducto = breakdowns.sistemaPorProducto?.length
    ? breakdowns.sistemaPorProducto
    : groupedFallback(fallbackServiceLabel, totals.leads, breakdowns.sistema);

  const applyRange = () => setActiveRange(range);
  const applyCurrentMonth = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const fromDate = formatInputDate(firstDay);
    const toDate = formatInputDate(today);
    setRange('custom');
    setFrom(fromDate);
    setTo(toDate);
    setActiveRange('custom');
  };
  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken('');
  };

  const updateFilter = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({ producto: '', tipo: '', ubicacion: '', sistema: '' });
  };

  const updateLeadStatus = async (lead, status) => {
    if (!lead.rowNumber) {
      setAuthError('Este lead todavia no trae numero de fila desde el backend. Hay que desplegar el backend actualizado.');
      return;
    }

    const saveKey = `${lead.rowNumber}-${status}`;
    setStatusSaving(saveKey);
    setAuthError('');

    try {
      await apiRequest(`/api/analytics/sheet-leads/${lead.rowNumber}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }, token);
      await refetch();
    } catch (err) {
      setAuthError(err.message || 'No se pudo guardar el estado.');
    } finally {
      setStatusSaving('');
    }
  };

  useEffect(() => {
    if (errorStatus !== 401) return;

    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken('');
    setAuthError('Sesion vencida o backend sin permisos para este usuario. Inicia sesion de nuevo.');
  }, [errorStatus]);

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
          <button className="an-range-btn" onClick={applyCurrentMonth}>
            Este mes
          </button>

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
      {authError && token && <div className="an-error">{authError}</div>}

      {!loading && !error && (
        <>
          <div className="an-card an-filters-card">
            <div className="an-filters">
              <FilterSelect label="Producto" value={filters.producto} options={filterOptions.producto} onChange={(value) => updateFilter('producto', value)} />
              <FilterSelect label="Tipo" value={filters.tipo} options={filterOptions.tipo} onChange={(value) => updateFilter('tipo', value)} />
              <FilterSelect label="Zona" value={filters.ubicacion} options={filterOptions.ubicacion} onChange={(value) => updateFilter('ubicacion', value)} />
              <FilterSelect label="Sistema" value={filters.sistema} options={filterOptions.sistema} onChange={(value) => updateFilter('sistema', value)} />
              <button className="an-apply-btn an-secondary-btn" onClick={clearFilters}>Limpiar</button>
            </div>
          </div>

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
            <h2 className="an-card-title">Embudo del formulario</h2>
            {!summary?.funnel?.length ? (
              <EmptyState />
            ) : (
              <div className="an-funnel">
                {summary.funnel.map((step, index) => (
                  <div className="an-funnel-step" key={step.key}>
                    <div className="an-funnel-head">
                      <span>{step.label}</span>
                      <strong>{formatNumber(step.count)}</strong>
                    </div>
                    <div className="an-funnel-bar-wrap">
                      <div className="an-funnel-bar" style={{ width: `${Math.max(step.retention, 4)}%` }} />
                    </div>
                    <small>
                      {index === 0 ? 'Inicio' : `${step.retention}% retencion / ${step.dropoff}% abandono`}
                    </small>
                  </div>
                ))}
              </div>
            )}
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
              <h2 className="an-card-title">Tipo por servicio</h2>
              {!tipoPorProducto.length ? (
                <EmptyState />
              ) : (
                <>
                  <GroupedPieBreakdown groups={tipoPorProducto} />
                  <p className="an-card-note">
                    Cada torta separa primero el servicio y despues muestra el tipo de consulta dentro de ese servicio.
                  </p>
                </>
              )}
            </div>

            <div className="an-card">
              <h2 className="an-card-title">Ubicaciones</h2>
              {!breakdowns.ubicacion?.length ? <EmptyState /> : <BreakdownTable rows={breakdowns.ubicacion} />}
            </div>
          </div>

          <div className="an-two-col">
            <div className="an-card">
              <h2 className="an-card-title">Sistema elegido por servicio</h2>
              {!sistemaPorProducto.length ? (
                <EmptyState />
              ) : (
                <>
                  <GroupedBreakdown groups={sistemaPorProducto} />
                  <p className="an-card-note">
                    El porcentaje se calcula dentro de cada servicio para no mezclar GPS, camaras, alarmas y kits.
                  </p>
                </>
              )}
            </div>

            <div className="an-card">
              <h2 className="an-card-title">Productos</h2>
              {!breakdowns.producto?.length ? <EmptyState /> : <BreakdownTable rows={breakdowns.producto} />}
            </div>
          </div>

          <div className="an-card">
            <h2 className="an-card-title">Ranking de zonas con conversion</h2>
            {!summary?.locationConversion?.length ? (
              <EmptyState />
            ) : (
              <div className="an-table-wrap">
                <table className="an-table">
                  <thead>
                    <tr>
                      <th>Zona</th>
                      <th>Visitas paso 2</th>
                      <th>Leads</th>
                      <th>Conversion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.locationConversion.map((row) => (
                      <tr key={row.label}>
                        <td>{row.label}</td>
                        <td>{formatNumber(row.visits)}</td>
                        <td>{formatNumber(row.leads)}</td>
                        <td>
                          <span className="an-status-pill">{row.conversion}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Telefono</th>
                      <th>Tipo</th>
                      <th>Ubicacion</th>
                      <th>Sistema</th>
                      <th>Producto</th>
                      <th>Estado</th>
                      <th>WhatsApp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.recentLeads.map((lead, index) => (
                      <tr key={`${lead.fecha}-${index}`}>
                        <td>{formatDateTime(lead.fecha)}</td>
                        <td>{lead.nombre}</td>
                        <td>{lead.email}</td>
                        <td>{lead.telefono || <span className="an-muted">Sin telefono</span>}</td>
                        <td>{lead.tipo}</td>
                        <td>{lead.ubicacion}</td>
                        <td>{lead.sistema}</td>
                        <td>{lead.producto}</td>
                        <td>
                          <select
                            className="an-status-select"
                            value={lead.estado || 'Nuevo'}
                            disabled={statusSaving.startsWith(`${lead.rowNumber}-`)}
                            onChange={(event) => updateLeadStatus(lead, event.target.value)}
                          >
                            {LEAD_STATUSES.map((status) => (
                              <option value={status} key={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          {buildWhatsAppUrl(lead) ? (
                            <a className="an-mini-link" href={buildWhatsAppUrl(lead)} target="_blank" rel="noreferrer">Abrir</a>
                          ) : (
                            <span className="an-muted">Sin telefono</span>
                          )}
                        </td>
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
