// SecurityMarquee.jsx
import React from "react";
import "./SecurityMarquee.css";
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

const SecurityMarquee = () => {
  const movil =
    "https://res.cloudinary.com/dtxdv136u/image/upload/v1772815812/movil_v16g6k.jpg";
  const guardia =
    "https://res.cloudinary.com/dtxdv136u/image/upload/v1772817081/guardia_qzg86d.jpg";
  const atencion =
    "https://res.cloudinary.com/dtxdv136u/image/upload/v1772815811/atencion_ltbz78.jpg";
  const atencionDos =
    "https://res.cloudinary.com/dtxdv136u/image/upload/v1772817013/atencion2_ygnn0i.jpg";
  const instalacion =
    "https://res.cloudinary.com/dtxdv136u/image/upload/v1772815812/instalacion_n57src.jpg";
  const monitoreo =
    "https://res.cloudinary.com/dtxdv136u/image/upload/v1772815812/monitoreo_iqv0mn.jpg";
  const equipo =
    "https://res.cloudinary.com/dtxdv136u/image/upload/v1772815812/equipo_z4zk7b.jpg";
  const camara =
    "https://res.cloudinary.com/dtxdv136u/image/upload/v1772815810/camara_qkq4st.jpg";

  const services = [
    {
      id: 1,
      icon: faShieldHalved,
      title: "Seguridad real, no solo una sirena",
      description:
        "Cuando se activa tu alarma, la señal llega en segundos a nuestra central. Personas reales monitorean y activan protocolo inmediato.",
      image: monitoreo,
    },
    {
      id: 2,
      icon: faVideo,
      title: "Cámaras + monitoreo en un solo sistema",
      description:
        "Ves tu propiedad en tiempo real desde el celular y, si algo ocurre, no dependés solo de una notificación: hay respuesta operativa.",
      image: camara,
    },
    {
      id: 3,
      icon: faTruck,
      title: "Móviles propios en tu zona",
      description:
        "No tercerizamos la reacción. Tenemos móviles recorriendo distintos puntos estratégicos de Tucumán.",
      image: movil,
    },
    {
      id: 4,
      icon: faHandshake,
      title: "Sin comprar equipos",
      description:
        "Instalamos todo en comodato. Pagás únicamente el servicio mensual de monitoreo.",
      image: equipo,
    },
    {
      id: 5,
      icon: faHeadset,
      title: "Atención 24/7 en español",
      description:
        "Central de monitoreo operando las 24 horas con personal capacitado y protocolos actualizados constantemente.",
      image: atencion,
    },
    {
      id: 6,
      icon: faBolt,
      title: "Respuesta en menos de 5 minutos",
      description:
        "Tiempo de reacción garantizado. Desde que se activa la alarma hasta que llega el móvil a tu domicilio.",
      image: atencionDos,
    },
    {
      id: 7,
      icon: faLock,
      title: "Tecnología con respaldo humano",
      description:
        "Sensores de última generación combinados con análisis humano para evitar falsas alarmas.",
      image: guardia,
    },
    {
      id: 8,
      icon: faClock,
      title: "Instalación en 48 horas",
      description:
        "Desde que contratás el servicio hasta que tu hogar está protegido. Sin demoras ni complicaciones.",
      image: instalacion,
    },
  ];

  // Duplicar el array para crear el efecto infinito
  const duplicatedServices = [...services, ...services];

  return (
    <section className="security-marquee-container">
      <div className="marquee-header" id="beneficios">
        {/* Badge similar a otras secciones */}
        <div className="marquee-badge">
          <span>BENEFICIOS</span>
        </div>

        <h2 className="marquee-title">
          Kit <span className="marquee-gradient">Alarma+Cámaras</span>
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
                />
                <div className="card-overlay"></div>
              </div>

              <div className="card-content">
                <div className="card-icon">
                  <FontAwesomeIcon icon={service.icon} />
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

export default SecurityMarquee;
