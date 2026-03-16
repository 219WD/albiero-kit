import React, { useState } from "react";
import "./RespaldoAlbieroIncendio.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faScrewdriverWrench,
  faMicrochip,
  faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import useToast from "../../hooks/useToast";
import { Toaster } from "react-hot-toast";

const RespaldoAlbieroIncendio = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { showToast } = useToast();

  const central =
    "https://res.cloudinary.com/dtxdv136u/image/upload/w_665,h_998,c_fill,f_auto,q_auto/v1772815811/albiero_inwcia.jpg";

  const albieroFeatures = [
    {
      id: 1,
      icon: faScrewdriverWrench,
      title: "Instalación profesional",
      description:
        "Instalaciones realizadas por técnicos especializados con años de experiencia en sistemas de detección y prevención de incendios.",
    },
    {
      id: 2,
      icon: faMicrochip,
      title: "Equipos certificados",
      description:
        "Sensores y dispositivos confiables con configuraciones profesionales para que el sistema funcione correctamente desde el primer día.",
    },
    {
      id: 3,
      icon: faMapLocationDot,
      title: "Cobertura provincial",
      description:
        "San Miguel de Tucumán, Yerba Buena, Tafí Viejo, Tafí del Valle y El Mollar.",
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
              Instalaciones realizadas por técnicos especializados.
              <br />
              Equipos confiables y configuraciones profesionales.
              <br />
              Cobertura en San Miguel, Yerba Buena, Tafí y alrededores.
            </p>
            <p className="albiero-quote">
              <span className="albiero-quote-line">
                La diferencia no es solo detectar.
              </span>
              <br />
              <span className="albiero-quote-highlight">
                La diferencia es prevenir a tiempo.
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
                alt="Albiero Seguridad - Instalación profesional de sistemas contra incendios"
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

export default RespaldoAlbieroIncendio;