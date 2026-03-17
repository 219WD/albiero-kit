// FAQSeguridadIntegral.jsx
import React, { useState, useRef } from 'react';
import './FAQSeguridadIntegral.css';
import { gsap } from 'gsap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronRight,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';

const FAQSeguridadIntegral = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const contentRefs = useRef([]);

  const faqData = [
    {
      id: 1,
      question: '¿La solución se adapta a cada propiedad?',
      answer:
        'Sí. Realizamos un análisis previo para diseñar un sistema acorde al tamaño, actividad y nivel de riesgo de cada espacio.',
    },
    {
      id: 2,
      question: '¿Pueden combinar guardias con tecnología?',
      answer:
        'Sí. Podemos integrar seguridad física con sistemas electrónicos para lograr una protección más completa y eficiente.',
    },
    {
      id: 3,
      question: '¿Instalan protección perimetral?',
      answer:
        'Sí. Incluye cercos eléctricos, barreras infrarrojas y control de accesos según el caso y las características del terreno.',
    },
    {
      id: 4,
      question: '¿Trabajan con empresas grandes?',
      answer:
        'Sí. Tenemos experiencia en predios industriales, depósitos y propiedades extensas con necesidades de seguridad complejas.',
    },
    {
      id: 5,
      question: '¿Brindan cobertura en mi zona?',
      answer:
        'Trabajamos en San Miguel de Tucumán, Yerba Buena, Tafí Viejo, Tafí del Valle, El Mollar y alrededores. Seleccioná tu ubicación arriba y confirmamos disponibilidad.',
    },
  ];

  const handleToggle = (index) => {
    const content   = contentRefs.current[index];
    const isOpening = openIndex !== index;

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
    const mensaje = 'Tengo otra consulta relacionada con el sistema de seguridad integral';
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
            Resolvé tus dudas sobre nuestras soluciones de seguridad integral
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

export default FAQSeguridadIntegral;