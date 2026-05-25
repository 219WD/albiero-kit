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
import useAnalyticsData from '../../hooks/useAnalyticsData';
import './Analiticas.css';

const COLORES = ['#961C2C', '#c0394c', '#e8687a', '#f0a0aa', '#7b8fa1', '#d5a021'];
const ROJO = '#961C2C';

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

const Analiticas = () => {
  const [range, setRange] = useState('30d');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [activeRange, setActiveRange] = useState('30d');

  const { summary, loading, error, refetch } = useAnalyticsData(activeRange, from, to);
  const breakdowns = summary?.breakdowns || {};
  const totals = summary?.totals || {};
  const topLocation = breakdowns.ubicacion?.[0];
  const topType = breakdowns.tipo?.[0];

  const applyRange = () => setActiveRange(range);

  return (
    <div className="an-page">
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
