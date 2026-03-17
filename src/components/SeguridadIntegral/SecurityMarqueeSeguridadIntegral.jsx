// SecurityMarqueeSeguridadIntegral.jsx
import React from "react";
import "./SecurityMarqueeSeguridadIntegral.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved,
  faUserShield,
  faBolt,
  faWaveSquare,
  faDoorOpen,
  faDrawPolygon,
  faEye,
  faArrowsUpDown,
} from "@fortawesome/free-solid-svg-icons";

const clUrl = (originalUrl, { w, h }) => {
  const transform = `w_${w},h_${h},c_fill,f_auto,q_auto`;
  return originalUrl.replace("/upload/", `/upload/${transform}/`);
};

const IMAGES = {
  movil:       "https://res.cloudinary.com/dtxdv136u/image/upload/v1772815812/movil_v16g6k.jpg",
  guardia:     "https://res.cloudinary.com/dtxdv136u/image/upload/v1772817081/guardia_qzg86d.jpg",
  atencion:    "https://res.cloudinary.com/dtxdv136u/image/upload/v1772815811/atencion_ltbz78.jpg",
  atencionDos: "https://res.cloudinary.com/dtxdv136u/image/upload/v1772817013/atencion2_ygnn0i.jpg",
  instalacion: "https://res.cloudinary.com/dtxdv136u/image/upload/v1772815812/instalacion_n57src.jpg",
  monitoreo:   "https://res.cloudinary.com/dtxdv136u/image/upload/v1772815812/monitoreo_iqv0mn.jpg",
  equipo:      "https://res.cloudinary.com/dtxdv136u/image/upload/v1772815812/equipo_z4zk7b.jpg",
  camara:      "https://res.cloudinary.com/dtxdv136u/image/upload/v1772815810/camara_qkq4st.jpg",
};

const CARD_DIMS   = { w: 380, h: 570 };
const EQUIPO_DIMS = { w: 750, h: 500 };

const services = [
  {
    id: 1,
    icon: faShieldHalved,
    title: "Protección total del espacio",
    description:
      "Integramos recursos humanos y tecnología para cubrir accesos, perímetros y áreas críticas de tu propiedad. Soluciones diseñadas según el nivel de riesgo real.",
    image: clUrl(IMAGES.monitoreo, CARD_DIMS),
    dims:  CARD_DIMS,
  },
  {
    id: 2,
    icon: faUserShield,
    title: "Seguridad física con guardias",
    description:
      "Presencia preventiva y control activo en puntos estratégicos. Ideal para reducir incidentes, supervisar movimientos y reforzar la seguridad fuera de horario.",
    image: clUrl(IMAGES.guardia, CARD_DIMS),
    dims:  CARD_DIMS,
  },
  {
    id: 3,
    icon: faBolt,
    title: "Cercos eléctricos",
    description:
      "Protección perimetral disuasiva que dificulta ingresos no autorizados. Funciona como primera barrera de seguridad en predios, empresas o propiedades extensas.",
    image: clUrl(IMAGES.equipo, EQUIPO_DIMS),
    dims:  EQUIPO_DIMS,
  },
  {
    id: 4,
    icon: faWaveSquare,
    title: "Barreras infrarrojas",
    description:
      "Detección temprana de intrusiones en perímetros o sectores sensibles. Permiten activar alertas inmediatas ante movimientos sospechosos.",
    image: clUrl(IMAGES.atencion, CARD_DIMS),
    dims:  CARD_DIMS,
  },
  {
    id: 5,
    icon: faDoorOpen,
    title: "Control de accesos",
    description:
      "Gestión ordenada de ingresos y egresos de personas o vehículos. Mejora la organización operativa y reduce riesgos internos.",
    image: clUrl(IMAGES.instalacion, CARD_DIMS),
    dims:  CARD_DIMS,
  },
  {
    id: 6,
    icon: faDrawPolygon,
    title: "Protección perimetral integral",
    description:
      "Cobertura estratégica del terreno para evitar accesos indebidos. Ideal para depósitos, industrias, barrios privados o predios amplios.",
    image: clUrl(IMAGES.movil, CARD_DIMS),
    dims:  CARD_DIMS,
  },
  {
    id: 7,
    icon: faEye,
    title: "Supervisión y control permanente",
    description:
      "Integración de sistemas que permiten monitorear lo que ocurre en tiempo real. Mayor visibilidad operativa y capacidad de reacción ante eventos.",
    image: clUrl(IMAGES.atencionDos, CARD_DIMS),
    dims:  CARD_DIMS,
  },
  {
    id: 8,
    icon: faArrowsUpDown,
    title: "Soluciones escalables",
    description:
      "El sistema puede ampliarse o adaptarse según el crecimiento del negocio o cambios en el nivel de riesgo. Una inversión en seguridad que evoluciona con tu propiedad.",
    image: clUrl(IMAGES.camara, CARD_DIMS),
    dims:  CARD_DIMS,
  },
];

const duplicatedServices = [...services, ...services];

const SecurityMarqueeSeguridadIntegral = () => {
  return (
    <section className="security-marquee-container">
      <div className="marquee-header" id="beneficios">
        <div className="marquee-badge">
          <span>BENEFICIOS</span>
        </div>

        <h2 className="marquee-title">
          Seguridad <span className="marquee-gradient">Integral</span>
        </h2>

        <p className="marquee-subtitle">
          Soluciones combinadas de seguridad física y electrónica diseñadas según
          el riesgo y las necesidades de cada espacio. Cobertura en San Miguel de
          Tucumán, Yerba Buena, Tafí Viejo, Tafí del Valle y El Mollar.
        </p>
      </div>

      <div className="marquee-wrapper">
        <div className="marquee-track">
          {duplicatedServices.map((service, index) => (
            <div key={`${service.id}-${index}`} className="marquee-card">
              <div className="card-image-container">
                <img
                  src={service.image}
                  alt={service.title}
                  className="card-background-image"
                  width={service.dims.w}
                  height={service.dims.h}
                  loading={index < 3 ? "eager" : "lazy"}
                  decoding="async"
                />
                <div className="card-overlay"></div>
              </div>

              <div className="card-content">
                <div className="card-icon">
                  <FontAwesomeIcon icon={service.icon} aria-hidden="true" />
                </div>
                <h3 className="card-title">{service.title}</h3>
                <p className="card-description">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecurityMarqueeSeguridadIntegral;