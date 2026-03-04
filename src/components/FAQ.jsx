// FAQ.jsx
import React, { useState, useRef } from 'react';
import './FAQ.css';
import { gsap } from 'gsap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronDown, 
  faChevronRight,
  faQuestionCircle 
} from '@fortawesome/free-solid-svg-icons';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const contentRefs = useRef([]);

  const faqData = [
    {
      id: 1,
      question: "¿Tengo que comprar los equipos?",
      answer: "No. Instalamos el sistema en comodato. Pagás solo el servicio mensual."
    },
    {
      id: 2,
      question: "¿Cuánto tarda la instalación?",
      answer: "Coordinamos visita técnica y, una vez aprobado, instalamos en pocos días."
    },
    {
      id: 3,
      question: "¿Puedo ver las cámaras desde el celular?",
      answer: "Sí. Accedés en tiempo real desde tu teléfono o computadora."
    },
    {
      id: 4,
      question: "¿Qué pasa si se corta la luz?",
      answer: "El sistema cuenta con baterías de respaldo para seguir funcionando."
    },
    {
      id: 5,
      question: "¿Trabajan en mi zona?",
      answer: "Tenemos cobertura en distintas zonas de Tucumán. Seleccioná tu ubicación arriba y te confirmamos disponibilidad inmediata."
    }
  ];

  const handleToggle = (index) => {
    const content = contentRefs.current[index];
    const isOpening = openIndex !== index;

    // Si hay uno abierto y no es el mismo, cerrarlo
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
      // Abrir el nuevo
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
      // Cerrar el actual
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
    const mensaje = "Tengo otra consulta relacionada con el Kit de Alarma más Cámara";
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
            Resolvé tus dudas sobre nuestro servicio de seguridad
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

        {/* Footer CTA - MODIFICADO para WhatsApp sin icono */}
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

export default FAQ;