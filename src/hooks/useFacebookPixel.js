// hooks/useFacebookPixel.js
import { useEffect } from 'react';
import ReactPixel from 'react-facebook-pixel';

const useFacebookPixel = () => {
  useEffect(() => {
    // Tu Pixel ID de Meta (reemplazá con el tuyo)
    const pixelId = 'TU_PIXEL_ID_AQUI';
    
    const options = {
      autoConfig: true,
      debug: true, // Cambiar a false en producción
    };
    
    ReactPixel.init(pixelId, null, options);
    ReactPixel.pageView();
  }, []);
  
  const trackFormStep = (step, data) => {
    ReactPixel.trackCustom('FormStep', {
      step: step,
      ...data
    });
  };
  
  const trackFormComplete = (formData) => {
    // Mapear los valores a textos legibles
    const tipoTexto = formData.tipo === 'casa' ? 'Casa' : 'Comercio';
    const ubicacionTexto = formData.ubicacion;
    const sistemaTexto = {
      chico: 'Kit Chico',
      mediano: 'Kit Mediano',
      grande: 'Kit Grande',
      personalizado: 'Personalizado'
    }[formData.sistema] || formData.sistema;
    
    // Crear parámetros para segmentación
    const pixelData = {
      tipo: tipoTexto,
      ubicacion: ubicacionTexto,
      sistema: sistemaTexto,
      content_name: `${tipoTexto} - ${ubicacionTexto} - ${sistemaTexto}`,
      content_category: 'Lead Calificado',
      value: 1.0,
      currency: 'ARS'
    };
    
    // Trackear como Lead (evento estándar)
    ReactPixel.track('Lead', pixelData);
    
    // También trackear un evento custom con más detalles
    ReactPixel.trackCustom('FormularioCompletado', {
      ...pixelData,
      timestamp: new Date().toISOString()
    });
  };
  
  const trackFormAbandonment = (currentStep, formData) => {
    ReactPixel.trackCustom('FormAbandono', {
      currentStep: currentStep,
      tipo: formData.tipo || 'No seleccionado',
      ubicacion: formData.ubicacion || 'No seleccionado',
      sistema: formData.sistema || 'No seleccionado'
    });
  };
  
  return {
    trackFormStep,
    trackFormComplete,
    trackFormAbandonment
  };
};

export default useFacebookPixel;