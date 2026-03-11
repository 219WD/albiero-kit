// hooks/useGoogleAnalyticsGPS.js
// ─────────────────────────────────────────────────────────────────────────────
// GA4 TRACKING PARA HERO GPS VEHICULAR
//
// Misma estructura que useGoogleAnalytics.js, adaptada a los nuevos
// valores del formulario de monitoreo vehicular.
//
// Pasos:
//   Paso 1 → tipo de vehículo: moto / auto / flota
//   Paso 2 → ubicación: Yerba Buena / San Miguel / Tafí-El Mollar / Otra zona
//   Paso 3 → necesidad: ubicacion / control / gestion / personalizado
// ─────────────────────────────────────────────────────────────────────────────

const useGoogleAnalyticsGPS = () => {

  // ─── Helper: envía eventos a GA4 ────────────────────────────────────────────
  const sendGA4Event = (eventName, params = {}) => {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
      console.warn('[GA4 GPS] gtag no disponible');
      return;
    }
    window.gtag('event', eventName, params);
  };

  // ─── Mapeo de valores internos a etiquetas legibles ──────────────────────────
  const TIPO_LABELS = {
    moto:  'Moto',
    auto:  'Auto',
    flota: 'Flota',
  };

  const SISTEMA_LABELS = {
    ubicacion:    'Ubicacion y seguridad',
    control:      'Control de uso',
    gestion:      'Gestion de flota',
    personalizado: 'Personalizado',
  };

  // ─── PASO 1: tipo de vehículo ─────────────────────────────────────────────────
  const trackTipoSelectedGA4 = (tipo) => {
    const tipoTexto = TIPO_LABELS[tipo] || tipo;

    sendGA4Event('gps_tipo_selected', {
      tipo:  tipoTexto,
      step:  1,
    });

    window.gtag?.('set', 'user_properties', {
      gps_tipo_vehiculo: tipoTexto,
    });
  };

  // ─── PASO 2: ubicación ────────────────────────────────────────────────────────
  const trackUbicacionSelectedGA4 = (tipo, ubicacion) => {
    const tipoTexto = TIPO_LABELS[tipo] || tipo;

    sendGA4Event('gps_ubicacion_selected', {
      tipo:      tipoTexto,
      ubicacion: ubicacion,
      step:      2,
    });

    window.gtag?.('set', 'user_properties', {
      gps_tipo_vehiculo:   tipoTexto,
      gps_ubicacion:       ubicacion,
    });
  };

  // ─── PASO 3: qué quiere controlar ────────────────────────────────────────────
  const trackSistemaSelectedGA4 = (tipo, ubicacion, sistema) => {
    const tipoTexto    = TIPO_LABELS[tipo] || tipo;
    const sistemaTexto = SISTEMA_LABELS[sistema] || sistema;

    sendGA4Event('gps_sistema_selected', {
      tipo:      tipoTexto,
      ubicacion: ubicacion,
      sistema:   sistemaTexto,
      step:      3,
    });

    window.gtag?.('set', 'user_properties', {
      gps_tipo_vehiculo:   tipoTexto,
      gps_ubicacion:       ubicacion,
      gps_necesidad:       sistemaTexto,
    });
  };

  // ─── Lead completo: usuario abrió WhatsApp ────────────────────────────────────
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

export default useGoogleAnalyticsGPS;