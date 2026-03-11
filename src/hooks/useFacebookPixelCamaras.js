// hooks/useFacebookPixelCamaras.js
import { useEffect, useRef } from 'react';

const firePixel = (eventType, eventName, params = {}) => {
    if (typeof window === 'undefined' || typeof window.fbq !== 'function') {
        console.warn('[Pixel Camaras] fbq no está disponible');
        return;
    }
    window.fbq(eventType, eventName, params);
};

const buildContentName = (tipo, ubicacion, sistema) => {
    const partes = [];
    if (tipo) partes.push(tipo === 'casa' ? 'Casa' : 'Comercio');
    if (ubicacion) partes.push(ubicacion.replace(/[\s/]+/g, ''));
    if (sistema) partes.push(sistema.charAt(0).toUpperCase() + sistema.slice(1));
    return `Camaras_${partes.join('_')}`;
};

const SISTEMA_LABELS = {
    chico: 'Kit Chico',
    mediano: 'Kit Mediano',
    grande: 'Kit Grande',
    personalizado: 'Personalizado',
};

const useFacebookPixelCamaras = () => {
    const initialized = useRef(false);
    useEffect(() => { initialized.current = true; }, []);

    const trackTipoSelected = (tipo) => {
        const tipoLabel = tipo === 'casa' ? 'Casa' : 'Comercio';
        const contentName = `Camaras_${tipoLabel}`;
        firePixel('track', 'ViewContent', { content_name: contentName, content_category: 'Camaras_Paso1', content_type: 'service' });
        firePixel('trackCustom', 'Paso1_Camaras_TipoSeleccionado', { tipo: tipoLabel, content_name: contentName, producto: 'Camaras' });
    };

    const trackUbicacionSelected = (tipo, ubicacion) => {
        const tipoLabel = tipo === 'casa' ? 'Casa' : 'Comercio';
        const contentName = buildContentName(tipo, ubicacion, null);
        firePixel('track', 'ViewContent', { content_name: contentName, content_category: 'Camaras_Paso2', content_type: 'service' });
        firePixel('trackCustom', 'Paso2_Camaras_UbicacionSeleccionada', { tipo: tipoLabel, ubicacion, content_name: contentName, producto: 'Camaras' });
    };

    const trackSistemaSelected = (tipo, ubicacion, sistema) => {
        const tipoLabel = tipo === 'casa' ? 'Casa' : 'Comercio';
        const sistemaLabel = SISTEMA_LABELS[sistema] || sistema;
        const contentName = buildContentName(tipo, ubicacion, sistema);
        firePixel('track', 'InitiateCheckout', { content_name: contentName, content_category: 'Camaras_Paso3', content_type: 'service', value: 1.0, currency: 'ARS', tipo: tipoLabel, ubicacion, sistema: sistemaLabel });
        firePixel('trackCustom', 'Paso3_Camaras_SistemaSeleccionado', { tipo: tipoLabel, ubicacion, sistema: sistemaLabel, content_name: contentName, producto: 'Camaras', valor_lead: 1.0, currency: 'ARS' });
    };

    const trackFormComplete = (formData) => {
        const tipoLabel = formData.tipo === 'casa' ? 'Casa' : 'Comercio';
        const sistemaLabel = SISTEMA_LABELS[formData.sistema] || formData.sistema;
        const contentName = buildContentName(formData.tipo, formData.ubicacion, formData.sistema);
        firePixel('track', 'Lead', { content_name: contentName, content_category: 'Camaras_Lead_Completado', value: 1.0, currency: 'ARS', tipo: tipoLabel, ubicacion: formData.ubicacion, sistema: sistemaLabel });
        firePixel('trackCustom', 'Camaras_FormularioEnviado_WhatsApp', { content_name: contentName, tipo: tipoLabel, ubicacion: formData.ubicacion, sistema: sistemaLabel, producto: 'Camaras', timestamp: new Date().toISOString() });
    };

    return { trackTipoSelected, trackUbicacionSelected, trackSistemaSelected, trackFormComplete };
};

export default useFacebookPixelCamaras;