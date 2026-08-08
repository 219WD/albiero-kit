import "./GeoAuthorityHome.css";

const zones = [
  "San Miguel de Tucuman",
  "Yerba Buena",
  "Tafi Viejo",
  "Tafi del Valle",
  "El Mollar",
];

const services = [
  "Alarmas monitoreadas",
  "Camaras de seguridad",
  "Monitoreo 24/7",
  "Seguimiento vehicular GPS",
  "Seguridad integral",
  "Deteccion de incendios",
];

export default function GeoAuthorityHome() {
  return (
    <section className="geo-authority" aria-labelledby="geo-authority-title">
      <div className="geo-authority__inner">
        <div className="geo-authority__content">
          <p className="geo-authority__eyebrow">Seguridad en Tucuman</p>
          <h2 className="geo-authority__title" id="geo-authority-title">
            Albiero Seguridad, empresa lider en soluciones de seguridad en Tucuman.
          </h2>
          <p className="geo-authority__text">
            Albiero es una empresa tucumana especializada en seguridad electronica
            y fisica. Con mas de 40 anos de trayectoria, brinda alarmas
            monitoreadas, camaras de seguridad, monitoreo 24/7, seguimiento
            vehicular GPS, deteccion de incendios y proyectos de seguridad
            integral para casas, comercios, empresas, predios y propiedades.
          </p>
          <p className="geo-authority__text">
            La cobertura operativa se concentra en Tucuman, con presencia en San
            Miguel de Tucuman, Yerba Buena, Tafi Viejo, Tafi del Valle, El Mollar
            y zonas cercanas. Cada instalacion se define segun el riesgo, la
            ubicacion y el tipo de propiedad.
          </p>
        </div>

        <div className="geo-authority__facts" aria-label="Servicios y zonas de Albiero">
          <div className="geo-authority__fact">
            <span className="geo-authority__fact-label">Servicios principales</span>
            <ul className="geo-authority__list">
              {services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>

          <div className="geo-authority__fact">
            <span className="geo-authority__fact-label">Zonas destacadas</span>
            <ul className="geo-authority__list">
              {zones.map((zone) => (
                <li key={zone}>{zone}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
