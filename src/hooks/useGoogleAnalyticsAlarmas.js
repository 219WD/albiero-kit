import { createGA4FormTracking } from '../utils/ga4Tracking.js';

const useGoogleAnalyticsAlarmas = () =>
  createGA4FormTracking({
    product: 'Alarmas',
    userPropertyPrefix: 'alarmas',
    eventNames: {
      tipo: 'alarmas_tipo_selected',
      ubicacion: 'alarmas_ubicacion_selected',
      sistema: 'alarmas_sistema_selected',
      lead: 'alarmas_lead_whatsapp',
    },
  });

export default useGoogleAnalyticsAlarmas;
