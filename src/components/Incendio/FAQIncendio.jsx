// FAQIncendio.jsx
import React, { useState, useRef } from 'react';
import './FAQIncendio.css';
import { gsap } from 'gsap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronRight,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';

const FAQIncendio = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const contentRefs = useRef([]);

  const faqData = [
    {
      id: 1,
      question: '¿Qué detectan los sensores?',
      answer:
        'Dependiendo del sistema, pueden detectar humo, presencia de gas o aumentos anormales de temperatura.',
    },
    {
      id: 2,
      question: '¿Recibo avisos en el celular?',
      answer:
        'Sí. El sistema envía alertas en tiempo real ante cualquier evento detectado, directamente en tu dispositivo.',
    },
    {
      id: 3,
      question: '¿Funcionan si no hay nadie en la propiedad?',
      answer:
        'Sí. El sistema trabaja de forma automática las 24 horas, sin necesidad de presencia humana.',
    },
    {
      id: 4,
      question: '¿Se pueden instalar en cualquier tipo de propiedad?',
      answer:
        'Sí. Los sistemas se adaptan tanto a viviendas como a comercios o instalaciones industriales.',
    },
    {
      id: 5,
      question: '¿Trabajan en mi zona?',
      answer:
        'Brindamos cobertura en San Miguel de Tucumán, Yerba Buena, Tafí Viejo, Tafí del Valle, El Mollar y zonas cercanas. Seleccioná tu ubicación arriba y confirmamos disponibilidad.',
    },
  ];

  const handleToggle = (index) => {
    const content    = contentRefs.current[index];
    const isOpening  = openIndex !== index;

    if (openIndex !== null && openIndex !== index) {
      const previousContent = contentRefs.current[openIndex];
      gsap.to(previousContent, {
        height:       0,
        opacity:      0,
        duration:     0.4,
        ease:         'power2.inOut',
        marginBottom: 0,
      });
    }

    if (isOpening) {
      gsap.set(content, { height: 'auto', opacity: 1 });
      const height = content.offsetHeight;
      gsap.fromTo(
        content,
        { height: 0, opacity: 0, marginBottom: 0 },
        { height, opacity: 1, marginBottom: '1rem', duration: 0.5, ease: 'power3.out' }
      );
      setOpenIndex(index);
    } else {
      gsap.to(content, {
        height:       0,
        opacity:      0,
        marginBottom: 0,
        duration:     0.4,
        ease:         'power2.inOut',
      });
      setOpenIndex(null);
    }
  };

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    const mensaje = 'Tengo otra consulta relacionada con el sistema de detección de incendios';
    const numero  = '5493813522339';
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <section className="faq-section">
      <div className="faq-container" id="preguntas-frecuentes">

        <div className="faq-header">
          <div className="faq-badge">
            <FontAwesomeIcon icon={faQuestionCircle} className="faq-badge-icon" />
            <span>PREGUNTAS FRECUENTES</span>
          </div>
          <h2 className="faq-title">
            Todo lo que necesitás <span className="faq-gradient-text">saber</span>
          </h2>
          <p className="faq-subtitle">
            Resolvé tus dudas sobre nuestro sistema de detección de incendios
          </p>
        </div>

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

        <div className="faq-footer">
          <p className="faq-footer-text">
            ¿Tenés otra pregunta?{' '}
            <a href="#" className="faq-footer-link" onClick={handleWhatsAppClick}>
              Contactanos
            </a>
          </p>
        </div>

      </div>
    </section>
  );
};

export default FAQIncendio;