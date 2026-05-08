import { createGA4FormTracking } from '../utils/ga4Tracking.js';

const useGoogleAnalyticsIncendio = () =>
  createGA4FormTracking({
    product: 'Incendio',
    userPropertyPrefix: 'incendio',
    eventNames: {
      tipo: 'incendio_tipo_selected',
      ubicacion: 'incendio_ubicacion_selected',
      sistema: 'incendio_sistema_selected',
      lead: 'incendio_lead_whatsapp',
    },
  });

export default useGoogleAnalyticsIncendio;
