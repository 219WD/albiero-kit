import { useEffect, useMemo, useState } from 'react';
import AdminNav from '../../components/AdminNav';
import { ADMIN_TOKEN_KEY, getAdminFromToken } from '../../utils/adminSession';
import './Promos.css';

const PROD_API_BASE = 'https://albi-backend-nine.vercel.app';
const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const configuredApiBase = import.meta.env.VITE_ANALYTICS_API_URL || '';
const API_BASE =
  !isLocalHost && configuredApiBase.includes('localhost')
    ? PROD_API_BASE
    : configuredApiBase || (isLocalHost ? 'http://localhost:4000' : PROD_API_BASE);

const EMPTY_FORM = {
  id: '',
  title: 'Promo del mes',
  subtitle: 'Completa tus datos y recibi tu beneficio exclusivo.',
  badge: 'BENEFICIO EXCLUSIVO',
  discountValue: '10%',
  discountLabel: 'OFF',
  offerText: 'Aprovecha este beneficio en la instalacion de tu sistema de seguridad.',
  features: 'Instalacion profesional sin costo\nEquipos confiables y garantia oficial\nMas de 40 anos protegiendo Tucuman',
  ctaText: 'QUIERO MI BENEFICIO AHORA',
  successTitle: 'Listo. Tu beneficio ya esta activo',
  successText: 'Guarda este codigo y usalo al momento de coordinar la instalacion.',
  whatsappText: 'Hola, quiero usar mi beneficio de Albiero Seguridad.',
  startAt: '',
  endAt: '',
  active: true,
};

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

