// SecurityMarqueeGps.jsx
import React from "react";
import "./SecurityMarqueeGps.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faRoute,
  faBell,
  faChartLine,
  faShieldHalved,
  faClock,
  faGauge,
  faPlugCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

// Helper para generar URLs de Cloudinary optimizadas
const clUrl = (originalUrl, { w, h }) => {
  const transform = `w_${w},h_${h},c_fill,f_auto,q_auto`;
  return originalUrl.replace("/upload/", `/upload/${transform}/`);
};

const IMAGES = {
  historial:     "https://res.cloudinary.com/dtxdv136u/image/upload/v1773092457/historial_iozxez.png",
  guardia:   "https://res.cloudinary.com/dtxdv136u/image/upload/v1772817081/guardia_qzg86d.jpg",
  alerta:  "https://res.cloudinary.com/dtxdv136u/image/upload/v1773092455/alertavelocidad_ovtmnt.png",
  velocidad: "https://res.cloudinary.com/dtxdv136u/image/upload/v1773092455/velocidadDos_k5st3z.jpg",
  fuerahora: "https://res.cloudinary.com/dtxdv136u/image/upload/v1773092455/fuerahorariodos_qmmzya.jpg",
  ubicacion: "https://res.cloudinary.com/dtxdv136u/image/upload/v1773092440/moto_bgurrs.png",
  metricas:    "https://res.cloudinary.com/dtxdv136u/image/upload/v1773092445/metricas_cllxnz.jpg",
  instalacion:    "https://res.cloudinary.com/dtxdv136u/image/upload/v1773092439/mecanico_mpff4d.jpg",
};

const CARD_DIMS   = { w: 380, h: 570 };
const EQUIPO_DIMS = { w: 750, h: 500 };

const services = [
  {
    id: 1,
    icon: faLocationDot,
    title: "Ubicación en tiempo real",
    description:
      "Podés ver en todo momento dónde se encuentra tu vehículo directamente desde tu celular. Sin demoras, sin intermediarios.",
    image: clUrl(IMAGES.ubicacion, CARD_DIMS),
    dims: CARD_DIMS,
  },
  {
    id: 2,
    icon: faRoute,
    title: "Historial completo de recorridos",
    description:
      "Accedé a registros detallados de todos los trayectos realizados: por dónde circuló, cuánto tiempo estuvo detenido y cuánto duró cada recorrido.",
    image: clUrl(IMAGES.historial, CARD_DIMS),
    dims: CARD_DIMS,
  },
  {
    id: 3,
    icon: faChartLine,
    title: "Información clara para tomar decisiones",
    description:
      "No dependés de suposiciones. Tenés datos reales sobre recorridos, tiempos de uso, zonas recorridas y comportamiento de conducción.",
    image: clUrl(IMAGES.metricas, EQUIPO_DIMS),
    dims: EQUIPO_DIMS,
  },
  {
    id: 4,
    icon: faBell,
    title: "Alertas inteligentes",
    description:
      "Configurá avisos automáticos cuando el vehículo supera cierta velocidad, sale de una zona determinada o se utiliza fuera del horario establecido.",
    image: clUrl(IMAGES.alerta, CARD_DIMS),
    dims: CARD_DIMS,
  },
  {
    id: 5,
    icon: faGauge,
    title: "Control de velocidad y conducción",
    description:
      "Registramos excesos de velocidad y patrones de manejo brusco. Ideal para flotas que necesitan cuidar sus vehículos y reducir costos de mantenimiento.",
    image: clUrl(IMAGES.velocidad, CARD_DIMS),
    dims: CARD_DIMS,
  },
  {
    id: 6,
    icon: faClock,
    title: "Control de horarios de uso",
    description:
      "Definí ventanas horarias permitidas para cada vehículo. Si el equipo se activa fuera del horario, recibís una alerta al instante.",
    image: clUrl(IMAGES.fuerahora, CARD_DIMS),
    dims: CARD_DIMS,
  },
  {
    id: 7,
    icon: faPlugCircleCheck,
    title: "Instalación rápida y sin complicaciones",
    description:
      "El equipo GPS se instala en menos de una hora. Sin obras, sin modificaciones. Activación inmediata y comodato incluido en el servicio.",
    image: clUrl(IMAGES.instalacion, CARD_DIMS),
    dims: CARD_DIMS,
  },
];

// Duplicar para efecto marquee infinito
const duplicatedServices = [...services, ...services];

const SecurityMarqueeGps = () => {
  return (
    <section className="security-marquee-container">
      <div className="marquee-header" id="beneficios">
        <div className="marquee-badge">
          <span>BENEFICIOS</span>
        </div>

        <h2 className="marquee-title">
          Monitoreo <span className="marquee-gradient">GPS Vehicular</span>
        </h2>

        <p className="marquee-subtitle">
          Control total de tu vehículo o flota con seguimiento en tiempo real
          24/7 desde nuestra central de monitoreo. Cobertura en San Miguel de
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

export default SecurityMarqueeGps;