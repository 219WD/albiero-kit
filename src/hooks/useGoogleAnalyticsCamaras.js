import { createGA4FormTracking } from '../utils/ga4Tracking.js';

const useGoogleAnalyticsCamaras = () =>
  createGA4FormTracking({
    product: 'Camaras',
    userPropertyPrefix: 'camaras',
    eventNames: {
      tipo: 'camaras_tipo_selected',
      ubicacion: 'camaras_ubicacion_selected',
      sistema: 'camaras_sistema_selected',
      lead: 'camaras_lead_whatsapp',
    },
  });

export default useGoogleAnalyticsCamaras;