function dateInput(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

function toForm(promo) {
  return {
    ...EMPTY_FORM,
    ...promo,
    features: (promo.features || []).join('\n'),
    startAt: dateInput(promo.startAt),
    endAt: dateInput(promo.endAt),
  };
}

function toPayload(form) {
  return {
    title: form.title,
    subtitle: form.subtitle,
    badge: form.badge,
    discountValue: form.discountValue,
    discountLabel: form.discountLabel,
    offerText: form.offerText,
    features: form.features.split('\n').map((item) => item.trim()).filter(Boolean),
    ctaText: form.ctaText,
    successTitle: form.successTitle,
    successText: form.successText,
    whatsappText: form.whatsappText,
    startAt: form.startAt || undefined,
    endAt: form.endAt || undefined,
    active: form.active,
  };
}

function getMetrics(promo) {
  return {
    views: Number(promo.metrics?.views || 0),
    clicks: Number(promo.metrics?.clicks || 0),
    subscribes: Number(promo.metrics?.subscribes || 0),
    clickRate: Number(promo.metrics?.clickRate || 0),
    subscribeRate: Number(promo.metrics?.subscribeRate || 0),
  };
}

export default function Promos() {
  const [token, setToken] = useState(() => localStorage.getItem(ADMIN_TOKEN_KEY) || '');
  const admin = useMemo(() => getAdminFromToken(token), [token]);
  const [promos, setPromos] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(Boolean(token));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const totals = useMemo(() => promos.reduce((acc, promo) => {
    const metrics = getMetrics(promo);
    return {
      views: acc.views + metrics.views,
      clicks: acc.clicks + metrics.clicks,
      subscribes: acc.subscribes + metrics.subscribes,
    };
  }, { views: 0, clicks: 0, subscribes: 0 }), [promos]);

  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken('');
  };

  const loadPromos = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await apiRequest('/api/promos', {}, token);
      setPromos(data.promos || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const savePromo = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const isUpdate = Boolean(form.id && form.id !== 'default');
      const endpoint = isUpdate ? `/api/promos/${encodeURIComponent(form.id)}` : '/api/promos';
      const data = await apiRequest(endpoint, {
        method: isUpdate ? 'PUT' : 'POST',
        body: JSON.stringify(toPayload(form)),
      }, token);

      setForm(toForm(data.promo));
      setMessage(isUpdate ? 'Promo actualizada.' : 'Promo creada.');
      await loadPromos();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!token || !admin) {
    return (
      <main className="promos-page promos-page--center">
        <section className="promos-empty">
          <h1>Promos</h1>
          <p>Tenes que iniciar sesion como admin para entrar.</p>
          <a href="/emailmkt">Ir a login</a>
        </section>
      </main>
    );
  }

  return (
    <main className="promos-page">
      <AdminNav />

      <header className="promos-header">
        <div>
          <h1>Promos</h1>
          <p>Cambia el modal y la barra de beneficio sin tocar codigo.</p>
        </div>
        <div className="promos-actions">
          <button type="button" onClick={() => setForm(EMPTY_FORM)}>Nueva promo</button>
          <button type="button" onClick={loadPromos}>Actualizar</button>
          <button type="button" className="is-secondary" onClick={logout}>Salir</button>
        </div>
      </header>

      {message && <div className="promos-alert promos-alert--ok">{message}</div>}
      {error && <div className="promos-alert promos-alert--error">{error}</div>}

      <section className="promos-stats" aria-label="Performance de promos">
        <article>
          <span>Vistas</span>
          <strong>{totals.views}</strong>
        </article>
        <article>
          <span>Clics</span>
          <strong>{totals.clicks}</strong>
        </article>
        <article>
          <span>Emails capturados</span>
          <strong>{totals.subscribes}</strong>
        </article>
        <article>
          <span>Conversion a email</span>
          <strong>{totals.views > 0 ? `${Math.round((totals.subscribes / totals.views) * 1000) / 10}%` : '0%'}</strong>
        </article>
      </section>

      <section className="promos-layout">
        <form className="promos-card promos-form" onSubmit={savePromo}>
          <div className="promos-form-head">
            <h2>{form.id ? 'Editar promo' : 'Nueva promo'}</h2>
            <label className="promos-switch">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) => updateField('active', event.target.checked)}
              />
              <span>Activa</span>
            </label>
          </div>

          <div className="promos-grid">
            <label>
              Titulo
              <input value={form.title} onChange={(event) => updateField('title', event.target.value)} required />
            </label>
            <label>
              Badge
              <input value={form.badge} onChange={(event) => updateField('badge', event.target.value)} />
            </label>
            <label>
              Descuento
              <input value={form.discountValue} onChange={(event) => updateField('discountValue', event.target.value)} />
            </label>
            <label>
              Etiqueta
              <input value={form.discountLabel} onChange={(event) => updateField('discountLabel', event.target.value)} />
            </label>
            <label>
              Inicio
              <input type="date" value={form.startAt} onChange={(event) => updateField('startAt', event.target.value)} />
            </label>
            <label>
              Fin
              <input type="date" value={form.endAt} onChange={(event) => updateField('endAt', event.target.value)} />
            </label>
          </div>

          <label>
            Subtitulo
            <textarea value={form.subtitle} onChange={(event) => updateField('subtitle', event.target.value)} rows={2} />
          </label>
          <label>
            Texto de oferta
            <textarea value={form.offerText} onChange={(event) => updateField('offerText', event.target.value)} rows={2} />
          </label>
          <label>
            Beneficios
            <textarea value={form.features} onChange={(event) => updateField('features', event.target.value)} rows={4} />
          </label>
          <label>
            Texto del boton
            <input value={form.ctaText} onChange={(event) => updateField('ctaText', event.target.value)} />
          </label>
          <label>
            Exito titulo
            <input value={form.successTitle} onChange={(event) => updateField('successTitle', event.target.value)} />
          </label>
          <label>
            Exito texto
            <textarea value={form.successText} onChange={(event) => updateField('successText', event.target.value)} rows={2} />
          </label>
          <label>
            Texto sugerido para WhatsApp
            <textarea value={form.whatsappText} onChange={(event) => updateField('whatsappText', event.target.value)} rows={2} />
          </label>

          <button type="submit" className="promos-save" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar promo'}
          </button>
        </form>

        <section className="promos-card">
          <h2>Promos guardadas</h2>
          {loading ? (
            <p className="promos-muted">Cargando promos...</p>
          ) : promos.length ? (
            <div className="promos-list">
              {promos.map((promo) => (
                <button
                  type="button"
                  key={promo.id}
                  className={`promos-item ${promo.active ? 'is-active' : ''}`}
                  onClick={() => setForm(toForm(promo))}
                >
                  <span>{promo.title}</span>
                  <div className="promos-item-metrics">
                    <b>{getMetrics(promo).views}<em>vistas</em></b>
                    <b>{getMetrics(promo).clicks}<em>clics</em></b>
                    <b>{getMetrics(promo).subscribes}<em>emails</em></b>
                    <b>{getMetrics(promo).subscribeRate}%<em>conv.</em></b>
                  </div>
                  <small>{promo.active ? 'Activa' : 'Inactiva'} · {promo.discountValue} {promo.discountLabel}</small>
                </button>
              ))}
            </div>
          ) : (
            <p className="promos-muted">Todavia no hay promos guardadas. La web usa la promo por defecto.</p>
          )}
        </section>
      </section>
    </main>
  );
}
