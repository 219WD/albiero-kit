// RespaldoAlbiero.jsx
import React, { useState } from 'react';
import './RespaldoAlbiero.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faClock,
  faTruck,
  faMapLocationDot,
} from '@fortawesome/free-solid-svg-icons';
// Importar el custom hook
import useToast from '../hooks/useToast';
// Importar Toaster
import { Toaster } from 'react-hot-toast';

const RespaldoAlbiero = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { showToast } = useToast(); // Usar el custom hook
  const central = "https://res.cloudinary.com/dtxdv136u/image/upload/v1772815811/albiero_inwcia.jpg";

  const albieroFeatures = [
    {
      id: 1,
      icon: faClock,
      title: 'Central 24/7',
      description: 'Central de monitoreo activa las 24 horas, los 365 días del año.',
    },
    {
      id: 2,
      icon: faTruck,
      title: 'Móviles Propios',
      description: 'Móviles propios recorriendo la ciudad para respuesta inmediata.',
    },
    {
      id: 3,
      icon: faMapLocationDot,
      title: 'Cobertura Total',
      description: 'Yerba Buena, San Miguel, Tafí Viejo, Tafí del Valle y El Mollar.',
    },
  ];

  const scrollToHero = () => {
    const heroSection = document.querySelector('.hero-security');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleButtonClick = () => {
    showToast(); // Mostrar el toast
    scrollToHero(); // Hacer scroll al hero
  };

  return (
    <section className="albiero-respaldo-section">
      {/* Toaster component */}
      <Toaster />
      
      <div className="albiero-respaldo-container" id='acerca-de'>
        {/* Badge */}
        <div className="albiero-badge">
          <span>RESPALDO ALBIERO</span>
        </div>

        <div className="albiero-content">
          {/* Left Content */}
          <div className="albiero-left">
            <h2 className="albiero-title">
              Más de <span className="albiero-gradient-highlight">40 años</span> protegiendo Tucumán.
            </h2>

            <p className="albiero-subtitle">
              Central de monitoreo activa 24/7.
              <br />
              Móviles propios recorriendo la ciudad.
              <br />
              Cobertura en Yerba Buena, San Miguel, Tafí y alrededores.
            </p>

            <p className="albiero-quote">
              <span className="albiero-quote-line">La diferencia no es que suene.</span>
              <br />
              <span className="albiero-quote-highlight">La diferencia es que alguien responda.</span>
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
                    <p className="albiero-feature-description">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button - MODIFICADO con toast */}
            <button className="albiero-cta" onClick={handleButtonClick}>
              <span>Configurá tu Sistema</span>
              <FontAwesomeIcon icon={faArrowRight} className="albiero-cta-arrow" />
            </button>
          </div>

          {/* Right Content - Image Section */}
          <div className="albiero-right">
            <div className="albiero-image-container">
              <img
                src={central}
                alt="Central de monitoreo Albiero Seguridad"
                className={`albiero-featured-image ${imageLoaded ? 'loaded' : ''}`}
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

            {/* Side indicator */}
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

export default RespaldoAlbiero;