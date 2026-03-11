// FinalCTA.jsx
import React from 'react';
import './FinalCTA.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldHeart,
  faCheckCircle,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
// Importar el custom hook
import useToast from '../../hooks/useToast';
// Importar Toaster
import { Toaster } from 'react-hot-toast';

const FinalCTA = () => {
  const { showToast } = useToast(); // Usar el custom hook

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
    <section className="final-cta-section">
      {/* Toaster component */}
      <Toaster />
      
      <div className="final-cta-container" id='protege-tu-hogar'>
        
        {/* Badge */}
        <div className="final-cta-badge">
          <FontAwesomeIcon icon={faShieldHeart} className="final-cta-badge-icon" />
          <span>PROTEGÉ TU HOGAR</span>
        </div>

        {/* Contenido principal */}
        <div className="final-cta-content">
          <h2 className="final-cta-title">
            No esperes a que pase algo <span className="final-cta-gradient">para reaccionar.</span>
          </h2>
          
          <p className="final-cta-description">
            Configurá tu sistema en segundos y recibí asesoramiento personalizado hoy mismo.
          </p>

          {/* Botón principal - MODIFICADO con toast */}
          <button className="final-cta-button" onClick={handleButtonClick}>
            <span>QUIERO PROTEGER MI PROPIEDAD</span>
            <FontAwesomeIcon icon={faArrowRight} className="final-cta-button-icon" />
          </button>

          {/* Beneficios */}
          <div className="final-cta-benefits">
            <div className="final-cta-benefit-item">
              <FontAwesomeIcon icon={faWhatsapp} className="benefit-icon" />
              <span>Escribinos por WhatsApp</span>
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