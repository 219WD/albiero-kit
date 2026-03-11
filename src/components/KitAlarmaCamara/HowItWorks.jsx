import React, { useState } from 'react';
import './HowItWorks.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faToolbox,
  faSatelliteDish,
  faMobileAlt,
  faBolt,
} from '@fortawesome/free-solid-svg-icons';
// Importar el custom hook
import useToast from '../../hooks/useToast';
// Importar Toaster
import { Toaster } from 'react-hot-toast';

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(null);
  const { showToast } = useToast(); // Usar el custom hook

  const steps = [
    {
      id: 1,
      number: '01',
      icon: faToolbox,
      title: 'Instalación',
      description: 'Instalamos el sistema en tu propiedad sin compra de equipos',
      highlight: 'Sin inversión inicial'
    },
    {
      id: 2,
      number: '02',
      icon: faSatelliteDish,
      title: 'Conexión',
      description: 'Conectamos alarma y cámaras a nuestra central 24/7',
      highlight: 'Conexión profesional'
    },
    {
      id: 3,
      number: '03',
      icon: faMobileAlt,
      title: 'Control',
      description: 'Recibís alertas en tiempo real en tu celular y panel web',
      highlight: 'Monitoreo en Tiempo Real'
    },
    {
      id: 4,
      number: '04',
      icon: faBolt,
      title: 'Respuesta',
      description: 'Activamos protocolo y enviamos móvil propio al instante',
      highlight: 'Acción inmediata'
    }
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
    <section className="how-it-works">
      {/* Toaster component */}
      <Toaster />
      
      <div className="how-it-works-wrapper" id='como-funciona'>
        {/* Header */}
        <div className="how-it-works-header">
          <div className="header-content">
            <h2 className="section-title">
              Cómo <span className="gradient-text">Funciona</span>
            </h2>
            <p className="section-subtitle">
              Cuatro pasos simples hacia la seguridad total de tu propiedad
            </p>
          </div>
        </div>

        {/* Steps Timeline */}
        <div className="steps-container">
          <div className="timeline-line"></div>
          
          <div className="steps-grid">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`step-item ${activeStep === step.id ? 'active' : ''}`}
                onMouseEnter={() => setActiveStep(step.id)}
                onMouseLeave={() => setActiveStep(null)}
              >
                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="step-connector">
                    <svg viewBox="0 0 100 40" preserveAspectRatio="none">
                      <path d="M 0 20 Q 50 0, 100 20" fill="none" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                )}

                {/* Step Card */}
                <div className="step-card">
                  {/* Number Circle */}
                  <div className="step-number-circle">
                    <span className="step-number">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className="step-icon-wrapper">
                    <FontAwesomeIcon icon={step.icon} className="step-icon" />
                  </div>

                  {/* Content */}
                  <div className="step-content">
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-description">{step.description}</p>
                    <span className="step-badge">{step.highlight}</span>
                  </div>

                  {/* Hover effect background */}
                  <div className="step-bg-effect"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section - MODIFICADO con toast */}
        <div className="cta-section">
          <div className="cta-content">
            <h3 className="cta-title">¿Listo para proteger tu hogar?</h3>
            <p className="cta-subtitle">Comienza tu instalación hoy, sin compromiso</p>
            <button className="cta-button" onClick={handleButtonClick}>
              <span>Solicitar Cotización</span>
              <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;