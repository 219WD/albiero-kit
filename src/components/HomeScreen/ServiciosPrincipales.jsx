// ServiciosPrincipales.jsx
import React, { useRef, useEffect } from "react";
import "./ServiciosPrincipales.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faVideo,
  faLocationDot,
  faShieldHalved,
  faFire,
  faShieldVirus,
  faArrowRight,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";

const servicios = [
  {
    id: 1,
    icon: faShieldVirus,
    tag: "Solución Completa",
    title: "Kit Alarma + Cámaras",
    description:
      "Sistema de seguridad integral que combina alarmas monitoreadas y videovigilancia en una sola solución.",
    detail:
      "Permite detectar eventos, visualizar lo que ocurre en tiempo real y contar con monitoreo profesional desde nuestras centrales de control.",
    cta: "Ver kit de alarma y cámaras",
    href: "kit-alarma-camara",
    featured: true,
  },
  {
    id: 2,
    icon: faBell,
    tag: "Residencial y Comercial",
    title: "Alarmas Monitoreadas",
    description:
      "Sistemas de alarma conectados a central de monitoreo que permiten detectar eventos en tiempo real y activar protocolos de respuesta.",
    detail: "Protección para casas y comercios con monitoreo permanente.",
    cta: "Ver servicio de alarmas monitoreadas",
    href: "alarmas",
  },
  {
    id: 3,
    icon: faVideo,
    tag: "Videovigilancia",
    title: "Cámaras de Seguridad",
    description:
      "Sistemas de videovigilancia que permiten ver y controlar tu propiedad desde el celular o computadora.",
    detail: "Grabación, monitoreo remoto y control visual en todo momento.",
    cta: "Ver sistemas de cámaras",
    href: "camaras",
  },
  {
    id: 4,
    icon: faLocationDot,
    tag: "GPS Vehicular",
    title: "Seguimiento Vehicular",
    description:
      "Seguimiento y Logística Vehicular para autos, camiones, motos y flotas vehiculares.",
    detail:
      "Ubicación en vivo, historial de recorridos, alertas inteligentes y control total desde el celular.",
    cta: "Ver seguimiento vehicular",
    href: "seguimiento-vehicular",
  },
  {
    id: 5,
    icon: faShieldHalved,
    tag: "Empresas y Propiedades",
    title: "Seguridad Integral",
    description:
      "Soluciones completas de protección física y electrónica para empresas y propiedades.",
    detail: null,
    bullets: [
      "Seguridad física con guardias",
      "Cercos eléctricos",
      "Barreras infrarrojas",
      "Control de accesos",
      "Protección perimetral",
    ],
    cta: "Ver soluciones de seguridad integral",
    href: "seguridad-integral",
  },
  {
    id: 6,
    icon: faFire,
    tag: "Prevención",
    title: "Sistemas de Incendio",
    description:
      "Sistemas de detección y prevención diseñados para proteger instalaciones ante eventos de incendio.",
    detail: "Sensores, alarmas y sistemas de detección temprana.",
    cta: "Ver sistemas contra incendios",
    href: "deteccion-incendios",
  },
  {
    id: 7,
    icon: faBuilding,
    tag: "Obras y Proyectos",
    title: "Seguridad en Obras",
    description:
      "Acompañamiento desde el inicio hasta la entrega con soluciones temporales y definitivas.",
    detail:
      "Equipos en comodato, monitoreo, controles, rondas y asesoramiento para cada etapa.",
    cta: "Ver seguridad en obras",
    href: "seguridad-en-obras",
  },
  {
    id: 8,
    icon: faVideo,
    tag: "Portería Virtual",
    title: "Albiero Tótem",
    description:
      "Portería virtual con operadores reales, cámaras, monitoreo y respaldo operativo.",
    detail: "Atención, control y seguridad las 24 horas para accesos.",
    cta: "Ver portería virtual",
    href: "totem",
  },
  {
    id: 9,
    icon: faShieldVirus,
    tag: "Accesos Inteligentes",
    title: "Control de Acceso",
    description:
      "Soluciones para administrar accesos de personas y vehículos mediante tecnología integrada.",
    detail: "Biometría, control facial, barreras vehiculares, molinetes y detectores.",
    cta: "Ver control de acceso",
    href: "control-de-acceso",
  },
  {
    id: 10,
    icon: faLocationDot,
    tag: "Mascotas",
    title: "Monitoreo de Mascotas",
    description:
      "Localización y monitoreo para conocer la ubicación de tu mascota desde el celular.",
    detail: "Seguimiento, alertas, zonas seguras, historial y cobertura nacional.",
    cta: "Ver monitoreo de mascotas",
    href: "monitoreo-de-mascotas",
  },
  {
    id: 11,
    icon: faShieldHalved,
    tag: "Countries y Perímetros",
    title: "Seguridad Perimetral",
    description:
      "Protección integral para barrios privados, countries y grandes perímetros.",
    detail:
      "Guardias, rondas, motos, barreras, accesos, cámaras y monitoreo.",
    cta: "Ver seguridad perimetral",
    href: "seguridad-perimetral",
  },
  {
    id: 12,
    icon: faBell,
    tag: "Guardias",
    title: "Seguridad Física",
    description:
      "Personal capacitado para proteger personas, instalaciones y operaciones.",
    detail: "Servicio presencial continuo o para eventos y situaciones específicas.",
    cta: "Ver seguridad física",
    href: "seguridad-fisica",
  },
  {
    id: 13,
    icon: faBuilding,
    tag: "Edificios",
    title: "Edificio Seguro",
    description:
      "Toda la seguridad del edificio conectada en una sola solución.",
    detail:
      "Portería virtual, monitoreo, control de accesos, emergencias, móviles y rondas.",
    cta: "Ver Edificio Seguro",
    href: "edificio-seguro",
  },
];

