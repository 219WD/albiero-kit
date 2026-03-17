// FAQGps.jsx
import React, { useState, useRef } from 'react';
import './FAQGps.css';
import { gsap } from 'gsap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronDown, 
  faChevronRight,
  faQuestionCircle 
} from '@fortawesome/free-solid-svg-icons';

const FAQGps = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const contentRefs = useRef([]);

  const faqData = [
    {
      id: 1,
      question: "¿Tengo que comprar el equipo GPS?",
      answer: "No. Instalamos el equipo en comodato. Solo pagás el servicio mensual, sin inversión inicial."
    },
    {
      id: 2,
      question: "¿Dónde puedo ver la información del vehículo?",
      answer: "Desde tu celular o computadora a través de la plataforma de monitoreo, en cualquier momento y desde cualquier lugar."
    },
    {
      id: 3,
      question: "¿Puedo ver recorridos anteriores?",
      answer: "Sí. El sistema guarda historial completo de trayectos y paradas para que puedas consultarlo cuando quieras."
    },
    {
      id: 4,
      question: "¿Puedo controlar más de un vehículo?",
      answer: "Sí. La plataforma permite gestionar múltiples vehículos desde una sola cuenta, ideal para empresas y flotas."
    },
    {
      id: 5,
      question: "¿Cuánto tarda la instalación?",
      answer: "Coordinamos instalación con nuestros técnicos y el equipo queda funcionando en poco tiempo, sin obras ni modificaciones en el vehículo."
    },
    {
      id: 6,
      question: "¿Albiero recupera el vehículo si me lo roban?",
      answer: "No. Nuestro dispositivo es exclusivamente una herramienta de control y seguimiento. En caso de robo, la información de ubicación puede ser útil para que la Policía actúe, pero la recuperación del vehículo es responsabilidad de las fuerzas de seguridad, no de Albiero."
    },
    {
      id: 7,
      question: "¿Trabajan en mi zona?",
      answer: "Tenemos cobertura en distintas zonas de Tucumán. Seleccioná tu ubicación en el formulario de arriba y te confirmamos disponibilidad de inmediato."
    }
  ];

  const handleToggle = (index) => {
    const content = contentRefs.current[index];
    const isOpening = openIndex !== index;

    if (openIndex !== null && openIndex !== index) {
      const previousContent = contentRefs.current[openIndex];
      gsap.to(previousContent, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
        marginBottom: 0
      });
    }

    if (isOpening) {
      gsap.set(content, { height: 'auto', opacity: 1 });
      const height = content.offsetHeight;
      gsap.fromTo(
        content,
        { height: 0, opacity: 0, marginBottom: 0 },
        {
          height: height,
          opacity: 1,
          marginBottom: '1rem',
          duration: 0.5,
          ease: 'power3.out'
        }
      );
      setOpenIndex(index);
    } else {
      gsap.to(content, {
        height: 0,
        opacity: 0,
        marginBottom: 0,
        duration: 0.4,
        ease: 'power2.inOut'
      });
      setOpenIndex(null);
    }
  };

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    const mensaje = "Tengo otra consulta relacionada con el servicio de monitoreo GPS";
    const numero = '5493813522339';
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <section className="faq-section">
      <div className="faq-container" id='preguntas-frecuentes'>
        
        {/* Header */}
        <div className="faq-header">
          <div className="faq-badge">
            <FontAwesomeIcon icon={faQuestionCircle} className="faq-badge-icon" />
            <span>PREGUNTAS FRECUENTES</span>
          </div>
          <h2 className="faq-title">
            Todo lo que necesitás <span className="faq-gradient-text">saber</span>
          </h2>
          <p className="faq-subtitle">
            Resolvé tus dudas sobre nuestro servicio de monitoreo GPS
          </p>
        </div>

        {/* FAQ List */}
        <div className="faq-list">
          {faqData.map((item, index) => (
            <div 
              key={item.id} 
              className={`faq-item ${openIndex === index ? 'active' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => handleToggle(index)}
              >
                <span className="faq-question-text">{item.question}</span>
                <FontAwesomeIcon 
                  icon={openIndex === index ? faChevronDown : faChevronRight}
                  className="faq-question-icon"
                />
              </button>

              <div
                ref={(el) => (contentRefs.current[index] = el)}
                className="faq-answer"
                style={{ height: 0, opacity: 0, overflow: 'hidden' }}
              >
                <div className="faq-answer-content">
                  <p>{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="faq-footer">
          <p className="faq-footer-text">
            ¿Tenés otra pregunta?{' '}
            <a 
              href="#" 
              className="faq-footer-link"
              onClick={handleWhatsAppClick}
            >
              Contactanos
            </a>
          </p>
        </div>

      </div>
    </section>
  );
};

export default FAQGps;