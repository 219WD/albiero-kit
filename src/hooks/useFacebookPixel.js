// hooks/useFacebookPixel.js
import { useEffect, useRef } from 'react';
import { sendMetaEvent } from '../utils/metaEvents';

const PRODUCTO = 'KitAlarmaCamara';

const firePixel = (eventType, eventName, params = {}) => {
  sendMetaEvent(eventType, eventName, params, { warnPrefix: 'Pixel' });
};

const buildContentName = (tipo, ubicacion, sistema) => {
  const partes = [];
  if (tipo)      partes.push(tipo === 'casa' ? 'Casa' : 'Comercio');
  if (ubicacion) partes.push(ubicacion.replace(/\s+/g, ''));
  if (sistema)   partes.push((SISTEMA_LABELS[sistema] || sistema).replace(/\s+/g, ''));
  return `${PRODUCTO}_${partes.join('_')}`;
  // Ej: "KitAlarmaCamara_Casa_YerbaBuena_Mediano"
};

const SISTEMA_LABELS = {
  chico:         'Mini',
  mediano:       'Básico',
  grande:        'Premium',
  personalizado: 'Personalizado',
};

const useFacebookPixel = () => {
  const initialized = useRef(false);

  useEffect(() => {
    initialized.current = true;
  }, []);

  // ── Paso 1 ───────────────────────────────────────────────────────────────────
  const trackTipoSelected = (tipo) => {
    const tipoLabel   = tipo === 'casa' ? 'Casa' : 'Comercio';
    const contentName = `${PRODUCTO}_${tipoLabel}`;

    firePixel('track', 'ViewContent', {
      content_name:     contentName,
      content_category: 'KitAlarmaCamara_Paso1',
      content_type:     'service',
      producto:         PRODUCTO,
    });

    firePixel('trackCustom', 'Paso1_TipoSeleccionado', {
      tipo:         tipoLabel,
      content_name: contentName,
      producto:     PRODUCTO,
    });

    console.log('[Pixel] Paso 1:', { tipo: tipoLabel, producto: PRODUCTO });
  };

  // ── Paso 2 ───────────────────────────────────────────────────────────────────
  const trackUbicacionSelected = (tipo, ubicacion) => {
    const tipoLabel   = tipo === 'casa' ? 'Casa' : 'Comercio';
    const contentName = buildContentName(tipo, ubicacion, null);

    firePixel('track', 'ViewContent', {
      content_name:     contentName,
      content_category: 'KitAlarmaCamara_Paso2',
      content_type:     'service',
      producto:         PRODUCTO,
    });

    firePixel('trackCustom', 'Paso2_UbicacionSeleccionada', {
      tipo:         tipoLabel,
      ubicacion,
      content_name: contentName,
      producto:     PRODUCTO,
    });

    console.log('[Pixel] Paso 2:', { tipo: tipoLabel, ubicacion, producto: PRODUCTO });
  };

  // ── Paso 3 ───────────────────────────────────────────────────────────────────
  const trackSistemaSelected = (tipo, ubicacion, sistema) => {
    const tipoLabel    = tipo === 'casa' ? 'Casa' : 'Comercio';
    const sistemaLabel = SISTEMA_LABELS[sistema] || sistema;
    const contentName  = buildContentName(tipo, ubicacion, sistema);

    firePixel('track', 'InitiateCheckout', {
      content_name:     contentName,
      content_category: 'KitAlarmaCamara_Paso3',
      content_type:     'service',
      value:            1.0,
      currency:         'ARS',
      tipo:             tipoLabel,
      ubicacion,
      sistema:          sistemaLabel,
      producto:         PRODUCTO,
    });

    firePixel('trackCustom', 'Paso3_SistemaSeleccionado', {
      tipo:         tipoLabel,
      ubicacion,
      sistema:      sistemaLabel,
      content_name: contentName,
      producto:     PRODUCTO,
      value:        1.0,
      valor_lead:   1.0,
      currency:     'ARS',
    });

    console.log('[Pixel] Paso 3:', { tipo: tipoLabel, ubicacion, sistema: sistemaLabel, producto: PRODUCTO });
  };

  // ── Lead completo ─────────────────────────────────────────────────────────────
  const trackFormComplete = (formData) => {
    const tipoLabel    = formData.tipo === 'casa' ? 'Casa' : 'Comercio';
    const sistemaLabel = SISTEMA_LABELS[formData.sistema] || formData.sistema;
    const contentName  = buildContentName(formData.tipo, formData.ubicacion, formData.sistema);

    firePixel('track', 'Lead', {
      content_name:     contentName,
      content_category: 'KitAlarmaCamara_Lead_Completado',
      value:            1.0,
      currency:         'ARS',
      tipo:             tipoLabel,
      ubicacion:        formData.ubicacion,
      sistema:          sistemaLabel,
      producto:         PRODUCTO,
      lead_id:          formData.leadId || formData.lead_id || formData.codigo,
      codigo:           formData.codigo || formData.leadId || formData.lead_id,
      nombre:           formData.nombre,
      email:            formData.email,
      telefono:         formData.telefono,
    });

    firePixel('trackCustom', 'FormularioEnviado_WhatsApp', {
      content_name: contentName,
      tipo:         tipoLabel,
      ubicacion:    formData.ubicacion,
      sistema:      sistemaLabel,
      producto:     PRODUCTO,
      lead_id:      formData.leadId || formData.lead_id || formData.codigo,
      codigo:       formData.codigo || formData.leadId || formData.lead_id,
      nombre:       formData.nombre,
      email:        formData.email,
      telefono:     formData.telefono,
      value:        1.0,
      valor_lead:   1.0,
      currency:     'ARS',
      timestamp:    new Date().toISOString(),
    });

    console.log('[Pixel] Lead completo:', { contentName, producto: PRODUCTO, ...formData });
  };

  // ── Compatibilidad legacy ─────────────────────────────────────────────────────
  const trackFormStep = (step, data) => {
    if (step === 1 && data.tipo) {
      trackTipoSelected(data.tipo === 'Casa' ? 'casa' : 'comercio');
    }
  };

  const trackFormAbandonment = () => {};

  return {
    trackTipoSelected,
    trackUbicacionSelected,
    trackSistemaSelected,
    trackFormComplete,
    trackFormStep,
    trackFormAbandonment,
  };
};

export default useFacebookPixel;
