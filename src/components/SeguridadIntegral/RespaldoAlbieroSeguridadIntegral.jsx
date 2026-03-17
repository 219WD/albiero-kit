// RespaldoAlbieroSeguridadIntegral.jsx
import React, { useState } from "react";
import "./RespaldoAlbieroSeguridadIntegral.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faUserShield,
  faMicrochip,
  faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import useToast from "../../hooks/useToast";
import { Toaster } from "react-hot-toast";

const RespaldoAlbieroSeguridadIntegral = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { showToast } = useToast();

  const central =
    "https://res.cloudinary.com/dtxdv136u/image/upload/w_665,h_998,c_fill,f_auto,q_auto/v1772815811/albiero_inwcia.jpg";

  const albieroFeatures = [
    {
      id: 1,
      icon: faUserShield,
      title: "Personal capacitado",
      description:
        "Equipo profesional con formación en seguridad física y electrónica, listo para actuar ante cualquier situación.",
    },
    {
      id: 2,
      icon: faMicrochip,
      title: "Tecnología confiable",
      description:
        "Sistemas y equipos de última generación seleccionados para garantizar un funcionamiento seguro y continuo.",
    },
    {
      id: 3,
      icon: faMapLocationDot,
      title: "Cobertura provincial",
      description:
        "San Miguel de Tucumán, Yerba Buena, Tafí Viejo, Tafí del Valle, El Mollar y zonas cercanas.",
    },
  ];

  const scrollToHero = () => {
    const heroSection = document.querySelector(".hero-security");
    if (heroSection) heroSection.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleButtonClick = () => {
    showToast();
    scrollToHero();
  };

  return (
    <section className="albiero-respaldo-section">
      <Toaster />

      <div className="albiero-respaldo-container" id="acerca-de">
        <div className="albiero-badge">
          <span>RESPALDO ALBIERO</span>
        </div>

        <div className="albiero-content">
          {/* Left */}
          <div className="albiero-left">
            <h2 className="albiero-title">
              Más de <span className="albiero-gradient-highlight">40 años</span>{" "}
              brindando soluciones de seguridad en Tucumán.
            </h2>

            <p className="albiero-subtitle">
              Personal capacitado.
              <br />
              Tecnología confiable.
              <br />
              Experiencia en empresas, predios y propiedades de gran tamaño.
              <br />
              Cobertura en San Miguel, Yerba Buena, Tafí y alrededores.
            </p>

            <p className="albiero-quote">
              <span className="albiero-quote-line">
                La diferencia no es solo vigilar.
              </span>
              <br />
              <span className="albiero-quote-highlight">
                La diferencia es prevenir, controlar y responder.
              </span>
            </p>

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

            <button className="albiero-cta" onClick={handleButtonClick}>
              <span>Configurá tu Sistema</span>
              <FontAwesomeIcon icon={faArrowRight} className="albiero-cta-arrow" />
            </button>
          </div>

          {/* Right */}
          <div className="albiero-right">
            <div className="albiero-image-container">
              <img
                src={central}
                alt="Albiero Seguridad - Soluciones integrales para empresas y predios"
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
                    <span className="albiero-stat-label">Monitoreo</span>
                  </div>
                  <div className="albiero-stat-item">
                    <span className="albiero-stat-number">5</span>
                    <span className="albiero-stat-label">Zonas</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="albiero-side-indicator">
              <span className="albiero-indicator-number">40+</span>
              <span className="albiero-indicator-text">años de experiencia</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RespaldoAlbieroSeguridadIntegral;