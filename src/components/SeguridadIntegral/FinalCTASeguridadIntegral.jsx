// FinalCTASeguridadIntegral.jsx
import React from 'react';
import './FinalCTASeguridadIntegral.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved,
  faCheckCircle,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import useToast from '../../hooks/useToast';
import { Toaster } from 'react-hot-toast';

const FinalCTASeguridadIntegral = () => {
  const { showToast } = useToast();

  const scrollToHero = () => {
    const heroSection = document.querySelector('.hero-security');
    if (heroSection) heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
          <FontAwesomeIcon icon={faShieldHalved} className="final-cta-badge-icon" />
          <span>SEGURIDAD INTEGRAL PROFESIONAL</span>
        </div>

        <div className="final-cta-content">
          <h2 className="final-cta-title">
            Elevá el nivel de seguridad de{' '}
            <span className="final-cta-gradient">tu empresa o propiedad.</span>
          </h2>

          <p className="final-cta-description">
            Solicitá ahora un diagnóstico profesional y recibí una propuesta personalizada.
          </p>

          <button className="final-cta-button" onClick={handleButtonClick}>
            <span>QUIERO UNA SOLUCIÓN INTEGRAL</span>
            <FontAwesomeIcon icon={faArrowRight} className="final-cta-button-icon" />
          </button>

          <div className="final-cta-benefits">
            <div className="final-cta-benefit-item">
              <FontAwesomeIcon icon={faWhatsapp} className="benefit-icon" />
              <span>Asesoramiento rápido</span>
            </div>
            <div className="final-cta-benefit-item">
              <FontAwesomeIcon icon={faCheckCircle} className="benefit-icon" />
              <span>Visita técnica sin compromiso</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASeguridadIntegral;