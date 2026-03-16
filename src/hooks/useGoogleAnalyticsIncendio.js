// hooks/useGoogleAnalyticsIncendio.js
const PRODUCTO = 'Incendio';

const SISTEMA_LABELS = {
  chico:         'Chico',
  mediano:       'Mediano',
  grande:        'Grande',
  personalizado: 'Personalizado',
};

const useGoogleAnalyticsIncendio = () => {

  const sendGA4Event = (eventName, params = {}) => {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
      console.warn('[GA4 Incendio] gtag no disponible');
      return;
    }
    window.gtag('event', eventName, { ...params, producto: PRODUCTO });
  };

  // ── Paso 1 ───────────────────────────────────────────────────────────────────
  const trackTipoSelectedGA4 = (tipo) => {
    const tipoTexto = tipo === 'casa' ? 'Casa' : 'Comercio';

    sendGA4Event('incendio_tipo_selected', {
      tipo: tipoTexto,
      step: 1,
    });

    window.gtag?.('set', 'user_properties', {
      incendio_tipo_preferido: tipoTexto,
    });
  };

  // ── Paso 2 ───────────────────────────────────────────────────────────────────
  const trackUbicacionSelectedGA4 = (tipo, ubicacion) => {
    const tipoTexto = tipo === 'casa' ? 'Casa' : 'Comercio';

    sendGA4Event('incendio_ubicacion_selected', {
      tipo:      tipoTexto,
      ubicacion,
      step:      2,
    });

    window.gtag?.('set', 'user_properties', {
      incendio_tipo_preferido:       tipoTexto,
      incendio_ubicacion_preferida:  ubicacion,
    });
  };

  // ── Paso 3 ───────────────────────────────────────────────────────────────────
  const trackSistemaSelectedGA4 = (tipo, ubicacion, sistema) => {
    const tipoTexto    = tipo === 'casa' ? 'Casa' : 'Comercio';
    const sistemaTexto = SISTEMA_LABELS[sistema] || sistema;

    sendGA4Event('incendio_sistema_selected', {
      tipo:      tipoTexto,
      ubicacion,
      sistema:   sistemaTexto,
      step:      3,
    });

    window.gtag?.('set', 'user_properties', {
      incendio_tipo_preferido:      tipoTexto,
      incendio_ubicacion_preferida: ubicacion,
      incendio_sistema_interes:     sistemaTexto,
    });
  };

  // ── Lead ─────────────────────────────────────────────────────────────────────
  const trackLeadGA4 = (formData) => {
    const tipoTexto    = formData.tipo === 'casa' ? 'Casa' : 'Comercio';
    const sistemaTexto = SISTEMA_LABELS[formData.sistema] || formData.sistema;

    sendGA4Event('generate_lead', {
      tipo:      tipoTexto,
      ubicacion: formData.ubicacion,
      sistema:   sistemaTexto,
      value:     1,
      currency:  'ARS',
    });
  };

  return {
    trackTipoSelectedGA4,
    trackUbicacionSelectedGA4,
    trackSistemaSelectedGA4,
    trackLeadGA4,
  };
};

export default useGoogleAnalyticsIncendio;