// HeroNav.jsx
import React, { useState } from 'react';
import './HeroNav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPhone,
  faTimes,
  faShieldHeart
} from '@fortawesome/free-solid-svg-icons';
import LogoGrande from '../assets/logo-grande.png';

const HeroNav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Configurar Sistema',     section: 'hero-formulario',       icon: null },
    { name: 'Beneficios',             section: 'beneficios',             icon: null },
    { name: 'Soluciones',             section: 'soluciones',             icon: null },
    { name: 'Acerca de',              section: 'acerca-de',              icon: null },
    { name: 'Cómo Funciona',          section: 'como-funciona',          icon: null },
    { name: 'Preguntas Frecuentes',   section: 'preguntas-frecuentes',   icon: null },
    { name: 'Protege tu Hogar',       section: 'protege-tu-hogar',       icon: faShieldHeart, highlight: true },
    { name: 'Contacto',               section: 'contacto',               icon: faPhone,       highlight: true },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="hero-nav">
      <div className="hero-nav-container">

        {/* Logo */}
        <div
          className="hero-nav-logo"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          role="button"
          tabIndex={0}
          aria-label="Ir al inicio"
          onKeyDown={(e) => e.key === 'Enter' && window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img
            src={LogoGrande}
            alt="Albiero Seguridad"
            className="hero-nav-logo-img"
            width="120"
            height="45"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hero-nav-links">
          {navLinks.map((link, index) => (
            <button
              key={index}
              className={`hero-nav-link ${link.highlight ? 'hero-nav-link-highlight' : ''}`}
              onClick={() => scrollToSection(link.section)}
            >
              {link.icon && (
                <FontAwesomeIcon
                  icon={link.icon}
                  className="hero-nav-link-icon"
                  aria-hidden="true"
                />
              )}
              <span>{link.name}</span>
            </button>
          ))}
        </div>

        {/* Mobile Menu Button — hamburguesa */}
        <button
          className={`hero-nav-mobile-button ${mobileMenuOpen ? 'open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={mobileMenuOpen}
          aria-controls="hero-nav-mobile-menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`hero-nav-mobile-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu */}
      <div
        id="hero-nav-mobile-menu"
        className={`hero-nav-mobile ${mobileMenuOpen ? 'open' : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Botón cerrar — el que Lighthouse marcaba sin nombre */}
        <button
          className="hero-nav-mobile-close"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Cerrar menú de navegación"
        >
          <FontAwesomeIcon icon={faTimes} aria-hidden="true" />
        </button>

        <div className="hero-nav-mobile-links">
          {navLinks.map((link, index) => (
            <button
              key={index}
              className={`hero-nav-mobile-link ${link.highlight ? 'hero-nav-mobile-link-highlight' : ''}`}
              onClick={() => scrollToSection(link.section)}
            >
              {link.icon && (
                <FontAwesomeIcon
                  icon={link.icon}
                  className="hero-nav-mobile-link-icon"
                  aria-hidden="true"
                />
              )}
              <span>{link.name}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default HeroNav;