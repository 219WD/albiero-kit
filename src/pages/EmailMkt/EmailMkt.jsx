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

const padButtons = (buttons = []) => {
  const normalized = buttons
    .filter((button) => button && (button.label || button.url))
    .slice(0, 3)
    .map((button) => ({
      label: button.label || '',
      url: button.url || '',
    }));

  while (normalized.length < 3) {
    normalized.push({ label: '', url: '' });
  }

  return normalized;
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

function formatDate(value) {
  if (!value) return '-';

  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
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
  const [templateId, setTemplateId] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [templates, setTemplates] = useState([]);
  const [view, setView] = useState('send');
  const [recipients, setRecipients] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [loadingRecipients, setLoadingRecipients] = useState(true);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const clearAdminSession = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken('');
    setRecipients(null);
    setCampaigns([]);
    setSelectedCampaign(null);
    setTemplates([]);
    setTemplateId('');
  };

  const handleRequestError = (err) => {
    if (err.status === 401 || err.message === 'No autorizado') {
      setError('Sesion vencida o usuario sin permisos. Toca Salir e inicia sesion de nuevo.');
      return;
    }

    setError(err.message);
  };

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
          handleRequestError(err);
        }
      })
      .finally(() => {
        if (active) setLoadingRecipients(false);
      });

    return () => {
      active = false;
    };
  }, [token, campaignId]);

  const loadCampaigns = async () => {
    if (!token) return;

    setLoadingCampaigns(true);
    setError('');

    try {
      const data = await apiRequest('/api/emailmkt/campaigns', {}, token);
      setCampaigns(data.campaigns || []);
    } catch (err) {
      handleRequestError(err);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  const loadCampaignDetail = async (nextCampaignId) => {
    setLoadingCampaigns(true);
    setError('');

    try {
      const data = await apiRequest(`/api/emailmkt/campaigns/${encodeURIComponent(nextCampaignId)}`, {}, token);
      setSelectedCampaign(data.campaign);
    } catch (err) {
      handleRequestError(err);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  const loadTemplates = async () => {
    if (!token) return;

    setLoadingTemplates(true);
    setError('');

    try {
      const data = await apiRequest('/api/emailmkt/templates', {}, token);
      setTemplates(data.templates || []);
    } catch (err) {
      handleRequestError(err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const applyTemplate = (template) => {
    setTemplateId(template.id || '');
    setTemplateName(template.name || '');
    setSubject(template.subject || '');
    setTitle(template.title || '');
    setPreheader(template.preheader || '');
    setContent(template.content || '');
    setButtons(padButtons(template.buttons || []));
  };

  const loadTemplateDetail = async (nextTemplateId) => {
    if (!nextTemplateId) return;

    setLoadingTemplates(true);
    setError('');

    try {
      const data = await apiRequest(`/api/emailmkt/templates/${encodeURIComponent(nextTemplateId)}`, {}, token);
      applyTemplate(data.template);
      setMessage('Plantilla cargada.');
    } catch (err) {
      handleRequestError(err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  useEffect(() => {
    if (token && view === 'history') {
      loadCampaigns();
    }
  }, [token, view]);

  useEffect(() => {
    if (token && view === 'send') {
      loadTemplates();
    }
  }, [token, view]);

  const validButtons = useMemo(
    () => buttons.filter((button) => button.label.trim() && button.url.trim()),
    [buttons]
  );

  const canSend = campaignId.trim() && subject.trim() && title.trim() && content.trim() && !sending;
  const canSaveTemplate = templateName.trim() && subject.trim() && title.trim() && content.trim() && !savingTemplate;

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
    clearAdminSession();
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
      loadCampaigns();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const saveTemplate = async () => {
    if (!canSaveTemplate) return;

    setSavingTemplate(true);
    setError('');
    setMessage('');

    const endpoint = templateId
      ? `/api/emailmkt/templates/${encodeURIComponent(templateId)}`
      : '/api/emailmkt/templates';
    const method = templateId ? 'PUT' : 'POST';

    try {
      const data = await apiRequest(endpoint, {
        method,
        body: JSON.stringify({
          name: templateName,
          subject,
          title,
          preheader,
          content,
          buttons: validButtons,
        }),
      }, token);

      applyTemplate(data.template);
      await loadTemplates();
      setMessage(templateId ? 'Plantilla actualizada.' : 'Plantilla guardada.');
    } catch (err) {
      handleRequestError(err);
    } finally {
      setSavingTemplate(false);
    }
  };

  const deleteTemplate = async () => {
    if (!templateId) return;

    const confirmed = window.confirm(`Vas a eliminar la plantilla "${templateName}". Confirmas?`);
    if (!confirmed) return;

    setSavingTemplate(true);
    setError('');
    setMessage('');

    try {
      await apiRequest(`/api/emailmkt/templates/${encodeURIComponent(templateId)}`, {
        method: 'DELETE',
      }, token);

      setTemplateId('');
      setTemplateName('');
      await loadTemplates();
      setMessage('Plantilla eliminada.');
    } catch (err) {
      handleRequestError(err);
    } finally {
      setSavingTemplate(false);
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

      <div className="em-view-tabs">
        <button className={view === 'send' ? 'is-active' : ''} onClick={() => setView('send')}>
          Enviar campana
        </button>
        <button className={view === 'history' ? 'is-active' : ''} onClick={() => setView('history')}>
          Historial
        </button>
      </div>

      {view === 'history' ? (
        <section className="em-history">
          <div className="em-panel">
            <div className="em-panel-head">
              <div>
                <p className="em-kicker">Historial</p>
                <h2>Campanas enviadas</h2>
              </div>
              <button className="em-logout" onClick={loadCampaigns} disabled={loadingCampaigns}>
                Actualizar
              </button>
            </div>
            {campaigns.length === 0 && (
              <p className="em-empty">{loadingCampaigns ? 'Cargando campanas...' : 'Todavia no hay campanas enviadas.'}</p>
            )}
            {campaigns.map((campaign) => (
              <button
                className="em-campaign-row"
                key={campaign.campaignId}
                onClick={() => loadCampaignDetail(campaign.campaignId)}
              >
                <span>
                  <strong>{campaign.campaignId}</strong>
                  <small>{campaign.subject || 'Sin asunto'} - ultimo envio {formatDate(campaign.lastSentAt)}</small>
                </span>
                <span className="em-campaign-stats">
                  {campaign.sent} enviados
                  {campaign.failed > 0 ? ` - ${campaign.failed} fallidos` : ''}
                </span>
              </button>
            ))}
          </div>

          <aside className="em-panel">
            <div className="em-panel-head">
              <div>
                <p className="em-kicker">Detalle</p>
                <h2>{selectedCampaign?.campaignId || 'Selecciona una campana'}</h2>
              </div>
            </div>
            {!selectedCampaign && <p className="em-empty">Elegí una campaña para ver destinatarios y estado.</p>}
            {selectedCampaign && (
              <>
                <div className="em-detail-stats">
                  <span>{selectedCampaign.sent} enviados</span>
                  <span>{selectedCampaign.failed} fallidos</span>
                  <span>{selectedCampaign.total} total</span>
                </div>
                <div className="em-recipient-list">
                  {selectedCampaign.recipients.map((recipient) => (
                    <div className="em-recipient-row" key={`${recipient.email}-${recipient.updatedAt}`}>
                      <span>
                        <strong>{recipient.email}</strong>
                        <small>{formatDate(recipient.sentAt || recipient.updatedAt)}</small>
                        {recipient.error && <small className="em-error-text">{recipient.error}</small>}
                      </span>
                      <em className={recipient.status === 'sent' ? 'is-sent' : 'is-failed'}>{recipient.status}</em>
                    </div>
                  ))}
                </div>
              </>
            )}
          </aside>
        </section>
      ) : (
      <section className="em-grid">
        <div className="em-panel">
          <div className="em-template-box">
            <div className="em-template-head">
              <span>Plantillas</span>
              <button type="button" onClick={loadTemplates} disabled={loadingTemplates}>
                {loadingTemplates ? 'Cargando...' : 'Actualizar'}
              </button>
            </div>

            <label>
              Nombre de plantilla
              <input
                value={templateName}
                onChange={(event) => setTemplateName(event.target.value)}
                placeholder="Promo newsletter junio"
              />
            </label>

            <div className="em-template-row">
              <select
                value={templateId}
                onChange={(event) => {
                  const nextId = event.target.value;
                  setTemplateId(nextId);
                  if (!nextId) {
                    setTemplateName('');
                    return;
                  }
                  loadTemplateDetail(nextId);
                }}
              >
                <option value="">Nueva plantilla</option>
                {templates.map((template) => (
                  <option value={template.id} key={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => loadTemplateDetail(templateId)}
                disabled={!templateId || loadingTemplates}
              >
                Usar
              </button>
            </div>

            <div className="em-template-actions">
              <button type="button" onClick={saveTemplate} disabled={!canSaveTemplate}>
                {savingTemplate ? 'Guardando...' : templateId ? 'Actualizar plantilla' : 'Guardar plantilla'}
              </button>
              <button type="button" onClick={deleteTemplate} disabled={!templateId || savingTemplate}>
                Eliminar
              </button>
            </div>
          </div>

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
      )}
    </main>
  );
}
