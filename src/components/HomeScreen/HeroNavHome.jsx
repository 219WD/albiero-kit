import React, { useState } from 'react';
import './HeroNavHome.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhone,
  faTimes,
  faShieldHeart,
  faChevronDown,
  faShieldAlt,
  faVideo,
  faHome,
  faCar,
  faQuestionCircle,
  faMapMarkerAlt,
  faStar,
  faPlayCircle,
  faInfoCircle,
  faUser,
  faFileInvoiceDollar
} from '@fortawesome/free-solid-svg-icons';
import LogoGrande from '../../assets/logo-grande.png';

const HeroNavHome = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const scrollToHash = (hash) => {
    const element = document.querySelector(hash);
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

  const openClientAccess = () => {
    window.open('https://clientes.albieroseguridad.com.ar:14443/welcome.php', '_blank');
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
  };

  const openPayBill = () => {
    window.open('https://albiero.com.ar/paga-tu-factura/', '_blank');
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
  };

  // Servicios CON ICONOS
  const serviceLinks = [
    { name: 'Alarmas', path: '/alarmas', icon: faShieldAlt },
    { name: 'Cámaras', path: '/camaras', icon: faVideo },
    { name: 'Kit Alarma + Cámara', path: '/kit-alarma-camara', icon: faHome },
    { name: 'Seguimiento Vehicular', path: '/seguimiento-vehicular', icon: faCar },
  ];

  // Links de navegación CON ICONOS (AHORA CON ACCESO A CLIENTES Y PAGA TU FACTURA)
  const navLinks = [
    { name: '¿Por qué Albiero?', type: 'hash', hash: '#por-que-albiero', icon: faStar },
    { name: 'Cobertura', type: 'hash', hash: '#cobertura', icon: faMapMarkerAlt },
    { name: 'Cómo Funciona', type: 'hash', hash: '#como-funciona', icon: faPlayCircle },
    { name: 'Preguntas Frecuentes', type: 'hash', hash: '#preguntas-frecuentes', icon: faQuestionCircle },
    { name: 'Acceso a Clientes', type: 'external', icon: faUser, highlight: true, action: openClientAccess },
    { name: 'Paga tu factura', type: 'external', icon: faFileInvoiceDollar, highlight: true, action: openPayBill },
    { name: 'Contacto', type: 'hash', hash: '#contacto', icon: faPhone, highlight: true },
  ];

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

          {/* Dropdown Servicios con iconos */}
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
                  <FontAwesomeIcon icon={service.icon} className="hn__dropdown-item-icon" />
                  <span>{service.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Links normales con iconos */}
          {navLinks.map((link, index) => (
            <button
              key={index}
              className={`hn__link${link.highlight ? ' hn__link--highlight' : ''}`}
              onClick={() => link.type === 'external' ? link.action() : scrollToHash(link.hash)}
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

          {/* Acordeón Servicios con iconos */}
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
                  <FontAwesomeIcon icon={service.icon} className="hn__sub-link-icon" />
                  <span>{service.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Resto de links con iconos */}
          {navLinks.map((link, index) => (
            <button
              key={index}
              className={`hn__mobile-link${link.highlight ? ' hn__mobile-link--highlight' : ''}`}
              onClick={() => link.type === 'external' ? link.action() : scrollToHash(link.hash)}
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

export default HeroNavHome;