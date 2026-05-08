import { createGA4FormTracking } from '../utils/ga4Tracking.js';

const useGoogleAnalytics = () =>
  createGA4FormTracking({
    product: 'KitAlarmaCamara',
    userPropertyPrefix: 'kit',
    eventNames: {
      tipo: 'tipo_selected',
      ubicacion: 'ubicacion_selected',
      sistema: 'sistema_selected',
      lead: 'kit_lead_whatsapp',
    },
  });

export default useGoogleAnalytics;
