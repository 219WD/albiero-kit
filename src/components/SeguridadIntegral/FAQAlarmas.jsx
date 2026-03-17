// FAQAlarmas.jsx
import React, { useState, useRef } from 'react';
import './FAQAlarmas.css';
import { gsap } from 'gsap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronRight,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';

const FAQAlarmas = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const contentRefs = useRef([]);

  const faqData = [
    {
      id: 1,
      question: '¿Tengo que comprar los equipos?',
      answer:
        'No. Instalamos el sistema en comodato. Pagás únicamente el servicio mensual.',
    },
    {
      id: 2,
      question: '¿Cuánto tarda la instalación?',
      answer:
        'Coordinamos visita técnica y, una vez aprobado, realizamos la instalación en pocos días.',
    },
    {
      id: 3,
      question: '¿Qué pasa si se corta la luz?',
      answer:
        'Los sistemas cuentan con baterías de respaldo para continuar funcionando ante cortes eléctricos.',
    },
    {
      id: 4,
      question: '¿El sistema funciona aunque no esté en la propiedad?',
      answer:
        'Sí. La alarma permanece activa y conectada a nuestra central de monitoreo las 24 horas.',
    },
    {
      id: 5,
      question: '¿Trabajan en mi zona?',
      answer:
        'Tenemos cobertura en San Miguel de Tucumán, Yerba Buena, Tafí Viejo, Tafí del Valle, El Mollar y zonas cercanas. Seleccioná tu ubicación arriba y confirmamos disponibilidad.',
    },
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
        height: 0,
        opacity: 0,
        marginBottom: 0,
        duration: 0.4,
        ease: 'power2.inOut',
      });
      setOpenIndex(null);
    }
  };

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    const mensaje = 'Tengo otra consulta relacionada con el servicio de alarmas monitoreadas';
    const numero = '5493813522339';
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <section className="faq-section">
      <div className="faq-container" id="preguntas-frecuentes">

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
            Resolvé tus dudas sobre nuestro servicio de alarmas monitoreadas
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

        {/* Footer */}
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

export default FAQAlarmas;