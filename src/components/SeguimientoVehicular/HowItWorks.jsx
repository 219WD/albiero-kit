import React, { useState } from 'react';
import './HowItWorks.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWrench,
  faSatellite,
  faMobileAlt,
  faMapLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import useToast from '../../hooks/useToast';
import { Toaster } from 'react-hot-toast';

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(null);
  const { showToast } = useToast();

  const steps = [
    {
      id: 1,
      number: '01',
      icon: faWrench,
      title: 'Instalación',
      description: 'Instalamos el equipo GPS en tu vehículo sin compra de equipos. Todo queda listo en menos de una hora.',
      highlight: 'Sin inversión inicial'
    },
    {
      id: 2,
      number: '02',
      icon: faSatellite,
      title: 'Transmisión',
      description: 'El dispositivo transmite información en tiempo real desde el momento en que el vehículo se pone en marcha.',
      highlight: 'Datos en tiempo real'
    },
    {
      id: 3,
      number: '03',
      icon: faMobileAlt,
      title: 'Acceso',
      description: 'Accedés desde tu celular o computadora a la plataforma de monitoreo, en cualquier momento y desde cualquier lugar.',
      highlight: 'Desde cualquier dispositivo'
    },
    {
      id: 4,
      number: '04',
      icon: faMapLocationDot,
      title: 'Control total',
      description: 'Visualizás ubicación, recorridos, alertas y reportes completos. Todo en una sola aplicación simple de usar.',
      highlight: 'Todo en una app'
    }
  ];

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
    <section className="how-it-works">
      <Toaster />
      
      <div className="how-it-works-wrapper" id='como-funciona'>
        {/* Header */}
        <div className="how-it-works-header">
          <div className="header-content">
            <h2 className="section-title">
              Cómo <span className="gradient-text">Funciona</span>
            </h2>
            <p className="section-subtitle">
              Cuatro pasos simples para tener el control total de tu vehículo
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

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-content">
            <h3 className="cta-title">¿Listo para tener el control de tu vehículo?</h3>
            <p className="cta-subtitle">Instalación sin cargo, sin compromiso</p>
            <button className="cta-button" onClick={handleButtonClick}>
              <span>Quiero información ahora</span>
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