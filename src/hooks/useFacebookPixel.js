// hooks/useFacebookPixel.js
// ─────────────────────────────────────────────────────────────────────────────
// ESTRATEGIA DE TRACKING PARA RETARGETING GRANULAR
//
// En lugar de depender del evento "beforeunload" (muy poco confiable),
// disparamos un evento en CADA selección del formulario con todos los datos
// acumulados hasta ese momento. Así Meta siempre tiene los datos, aunque
// el usuario se vaya en cualquier momento.
//
// Audiencias que podés crear en Meta con esta implementación:
//   - Personas que vieron el paso 1 (todos los visitantes que interactuaron)
//   - Personas que seleccionaron "Casa" + "Yerba Buena" pero no enviaron
//   - Personas que llegaron al paso 3 con Kit Mediano pero no enviaron
//   - Leads completos por combinación: Casa_YerbaBuena_Mediano
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react';

// ─── Helper: dispara fbq solo si está disponible en window ───────────────────
const firePixel = (eventType, eventName, params = {}) => {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') {
    console.warn('[Pixel] fbq no está disponible todavía');
    return;
  }
  window.fbq(eventType, eventName, params);
};

// ─── Helper: construye el content_name combinado para segmentación ────────────
// Formato: "Casa_YerbaBuena_Mediano" → ideal para crear audiencias por combinación
const buildContentName = (tipo, ubicacion, sistema) => {
  const partes = [];
  if (tipo)      partes.push(tipo === 'casa' ? 'Casa' : 'Comercio');
  if (ubicacion) partes.push(ubicacion.replace(/\s+/g, ''));   // "YerbaBuena"
  if (sistema)   partes.push(sistema.charAt(0).toUpperCase() + sistema.slice(1)); // "Mediano"
  return partes.join('_'); // "Casa_YerbaBuena_Mediano"
};

// ─── Helper: mapea valores internos a etiquetas legibles ─────────────────────
const SISTEMA_LABELS = {
  chico:        'Kit Chico',
  mediano:      'Kit Mediano',
  grande:       'Kit Grande',
  personalizado: 'Personalizado',
};

