import React, { useState } from 'react';
import './HowItWorksCamaras.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faScrewdriverWrench,
  faMobileScreen,
  faVideo,
  faHardDrive,
} from '@fortawesome/free-solid-svg-icons';
import useToast from '../../hooks/useToast';
import { Toaster } from 'react-hot-toast';

const HowItWorksCamaras = () => {
  const [activeStep, setActiveStep] = useState(null);
  const { showToast } = useToast();

  const steps = [
    {
      id: 1,
      number: '01',
      icon: faScrewdriverWrench,
      title: 'Instalación',
      description: 'Instalamos el sistema de cámaras en tu propiedad con equipos confiables y configuración profesional.',
      highlight: 'Técnicos especializados',
    },
    {
      id: 2,
      number: '02',
      icon: faMobileScreen,
      title: 'Configuración',
      description: 'Configuramos grabación y acceso remoto para que puedas ver tu propiedad desde el celular o computadora.',
      highlight: 'Acceso desde cualquier lugar',
    },
    {
      id: 3,
      number: '03',
      icon: faVideo,
      title: 'Visualización',
      description: 'Podés ver las cámaras en tiempo real desde cualquier lugar, en cualquier momento.',
      highlight: 'En tiempo real',
    },
    {
      id: 4,
      number: '04',
      icon: faHardDrive,
      title: 'Registro',
      description: 'El sistema registra y almacena los eventos para que puedas consultarlos cuando lo necesites.',
      highlight: 'Historial completo',
    },
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

      <div className="how-it-works-wrapper" id="como-funciona">
        <div className="how-it-works-header">
          <div className="header-content">
            <h2 className="section-title">
              Cómo <span className="gradient-text">Funciona</span>
            </h2>
            <p className="section-subtitle">Simple. Claro. Sin vueltas.</p>
          </div>
        </div>

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
                {index < steps.length - 1 && (
                  <div className="step-connector">
                    <svg viewBox="0 0 100 40" preserveAspectRatio="none">
                      <path d="M 0 20 Q 50 0, 100 20" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                )}

                <div className="step-card">
                  <div className="step-number-circle">
                    <span className="step-number">{step.number}</span>
                  </div>
                  <div className="step-icon-wrapper">
                    <FontAwesomeIcon icon={step.icon} className="step-icon" />
                  </div>
                  <div className="step-content">
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-description">{step.description}</p>
                    <span className="step-badge">{step.highlight}</span>
                  </div>
                  <div className="step-bg-effect"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cta-section">
          <div className="cta-content">
            <h3 className="cta-title">¿Listo para tener el control visual de tu propiedad?</h3>
            <p className="cta-subtitle">Instalación profesional • Equipos confiables • Sin compromiso</p>
            <button className="cta-button" onClick={handleButtonClick}>
              <span>Solicitar asesoramiento</span>
              <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksCamaras;