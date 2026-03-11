// FAQ.jsx
import React, { useState, useRef } from 'react';
import './FAQ.css';
import { gsap } from 'gsap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronRight,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import useToast from '../../hooks/useToast';
import { Toaster } from 'react-hot-toast';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const contentRefs = useRef([]);
  const { showToast } = useToast();

  const faqData = [
    {
      id: 1,
      question: '¿Qué tipo de servicios de seguridad ofrece Albiero?',
      answer:
        'Ofrecemos soluciones integrales que incluyen alarmas monitoreadas, cámaras de seguridad, seguimiento vehicular satelital, seguridad física con guardias, protección perimetral, sistemas contra incendios y desarrollo de proyectos inteligentes de seguridad. Cada solución puede adaptarse según el tipo de propiedad o necesidad del cliente.',
    },
    {
      id: 2,
      question: '¿Trabajan solo con empresas o también con casas particulares?',
      answer:
        'Trabajamos tanto con hogares como con comercios, empresas y flotas de vehículos. Nuestros sistemas se adaptan a distintos tipos de instalaciones, desde viviendas particulares hasta proyectos de seguridad más complejos.',
    },
    {
      id: 3,
      question: '¿En qué zonas trabajan?',
      answer:
        'Brindamos servicios en distintas zonas de Tucumán, incluyendo Yerba Buena, San Miguel de Tucumán, Tafí y zonas cercanas. Nuestro equipo puede confirmar disponibilidad según la ubicación de cada cliente.',
    },
    {
      id: 4,
      question: '¿Los sistemas se pueden controlar desde el celular?',
      answer:
        'Sí. Muchos de nuestros sistemas permiten monitorear y gestionar información desde el celular o la computadora. Dependiendo del servicio instalado, podés acceder a cámaras en tiempo real, recibir alertas de seguridad o controlar vehículos desde una plataforma digital.',
    },
    {
      id: 5,
      question: '¿Realizan asesoramiento antes de instalar un sistema?',
      answer:
        'Sí. Nuestro equipo analiza cada caso para recomendar la solución de seguridad más adecuada según el tipo de propiedad, los puntos de riesgo y las necesidades del cliente. Esto permite implementar sistemas realmente efectivos.',
    },
    {
      id: 6,
      question: '¿Cómo puedo solicitar información o asesoramiento?',
      answer:
        'Podés contactarnos directamente desde esta página o acceder a la sección del servicio que te interese. Nuestro equipo te brindará asesoramiento y te ayudará a encontrar la solución de seguridad adecuada.',
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
        {
          height: height,
          opacity: 1,
          marginBottom: '1rem',
          duration: 0.5,
          ease: 'power3.out',
        }
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

  const scrollToHero = () => {
    const heroSection = document.querySelector('.hero-security');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCtaClick = () => {
    showToast();
    scrollToHero();
  };

  return (
    <section className="faq-section">
      <Toaster />
      <div className="faq-container" id="preguntas-frecuentes">

        {/* Header */}
        <div className="faq-header">
          <div className="faq-badge">
            <FontAwesomeIcon icon={faQuestionCircle} className="faq-badge-icon" />
            <span>PREGUNTAS FRECUENTES</span>
          </div>
          <h2 className="faq-title">
            Preguntas <span className="faq-gradient-text">Frecuentes</span>
          </h2>
          <p className="faq-subtitle">
            Respondemos las dudas más comunes sobre nuestros servicios de seguridad
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
          <p className="faq-footer-title">¿Tenés otra consulta?</p>
          <p className="faq-footer-text">
            Nuestro equipo puede ayudarte a encontrar la mejor solución de seguridad para tu caso.
          </p>
          <button className="faq-cta-button" onClick={handleCtaClick}>
            <span>Solicitar asesoramiento</span>
            <svg
              className="faq-arrow-icon"
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
    </section>
  );
};

export default FAQ;