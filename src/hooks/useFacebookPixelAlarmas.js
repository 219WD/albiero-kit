// hooks/useFacebookPixelAlarmas.js
// ─────────────────────────────────────────────────────────────────────────────
// Tracking granular para el hero de Alarmas Monitoreadas.
// Misma estrategia que useFacebookPixel (Kit Alarma+Cámara) pero con
// content_category y nombres de eventos propios para segmentar audiencias
// por producto en Meta Events Manager.
//
// Audiencias que podés crear:
//   - Visitantes del formulario de alarmas (Paso1_Alarmas_TipoSeleccionado)
//   - Casa + Yerba Buena + Kit Mediano que NO enviaron (retargeting)
//   - Leads completos de alarmas vs leads de Kit Alarma+Cámara
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react';

const firePixel = (eventType, eventName, params = {}) => {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') {
    console.warn('[Pixel Alarmas] fbq no está disponible');
    return;
  }
  window.fbq(eventType, eventName, params);
};

const buildContentName = (tipo, ubicacion, sistema) => {
  const partes = [];
  if (tipo)      partes.push(tipo === 'casa' ? 'Casa' : 'Comercio');
  if (ubicacion) partes.push(ubicacion.replace(/[\s/]+/g, ''));
  if (sistema)   partes.push(sistema.charAt(0).toUpperCase() + sistema.slice(1));
  return `Alarmas_${partes.join('_')}`;
  // Ej: "Alarmas_Casa_YerbaBuena_Mediano"
};

const SISTEMA_LABELS = {
  chico:         'Kit Chico',
  mediano:       'Kit Mediano',
  grande:        'Kit Grande',
  personalizado: 'Personalizado',
};

const useFacebookPixelAlarmas = () => {
  const initialized = useRef(false);

  useEffect(() => {
    initialized.current = true;
  }, []);

  // ── Paso 1: tipo (Casa / Comercio) ──────────────────────────────────────────
  const trackTipoSelected = (tipo) => {
    const tipoLabel   = tipo === 'casa' ? 'Casa' : 'Comercio';
    const contentName = `Alarmas_${tipoLabel}`;

    firePixel('track', 'ViewContent', {
      content_name:     contentName,
      content_category: 'Alarmas_Paso1',
      content_type:     'service',
    });

    firePixel('trackCustom', 'Paso1_Alarmas_TipoSeleccionado', {
      tipo:         tipoLabel,
      content_name: contentName,
      producto:     'Alarmas',
    });

    console.log('[Pixel Alarmas] Paso 1:', { tipo: tipoLabel });
  };

  // ── Paso 2: ubicación ────────────────────────────────────────────────────────
  const trackUbicacionSelected = (tipo, ubicacion) => {
    const tipoLabel   = tipo === 'casa' ? 'Casa' : 'Comercio';
    const contentName = buildContentName(tipo, ubicacion, null);

    firePixel('track', 'ViewContent', {
      content_name:     contentName,
      content_category: 'Alarmas_Paso2',
      content_type:     'service',
    });

    firePixel('trackCustom', 'Paso2_Alarmas_UbicacionSeleccionada', {
      tipo:         tipoLabel,
      ubicacion,
      content_name: contentName,
      producto:     'Alarmas',
    });

    console.log('[Pixel Alarmas] Paso 2:', { tipo: tipoLabel, ubicacion });
  };

  // ── Paso 3: sistema ──────────────────────────────────────────────────────────
  const trackSistemaSelected = (tipo, ubicacion, sistema) => {
    const tipoLabel    = tipo === 'casa' ? 'Casa' : 'Comercio';
    const sistemaLabel = SISTEMA_LABELS[sistema] || sistema;
    const contentName  = buildContentName(tipo, ubicacion, sistema);

    firePixel('track', 'InitiateCheckout', {
      content_name:     contentName,
      content_category: 'Alarmas_Paso3',
      content_type:     'service',
      value:            1.0,
      currency:         'ARS',
      tipo:             tipoLabel,
      ubicacion,
      sistema:          sistemaLabel,
    });

    firePixel('trackCustom', 'Paso3_Alarmas_SistemaSeleccionado', {
      tipo:         tipoLabel,
      ubicacion,
      sistema:      sistemaLabel,
      content_name: contentName,
      producto:     'Alarmas',
      valor_lead:   1.0,
      currency:     'ARS',
    });

    console.log('[Pixel Alarmas] Paso 3:', { tipo: tipoLabel, ubicacion, sistema: sistemaLabel });
  };

  // ── Envío: lead completo ─────────────────────────────────────────────────────
  const trackFormComplete = (formData) => {
    const tipoLabel    = formData.tipo === 'casa' ? 'Casa' : 'Comercio';
    const sistemaLabel = SISTEMA_LABELS[formData.sistema] || formData.sistema;
    const contentName  = buildContentName(formData.tipo, formData.ubicacion, formData.sistema);

    firePixel('track', 'Lead', {
      content_name:     contentName,
      content_category: 'Alarmas_Lead_Completado',
      value:            1.0,
      currency:         'ARS',
      tipo:             tipoLabel,
      ubicacion:        formData.ubicacion,
      sistema:          sistemaLabel,
    });

    firePixel('trackCustom', 'Alarmas_FormularioEnviado_WhatsApp', {
      content_name: contentName,
      tipo:         tipoLabel,
      ubicacion:    formData.ubicacion,
      sistema:      sistemaLabel,
      producto:     'Alarmas',
      timestamp:    new Date().toISOString(),
    });

    console.log('[Pixel Alarmas] Lead completo:', { contentName, ...formData });
  };

  return {
    trackTipoSelected,
    trackUbicacionSelected,
    trackSistemaSelected,
    trackFormComplete,
  };
};

export default useFacebookPixelAlarmas;