const useFacebookPixel = () => {
  // Ref para saber si el Pixel ya fue inicializado en esta sesión
  const initialized = useRef(false);

  useEffect(() => {
    // El Pixel ya fue inicializado en index.html con fbq('init', ...) y fbq('track', 'PageView')
    // Este hook solo necesita marcar que está listo.
    // Si quisieras inicializarlo aquí también (sin react-facebook-pixel), bastaría con:
    //   if (!initialized.current && window.fbq) { initialized.current = true; }
    initialized.current = true;
  }, []);

  // ─── PASO 1: Usuario selecciona tipo (Casa / Comercio) ──────────────────────
  // Se dispara inmediatamente al hacer click → Meta ya tiene el dato aunque cierre
  const trackTipoSelected = (tipo) => {
    const tipoLabel = tipo === 'casa' ? 'Casa' : 'Comercio';

    // ViewContent = evento estándar de Meta, elegible para optimización de campañas
    firePixel('track', 'ViewContent', {
      content_name:     tipoLabel,
      content_category: 'Formulario_Paso1',
      content_type:     'service',
    });

    // Evento custom para audiencias granulares en Meta
    firePixel('trackCustom', 'Paso1_TipoSeleccionado', {
      tipo:         tipoLabel,
      content_name: tipoLabel,
    });

    console.log('[Pixel] Paso 1 trackeado:', { tipo: tipoLabel });
  };

  // ─── PASO 2: Usuario selecciona ubicación ────────────────────────────────────
  // Acumulamos tipo + ubicacion para que Meta pueda segmentar por combinación
  const trackUbicacionSelected = (tipo, ubicacion) => {
    const tipoLabel    = tipo === 'casa' ? 'Casa' : 'Comercio';
    const contentName  = buildContentName(tipo, ubicacion, null);

    firePixel('track', 'ViewContent', {
      content_name:     contentName,          // "Casa_YerbaBuena"
      content_category: 'Formulario_Paso2',
      content_type:     'service',
    });

    firePixel('trackCustom', 'Paso2_UbicacionSeleccionada', {
      tipo:          tipoLabel,
      ubicacion:     ubicacion,
      content_name:  contentName,
    });

    console.log('[Pixel] Paso 2 trackeado:', { tipo: tipoLabel, ubicacion });
  };

  // ─── PASO 3: Usuario selecciona sistema ──────────────────────────────────────
  // Este es el evento MÁS VALIOSO para retargeting: tenemos los 3 datos
  // aunque el usuario no envíe el formulario
  const trackSistemaSelected = (tipo, ubicacion, sistema) => {
    const tipoLabel     = tipo === 'casa' ? 'Casa' : 'Comercio';
    const sistemaLabel  = SISTEMA_LABELS[sistema] || sistema;
    const contentName   = buildContentName(tipo, ubicacion, sistema);
    // "Casa_YerbaBuena_Mediano" → la audiencia de retargeting que querés crear

    // InitiateCheckout = usuario está a punto de convertir, señal fuerte para Meta
    firePixel('track', 'InitiateCheckout', {
      content_name:     contentName,
      content_category: 'Formulario_Paso3',
      content_type:     'service',
      value:            1.0,
      currency:         'ARS',
      // Custom params para segmentación (visibles en Meta Events Manager)
      tipo:             tipoLabel,
      ubicacion:        ubicacion,
      sistema:          sistemaLabel,
    });

    // Evento custom con nombre combinado → creá una audiencia con este evento
    // Filtro en Meta: CustomEvent = "Paso3_SistemaSeleccionado" AND tipo = "Casa" AND ubicacion = "Yerba Buena"
    firePixel('trackCustom', 'Paso3_SistemaSeleccionado', {
      tipo:          tipoLabel,
      ubicacion:     ubicacion,
      sistema:       sistemaLabel,
      content_name:  contentName,   // "Casa_YerbaBuena_Mediano"
      valor_lead:    1.0,
      currency:      'ARS',
    });

    console.log('[Pixel] Paso 3 trackeado:', { tipo: tipoLabel, ubicacion, sistema: sistemaLabel, contentName });
  };

  // ─── ENVÍO DEL FORMULARIO: Lead completo ────────────────────────────────────
  // Evento Lead estándar → Meta lo usa para optimización de campañas de conversión
  const trackFormComplete = (formData) => {
    const tipoLabel    = formData.tipo === 'casa' ? 'Casa' : 'Comercio';
    const sistemaLabel = SISTEMA_LABELS[formData.sistema] || formData.sistema;
    const contentName  = buildContentName(formData.tipo, formData.ubicacion, formData.sistema);

    // Lead = evento estándar, el más importante para campañas de conversión
    firePixel('track', 'Lead', {
      content_name:     contentName,      // "Casa_YerbaBuena_Mediano"
      content_category: 'Lead_Completado',
      value:            1.0,
      currency:         'ARS',
      tipo:             tipoLabel,
      ubicacion:        formData.ubicacion,
      sistema:          sistemaLabel,
    });

    // Evento custom para distinguir leads enviados de los que solo llegaron al paso 3
    firePixel('trackCustom', 'FormularioEnviado_WhatsApp', {
      content_name:  contentName,
      tipo:          tipoLabel,
      ubicacion:     formData.ubicacion,
      sistema:       sistemaLabel,
      timestamp:     new Date().toISOString(),
    });

    console.log('[Pixel] Lead completo trackeado:', { contentName, ...formData });
  };

  // ─── COMPATIBILIDAD CON EL COMPONENTE HeroSecurity ──────────────────────────
  // Estas funciones mantienen la interfaz que ya usás en HeroSecurity.jsx
  // para no tener que reescribir ese componente
  const trackFormStep = (step, data) => {
    if (step === 1 && data.tipo) {
      trackTipoSelected(data.tipo === 'Casa' ? 'casa' : 'comercio');
    }
  };

  const trackFormAbandonment = () => {
    // Ya no es necesario: el tracking en cada paso reemplaza este evento.
    // Los datos ya están en Meta desde el momento de la selección.
    // Dejamos la función vacía para no romper la interfaz existente.
  };

  return {
    // API nueva (recomendada)
    trackTipoSelected,
    trackUbicacionSelected,
    trackSistemaSelected,
    trackFormComplete,
    // API legacy (compatibilidad con HeroSecurity.jsx actual)
    trackFormStep,
    trackFormAbandonment,
  };
};

export default useFacebookPixel;