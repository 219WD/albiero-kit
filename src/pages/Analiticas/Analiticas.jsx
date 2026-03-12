// pages/Analiticas/Analiticas.jsx
import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import useAnalyticsData from '../../hooks/useAnalyticsData';
import './Analiticas.css';

const ROJO    = '#961C2C';
const ROJO2   = '#c0394c';
const COLORES = ['#961C2C', '#c0394c', '#e8687a', '#f0a0aa', '#f5c0c8'];

const PRODUCTO_LABELS = {
  KitAlarmaCamara: 'Kit Alarma + Cámara',
  Alarmas:         'Alarmas',
  Camaras:         'Cámaras',
  GPS:             'GPS Vehicular',
};

const RANGOS = [
  { value: '7d',     label: '7 días'   },
  { value: '30d',    label: '30 días'  },
  { value: '90d',    label: '90 días'  },
  { value: 'custom', label: 'Rango...' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="an-tooltip">
      <p className="an-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <strong>{p.value?.toLocaleString()}</strong>
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

// Mini tabla de desglose
const DesgloseTable = ({ rows, labelKey, total }) => (
  <div className="an-desglose">
    {rows.map((r, i) => {
      const label = r[labelKey] || '(sin dato)';
      const pct   = total > 0 ? Math.round((r.count / total) * 100) : 0;
      return (
        <div key={i} className="an-desglose-row">
          <span className="an-desglose-label">{label}</span>
          <div className="an-desglose-bar-wrap">
            <div className="an-desglose-bar" style={{ width: `${pct}%`, background: COLORES[i % COLORES.length] }} />
          </div>
          <span className="an-desglose-count">{r.count} <span className="an-desglose-pct">({pct}%)</span></span>
        </div>
      );
    })}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
const Analiticas = () => {
  const [range,        setRange]        = useState('30d');
  const [from,         setFrom]         = useState('');
  const [to,           setTo]           = useState('');
  const [activeRange,  setActiveRange]  = useState('30d');
  const [selectedProd, setSelectedProd] = useState('KitAlarmaCamara');

  const {
    pageviews, funnel, conversions, abandonment,
    breakdown, loading, error,
  } = useAnalyticsData(activeRange, from, to);

  const handleApplyRange = () => setActiveRange(range);

  // Totales
  const totalPV    = pageviews.reduce((s, d) => s + d.pageviews, 0);
  const totalSess  = pageviews.reduce((s, d) => s + d.sessions,  0);
  const totalLeads = conversions.reduce((s, d) => s + d.leads,   0);
  const topProd    = conversions[0]?.producto
    ? (PRODUCTO_LABELS[conversions[0].producto] || conversions[0].producto)
    : '—';

  // Abandono del producto seleccionado
  const abandonData = abandonment[selectedProd] || [];

  // Pie de conversiones
  const pieData = conversions.map(d => ({
    name:  PRODUCTO_LABELS[d.producto] || d.producto,
    value: d.leads,
  }));

  // Breakdown del producto seleccionado
  const tipoData = breakdown.tipo?.find(d => d.producto === selectedProd)?.desglose || [];
  const ubicData = breakdown.ubicacion?.find(d => d.producto === selectedProd)?.desglose || [];
  const tipoTotal = tipoData.reduce((s, d) => s + d.count, 0);
  const ubicTotal = ubicData.reduce((s, d) => s + d.count, 0);

  return (
    <div className="an-page">

      {/* Header */}
      <div className="an-header">
        <div>
          <h1 className="an-title">Analíticas</h1>
          <p className="an-subtitle">Métricas en tiempo real · Albiero Seguridad</p>
        </div>
        <div className="an-range-selector">
          {RANGOS.map(r => (
            <button
              key={r.value}
              className={`an-range-btn ${range === r.value ? 'active' : ''}`}
              onClick={() => setRange(r.value)}
            >
              {r.label}
            </button>
          ))}
          {range === 'custom' && (
            <div className="an-date-inputs">
              <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="an-date-input" />
              <span>→</span>
              <input type="date" value={to}   onChange={e => setTo(e.target.value)}   className="an-date-input" />
            </div>
          )}
          <button className="an-apply-btn" onClick={handleApplyRange}>Aplicar</button>
        </div>
      </div>

      {loading && <div className="an-loading"><span className="an-spinner" />Cargando datos...</div>}
      {error   && <div className="an-error">Error: {error}</div>}

      {!loading && !error && (
        <>
          {/* Stat cards */}
          <div className="an-stats-grid">
            <StatCard title="Page Views"    value={totalPV.toLocaleString()}    sub="total en el período" />
            <StatCard title="Sesiones"      value={totalSess.toLocaleString()}  sub="usuarios únicos aprox." />
            <StatCard title="Leads totales" value={totalLeads.toLocaleString()} sub="formularios enviados" />
            <StatCard title="Top producto"  value={topProd}                     sub="más conversiones" />
          </div>

          {/* Page views */}
          <div className="an-card">
            <h2 className="an-card-title">Page Views por día</h2>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={pageviews} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="pvGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={ROJO} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={ROJO} stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" tick={{ fill: '#888', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#888', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="pageviews" name="Page Views" stroke={ROJO}  strokeWidth={2} fill="url(#pvGrad)" />
                <Area type="monotone" dataKey="sessions"  name="Sesiones"   stroke={ROJO2} strokeWidth={2} fill="none" strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Conversiones + Abandono */}
          <div className="an-two-col">
            <div className="an-card">
              <h2 className="an-card-title">Leads por producto</h2>
              {pieData.length === 0
                ? <p className="an-empty">Sin datos en este período</p>
                : (
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                        dataKey="value" nameKey="name" paddingAngle={3}>
                        {pieData.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v, n) => [v, n]} />
                      <Legend iconType="circle" iconSize={8}
                        formatter={v => <span style={{ color: '#ccc', fontSize: 12 }}>{v}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                )
              }
            </div>

            <div className="an-card">
              <h2 className="an-card-title">Abandono por paso</h2>
              <div className="an-prod-tabs">
                {Object.keys(PRODUCTO_LABELS).map(p => (
                  <button key={p}
                    className={`an-prod-tab ${selectedProd === p ? 'active' : ''}`}
                    onClick={() => setSelectedProd(p)}
                  >
                    {PRODUCTO_LABELS[p]}
                  </button>
                ))}
              </div>
              {abandonData.length === 0
                ? <p className="an-empty">Sin datos</p>
                : (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={abandonData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="label" tick={{ fill: '#888', fontSize: 10 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fill: '#888', fontSize: 11 }} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count"    name="Usuarios"   fill={ROJO}  radius={[4,4,0,0]} />
                      <Bar dataKey="abandono" name="% abandono" fill={ROJO2} radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )
              }
            </div>
          </div>

          {/* Desglose paso 1 y paso 2 */}
          <div className="an-two-col">
            <div className="an-card">
              <h2 className="an-card-title">Paso 1 — Casa vs Comercio</h2>
              <div className="an-prod-tabs" style={{ marginBottom: '1.25rem' }}>
                {Object.keys(PRODUCTO_LABELS).map(p => (
                  <button key={p}
                    className={`an-prod-tab ${selectedProd === p ? 'active' : ''}`}
                    onClick={() => setSelectedProd(p)}
                  >
                    {PRODUCTO_LABELS[p]}
                  </button>
                ))}
              </div>
              {tipoData.length === 0
                ? <p className="an-empty">Sin datos</p>
                : <DesgloseTable rows={tipoData} labelKey="tipo" total={tipoTotal} />
              }
            </div>

            <div className="an-card">
              <h2 className="an-card-title">Paso 2 — Zonas</h2>
              <p className="an-card-sub">Producto: {PRODUCTO_LABELS[selectedProd]}</p>
              {ubicData.length === 0
                ? <p className="an-empty">Sin datos</p>
                : <DesgloseTable rows={ubicData} labelKey="ubicacion" total={ubicTotal} />
              }
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analiticas;