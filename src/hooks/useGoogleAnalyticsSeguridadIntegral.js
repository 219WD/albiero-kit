import { createGA4FormTracking } from '../utils/ga4Tracking.js';

const TIPO_LABELS = {
  empresa: 'Empresa',
  comercio: 'Comercio',
  barrio: 'Barrio privado',
  deposito: 'Deposito / predio',
  particular: 'Propiedad particular',
};

const SISTEMA_LABELS = {
  guardias: 'Guardias',
  perimetral: 'Perimetral electronica',
  accesos: 'Control de accesos',
  integral: 'Sistema integral',
  personalizado: 'Personalizado',
};

const useGoogleAnalyticsSeguridadIntegral = () =>
  createGA4FormTracking({
    product: 'SeguridadIntegral',
    userPropertyPrefix: 'integral',
    typeLabels: TIPO_LABELS,
    systemLabels: SISTEMA_LABELS,
    eventNames: {
      tipo: 'integral_tipo_selected',
      ubicacion: 'integral_ubicacion_selected',
      sistema: 'integral_sistema_selected',
      lead: 'integral_lead_whatsapp',
    },
  });

export default useGoogleAnalyticsSeguridadIntegral;
