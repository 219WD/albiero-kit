import React, { useState, useEffect } from 'react';
import './HeroNavAlarmas.css';
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
  faPlayCircle,
  faMapMarkerAlt,
  faStar,
  faUser,
  faFileInvoiceDollar,
  faFireFlameCurved,
  faLayerGroup,
} from '@fortawesome/free-solid-svg-icons';
import LogoGrande from '../../assets/logo-grande.png';
import { useLocation } from 'react-router-dom';

const HeroNavAlarmas = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const location = useLocation();

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
    window.open('https://ws.albiero.com.ar/paga-tu-factura/', '_blank');
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
  };

  // ── CAMBIO 1: agregado Seguridad Integral ────────────────────────────────────
  const serviceLinks = [
    { name: 'Alarmas',                path: '/alarmas',               icon: faShieldAlt       },
    { name: 'Cámaras',                path: '/camaras',               icon: faVideo           },
    { name: 'Kit Alarma + Cámara',    path: '/kit-alarma-camara',     icon: faHome            },
    { name: 'Seguimiento Vehicular',  path: '/seguimiento-vehicular', icon: faCar             },
    { name: 'Deteccion de Incendios', path: '/deteccion-incendios',   icon: faFireFlameCurved },
    { name: 'Seguridad Integral',     path: '/seguridad-integral',    icon: faLayerGroup      },
  ];

  const generalLinks = [
    { name: 'Acceso a Clientes', type: 'external', icon: faUser,              highlight: true, action: openClientAccess },
    { name: 'Paga tu factura',   type: 'external', icon: faFileInvoiceDollar, highlight: true, action: openPayBill      },
    { name: 'Contacto',          type: 'hash',     hash: '#contacto',         icon: faPhone,   highlight: true          },
  ];

  const pageSpecificLinks = {
    '/alarmas': [
      { name: 'Configurar Sistema',   section: 'hero-security',        icon: faCog            },
      { name: 'Soluciones',           section: 'soluciones',           icon: faBuilding       },
      { name: 'Cómo Funciona',        section: 'como-funciona',        icon: faPlayCircle     },
      { name: 'Preguntas Frecuentes', section: 'preguntas-frecuentes', icon: faQuestionCircle },
    ],
    '/camaras': [
      { name: 'Configurar Sistema',   section: 'hero-camaras',            icon: faCog            },
      { name: 'Beneficios',           section: 'beneficios-camaras',      icon: faChartLine      },
      { name: 'Soluciones',           section: 'tipos-camaras',           icon: faBuilding       },
      { name: 'Acerca de',            section: 'acerca-de',               icon: faInfoCircle     },
      { name: 'Cómo Funciona',        section: 'como-funciona-camaras',   icon: faPlayCircle     },
      { name: 'Preguntas Frecuentes', section: 'faq-camaras',             icon: faQuestionCircle },
    ],
    '/kit-alarma-camara': [
      { name: 'Configurar Sistema',   section: 'hero-kit',             icon: faCog            },
      { name: 'Beneficios',           section: 'beneficios-kit',       icon: faChartLine      },
      { name: 'Soluciones',           section: 'componentes',          icon: faBuilding       },
      { name: 'Acerca de',            section: 'acerca-de',            icon: faInfoCircle     },
      { name: 'Cómo Funciona',        section: 'como-funciona-kit',    icon: faPlayCircle     },
      { name: 'Preguntas Frecuentes', section: 'faq-kit',              icon: faQuestionCircle },
    ],
    '/seguimiento-vehicular': [
      { name: 'Configurar Sistema',   section: 'hero-gps',             icon: faCog            },
      { name: 'Beneficios',           section: 'beneficios-gps',       icon: faChartLine      },
      { name: 'Soluciones',           section: 'planes',               icon: faBuilding       },
      { name: 'Acerca de',            section: 'acerca-de',            icon: faInfoCircle     },
      { name: 'Cómo Funciona',        section: 'como-funciona-gps',    icon: faPlayCircle     },
      { name: 'Preguntas Frecuentes', section: 'faq-gps',              icon: faQuestionCircle },
    ],
    '/deteccion-incendios': [
      { name: 'Configurar Sistema',   section: 'hero-incendios',          icon: faCog            },
      { name: 'Beneficios',           section: 'beneficios-incendios',    icon: faChartLine      },
      { name: 'Soluciones',           section: 'sistemas-deteccion',      icon: faBuilding       },
      { name: 'Acerca de',            section: 'acerca-de',               icon: faInfoCircle     },
      { name: 'Cómo Funciona',        section: 'como-funciona-incendios', icon: faPlayCircle     },
      { name: 'Preguntas Frecuentes', section: 'faq-incendios',           icon: faQuestionCircle },
    ],
    '/seguridad-integral': [
      { name: 'Configurar Sistema',   section: 'hero-security',        icon: faCog            },
      { name: 'Beneficios',           section: 'beneficios',           icon: faChartLine      },
      { name: 'Soluciones',           section: 'soluciones',           icon: faBuilding       },
      { name: 'Acerca de',            section: 'acerca-de',            icon: faInfoCircle     },
      { name: 'Cómo Funciona',        section: 'como-funciona',        icon: faPlayCircle     },
      { name: 'Preguntas Frecuentes', section: 'preguntas-frecuentes', icon: faQuestionCircle },
    ],
  };

  const currentPageLinks = pageSpecificLinks[location.pathname] || [];

  return (
    <nav className="hn">
      <div className="hn__container">
        {/* ── CAMBIO 2: logo navega a / ─────────────────────────────────────────── */}
        <div
          className="hn__logo"
          onClick={() => window.location.href = '/'}
          role="button"
          tabIndex={0}
          aria-label="Ir al inicio"
          onKeyDown={(e) => e.key === 'Enter' && (window.location.href = '/')}
        >
          <img src={LogoGrande} alt="Albiero Seguridad" className="hn__logo-img" width="120" height="45" />
        </div>

        {/* Desktop Navigation */}
        <div className="hn__links">
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

          {generalLinks.map((link, index) => (
            <button
              key={`general-${index}`}
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
                opacity:   mobileServicesOpen ? 1 : 0,
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

          {generalLinks.map((link, index) => (
            <button
              key={`mobile-general-${index}`}
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

export default HeroNavAlarmas;