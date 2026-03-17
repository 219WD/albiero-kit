import React, { useState } from 'react';
import './HowItWorksSeguridadIntegral.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClipboardList,
  faPenRuler,
  faScrewdriverWrench,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import useToast from '../../hooks/useToast';
import { Toaster } from 'react-hot-toast';

const HowItWorksSeguridadIntegral = () => {
  const [activeStep, setActiveStep] = useState(null);
  const { showToast } = useToast();

  const steps = [
    {
      id: 1,
      number: '01',
      icon: faClipboardList,
      title: 'Relevamiento',
      description: 'Realizamos un relevamiento del lugar y analizamos los riesgos específicos de tu propiedad o empresa.',
      highlight: 'Diagnóstico sin costo',
    },
    {
      id: 2,
      number: '02',
      icon: faPenRuler,
      title: 'Diseño',
      description: 'Diseñamos una solución combinada de seguridad física y electrónica según tus necesidades reales.',
      highlight: 'Solución a medida',
    },
    {
      id: 3,
      number: '03',
      icon: faScrewdriverWrench,
      title: 'Instalación',
      description: 'Instalamos los sistemas electrónicos y coordinamos la seguridad física si corresponde al proyecto.',
      highlight: 'Técnicos especializados',
    },
    {
      id: 4,
      number: '04',
      icon: faEye,
      title: 'Supervisión',
      description: 'Supervisamos el funcionamiento de forma continua para garantizar protección permanente.',
      highlight: 'Control permanente',
    },
  ];

  const scrollToHero = () => {
    const heroSection = document.querySelector('.hero-security');
    if (heroSection) heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
            <p className="section-subtitle">Simple. Profesional. A medida.</p>
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
            <h3 className="cta-title">¿Listo para proteger tu empresa o propiedad?</h3>
            <p className="cta-subtitle">Diagnóstico sin costo • Soluciones a medida • Más de 40 años en Tucumán</p>
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

export default HowItWorksSeguridadIntegral;