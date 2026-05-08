import { createGA4FormTracking } from '../utils/ga4Tracking.js';

const TIPO_LABELS = {
  moto: 'Moto',
  auto: 'Auto',
  flota: 'Flota',
};

const SISTEMA_LABELS = {
  ubicacion: 'Ubicacion y seguridad',
  control: 'Control de uso',
  gestion: 'Gestion de flota',
  personalizado: 'Personalizado',
};

const useGoogleAnalyticsGPS = () =>
  createGA4FormTracking({
    product: 'GPS',
    userPropertyPrefix: 'gps',
    typeLabels: TIPO_LABELS,
    systemLabels: SISTEMA_LABELS,
    eventNames: {
      tipo: 'gps_tipo_selected',
      ubicacion: 'gps_ubicacion_selected',
      sistema: 'gps_sistema_selected',
      lead: 'gps_lead_whatsapp',
    },
  });

export default useGoogleAnalyticsGPS;
