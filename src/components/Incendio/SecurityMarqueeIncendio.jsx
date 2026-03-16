// SecurityMarqueeIncendio.jsx
import React from "react";
import "./SecurityMarqueeIncendio.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFireFlameCurved,
  faClock,
  faBell,
  faShieldHalved,
  faHeadset,
  faBolt,
  faMobileScreen,
  faHouseCircleCheck,
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
    icon: faFireFlameCurved,
    title: "Detección temprana de incendios",
    description:
      "Los sensores detectan humo, gas o aumento anormal de temperatura y envían alertas inmediatas. Esto permite actuar rápidamente y reducir riesgos mayores.",
    image: clUrl(IMAGES.monitoreo, CARD_DIMS),
    dims:  CARD_DIMS,
  },
  {
    id: 2,
    icon: faClock,
    title: "Protección activa las 24 horas",
    description:
      "El sistema funciona de forma continua, incluso cuando no hay personas en la propiedad. Ideal para prevenir sin depender de la presencia humana.",
    image: clUrl(IMAGES.guardia, CARD_DIMS),
    dims:  CARD_DIMS,
  },
  {
    id: 3,
    icon: faBell,
    title: "Alertas en tiempo real",
    description:
      "Recibís notificaciones inmediatas en tu celular ante cualquier evento. Esto te permite reaccionar rápidamente y tomar decisiones a tiempo.",
    image: clUrl(IMAGES.atencion, CARD_DIMS),
    dims:  CARD_DIMS,
  },
  {
    id: 4,
    icon: faShieldHalved,
    title: "Prevención de daños mayores",
    description:
      "La detección temprana ayuda a minimizar pérdidas materiales, riesgos estructurales y situaciones peligrosas para las personas.",
    image: clUrl(IMAGES.equipo, EQUIPO_DIMS),
    dims:  EQUIPO_DIMS,
  },
  {
    id: 5,
    icon: faHeadset,
    title: "Central de monitoreo 24/7",
    description:
      "Cuando se activa un sensor, la señal llega en segundos a nuestra central. Personal capacitado evalúa y activa el protocolo de respuesta inmediato.",
    image: clUrl(IMAGES.atencionDos, CARD_DIMS),
    dims:  CARD_DIMS,
  },
  {
    id: 6,
    icon: faBolt,
    title: "Respuesta en menos de 5 minutos",
    description:
      "Desde que se detecta la alerta hasta que llega el móvil a tu domicilio. Y se coordina con el cuerpo de bomberos.",
    image: clUrl(IMAGES.movil, CARD_DIMS),
    dims:  CARD_DIMS,
  },
  {
    id: 7,
    icon: faMobileScreen,
    title: "Control desde tu celular",
    description:
      "Accedé al estado del sistema en cualquier momento y desde cualquier lugar. Recibís el historial de eventos y alertas directamente en tu dispositivo.",
    image: clUrl(IMAGES.camara, CARD_DIMS),
    dims:  CARD_DIMS,
  },
  {
    id: 8,
    icon: faHouseCircleCheck,
    title: "Instalación profesional en 48 horas",
    description:
      "Desde que contratás el servicio hasta que tu propiedad está protegida. Equipos en comodato, sin necesidad de comprar nada.",
    image: clUrl(IMAGES.instalacion, CARD_DIMS),
    dims:  CARD_DIMS,
  },
];

const duplicatedServices = [...services, ...services];

const SecurityMarqueeIncendio = () => {
  return (
    <section className="security-marquee-container">
      <div className="marquee-header" id="beneficios">
        <div className="marquee-badge">
          <span>BENEFICIOS</span>
        </div>

        <h2 className="marquee-title">
          Sistema de <span className="marquee-gradient">Detección de Incendios</span>
        </h2>

        <p className="marquee-subtitle">
          Protección preventiva para tu casa o comercio con sensores inteligentes
          y monitoreo activo 24/7 desde nuestras centrales de control. Cobertura en
          San Miguel de Tucumán, Yerba Buena, Tafí Viejo, Tafí del Valle y El Mollar.
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

export default SecurityMarqueeIncendio;