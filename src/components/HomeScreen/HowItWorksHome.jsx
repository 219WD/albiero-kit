import React, { useState } from 'react';
import './HowItWorksHome.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComments,
  faDraftingCompass,
  faScrewdriverWrench,
  faTowerBroadcast,
  faCar,
  faMobileScreen,
} from '@fortawesome/free-solid-svg-icons';
// Eliminamos la importación de useToast ya que no la necesitamos
// import useToast from '../../hooks/useToast';
// import { Toaster } from 'react-hot-toast';

const HowItWorksHome = () => {
  const [activeStep, setActiveStep] = useState(null);
  // Eliminamos la línea: const { showToast } = useToast();

  const steps = [
    {
      id: 1,
      number: '01',
      icon: faComments,
      title: 'Asesoramiento inicial',
      description:
        'Analizamos qué necesitás proteger: tu casa, comercio, vehículos o empresa. Te ayudamos a elegir el sistema adecuado según el tipo de propiedad y el nivel de protección que buscás.',
      highlight: 'Sin costo',
    },
    {
      id: 2,
      number: '02',
      icon: faDraftingCompass,
      title: 'Diseño de la solución',
      description:
        'Evaluamos el espacio y definimos la combinación ideal: alarmas, cámaras, seguimiento vehicular, protección perimetral y control de accesos. Cada proyecto se adapta al cliente.',
      highlight: 'A medida',
    },
    {
      id: 3,
      number: '03',
      icon: faScrewdriverWrench,
      title: 'Instalación profesional',
      description:
        'Nuestros técnicos instalan los equipos y dejan todo funcionando. Configuramos cada sistema para que puedas usarlo de forma simple desde el primer día.',
      highlight: 'Operativo desde el día 1',
    },
    {
      id: 4,
      number: '04',
      icon: faTowerBroadcast,
      title: 'Monitoreo permanente',
      description:
        'Tu propiedad o vehículos pueden estar conectados a nuestra central de monitoreo. Detectamos eventos en tiempo real y activamos protocolos de seguridad cuando es necesario.',
      highlight: '24/7',
    },
    {
      id: 5,
      number: '05',
      icon: faCar,
      title: 'Móviles operativos en zona',
      description:
        'Contamos con móviles propios recorriendo distintas zonas de Tucumán. Actuamos rápidamente ante cualquier evento reportado por nuestros sistemas.',
      highlight: 'Respuesta rápida',
    },
    {
      id: 6,
      number: '06',
      icon: faMobileScreen,
      title: 'Control desde tu celular',
      description:
        'Accedé a tu sistema desde cualquier lugar: cámaras en tiempo real, alertas, control de accesos, monitoreo de vehículos e historial de eventos. Todo en una plataforma simple.',
      highlight: 'Desde cualquier lugar',
    },
  ];

  const scrollToHero = () => {
    const heroSection = document.querySelector('.hero-security');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleButtonClick = () => {
    // Eliminamos showToast() para que no aparezca el mensaje
    
    // Número de WhatsApp (formateado para URL)
    const phoneNumber = '5493813522339'; // Sin espacios ni guiones, con código de país
    
    // Mensaje predefinido (codificado para URL)
    const message = encodeURIComponent('Hola, quisiera solicitar asesoramiento sobre sistemas de seguridad.');
    
    // Crear URL de WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    // Abrir WhatsApp en una nueva pestaña
    window.open(whatsappUrl, '_blank');
    
    // Mantenemos el scroll si es necesario
    scrollToHero();
  };

  return (
    <section className="how-it-works">
      {/* Eliminamos <Toaster /> ya no es necesario */}
      
      <div className="how-it-works-wrapper" id="como-funciona">
        {/* Header */}
        <div className="how-it-works-header">
          <div className="header-content">
            <h2 className="section-title-how">
              Cómo funciona nuestro{' '}
              <span className="gradient-text">sistema de seguridad</span>
            </h2>
            <p className="section-subtitle">
              Un proceso claro que combina tecnología, monitoreo profesional y
              respuesta operativa para proteger lo que más importa.
            </p>
          </div>
        </div>

        {/* Steps — 3 + 3 */}
        <div className="steps-container-how">
          <div className="steps-grid-how steps-grid--3col-how">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`step-item ${activeStep === step.id ? 'active' : ''}`}
                onMouseEnter={() => setActiveStep(step.id)}
                onMouseLeave={() => setActiveStep(null)}
              >
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

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-content">
            <h3 className="cta-title">
              Protegé lo que más importa con soluciones de seguridad profesionales
            </h3>
            <p className="cta-subtitle">
              Nuestro equipo te asesora sin compromiso
            </p>
            <button className="cta-button" onClick={handleButtonClick}>
              <span>Solicitar asesoramiento</span>
              <svg
                className="arrow-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksHome;