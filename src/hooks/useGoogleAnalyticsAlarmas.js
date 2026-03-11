// hooks/useGoogleAnalyticsAlarmas.js
// ─────────────────────────────────────────────────────────────────────────────
// Tracking GA4 para el hero de Alarmas Monitoreadas.
// Los nombres de evento incluyen el sufijo _alarmas para distinguirlos
// de los eventos del Kit Alarma+Cámara en los reportes de GA4.
// ─────────────────────────────────────────────────────────────────────────────

const useGoogleAnalyticsAlarmas = () => {

  const sendGA4Event = (eventName, params = {}) => {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
      console.warn('[GA4 Alarmas] gtag no disponible');
      return;
    }
    window.gtag('event', eventName, { ...params, producto: 'Alarmas' });
  };

  // ── Paso 1 ───────────────────────────────────────────────────────────────────
  const trackTipoSelectedGA4 = (tipo) => {
    const tipoTexto = tipo === 'casa' ? 'Casa' : 'Comercio';

    sendGA4Event('alarmas_tipo_selected', {
      tipo:  tipoTexto,
      step:  1,
    });

    window.gtag?.('set', 'user_properties', {
      alarmas_tipo_preferido: tipoTexto,
    });
  };

  // ── Paso 2 ───────────────────────────────────────────────────────────────────
  const trackUbicacionSelectedGA4 = (tipo, ubicacion) => {
    const tipoTexto = tipo === 'casa' ? 'Casa' : 'Comercio';

    sendGA4Event('alarmas_ubicacion_selected', {
      tipo:      tipoTexto,
      ubicacion,
      step:      2,
    });

    window.gtag?.('set', 'user_properties', {
      alarmas_tipo_preferido:      tipoTexto,
      alarmas_ubicacion_preferida: ubicacion,
    });
  };

  // ── Paso 3 ───────────────────────────────────────────────────────────────────
  const trackSistemaSelectedGA4 = (tipo, ubicacion, sistema) => {
    const tipoTexto = tipo === 'casa' ? 'Casa' : 'Comercio';
    const sistemaTexto = {
      chico:         'Chico',
      mediano:       'Mediano',
      grande:        'Grande',
      personalizado: 'Personalizado',
    }[sistema] || sistema;

    sendGA4Event('alarmas_sistema_selected', {
      tipo:      tipoTexto,
      ubicacion,
      sistema:   sistemaTexto,
      step:      3,
    });

    window.gtag?.('set', 'user_properties', {
      alarmas_tipo_preferido:      tipoTexto,
      alarmas_ubicacion_preferida: ubicacion,
      alarmas_sistema_interes:     sistemaTexto,
    });
  };

  // ── Lead ─────────────────────────────────────────────────────────────────────
  const trackLeadGA4 = (formData) => {
    const tipoTexto = formData.tipo === 'casa' ? 'Casa' : 'Comercio';
    const sistemaTexto = {
      chico:         'Chico',
      mediano:       'Mediano',
      grande:        'Grande',
      personalizado: 'Personalizado',
    }[formData.sistema] || formData.sistema;

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

export default useGoogleAnalyticsAlarmas;