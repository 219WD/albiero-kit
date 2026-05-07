import { useEffect, useMemo, useState } from 'react';
import './EmailMkt.css';

const API_BASE = import.meta.env.VITE_ANALYTICS_API_URL || 'http://localhost:4000';
const API_SECRET = import.meta.env.VITE_ANALYTICS_SECRET || '';

const initialButtons = [
  {
    label: 'Consultar por WhatsApp',
    url: 'https://wa.me/5493813522339?text=Hola%2C%20vengo%20de%20mi%20suscripcion%20al%20newsletter%20y%20quiero%20usar%20mi%20descuento',
  },
  { label: '', url: '' },
  { label: '', url: '' },
];

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_SECRET}`,
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
    let active = true;

    apiRequest('/api/emailmkt/recipients')
      .then((data) => {
        if (active) setRecipients(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoadingRecipients(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const validButtons = useMemo(
    () => buttons.filter((button) => button.label.trim() && button.url.trim()),
    [buttons]
  );

  const canSend = subject.trim() && title.trim() && content.trim() && !sending;

  const updateButton = (index, field, value) => {
    setButtons((current) =>
      current.map((button, buttonIndex) =>
        buttonIndex === index ? { ...button, [field]: value } : button
      )
    );
  };

  const sendCampaign = async () => {
    if (!canSend) return;

    const confirmed = window.confirm(
      `Vas a enviar esta campaña a ${recipients?.recipients || 0} emails. ¿Confirmás el envío?`
    );

    if (!confirmed) return;

    setSending(true);
    setError('');
    setMessage('');

    try {
      const result = await apiRequest('/api/emailmkt/send', {
        method: 'POST',
        body: JSON.stringify({
          subject,
          title,
          preheader,
          content,
          buttons: validButtons,
        }),
      });

      setMessage(`Enviados: ${result.sent}/${result.recipients}. Fallidos: ${result.failed?.length || 0}.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="em-page">
      <section className="em-header">
        <div>
          <p className="em-kicker">Email marketing</p>
          <h1>Campañas Albiero</h1>
        </div>
        <div className="em-count">
          {loadingRecipients ? 'Cargando...' : `${recipients?.recipients || 0} destinatarios`}
        </div>
      </section>

      {error && <div className="em-alert em-alert--error">{error}</div>}
      {message && <div className="em-alert">{message}</div>}

      <section className="em-grid">
        <div className="em-panel">
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
