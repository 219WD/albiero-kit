const DEFAULT_TYPE_LABELS = {
  casa: 'Casa',
  comercio: 'Comercio',
};

const DEFAULT_SYSTEM_LABELS = {
  chico: 'Chico',
  mediano: 'Mediano',
  grande: 'Grande',
  personalizado: 'Personalizado',
};

export function sendGA4Event(eventName, params = {}, warnPrefix = 'GA4') {
  if (typeof window === 'undefined') return;

  const eventParams = {
    event_category: 'lead_form',
    ...params,
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'albiero_ga4_event',
    ga4_event_name: eventName,
    ...eventParams,
  });

  if (typeof window.gtag !== 'function') {
    console.warn(`[${warnPrefix}] gtag no disponible`, eventName, eventParams);
    return;
  }

  window.gtag('event', eventName, eventParams);
}

export function createGA4FormTracking({
  product,
  eventNames,
  typeLabels = DEFAULT_TYPE_LABELS,
  systemLabels = DEFAULT_SYSTEM_LABELS,
  userPropertyPrefix,
}) {
  const labelTipo = (tipo) => typeLabels[tipo] || tipo || '';
  const labelSistema = (sistema) => systemLabels[sistema] || sistema || '';

  const setUserProperties = (properties) => {
    if (typeof window === 'undefined') return;
    window.gtag?.('set', 'user_properties', properties);
  };

  const sendProductEvent = (eventName, params = {}) => {
    sendGA4Event(eventName, {
      producto: product,
      ...params,
    }, `GA4 ${product}`);
  };

  const trackTipoSelectedGA4 = (tipo) => {
    const tipoTexto = labelTipo(tipo);

    sendProductEvent(eventNames.tipo, {
      tipo: tipoTexto,
      step: 1,
      form_step: 'tipo',
    });

    setUserProperties({
      [`${userPropertyPrefix}_tipo`]: tipoTexto,
    });
  };

  const trackUbicacionSelectedGA4 = (tipo, ubicacion) => {
    const tipoTexto = labelTipo(tipo);

    sendProductEvent(eventNames.ubicacion, {
      tipo: tipoTexto,
      ubicacion,
      step: 2,
      form_step: 'ubicacion',
    });

    setUserProperties({
      [`${userPropertyPrefix}_tipo`]: tipoTexto,
      [`${userPropertyPrefix}_ubicacion`]: ubicacion,
    });
  };

  const trackSistemaSelectedGA4 = (tipo, ubicacion, sistema) => {
    const tipoTexto = labelTipo(tipo);
    const sistemaTexto = labelSistema(sistema);

    sendProductEvent(eventNames.sistema, {
      tipo: tipoTexto,
      ubicacion,
      sistema: sistemaTexto,
      step: 3,
      form_step: 'sistema',
    });

    setUserProperties({
      [`${userPropertyPrefix}_tipo`]: tipoTexto,
      [`${userPropertyPrefix}_ubicacion`]: ubicacion,
      [`${userPropertyPrefix}_sistema`]: sistemaTexto,
    });
  };

  const trackLeadGA4 = (formData = {}) => {
    const tipoTexto = labelTipo(formData.tipo);
    const sistemaTexto = labelSistema(formData.sistema);
    const leadParams = {
      producto: product,
      tipo: tipoTexto,
      ubicacion: formData.ubicacion,
      sistema: sistemaTexto,
      value: 1,
      currency: 'ARS',
      method: 'whatsapp',
      lead_source: 'hero_form_step_3',
      form_step: 'lead',
    };

    sendGA4Event('generate_lead', leadParams, `GA4 ${product}`);
    sendGA4Event(eventNames.lead, leadParams, `GA4 ${product}`);
  };

  return {
    trackTipoSelectedGA4,
    trackUbicacionSelectedGA4,
    trackSistemaSelectedGA4,
    trackLeadGA4,
  };
}
