// RespaldoAlbiero.jsx
import React, { useState } from "react";
import "./RespaldoAlbiero.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faServer,
  faWrench,
  faMobileScreen,
} from "@fortawesome/free-solid-svg-icons";
import useToast from "../../hooks/useToast";
import { Toaster } from "react-hot-toast";

const RespaldoAlbiero = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { showToast } = useToast();
  const central =
    "https://res.cloudinary.com/dtxdv136u/image/upload/w_665,h_998,c_fill,f_auto,q_auto/v1772815811/albiero_inwcia.jpg";

  const albieroFeatures = [
    {
      id: 1,
      icon: faServer,
      title: "Infraestructura confiable",
      description:
        "Tecnología GPS estable y probada, con disponibilidad 24/7 y respaldo ante cualquier falla.",
    },
    {
      id: 2,
      icon: faWrench,
      title: "Instalación especializada",
      description:
        "Técnicos propios realizan la instalación y configuración de cada equipo sin complicaciones.",
    },
    {
      id: 3,
      icon: faMobileScreen,
      title: "Plataforma fácil de usar",
      description:
        "Accedé a toda la información desde tu celular. Simple, clara y disponible cuando la necesitás.",
    },
  ];

  const scrollToHero = () => {
    const heroSection = document.querySelector(".hero-security");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleButtonClick = () => {
    showToast();
    scrollToHero();
  };

  return (
    <section className="albiero-respaldo-section">
      <Toaster />

      <div className="albiero-respaldo-container" id="acerca-de">
        {/* Badge */}
        <div className="albiero-badge">
          <span>DIFERENCIAL ALBIERO</span>
        </div>

        <div className="albiero-content">
          {/* Left Content */}
          <div className="albiero-left">
            <h2 className="albiero-title">
              Más de <span className="albiero-gradient-highlight">40 años</span>{" "}
              brindando soluciones tecnológicas.
            </h2>

            <p className="albiero-subtitle">
              Infraestructura tecnológica confiable.
              <br />
              Equipos instalados por técnicos especializados.
              <br />
              Plataforma estable y fácil de usar.
            </p>

            <p className="albiero-quote">
              <span className="albiero-quote-line">
                No es solo un dispositivo GPS.
              </span>
              <br />
              <span className="albiero-quote-highlight">
                Es la información que necesitás, cuando la necesitás.
              </span>
            </p>

            {/* Features Grid */}
            <div className="albiero-features-grid">
              {albieroFeatures.map((feature) => (
                <div key={feature.id} className="albiero-feature-card">
                  <div className="albiero-feature-icon">
                    <FontAwesomeIcon icon={feature.icon} />
                  </div>
                  <div className="albiero-feature-content">
                    <h3 className="albiero-feature-title">{feature.title}</h3>
                    <p className="albiero-feature-description">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button className="albiero-cta" onClick={handleButtonClick}>
              <span>Configurá tu Servicio</span>
              <FontAwesomeIcon
                icon={faArrowRight}
                className="albiero-cta-arrow"
              />
            </button>
          </div>

          {/* Right Content - Image Section */}
          <div className="albiero-right">
            <div className="albiero-image-container">
              <img
                src={central}
                alt="Albiero Seguridad - Monitoreo GPS Tucumán"
                width="665"
                height="998"
                className={`albiero-featured-image ${imageLoaded ? "loaded" : ""}`}
                onLoad={() => setImageLoaded(true)}
              />
              <div className="albiero-image-overlay">
                <div className="albiero-stats-box">
                  <div className="albiero-stat-item">
                    <span className="albiero-stat-number">40+</span>
                    <span className="albiero-stat-label">Años</span>
                  </div>
                  <div className="albiero-stat-item">
                    <span className="albiero-stat-number">24/7</span>
                    <span className="albiero-stat-label">Soporte</span>
                  </div>
                  <div className="albiero-stat-item">
                    <span className="albiero-stat-number">5</span>
                    <span className="albiero-stat-label">Zonas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Side indicator */}
            <div className="albiero-side-indicator">
              <span className="albiero-indicator-number">40+</span>
              <span className="albiero-indicator-text">
                años de experiencia
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RespaldoAlbiero;