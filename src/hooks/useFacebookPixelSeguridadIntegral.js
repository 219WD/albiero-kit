// hooks/useFacebookPixelSeguridadIntegral.js
import { useEffect, useRef } from 'react';

const PRODUCTO = 'SeguridadIntegral';

const firePixel = (eventType, eventName, params = {}) => {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') {
    console.warn('[Pixel SeguridadIntegral] fbq no está disponible');
    return;
  }
  window.fbq(eventType, eventName, params);
};

const buildContentName = (tipo, ubicacion, sistema) => {
  const partes = [];
  if (tipo)      partes.push(tipo.charAt(0).toUpperCase() + tipo.slice(1));
  if (ubicacion) partes.push(ubicacion.replace(/[\s/]+/g, ''));
  if (sistema)   partes.push(sistema.charAt(0).toUpperCase() + sistema.slice(1));
  return `${PRODUCTO}_${partes.join('_')}`;
  // Ej: "SeguridadIntegral_Empresa_SanMigueldeTucuman_Integral"
};

const TIPO_LABELS = {
  empresa:    'Empresa',
  comercio:   'Comercio',
  barrio:     'Barrio privado',
  deposito:   'Depósito / predio',
  particular: 'Propiedad particular',
};

const SISTEMA_LABELS = {
  guardias:     'Seguridad física con guardias',
  perimetral:   'Protección perimetral electrónica',
  accesos:      'Control de accesos',
  integral:     'Sistema integral completo',
  personalizado:'Personalizado',
};

const useFacebookPixelSeguridadIntegral = () => {
  const initialized = useRef(false);
  useEffect(() => { initialized.current = true; }, []);

  // ── Paso 1 ───────────────────────────────────────────────────────────────────
  const trackTipoSelected = (tipo) => {
    const tipoLabel   = TIPO_LABELS[tipo] || tipo;
    const contentName = `${PRODUCTO}_${tipoLabel.replace(/\s/g, '')}`;

    firePixel('track', 'ViewContent', {
      content_name:     contentName,
      content_category: 'SeguridadIntegral_Paso1',
      content_type:     'service',
      producto:         PRODUCTO,
    });

    firePixel('trackCustom', 'Paso1_SeguridadIntegral_TipoSeleccionado', {
      tipo:         tipoLabel,
      content_name: contentName,
      producto:     PRODUCTO,
    });

    console.log('[Pixel SeguridadIntegral] Paso 1:', { tipo: tipoLabel });
  };

  // ── Paso 2 ───────────────────────────────────────────────────────────────────
  const trackUbicacionSelected = (tipo, ubicacion) => {
    const tipoLabel   = TIPO_LABELS[tipo] || tipo;
    const contentName = buildContentName(tipo, ubicacion, null);

    firePixel('track', 'ViewContent', {
      content_name:     contentName,
      content_category: 'SeguridadIntegral_Paso2',
      content_type:     'service',
      producto:         PRODUCTO,
    });

    firePixel('trackCustom', 'Paso2_SeguridadIntegral_UbicacionSeleccionada', {
      tipo:         tipoLabel,
      ubicacion,
      content_name: contentName,
      producto:     PRODUCTO,
    });

    console.log('[Pixel SeguridadIntegral] Paso 2:', { tipo: tipoLabel, ubicacion });
  };

  // ── Paso 3 ───────────────────────────────────────────────────────────────────
  const trackSistemaSelected = (tipo, ubicacion, sistema) => {
    const tipoLabel    = TIPO_LABELS[tipo] || tipo;
    const sistemaLabel = SISTEMA_LABELS[sistema] || sistema;
    const contentName  = buildContentName(tipo, ubicacion, sistema);

    firePixel('track', 'InitiateCheckout', {
      content_name:     contentName,
      content_category: 'SeguridadIntegral_Paso3',
      content_type:     'service',
      value:            1.0,
      currency:         'ARS',
      tipo:             tipoLabel,
      ubicacion,
      sistema:          sistemaLabel,
      producto:         PRODUCTO,
    });

    firePixel('trackCustom', 'Paso3_SeguridadIntegral_SistemaSeleccionado', {
      tipo:         tipoLabel,
      ubicacion,
      sistema:      sistemaLabel,
      content_name: contentName,
      producto:     PRODUCTO,
      valor_lead:   1.0,
      currency:     'ARS',
    });

    console.log('[Pixel SeguridadIntegral] Paso 3:', { tipo: tipoLabel, ubicacion, sistema: sistemaLabel });
  };

  // ── Lead completo ─────────────────────────────────────────────────────────────
  const trackFormComplete = (formData) => {
    const tipoLabel    = TIPO_LABELS[formData.tipo] || formData.tipo;
    const sistemaLabel = SISTEMA_LABELS[formData.sistema] || formData.sistema;
    const contentName  = buildContentName(formData.tipo, formData.ubicacion, formData.sistema);

    firePixel('track', 'Lead', {
      content_name:     contentName,
      content_category: 'SeguridadIntegral_Lead_Completado',
      value:            1.0,
      currency:         'ARS',
      tipo:             tipoLabel,
      ubicacion:        formData.ubicacion,
      sistema:          sistemaLabel,
      producto:         PRODUCTO,
    });

    firePixel('trackCustom', 'SeguridadIntegral_FormularioEnviado_WhatsApp', {
      content_name: contentName,
      tipo:         tipoLabel,
      ubicacion:    formData.ubicacion,
      sistema:      sistemaLabel,
      producto:     PRODUCTO,
      timestamp:    new Date().toISOString(),
    });

    console.log('[Pixel SeguridadIntegral] Lead completo:', { contentName, ...formData });
  };

  return {
    trackTipoSelected,
    trackUbicacionSelected,
    trackSistemaSelected,
    trackFormComplete,
  };
};

export default useFacebookPixelSeguridadIntegral;