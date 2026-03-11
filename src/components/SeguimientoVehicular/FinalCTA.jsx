// FinalCTA.jsx
import React from 'react';
import './FinalCTA.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLocationDot,
  faCheckCircle,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import useToast from '../../hooks/useToast';
import { Toaster } from 'react-hot-toast';

const FinalCTA = () => {
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
      
      <div className="final-cta-container" id='protege-tu-hogar'>
        
        {/* Badge */}
        <div className="final-cta-badge">
          <FontAwesomeIcon icon={faLocationDot} className="final-cta-badge-icon" />
          <span>MONITOREO GPS VEHICULAR</span>
        </div>

        {/* Contenido principal */}
        <div className="final-cta-content">
          <h2 className="final-cta-title">
            Tomá control total de tu vehículo <span className="final-cta-gradient">o flota.</span>
          </h2>
          
          <p className="final-cta-description">
            Configurá tu servicio en segundos y recibí asesoramiento personalizado.
          </p>

          {/* Botón principal */}
          <button className="final-cta-button" onClick={handleButtonClick}>
            <span>QUIERO MONITOREAR MI VEHÍCULO</span>
            <FontAwesomeIcon icon={faArrowRight} className="final-cta-button-icon" />
          </button>

          {/* Beneficios */}
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

export default FinalCTA;