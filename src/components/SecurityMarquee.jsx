// SecurityMarquee.jsx
import React from 'react';
import './SecurityMarquee.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved,
  faVideo,
  faTruck,
  faHandshake,
  faHeadset,
  faBolt,
  faLock,
  faClock
} from '@fortawesome/free-solid-svg-icons';

const SecurityMarquee = () => {
  
  const services = [
    {
      id: 1,
      icon: faShieldHalved,
      title: "Seguridad real, no solo una sirena",
      description: "Cuando se activa tu alarma, la señal llega en segundos a nuestra central. Personas reales monitorean y activan protocolo inmediato.",
      image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&h=400&fit=crop"
    },
    {
      id: 2,
      icon: faVideo,
      title: "Cámaras + monitoreo en un solo sistema",
      description: "Ves tu propiedad en tiempo real desde el celular y, si algo ocurre, no dependés solo de una notificación: hay respuesta operativa.",
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=400&fit=crop"
    },
    {
      id: 3,
      icon: faTruck,
      title: "Móviles propios en tu zona",
      description: "No tercerizamos la reacción. Tenemos móviles recorriendo distintos puntos estratégicos de Tucumán.",
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop"
    },
    {
      id: 4,
      icon: faHandshake,
      title: "Sin comprar equipos",
      description: "Instalamos todo en comodato. Pagás únicamente el servicio mensual de monitoreo.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"
    },
    {
      id: 5,
      icon: faHeadset,
      title: "Atención 24/7 en español",
      description: "Central de monitoreo operando las 24 horas con personal capacitado y protocolos actualizados constantemente.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop"
    },
    {
      id: 6,
      icon: faBolt,
      title: "Respuesta en menos de 5 minutos",
      description: "Tiempo de reacción garantizado. Desde que se activa la alarma hasta que llega el móvil a tu domicilio.",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop"
    },
    {
      id: 7,
      icon: faLock,
      title: "Tecnología con respaldo humano",
      description: "Sensores de última generación combinados con análisis humano para evitar falsas alarmas.",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop"
    },
    {
      id: 8,
      icon: faClock,
      title: "Instalación en 48 horas",
      description: "Desde que contratás el servicio hasta que tu hogar está protegido. Sin demoras ni complicaciones.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
    }
  ];

  // Duplicar el array para crear el efecto infinito
  const duplicatedServices = [...services, ...services];

  return (
    <section className="security-marquee-container">
      <div className="marquee-header" id='beneficios'>
        {/* Badge similar a otras secciones */}
        <div className="marquee-badge">
          <span>BENEFICIOS</span>
        </div>
        
        <h2 className="marquee-title">
          Kit <span className="marquee-gradient">Alarma+Cámaras</span>
        </h2>
        
        <p className="marquee-subtitle">
          Protección integral para tu tranquilidad con monitoreo 24/7 desde nuestras centrales de control, contamos con cobertura en San Miguel de Tucumán, Yerba Buena, Tafí Viejo, Tafí del Valle y El Mollar.
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