const ServiciosPrincipales = () => {
  const gridRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("sp-card--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const cards = gridRef.current?.querySelectorAll(".sp-card");
    cards?.forEach((card) => observer.observe(card));

    return () => cards?.forEach((card) => observer.unobserve(card));
  }, []);

  return (
    <section className="sp-section" id="servicios">
      {/* Header */}
      <div className="sp-header">
        <div className="sp-badge">
          <span>SERVICIOS PRINCIPALES</span>
        </div>
        <h2 className="sp-title">
          Soluciones integrales<br />
          <span className="sp-title-accent">de seguridad.</span>
        </h2>
        <p className="sp-subtitle">
          En Albiero desarrollamos distintos sistemas de protección para cubrir
          las necesidades de cada cliente.
        </p>
      </div>

      {/* Grid */}
      <div className="sp-grid" ref={gridRef}>
        {servicios.map((s, i) => (
          <div
            key={s.id}
            className={`sp-card${s.featured ? " sp-card--featured" : ""}`}
            style={{ "--delay": `${i * 0.08}s` }}
          >
            {s.featured && (
              <span className="sp-card-highlight-label">Destacado</span>
            )}

            {/* Icon */}
            <div className="sp-card-icon">
              <FontAwesomeIcon icon={s.icon} aria-hidden="true" />
            </div>

            {/* Tag */}
            <span className="sp-card-tag">{s.tag}</span>

            {/* Title */}
            <h3 className="sp-card-title">{s.title}</h3>

            {/* Description */}
            <p className="sp-card-desc">{s.description}</p>

            {/* Detail text OR bullets */}
            {s.bullets ? (
              <ul className="sp-card-bullets">
                {s.bullets.map((b, bi) => (
                  <li key={bi}>{b}</li>
                ))}
              </ul>
            ) : (
              s.detail && <p className="sp-card-detail">{s.detail}</p>
            )}

            {/* CTA */}
            <a href={s.href} className="sp-card-cta">
              <span>{s.cta}</span>
              <FontAwesomeIcon icon={faArrowRight} className="sp-card-cta-icon" aria-hidden="true" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiciosPrincipales;
