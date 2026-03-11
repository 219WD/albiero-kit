// hooks/useGoogleAnalyticsCamaras.js
const useGoogleAnalyticsCamaras = () => {
    const sendGA4Event = (eventName, params = {}) => {
        if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
            console.warn('[GA4 Camaras] gtag no disponible');
            return;
        }
        window.gtag('event', eventName, { ...params, producto: 'Camaras' });
    };

    const trackTipoSelectedGA4 = (tipo) => {
        const tipoTexto = tipo === 'casa' ? 'Casa' : 'Comercio';
        sendGA4Event('camaras_tipo_selected', { tipo: tipoTexto, step: 1 });
        window.gtag?.('set', 'user_properties', { camaras_tipo_preferido: tipoTexto });
    };

    const trackUbicacionSelectedGA4 = (tipo, ubicacion) => {
        const tipoTexto = tipo === 'casa' ? 'Casa' : 'Comercio';
        sendGA4Event('camaras_ubicacion_selected', { tipo: tipoTexto, ubicacion, step: 2 });
        window.gtag?.('set', 'user_properties', { camaras_tipo_preferido: tipoTexto, camaras_ubicacion_preferida: ubicacion });
    };

    const trackSistemaSelectedGA4 = (tipo, ubicacion, sistema) => {
        const tipoTexto = tipo === 'casa' ? 'Casa' : 'Comercio';
        const sistemaTexto = { chico: 'Chico', mediano: 'Mediano', grande: 'Grande', personalizado: 'Personalizado' }[sistema] || sistema;
        sendGA4Event('camaras_sistema_selected', { tipo: tipoTexto, ubicacion, sistema: sistemaTexto, step: 3 });
        window.gtag?.('set', 'user_properties', { camaras_tipo_preferido: tipoTexto, camaras_ubicacion_preferida: ubicacion, camaras_sistema_interes: sistemaTexto });
    };

    const trackLeadGA4 = (formData) => {
        const tipoTexto = formData.tipo === 'casa' ? 'Casa' : 'Comercio';
        const sistemaTexto = { chico: 'Chico', mediano: 'Mediano', grande: 'Grande', personalizado: 'Personalizado' }[formData.sistema] || formData.sistema;
        sendGA4Event('generate_lead', { tipo: tipoTexto, ubicacion: formData.ubicacion, sistema: sistemaTexto, value: 1, currency: 'ARS' });
    };

    return { trackTipoSelectedGA4, trackUbicacionSelectedGA4, trackSistemaSelectedGA4, trackLeadGA4 };
};

export default useGoogleAnalyticsCamaras;