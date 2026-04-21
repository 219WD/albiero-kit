// SecurityMarquee.jsx
import React from "react";
import "./SecurityMarqueeHome.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved,
  faVideo,
  faTruck,
  faHandshake,
  faHeadset,
  faBolt,
  faLock,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

// Helper para generar URLs de Cloudinary optimizadas
// Inserta transformaciones entre /upload/ y /vXXX/nombre.jpg
const clUrl = (originalUrl, { w, h }) => {
  const transform = `w_${w},h_${h},c_fill,f_auto,q_auto`;
  return originalUrl.replace("/upload/", `/upload/${transform}/`);
};

// URLs originales (tal como las tenés en Cloudinary)
const IMAGES = {
  movil:     "https://res.cloudinary.com/dtxdv136u/image/upload/v1772815812/movil_v16g6k.jpg",
  guardia:   "https://res.cloudinary.com/dtxdv136u/image/upload/v1772817081/guardia_qzg86d.jpg",
  atencion:  "https://res.cloudinary.com/dtxdv136u/image/upload/v1772815811/atencion_ltbz78.jpg",
  atencionDos: "https://res.cloudinary.com/dtxdv136u/image/upload/v1772817013/atencion2_ygnn0i.jpg",
  instalacion: "https://res.cloudinary.com/dtxdv136u/image/upload/v1772815812/instalacion_n57src.jpg",
  monitoreo: "https://res.cloudinary.com/dtxdv136u/image/upload/v1772815812/monitoreo_iqv0mn.jpg",
  equipo:    "https://res.cloudinary.com/dtxdv136u/image/upload/v1772815812/equipo_z4zk7b.jpg",
  camara:    "https://res.cloudinary.com/dtxdv136u/image/upload/v1772815810/camara_qkq4st.jpg",
};

// Dimensiones mostradas según Lighthouse (display size)
// Las cards son 380x570 — equipo es landscape 750x500
const CARD_DIMS      = { w: 380, h: 570 };
const EQUIPO_DIMS    = { w: 750, h: 500 };

const services = [
  {
    id: 1,
    icon: faShieldHalved,
    title: "Seguridad real, no solo una sirena",
    description:
      "Cuando se activa tu alarma, la señal llega en segundos a nuestra central. Personas reales monitorean y activan protocolo inmediato.",
    image: clUrl(IMAGES.monitoreo, CARD_DIMS),
    dims: CARD_DIMS,
  },
  {
    id: 2,
    icon: faVideo,
    title: "Cámaras + monitoreo en un solo sistema",
    description:
      "Ves tu propiedad en tiempo real desde el celular y, si algo ocurre, no dependés solo de una notificación: hay respuesta operativa.",
    image: clUrl(IMAGES.camara, CARD_DIMS),
    dims: CARD_DIMS,
  },
  {
    id: 3,
    icon: faTruck,
    title: "Móviles propios en tu zona",
    description:
      "No tercerizamos la reacción. Tenemos móviles recorriendo distintos puntos estratégicos de Tucumán.",
    image: clUrl(IMAGES.movil, CARD_DIMS),
    dims: CARD_DIMS,
  },
  {
    id: 4,
    icon: faHandshake,
    title: "Sin comprar equipos",
    description:
      "Instalamos todo en comodato. Pagás únicamente el servicio mensual de monitoreo.",
    image: clUrl(IMAGES.equipo, EQUIPO_DIMS),
    dims: EQUIPO_DIMS,
  },
  {
    id: 5,
    icon: faHeadset,
    title: "Atención 24/7",
    description:
      "Central de monitoreo operando las 24 horas con personal capacitado y protocolos actualizados constantemente.",
    image: clUrl(IMAGES.atencion, CARD_DIMS),
    dims: CARD_DIMS,
  },
  {
    id: 6,
    icon: faBolt,
    title: "Respuesta en menos de 5 minutos",
    description:
      "Desde que se activa la alarma hasta que llega el móvil a tu domicilio.",
    image: clUrl(IMAGES.atencionDos, CARD_DIMS),
    dims: CARD_DIMS,
  },
  {
    id: 7,
    icon: faLock,
    title: "Tecnología con respaldo humano",
    description:
      "Sensores de última generación combinados con análisis humano para evitar falsas alarmas.",
    image: clUrl(IMAGES.guardia, CARD_DIMS),
    dims: CARD_DIMS,
  },
  {
    id: 8,
    icon: faClock,
    title: "Instalación en 24 horas",
    description:
      "Desde que contratás el servicio hasta que tu hogar está protegido. Sin demoras ni complicaciones.",
    image: clUrl(IMAGES.instalacion, CARD_DIMS),
    dims: CARD_DIMS,
  },
];

// Duplicar para efecto marquee infinito
const duplicatedServices = [...services, ...services];

const SecurityMarqueeHome = () => {
  return (
    <section className="security-marquee-container">
      <div className="marquee-header" id="beneficios">
        <div className="marquee-badge">
          <span>BENEFICIOS</span>
        </div>

        <h2 className="marquee-title">
          Protegé lo que <span className="marquee-gradient">más te importa</span>
        </h2>

        <p className="marquee-subtitle">
          Protección integral para tu tranquilidad con monitoreo 24/7 desde
          nuestras centrales de control, contamos con cobertura en San Miguel de
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
                  // Las primeras 3 cartas cargan eager para que no afecten LCP/FCP
                  // El resto lazy para no desperdiciar ancho de banda
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

export default SecurityMarqueeHome;