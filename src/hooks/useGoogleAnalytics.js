// hooks/useGoogleAnalytics.js
const useGoogleAnalytics = () => {
  // Helper para enviar eventos a GA4
  const sendGA4Event = (eventName, params = {}) => {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
      console.warn('[GA4] gtag no disponible');
      return;
    }
    window.gtag('event', eventName, params);
  };

  const trackTipoSelectedGA4 = (tipo) => {
    const tipoTexto = tipo === 'casa' ? 'Casa' : 'Comercio';
    sendGA4Event('tipo_selected', {
      'tipo': tipoTexto,
      'step': 1
    });
    // Set user property
    window.gtag('set', 'user_properties', {
      tipo_preferido: tipoTexto
    });
  };

  const trackUbicacionSelectedGA4 = (tipo, ubicacion) => {
    const tipoTexto = tipo === 'casa' ? 'Casa' : 'Comercio';
    sendGA4Event('ubicacion_selected', {
      'tipo': tipoTexto,
      'ubicacion': ubicacion,
      'step': 2
    });
    window.gtag('set', 'user_properties', {
      tipo_preferido: tipoTexto,
      ubicacion_preferida: ubicacion
    });
  };

  const trackSistemaSelectedGA4 = (tipo, ubicacion, sistema) => {
    const tipoTexto = tipo === 'casa' ? 'Casa' : 'Comercio';
    const sistemaTexto = {
      chico: 'Chico',
      mediano: 'Mediano',
      grande: 'Grande',
      personalizado: 'Personalizado'
    }[sistema];
    
    sendGA4Event('sistema_selected', {
      'tipo': tipoTexto,
      'ubicacion': ubicacion,
      'sistema': sistemaTexto,
      'step': 3
    });
    window.gtag('set', 'user_properties', {
      tipo_preferido: tipoTexto,
      ubicacion_preferida: ubicacion,
      sistema_interes: sistemaTexto
    });
  };

  const trackLeadGA4 = (formData) => {
    const tipoTexto = formData.tipo === 'casa' ? 'Casa' : 'Comercio';
    const sistemaTexto = {
      chico: 'Chico',
      mediano: 'Mediano',
      grande: 'Grande',
      personalizado: 'Personalizado'
    }[formData.sistema];
    
    sendGA4Event('generate_lead', {
      'tipo': tipoTexto,
      'ubicacion': formData.ubicacion,
      'sistema': sistemaTexto,
      'value': 1,
      'currency': 'ARS'
    });
  };

  return {
    trackTipoSelectedGA4,
    trackUbicacionSelectedGA4,
    trackSistemaSelectedGA4,
    trackLeadGA4
  };
};

export default useGoogleAnalytics;