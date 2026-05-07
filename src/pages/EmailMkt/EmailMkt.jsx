import { useEffect, useMemo, useState } from 'react';
import './EmailMkt.css';

const PROD_API_BASE = 'https://albi-backend-nine.vercel.app';
const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const configuredApiBase = import.meta.env.VITE_ANALYTICS_API_URL || '';
const API_BASE =
  !isLocalHost && configuredApiBase.includes('localhost')
    ? PROD_API_BASE
    : configuredApiBase || (isLocalHost ? 'http://localhost:4000' : PROD_API_BASE);
const ADMIN_TOKEN_KEY = 'albiero_emailmkt_admin_token';

const initialButtons = [
  {
    label: 'Consultar por WhatsApp',
    url: 'https://wa.me/5493813522339?text=Hola%2C%20vengo%20de%20mi%20suscripcion%20al%20newsletter%20y%20quiero%20usar%20mi%20descuento',
  },
  { label: '', url: '' },
  { label: '', url: '' },
];

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
    throw new Error(data.error || `Error ${response.status}`);
  }

  return data;
}

export default function EmailMkt() {
  const [token, setToken] = useState(() => localStorage.getItem(ADMIN_TOKEN_KEY) || '');
  const [authMode, setAuthMode] = useState('login');
  const [adminUser, setAdminUser] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminPassConfirm, setAdminPassConfirm] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [preheader, setPreheader] = useState('');
  const [content, setContent] = useState('');
  const [buttons, setButtons] = useState(initialButtons);
  const [recipients, setRecipients] = useState(null);
  const [loadingRecipients, setLoadingRecipients] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setLoadingRecipients(false);
      return undefined;
    }

    let active = true;

    setLoadingRecipients(true);

    const query = campaignId.trim() ? `?campaignId=${encodeURIComponent(campaignId.trim())}` : '';

    apiRequest(`/api/emailmkt/recipients${query}`, {}, token)
      .then((data) => {
        if (active) setRecipients(data);
      })
      .catch((err) => {
        if (active) {
          setError(err.message);
          if (err.message === 'No autorizado') {
            localStorage.removeItem(ADMIN_TOKEN_KEY);
            setToken('');
          }
        }
      })
      .finally(() => {
        if (active) setLoadingRecipients(false);
      });

    return () => {
      active = false;
    };
  }, [token, campaignId]);

  const validButtons = useMemo(
    () => buttons.filter((button) => button.label.trim() && button.url.trim()),
    [buttons]
  );

  const canSend = campaignId.trim() && subject.trim() && title.trim() && content.trim() && !sending;

  const updateButton = (index, field, value) => {
    setButtons((current) =>
      current.map((button, buttonIndex) =>
        buttonIndex === index ? { ...button, [field]: value } : button
      )
    );
  };

  const login = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
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
      setLoadingRecipients(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const register = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (adminPass !== adminPassConfirm) {
      setError('Las contrasenas no coinciden.');
      return;
    }

    try {
      const data = await apiRequest('/api/emailmkt/register', {
        method: 'POST',
        body: JSON.stringify({
          username: adminUser,
          email: adminEmail,
          password: adminPass,
        }),
      });

      setMessage(data.message || 'Usuario creado. Pedile a un admin que habilite el rango en Mongo.');
      setAuthMode('login');
      setAdminPass('');
      setAdminPassConfirm('');
    } catch (err) {
      setError(err.message);
    }
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken('');
    setRecipients(null);
    setMessage('');
  };

  const sendCampaign = async () => {
    if (!canSend) return;

    const confirmed = window.confirm(
      `Vas a enviar la campana "${campaignId}" a ${recipients?.eligible ?? recipients?.recipients ?? 0} emails nuevos. Confirmas el envio?`
    );

    if (!confirmed) return;

    setSending(true);
    setError('');
    setMessage('');

    try {
      const result = await apiRequest('/api/emailmkt/send', {
        method: 'POST',
        body: JSON.stringify({
          campaignId,
          subject,
          title,
          preheader,
          content,
          buttons: validButtons,
        }),
      }, token);

      setMessage(`Enviados: ${result.sent}/${result.eligible}. Ya enviados antes: ${result.alreadySent}. Fallidos: ${result.failed?.length || 0}.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  if (!token) {
    return (
      <main className="em-page em-page--login">
        <form className="em-login" onSubmit={authMode === 'login' ? login : register}>
          <p className="em-kicker">Email marketing</p>
          <h1>{authMode === 'login' ? 'Acceso admin' : 'Crear usuario'}</h1>
          <div className="em-auth-tabs">
            <button
              type="button"
              className={authMode === 'login' ? 'is-active' : ''}
              onClick={() => setAuthMode('login')}
            >
              Entrar
            </button>
            <button
              type="button"
              className={authMode === 'register' ? 'is-active' : ''}
              onClick={() => setAuthMode('register')}
            >
              Registro
            </button>
          </div>
          {error && <div className="em-alert em-alert--error">{error}</div>}
          {message && <div className="em-alert">{message}</div>}
          <label>
            Usuario
            <input value={adminUser} onChange={(event) => setAdminUser(event.target.value)} autoComplete="username" />
          </label>
          {authMode === 'register' && (
            <label>
              Email
              <input
                type="email"
                value={adminEmail}
                onChange={(event) => setAdminEmail(event.target.value)}
                autoComplete="email"
              />
            </label>
          )}
          <label>
            Contraseña
            <input
              type="password"
              value={adminPass}
              onChange={(event) => setAdminPass(event.target.value)}
              autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
            />
          </label>
          {authMode === 'register' && (
            <label>
              Repetir contrasena
              <input
                type="password"
                value={adminPassConfirm}
                onChange={(event) => setAdminPassConfirm(event.target.value)}
                autoComplete="new-password"
              />
            </label>
          )}
          {authMode === 'register' && (
            <p className="em-auth-note">
              El usuario queda pendiente. Habilitalo en Mongo cambiando el campo rango a emailmkt, admin o superadmin.
            </p>
          )}
          <button
            className="em-send"
            disabled={
              !adminUser.trim()
              || !adminPass
              || (authMode === 'register' && (!adminEmail.trim() || !adminPassConfirm))
            }
          >
            {authMode === 'login' ? 'Entrar' : 'Crear usuario'}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="em-page">
      <section className="em-header">
        <div>
          <p className="em-kicker">Email marketing</p>
          <h1>Campañas Albiero</h1>
        </div>
        <div className="em-count">
          {loadingRecipients
            ? 'Cargando...'
            : `${recipients?.eligible ?? recipients?.recipients ?? 0} nuevos / ${recipients?.recipients || 0} total`}
          <button className="em-logout" onClick={logout}>Salir</button>
        </div>
      </section>

      {error && <div className="em-alert em-alert--error">{error}</div>}
      {message && <div className="em-alert">{message}</div>}

      <section className="em-grid">
        <div className="em-panel">
          <label>
            ID de campana
            <input
              value={campaignId}
              onChange={(event) => setCampaignId(event.target.value)}
              placeholder="mail_1_descuento_newsletter"
            />
          </label>

          <label>
            Asunto
            <input value={subject} onChange={(event) => setSubject(event.target.value)} />
          </label>

          <label>
            Título principal
            <input value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>

          <label>
            Preheader
            <input value={preheader} onChange={(event) => setPreheader(event.target.value)} />
          </label>

          <label>
            Contenido
            <textarea value={content} onChange={(event) => setContent(event.target.value)} rows={12} />
          </label>

          <div className="em-buttons-editor">
            <span>Botones</span>
            {buttons.map((button, index) => (
              <div className="em-button-row" key={index}>
                <input
                  placeholder="Texto"
                  value={button.label}
                  onChange={(event) => updateButton(index, 'label', event.target.value)}
                />
                <input
                  placeholder="URL"
                  value={button.url}
                  onChange={(event) => updateButton(index, 'url', event.target.value)}
                />
              </div>
            ))}
          </div>

          <button className="em-send" disabled={!canSend} onClick={sendCampaign}>
            {sending ? 'Enviando...' : 'Enviar campaña'}
          </button>
        </div>

        <aside className="em-preview">
          <div className="em-mail">
            <div className="em-mail-head">
              <img src="https://res.cloudinary.com/dtxdv136u/image/upload/v1763499836/logo_alb_ged07k.png" alt="" />
              <h2>{title || 'Título de la campaña'}</h2>
              <p>Albiero Seguridad · +40 años protegiendo Tucumán</p>
            </div>
            <div className="em-mail-body">
              {(content || 'Escribí el contenido de la campaña. Separá párrafos con una línea en blanco.')
                .split(/\n{2,}/)
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              {validButtons.length > 0 && (
                <div className="em-mail-actions">
                  {validButtons.map((button, index) => (
                    <a key={index} href={button.url}>{button.label}</a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
