// FinalCTACamaras.jsx
import React from 'react';
import './FinalCTACamaras.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVideo,
  faCheckCircle,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import useToast from '../../hooks/useToast';
import { Toaster } from 'react-hot-toast';

const FinalCTACamaras = () => {
  const { showToast } = useToast();

  const scrollToHero = () => {
    const heroSection = document.querySelector('.hero-security');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleButtonClick = () => {
    showToast();
    scrollToHero();
  };

  return (
    <section className="final-cta-section">
      <Toaster />

      <div className="final-cta-container" id="protege-tu-hogar">

        <div className="final-cta-badge">
          <FontAwesomeIcon icon={faVideo} className="final-cta-badge-icon" />
          <span>VIDEOVIGILANCIA PROFESIONAL</span>
        </div>

        <div className="final-cta-content">
          <h2 className="final-cta-title">
            Tené control visual de tu propiedad{' '}
            <span className="final-cta-gradient">en todo momento.</span>
          </h2>

          <p className="final-cta-description">
            Configurá tu sistema en segundos y recibí asesoramiento personalizado hoy mismo.
          </p>

          <button className="final-cta-button" onClick={handleButtonClick}>
            <span>QUIERO INSTALAR CÁMARAS</span>
            <FontAwesomeIcon icon={faArrowRight} className="final-cta-button-icon" />
          </button>

          <div className="final-cta-benefits">
            <div className="final-cta-benefit-item">
              <FontAwesomeIcon icon={faWhatsapp} className="benefit-icon" />
              <span>Respuesta rápida por WhatsApp</span>
            </div>
            <div className="final-cta-benefit-item">
              <FontAwesomeIcon icon={faCheckCircle} className="benefit-icon" />
              <span>Sin compromiso</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FinalCTACamaras;