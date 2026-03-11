import React, { useState, useEffect } from 'react';
import './HeroNav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhone,
  faTimes,
  faShieldHeart,
  faChevronDown,
  faHome,
  faBuilding,
  faCar,
  faVideo,
  faShieldAlt,
  faCog,
  faChartLine,
  faQuestionCircle,
  faInfoCircle,
  faPlayCircle
} from '@fortawesome/free-solid-svg-icons';
import LogoGrande from '../../assets/logo-grande.png';
import { useLocation } from 'react-router-dom';

const HeroNav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const location = useLocation();

  // Cerrar menú al cambiar de página
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
  }, [location]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
  };

  const navigateTo = (path) => {
    window.location.href = path;
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
  };

  // Links de servicios para el dropdown
  const serviceLinks = [
    { name: 'Alarmas', path: '/alarmas', icon: faShieldAlt },
    { name: 'Cámaras', path: '/camaras', icon: faVideo },
    { name: 'Kit Alarma + Cámara', path: '/kit-alarma-camara', icon: faHome },
    { name: 'Seguimiento Vehicular', path: '/seguimiento-vehicular', icon: faCar },
  ];

  // Links generales (solo los que quieres)
  const generalLinks = [
    { name: 'Protege tu Hogar', type: 'hash', hash: '#protege-tu-hogar', icon: faShieldHeart, highlight: true },
    { name: 'Contacto', type: 'hash', hash: '#contacto', icon: faPhone, highlight: true },
  ];

  // Links específicos por página
  const pageSpecificLinks = {
    '/alarmas': [
      { name: 'Configurar Sistema', section: 'hero-security', icon: faCog },
      { name: 'Beneficios', section: 'beneficios', icon: faChartLine },
      { name: 'Soluciones', section: 'soluciones', icon: faBuilding },
      { name: 'Acerca de', section: 'acerca-de', icon: faInfoCircle },
      { name: 'Cómo Funciona', section: 'como-funciona', icon: faPlayCircle },
      { name: 'Preguntas Frecuentes', section: 'preguntas-frecuentes', icon: faQuestionCircle },
    ],
    '/camaras': [
      { name: 'Configurar Sistema', section: 'hero-camaras', icon: faCog },
      { name: 'Beneficios', section: 'beneficios-camaras', icon: faChartLine },
      { name: 'Soluciones', section: 'tipos-camaras', icon: faBuilding },
      { name: 'Acerca de', section: 'acerca-de', icon: faInfoCircle },
      { name: 'Cómo Funciona', section: 'como-funciona-camaras', icon: faPlayCircle },
      { name: 'Preguntas Frecuentes', section: 'faq-camaras', icon: faQuestionCircle },
    ],
    '/kit-alarma-camara': [
      { name: 'Configurar Sistema', section: 'hero-kit', icon: faCog },
      { name: 'Beneficios', section: 'beneficios-kit', icon: faChartLine },
      { name: 'Soluciones', section: 'componentes', icon: faBuilding },
      { name: 'Acerca de', section: 'acerca-de', icon: faInfoCircle },
      { name: 'Cómo Funciona', section: 'como-funciona-kit', icon: faPlayCircle },
      { name: 'Preguntas Frecuentes', section: 'faq-kit', icon: faQuestionCircle },
    ],
    '/seguimiento-vehicular': [
      { name: 'Configurar Sistema', section: 'hero-gps', icon: faCog },
      { name: 'Beneficios', section: 'beneficios-gps', icon: faChartLine },
      { name: 'Soluciones', section: 'planes', icon: faBuilding },
      { name: 'Acerca de', section: 'acerca-de', icon: faInfoCircle },
      { name: 'Cómo Funciona', section: 'como-funciona-gps', icon: faPlayCircle },
      { name: 'Preguntas Frecuentes', section: 'faq-gps', icon: faQuestionCircle },
    ],
  };

  // Obtener links específicos de la página actual
  const currentPageLinks = pageSpecificLinks[location.pathname] || [];

  // Combinar todos los links para mobile (SOLO servicios + pageSpecific + generales)
  const allMobileLinks = [
    ...serviceLinks,
    ...currentPageLinks,
    ...generalLinks,
  ];

  const scrollToHash = (hash) => {
    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
  };

  return (
    <nav className="hn">
      <div className="hn__container">

        {/* Logo */}
        <div
          className="hn__logo"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          role="button"
          tabIndex={0}
          aria-label="Ir al inicio"
          onKeyDown={(e) => e.key === 'Enter' && window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img src={LogoGrande} alt="Albiero Seguridad" className="hn__logo-img" width="120" height="45" />
        </div>

        {/* Desktop Navigation */}
        <div className="hn__links">

          {/* Dropdown Servicios — siempre visible */}
          <div className="hn__dropdown">
            <button className="hn__link hn__link--dropdown">
              <span>Servicios</span>
              <FontAwesomeIcon icon={faChevronDown} className="hn__chevron" aria-hidden="true" />
            </button>
            <div className="hn__dropdown-panel">
              <div className="hn__dropdown-arrow" />
              {serviceLinks.map((service, i) => (
                <button
                  key={i}
                  className="hn__dropdown-item"
                  onClick={() => navigateTo(service.path)}
                >
                  {service.icon && (
                    <FontAwesomeIcon icon={service.icon} className="hn__dropdown-item-icon" />
                  )}
                  <span>{service.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Links específicos de la página actual (sin Servicios repetidos) */}
          {currentPageLinks.map((link, index) => (
            <button
              key={`page-${index}`}
              className="hn__link"
              onClick={() => scrollToSection(link.section)}
            >
              {link.icon && <FontAwesomeIcon icon={link.icon} className="hn__link-icon" aria-hidden="true" />}
              <span>{link.name}</span>
            </button>
          ))}

          {/* Links generales (Protege tu Hogar y Contacto) */}
          {generalLinks.map((link, index) => (
            <button
              key={`general-${index}`}
              className={`hn__link${link.highlight ? ' hn__link--highlight' : ''}`}
              onClick={() => scrollToHash(link.hash)}
            >
              {link.icon && <FontAwesomeIcon icon={link.icon} className="hn__link-icon" aria-hidden="true" />}
              <span>{link.name}</span>
            </button>
          ))}
        </div>

        {/* Hamburguesa */}
        <button
          className={`hn__burger${mobileMenuOpen ? ' open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={mobileMenuOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Overlay */}
      <div
        className={`hn__overlay${mobileMenuOpen ? ' open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu */}
      <div className={`hn__mobile${mobileMenuOpen ? ' open' : ''}`} aria-hidden={!mobileMenuOpen}>
        <button className="hn__mobile-close" onClick={() => setMobileMenuOpen(false)} aria-label="Cerrar menú">
          <FontAwesomeIcon icon={faTimes} aria-hidden="true" />
        </button>

        <div className="hn__mobile-links">

          {/* Acordeón Servicios en móvil */}
          <div className="hn__accordion">
            <button
              className={`hn__mobile-link hn__accordion-trigger${mobileServicesOpen ? ' open' : ''}`}
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              aria-expanded={mobileServicesOpen}
            >
              <span>Servicios</span>
              <FontAwesomeIcon 
                icon={faChevronDown} 
                className={`hn__chevron hn__chevron--mobile ${mobileServicesOpen ? 'open' : ''}`} 
                aria-hidden="true" 
              />
            </button>
            <div 
              className={`hn__accordion-panel${mobileServicesOpen ? ' open' : ''}`}
              style={{
                maxHeight: mobileServicesOpen ? `${serviceLinks.length * 48}px` : '0',
                opacity: mobileServicesOpen ? 1 : 0
              }}
            >
              {serviceLinks.map((service, i) => (
                <button 
                  key={i} 
                  className="hn__sub-link" 
                  onClick={() => navigateTo(service.path)}
                >
                  {service.icon && (
                    <FontAwesomeIcon icon={service.icon} className="hn__sub-link-icon" />
                  )}
                  <span>{service.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Links específicos de la página en móvil */}
          {currentPageLinks.map((link, index) => (
            <button
              key={`mobile-page-${index}`}
              className="hn__mobile-link"
              onClick={() => scrollToSection(link.section)}
            >
              {link.icon && <FontAwesomeIcon icon={link.icon} className="hn__mobile-link-icon" aria-hidden="true" />}
              <span>{link.name}</span>
            </button>
          ))}

          {/* Links generales en móvil */}
          {generalLinks.map((link, index) => (
            <button
              key={`mobile-general-${index}`}
              className={`hn__mobile-link${link.highlight ? ' hn__mobile-link--highlight' : ''}`}
              onClick={() => scrollToHash(link.hash)}
            >
              {link.icon && <FontAwesomeIcon icon={link.icon} className="hn__mobile-link-icon" aria-hidden="true" />}
              <span>{link.name}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default HeroNav;