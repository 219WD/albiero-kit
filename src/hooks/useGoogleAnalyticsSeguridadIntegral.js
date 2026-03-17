// hooks/useGoogleAnalyticsSeguridadIntegral.js
const PRODUCTO = 'SeguridadIntegral';

const TIPO_LABELS = {
  empresa:    'Empresa',
  comercio:   'Comercio',
  barrio:     'Barrio_Privado',
  deposito:   'Deposito_Predio',
  particular: 'Propiedad_Particular',
};

const SISTEMA_LABELS = {
  guardias:     'Guardias',
  perimetral:   'Perimetral_Electronica',
  accesos:      'Control_Accesos',
  integral:     'Sistema_Integral',
  personalizado:'Personalizado',
};

const useGoogleAnalyticsSeguridadIntegral = () => {

  const sendGA4Event = (eventName, params = {}) => {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
      console.warn('[GA4 SeguridadIntegral] gtag no disponible');
      return;
    }
    window.gtag('event', eventName, { ...params, producto: PRODUCTO });
  };

  // ── Paso 1 ───────────────────────────────────────────────────────────────────
  const trackTipoSelectedGA4 = (tipo) => {
    const tipoTexto = TIPO_LABELS[tipo] || tipo;

    sendGA4Event('integral_tipo_selected', {
      tipo: tipoTexto,
      step: 1,
    });

    window.gtag?.('set', 'user_properties', {
      integral_tipo_propiedad: tipoTexto,
    });
  };

  // ── Paso 2 ───────────────────────────────────────────────────────────────────
  const trackUbicacionSelectedGA4 = (tipo, ubicacion) => {
    const tipoTexto = TIPO_LABELS[tipo] || tipo;

    sendGA4Event('integral_ubicacion_selected', {
      tipo:      tipoTexto,
      ubicacion,
      step:      2,
    });

    window.gtag?.('set', 'user_properties', {
      integral_tipo_propiedad:     tipoTexto,
      integral_ubicacion_preferida: ubicacion,
    });
  };

  // ── Paso 3 ───────────────────────────────────────────────────────────────────
  const trackSistemaSelectedGA4 = (tipo, ubicacion, sistema) => {
    const tipoTexto    = TIPO_LABELS[tipo] || tipo;
    const sistemaTexto = SISTEMA_LABELS[sistema] || sistema;

    sendGA4Event('integral_sistema_selected', {
      tipo:      tipoTexto,
      ubicacion,
      sistema:   sistemaTexto,
      step:      3,
    });

    window.gtag?.('set', 'user_properties', {
      integral_tipo_propiedad:      tipoTexto,
      integral_ubicacion_preferida: ubicacion,
      integral_solucion_interes:    sistemaTexto,
    });
  };

  // ── Lead ─────────────────────────────────────────────────────────────────────
  const trackLeadGA4 = (formData) => {
    const tipoTexto    = TIPO_LABELS[formData.tipo] || formData.tipo;
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

export default useGoogleAnalyticsSeguridadIntegral;