// hooks/useFacebookPixelGPS.js
// ─────────────────────────────────────────────────────────────────────────────
// TRACKING PARA HERO GPS VEHICULAR
//
// Misma estrategia que useFacebookPixel.js: disparamos un evento en CADA
// selección para no perder datos si el usuario se va antes de enviar.
//
// Pasos del formulario GPS:
//   Paso 1 → tipo de vehículo: moto / auto / flota
//   Paso 2 → ubicación principal
//   Paso 3 → qué querés controlar (sistema)
//
// Audiencias que podés crear en Meta:
//   - Usuarios que seleccionaron "Flota" (alto valor comercial)
//   - Usuarios que llegaron al paso 3 con ubicación "Yerba Buena"
//   - Leads completos por combinación: Auto_SanMiguel_Control
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef } from 'react';

// ─── Helper: dispara fbq solo si está disponible en window ───────────────────
const firePixel = (eventType, eventName, params = {}) => {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') {
    console.warn('[Pixel GPS] fbq no está disponible todavía');
    return;
  }
  window.fbq(eventType, eventName, params);
};

// ─── Helper: construye el content_name combinado para segmentación ────────────
// Formato: "Auto_SanMiguel_Control" → ideal para audiencias por combinación
const buildContentName = (tipo, ubicacion, sistema) => {
  const partes = [];
  if (tipo)      partes.push(TIPO_LABELS[tipo] || tipo);
  if (ubicacion) partes.push(ubicacion.replace(/[\s\/]+/g, ''));  // "SanMiguel"
  if (sistema)   partes.push(SISTEMA_LABELS[sistema] || sistema);
  return partes.join('_'); // "Auto_SanMiguel_Control"
};

// ─── Mapeo de valores internos a etiquetas legibles ──────────────────────────
const TIPO_LABELS = {
  moto:   'Moto',
  auto:   'Auto',
  flota:  'Flota',
};

const SISTEMA_LABELS = {
  ubicacion:    'Ubicacion',
  control:      'Control',
  gestion:      'Gestion',
  personalizado: 'Personalizado',
};

// ─────────────────────────────────────────────────────────────────────────────

const useFacebookPixelGPS = () => {
  const initialized = useRef(false);

  useEffect(() => {
    initialized.current = true;
  }, []);

  // ─── PASO 1: Usuario selecciona tipo de vehículo ─────────────────────────────
  const trackTipoSelected = (tipo) => {
    const tipoLabel = TIPO_LABELS[tipo] || tipo;

    firePixel('track', 'ViewContent', {
      content_name:     tipoLabel,
      content_category: 'GPS_Formulario_Paso1',
      content_type:     'service',
    });

    firePixel('trackCustom', 'GPS_Paso1_VehiculoSeleccionado', {
      tipo:         tipoLabel,
      content_name: tipoLabel,
    });

    console.log('[Pixel GPS] Paso 1 trackeado:', { tipo: tipoLabel });
  };

  // ─── PASO 2: Usuario selecciona ubicación ────────────────────────────────────
  const trackUbicacionSelected = (tipo, ubicacion) => {
    const tipoLabel   = TIPO_LABELS[tipo] || tipo;
    const contentName = buildContentName(tipo, ubicacion, null);

    firePixel('track', 'ViewContent', {
      content_name:     contentName,           // "Auto_YerbaBuena"
      content_category: 'GPS_Formulario_Paso2',
      content_type:     'service',
    });

    firePixel('trackCustom', 'GPS_Paso2_UbicacionSeleccionada', {
      tipo:          tipoLabel,
      ubicacion:     ubicacion,
      content_name:  contentName,
    });

    console.log('[Pixel GPS] Paso 2 trackeado:', { tipo: tipoLabel, ubicacion });
  };

  // ─── PASO 3: Usuario selecciona qué quiere controlar ────────────────────────
  // Evento más valioso: tenemos los 3 datos aunque no envíe el formulario
  const trackSistemaSelected = (tipo, ubicacion, sistema) => {
    const tipoLabel    = TIPO_LABELS[tipo] || tipo;
    const sistemaLabel = SISTEMA_LABELS[sistema] || sistema;
    const contentName  = buildContentName(tipo, ubicacion, sistema);

    // InitiateCheckout = señal fuerte de intención, apto para optimización
    firePixel('track', 'InitiateCheckout', {
      content_name:     contentName,           // "Auto_YerbaBuena_Control"
      content_category: 'GPS_Formulario_Paso3',
      content_type:     'service',
      value:            1.0,
      currency:         'ARS',
      tipo:             tipoLabel,
      ubicacion:        ubicacion,
      sistema:          sistemaLabel,
    });

    firePixel('trackCustom', 'GPS_Paso3_SistemaSeleccionado', {
      tipo:          tipoLabel,
      ubicacion:     ubicacion,
      sistema:       sistemaLabel,
      content_name:  contentName,
      valor_lead:    1.0,
      currency:      'ARS',
    });

    console.log('[Pixel GPS] Paso 3 trackeado:', { tipo: tipoLabel, ubicacion, sistema: sistemaLabel, contentName });
  };

  // ─── ENVÍO DEL FORMULARIO: Lead completo ─────────────────────────────────────
  const trackFormComplete = (formData) => {
    const tipoLabel    = TIPO_LABELS[formData.tipo] || formData.tipo;
    const sistemaLabel = SISTEMA_LABELS[formData.sistema] || formData.sistema;
    const contentName  = buildContentName(formData.tipo, formData.ubicacion, formData.sistema);

    firePixel('track', 'Lead', {
      content_name:     contentName,
      content_category: 'GPS_Lead_Completado',
      value:            1.0,
      currency:         'ARS',
      tipo:             tipoLabel,
      ubicacion:        formData.ubicacion,
      sistema:          sistemaLabel,
    });

    firePixel('trackCustom', 'GPS_FormularioEnviado_WhatsApp', {
      content_name:  contentName,
      tipo:          tipoLabel,
      ubicacion:     formData.ubicacion,
      sistema:       sistemaLabel,
      timestamp:     new Date().toISOString(),
    });

    console.log('[Pixel GPS] Lead completo trackeado:', { contentName, ...formData });
  };

  return {
    trackTipoSelected,
    trackUbicacionSelected,
    trackSistemaSelected,
    trackFormComplete,
  };
};

export default useFacebookPixelGPS;