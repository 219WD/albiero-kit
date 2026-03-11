// ComodatoBeneficios.jsx
import React, { useRef, useEffect } from 'react';
import './ComodatoBeneficios.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBoxOpen,
  faChartBar,
  faCheckCircle,
  faRoute,
  faClock,
  faLocationCrosshairs,
  faGaugeHigh,
  faBriefcase,
} from '@fortawesome/free-solid-svg-icons';

const comodatoItems = [
  { icon: faBoxOpen,           text: 'Sin inversión inicial grande' },
  { icon: faBriefcase,         text: 'El equipo queda a cargo de la empresa' },
  { icon: faCheckCircle,       text: 'Pagás únicamente el servicio mensual' },
];

const beneficiosItems = [
  { icon: faRoute,             text: 'Optimizar recorridos' },
  { icon: faClock,             text: 'Reducir tiempos improductivos' },
  { icon: faLocationCrosshairs,text: 'Detectar desvíos innecesarios' },
  { icon: faGaugeHigh,         text: 'Controlar uso fuera de horario' },
  { icon: faChartBar,          text: 'Mejorar eficiencia operativa' },
];

const ComodatoBeneficios = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('cb-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  return (
    <section className="cb-section" ref={sectionRef}>
      {/* Decorative background lines */}
      <div className="cb-bg-lines" aria-hidden="true">
        <span /><span /><span /><span />
      </div>

      <div className="cb-container">

        {/* ── COMODATO card ── */}
        <div className="cb-card cb-card--comodato">
          <div className="cb-card-eyebrow">
            <span className="cb-pill">💡 COMODATO</span>
          </div>

          <h2 className="cb-card-title">
            Sin inversión<br />
            <em>inicial.</em>
          </h2>

          <p className="cb-card-lead">
            No necesitás comprar equipos. Instalamos el dispositivo GPS en comodato.
          </p>

          <ul className="cb-list">
            {comodatoItems.map((item, i) => (
              <li key={i} className="cb-list-item" style={{ '--i': i }}>
                <span className="cb-list-icon">
                  <FontAwesomeIcon icon={item.icon} />
                </span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>

          <p className="cb-card-footer-text">
            Una forma simple y accesible de empezar a monitorear tu vehículo hoy mismo.
          </p>

          {/* decorative number */}
          <span className="cb-deco-number" aria-hidden="true">01</span>
        </div>

        {/* ── Divider ── */}
        <div className="cb-divider" aria-hidden="true">
          <div className="cb-divider-line" />
          <div className="cb-divider-dot" />
          <div className="cb-divider-line" />
        </div>

        {/* ── BENEFICIOS card ── */}
        <div className="cb-card cb-card--beneficios">
          <div className="cb-card-eyebrow">
            <span className="cb-pill cb-pill--alt">📊 EMPRESAS</span>
          </div>

          <h2 className="cb-card-title">
            Decisiones basadas<br />
            <em>en datos reales.</em>
          </h2>

          <p className="cb-card-lead">
            Con seguimiento satelital podés:
          </p>

          <ul className="cb-list cb-list--checks">
            {beneficiosItems.map((item, i) => (
              <li key={i} className="cb-list-item" style={{ '--i': i }}>
                <span className="cb-list-icon cb-list-icon--check">
                  <FontAwesomeIcon icon={item.icon} />
                </span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>

          <p className="cb-card-footer-text cb-card-footer-text--highlight">
            La información correcta permite tomar mejores decisiones.
          </p>

          {/* decorative number */}
          <span className="cb-deco-number" aria-hidden="true">02</span>
        </div>

      </div>
    </section>
  );
};

export default ComodatoBeneficios;